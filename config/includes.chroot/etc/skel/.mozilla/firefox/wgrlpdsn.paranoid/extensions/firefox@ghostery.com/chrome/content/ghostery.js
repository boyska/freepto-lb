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


if( !ghostery ) { var ghostery = {}; }

ghostery = {
	currentBugs: null,
	pbListener: null,
	scanner: null,
	isTabSwitch: false,
	showAlertTimer: -1,

	init: function() {
		window.removeEventListener('load', ghostery.init, false);
		window.addEventListener('unload', ghostery.shutdown, false);

		try { ghostery.ui.getMenuPopup(); } catch(e) {}

		var appcontent = document.getElementById('appcontent');
		if ( appcontent ) {
			// Initialize preferences
			ghostery.prefs.startup(true);

			// Conditional listener on page load
			appcontent.addEventListener('load', ghostery.onPageLoad, true);
			//appcontent.addEventListener("load", ghostery.prefs.allowOnceReset, true);

			// Add listener for tab selection
			gBrowser.tabContainer.addEventListener('TabSelect', ghostery.onTabSelect, false);

			// setup listener
			var setupListener = function() {
				gBrowser.selectedTab = gBrowser.addTab('chrome://ghostery/content/wizard.html');

				// kill after a single start.
				setupListener = function() {};
			};

			// Adding custom event listener for Ghostery communication
			gBrowser.addEventListener('DOMContentLoaded',
				function (event) {
					if (event.originalTarget instanceof HTMLDocument) {
						event.originalTarget.addEventListener('GhosterySetupEvent', setupListener, false, true);
					}

					try {
				 		if (event.originalTarget instanceof HTMLDocument && 
				   		  event.originalTarget.location.href == 'chrome://ghostery/content/wizard.html') {
							event.originalTarget.addEventListener('GhosteryHeadsUpEvent', ghostery.prefs.saveFirstRun, false, true);
				 		}

				 		if (event.originalTarget instanceof HTMLDocument && 
				   		  event.originalTarget.location.href == 'chrome://ghostery/content/options.html') {
							event.originalTarget.addEventListener('GhosteryUpdateEvent', function() { ghostery.db.updateDatabase(true, event.originalTarget); }, false, true);
							event.originalTarget.addEventListener('GhosteryOptionsSaveEvent', function() {
									ghostery.prefs.togglePause(true);
									ghostery.prefs.set('reloadComponent', true);
									ghostery.prefs.set('reloadList', true);
								}, false, true);
				 		}
				 	} catch (e) {}

					event.originalTarget.addEventListener('GhosteryOptionsUnblockEvent', function(e) {
						if (e.target.location.href == 'chrome://ghostery-resource/content/click2play.html') {
							if (e.detail.action === 'always') {
								// Valid target post, unblock.
								for (var aid in e.detail.allow) {
									aid = e.detail.allow[aid];
									ghostery.prefs.deselectBug(aid);
									ghostery.prefs.deselectCookie(aid);
								}

								gBrowser.selectedBrowser.contentDocument.location.reload();
							} else if (e.detail.action === 'once') {
								var doc = gBrowser.selectedBrowser.contentDocument,
								 	host = (doc.location.host ? doc.location.host : doc.location);
								if (e.detail.button && e.detail.reinject) { // no page reload necessary, only buttons
									ghostery.prefs.clearAllowedOnceNoReloadBugs(gBrowser.selectedBrowser.contentDocument.location.href, e.detail.allow);
									for (var aid in e.detail.allow) {
										aid = e.detail.allow[aid];
										ghostery.prefs.addSiteSelection(host, 'allow_once', aid, true);
									}

									var script = e.detail.script;
										els = doc.querySelectorAll(e.detail.ele),
										container = doc.createElement('script');

									container.src = script;

									// Special case: remove our own surrogate for Facebook and reinject FB Connect if used here.
									if (e.detail.allow[0] == 464) {
										var antiSurrogate = doc.createElement('script');
										antiSurrogate.textContent = 'delete window.FB;';
										doc.body.appendChild(antiSurrogate);

										var trackers = ghostery.prefs.getBugs(doc.location.href);
										for (var i in trackers) {
											var tracker = trackers[i];
											if (tracker.bug && tracker.bug.aid == 93) {
												// FB Connect present, reinjecting.
												antiSurrogate = doc.createElement('script');
												antiSurrogate.src = tracker.script;
												doc.body.appendChild(antiSurrogate);

												break;
											}
										}
									}

									if (e.detail.attach == 'parentNode') { // if it needs attachment to parentNode, remove any existing siblings
										while (els[0].nextSibling) {
											els[0].parentNode.removeChild(els[0].nextSibling);
										}
									}

									// remove any Ghostery c2p leftover
									while (els[0].hasChildNodes()) {
										els[0].removeChild(els[0].childNodes[0]);
									}

									els[0].parentNode.appendChild(container);
								} else { // needs page reload
									for (var aid in e.detail.allow) {
										aid = e.detail.allow[aid];
										ghostery.prefs.addSiteSelection(host, 'allow_once', aid, false);
									}

									gBrowser.selectedBrowser.contentDocument.location.reload();
								}
								ghostery.prefs.fullCookieRegex(true);
							}
						} else if (e.target.location.href == 'chrome://ghostery-resource/content/blocked_redirect.html') {
							ghostery.prefs.deselectBug(e.detail.aid);
							gBrowser.selectedBrowser.contentDocument.location.href = e.detail.url;
						}
					}, false, true);
				}, false);

			// Registering a reseter that will clear the cache in case of a reload
			gBrowser.addProgressListener({
				  QueryInterface: function(aIID) {
				   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
				       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
				       aIID.equals(Components.interfaces.nsISupports))
				     return this;
				   throw Components.results.NS_NOINTERFACE;
				  },

				  onStateChange: function(p, r, f, status) {
				  	if ( (f & Components.interfaces.nsIWebProgressListener.STATE_START) && 
    					   (f & Components.interfaces.nsIWebProgressListener.STATE_IS_DOCUMENT) ) {
				  		try {
				  			ghostery.prefs.results[r.URI.spec] = [];
				  			ghostery.cookieMonster.current = r.URI.host;

								if (ghostery.prefs.userAllowOnceCounter[r.URI.host]) {
									ghostery.prefs.userAllowOnceCounter[r.URI.host]--;

									if (ghostery.prefs.userAllowOnceCounter[r.URI.host] <= 0) {
										ghostery.prefs.allowOnceReset(r.URI.host);
									}
								}
				  		} catch (e) {}
				  	}
				  }
				});

			// Browser shutdown hook
			ghostery.registerShutdownHook();

			// Private Browsing hook
			ghostery.registerPrivateBrowsing();

			if (!ghostery.prefs.tutorial) {
				gBrowser.addEventListener('load', ghostery.prefs.firstRunPage, true);
			}

			// Perform Auto Update check
			if (ghostery.prefs.autoUpdateBugs) {
				var week = new Date(ghostery.prefs.lastBugUpdate.getTime() + (1000 * 60 * 60 * 24 * 7));
				var today = new Date();
				if (today >= week) {
					ghostery.db.updateDatabase();
				}
			}

			// SCANNER WORKER \\
			ghostery.scanner = new Worker("chrome://ghostery/content/ghostery-scanner.js");

			var self = ghostery;
			ghostery.scanner.onmessage = function(event) {
				self.processWorkerResponse.call(self, event);
			};

			ghostery.prefs.populateWorker();

			// Cookie Monster
			ghostery.cookieMonster.init();

			// Uninstall monitor.
			ghostery.uninstaller.init();
		}
	},

	registerPrivateBrowsing: function() {
		ghostery.pbListener = new ghostery.pbl();
		ghostery.pbListener.watcher = {
		  onEnterPrivateBrowsing : function() {
				ghostery.prefs.set('privateBrowsing', true);
		  },

		  onExitPrivateBrowsing : function() {
				ghostery.prefs.set('privateBrowsing', false);
		  }
		};

		if (ghostery.pbListener.inPrivateBrowsing) {
			ghostery.prefs.set('privateBrowsing', true);
		} else {
			ghostery.prefs.set('privateBrowsing', false);
		}
	},

	registerShutdownHook: function() {
		var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);

		// add hook to cleanup prefs
		observerService.addObserver(this, "quit-application-granted", false);
		observerService.addObserver(this, "quit-application", false);
		observerService.addObserver(this, "quit-application-requested", false);
	},

	observe: function(subject, topic, data) {
		if (topic.indexOf('quit-application') < 0) {
			return;
		}

		// flash/silverlight cleanup
		if (ghostery.prefs.enableCleanup) {
			ghostery.cleaner.cleanup();
		}

		// uninstaller check.
		if (ghostery.uninstaller.uninstall) {
			ghostery.uninstaller.housekeeping();
		}
	},

	shutdown: function() {
		// Clean-up after ourselves
		ghostery.prefs.shutdown();

		// Unhook extension
		window.removeEventListener( "unload", ghostery.shutdown, false);
	},

	onPageLoad: function(event) {
		if (ghostery.prefs.firstRun) {
			ghostery.firstRunBox();

			// add the button only if this isn't an upgrade
			if (!ghostery.prefs.upgrade) {
				ghostery.prefs.pref.setBoolPref('toolbarButton', true);
				ghostery.prefs.manageToolbarButton();
			}
		} else if (ghostery.prefs.fireNewEntriesNotification) {
			ghostery.notificationBox();
		} else if (!ghostery.prefs.panelNew && ghostery.prefs.needPanelNag() ) {
			ghostery.notificationBox('newPanel');
		} else {
			var doc = event.originalTarget;
			if (!(doc instanceof HTMLDocument)) { return; }

			if (doc.location && doc.location.href == 'http://www.ghostery.com/firefox/awesome/panel') {
				doc.getElementById('enable-now-button').addEventListener( 'click', function(e) {
					ghostery.prefs.set('panelNew', true);
					var restart = confirm('Done, the new panel is now enabled!\nThis change requires a browser restart.\nDo you want to restart the browser now?');

					gBrowser.removeCurrentTab();

					if (restart == true) {
						setTimeout(function() {
							var boot = Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(Components.interfaces.nsIAppStartup);
							boot.quit(Components.interfaces.nsIAppStartup.eForceQuit|Components.interfaces.nsIAppStartup.eRestart);
						}, 1000);
					}
				});
			}

			// added here to reset badge for back/forward navigation without scanning
			ghostery.updateTabUI(doc);
			ghostery.analyzePage(doc, true);
		}

		if ((event.originalTarget instanceof HTMLDocument) && event.originalTarget.location && ghostery.ui.needsReload[event.originalTarget.location.href] !== undefined) {
			delete ghostery.ui.needsReload[event.originalTarget.location.href];
		}
	},

	onTabSelect: function(event) {
		if (event) {
			// Actual tab select! =)			
			ghostery.isTabSwitch = true;
		}

		try {
			ghostery.updateTabUI(gBrowser.selectedBrowser.contentDocument);
		} catch (e) {}
	},

	updateTabUI: function(doc) {
		try {
		  if (doc instanceof HTMLDocument) {
		    var win = doc.defaultView;
		    if (win.frameElement) {
		      doc = win.top;
		    }
		  }
		} catch (e) {}

		// assume current top level
		var page = gBrowser.selectedBrowser.contentDocument.location.href;
		try { page = doc.location.href; } catch (err) { }

		try { var host = (doc.location.host ? doc.location.host : doc.location); } catch (e) {}

		try {
			if (gBrowser.selectedBrowser.contentDocument.location.href != page) {
				return;
			}
		} catch (e) {}

		try {
			var bugs = ghostery.prefs.getBugs(page), detected = [], blocked = 0, isWhitelisted = false;
			ghostery.clearDetectedBugs();

			if (bugs.length > 0) {
				isWhitelisted = ghostery.prefs.isWhiteListed( host );

				// Only sort when there is more than one bug
				if (bugs.length > 1) {
					bugs.sort(function(a, b) {
						var aName = a.bug.name.toLowerCase();
						var bName = b.bug.name.toLowerCase();
						return aName > bName ? 1 : aName < bName ? -1 : 0
					});
				}

				for (var i = 0; i < bugs.length; i++) {
					if (detected.indexOf(bugs[i].bug.aid) < 0) {
						detected.push(bugs[i].bug.aid);

						var userSiteSelections = ghostery.prefs.getWhitelistedDatabase(host);
						if ( !isWhitelisted && ghostery.prefs.shouldBlockBug(bugs[i].bug.aid, userSiteSelections) ) { blocked++; }
					}
				}

				if ( (ghostery.prefs.showBubble) && (!ghostery.isTabSwitch) ) {
// TODO: sometime shows partial list?
					ghostery.showAlert(bugs, isWhitelisted, host);
				}

			}
			ghostery.currentBugs = bugs;

			ghostery.updateBadge(detected.length, blocked, isWhitelisted);

			detected = '';
		} catch (e) { }
	},
			
	/* Analyze the contents of page */
	analyzePage: function(doc, countBug) {
		if ( (! doc.location ) || (! doc.location.href ) ) { return; }    // Make sure page is not null
		try { if (doc.getElementById('ghostery-first-run')) { return; } } catch (e) {}

		var page = doc.location.href,
		 host, pathname = '', isFrame = false;

		try { host = (doc.location.host ? doc.location.host : doc.location); } catch (e) {}
		try { pathname = doc.location.pathname; } catch (e) {}
		try {
		  if (doc instanceof HTMLDocument) {
		    var win = doc.defaultView;
		    if (win.frameElement) {
		    	isFrame = true;
		      win = win.top;
		      page = win.location.href;
		      try { host = (win.location.host ? win.location.host : win.location); } catch (e) {}
		      try { pathname = win.location.pathname; } catch (e) {}
		    }
		  }
		} catch (e) {}

		// Collect elements we want to scan
		//var scannedElements = 'embed, iframe, img, object, script';
		var scannedElements = 'script' + (ghostery.prefs.blockImage ? ', img' : '')
			+ (ghostery.prefs.blockFrame ? ', iframe' : '')
			+ (ghostery.prefs.blockObject ? ', embed, object' : '');

		var html = doc.querySelectorAll(scannedElements);

		var srcDoc = page;
		
		for (var i = 0; i < html.length; i++) {
			var src = ghostery.getSource(html[i]);
			if (src) {
				// ignore image resources coming from the host (top and sub-domains) of the page being scanned
				if (html[i].nodeName == 'IMG' && ghostery.prefs.belongsToHost(src, host)) {
					continue;
				}

				var found = false,
					trackers = ghostery.prefs.results[srcDoc] || [],
					userSiteSelections = ghostery.prefs.getWhitelistedDatabase(host),
					isWhitelisted = ghostery.prefs.isWhiteListed(host);

				if (!isFrame) {
					for (var j = 0; j < trackers.length; j++) {
						var tracker = trackers[j];

						if ( (page != srcDoc) && ( tracker.policyContentLocation.toLowerCase() == src.toLowerCase() ) ) { // this is a framed tracker, add to the top level doc
							var topLevel = ghostery.prefs.results[page] || [];
							tracker.owner = {};
							tracker.owner.host = host;
							tracker.owner.pathname = pathname;
							tracker.domScanner = true;
							found = true;
							if (!tracker.policyBlocked) {
								ghostery.prefs.setElementData(html[i], doc, tracker);
							} else {
								// element is blocked, remove from DOM.
								ghostery.checkC2P(tracker, doc);
								html[i].parentNode.removeChild(html[i]);
							}
							topLevel.push(tracker);
							ghostery.prefs.results[page] = topLevel;
							break;
						} else if ( (tracker.policyContentLocation) && (tracker.policyContentLocation.toLowerCase() == src.toLowerCase()) ) { // tracker has been picked up by content policy and presumably scanned already.
							tracker.domScanner = true;
							found = true;
							if ( (!tracker.policyBlocked) ) {
								ghostery.prefs.setElementData(html[i], doc, tracker);
							} else {
								// element is blocked, remove from DOM.
								ghostery.checkC2P(tracker, doc);
								html[i].parentNode.removeChild(html[i]);
							}
							break;
						}
					}
				} else { // if it is a framed tracker inside another frame
					srcDoc = doc.location.href;
					var frameTrackers = ghostery.prefs.frameResults[doc.location.href] || [];
					for (var j = 0; j < frameTrackers.length; j++) {
						var frameTracker = frameTrackers[j];
						if (frameTracker.policyBlocked && (frameTracker.policyContentLocation.toLowerCase() == src.toLowerCase()) && !isWhitelisted && frameTracker.bugs && ghostery.prefs.shouldBlockBug(frameTracker.bugs[0].aid, userSiteSelections)) {
							// element is blocked, remove from DOM.
							ghostery.checkC2P(frameTracker, doc);
							html[i].parentNode.removeChild(html[i]);
							break;
						}
					}
				}

				if (!found) {
					// tracker has not been picked up by content policy
					// some are not picked up even tho they are passed through scanner, why?
					// one example: drugdereprot.com -- a frame is analyzed before the CP data is in.
					var entry = {};
					entry.domScanner = true;

					entry.policyContentLocation = src;

					var q = src.indexOf('?');
					if (q >= 0) {
						entry.policyContentLocation = src.slice(0, q);
					}

					entry.policyRequestOrigin = page;
					entry.host = host;
					entry.pathname = pathname;

					ghostery.prefs.setElementData(html[i], doc, entry);
					entry.id = ghostery.prefs.uid();
					trackers.push(entry);
					ghostery.prefs.resultsUidMap[entry.id] = entry;

					this.invokeWorker({"action":"stage11", "uid": entry.id, "src": entry.policyContentLocation});

					ghostery.prefs.results[srcDoc] = trackers;
				} else {
					// recording stats for the found tracker
					if ( (ghostery.prefs.shareData) && ghostery.isDataSetReady(tracker) ) {
							var b = {};
							b.bug = tracker.bugs[0];
							ghostery.recordStats(b, tracker);
					}
				}
			}
		}

		// Adding page info collection service here.
		if ( ghostery.prefs.shareData && !isFrame) {
			ghostery.analyzePageInfo(doc,  host + pathname);
		}

		// Page analysis is done, are there trackers left unreported?
		if ( ghostery.prefs.shareData ) {
			var trackers = ghostery.prefs.results[srcDoc] || [];
			for (var j = 0; j < trackers.length; j++) {
				var tracker = trackers[j];

				if ( (!tracker.sent) && tracker.hasOwnProperty('bugs') ) {
					var b = {};
					b.bug = tracker.bugs[0];
					ghostery.recordStats(b, tracker);
				}
			}
		}
	},

	analyzePageInfo: function(doc, domain) {
		var el, i, h, w,
			pageLatency = 0,
			spots = 0,
			html = doc.querySelectorAll('iframe, div, img, object');
		
		for (i = 0; i < html.length; i++) {
			el = html[i];
			// check if element has already been seen
			if (ghostery.seenChildren.indexOf(el) !== -1) { continue; }
			h = parseInt(window.getComputedStyle(el).getPropertyValue('height'), 10);
			w = parseInt(window.getComputedStyle(el).getPropertyValue('width'), 10);
			
			// if element matches adStandard
			if (ghostery.getAdStandard.exists(h, w)) {
				// mark element's children as seen
				ghostery.markChildren(el.childNodes);
				// count adSpot
				spots++;
			}
		}

		// TODO: gBrowser.selectedBrowser.contentWindow might not be the actual doc?
		pageLatency = (gBrowser.selectedBrowser.contentWindow.performance.timing.domContentLoadedEventStart - gBrowser.selectedBrowser.contentWindow.performance.timing.requestStart);

		if ( (pageLatency > 0) || (spots > 0) )
			ghostery.recordPageInfo(domain, pageLatency, spots);

		spots = null;
		ghostery.seenChildren = [];
	},
	
	seenChildren: [],
	
	// helps analyzePageInfo() mark elements as seen and avoid counting ad spots twice
	markChildren: function (ele) {
		for (var n = 0; n < ele.length; n++) {
			if (ele[n].hasChildNodes()) {
				ghostery.markChildren(ele[n].childNodes);
			}
			ghostery.seenChildren.push(ele[n]);
		}
	},

	getAdStandard: {
		standards: { // height: [width, width, ...]
			31: [88],
			60: [120, 234, 300, 468],
			66: [970],
			90: [120, 728, 990],
			100: [300],
			125: [125, 300],
			150: [180],
			200: [200, 410],
			240: [120],
			250: [250, 300],
			280: [336],
			300: [720],
			310: [300],
			360: [640],
			400: [240],
			480: [640],
			600: [120, 160, 300, 425],
			850: [336]
		},
		exists: function (height, width) {
			if (!this.standards.hasOwnProperty(height)) { return false; }
			if (this.standards[height].indexOf(width) === -1) { return false; }
			return true;
		}
	},

	invokeWorker: function(m) {
		try { ghostery.scanner.postMessage(m); } catch (e) {}
	},

	processWorkerResponse: function(event) {
		try {
			if (event.data.action == 'stage11') {
				var uid = event.data.uid,
				 isBug = event.data.isBug,
				 tracker = ghostery.prefs.resultsUidMap[uid];

				tracker.isBug = isBug;

				if (isBug) {
					this.invokeWorker({"action": "stage22", "uid": tracker.id, "src": tracker.policyContentLocation});
				}
			} else if (event.data.action == 'stage22') {
				var i, uid = event.data.uid,
				 foundBug = event.data.bug,
				 tracker = ghostery.prefs.resultsUidMap[uid],
				 hasNewApp = false;

				// check if we need to populate hasNewApp
				if ( gBrowser.selectedBrowser.contentDocument.location.href == tracker.policyRequestOrigin ) {
					hasNewApp = ghostery.prefs.countApps(ghostery.prefs.getBugs(gBrowser.selectedBrowser.contentDocument.location.href));
				}

				tracker.bugs = tracker.bugs || [];
				tracker.bugs.push(foundBug.bug);
				if (tracker.domScanner) {
					tracker.shouldHaveBeenBlocked = ghostery.prefs.shouldBlockBug(tracker.bugs[0].aid, ghostery.prefs.getWhitelistedDatabase(gBrowser.selectedBrowser.contentDocument.location.host));
				}

				// recording stats for the found tracker
				if ( (ghostery.prefs.shareData) && ( ghostery.isDataSetReady(tracker) ) ) {
					ghostery.recordStats(foundBug, tracker);
				}


				// check if we need to populate hasNewApp
				if ( gBrowser.selectedBrowser.contentDocument.location.href == tracker.policyRequestOrigin ) {
					hasNewApp = (hasNewApp != ghostery.prefs.countApps(ghostery.prefs.getBugs(gBrowser.selectedBrowser.contentDocument.location.href)));
				}

				// update UI only if there is a new entry.
				if ( ( gBrowser.selectedBrowser.contentDocument.location.href == tracker.policyRequestOrigin ) && (hasNewApp) ) {
					ghostery.updateTabUI(gBrowser.selectedBrowser.contentDocument);
				}
			} else if (event.data.action == 'stageError') {
				// debugging action.
			}
		} catch (err) {
			// Unresponsive script catch.
		}
	},

	// replaces a tracker with click2play content if found on our c2p db
	checkC2P: function (tracker, doc) {
		if (!tracker || !tracker.bugs || !tracker.bugs[0]) { return; }

		var bug = tracker.bugs[0];
		if (!ghostery.prefs.showClick2Play) { return false; }
		if (!tracker.policyBlocked) { return false; }
		if (!ghostery.prefs.click2play.hasOwnProperty(bug.aid)) { return false; }

		for (var _c2p in ghostery.prefs.click2play[bug.aid]) {
			_c2p = ghostery.prefs.click2play[bug.aid][_c2p];

			// skip buttons if not enabled.
			if (_c2p.button && !ghostery.prefs.showClick2PlayButton) { continue; }

			var c2p = _c2p;
			try {
				var els = doc.querySelectorAll(c2p.selector),
					allow = [c2p.aid],
					frameColor = c2p.frameBackground ? c2p.frameBackground : '', 
					text = c2p.text ? c2p.text : '', 
					button = c2p.button ? c2p.button : '',
					reinject = c2p.hasOwnProperty('reinject'),
					script = tracker.policyContentLocation,
					attach = c2p.attach ? c2p.attach : false,
					ele = c2p.selector ? c2p.selector : '';

					allow = c2p.alsoAllow ? allow.concat(c2p.alsoAllow) : [c2p.aid];

				for ( var i = 0; i < els.length; i++ ) {
					var el = els[i];
					if ( (attach) && (attach == 'parentNode') ) {
						el = el.parentNode;
					}

					if ( (el) && ( !el.getUserData('click2play') ) ) {
						el.setUserData('click2play', true, null);
						ghostery.click2play(doc, el, bug, allow, frameColor, text, button, attach, reinject, script, ele);
					}
				}
			} catch (e) { return false; }
		}
		return true;
	},

	click2play: function(doc, anchor, bug, allow, frameColor, text, button, attach, reinject, script, ele) {
		var frameId = 'ghostery-' + bug.name + '-message-' + Math.floor(Math.random()*100000),
			isButton = false;

		if (!doc.getElementById(frameId)) {
			var c = 0, m = doc.createElement('iframe');
			m.id = frameId;

			if (button) {
				isButton = true;
				m.style.width = '30px';
				m.style.height = '19px';
				m.style.border = '0px';
				if (attach != 'parentNode')
					anchor.textContent = '';
			} else {
				m.style.width = '100%';
				m.style.border = '1px solid #ccc';
				m.style.height = '80px';
			}

			if (frameColor) m.style.background = frameColor;
			m.type = 'content';

			anchor.appendChild(m);

			doc.getElementById(frameId).contentWindow.document.location.href = 'chrome://ghostery-resource/content/click2play.html';

			function waitForRedirect() {
				c++;
				if ( (!doc.getElementById(frameId)) || (!doc.getElementById(frameId).contentWindow.document.getElementById('ghostyBlock')) ) {
					if (c > 100) return;	// exit when unable to find our own frame.

					setTimeout(function() { waitForRedirect(); }, 500);
					return;
				}

				var idoc = doc.getElementById(frameId).contentWindow.document;

				if (button) {
					idoc.getElementById('text').style.display = 'none';
					idoc.getElementById('ghostyBlock').style.display = 'none';
					idoc.getElementById('action_always').style.display = 'none';

					idoc.getElementById('action_once').firstChild.title = 'Ghostery blocked ' + bug.name + '. To allow once, press me.';
					idoc.getElementById('action_once').firstChild.src = 'chrome://ghostery-resource/content/' + button;

					idoc.getElementById('action_once').addEventListener( 'click',
						function() {
							var e = idoc.createEvent("CustomEvent"); 
							e.initCustomEvent('GhosteryOptionsUnblockEvent', true, false, {"action":"once", "allow": allow, "button": isButton, "reinject": reinject, "script": script, "attach": attach, "ele" : ele});
							idoc.dispatchEvent(e);
	
							return false;
						}, true);
				} else {
					idoc.getElementById('ghostyBlock').title = 'Ghostery blocked ' + bug.name ;

					if (text) {
						text = ghostery.translator.translateString(text);
						text = text.replace('$NAME$', bug.name);

						if (text) {
							idoc.getElementById('text').textContent = text;
							idoc.getElementById('text').style.display = '';
							doc.getElementById(frameId).contentWindow.setContent();
						}
					} else {
						idoc.getElementById('text').style.display = 'none';
					}

					idoc.getElementById('action_always').addEventListener( 'click',
						function() {
							var e = idoc.createEvent("CustomEvent"); 
							e.initCustomEvent('GhosteryOptionsUnblockEvent', true, false, {"action":"always", "allow": allow});
							idoc.dispatchEvent(e);

							return false;
						}, true);

					idoc.getElementById('action_once').addEventListener( 'click',
						function() {
							var e = idoc.createEvent("CustomEvent"); 
							e.initCustomEvent('GhosteryOptionsUnblockEvent', true, false, {"action":"once", "allow": allow, "button": isButton, "reinject": reinject, "script": script, "attach": attach, "ele" : ele});
							idoc.dispatchEvent(e);

							return false;
						}, true);
				}
			}

			waitForRedirect();
		}
	},

	/* Report bugs on the page via purple box */
	showAlert: function(bugs, isWhitelisted, host) {
		if ( (bugs) && (bugs.length > 0) ) {
			var doc = gBrowser.selectedBrowser.contentDocument,
			 anchor = doc.getElementById('ghostery-purple-bubble'),
			 body, span, br, pid;

			if (!doc.body) {
				clearTimeout(ghostery.showAlertTimer);
				// looks like were being called before doc.body became available, lets try again in a sec
				ghostery.showAlertTimer = setTimeout(function() { ghostery.showAlert(bugs, isWhitelisted, host); }, 500);
				return;
			} else {
				clearTimeout(ghostery.showAlertTimer);
			}

			if (!anchor) {
				// output any of the strings found by adding a div element to this site
				body = doc.getElementsByTagName("body");

				// adding css to hide notice from printed documents
				var style = doc.createElement('style');
				style.innerHTML = '@media print, screen and (view-mode:minimized){#ghostery-purple-bubble{display:none}}';
				doc.getElementsByTagName('head')[0].appendChild(style);

				anchor  = doc.createElement('div');

				// Style Definition of message bubble
				anchor.id = 'ghostery-purple-bubble';
				anchor.style.display = "block";
				anchor.style.opacity = "0.9";
				anchor.style.filter = "alpha(opacity=90)";
				anchor.style.position = "fixed";
				anchor.style.zIndex = "2147483647";

				if (ghostery.prefs.bubbleLocation == 'top-left') {
					anchor.style.top = "15px";
					anchor.style.left = "20px";
				} else if (ghostery.prefs.bubbleLocation == 'top-right') {
					anchor.style.top = "15px";
					anchor.style.right = "20px";
					anchor.style.left = "auto";
				} else if (ghostery.prefs.bubbleLocation == 'bottom-right') {
					anchor.style.bottom = "15px";
					anchor.style.right = "20px";
					anchor.style.left = "auto";
				} else if (ghostery.prefs.bubbleLocation == 'bottom-left') {
					anchor.style.bottom = "15px";
					anchor.style.left = "20px";
				}

				anchor.style.background = "#330033";
				anchor.style.styleFloat = "right";
				anchor.style.padding = "7px 10px";
				anchor.style.color = "#ffffff";
				anchor.style.border = "solid 2px #fff";
				anchor.style.cssText  = anchor.style.cssText + ' ;text-decoration:none !important; ';
				anchor.style.textAlign = "left";
				anchor.style.font = "13px Arial,Helvetica";
				anchor.style.MozBorderRadius = "5px";
				anchor.style.MozBoxShadow = "0px 0px 20px #000";
				anchor.style.borderRadius = "5px";
				anchor.style.boxShadow = "0px 0px 20px #000";
				anchor.style.textTransform = "none";
				anchor.style.cursor = 'pointer';
				anchor.style.width = 'auto';
				anchor.style.height = 'auto';

				if ( ghostery.prefs.autoDismissBubble ) {
					// Auto-dismiss bubble using the timeout
					var timeout = ghostery.prefs.bubbleTimeout * 1000;
					setTimeout(function() {ghostery.closeBubbleMessage();}, timeout);
				}

				doc.body.appendChild(anchor);

				anchor.addEventListener('click', function (e) {
					doc.body.removeChild(this);
					e.preventDefault();
				}, false);
			}

			while( anchor.hasChildNodes() ){
				anchor.removeChild(anchor.lastChild);
			}

			span = doc.createElement('span');
			span.style.fontSize = '0px';
			span.textContent = 'Ghostery has found the following on this page:';

			anchor.appendChild(span);

			for (var i = 0; i < bugs.length; i++) {
				if (pid == bugs[i].bug.aid) continue;

				span = doc.createElement('span');
				span.style.backgroundColor = '#330033';

				var userSiteSelections = ghostery.prefs.getWhitelistedDatabase(host);
				if (bugs[i].policyBlocked || (bugs[i].policyBlocked === undefined && ghostery.prefs.shouldBlockBug(bugs[i].bug.aid, userSiteSelections))) {
					span.style.display = 'inline';
					span.style.color = '#777';
					span.style.textDecoration = 'line-through';
				} else {
					span.style.color = '#fff';
				}

				span.appendChild(doc.createTextNode( bugs[i].bug.name + (bugs[i].bug.userCreated ? ' (U)' : '') ));
				anchor.appendChild(span);

				br = doc.createElement('br');
				br.style.cssText = 'display:block !important;';

				anchor.appendChild(br);

				pid = bugs[i].bug.aid;
			}

		}
	},

	resetBadgeColor: function() {
		var badge = document.getElementById('ghostery-toolbar-button'),
		 host = '';

		if (!badge) return;

		try { host = (gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location); } catch (e) {}

		if ( (ghostery.prefs.isWhiteListed( host )) || (ghostery.prefs.paused) ) {
			badge.setAttribute('condition', 'grey');
		} else {
			badge.setAttribute('condition', '');
		}
	},

	updateBadge: function(bugCount, blockedCount, isWhitelisted) {
		ghostery.locale.init();

		var status = document.getElementById('ghostery-status-text'),
		 icon = document.getElementById('ghostery-status-icon'),
		 tooltip = document.getElementById('ghostery-tooltip-value'),
		 badge = document.getElementById('ghostery-toolbar-button'),
		 blocked_label = '', bug_count_label = '', found_label = '';

		if ( bugCount > 0 ) {
			// Define bug label suffix
			if (bugCount >= 1) {
				// If plural is not available, use singular
				bug_count_label = (ghostery.locale.bugCountLabelPlural == '') ? ghostery.locale.bugCountLabel : ghostery.locale.bugCountLabelPlural;
				blocked_label = (ghostery.locale.blockedLabelPlural == '') ? ghostery.locale.blockedLabel : ghostery.locale.blockedLabelPlural;
				found_label = (ghostery.locale.foundLabelPlural == '') ? ghostery.locale.foundLabel : ghostery.locale.foundLabelPlural;
			}

			// Set statusbar
			icon.src = 'chrome://ghostery/content/ghostery-16x16.png';

			// Set badge
			if (badge) {
				if ( (isWhitelisted) || (ghostery.prefs.paused) ) {
					badge.setAttribute('condition', 'grey');
				} else {
					badge.setAttribute('condition', '');
				}

				badge.setAttribute('showTrackers', 'true');
				badge.setAttribute('trackerCount', bugCount);

				if ( ghostery.prefs.blockingMode !== ghostery.prefs.blockNone ) {
					var text = (isWhitelisted && ghostery.locale.whitelistedLabel + '. ') + bugCount + ' ' + bug_count_label + ' ' + found_label + ' ' + ghostery.locale.onThisPageLabel + ', ' + blockedCount + ' ' + blocked_label.toLowerCase();
					badge.setAttribute('tooltiptext', text);
				} else {
					badge.setAttribute('tooltiptext', bugCount + ' ' + bug_count_label);
				}
			}

			// toolbar
			if (tooltip) {
				if ( ghostery.prefs.blockingMode !== ghostery.prefs.blockNone ) {
					var text = (isWhitelisted && ghostery.locale.whitelistedLabel + '. ') + bugCount + ' ' + bug_count_label + ' ' + found_label + ' ' + ghostery.locale.onThisPageLabel + ', ' + blockedCount + ' ' + blocked_label.toLowerCase();
					tooltip.setAttribute('value', text);
				} else {
					tooltip.setAttribute('value', bugCount + ' ' + bug_count_label);
				}
			}

			// Display label if feature enabled
			if ( ghostery.prefs.showBugCount ) {
				status.collapsed = false;
				status.disabled = false;
				status.hidden = false;

				// If blocking enabled
				// Status text: Blocked 0 of 15
				if ( (!isWhitelisted) && ( ghostery.prefs.blockingMode !== ghostery.prefs.blockNone ) ) {
					status.value = blocked_label + ': ' + blockedCount + ' ' + ghostery.locale.ofLabel + ' ' + bugCount;
				}
				// If blocking disabled or whitelisted
				// Status text: 15 trackers
				else {
					status.value = bugCount + ' ' + bug_count_label;
				}
			} else {
				status.collapsed = true; 
				status.disabled = true;
			}
		} else {
			// Set statusbar
			icon.src = 'chrome://ghostery/content/ghostery-off-16x16.png';
			status.value = '';
			status.collapsed = true;
			tooltip.setAttribute('value', ghostery.locale.nothingFoundLabel);

			// Set toolbar / badge
			if (badge) {
				badge.setAttribute('showTrackers', "false");
				badge.setAttribute('trackerCount', 0);
				badge.setAttribute('tooltiptext', ghostery.locale.nothingFoundLabel);
			}
		}

		// reset tab switch
		ghostery.isTabSwitch = false;
	},

	recordPageInfo: function(domain, pageLatency, adSpots) {
		var pageInfoSrc = 'https://l.ghostery.com/api/page/' + 
					'?d=' + encodeURIComponent(domain) +
					'&l=' + pageLatency +
					'&s=' + adSpots +
					'&ua=firefox' +
					'&rnd=' + Math.ceil(9999999 * Math.random());

		try {
			var xhr = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
			xhr.overrideMimeType('image/gif');
			xhr.open("GET", pageInfoSrc, true);
			xhr.send();
		} catch (e) {}
	},

	isDataSetReady: function(tracker) {
		if ( (!tracker.sent) 
		  && (tracker.hasOwnProperty('bugs')) 
		  && (tracker.hasOwnProperty('latency')) 
		  && (tracker.hasOwnProperty('af')) ) {
			return true;
		}

		return false;
	},

	/**
	 * When GhostRank is enabled by the user, pings ghostery.com census URL for
	 * each tracker found on the page.
	 */
	recordStats: function(bugs, tracker) {
		if (!ghostery.prefs.shareData) { return; }
		if (ghostery.prefs.privateBrowsing) { return; }
		if (bugs.bug.userCreated) { return; }

		tracker.sent = true;

		var domain = tracker.host + tracker.pathname.split('?')[0];

		if (tracker.owner) {
			domain = tracker.owner.host + tracker.owner.pathname.split('?')[0];
		}

		if ( bugs.bug && domain ) {
			// First check if current [domain]:[web bug] has already been submitted for today
			var domain_bug = domain + bugs.bug.name,
			 now = new Date(),
			 today = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();

			if ( domain_bug in ghostery.censusCache) {
				// We found an entry for domain+webbug combo, now check to make sure we didn't already send an event today
				if (ghostery.censusCache[domain_bug] === today) {
					return;
				} else {
					// A record exists for domain+webbug combo but we didn't see it today, update cache with new date
					ghostery.censusCache[domain_bug] = today;
				}                   
			} else {
				// No entry from [domain]:[web bug] exists, create one
				ghostery.censusCache[domain_bug] = today;
			}

			var p = ghostery.prefs;
			var census_url = p.censusURL + 
				'?bid=' + bugs.bug.aid + 									// company app id
				'&apid=' + bugs.bug.id +									// pattern id
				'&d=' + encodeURIComponent(domain) +
				'&src=' + encodeURIComponent(tracker.policyContentLocation) +
				'&bl=' + (!ghostery.prefs.isWhiteListed( tracker.host ) && p.shouldBlockBug(bugs.bug.aid)) +
				'&blm=' + p.getBlockingMode() +
				'&bs=' + p.isSelectedAppId(bugs.bug.aid) +
				'&bv=' + ghostery.db.bugsVersion +
				'&l=' + tracker.latency +
				'&af=' + tracker.af +
				'&v=' + ghostery.prefs.version +
				'&ua=firefox' +
				'&rnd=' + Math.ceil(9999999 * Math.random());

			try {
				var xhr = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
				xhr.overrideMimeType('image/gif');
				xhr.open("GET", census_url, true);
				xhr.send();
			} catch (e) {}

			// SQLite dump
			// ghostery.sqlite.record(tracker);
		}
	},

	getSource: function(el) {
		switch (el.nodeName) {
			case 'OBJECT':
				return el.src || el.data || undefined;
				break;
			default:
				return el.src;
				break;
		}
	},

	clearDetectedBugs: function() {
		ghostery.currentBugs = [];
		ghostery.locale.init();

		// reset badge.
		var badge = document.getElementById('ghostery-toolbar-button'),
		 status = document.getElementById('ghostery-status-text'),
		 icon = document.getElementById('ghostery-status-icon'),
		 tooltip = document.getElementById('ghostery-tooltip-value');

		// reset statusbar
		icon.src = 'chrome://ghostery/content/ghostery-off-16x16.png';
		status.value = '';
		status.collapsed = true;
		tooltip.setAttribute('value', ghostery.locale.nothingFoundLabel);

		if (!badge) return;
		badge.setAttribute('showTrackers', "false");
		badge.setAttribute('trackerCount', 0);
		badge.setAttribute('tooltiptext', ghostery.locale.nothingFoundLabel);
	},

	/* Close Ghostery Bubble Message */
	closeBubbleMessage: function() {
		var el, doc = gBrowser.selectedBrowser.contentDocument;

		if ( (doc) && (doc.getElementById('ghostery-purple-bubble')) ) {
			// Dismiss bubble if already exists
			el = doc.getElementById('ghostery-purple-bubble');
			if (el) {
				doc.body.removeChild(el);
			}

		}
	},

	/*
	 * Displays the notification box that new entries are pending.
	 */
	notificationBox: function(type) {
		var doc = gBrowser.selectedBrowser.contentDocument;
		if (!doc) return;
		if (!doc.body) return;
		if (doc.getElementById('ghostery-notification')) { return; }
		if (type == 'newPanel') {
			// Reset count
			ghostery.ui.newPanelNotificationCount = new Date().getTime();
		}

		var body = doc.getElementsByTagName("body");
		var anchor = doc.createElement('div');

		// Style Definition of message bubble
		anchor.id = "ghostery-notification";
		anchor.style.display = "block";
		anchor.style.opacity = "0.9";
		anchor.style.filter = "alpha(opacity=90)";
		anchor.style.position = "fixed";
		anchor.style.zIndex = "2147483647";
		anchor.style.top = "15px";
		anchor.style.right = "20px";
		anchor.style.background = "#777777";
		anchor.style.styleFloat = "right";
		anchor.style.padding = "7px 10px";
		anchor.style.color = "#ffffff";
		anchor.style.border = "solid 2px #fff";
		anchor.style.textDecoration = "none";
		anchor.style.textAlign = "left";
		anchor.style.font = "13px Arial,Helvetica";
		anchor.style.MozBorderRadius = "5px";
		anchor.style.MozBoxShadow = "0px 0px 20px #000";
		anchor.style.borderRadius = "5px";
		anchor.style.boxShadow = "0px 0px 20px #000";
		anchor.style.textTransform = "none";
		if (type == 'newPanel') {
			anchor.style.maxWidth = '300px';
		}

		doc.body.appendChild(anchor);

		var link = doc.createElement('a');
		link.target = '_blank';
		link.href = '#';
		link.style.color = '#ffffff';
		link.style.textDecoration = 'none';
		link.textContent = (type == 'newPanel') ? 'There are a truckload of new features in our redesigned control panel! (Plus the old one you\'re using is going away.) Check out the new controls today!' : 'Ghostery\'s tracker list has been updated.';

		if (type == 'newPanel') {
			link.addEventListener( 'click', function(e) {
				/*
				ghostery.prefs.set('panelNew', true);
				this.textContent = 'Done! Please restart your browser to see the new panel!';
				this.target = '';
				this.style.textDecoration = 'none';
				this.style.cursor = 'default';
				*/

				gBrowser.selectedTab = gBrowser.addTab('http://www.ghostery.com/firefox/awesome/panel');
				this.removeEventListener('click', arguments.callee);
				doc.body.removeChild(doc.getElementById('ghostery-notification'));
				
				// update the nag to go away for a few weeks
				ghostery.prefs.set('lastNotificationNag', (new Date().getTime()) );

				e.preventDefault();
				return false;
			}, false);
		} else {
			link.addEventListener( 'click', function(e) {
				var ev = document.createEvent('Events');
				ev.initEvent('GhosteryGoToOptionsEvent', true, false);
				doc.getElementById('ghostery-notification').dispatchEvent(ev);

				doc.body.removeChild(doc.getElementById('ghostery-notification'));
				e.preventDefault();

				return false;
			}, false );
		}

		anchor.appendChild(link);

		var space = doc.createElement('span');
		space.textContent = ' ';
		anchor.appendChild(space);

		var dismiss = doc.createElement('a');
		dismiss.target = '_blank';
		dismiss.href = '#';
		dismiss.style.color = '#ffffff';
		dismiss.textContent = '(Dismiss)';

		if (type == 'newPanel') {
			dismiss.addEventListener( 'click', function(e) {
				doc.body.removeChild(doc.getElementById('ghostery-notification'));

				// update the nag to go away for a few weeks
				ghostery.prefs.set('lastNotificationNag', (new Date().getTime()) );

				e.preventDefault();
				return false;
			}, false );
		} else {
			dismiss.addEventListener( 'click', function(e) {
				doc.body.removeChild(doc.getElementById('ghostery-notification'));
				e.preventDefault();
				return false;
			}, false );
		}

		anchor.appendChild(dismiss);

		body[0].appendChild(anchor);

		gBrowser.addEventListener('DOMContentLoaded',
				function (event) {
					if (event.originalTarget instanceof HTMLDocument) {
						event.originalTarget.addEventListener('GhosteryGoToOptionsEvent', function() {
						gBrowser.selectedTab = gBrowser.addTab('chrome://ghostery/content/options.html?scroll=list');
					}, false, true);
				}
			}, false);

		if (type == 'newPanel') {
		} else {
			ghostery.prefs.fireNewEntriesNotification = false;
		}
	},

    /*
     * Displays the initial box with Ghostery information.
     */
	firstRunBox: function() {
		ghostery.prefs.firstRun = false;

		var doc = gBrowser.selectedBrowser.contentDocument;

		if (!doc) return;
		if (!doc.body) return;

		// output any of the strings found by adding a div element to this site
		var body    = doc.getElementsByTagName("body");
		var anchor  = doc.createElement('div');

		// Style Definition of message bubble
		anchor.id = "ghostery-first-run";
		anchor.style.display = "block";
		anchor.style.opacity = "0.9";
		anchor.style.filter = "alpha(opacity=90)";
		anchor.style.position = "fixed";
		anchor.style.zIndex = "2147483647";
		anchor.style.top = "15px";
		anchor.style.right = "20px";
		anchor.style.background = "#777777";
		anchor.style.styleFloat = "right";
		anchor.style.padding = "7px 10px";
		anchor.style.color = "#ffffff";
		anchor.style.border = "solid 2px #fff";
		anchor.style.textDecoration = "none";
		anchor.style.textAlign = "left";
		anchor.style.font = "13px Arial,Helvetica";
		anchor.style.MozBorderRadius = "5px";
		anchor.style.MozBoxShadow = "0px 0px 20px #000";
		anchor.style.borderRadius = "5px";
		anchor.style.boxShadow = "0px 0px 20px #000";
		anchor.style.textTransform = "none";

		anchor.addEventListener( 'click', function() {
			doc.body.removeChild(doc.getElementById('ghostery-first-run'));
		}, false);

		doc.body.appendChild(anchor);

		if ( (ghostery.prefs.shareData) || (ghostery.prefs.firstRunTabOpen()) ) {
			var link = doc.createElement('a');
			link.target = '_blank';
			link.href = 'http://purplebox.ghostery.com/?cat=83';
			link.style.color = '#ffffff';
			link.textContent = 'A new Ghostery release. Details here.';
			anchor.appendChild(link);
		} else {
			var link = doc.createElement('a');
			link.target = '_blank';
			link.href = 'http://purplebox.ghostery.com/?cat=83';
			link.style.color = '#ffffff';
			link.textContent = 'A new Ghostery release. Details here.';

			anchor.appendChild(link);
			anchor.appendChild(doc.createElement('br'));
			anchor.appendChild(doc.createElement('br'));

			link = doc.createElement('span');
			link.textContent = 'Check out the Ghostery configuration walkthrough';

			anchor.appendChild(link);
			anchor.appendChild(doc.createElement('br'));

			link = doc.createElement('span');
			link.textContent = 'for a closer look at some of Ghostery\'s key features.';

			anchor.appendChild(link);
			anchor.appendChild(doc.createElement('br'));
			anchor.appendChild(doc.createElement('br'));

			link = doc.createElement('a');
			link.href = '#';
			link.style.color = '#ffffff';
			link.textContent = 'Setup Ghostery';

			link.addEventListener( 'click', function() {
				var ev = document.createEvent('Events');
				ev.initEvent('GhosterySetupEvent', true, false);
				doc.getElementById('ghostery-first-run').dispatchEvent(ev);
				return false;
			}, false );

			anchor.appendChild(link);
		}

		body[0].appendChild(anchor);

		setTimeout(function () {try{var doc = gBrowser.selectedBrowser.contentDocument;if (doc) {var el = doc.getElementById('ghostery-first-run');if (el) {doc.body.removeChild(el);}}}catch(e){}}, 16000);
	}
};

// hook our install
window.addEventListener( "load", ghostery.init, false );