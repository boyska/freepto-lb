/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2008-2009 David Cancel
 * Copyright (C) 2009-2012 Evidon, Inc.
 * @author Felix Shnir
 * @author David Cancel
 * @copyright Copyright (C) 2008-2009 David Cancel <dcancel@dcancel.com>
 * @copyright Copyright (C) 2009-2012 Evidon, Inc.
 */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);

var log = function(msg) {
  consoleService = Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService);
  consoleService.logStringMessage(msg);
}

function GhosteryContentPolicy() {
  this.resources = {};
  loader = Cc["@mozilla.org/moz/jssubscript-loader;1"].getService(Ci.mozIJSSubScriptLoader);
  loader.loadSubScript("chrome://ghostery/content/ghostery-common.js", this.resources);
  loader.loadSubScript("chrome://ghostery/content/ghostery-db.js", this.resources);
  this.resources.ghostery.prefs.startup();

	/* reset blockingLog */
	this.resources.ghostery.prefs.set('blockingLog', '');
}

GhosteryContentPolicy.prototype = {
	scannedSchemes: ['http', 'https'],

	shouldBlock: function(host, url) {
		var defaultBugs = this.resources.ghostery.db.bugs,
		 defaultPartial = this.resources.ghostery.db.partialRegex,
		 userSiteSelections, i, j;

		url = url.toLowerCase();

		if (host) {
			// see if there is a list for this host
			var bw = wm.getMostRecentWindow("navigator:browser");
			userSiteSelections = bw.ghostery.prefs.getWhitelistedDatabase(host);

			if (userSiteSelections) {
				defaultPartial = [];

				for (i = 0; i < this.resources.ghostery.db.partialBugs.length; i++) {
					j = this.resources.ghostery.db.partialBugs[i];

					if (userSiteSelections.allow.indexOf(parseInt(j.id, 10)) === -1) {
						defaultPartial.push(j.pattern);
					}
				}

				defaultPartial = new RegExp(defaultPartial.join('|'), 'i');
			}
		}

		for (var id in defaultBugs) {
			if ( this.resources.ghostery.prefs.shouldBlockBug(defaultBugs[id].aid, userSiteSelections) ) {
				if (!defaultBugs[id].simple) {
					continue;
				}

				for (var i = 0; i < defaultBugs[id].simple.length; i++) {
					if (defaultBugs[id].simple[i] != '') {
						if (url.indexOf(defaultBugs[id].simple[i]) >= 0) {
							return true;
						}
					}
				}
			}
		}

		// TODO: this needs to be updated in some way for userSiteSelections.
		if (defaultPartial) {
			return (defaultPartial.test(url));
		}

		return false;
	},

// See http://mxr.mozilla.org/mozilla1.9.1/source/content/base/public/nsIContentPolicy.idl

	shouldLoad: function(contentType, contentLocation, requestOrigin, context, mimeTypeGuess, extra) {
		if (!(this.scannedSchemes.indexOf(contentLocation.scheme) >= 0)) {
			return Ci.nsIContentPolicy.ACCEPT;
		}

		var cp = {}, prefs = this.resources.ghostery.prefs;

		// Check 'Performance Options'
		if (!prefs.blockImage && contentType === Ci.nsIContentPolicy.TYPE_IMAGE) {
			return Ci.nsIContentPolicy.ACCEPT;
		}

		if (!prefs.blockFrame && contentType === Ci.nsIContentPolicy.TYPE_SUBDOCUMENT) {
			return Ci.nsIContentPolicy.ACCEPT;
		}

		if (!prefs.blockObject && ( contentType === Ci.nsIContentPolicy.TYPE_OBJECT || contentType === Ci.nsIContentPolicy.TYPE_OBJECT_SUBREQUEST ) ) {
			return Ci.nsIContentPolicy.ACCEPT;
		}

		// ignore image resources coming from the top-level domain of the page being scanned
		if ( (contentType === Ci.nsIContentPolicy.TYPE_IMAGE) && (contentLocation.host == requestOrigin.host) ) {
			return Ci.nsIContentPolicy.ACCEPT;
		}

		// ignore crossdomains
		if ( (contentLocation.spec.indexOf('crossdomain.xml') >= 0) && 
				 ( contentType === Ci.nsIContentPolicy.TYPE_OBJECT || contentType === Ci.nsIContentPolicy.TYPE_OBJECT_SUBREQUEST ) ) {
			return Ci.nsIContentPolicy.ACCEPT;
		}


		// only reset at top levels
		if (contentType === Ci.nsIContentPolicy.TYPE_DOCUMENT && contentLocation.host) {
			this.changeReset();
			
			// No blocking at top level, continue
			return Ci.nsIContentPolicy.ACCEPT;
		}

		// added to support calculation of object load latency
		if (prefs.shareData) {
			this.addRequestTime(contentType, context);
		}

		// content policy transfer object
		cp.policyContentLocation = contentLocation.spec;

		var q = contentLocation.spec.indexOf('?');
		if (q >= 0) {
			cp.policyContentLocation = contentLocation.spec.slice(0, q);
		}

		cp.policyRequestOrigin = requestOrigin ? requestOrigin.spec : '';

		try {
			cp.host = (requestOrigin ? requestOrigin.host : '');
		} catch (e) {
			cp.host = (requestOrigin ? requestOrigin.spec : '');
		}

		cp.pathname = (requestOrigin ? requestOrigin.path : '');
		cp.policyContentType = contentType;
		cp.policyWhitelisted = false;
		cp.policyBlocked = false;
		cp.id = prefs.uid();

		var cUrl = requestOrigin ? requestOrigin.host : '';

		/* whitelisting */
		try {
			// embedded/hardwired whitelisting
			// .gstatic.com
			if (contentLocation.host.indexOf('.gstatic.com') >= 0) {
				return Ci.nsIContentPolicy.ACCEPT;
			}

			try {
				// easier to just fail quickly here.
				cUrl = context.ownerDocument.defaultView.top.location.host;

				// overwrite actual requestOrigin with document details when available
				cp.policyRequestOrigin = context.ownerDocument.defaultView.top.location.href;
				cp.host = context.ownerDocument.defaultView.top.location.host;
				cp.pathname = context.ownerDocument.defaultView.top.location.pathname;
				cp.frame = true;
				cp.frameLocation = requestOrigin ? requestOrigin.spec : '';
			} catch (e) {}

			if ( (requestOrigin.scheme === 'http') || (requestOrigin.scheme === 'https') ) {
				if (prefs.isWhiteListed(cUrl)) {
					cp.policyWhitelisted = true;
				}
			} else if (requestOrigin.scheme === 'file') {
				if ( (requestOrigin) && ( prefs.isWhiteListed(requestOrigin.spec.toLowerCase()) ) ) {
					cp.policyWhitelisted = true;
				}
			}

			if (cp.policyWhitelisted) {
				var bw = wm.getMostRecentWindow("navigator:browser");
				bw.ghostery.prefs.logCP(cp);

				return Ci.nsIContentPolicy.ACCEPT;
			}
		} catch (e) {}

		cp.policyBlockingEnabled = prefs.isBlockingEnabled();

		if ( prefs.isBlockingEnabled() && prefs.selectedBugs && contentLocation && this.shouldBlock(cUrl, contentLocation.spec) ) {
			cp.policyBlocked = true;
			prefs.appendBlockingLog("Blocked type: " + contentType + " content location: " + contentLocation.spec + " origin: " + requestOrigin.host);
		}

		if (cp.policyBlocked) {
			cp.latency = -1;
			cp.af = -1;			
		}

		try {
			var bw = wm.getMostRecentWindow("navigator:browser");
			bw.ghostery.prefs.logCP(cp);
		} catch (e) {
			// occurs when there are no windows yet, for example, startup and shutdown.
		}

		if (cp.policyBlocked) {
			if ( contentType == Ci.nsIContentPolicy.TYPE_SCRIPT) {
				this.surrogate(contentLocation.spec.toString(), context);
			}

			return Ci.nsIContentPolicy.REJECT_REQUEST;
		} else {
			return Ci.nsIContentPolicy.ACCEPT;
		}
	},

	shouldProcess: function(contentType, contentLocation, requestOrigin, context, mimeTypeGuess, extra) {
		return Ci.nsIContentPolicy.ACCEPT;
	},

	// See https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIChannelEventSink 
	// Also https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIChannel
	// ffx 4 beta interface
	asyncOnChannelRedirect: function(from, to, flags, callback) {
		this.onChannelRedirect(from, to, flags);
		callback.onRedirectVerifyCallback(Cr.NS_OK);
	},

	// See https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIChannelEventSink 
	// Also https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIChannel
	// ffx 3.5-3.6 interface
	previousRedirect: [],
	onChannelRedirect: function(from, to, flags) {
		if (!this.resources.ghostery.prefs.preventRedirect) { return; }

		this.changeReset();

		var killRedirect = false, cp = {}, ref = '', whitelistEntry = '', finalPreBlockUrl = '';

		var fromSpec = from.originalURI.spec,
		 toSpec = to.URI.spec;

		if (fromSpec == toSpec) return;

		if (this.previousRedirect[fromSpec]) {
			finalPreBlockUrl = this.previousRedirect[fromSpec];
		} else {
			this.previousRedirect[fromSpec] = toSpec;
		}

		try {
			from.QueryInterface(Ci.nsIHttpChannel);
			ref = from.getRequestHeader("Referer");
		} catch (e) {}

		if (!ref) ref = fromSpec.toLowerCase();

		// whitelist
		if (ref.substr(0,7) == 'http://') whitelistEntry = ref.substr(7);
		if (ref.substr(0,8) == 'https://') whitelistEntry = ref.substr(8);

		if ( this.shouldBlock(whitelistEntry, toSpec) ) {
			killRedirect = true;

			if (this.resources.ghostery.prefs.isWhiteListed(whitelistEntry)) {
				return;
			}
		}

		// content policy transfer object
		cp.policyContentLocation = toSpec;

		var q = toSpec.indexOf('?');
		if (q >= 0) {
			cp.policyContentLocation = toSpec.slice(0, q);
		}


		cp.policyRequestOrigin = ref;
		cp.policyRedirectFrom = fromSpec;
		cp.policyContentType = 'redirect';
		cp.policyWhitelisted = false;

		finalPreBlockUrl && (cp.preBlock = finalPreBlockUrl);

		cp.id = this.resources.ghostery.prefs.uid();
		
		whitelistEntry = whitelistEntry.split('/');
		cp.host = whitelistEntry[0];
		whitelistEntry[0] = '';
		cp.pathname = whitelistEntry.join('/');

		cp.latency = -1;
		cp.af = -1;

		if (killRedirect) {
			if ( this.resources.ghostery.prefs.isBlockingEnabled() ) {
				cp.policyBlocked = true;
				this.resources.ghostery.prefs.appendBlockingLog("Redirect prevented: " + fromSpec + " to " + toSpec + " on " + ref);

				var bw = wm.getMostRecentWindow("navigator:browser");
				bw.ghostery.prefs.logCP(cp);

				var nav = this.getNavInterface(from);
				if ( (nav) && ( (from.loadFlags & Ci.nsIChannel.LOAD_DOCUMENT_URI) != 0) ) {
					nav[1].loadURI('chrome://ghostery-resource/content/blocked_redirect.html', null, null, null, null);

					var _prefs = this.resources.ghostery.prefs, timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
					timer.initWithCallback(function() {
						var doc = nav[1].document, aid;

						if (cp.bugs) {
							aid = cp.bugs[0].aid;
							doc.getElementById('name').textContent = cp.bugs[0].name;
						}

						doc.getElementById('origin').textContent = _prefs.extractDomain(cp.policyRequestOrigin);
						doc.getElementById('destination').textContent = _prefs.extractDomain(cp.policyContentLocation);

						doc.getElementById('action').onclick = 
							function() {
								var e = doc.createEvent("CustomEvent"); 
								e.initCustomEvent("GhosteryOptionsUnblockEvent", true, false, {'aid': aid, 'url': cp.policyRedirectFrom});
								doc.dispatchEvent(e);
							};
					}, 500, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
				}

				//throw 'Ghostery Redirect Component: redirect denied based on blocking policy!';
				throw Cr.NS_BASE_STREAM_WOULD_BLOCK;
			} else {
				cp.policyBlocked = false;
				this.resources.ghostery.prefs.appendBlockingLog("Redirect detected: " + fromSpec + " to " + toSpec + " on " + ref);

				var bw = wm.getMostRecentWindow("navigator:browser");
				bw.ghostery.prefs.logCP(cp);
			}
		} else {
			cp.policyBlocked = false;

			var bw = wm.getMostRecentWindow("navigator:browser");
			bw.ghostery.prefs.logCP(cp);

			/* A case exists when it looks to be impossible to associate a redirect with a top domain: when a redirect occurs in a frame or in a chain.*/
		}

		return;
	},

	addRequestTime: function(contentType, node) {
		if (!node) return;

		try {
			if ( ( node instanceof Ci.nsIDOMNode ) &&
				 ( (contentType == Ci.nsIContentPolicy.TYPE_SCRIPT) ||
				 	 (contentType == Ci.nsIContentPolicy.TYPE_OBJECT) ||
				 	 (contentType == Ci.nsIContentPolicy.TYPE_OBJECT_SUBREQUEST) ||
				 	 (contentType == Ci.nsIContentPolicy.TYPE_IMAGE) ||
				 	 (contentType == Ci.nsIContentPolicy.TYPE_SUBDOCUMENT) ) ) {
				node.setUserData('ghosteryRequestStartTime', (new Date()).getTime(), null);
				node.addEventListener("load", function() {
					node.setUserData('ghosteryRequestEndTime', (new Date()).getTime(), null);
				}, true);
			}
		} catch (e) {}

	},

	surrogate: function(url, context) {
		var doc = context && context.ownerDocument || context;

		// Does context exists?
		if ( (!doc) || (!doc.documentElement) ) { return; }

		var replacement, db = this.resources.ghostery.db.loadSurrogates(), dbLength = db.length;

		for (var i = 0 ; i < dbLength; i++) {
			var s = db[i];

			if (s.type == 'exact') {
				if (url == s.match) {
					replacement = s.code;
					break;
				}
			} else if (s.type == 'instring') {
				if ( url.indexOf(s.match) >= 0 ) {
					replacement = s.code;
					break;
				}
			} else if (s.type == 'regex') {
				if ( url.match(new RegExp(s.match, '') ) ) {
					replacement = s.code;
					break;
				}
			}
		}

		if (replacement) {
			var scriptSurrogate = doc.createElement("script");
			scriptSurrogate.id = "bug.surrogate";
			scriptSurrogate.appendChild(doc.createTextNode(replacement));
			doc.documentElement.insertBefore(scriptSurrogate, doc.documentElement.firstChild);
		}
	},

	/**
	 * Check if a reset is needed, and update the component if so.
	 */
	changeReset: function() {
		/* reset regex list -- looks like options have been modified to include or remove a tracker */
		if (this.resources.ghostery.prefs.pref.getBoolPref('reloadList')) {
			this.resources.ghostery.prefs.set('reloadList', false);
			this.resources.ghostery.prefs.startup();
		}

		/* reset white list */
		if (this.resources.ghostery.prefs.pref.getBoolPref('reloadWhiteList')) {
			this.resources.ghostery.prefs.set('reloadWhiteList', false);
			this.resources.ghostery.prefs.startup();
		}
	},

	getNavInterface: function(channel) {
		let callbacks = [];
		if (channel.notificationCallbacks) {
			callbacks.push(channel.notificationCallbacks);
		}

		if (channel.loadGroup && channel.loadGroup.notificationCallbacks) {
			callbacks.push(channel.loadGroup.notificationCallbacks);
		}

		for (var callback in callbacks) {
			callback = callbacks[callback];
			try {
				var win = callback.getInterface(Ci.nsILoadContext).associatedWindow;
				var nav = win.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
				return [win, nav];
			} catch(e) {}
		}
	},

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIContentPolicy,
                                         Ci.nsISupports,
                                         Ci.nsIFactory,
                                         Ci.nsIObserver,
                                         Ci.nsIChannelEventSink]),

  classID: Components.ID("{a4992d70-56f2-11de-8a39-0800200c9a66}"),
  className: "Ghostery Content Policy",
  contractID: "@ghostery.com/content-policy;1",
  _xpcom_categories: [{ category: "content-policy", entry: "@ghostery.com/content-policy;1", value: "@ghostery.com/content-policy;1", service: "true" },
					  { category: "net-channel-event-sinks", entry: "@ghostery.com/content-policy;1", value: "@ghostery.com/content-policy;1", service: "true" }],

  getClassObject: function(compMgr, cid, iid) {
    if (!cid.equals(this.classID))
      throw Cr.NS_ERROR_NO_INTERFACE;
    if (!iid.equals(Ci.nsIFactory))
      throw Cr.NS_ERROR_NOT_IMPLEMENTED;
    return this.factory;
  },

	registerSelf: function(compMgr, fileSpec, location, type) {
		compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
		compMgr.registerFactoryLocation(this.classID, this.className, this.contractID, fileSpec, location, type);
		this.getCategoryManager().addCategoryEntry("content-policy", this.contractID, this.contractID, true, true);
		this.getCategoryManager().addCategoryEntry("net-channel-event-sinks", this.contractID, this.contractID, true, true);
	},

	unregisterSelf: function(compMgr, fileSpec, location) {
		compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
		compMgr.unregisterFactoryLocation(this.classID, fileSpec);
		this.getCategoryManager().deleteCategoryEntry("content-policy", this.contractID, true);
		this.getCategoryManager().deleteCategoryEntry("net-channel-event-sinks", this.contractID, true);
	},

  canUnload: function(compMgr) {
    return true;
  },

  getCategoryManager: function() {
    return Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
  },

  factory: { 
    createInstance: function(outer, iid) {
      if (outer != null)
        throw Cr.NS_ERROR_NO_AGGREGATION;
      return (new GhosteryContentPolicy()).QueryInterface(iid);
    }
  }
}

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.2 (Firefox 3.6).
*/
var NSGetFactory, NSGetModule;
if (XPCOMUtils.generateNSGetFactory) {
	NSGetFactory = XPCOMUtils.generateNSGetFactory([GhosteryContentPolicy]);
} else {
  NSGetModule = XPCOMUtils.generateNSGetModule([GhosteryContentPolicy]);
}