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
if( !ghostery ) { var ghostery = {}; }  // If Ghostery is not already loaded, define it and set current preferences state.

ghostery.prefs = {
	version: '2.9.3',
	showBubble: null,
	showBugCount: null,
	expandSources: null,
	autoDismissBubble: null,
	shareData: null, 
	bubbleTimeout: null,
	bubbleLocation: null,
	censusURL: null,
	pref: null,
	paused: null,
	firstRun: null,
	upgrade: true,
	autoUpdateBugs: null,
	lastBugUpdate: null,
	cookieProtect: null,

	toolbarButton: false,
	tutorial: false,
	tutorialShown: false,
	panelNew: true,
	blockingLog: '',
	privateBrowsing: false,
	whitelist: [],
	siteURL: "http://www.ghostery.com/",
	blockNone: -1,
	blockSelected: 0,
	blockAll: 1,
	blockingMode: null,

	blockImage: null,
	blockFrame: null,
	blockObject: null,
	preventRedirect: null,

	updateBlockBehaviour: null,
	updateNotification:	null,
	updateLatestBugEntries: '',
	updateLatestCookieEntries: '',
	fireNewEntriesNotification: false,
	showClick2Play: true,
	showClick2PlayButton: true,
	click2play: {},

	selectedBugsString: null,
	selectedBugs: null,
	selectedBugsMap: null,

	selectedCookiesString: null,
	selectedCookies: null,
	selectedCookiesMap: null,
	cookieRegex: null,

	enableCleanup: null, // flag for cleanup of Flash & Silverlight cookies

	/* check for update */
	allVersion: '',

	// new stuff for merged content policy and DOM scanning
	results: {},
	resultsUidMap: {},

	// users selective whitelisting entries
	userAllowOnceCounter: {},
	userSiteSelections: {},

	/* Startup preference observer */
	startup: function(checkVersion) {
		try {
			// Register to receive notifications of preference changes
			this.pref = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("extensions.ghostery.");
			this.pref.QueryInterface(Components.interfaces.nsIPrefBranch2);
			this.pref.addObserver("", this, false);

			// Set values from preferences
			this.showBubble = this.pref.getBoolPref('showBubble');
			this.expandSources = this.pref.getBoolPref('expandSources');
			this.showBugCount = this.pref.getBoolPref('showBugCount');
			this.autoDismissBubble = this.pref.getBoolPref('autoDismissBubble');
			this.shareData = this.pref.getBoolPref('shareData'); 
			this.bubbleTimeout = this.pref.getIntPref('bubbleTimeout');
			this.bubbleLocation = this.pref.getCharPref('bubbleLocation');
			this.censusURL = this.pref.getCharPref('censusURL');
			this.blockingMode = this.pref.getIntPref('blockingMode');
			this.blockingLog = this.pref.getCharPref('blockingLog');
			this.privateBrowsing = this.pref.getBoolPref('privateBrowsing'); 
			this.cookieProtect = this.pref.getBoolPref('cookieProtect');
			this.toolbarButton = this.pref.getBoolPref('toolbarButton');
			this.panelNew = this.pref.getBoolPref('panelNew');

			this.blockImage = this.pref.getBoolPref('blockImage');
			this.blockFrame = this.pref.getBoolPref('blockFrame');
			this.blockObject = this.pref.getBoolPref('blockObject');
			this.preventRedirect = this.pref.getBoolPref('preventRedirect');

			this.updateBlockBehaviour = this.pref.getBoolPref('updateBlockBehaviour');
			this.updateNotification = this.pref.getBoolPref('updateNotification');
			this.updateLatestBugEntries = this.pref.getCharPref('updateLatestBugEntries');
			this.updateLatestCookieEntries = this.pref.getCharPref('updateLatestCookieEntries');

			// used by cleaner module
			this.enableCleanup = this.pref.getBoolPref('enableCleanup');

			this.showClick2Play = this.pref.getBoolPref('showClick2Play');
			this.showClick2PlayButton = this.pref.getBoolPref('showClick2PlayButton');

			// check for update
			this.allVersion = this.pref.getCharPref('allVersion');

			// whitelist
			this.loadWhiteList();

			try {
				this.autoUpdateBugs = this.pref.getBoolPref('autoUpdateBugs');
			} catch(e) {
				this.autoUpdateBugs = false;
				this.pref.setBoolPref('autoUpdateBugs', false);
			}

			try {
				this.lastBugUpdate = this.pref.getCharPref('lastBugUpdate');

				if (this.lastBugUpdate) {
					try {
						var d = this.lastBugUpdate.split("_");
						this.lastBugUpdate = new Date(d[0], d[1], d[2]);
					} catch (e) {
						this.lastBugUpdate = null;
					}
				}
			} catch (e) {};

			if ( (checkVersion) && (checkVersion == 'options') ) {
				// options specific startup, not sure if we need anything here
			} else {
				// resetting pause toggle
				this.togglePause(true);
			}

			// Version check is only done from the non-component version, so anything non-component should go here
			if (checkVersion) {
				var v = '';
				try {
					v = this.pref.getCharPref('version');
				} catch (e) {
					this.upgrade = false;
				}

				if (v != this.version) {
					this.firstRun = true;
					this.pref.setCharPref('version', this.version);

					// Replace the detection lists after an upgrade
					ghostery.db.refreshOnUpdate();
				} else {
					this.firstRun = false;
				}

				this.tutorial = this.pref.getBoolPref('tutorial');
				if ( (v != '') && (v) ) {
					// not a new install install
					this.set('tutorial', true);
					this.tutorial = true;
				} else if (this.shareData) {
					// user has seen options already, skipping
					this.set('tutorial', true);
					this.tutorial = true;
				}

				// Honor the display setting for addon bar
				this.manageAddonBarButton();

				// Manage popup/panel display
				if (ghostery.prefs.panelNew) {
					try {
						var p = document.getElementById('ghostery-popup');
						p.parentNode.removeChild(p);

						p = document.getElementById('ghostery-status');
						p.addEventListener( "command", ghostery.ui.showPanel, false );
					} catch (err) {
						// happens when prefs are used by any html/chrome pages
					}
				}

				// click2play loader
				var c2pDb = ghostery.db.loadClick2Play();
				for (var entry in c2pDb) {
					entry = c2pDb[entry];
					if (ghostery.prefs.click2play.hasOwnProperty(entry.aid)) {
						ghostery.prefs.click2play[entry.aid].push(entry);
					} else {
						ghostery.prefs.click2play[entry.aid] = [entry];
					}
				}

			}
			// selective shitelisting: load user selections
			this.userSiteSelections = ghostery.db.loadSelections();

			this.setSelectionFromString('bugs', this.readSelectionFile('bugs'));
			this.setSelectionFromString('lsos', this.readSelectionFile('lsos'));
		} catch (err) {
	  	var cs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	  	cs.logStringMessage('GHOSTERY STARTUP EXCEPTION');
	  	cs.logStringMessage(err + ' on: ' + err.lineNumber + '|' + err.toSource());
		}  // Catch preference error

		ghostery.db.loadDB();
	},

	/* Called on unload */
	shutdown: function() {
		this.set('blockingLog', '');

		this.pref.removeObserver('', this);
	},

	needPanelNag: function() {
		var current = new Date(), lastNag = parseInt(this.get('lastNotificationNag'), 10), twoWeeks = 1000 * 60 * 60 * 24 * 7 * 2;
		lastNag = new Date(lastNag + twoWeeks);
		if (current > lastNag) {
			return true;
		}

		return false;
	},

	manageAddonBarButton: function() {
		try {
			var s = document.getElementById('ghostery-status');
			
			if (this.showBugCount) {
				s.style.display = '';				
			} else {
				s.style.display = 'none';
			}
		} catch (e) { }
	},

	manageToolbarButton: function() {
		try {
			var ffx = document.getElementById('nav-bar');
			var curSet = ffx.currentSet;

			if (this.toolbarButton) {
				// Add button from toolbar.
				if (curSet.indexOf('ghostery-toolbar-button') < 0) {
					curSet = curSet + ',ghostery-toolbar-button';
				}
			} else {
				// Remove button from toolbar.
				if (curSet.indexOf('ghostery-toolbar-button') > 0) {
					curSet = curSet.replace(/ghostery-toolbar-button/, '');
				}
			}

			ffx.setAttribute('currentset', curSet);
			ffx.currentSet = curSet;
			document.persist('nav-bar', 'currentset');
		} catch(e) { }
	},

	appendBlockingLog: function(msg) {
		if (!this.privateBrowsing) {
			this.blockingLog += msg + '\n';
			this.set('blockingLog', this.blockingLog);
		} else {
			this.set('blockingLog', '');
		}
	},

/**
 * 1. log CP request
 * 2. process the CP request through worker to identify the tracker
 * 3. update tabs array with results
 * 4. scan dom and process the request through worker
 * 5. merge the content policy and dom results
 * 6. use the results as a final set
 *
 * policyBlocked:true
 * policyBlockingEnabled:true
 * policyContentLocation:"http://cdn.intermarkets...ort_Home_Top_dynamic.js"
 * policyContentType:2
 * policyRequestOrigin:"http://www.drudgereport.com/"
 * policyWhitelisted
 */
	frameResults: {},
	logCP: function(cp) {
		function contains(a, loc) {
			var i = a.length;
			while (i--) {
				if (a[i].policyContentLocation == loc) {
					return true;
				}
			}
			return false;
		}

		var i, existing, stage;

		existing = this.results[cp.policyRequestOrigin] || [];
		this.resultsUidMap[cp.id] = cp;

		if (!contains(existing, cp.policyContentLocation)) {
			existing.push(cp);

			if ( (cp.policyBlockingEnabled) && (cp.policyBlocked) ) {
				// known tracker, stage 2 needed.
				stage = "stage22";
			} else {
				// either no blocking is on or not blocked by policy (whitelisted), stage 1 needed.
				stage = "stage11";
			}

			ghostery.invokeWorker({"action": stage, "uid": cp.id, "src": cp.policyContentLocation});

			this.results[cp.policyRequestOrigin] = existing;
		}
		
		if (cp.frame) {
			existing = this.frameResults[cp.frameLocation] || [];
			if (!contains(existing, cp.frameLocation)) {
				existing.push(cp);
				this.frameResults[cp.frameLocation] = existing;
			}
		}
	},

	uid: function() {
		var newDate = new Date;
		var partOne = newDate.getTime();
		var partTwo = 1 + Math.floor((Math.random() * 32767));
		var partThree = 1 + Math.floor((Math.random() * 32767));
		var id = partOne + '-' + partTwo + '-' + partThree;
		return id;
	},
	
	/**
	 * This function extracts a bug list from the results array.
	 * This is executed from ghostery.updateTabUI and should run
	 * after stage22 is executed per tracker.
	 */
	getBugs: function(page) {
		var j, k, trackers = [], results = ghostery.prefs.results[page] || [];

		for (j = 0; j < results.length; j++) {
			var result = results[j];

			if (result.bugs) {
				for (k = 0; k < result.bugs.length; k++) {
					var tracker = {};

					tracker.script = result.policyContentLocation;
					tracker.bug = result.bugs[k];
					tracker.policyBlocked = result.policyBlocked;
					tracker.shouldHaveBeenBlocked = result.shouldHaveBeenBlocked;
					
					trackers.push(tracker);
				}
			}
		}

		return trackers;
	},

	clearAllowedOnceNoReloadBugs: function (page, aids) {
		var j, k, trackers = [], results = ghostery.prefs.results[page] || [];

		for (j = 0; j < results.length; j++) {
			var result = results[j];

			if (result.bugs) {
				for (k = 0; k < result.bugs.length; k++) {
					if (aids.indexOf(parseInt(result.bugs[k].aid, 10)) >= 0) {
						results.splice(j, 1);
					}
				}
			}
		}
	},

	setElementData: function(el, doc, tracker) {
		var latency = -1, af = -1;
		if (ghostery.prefs.shareData) {
			// collect latency and fold info
			var s =	el.getUserData('ghosteryRequestStartTime'),
			 e = el.getUserData('ghosteryRequestEndTime');

			latency = e - s;

			if (latency < 0) { latency = -1; }

			if (el.nodeName == 'SCRIPT') {
				af = -1
			} else if (el.getBoundingClientRect().top > 0) {
				af = (doc.defaultView.innerHeight > (el.getBoundingClientRect().top + (el.offsetHeight * 0.6) ) );
			}

			tracker.latency = latency;
			tracker.af = af;
		}
	},

	/* whitelist functions */
	loadWhiteList: function() {
		if ( (this.pref.getPrefType("whitelist") == this.pref.PREF_STRING) && (this.pref.getCharPref("whitelist")) ) {
			this.whitelist = this.pref.getCharPref("whitelist").split(",");
		} else {
			this.whitelist = [];
		}
	},

	setWhiteList: function(list) {
		this.pref.setCharPref("whitelist", list);

		this.whitelist = [];
		if (list) {
			this.whitelist = list.split(",");
		}

		this.set('reloadWhiteList', true);
	},

	validNewSite: function(site) {
		if(site.length == 0) return false;

		var strutsValidator = /^[\w\-\.\*]+(\:\d{1,5}){0,1}\/*.*/;
		if (!strutsValidator.test(site)) return false;

		return true;
	},

	deWhitelistCurrentSite: function() {
		var list = [];
		var site = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString();

		site = site.toLowerCase();

		if (!this.validNewSite(site)) {
			return;
		}

		for (var i = 0; i < this.whitelist.length; i++) {
			if (site === this.whitelist[i]) continue; // whitelisted, skip over
			list.push(this.whitelist[i]);
		}

		this.setWhiteList(list.join());
	},

	whitelistCurrentSite: function() {
		var list = [];
		var site = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString();

		site = site.toLowerCase();

		if (!this.validNewSite(site)) {
			return;
		}

		list.push(site);
		for (var i = 0; i < this.whitelist.length; i++) {
			if (site === this.whitelist[i]) return; // already whitelisted
			list.push(this.whitelist[i]);
		}

		this.setWhiteList(list.join());
	},

	isWhiteListed: function(site) {
		if (!this.whitelist) return false;
		if (this.whitelist.length == 0) return false;

		if (!site) { return false; }
		site = site.toString();

		var i, num_sites = this.whitelist.length;
		for (i = 0; i < num_sites; i++) {
			if (site.toLowerCase().indexOf(this.whitelist[i].toLowerCase()) >= 0) {
				return true;
			};
		}

		return false;
	},

	addSiteSelection: function(host, type, aid, noReload) {
		/* ['www.avc.com'] = { "allow": [58, 85], "block": [] } */

		if ( ghostery.prefs.userSiteSelections.hasOwnProperty(host.toLowerCase()) ) {
			if ( ghostery.prefs.userSiteSelections[host.toLowerCase()].hasOwnProperty(type) ) {
				// same type is already in there, so just add to the array.
				if ( ghostery.prefs.userSiteSelections[host.toLowerCase()][type].indexOf(aid) < 0 )
					ghostery.prefs.userSiteSelections[host.toLowerCase()][type].push(aid);
			} else {
				// this type is not yet present
				ghostery.prefs.userSiteSelections[host.toLowerCase()][type] = [aid];
			}
		} else {
			// new entry
			ghostery.prefs.userSiteSelections[host.toLowerCase()] = {};
			ghostery.prefs.userSiteSelections[host.toLowerCase()][type] = [aid];
		}

		if (type === 'allow_once') {
			ghostery.prefs.userAllowOnceCounter[host] = (noReload) ? 1 : 2;
		}

		ghostery.prefs.set('userSiteSelections', JSON.stringify(ghostery.prefs.userSiteSelections));
	},

	removeSiteSelection: function(host, type, aid) {
		if ( ghostery.prefs.userSiteSelections.hasOwnProperty(host.toLowerCase()) ) {
			if ( ghostery.prefs.userSiteSelections[host.toLowerCase()].hasOwnProperty(type) ) {
				if ( ghostery.prefs.userSiteSelections[host.toLowerCase()][type].indexOf(parseInt(aid, 10)) >= 0 ) {
					ghostery.prefs.userSiteSelections[host.toLowerCase()][type].splice(ghostery.prefs.userSiteSelections[host.toLowerCase()][type].indexOf(parseInt(aid, 10)), 1);
				}
			}
		}

		ghostery.prefs.set('userSiteSelections', JSON.stringify(ghostery.prefs.userSiteSelections));
	},

	isSiteSelected: function (host, type, aid) {
		if ( ghostery.prefs.userSiteSelections.hasOwnProperty(host.toLowerCase()) ) {
			if ( ghostery.prefs.userSiteSelections[host.toLowerCase()].hasOwnProperty(type) ) {
				if ( ghostery.prefs.userSiteSelections[host.toLowerCase()][type].indexOf(parseInt(aid, 10)) >= 0 ) {
					return true;
				}
			}
		}
		return false;
	},

	allowOnceReset: function(host) {
		if ( ghostery.prefs.userSiteSelections.hasOwnProperty(host.toLowerCase()) ) {
			if ( ghostery.prefs.userSiteSelections[host.toLowerCase()].hasOwnProperty('allow_once') ) {
				delete ghostery.prefs.userSiteSelections[host.toLowerCase()].allow_once;

				// delete the site entry if its empty now
				if ( !ghostery.prefs.userSiteSelections[host.toLowerCase()].hasOwnProperty('allow') &&
				     !ghostery.prefs.userSiteSelections[host.toLowerCase()].hasOwnProperty('block') )
					delete ghostery.prefs.userSiteSelections[host.toLowerCase()];
			}

			ghostery.prefs.set('userSiteSelections', JSON.stringify(ghostery.prefs.userSiteSelections));
		}
	},

	getWhitelistedDatabase: function(host) {
		if (!host) { return null; }
		host = host.toString();

		try {
			for (var entry in ghostery.prefs.userSiteSelections) {
				if (host.toLowerCase().indexOf(entry.toLowerCase()) >= 0) {
					var db = {};
					db.allow = [];
					db.block = [];

					if ( ghostery.prefs.userSiteSelections[entry].hasOwnProperty('allow') )
						db.allow = db.allow.concat(ghostery.prefs.userSiteSelections[entry].allow);

					if ( ghostery.prefs.userSiteSelections[entry].hasOwnProperty('allow_once') )
						db.allow = db.allow.concat(ghostery.prefs.userSiteSelections[entry].allow_once);

					if ( ghostery.prefs.userSiteSelections[entry].hasOwnProperty('block') )
						db.block = db.allow.concat(ghostery.prefs.userSiteSelections[entry].block);

					return db;
				}
			}
		} catch (ex) {
			var cs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	  	cs.logStringMessage('GHOSTERY getWhitelistedDatabase EXCEPTION ' + host);
	  	cs.logStringMessage(ex + ' on: ' + ex.lineNumber + '|' + ex.toSource());
		}
	},

	/* Called when events occur on the preferences */
	observe: function(subject, topic, data) {
		if (topic != 'nsPref:changed') { return; }

		switch(data) {
			case 'paused':
				this.paused = this.pref.getBoolPref('paused');
				break;
			case 'showBubble':
				this.showBubble = this.pref.getBoolPref('showBubble');
				break;
			case 'expandSources':
				this.expandSources = this.pref.getBoolPref('expandSources');
				break;
			case 'showBugCount':
				this.showBugCount = this.pref.getBoolPref('showBugCount');
				this.manageAddonBarButton();
				break;
			case 'autoDismissBubble':
				this.autoDismissBubble = this.pref.getBoolPref('autoDismissBubble');
				break;
			case 'autoUpdateBugs':
				this.autoUpdateBugs = this.pref.getBoolPref('autoUpdateBugs');
				break;
			case 'shareData':
				this.shareData = this.pref.getBoolPref('shareData');
				break;
			case 'bubbleTimeout':
				this.bubbleTimeout = this.pref.getIntPref('bubbleTimeout');
				break;
			case 'bubbleLocation':
				this.bubbleLocation = this.pref.getCharPref('bubbleLocation');
				break;
			case 'censusURL':
				this.censusURL = this.pref.getCharPref('censusURL');
				break;
			case 'blockingMode':
				this.blockingMode = this.pref.getIntPref('blockingMode');
				break;
			case 'showClick2Play':
				this.showClick2Play = this.pref.getBoolPref('showClick2Play');
				break;
			case 'showClick2PlayButton':
				this.showClick2PlayButton = this.pref.getBoolPref('showClick2PlayButton');
				break;
			case 'enableCleanup':
				this.enableCleanup = this.pref.getBoolPref('enableCleanup');
				break;
			case 'cookieProtect':
				this.cookieProtect = this.pref.getBoolPref('cookieProtect');
				break;
			case 'blockImage':
				this.blockImage = this.pref.getBoolPref('blockImage');
				break;
			case 'blockFrame':
				this.blockFrame = this.pref.getBoolPref('blockFrame');
				break;
			case 'blockObject':
				this.blockObject = this.pref.getBoolPref('blockObject');
				break;
			case 'preventRedirect':
				this.preventRedirect = this.pref.getBoolPref('preventRedirect');
				break;
			case 'updateBlockBehaviour':
				this.updateBlockBehaviour = this.pref.getBoolPref('updateBlockBehaviour');
				break;
			case 'updateNotification':
				this.updateNotification = this.pref.getBoolPref('updateNotification');
				break;
			case 'updateLatestBugEntries':
				this.updateLatestBugEntries = this.pref.getCharPref('updateLatestBugEntries');
				break;
			case 'updateLatestCookieEntries':
				this.updateLatestCookieEntries = this.pref.getCharPref('updateLatestCookieEntries');
				break;
			case 'privateBrowsing':
				this.privateBrowsing = this.pref.getBoolPref('privateBrowsing');
				break;
			case 'blockingLog':
				this.blockingLog = this.pref.getCharPref('blockingLog');
				break;
			case 'selectedBugsUpdated':
				this.setSelectionFromString('bugs', this.readSelectionFile('bugs'));
				break;
			case 'selectedLsosUpdated':
				this.setSelectionFromString('lsos', this.readSelectionFile('lsos'));
				break;
			case 'panelNew':
				this.panelNew = this.pref.getBoolPref('panelNew');
				break;
			case 'toolbarButton':
				this.toolbarButton = this.pref.getBoolPref('toolbarButton');
				this.manageToolbarButton();
				break;
			case 'whitelist':
				this.loadWhiteList();
				break;
			case 'reloadList':
				if (this.pref.getBoolPref('reloadList')) {
					// resend bugs and full regex to scanner.
					this.setSelectionFromString('bugs', this.readSelectionFile('bugs'));
					this.setSelectionFromString('lsos', this.readSelectionFile('lsos'));
					ghostery.prefs.populateWorker();
					// reload cookie regex.
					this.fullCookieRegex(true);
				}
				break;
			case 'reloadComponent':
				if (this.pref.getBoolPref('reloadComponent')) {
					// resend bugs and full regex to scanner.
					this.setSelectionFromString('bugs', this.readSelectionFile('bugs'));
					this.setSelectionFromString('lsos', this.readSelectionFile('lsos'));
					ghostery.prefs.populateWorker();

					this.set('reloadComponent', false);
					this.set('reloadList', true);
				}
				break;
		}
	},

	/* Get Mozilla Preference */
	set: function(prefName, prefValue) {
		var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		pref = pref.getBranch("extensions.ghostery.");
 
		// Determine the type of the preference and then set it using the correct function
		switch (pref.getPrefType(prefName))  {
			case pref.PREF_STRING: 
				return pref.setCharPref(prefName, prefValue);
				break;
			case pref.PREF_INT: 
				return pref.setIntPref(prefName, prefValue);
				break;
			case pref.PREF_BOOL: 
				return pref.setBoolPref(prefName, prefValue);
				break;
			default: 
				break;
		}
		return -1;
	},

	/*  Get Mozilla Preference */
	get: function(prefName) {
		var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		pref = pref.getBranch("extensions.ghostery.");

		// Determine the type of the preference and then set it using the correct function
		switch (pref.getPrefType(prefName)) {
			case pref.PREF_STRING: 
				return pref.getCharPref(prefName);
				break;
			case pref.PREF_INT: 
				return pref.getIntPref(prefName);
				break;
			case pref.PREF_BOOL: 
				return pref.getBoolPref(prefName);
				break;
			default: 
				break;
		}
		return -1;    
	},

	/* Check if Mozilla Preference is set */
	has: function(prefName) {
		var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		pref = pref.getBranch("extensions.ghostery.");

		if( pref.prefHasUserValue(prefName) ) { return true; }
		return false;  // Otherwise return false    
	},

	saveFirstRun: function(e) {
		try {
			var gp = ghostery.prefs;
			gp.set('tutorial', true );

			if (e.target.getAttribute('skip') == 'true') return;

			gp.set('shareData', (e.target.getAttribute('ghostRank') == 'true') );
			gp.set('showBubble', (e.target.getAttribute('alertBubble') == 'true') );

			if (e.target.getAttribute('blocking') == 'true') {
				gp.set('blockingMode', 0);
		  	gp.writeSelectionFile( 'bugs', e.target.getAttribute('selectedBugs') );
		  	gp.set('reloadList', true);
			} else {
				gp.set('blockingMode', -1);
			}
		} catch(err) { }
	},

	firstRunPage: function() {
		if (!this.tutorialShown) {
			this.tutorialShown = true;
			gBrowser.selectedTab = gBrowser.addTab("chrome://ghostery/content/wizard.html");
			gBrowser.removeEventListener('load', ghostery.prefs.firstRunPage, true);
		}
	},

	firstRunTabOpen: function() {
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var browserEnumerator = wm.getEnumerator("navigator:browser");

		var found = false;
		while (!found && browserEnumerator.hasMoreElements()) {
			var browserWin = browserEnumerator.getNext();
			var tabbrowser = browserWin.gBrowser;

			var numTabs = tabbrowser.browsers.length;
			for (var index = 0; index < numTabs; index++) {
				var currentBrowser = tabbrowser.getBrowserAtIndex(index);
				var b = (currentBrowser.currentURI.spec == 'chrome://ghostery/content/wizard.html');

				if (b) {
					found = true;	
				}
			}
		}

		return found;
	},

	fullRegex: function() {
		var fr = '';
		for ( var bug_num = 0; bug_num < ghostery.db.bugs.length; bug_num++ ) {
			var bug = ghostery.db.bugs[bug_num];
			fr = (fr ? fr : "") + "|" + bug.pattern;
		}

		if (fr) fr = fr.substring(1);

		return fr;
	},

	fullCookieRegex: function(reload) {
		var regex = null,
			site = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString(),
			userPreferenceList = ghostery.prefs.userSiteSelections[site];
		
		if ( (ghostery.prefs.cookieRegex) && (!reload) ) {
			return ghostery.prefs.cookieRegex;
		}
		
		try {
			if ( (this.selectedCookies) && (this.selectedCookies.length > 0) ) {
				for (var i = 0; i < ghostery.db.lsos.length; i++) {
					if (ghostery.prefs.isSelectedCookie(ghostery.db.lsos[i].aid)) {
						if (userPreferenceList 
								&& userPreferenceList.allow_once.indexOf(parseInt(ghostery.db.lsos[i].aid)) >= 0)
							continue;
						regex = (regex ? regex : "") + "|" + ghostery.db.lsos[i].pattern;
					}
				}
			}

			if (regex) regex = regex.substring(1);

			ghostery.prefs.cookieRegex = new RegExp(regex, "i");
		} catch (err) { }

		return ghostery.prefs.cookieRegex;
	},

	populateWorker: function() {
		ghostery.invokeWorker({"action":"setRegex", "fullRegex": ghostery.prefs.fullRegex()});
		ghostery.invokeWorker({"action":"setBugs", "bugs": ghostery.db.bugs});
	},

	togglePause: function(force) {
		if ( (this.paused) || (force) ) {
			// resuming, re-enable everything
			this.set('paused', false);
			this.set('cookieProtect',  true);
			this.set('blockingMode', 0);
		} else {
			// pausing, disable blocking and cookie protection
			this.set('paused', true);
			this.set('cookieProtect',  false);
			this.set('blockingMode',  -1);
		}
	},

	shouldBlockBug: function(id, userPreferenceList) {
		// userPreferenceList: {allow: [allow overwrite], block: [block overwrite]}

		if (!userPreferenceList) {
			return this.isBlockingAll() || (this.isBlockingSelected() && this.isSelectedAppId(id));
		} else {
			return this.isBlockingAll() || (this.isBlockingSelected() && ( (userPreferenceList.allow.indexOf(parseInt(id)) >= 0) ? false : this.isSelectedAppId(id) ) );
		}
	},

	// TODO: this entire substructure is no longer used, consider removing.

	isBlockingEnabled: function() { return this.blockingMode !== this.blockNone; },
	isBlockingNone: function() { return this.blockingMode == this.blockNone; },
	isBlockingSelected: function() { return this.blockingMode == this.blockSelected; },
	isBlockingAll: function() { return this.blockingMode == this.blockAll; },

	getBlockingMode: function() {
		if ( this.isBlockingSelected() ) {
			if (ghostery.db.bugsAppCount == this.selectedBugs.length) { // are all bugs selected?
				return this.blockAll;
			} else if (this.selectedBugs.length == 0) {
				return this.blockNone;
			}

			return this.blockSelected;
		}

		return this.blockNone;
	},

	getCookieProtectionMode: function() {
		if ( this.cookieProtect ) {
			if (ghostery.db.lsosAppCount == this.selectedCookies.length) { // are all cookies selected?
				return this.blockAll;
			} else if (this.selectedCookies.length == 0) {
				return this.blockNone;
			}
			return this.blockSelected;
		}

		return this.blockNone;
	},

	shouldBlockCookie: function(id) {
		return (this.cookieProtect && this.isSelectedCookie(id));
	},

	isSelectedCookie: function(id) {
		id = id.toString();
		var selected = false;
		if (this.selectedCookiesMap) {
			selected = this.selectedCookiesMap[id] ? true : false;
		}
		return selected;
	},

	isSelectedAppId: function(id) {
		id = id.toString();
		var selected = false;
		if (this.selectedBugsMap) {
			selected = this.selectedBugsMap[id] ? true : false;
		}
		return selected;
	},

	// tries to add a bug to the blocked bugs list
	// TODO: returns false if writeSelectionFile did not succeed, this should not be possible
	selectBug: function(id) {
		var i, found = false;
		for (i = 0; i < this.selectedBugs.length; i++)
			if (this.selectedBugs[i] == id) { found = true; break; }

		if (!this.isSelectedAppId(id)) {
			if (!found) { // sanity check #1
				this.selectedBugs.push(id);
			}
			this.writeSelectionFile('bugs', this.formatSelectedBugs(this.selectedBugs));
			this.setSelectionFromString('bugs', this.readSelectionFile('bugs'));
			this.set('reloadList', true);
			if (!this.selectedBugsMap[id]) { // sanity check #2
				this.selectedBugs.splice(i, 1);
				return false;
			}
		} else {
			if (!found) {
				this.selectedBugs.push(id);
			}
		}
		return true;
	},

	// tries to remove a bug from the blocked bugs list
	// TODO: returns false if writeSelectionFile did not succeed, this should not be possible
	deselectBug: function(id) {
		var i, found = false;
		for (i = 0; i < this.selectedBugs.length; i++)
			if (this.selectedBugs[i] == id) { found = true; break; }

		if (this.isSelectedAppId(id)) {
			if (found) { // sanity check #1
				this.selectedBugs.splice(i, 1);
			}
			this.writeSelectionFile('bugs', this.formatSelectedBugs(this.selectedBugs));
			this.setSelectionFromString('bugs', this.readSelectionFile('bugs'));
			this.set('reloadList', true);
			if (this.selectedBugsMap[id]) { // sanity check #2
				this.selectedBugs.push(id);
				return false;
			}
		} else {
			if (found) {
				this.selectedBugs.splice(i, 1);
			}
		}
		return true;
	},

	deselectCookie: function(aid) {
		var i, found = false;
		for (i = 0; i < this.selectedCookies.length; i++)
			if (this.selectedCookies[i] == aid) { found = true; break; }

		if (this.isSelectedCookie(aid)) {
			if (found) { // sanity check #1
				this.selectedCookies.splice(i, 1);
			}
			this.writeSelectionFile('lsos', this.formatSelectedBugs(this.selectedCookies));
			this.setSelectionFromString('lsos', this.readSelectionFile('lsos'));
			// not needed for lso list
			// this.set('reloadList', true);
			if (this.selectedCookiesMap[aid]) { // sanity check #2
				this.selectedCookies.push(aid);
				return false;
			}
		} else {
			if (found) {
				this.selectedCookies.splice(i, 1);
			}
		}
		return true;
	},

	toggleSelectedBug: function(id) {
		if (this.isSelectedAppId(id))
			return this.deselectBug(id);
		else
			return this.selectBug(id);
	},

	parseSelectedBugs: function(selectedBugsString) {
		var trimmed = selectedBugsString.replace(/^\s+|\s+$/g,"");
		var selectedBugs = trimmed.length == 0 ? [] : trimmed.split(',');
		return selectedBugs;
	},

	formatSelectedBugs: function(selectedBugsArray) {
		return selectedBugsArray.join(',');
	},

	setSelectionFromString: function(type, selectedString) {
		var t = type.charAt(0).toUpperCase() + type.substring(1);
		if (type == 'lsos') t = 'Cookies';

		this['selected' + t + 'String'] = selectedString ? selectedString : "";
		this['selected' + t] = this.parseSelectedBugs(this['selected' + t + 'String']);
		// copy to hash for key lookup
		this['selected' + t + 'Map'] = {};
		for (var i = 0; i < this['selected' + t].length; i++)
			this['selected' + t + 'Map'][this['selected' + t][i]] = true;
	},

	readSelectionFile: function(type) {
		var file = this.getSelectionFile(type);
		var selected = this.readFile(file);
		return selected;
	},

	writeSelectionFile: function(type, selectedString) {
		var file = this.getSelectionFile(type);
		this.writeFile(file, selectedString);
		this.set('selected' + type.charAt(0).toUpperCase() + type.substring(1) + 'Updated', new Date().toString()); // hack to trigger pref change event
	},

	getSelectionFile: function(type) {
		var file = this.getStorageDirectory();
		return this.getOrCreateFile(file, 'selected' + type.charAt(0).toUpperCase() + type.substring(1), false);
	},

	getStorageDirectory: function() {
		var file = this.getProfileDirectory();
		return this.getOrCreateFile(file, "ghostery", true);
	},

	getProfileDirectory: function() {
		return Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	},

	getOrCreateFile: function(parentFile, childFileName, isDirectory) {
		var file = parentFile;
		file.append(childFileName);
		if( !file.exists() || (isDirectory && !file.isDirectory()) || (!isDirectory && !file.isFile()) ) {
			if (isDirectory) {
				file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
			} else {
				file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0666);
			}
		}
		return file;
	},

	readFile: function(file) {
		var data = "";
		var fis = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		var cis = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
		fis.init(file, -1, 0, 0);
		cis.init(fis, "UTF-8", 0, 0);
		var str = {};
		cis.readString(-1, str);
		data = str.value;
		cis.close();
		return data;
	},

	writeFile: function(file, data) {
		var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		// write, create, truncate, use 0x02 | 0x10 to open file for appending.
		fos.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
		var cos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
		cos.init(fos, "UTF-8", 0, 0);
		cos.writeString(data);
		cos.close();
	},

	arrayForEach:function (arr, fun) {
		var len = arr.length;

		for (var i = 0; i < len; i++) {
			if (i in arr)
				fun.call(arr[i], arr[i], i);
		}
	},

	arrayCopy: function(arr) {
		var a = [], i = arr.length;
		while( i-- ) {
			a[i] = typeof arr[i].copy!=='undefined' ? arr[i].copy() : arr[i];
		}
		return a;
	},

	arrayContainsBug: function(a, id, src) {
		var i = a.length;
		while (i--) {
			if ( (a[i].bug.id === id) 
				&& (a[i].script === src) ) {
				return true;
			}
		}
		return false;
	},

	countApps: function(a) {
		var i = a.length,
		 c = 0,
		 ta = {};

		while (i--) {
			if (!ta[a[i].bug.id]) {
				 c++;
				 ta[a[i].bug.id] = true;
			}
		}
		return c;
	},
	
	// returns true if url belongs to host's top or sub-domain
	belongsToHost: function(url, host) {
		host = host.replace(/^www\./, '');
		url = ghostery.prefs.parseUri.parse(url).host;
		return (url.indexOf(host) !== -1);
	},

	stripScheme: function(page) {
		var r = page;
		try {
			if (page.substr(0,7) == 'http://') r = page.substr(7);
			if (page.substr(0,8) == 'https://') r = page.substr(8);
			if (page.substr(0,7) == 'file://') r = page.substr(7);
		} catch (e) { }

		return r;
	},

	extractDomain: function(url) {
		if (!url) return;

		url = this.stripScheme(url);
		url = url.split('/');

		return url[0];
	},
	
	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License
	parseUri: {
		options: { 
			strictMode: false,
			key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
			q:   {
				name:   "queryKey",
				parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			},
			parser: {
				strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
				loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
			}
		},
		parse: function (str) {
			var	o   = ghostery.prefs.parseUri.options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;
	
			while (i--) uri[o.key[i]] = m[i] || "";
		
			uri[o.q.name] = {};
			uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				if ($1) uri[o.q.name][$1] = $2;
			});
			
			return uri;
		}
	},

	escapeHTML: function(str) {return str.replace(/[&"<>]/g, function (m) "&" + ({ "&": "amp", '"': "quot", "<": "lt", ">": "gt" })[m] + ";");}
};

ghostery.locale = {
	_init: false,
	blockedLabel: 'Blocked',
	blockedLabelPlural: '',
	ofLabel: 'of',
	bugCountLabel: 'tracker',
	bugCountLabelPlural: 'trackers',
	foundLabel: 'found',
	foundLabelPlural: '',
	onThisPageLabel: 'on this page',
	nothingFoundLabel: 'No trackers here!',
	whitelistedLabel: 'Whitelisted site',
	updateComplete: 'Ghostery tracker update complete.',
	zeroNewTrackers: 'No new bugs added to the database',
	totalTrackers: 'Total web-bugs',
	previousTrackers: 'previous count',

	init: function() {
		if (this._init) return;
		this._init = true;

		var stringsBundle = document.getElementById("ghostery-strings");
		this.blockedLabel = unescape(stringsBundle.getString('statusbar.blocked_label'));
		this.blockedLabelPlural = unescape(stringsBundle.getString('statusbar.blocked_label_plural'));
		this.ofLabel = unescape(stringsBundle.getString('statusbar.of_label'));
		this.bugCountLabel = unescape(stringsBundle.getString('statusbar.bug_count_label'));
		this.bugCountLabelPlural = unescape(stringsBundle.getString('statusbar.bug_count_label_plural'));
		this.foundLabel = unescape(stringsBundle.getString('statusbar.found_label'));
		this.foundLabelPlural = unescape(stringsBundle.getString('statusbar.found_label_plural'));
		this.onThisPageLabel = unescape(stringsBundle.getString('statusbar.on_this_page_label'));
		this.nothingFoundLabel = unescape(stringsBundle.getString('statusbar.nothing_found_label'));
		this.whitelistedLabel = unescape(stringsBundle.getString('statusbar.whitelisted_label'));

		this.updateComplete = unescape(stringsBundle.getString('list.update.update_complete'));
		this.zeroNewTrackers = unescape(stringsBundle.getString('list.update.zero_new_trackers'));
		this.totalTrackers = unescape(stringsBundle.getString('list.update.total_trackers'));
		this.previousTrackers = unescape(stringsBundle.getString('list.update.previous_trackers'));
	}
};