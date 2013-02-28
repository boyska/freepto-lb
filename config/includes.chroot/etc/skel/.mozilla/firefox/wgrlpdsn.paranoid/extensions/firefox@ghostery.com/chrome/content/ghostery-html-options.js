/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 * Ghostery Options page scripts
 *
 * @author Felix Shnir
 * @copyright Copyright (C) 2011 Evidon
 */

if ( !ghostery ) { var ghostery = {}; }

ghostery.options = {
	disableCookieProtection: false,
	bugs: '',
	cats: {bugs:{},cookies:{}},
	active: '',
	activeType: '',
	whitelist: '',
	blockedCount: 0,
	cookiedCount: 0,
	total_cookies: 0,
	total_bugs: 0,
	cookieMap: null,
	cookiePresentMap: null,
	changes: false,
	restart: false,
	cancel: false,
	newBugs: {},
	newCookies: {},
	CATEGORIES: {
		// TODO translate
		'ad': {'full': 'Advertising', 'pop': 'An element that delivers advertisements falls into the Advertising category'},
		'analytics': {'full': 'Analytics', 'pop': 'An element that provides research or analytics for website publishers falls into the Analytics category'},
		'tracker': {'full': 'Beacons', 'pop': 'Elements that serve no purpose other than tracking (beacons, conversion pixels, audience segmentation pixels, etc.) fall into the Beacons category'},
		'privacy': {'full': 'Privacy', 'pop': 'Privacy notices as well as some other privacy related elements fall into the Privacy category'},
		'widget': {'full': 'Widgets', 'pop': 'An element that provides page functionality (social network button, comment form, etc.) falls into the Widgets category'},
		'user-created': {'full': 'User Added', 'pop': 'All user-added elements belong to this category'}
	},

	detectConflicts: function() {
		try {
			Components.utils.import('resource://gre/modules/AddonManager.jsm');

			AddonManager.getAddonByID('optout@google.com', function(addon) {
		  	if ((addon) && (addon.isActive)) {
		  		ghostery.options.disableCookieProtection = true;
		  		ghostery.options.GH$('warning-link').style.display = 'block';
		  		document.getElementById('settings.warning.googleoptout').style.display = '';
		  	}
			});

			AddonManager.getAddonByID('john@velvetcache.org', function(addon) {
		  	if ((addon) && (addon.isActive)) {
		  		ghostery.options.disableCookieProtection = true;
		  		ghostery.options.GH$('warning-link').style.display = 'block';
		  		document.getElementById('settings.warning.beeftaco').style.display = '';
		  	}
			});
		} catch (err) { }
	},

	GH$:function(a) {
		return $('#' + a)[0];
	},

	lookupCookieBlocking: function (aid) {
		if (this.cookieMap == null) {
			this.cookieMap = {};
			for (var i = 0; i < ghostery.db.lsos.length; i++) {
				if (ghostery.prefs.isSelectedCookie(ghostery.db.lsos[i].aid))
					this.cookieMap[ghostery.db.lsos[i].aid] = true;
			}
		}

		var lookup = this.cookieMap[aid];
		if (lookup) return lookup;

		if ( this.cookieDetectionPresent(aid) ) {
			lookup = false;
		}

		return lookup;
	},

	cookieDetectionPresent: function (aid) {
		if (this.cookiePresentMap == null) {
			this.cookiePresentMap = {};
			for (var i = 0; i < ghostery.db.lsos.length; i++) {
				this.cookiePresentMap[ghostery.db.lsos[i].aid] = true;
			}
		}

		return (this.cookiePresentMap[aid] ? true : false);
	},

	isNew: function(bug, type) {
		if ( (type == 'bugs') && (this.newBugs) && (this.newBugs[bug.id]) ) {
			return true;
		} else 	if ( (type == 'cookies') && (this.newCookies) && (this.newCookies[bug.id]) ) {
			return true;
		}

		return false;
	},

	getParam: function(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		 results = regex.exec(window.location.href);

		if (results == null) {
			return "";
		} else {
			return decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	},

	init: function () {
		try {
			ghostery.translator.translate();

			document.title = ghostery.translator.translateString('settings.title');
			$('#bug-list-filter-name').attr('placeholder', ghostery.translator.translateString('settings.filter.search_placeholder'));

			ghostery.prefs.startup('options');
			this.observe();

			this.bugs = [];

			var ap = null,
			 j = 0, i, temp = ghostery.prefs.updateLatestBugEntries;

			// read the scroll param
			if (this.getParam('scroll') == 'list') {
				$("#bug-list-filter-blocked").val("new");
				$('html,body').animate({
					scrollTop: $(document.getElementById('settings.tab.blocking')).offset().top
				}, 2000);
			}

			// populate the list of new bugs
			if (temp.length > 0) {
				temp = temp.split(',')
				for (i = 0; i < temp.length; i++) {
					this.newBugs[temp[i]] = true;
				}
			}

			// populate the list of new cookies
			temp = ghostery.prefs.updateLatestCookieEntries;
			if (temp.length > 0) {
				temp = temp.split(',')
				for (i = 0; i < temp.length; i++) {
					this.newCookies[temp[i]] = true;
				}
			}

			// building bugs list based on trackers
			for (i = 0; i < ghostery.db.bugs.length; i++) {
				if (ap == ghostery.db.bugs[i].aid) continue;

				ap = ghostery.db.bugs[i].aid;
				this.bugs[j] = { id: ghostery.db.bugs[i].aid, cid: ghostery.db.bugs[i].cid, name:ghostery.db.bugs[i].name, blocked: ghostery.prefs.isSelectedAppId(ghostery.db.bugs[i].aid), cookied: this.lookupCookieBlocking(ghostery.db.bugs[i].aid), detectCookie: this.cookieDetectionPresent(ghostery.db.bugs[i].aid), detectTracker: true, userCreated: ghostery.db.bugs[i].userCreated, type: ghostery.db.bugs[i].type, isNew: this.isNew(ghostery.db.bugs[i], 'bugs') };

				j++;
			}

			// adding to the bug list using lsos
			for (i = 0; i < ghostery.db.lsos.length; i++) {
				var found = false;
				for (var j = 0; j < this.bugs.length; j++) {
					var bug = this.bugs[j];
					if (bug.id == ghostery.db.lsos[i].aid) {
						found = true;
						break;
					}
				}

				if (!found) {
					this.bugs[j] = { id: ghostery.db.lsos[i].aid, cid: ghostery.db.lsos[i].cid, name:ghostery.db.lsos[i].name, blocked: ghostery.prefs.isSelectedAppId(ghostery.db.lsos[i].aid), cookied: this.lookupCookieBlocking(ghostery.db.lsos[i].aid), detectCookie: this.cookieDetectionPresent(ghostery.db.lsos[i].aid), detectTracker: false, userCreated: false, type: ghostery.db.lsos[i].type, isNew: this.isNew(ghostery.db.lsos[i], 'cookies') };

					j++;
				}
			}

			for (var i = 0; i < this.bugs.length; i++) {
				var bug = this.bugs[i];

				this.blockedCount = this.blockedCount + (bug.detectTracker ? (bug.blocked ? 1 : 0) : 0 );
				this.cookiedCount = this.cookiedCount + (bug.detectCookie ? (bug.cookied ? 1 : 0) : 0 );
			}

			this.bugs.sort(function(a, b) { var aName = a.type.toLowerCase(); var bName = b.type.toLowerCase(); return aName > bName ? 1 : aName < bName ? -1 : 0 });

			// setup cats for trackers and cookies
			this.cats['bugs']['ad'] = [];
			this.cats['bugs']['analytics'] = [];
			this.cats['bugs']['tracker'] = [];
			this.cats['bugs']['privacy'] = [];
			this.cats['bugs']['user-created'] = [];
			this.cats['bugs']['widget'] = [];
			
			for (i = 0; i < this.bugs.length; i++) {
				bug = this.bugs[i];

				if (bug.detectTracker) {
					if (!this.cats['bugs'][bug.type]) {
						this.cats['bugs'][bug.type] = [];
					}

					this.cats['bugs'][bug.type].push(bug);
					if (this.bugs[i].detectTracker) this.total_bugs++;
				}

				if (bug.detectCookie) {
					if (!this.cats['cookies'][bug.type]) {
						this.cats['cookies'][bug.type] = [];
					}

					this.cats['cookies'][bug.type].push(bug);
					if (this.bugs[i].detectCookie) this.total_cookies++;
				}
			}

			this.cat('bugs');

			if (ghostery.prefs.shareData) { this.GH$('shareData').checked = true; }
			if (ghostery.prefs.showClick2Play) { this.GH$('showClick2Play').checked = true; }
			if (ghostery.prefs.showClick2PlayButton) { this.GH$('showClick2PlayButton').checked = true; }
			if (ghostery.prefs.showBubble) { this.GH$('showBubble').checked = true; } else { this.GH$('autoDismissBubble-p').style.display = 'none'; }
			if (ghostery.prefs.expandSources) { this.GH$('expandSources').checked = true; }
			if (ghostery.prefs.bubbleTimeout) { this.GH$('bubbleTimeout').value = ghostery.prefs.bubbleTimeout; }
			if (!ghostery.prefs.panelNew) { this.GH$('panelNew').checked = true; }

			for (i = 0; i < this.GH$('alert-bubble-pos').options.length; i++) {
		  	if (this.GH$('alert-bubble-pos').options[i].value == ghostery.prefs.bubbleLocation) {
		    	this.GH$('alert-bubble-pos').options[i].selected = true;
		  	}
			}

			if (ghostery.prefs.showBugCount) { this.GH$('showBugCount').checked = true; }
			if (ghostery.prefs.enableCleanup) { this.GH$('enableCleanup').checked = true; }
			if (ghostery.prefs.autoUpdateBugs) { this.GH$('autoUpdateBugs').checked = true; }

			if (ghostery.prefs.blockImage) { this.GH$('blockImage').checked = true; }
			if (ghostery.prefs.blockFrame) { this.GH$('blockFrame').checked = true; }
			if (ghostery.prefs.blockObject) { this.GH$('blockObject').checked = true; }
			if (ghostery.prefs.preventRedirect) { this.GH$('preventRedirect').checked = true; }
			if (ghostery.prefs.toolbarButton) { this.GH$('toolbarButton').checked = true; }

			if (ghostery.prefs.updateBlockBehaviour) { this.GH$('updateBlockBehaviour').checked = true; }
			if (ghostery.prefs.updateNotification) { this.GH$('updateNotification').checked = true; }

			var lastUpdate = new Date();
			try { lastUpdate = new Date(ghostery.prefs.lastBugUpdate.getTime()); } catch (e) {}
			this.GH$('bugs-last-updated').innerHTML = ghostery.translator.translateString('settings.autoupdate.lastupdate') + ' ' + lastUpdate.toDateString() + '.';

			this.whitelist = ghostery.prefs.whitelist;
			this.whitelist.sort(function(host1, host2) {
				function min(a, b) {
					return (a < b) ? a : b;
				}

				components1 = host1.split(".").reverse();
				components2 = host2.split(".").reverse();

				for (i = 0; i < min(components1.length, components2.length); i++) {
					if (components1[i] < components2[i]) return -1;
					if (components1[i] > components2[i]) return 1;
				}

				if (components1.length > components2.length)
					return 1;
					if (components2.length > components1.length)
				        return -1;

				return 0;
			});

			this.drawWhitelist();
			this.detectConflicts();
		} catch (ex) {
	  	var cs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	  	cs.logStringMessage('GHOSTERY OPTIONS EXCEPTION');
	  	cs.logStringMessage(ex + ' on: ' + ex.lineNumber + '|' + ex.toSource());
		}
	},

	drawWhitelist: function () {
		var whitelistList = '';
		for (var i = 0; i < this.whitelist.length; i++) {
			whitelistList += '<option value="' + this.whitelist[i] + '">' + this.whitelist[i] + '</option>';
		}

		this.GH$('whitelist').innerHTML = whitelistList;
	},

	setCount: function() {
		var i, bug, filteredBlocked, catTotal, disTotal = 0, total = 0, cats = this.active;

		for(var cat in cats) {
			catTotal = 0;
			disTotal = 0;
			filteredBlocked = 0;

			for (i = 0; i < cats[cat].length; i++) {
				bug = cats[cat][i];
				catTotal = ( this.activeType == 'bugs' ? (bug.blocked ? ++catTotal : catTotal) : (bug.cookied ? ++catTotal : catTotal) );

				if ($('#bug-' + bug.id).length > 0) {
					filteredBlocked = ( this.activeType == 'bugs' ? (bug.blocked ? ++filteredBlocked : filteredBlocked) : (bug.cookied ? ++filteredBlocked : filteredBlocked) );
					disTotal++;
				}
			}

			(this.GH$('total-' + cat)) && (this.GH$('total-' + cat).textContent = catTotal);
			total += catTotal;

			if (disTotal == cats[cat].length) {
				// general case when everything is visible
				if (catTotal == cats[cat].length)
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = true) && (this.GH$('cat-' + cat).indeterminate = false);
				else
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = false) || (this.GH$('cat-' + cat).indeterminate = (catTotal != 0));
			} else {
				// case when filters are being applied
				if (filteredBlocked == disTotal)
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = true) && (this.GH$('cat-' + cat).indeterminate = false);
				else
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = false) || (this.GH$('cat-' + cat).indeterminate = (filteredBlocked != 0));
			}
		}

		this.GH$('blocked-count-2').textContent = total;
		this.GH$('total-count-2').textContent = this['total_' + this.activeType];
		this.GH$('total-count-string').textContent = ghostery.translator.translateString('settings.' + this.activeType + '.label');
	},

	selectBug: function(cat, b) {
		var bug = this.active[cat][b], toggle = ( this.activeType == 'bugs' ? 'blocked' : 'cookied' );

		if (!this.GH$('bug-' + bug.id).checked) {
			bug[toggle] = false;
		} else {
			bug[toggle] = true;
		}

		this.setCount();
	},

	siteInList: function(site) {
		for(var i = 0; i < this.whitelist.length; i++) {
			if (this.whitelist[i].toLowerCase() == site.toLowerCase())
				return true;
		}

		return false;
	},

	validNewSite: function(site) {
		if (site.length == 0) return false;

		var strutsValidator = /^[\w\-\.\*]+(\:\d{1,5}){0,1}\/*.*/;
		if (!strutsValidator.test(site)) return false;

		return true;
	},

	observe: function() {
		var _this = this;

		$('#general-tab').click(function () { _this.switchTab('g'); });
		$('#advanced-tab').click(function () { _this.switchTab('a'); });
		$('#bugs-tab').click(function () { _this.switchTab('b'); });
		$('#cookies-tab').click(function () { _this.switchTab('c'); });
		$('#sites-tab').click(function () { _this.switchTab('s'); });

		$('#expand-all-2').click(function () { _this.expandAllCats(); });
		$('#collapse-all-2').click(function () { _this.collapseAllCats(); });
		$('#select-all-2').click(function () { _this.selectAllCats(); });
		$('#select-none-2').click(function () { _this.selectAllCats(false); });

		$('#reset-search-2').click(function () {
			$('#bug-list-filter-name').val('');
			$('#bug-list-filter-blocked').val('all');
			_this.cat();
			$("html,body").animate({ scrollTop: $('#tabs-bugs').offset().top - 5 }, 0);
		});

		// hover effect
		$('#bug-list-table-2').on('mouseenter mouseleave', 'tbody', function (e) {
			var $el = $(this);
			if (!$el.hasClass('category-row')) {
				$el = $el.prev('tbody');
			}
			if (e.type === 'mouseenter') {
				$el.addClass('hover');
			} else {
				$el.removeClass('hover');
			}
		});

		this.GH$('showBubble').addEventListener('click', function () {
			if (_this.GH$('showBubble').checked) {
				_this.GH$('autoDismissBubble-p').style.display = '';
			} else {
				_this.GH$('autoDismissBubble-p').style.display = 'none';
			}
		}, true);

		this.GH$('bug-list-filter-name').addEventListener('keyup', function() {
			_this.cat();
			$("html,body").animate({ scrollTop: $('#tabs-bugs').offset().top - 5 }, 0);
		}, true);

		this.GH$('bug-list-filter-blocked').addEventListener('change', function() {
			_this.cat();
			$("html,body").animate({ scrollTop: $('#tabs-bugs').offset().top - 5 }, 0);
		}, true);

		this.GH$('whitelist-add-button').addEventListener('click', function (e) {
			var site = _this.GH$('whitelist-add-input').value;
			if (site.toLowerCase().indexOf('://') >= 0) {
				site = site.slice(3 + site.toLowerCase().indexOf('://'))
			}

			if (site.toLowerCase().indexOf('/') >= 0) {
				site = site.substring(0, site.toLowerCase().indexOf('/'));
			}

			if (!_this.validNewSite(site)) return;

			var sites = document.getElementById("whitelistBox");
			if (!_this.siteInList(site)) {
				_this.whitelist.push(site);
			}

			_this.drawWhitelist();
			_this.GH$('whitelist-add-input').value = '';
			_this.GH$('whitelist-add-input').focus();
		}, true);

		this.GH$('whitelist-remove-button').addEventListener('click', function (e) {
			for (var i = 0; i < _this.GH$('whitelist').options.length; i++) {
				var s = _this.GH$('whitelist').options[i];
				if (s.selected) {
					var index = _this.whitelist.indexOf(s.value);
					if (index != -1) _this.whitelist.splice(index, 1);
				}
			}

			_this.drawWhitelist();
		}, true);

		this.GH$('whitelist-remove-all-button').addEventListener('click', function (e) {
			_this.whitelist = [];
			_this.drawWhitelist();
		}, true);

		this.GH$('save_button').addEventListener('click', this.save, true);

		this.GH$('cancel_button').addEventListener('click', this.closeWindow, true);

		window.onbeforeunload = function() {
			if ( (_this.changes) && (!_this.cancel) ) {
				return 'It appears you have made configuration changes.\nIf you would like them to be saved, please press Cancel\nand then Save on the bottom of this page.';
			}

			ghostery.prefs.shutdown();
		};

		this.observeForChange();
	},

	observeForChange: function() {
		this.GH$('panelNew').addEventListener('click', function () { ghostery.options.restart = true; ghostery.options.changes = true; }, true);
		this.GH$('shareData').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('blockImage').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('blockFrame').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('showBubble').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('expandSources').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('blockObject').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('enableCleanup').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('showClick2Play').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('autoUpdateBugs').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('preventRedirect').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('updateNotification').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('whitelist-add-button').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('updateBlockBehaviour').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('showClick2PlayButton').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('whitelist-remove-button').addEventListener('click', function () { ghostery.options.changes = true; }, true);
		this.GH$('whitelist-remove-all-button').addEventListener('click', function () { ghostery.options.changes = true; }, true);
	},

	getSelectedBugs: function(type) {
		var selectedBugs = [],
		 selectedApps = {},
		 n = (type == 'blocked' ? 'bugs' : 'lsos'),
		 m = (type == 'blocked' ? 'detectTracker' : 'detectCookie'),
		 i;

		for (i = 0; i < this.bugs.length; i++) {
			if ( (this.bugs[i][m]) && (this.bugs[i][type]) )
				selectedApps[this.bugs[i].id] = true;
		}

		for (i in selectedApps) {
			selectedBugs.push(i);
		}

		return selectedBugs;
	},

	save: function(e) {
		var _this = ghostery.options, temp = '', i;

		_this.changes = false;

		for(i = 0; i < _this.whitelist.length; i++) {
			if (i != 0) temp += ",";
			temp += _this.whitelist[i];
		}
		ghostery.prefs.setWhiteList(temp);

		ghostery.prefs.set('showBubble', _this.GH$('showBubble').checked);
		ghostery.prefs.set('expandSources', _this.GH$('expandSources').checked);
		ghostery.prefs.set('showBugCount', _this.GH$('showBugCount').checked);
		ghostery.prefs.set('autoUpdateBugs', _this.GH$('autoUpdateBugs').checked);
		ghostery.prefs.set('shareData', _this.GH$('shareData').checked);
		ghostery.prefs.set('enableCleanup', _this.GH$('enableCleanup').checked);
		ghostery.prefs.set('showClick2Play', _this.GH$('showClick2Play').checked);
		ghostery.prefs.set('showClick2PlayButton', _this.GH$('showClick2PlayButton').checked);
		ghostery.prefs.set('panelNew', !_this.GH$('panelNew').checked);

		ghostery.prefs.set('blockImage', _this.GH$('blockImage').checked);
		ghostery.prefs.set('blockFrame', _this.GH$('blockFrame').checked);
		ghostery.prefs.set('blockObject', _this.GH$('blockObject').checked);
		ghostery.prefs.set('preventRedirect', _this.GH$('preventRedirect').checked);
		ghostery.prefs.set('toolbarButton', _this.GH$('toolbarButton').checked);

		ghostery.prefs.set('updateBlockBehaviour', _this.GH$('updateBlockBehaviour').checked);
		ghostery.prefs.set('updateNotification', _this.GH$('updateNotification').checked);

		try {
			if (parseInt(_this.GH$('bubbleTimeout').value) > 0)
				ghostery.prefs.set('bubbleTimeout', parseInt(_this.GH$('bubbleTimeout').value));
		} catch (e) {}

		for (i = 0; i < _this.GH$('alert-bubble-pos').options.length; i++) {
		  if (_this.GH$('alert-bubble-pos').options[i].selected) {
		  	temp = _this.GH$('alert-bubble-pos').options[i].value;
		  }
		}

		ghostery.prefs.set('bubbleLocation', temp);

		var selectedBugs = _this.getSelectedBugs('blocked');
		var selectedCookies = _this.getSelectedBugs('cookied');

		if (selectedBugs.length == 0) {
			ghostery.prefs.set('blockingMode',  -1);
		} else {
			ghostery.prefs.set('blockingMode',  0);
		}

		if (selectedCookies.length == 0) {
			ghostery.prefs.set('cookieProtect',  false);
		} else {
			ghostery.prefs.set('cookieProtect',  true);
		}

		ghostery.prefs.writeSelectionFile('bugs', selectedBugs);
		ghostery.prefs.writeSelectionFile('lsos', selectedCookies);

		ghostery.prefs.shutdown();

		// Let Ghostery chrome know there are option changes.
		temp = document.createEvent('Events');
		temp.initEvent('GhosteryOptionsSaveEvent', true, false);
		document.body.dispatchEvent(temp);

		if (_this.restart) {
			var confirmRestart = confirm('You have changed the display setting for the panel.\nThis change requires a browser restart.\nDo you want to restart the browser now?');

			if (confirmRestart == true) {
				var boot = Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(Components.interfaces.nsIAppStartup);
				boot.quit(Components.interfaces.nsIAppStartup.eForceQuit|Components.interfaces.nsIAppStartup.eRestart);
			}
		}

		$.modal('<div align="center"><h2>' + ghostery.translator.translateString('settings.saving') + '</h2></div>');
		setTimeout(function() { _this.closeWindow(); }, 1000);
	},

	closeWindow: function() {
		ghostery.options.cancel = true;

		if (ghostery.options.isLastTab()) {
			document.location.href = 'about:blank';
		} else {
			window.close();
		}
	},

	update: function() {
		var ev = document.createEvent('Events');
		ev.initEvent('GhosteryUpdateEvent', true, false);
		document.getElementById('update-now-link').dispatchEvent(ev);
	},

	isLastTab: function() {
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator),
		 browserEnumerator = wm.getEnumerator("navigator:browser"),
		 tabs = 0;

		try {
			while (browserEnumerator.hasMoreElements()) {
	    	tabs += browserEnumerator.getNext().gBrowser.browsers.length;
	    }
  	} catch (err) {}

		return (tabs == 1 ? true : false);
	},

	switchTab: function(dest) {
		var g = this.GH$('general-tab').parentNode,
			a = this.GH$('advanced-tab').parentNode,
			go = this.GH$('general-options'),
			ao = this.GH$('advanced-options');

		if ( (dest == 'g') || (dest == 'a') ) {
			if (dest == 'g') {
				if (g.className != 'active') {
					a.className = '';
					ao.style.display = 'none';

					g.className = 'active';
					go.style.display = '';
				}
			} else if (dest == 'a') {
				if (a.className != 'active') {
					g.className = '';
					go.style.display = 'none';

					a.className = 'active';
					ao.style.display = '';
				}
			}
		} else {
			g = this.GH$('bugs-tab').parentNode,
			a = this.GH$('cookies-tab').parentNode;
			var s = this.GH$('sites-tab').parentNode;

			if (dest == 'b') {
				if (g.className != 'active') {
					a.className = '';
					g.className = 'active';
					s.className = '';
					$('#whitelist-div').hide();
					$('#bug-list-table-2').show();

					this.cat('bugs');
				}
			} else if (dest == 'c') {
				if (a.className != 'active') {
					g.className = '';
					a.className = 'active';
					s.className = '';
					$('#whitelist-div').hide();
					$('#bug-list-table-2').show();

					this.cat('cookies');
				}
			} else {
				if (s.className != 'active') {
					g.className = '';
					a.className = '';
					s.className = 'active';

					//this.cat('sites');
					$('#whitelist-div').show();
					$('#bug-list-table-2').hide();
				}
			}

			$("html,body").animate({ scrollTop: $('#tabs-bugs').offset().top - 5 }, 0);
		}
	},

	expandAllCats: function() {
		for(var cat in this.active) {
			try {
				if (!this.GH$('selector-' + cat).xpanded) {
					this.GH$('selector-' + cat).xpanded = true;
					this.GH$('selector-' + cat).innerHTML = '<img src="images/down.gif" width="18" height="18" />';
					$('#bug-n-cat-' + cat).show();
				}
			} catch (e) {}
		}
	},

	collapseAllCats: function() {
		for (var cat in this.active) {
			try {
				this.GH$('selector-' + cat).xpanded = false;
				this.GH$('selector-' + cat).innerHTML = '<img src="images/right.gif" width="18" height="18" />';
				$('#bug-n-cat-' + cat).hide();
			} catch (e) {}
		}
	},

	selectAllCats: function(select) {
		if (select === undefined) {
			select = true;
		}

		for(var cat in this.active) {
			(this.GH$('cat-' + cat)) && (this.GH$('cat-' + cat).checked = !!select);
			this.selectCat(cat);
		}
	},

	isFiltered: function(bug) {
		var isFiltered = false,
		 mode = this.GH$('bug-list-filter-blocked').value,
		 filterText = this.GH$('bug-list-filter-name').value.toLowerCase();

		if (mode == 'blocked') {
			if ( (this.activeType == 'bugs') && (!bug.blocked) ) { isFiltered = true; }
			else if ( (this.activeType == 'cookies') && (!bug.cookied) ) { isFiltered = true; }
		} else if (mode == 'unblocked') {
			if ( (this.activeType == 'bugs') && (bug.blocked) ) { isFiltered = true; }
			else if ( (this.activeType == 'cookies') && (bug.cookied) ) { isFiltered = true; }
		} else if (mode == 'new') {
			if ( (this.activeType == 'bugs') && (!bug.isNew) ) { isFiltered = true; }
			else if ( (this.activeType == 'cookies') && (!bug.isNew) ) { isFiltered = true; }
		}

		if ( (filterText.length > 0) && (filterText) ) {
			if ( bug.name.toLowerCase().indexOf(filterText) < 0 ) { isFiltered = true; }
		}

		return isFiltered;
	},

	selectCat: function(cat) {
		var bug, c = this.GH$('cat-' + cat), toggle = ( this.activeType == 'bugs' ? 'blocked' : 'cookied' ), selecting;

		if (!c) return;

		if (c.checked) {
			// select
			for (var i = 0; i < this.active[cat].length; i++) {
				bug = this.active[cat][i];

				if ($('#bug-' + bug.id).length == 0) continue;

				(this.GH$('bug-' + this.active[cat][i].id)) && (this.GH$('bug-' + this.active[cat][i].id).checked = true);
				this.active[cat][i][toggle] = true;
			}
		} else {
			// unselect
			for (var i = 0; i < this.active[cat].length; i++) {
				bug = this.active[cat][i];

				if ($('#bug-' + bug.id).length == 0) continue;

				(this.GH$('bug-' + this.active[cat][i].id)) && (this.GH$('bug-' + this.active[cat][i].id).checked = false);
				this.active[cat][i][toggle] = false;
			}
		}

		this.setCount();
	},

	showCat: function(cat) {
		if (!this.GH$('selector-' + cat).xpanded) {
			this.GH$('selector-' + cat).xpanded = true;
			this.GH$('selector-' + cat).innerHTML = '<img src="images/down.gif" width="18" height="18">';

			$('#bug-n-cat-' + cat).slideDown();
			$("html,body").animate({
				scrollTop: $('#bug-n-cat-' + cat).prev('tbody').offset().top - 50
			});

		} else {
			this.GH$('selector-' + cat).xpanded = false;
			this.GH$('selector-' + cat).innerHTML = '<img src="images/right.gif" width="18" height="18">';

			$('#bug-n-cat-' + cat).slideUp();
		}
	},

	cat: function(type) {
		this.activeType = (type ? type : this.activeType);

		var i, bug, filtered = false, header, rows, even, catTotal, total = 0,
		 cats = this.cats[this.activeType];

		this.active = cats;

		$('#bug-list-table-2 tbody').remove();
		$('#group-note').html(ghostery.translator.translateString('settings.' + this.activeType + '.note'));

		for (var cat in cats) {
			even = 'background-color: #e7f4fc;';

			header = '<tr><td onclick="ghostery.options.showCat(\'' + cat + '\');"><span id="selector-' + cat + '"><img src="images/right.gif" width="18" height="18"></span></td><td ><input type="checkbox" class="bug-checkbox" id="cat-' + cat + '" onclick="ghostery.options.selectCat(\'' + cat + '\');" ' + ( (this.activeType == 'cookies' && this.disableCookieProtection) ? 'disabled': '') + '></td><td style="width:100%" onclick="ghostery.options.showCat(\'' + cat + '\');"><span class="category-name hotspot" onmouseover="tooltip.show(\'' + this.CATEGORIES[cat].pop + '\', false);" onmouseout="tooltip.hide();">' + this.CATEGORIES[cat].full + '</span> <span style="font-size:x-small;">' + cats[cat].length + ' '  + ghostery.translator.translateString('settings.elements') + '</span> <span style="font-size:x-small;" >(<span id="total-' + cat + '"></span> ' + ghostery.translator.translateString('settings.count.blocked') + ')</span></td></tr>';

			catTotal = 0;
			rows = '';
			for (i = 0; i < cats[cat].length; i++) {
				bug = cats[cat][i];

				if (this.isFiltered(bug)) {
					filtered = true;
					continue;
				}

				var str = '<tr role="row" style="width:' + $('#bug-list-table-2 thead').width() + 'px;' + even + '">';
				str += '<td><img src="images/right.gif" style="visibility:hidden" width="18" height="18"></td><td><input type="checkbox" class="bug-checkbox" id="bug-' + bug.id + '" onclick="ghostery.options.selectBug(\'' + cat + '\', ' + i + ');" ' + ( this.activeType == 'bugs' ? (bug.blocked ? 'checked="true"' : '') : (bug.cookied ? 'checked="true"' : '') ) + ( (this.activeType == 'cookies' && this.disableCookieProtection) ? 'disabled': '') + '>';
				str += '</td><td style="width:100%">' + (bug.userCreated ? (bug.name + ' (Locally added)') : '<a onclick="ghostery.options.showAppInfo(\'' + cat + '\', ' + i + '); return false;" target="_blank" href="http://www.ghostery.com/apps/' + encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase()) + '">' + bug.name + '</a>');

				str += '</td></tr>';

				str += '<tr><td colspan="3" style="display:none;"><div style="display:none;" id="bug-app-info-' + bug.id + '" role="contentinfo"></div></td></tr>';

				++catTotal;

				rows += str;

				if (even == '') even = 'background-color: #e7f4fc;'; else even = '';
			}

			if (rows) {
				$('#bug-list-table-2')
					.append($('<tbody class="category-row"></tbody>').append(header) )
					.append($('<tbody class="category-bugs"></tbody>').attr( 'id', 'bug-n-cat-' + cat ).hide().append(rows) );
			}

			total += catTotal;
		}

		if (total == 0) {
			$('#bug-list-table-2')
				.append($('<tbody></tbody>').append('<tr><td>' + ghostery.translator.translateString('settings.noresults') + '</td></tr>') );
		}

		this.setCount();

		if (filtered) {
			// expand cats
			this.expandAllCats();
		}
	},

	fetchAppInfo: function(bug) {
		var cell = $('#bug-app-info-' + bug.id),
			leftMargin = $('#bug-' + bug.id).parent().width() + $('#bug-' + bug.id).parent().prev().width();

		cell.append('<div class="loadbox" style="height:150px;align:center;text-align:center;"><img style="padding-top:65px;" src="chrome://ghostery/content/images/s1.gif" width="24" height="24"></div>');
		cell.slideDown(null, function () {
			cell.parent().parent().scrollIntoGreatness();
		});

		$.ajax({
			cache: false,
			dataType: 'json',
			url: 'http://www.ghostery.com/apps/' + encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase()) + '?format=json',
			complete: function (xhr, status) {
				$('#bug-app-info-' + bug.id + ' div.loadbox').remove();

				if (status == 'success') {
					var ci = JSON.parse(xhr.responseText),
					 apps = '', i;
					ci['ca'] = [];

					for (i in ci.company_app) {
						ci['ca'].push(ci.company_app[i].ca_name);
					}

					ci['ag'] = [];

					if (ci.affiliation_groups.length > 0) {
						for (i in ci.affiliation_groups) {
							ci['ag'].push('<img height="20" src="' + ci.affiliation_groups[i].ag_logo_url + '"/>');
						}
					} else {
						ci['ag'] = ['None'];
					}
					
					var operates = '';

					if ( ci['ca'].length > 1 ) {
						operates = '<p class="multi-app">' + ci.company_name + ' operates: ' + ci['ca'].join(', ') + ' </p>';
					} else if ( (ci['ca'].length == 1) && (ci.company_name != bug.name)) {
						operates = '<p class="multi-app">' + ci.company_name + ' operates: ' + ci['ca'].join(', ') + ' </p>';
					}

					// slide down
					cell.parent().css('display', '').addClass('app-info-shown');
					cell.css('margin-left', leftMargin + 20);
					cell.append('<div class="aboutbox"><img class="company-logo" src="'
						+ ci.company_logo_url + '"><h1>About ' + ci.company_name + ':</h1>'
						+ operates
						+ '<p class="company-desc">'
						+ ci.company_description + '</p><p class="company-site"><h2>Website: </h2><a href="'
						+ ci.company_website_url + '" rel="nofollow" target="_blank">' + ci.company_website_url
						+ '</a></p><p class="company-affiliations"><h2>Industry Affiliations:</h2> '
						+ ci['ag'].join(' ') + '</p><div><h2><a target="_blank" href="http://www.ghostery.com/apps/'
						+ encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase())
						+ '">Continue to full profile</a></h2></div></div>');

				} else {
					// happens when our site is down, profile errors out, or user is offline

					// slide down
					cell.parent().css('display', '').addClass('app-info-shown');
					cell.css('margin-left', leftMargin + 20);
					cell.append('<div class="aboutbox"><h1>Unable to load data from ghostery.com</h1> <a target="_blank" href="http://www.ghostery.com/apps/' + encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase()) + '">Continue to full profile</a></h2></div>');

				}

				cell.slideDown(null, function () {
					cell.parent().parent().scrollIntoGreatness();
				});
			}
		});
	},

	closeAppInfo: function(el) {
		$(el).slideUp(null, function () {
			$(el).parent().css('display', 'none').removeClass('app-info-shown');
		});
		el.xpanded = false;
	},

	showAppInfo: function(cat, bugId) {
		var bug = this.active[cat][bugId],
			cell = $('#bug-app-info-' + bug.id),
			self = this;

		if (!cell[0].xpanded) {
			// close any other aboutboxes, if open
			$('td.app-info-shown > div').not(cell[0]).each(function () {
				self.closeAppInfo(this);
			});

			cell.parent().css('display', '').addClass('app-info-shown');

			if ($('#bug-app-info-' + bug.id + ' div.aboutbox').length > 0) {
				// mini profile already loaded
				cell.slideDown(null, function () {
					cell.parent().parent().scrollIntoGreatness();
				});
			} else {
				this.fetchAppInfo(bug);
			}

			cell[0].xpanded = true;

		} else {
			// slide up
			this.closeAppInfo(cell[0]);
		}
	},

	ghostRankMore: function() {
		var el = $('#ghostrank-moreinfo');
		if (!el[0].xpanded) {
			el[0].xpanded = true;
			el.slideDown('slow', function() {
				$('#settings\\.more\\.info\\.span').hide();
		  });			
		} else {
			el[0].xpanded = false;
			el.slideUp();
		}
	}
};

/* tooltip. courtesy of: http://sixrevisions.com/tutorials/javascript_tutorial/create_lightweight_javascript_tooltip */
var tooltip=function(){
 var id = 'tt';
 var top = 3;
 var left = 3;
 var maxw = 800;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,timed,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    t = document.createElement('div');
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.setAttribute('id',id + 'bot');
    tt.appendChild(t);
    tt.appendChild(c);
    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
  	document.onmousemove = this.pos;
	 }

	 if (timed) {
   	document.onmousemove = function(e){
	   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
	   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
	   tt.style.top = (u - h) + 'px';
	   tt.style.left = (l + left) + 'px';
	   document.onmousemove = null;
	  };
   } else {
   	document.onmousemove = this.pos;
   }

   tt.style.display = 'block';

   if (document.getElementById(v)) {
   		c.innerHTML = document.getElementById(v).innerHTML;
   } else {
			c.innerHTML = v;
   }

   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
    t.style.display = 'none';
    b.style.display = 'none';
    tt.style.width = tt.offsetWidth;
    t.style.display = 'block';
    b.style.display = 'block';
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;

 	clearInterval(tt.timer);
 	tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = (u - h) + 'px';
   tt.style.left = (l + left) + 'px';
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();
