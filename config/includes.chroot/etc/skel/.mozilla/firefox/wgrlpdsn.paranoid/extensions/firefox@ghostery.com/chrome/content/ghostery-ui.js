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

ghostery.ui = {
	/* Functions to deal with property files */
	getBundle: function() {
		return document.getElementById( "ghostery-strings" );
	},

	// Access our resource bundle
	getString: function( key ) {
		var bundle = this.getBundle();
		var text = bundle.getString( key );
		if( text ) return text;

		return key;
	},

	getFormattedString: function( key, argv ) {
		var bundle = this.getBundle();
		return bundle.getFormattedString( key, argv );
	},

	/* Functions to build dynamic menu */
	removeChildren: function(container) {
		var children = container.childNodes;
		for( var i = children.length - 1; i >= 0; i-- ) {
			var node = children[i];
			container.removeChild(node);
		}
	},

	addMenuItem: function(popup, callback, label, value, img) {
		var item = document.createElement("menuitem");
		item.setAttribute("label", label);
		item.setAttribute("class", "menu-item");
		if ( value ) item.setAttribute("value", value);

		item.addEventListener( "command", callback, false );

		if ( img ) { 
			item.setAttribute("image", img);
			item.setAttribute("class", "menuitem-iconic");
		} else {
			item.setAttribute("class", "ident");
		}
		popup.appendChild(item);

		return item;
	},

	// Add Popup header with Ghostery Icon
	addMenuHeader: function(menu, label) {
		var item = document.createElement("toolbarbutton");
		item.setAttribute("label", label );
		item.setAttribute("class", "menu-header");
		item.setAttribute("image","chrome://ghostery/content/ghostery-16x16.png");
		menu.appendChild(item);
		return item;    
	},

	// Build Script Menu
	buildScriptMenu: function(menu, bugInfo, insertBefore) {
		var bug = bugInfo.bug;
		var script = bugInfo.script;
		var submenu = document.createElement("menu");
		submenu.setAttribute("label", script );
		submenu.setAttribute("tooltiptext", script);
		submenu.setAttribute("class", "script-url-item");

		if (!insertBefore) {
			menu.appendChild(submenu);
		} else {
			var markedSeparator = document.getElementById('ghostery-submenu-separator-' + bug.aid);	
			menu.insertBefore(submenu, markedSeparator);
		}

		var popup = document.createElement("menupopup");
		popup.setAttribute("class", "webbug-popup ");

		submenu.appendChild(popup);

		var item = document.createElement("menuitem");
		item.setAttribute("label", "View Script Source");
		item.setAttribute("value", script);

		item.addEventListener( "command", function() { ghostery.ui.showScriptSource(bug.name, script) }, false );

		popup.appendChild(item);
	},

	// Build Bug Menu and sub menu
	buildBugMenu: function(popup, bugInfo, isWhitelisted) {
		var bug = bugInfo.bug;
		var p = ghostery.prefs;

		try {
			var bugEl = document.getElementById('ghostery-menu-' + bug.aid);
			if (bugEl) {
				var bugSub = document.getElementById('ghostery-submenu-' + bug.aid);
				this.buildScriptMenu(bugSub, bugInfo, true);

				return;
			}
		} catch (e) {}

		var bugmenu = document.createElement("menu");
		bugmenu.setAttribute("id", 'ghostery-menu-' + bug.aid);
		bugmenu.setAttribute("label", bug.name);

		try { var host = (gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location); } catch (e) {}

		var userSiteSelections = ghostery.prefs.getWhitelistedDatabase(host);

		if (!isWhitelisted && p.shouldBlockBug(bug.aid, userSiteSelections)) {
			bugmenu.setAttribute("class", "blocked-bug");
		}

		popup.appendChild(bugmenu);

		var subpop = document.createElement("menupopup");
		subpop.setAttribute("id", 'ghostery-submenu-' + bug.aid);
		subpop.setAttribute("class", "webbug-popup ");
		bugmenu.appendChild(subpop);

		var item = document.createElement("menuitem");
		if ( !bug.userCreated ) {
			var label = this.getFormattedString( "menu.whatis", [ bug.name ] );
			item.setAttribute("label", label);
			item.setAttribute("value", bug.name );
			item.addEventListener( "command", function() { ghostery.ui.showBugDirectory(this.value) }, false );

			item.setAttribute("class", "menu-bug-whatis");
		} else {
			var label = this.getFormattedString( "menu.usersupplied", [ bug.name ] );
			item.setAttribute("label", label);
			item.setAttribute("value", bug.name);
			item.setAttribute("class", "menu-bug-whatis");
		}
		subpop.appendChild(item);

		// Add Script submenu
		subpop.appendChild(document.createElement("menuseparator"));
		this.buildScriptMenu(subpop, bugInfo);

		// Add Blocking submenu
		var markedSeparator = document.createElement("menuseparator");
		markedSeparator.setAttribute('id', 'ghostery-submenu-separator-' + bug.aid);
		subpop.appendChild(markedSeparator);

		item = document.createElement("menuitem");
		item.setAttribute("type", "checkbox");
		item.setAttribute("name", "block" + bug.aid);
		item.setAttribute("value", bug.aid);
		item.setAttribute("checked", "" + p.isSelectedAppId(bug.aid));
		item.setAttribute("label", this.getFormattedString("menu.blocking.block", [bug.name]));

		if (p.isSelectedAppId(bug.aid)) { item.setAttribute("class", "bug-icon-block"); }
		item.addEventListener( "command", function() { ghostery.ui.checkBlocking(this.value); }, false );

		subpop.appendChild(item);
	},

	checkBlocking: function(bugId) {
		try {
			var p = ghostery.prefs;

			p.toggleSelectedBug(bugId);
			p.togglePause(true);
		} catch (e) { }
	},

	mainPopupControl: function(c) {
		var popup = document.getElementById('ghostery-popup');

		if ( (c === 's') && (popup.state == 'showing') ) {
			ghostery.ui.getMenuPopup();
		}
	},

	getMenuPopup: function() {
		var popup = document.getElementById("ghostery-popup");

		this.removeChildren(popup);

		var site = '';

		try {
			site = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString().toLowerCase();
		} catch (e) {}

		var isWhitelisted = ghostery.prefs.isWhiteListed(site);

		// Show bugs found as top menu
		try {
			// rearranging the array to be by aid
			var bugs = ghostery.currentBugs;

			// if bugs were found generate dynamic list
			if (bugs && bugs.length > 0) {
				// Add Title since web bugs were found
				this.addMenuHeader(popup, this.getString("menu.bugsfound"));

				for(var i = 0; i < bugs.length; i++) {
					this.buildBugMenu(popup, bugs[i], isWhitelisted);                
				}

				popup.appendChild(document.createElement("menuseparator"));
			} else {
				this.addMenuHeader(popup, this.getString("statusbar.nothing_found_label"));
			}
		} catch (e) { }

		// add static footer options
		this.getMenuFooter(popup, isWhitelisted);
	},

	// Include static menu items
	getMenuFooter: function(popup, isWhitelisted) {
		var dis = document.createElement("menuitem");
		dis.setAttribute("type", "checkbox");
		dis.setAttribute("value", 0);
		dis.setAttribute("checked", ghostery.prefs.paused);
		dis.setAttribute("label", ( ghostery.prefs.paused ? this.getString("menu.resume") : this.getString("menu.pause") ) );

		if (ghostery.prefs.paused) {
			dis.setAttribute("class", "bug-icon-block");
		}

		dis.addEventListener( "command", function() { ghostery.prefs.togglePause(); }, false );
		popup.appendChild(dis);

		var item = document.createElement("menuitem");
		item.setAttribute("type", "checkbox");
		item.setAttribute("value", 0);
		item.setAttribute("checked", "" + isWhitelisted);
		item.setAttribute("label", this.getString("menu.whitelist_site") );

		if (isWhitelisted) {
			item.setAttribute("class", "bug-icon-block");
			item.addEventListener( "command", function() { ghostery.prefs.deWhitelistCurrentSite(); }, false );
		} else {
			item.addEventListener( "command", function() { ghostery.prefs.whitelistCurrentSite(); }, false );
		}

		popup.appendChild(item);

		this.addMenuItem(popup, function() { ghostery.ui.openBrowserTab(this.value) }, this.getString("menu.help"), 'help/firefox');
		this.addMenuItem(popup, function() { ghostery.ui.showOptionsDialog() }, this.getString("menu.options"), 'options');
		popup.appendChild( document.createElement("menuseparator"));
		this.addMenuItem(popup, function() { ghostery.ui.openBrowserTab(this.value) }, this.getString("menu.share"), 'share');
		popup.appendChild(document.createElement("menuseparator"));
		this.addMenuItem(popup, function() { ghostery.db.updateDatabase(true) }, this.getString("menu.list_update"), 'remote/update');
		this.addMenuItem(popup, function() { ghostery.ui.openBrowserTab(this.value) }, this.getString("menu.feedback"), 'feedback');
		this.addMenuItem(popup, function() { ghostery.ui.showAboutDialog() }, this.getString("menu.about"), 'about');
	},

	showBlockLogDialog: function() {
		window.openDialog('chrome://ghostery/content/block.xul', 'ghostery-about-dialog', 'centerscreen,chrome,modal');
	},

	showAboutDialog: function() {
		window.openDialog('chrome://ghostery/content/about.xul', 'ghostery-about-dialog', 'centerscreen,chrome,modal');
	},

	showOptionsDialog: function() {
		gBrowser.selectedTab = gBrowser.addTab('chrome://ghostery/content/options.html');
	},

	showScriptSource: function(bug_name, script_url) {
		bug_name = encodeURIComponent(window.btoa(bug_name));
		script_url = encodeURIComponent(window.btoa(script_url));
		var url = 'http://www.ghostery.com/gcache/?n=' + bug_name + '&s=' + script_url;
		gBrowser.selectedTab = gBrowser.addTab(url);
	},

	showBugDirectory: function(bug) {
		bug = bug.replace(/\s+/g, "_");
		bug = bug.toLowerCase();
		var path = 'apps/' + encodeURIComponent(bug);
		this.openBrowserTab(path);
	},

	openBrowserTab2: function( url ) {
		url = 'http://' + url + '.ghostery.com/'
		gBrowser.selectedTab = gBrowser.addTab(url);
	},

	openBrowserTab: function( url ) {
		url = ghostery.prefs.siteURL + url;
		gBrowser.selectedTab = gBrowser.addTab(url);
	},

	openWalkthrough: function() {
		gBrowser.selectedTab = gBrowser.addTab('chrome://ghostery/content/wizard.html');
	},
	panelOneTimeStuff: true,
	panelFrame: null,
	panelLoaded: false,
	num_apps: 0,
	tutorialArrowBlinkTimeout: 0,
	tutorialArrowBlinkInterval: 0,
	needsReload: {},
	newPanelNotificationCount: 0,
	showPanel: function(e) {
		if (!ghostery.prefs.panelNew) {
			return;
		}

		var panel = document.getElementById('ghostery-panel');

		if (!panel) {
			panel = document.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'panel');
			panel.setAttribute('type', 'arrow');
			panel.setAttribute('id', 'ghostery-panel');

			let css = '.panel-inner-arrowcontent, .panel-arrowcontent {padding: 0;}';
			let originalXBL = 'chrome://global/content/bindings/popup.xml#arrowpanel';
			let binding = 
				'<bindings xmlns="http://www.mozilla.org/xbl">' +
					'<binding id="id" extends="' + originalXBL + '">' + 
						'<resources>' + 
							'<stylesheet src="data:text/css,' + 
							document.defaultView.encodeURIComponent(css) + '"/>' +
						'</resources>' +
					'</binding>' +
				'</bindings>';
			panel.style.MozBinding = 'url("data:text/xml,' + document.defaultView.encodeURIComponent(binding) + '")';
			panel.style.border = '0px';

			let frame = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", 'iframe');
//			frame.setAttribute('type', 'content');
			frame.setAttribute('flex', '1');
			frame.setAttribute('transparent', 'transparent');
			frame.setAttribute('src', 'chrome://ghostery/content/popup.html'); 
			frame.setAttribute('id', 'ghostery-panel-frame');
			frame.style.border = '0px';

			frame.addEventListener('DOMContentLoaded', function () {
				ghostery.ui.panelLoaded = true;
			});

			panel.appendChild(frame);
			document.getElementById("mainPopupSet").appendChild(panel);

			panel.firstChild.style.height = '0px';
			panel.style.width = '347px';
		}

		function waitForBinding() {
			if (!panel.openPopup || !ghostery.ui.panelLoaded) {
				setTimeout(function() {waitForBinding();}, 50);
				return;
			}

			ghostery.ui.displayApps();
			if (e) {
				panel.openPopup( document.getElementById('ghostery-status') , 'before_start' , 0 , 0 , true, true, null );
			} else {
				panel.openPopup( document.getElementById('ghostery-toolbar-button') , 'before_start' , 0 , 0 , true, true, null );
			}
			ghostery.ui.adjustWidth(panel);

			ghostery.ui.panelFrame = document.getElementById('ghostery-panel-frame').contentWindow.document;
			panel.firstChild.style.height = ( ghostery.ui.panelFrame.body.offsetHeight + 10) + "px";

			if (ghostery.ui.panelOneTimeStuff) {
				ghostery.ui.panelFrame.getElementById('pause-blocking-button').addEventListener('click', ghostery.ui.togglePauseButton, true);

				ghostery.ui.panelFrame.getElementById('options-button').addEventListener('click', function() { ghostery.ui.showOptionsDialog(); panel.hidePopup(); }, true);
				ghostery.ui.panelFrame.getElementById('feedback-button').addEventListener('click', function() { gBrowser.selectedTab = gBrowser.addTab('http://www.ghostery.com/feedback'); panel.hidePopup(); }, true);
				ghostery.ui.panelFrame.getElementById('support-button').addEventListener('click', function() { gBrowser.selectedTab = gBrowser.addTab('http://www.ghostery.com/help/firefox'); panel.hidePopup(); }, true);
				ghostery.ui.panelFrame.getElementById('share-button').addEventListener('click', function() { gBrowser.selectedTab = gBrowser.addTab('http://www.ghostery.com/share'); panel.hidePopup(); }, true);
				ghostery.ui.panelFrame.getElementById('settings-button').addEventListener('click', function() { ghostery.ui.toggleSettings(); }, true);
				ghostery.ui.panelFrame.getElementById('tutorial-support').addEventListener('click', function () { gBrowser.selectedTab = gBrowser.addTab('http://getsatisfaction.com/ghostery'); panel.hidePopup(); }, true);
				ghostery.ui.panelFrame.getElementById('tutorial-email').addEventListener('click', function () { panel.hidePopup(); }, true);

				ghostery.ui.panelFrame.getElementById('reload').getElementsByTagName('span')[0].addEventListener('click', function() {
					ghostery.ui.needsReload[gBrowser.selectedBrowser.contentDocument.location.href] = false;
					gBrowser.selectedBrowser.reload();
					panel.hidePopup();
				});
				ghostery.ui.panelFrame.getElementById('reload-close').addEventListener('click', function() {
					ghostery.ui.needsReload[gBrowser.selectedBrowser.contentDocument.location.href] = false;
					this.parentNode.style.display = 'none';
				});

				ghostery.ui.panelFrame.getElementById('tutorial-arrow-right').addEventListener('click', function() {
					ghostery.ui.tutorialNavigation('next');
				});
				ghostery.ui.panelFrame.getElementById('tutorial-arrow-left').addEventListener('click', function() {
					ghostery.ui.tutorialNavigation('prev');
				});
				var controls = ghostery.ui.panelFrame.getElementById('tutorial-controls').children;
				for (var i = 0; i < controls.length; i++) {
					controls[i].addEventListener('click', function () {
						ghostery.ui.tutorialNavigation(this);
					});
				}
				ghostery.ui.panelFrame.getElementById('tutorial-close').addEventListener('click', function () {
					ghostery.ui.toggleTutorial();
				});

				ghostery.ui.panelFrame.getElementById('help-button').addEventListener('click', function () {
					ghostery.ui.toggleTutorial();
				});

				ghostery.ui.panelOneTimeStuff = false;

				ghostery.ui.panelFrame.getElementById('whitelisting-button').addEventListener('click', function (e) {
					ghostery.ui.toggleWhitelisting(ghostery.ui.validProtocol);
					e.preventDefault();
				});
			}
			// hides popup when a link is clicked
			let a = ghostery.ui.panelFrame.getElementById('apps-div').querySelectorAll('a');
			ghostery.prefs.arrayForEach(a, 
				function(a) {
					a.addEventListener('click', function() {
						panel.hidePopup();
				}, 
				true);
			});
		}
		waitForBinding();
	},
	
	// adjusts popup width depending on OS to avoid sizing issues.
	adjustWidth: function(panel) {
		var panelWidth = parseInt(getComputedStyle(panel).getPropertyValue('width'), 10);
		if (ghostery.cleaner.SystemHelper.isWindows()) { // windows
			if (panelWidth < 331) {
				panel.style.width = 371 + 'px';
			} 
			else if (panelWidth < 347) {
				panel.style.width = 357 + 'px';
			}
		}
		else if (ghostery.cleaner.SystemHelper.isLinux()) { // linux
			if (panelWidth < 331) {
				panel.style.width = 371 + 'px';
			} 
			else if (panelWidth < 347) {
				panel.style.width = 357 + 'px';
			}
		}
		else { // mac
			if (panelWidth < 336) {
				panel.style.width = 374 + 'px';
			}
			else if (panelWidth < 347) {
				panel.style.width = 354 + 'px';
			}
		}
	},

	setPauseButton: function() {
		var button = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('pause-blocking-button'),
			i,
			elements = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementsByClassName('app-global-blocking');

		if (ghostery.prefs.paused) {
			if (button.className.indexOf('selected') === -1) {
				button.className = button.className + ' selected';
			}
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className + ' paused';
			}
		} else {
			button.className = button.className.replace(' selected', '');
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className.replace(' paused', '');
			}
		}
	},

	togglePauseButton: function() {
		var button = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('pause-blocking-button'),
			i,
			elements = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementsByClassName('app-global-blocking');

		if (ghostery.prefs.paused) {
			ghostery.prefs.togglePause();
			button.className = button.className.replace(' selected', '');
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className.replace(' paused', '');
			}
		} else {
			ghostery.prefs.togglePause();
			if (button.className.indexOf('selected') === -1) {
				button.className += ' selected';
			}
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className + ' paused';
			}
		}

		ghostery.ui.setGhosteryFindingsText(ghostery.ui.validProtocol);

		ghostery.resetBadgeColor();
		ghostery.ui.showReload();
	},

	toggleSettings: function (fastHide) {
		var settings = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('settings'),
			settings_button = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('settings-button'),
			isShown = (settings.style.display == 'block'),
			isSelected = (settings_button.className.indexOf('selected') >= 0),
			apps_div = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('apps-div'),
			$ = document.getElementById('ghostery-panel-frame').contentWindow.$Ghostery_jQuery;

		if (fastHide) {
			settings.style.display = 'none';
			apps_div.style.height = '297px';
			settings_button.className = settings_button.className.replace('selected', '');
			return;
		}

		if (isShown) {
			settings_button.className = settings_button.className.replace('selected', '');
		} else {
			if (settings_button.className.indexOf('selected') === -1) {
				settings_button.className = settings_button.className + ' selected';
			}
		}

		if (ghostery.ui.num_apps == 0) {
			$(apps_div).animate({ height: ($(settings).is(':visible') ? '297px' : '247px') }, {
				duration: 'fast'
			});

			$(settings).slideToggle({
				duration: 'fast'
			});
		} else {
			if ($(settings).is(':hidden')) {
				$(settings).slideDown({
					duration: 'fast',
					complete: function () {
						if (settings_button.className.indexOf('selected') === -1) {
							settings_button.className = settings_button.className + ' selected';
						}
						apps_div.style.height = '247px';
					}
				});
			} else {
				$(settings).slideUp({
					duration: 'fast',
					step: function () {
						// This is called here because it needs to be called once per animation and at the beginning.
						apps_div.style.height = '297px';
					},
					complete: function () {
						settings_button.className = settings_button.className.replace('selected', '');
					}
				});
			}
		}
	},

	toggleAppBlocking: function (that) {
		var aid = that.parentNode.parentNode.id.slice(8),
			blocked = (that.className.indexOf(' blocked') >= 0),
			className = that.className,
			$ = document.getElementById('ghostery-panel-frame').contentWindow.$Ghostery_jQuery;

		var message = that.parentNode.parentNode.getElementsByClassName('blocking-message')[0],
			app_text_div = that.parentNode.parentNode.getElementsByClassName('app-name')[0];

		message.firstChild.textContent = (blocked) ? 'Tracker Unblocked' : 'Tracker Blocked';
		if (message.className.indexOf('two-lines') >= 0) {
			message.className = message.className.replace('two-lines', '');
		}
		$(message).fadeIn({
			duration: 'fast',
			complete: function () {
				window.setTimeout(function () {
					$(message).fadeOut({
						duration: 'fast'
					});
				}, 1000);
			}
		});

		if (blocked) {
			$(that).animate({ backgroundPosition: '1px' }, {
				duration: 'fast',
				complete: function () {
					ghostery.prefs.deselectBug(aid);
					that.className = className.replace(' blocked', ' unblocked');
					that.parentNode.className = that.parentNode.className.replace(' blocked', ' unblocked');
				}
			});
		} else {
			$(that).animate({ backgroundPosition: '21px' }, {
				duration: 'fast',
				complete: function () {
					ghostery.prefs.selectBug(aid);
					that.className = className.replace(' unblocked', ' blocked');
					that.parentNode.className = that.parentNode.className.replace(' unblocked', ' blocked');
				}
			});
		}

		ghostery.ui.showReload();
	},

	toggleSources: function (that) {
		var app_srcs_div = that.parentNode.lastChild,
			app_moreinfo_div = that.parentNode.children[that.parentNode.children.length-2],
			app_arrow_div = that.firstChild,
			$ = document.getElementById('ghostery-panel-frame').contentWindow.$Ghostery_jQuery;

		$(app_moreinfo_div).slideToggle({
			duration: 'fast'
		});

		$(app_srcs_div).slideToggle({
			duration: 'fast',
			complete: function () {
				if (app_srcs_div.style.display == 'none') {
					app_arrow_div.className = app_arrow_div.className.replace('app-arrow-down', 'app-arrow-up');
				} else {
					app_arrow_div.className = app_arrow_div.className.replace('app-arrow-up', 'app-arrow-down');
				}
			}
		});
	},

	setGhosteryFindingsText: function (validProtocol) {
		var text = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('ghostery-findings-text'),
			apps_div = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('apps-div'),
			pausedSpan;

		if (ghostery.prefs.paused) {
			text.textContent = 'Blocking is ';
			pausedSpan = document.getElementById('ghostery-panel-frame').contentWindow.document.createElement('span');
			pausedSpan.style.color = '#f3c73b';
			pausedSpan.textContent = 'paused';
			text.appendChild(pausedSpan);
		} else if (!validProtocol) {
			text.textContent = 'Page not scanned';
		} else {
			text.innerHTML = '';
			text.textContent = 'Ghostery found ' + ghostery.ui.num_apps + ((ghostery.ui.num_apps == 1) ? ' tracker' : ' trackers');
		}

		if (ghostery.ui.num_apps == 0) {
			apps_div.innerHTML = '';
			apps_div.style.display = 'table';
			apps_div.style.textAlign = 'center';
			apps_div.style.width = '100%';
			var noTrackers = document.createElement('div');
			noTrackers.className = 'no-trackers';
			noTrackers.textContent = (validProtocol) ? 'No Trackers Found' : 'Ghostery does not scan local pages such as "about:tab", "localhost", etc.';
			apps_div.appendChild(noTrackers);
		} else {
			apps_div.style.display = '';
			apps_div.style.textAlign = 'left';
		}
	},

	setWhitelisting: function (validProtocol) {
		var site = '';				

		try {
			site = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString().toLowerCase();
		} catch (e) {}

		var whitelistButton = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('whitelisting-button'),
			i,
			elements = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementsByClassName('app-global-blocking'),
			websiteWhitelisted = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('website-whitelisted'),
			websiteUrl = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('website-url'),
			isWhitelisted = ghostery.prefs.isWhiteListed(site);

		if (!validProtocol) {
			if (whitelistButton.className.indexOf('disabled') === -1) {
				whitelistButton.className += ' disabled';
			}
			websiteWhitelisted.style.display = 'none';
			websiteUrl.style.color = '';
			return;
		} else {
			whitelistButton.className = whitelistButton.className.replace('disabled', '');
		}

		if (isWhitelisted) {
			if (whitelistButton.className.indexOf('selected') === -1) {
				whitelistButton.className = whitelistButton.className + ' selected';
			}
			websiteWhitelisted.style.display = 'block';
			websiteUrl.style.color = '#fff';
			websiteUrl.style.maxWidth = '115px';
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className + ' whitelisted';
			}
		} else {
			whitelistButton.className = whitelistButton.className.replace(' selected', '');
			websiteWhitelisted.style.display = 'none';
			websiteUrl.style.color = '';
			websiteUrl.style.maxWidth = '200px';
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className.replace(' whitelisted', '');
			}
		}
	},

	toggleWhitelisting: function (validProtocol) {
		var site = '',
			i,
			elements = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementsByClassName('app-global-blocking'),
			isWhitelisted,
			whitelistButton;

		if (!validProtocol) {
			return;
		}

		try {
			site = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString().toLowerCase();
		} catch (e) {}

		isWhitelisted = ghostery.prefs.isWhiteListed(site);
		whitelistButton = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('whitelisting-button');

		if (!isWhitelisted) {
			ghostery.prefs.whitelistCurrentSite();
			isWhitelisted = true;
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className + ' whitelisted';
			}
		} else {
			ghostery.prefs.deWhitelistCurrentSite();
			isWhitelisted = false;
			for (i = 0; i < elements.length; i++) {
				elements[i].className = elements[i].className.replace(' whitelisted', '');
			}
		}

		if (isWhitelisted) {
			whitelistButton.className = whitelistButton.className + ' selected';
			ghostery.ui.panelFrame.getElementById('website-whitelisted').style.display = 'block';
			ghostery.ui.panelFrame.getElementById('website-url').style.color = '#fff';
			ghostery.ui.panelFrame.getElementById('website-url').style.maxWidth = '115px';
		} else {
			whitelistButton.className = whitelistButton.className.replace(' selected', '');
			ghostery.ui.panelFrame.getElementById('website-whitelisted').style.display = 'none';
			ghostery.ui.panelFrame.getElementById('website-url').style.color = '';
			ghostery.ui.panelFrame.getElementById('website-url').style.maxWidth = '';
		}

		ghostery.resetBadgeColor();
		ghostery.ui.showReload();
	},

	toggleSiteSelection: function (that) {
		var aid = that.parentNode.parentNode.id.slice(8),
			className = that.className,
			host,
			allowed = (className.indexOf('on') >= 0),
			$ = document.getElementById('ghostery-panel-frame').contentWindow.$Ghostery_jQuery,
			message = that.parentNode.parentNode.getElementsByClassName('blocking-message')[0],
			app_text_div = that.parentNode.parentNode.getElementsByClassName('app-name')[0];

		try {
			host = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString().toLowerCase();
		} catch (e) {}

		message.firstChild.innerHTML = 'Always Allowed on <br>' + host;
		if (message.className.indexOf('two-lines') === -1) {
			message.className += ' two-lines';
		}
		if (!allowed) {
			$(message).fadeIn({
				duration: 'fast',
				complete: function () {
					window.setTimeout(function () {
						$(message).fadeOut({
							duration: 'fast'
						});
					}, 1000);
				}
			});
		}

		if (!allowed) {
			ghostery.prefs.addSiteSelection(host, 'allow', parseInt(aid, 10));
			that.className = className.replace('off', 'on');
		} else {
			ghostery.prefs.removeSiteSelection(host, 'allow', parseInt(aid, 10));
			that.className = className.replace('on', 'off');
		}

		ghostery.ui.showReload();
	},

	showReload: function() {
		var needsReload = ghostery.ui.needsReload[gBrowser.selectedBrowser.contentDocument.location.href];
		if (needsReload === false) { // do not show if alert has been closed already before the page reload.
			return;
		} else if (needsReload === undefined) {
			ghostery.ui.needsReload[gBrowser.selectedBrowser.contentDocument.location.href] = true;
		}

		document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('reload').style.display = 'block';
	},

	setReload: function() {
		document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('reload').style.display = (ghostery.ui.needsReload[gBrowser.selectedBrowser.contentDocument.location.href]) ? 'block' : 'none';
	},

	tutorialNavigation: function (newPosition) {
		var screens = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('tutorial-screens').children,
			controls = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('tutorial-controls').children,
			arrowLeft = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('tutorial-arrow-left'),
			arrowRight = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('tutorial-arrow-right'),
			i, e,
			currScreenIndex,
			nextScreenIndex;

		
		// Find current screen index
		for (i = 0; i < screens.length; i++) {
			if (screens[i].style.display == 'table') {
				currScreenIndex = i;
				break;
			}
		}

		if (newPosition == 'next' || (newPosition && newPosition.keyCode && newPosition.keyCode == 39)) { // Arrow prev
			nextScreenIndex = i + 1;
			if (nextScreenIndex > screens.length-1) {
				return;
			}

			screens[currScreenIndex].style.display = 'none';
			screens[nextScreenIndex].style.display = 'table';
			ghostery.ui.blinkTutorialArrow('right', true);
		} else if (newPosition == 'prev' || (newPosition && newPosition.keyCode && newPosition.keyCode == 37)) { // Arrow next
			nextScreenIndex = i - 1;
			if (nextScreenIndex < 0) {
				return;
			}

			screens[currScreenIndex].style.display = 'none';
			screens[nextScreenIndex].style.display = 'table';
			ghostery.ui.blinkTutorialArrow('right', true);
		} else if (!newPosition) { // Reset tutorial to first screen
			for (i = 0; i < screens.length; i++) {
				if (i == 0) {
					screens[i].style.display = 'table';
					continue;
				}

				screens[i].style.display = 'none';
			}

			nextScreenIndex = 0;

			ghostery.ui.blinkTutorialArrow('right', true);
			ghostery.ui.tutorialArrowBlinkTimeout = window.setTimeout(function () {
				ghostery.ui.blinkTutorialArrow('right');
			}, 3000);
		} else { // Bottom nav controls
			nextScreenIndex = parseInt(newPosition.id.replace('tutorial-control-', ''), 10) - 1;
			screens[currScreenIndex].style.display = 'none';
			screens[nextScreenIndex].style.display = 'table';
			ghostery.ui.blinkTutorialArrow('right', true);
		}

		// Update bottom controls
		
		try { controls[currScreenIndex].className = controls[currScreenIndex].className.replace('on', ''); } catch (e) {}
		controls[nextScreenIndex].className = controls[nextScreenIndex].className + ' on';

		// Update arrows
		if (nextScreenIndex == 0) {
			if (arrowLeft.className.indexOf('off') === -1) arrowLeft.className += ' off';
			arrowRight.className = arrowRight.className.replace('off', '');
		} else if (nextScreenIndex == screens.length-1) {
			ghostery.prefs.set('showTutorial', false);
			if (arrowRight.className.indexOf('off') === -1) arrowRight.className = arrowRight.className + ' off';
			arrowLeft.className = arrowLeft.className.replace('off', '');
		} else {
			arrowLeft.className = arrowLeft.className.replace('off', '');
			arrowRight.className = arrowRight.className.replace('off', '');
		}
	},

	toggleTutorial: function (show) {
		var tutorial = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('tutorial-container'),
			help_button = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('help-button'),
			isShown = (tutorial.style.display == 'block');

		if (show) {
			isShown = false;
		}

		tutorial.style.display = (isShown) ? 'none' : 'block';
		if (isShown) {
			ghostery.prefs.set('showTutorial', false);
			help_button.className = help_button.className.replace('down', '');
			document.getElementById('ghostery-panel-frame').removeEventListener('keydown', ghostery.ui.tutorialNavigation, true);
		} else {
			help_button.className = help_button.className + ' down';
			document.getElementById('ghostery-panel-frame').addEventListener('keydown', ghostery.ui.tutorialNavigation, true);
		}
	},

	blinkTutorialArrow: function (direction, stop) {
		var arrow = document.getElementById('ghostery-panel-frame').contentWindow.document.getElementById('tutorial-arrow-' + direction),
			count = 0;

		if (stop) {
			arrow.className = arrow.className.replace('blink', '');
			window.clearInterval(ghostery.ui.tutorialArrowBlinkInterval);
			window.clearTimeout(ghostery.ui.tutorialArrowBlinkTimeout);
			return;
		}

		ghostery.ui.tutorialArrowBlinkInterval = window.setInterval(function () {
			if (arrow.className.indexOf('blink') >= 0) {
				arrow.className = arrow.className.replace('blink', '');
				if (count > 6) {
					window.clearInterval(ghostery.ui.tutorialArrowBlinkInterval);
					return;
				}
			} else {
				arrow.className = arrow.className + ' blink';
			}
			count++;
		}, 500);
	},

	displayApps: function() {
		var site = '',
			pageUrl = '',
			validProtocol = false;

		try {
			site = ( gBrowser.selectedBrowser.contentDocument.location.host ? gBrowser.selectedBrowser.contentDocument.location.host : gBrowser.selectedBrowser.contentDocument.location ).toString().toLowerCase();
			pageUrl = gBrowser.selectedBrowser.contentDocument.location.href.toString().toLowerCase();
			validProtocol = (gBrowser.selectedBrowser.contentDocument.location.protocol.indexOf('http') === 0);
		} catch (e) {}

		if (!validProtocol) { site = ''; }

		var i, j,
			p = ghostery.prefs,
			isWhitelisted = p.isWhiteListed(site),
			bugs = ghostery.currentBugs,
			doc = document.getElementById('ghostery-panel-frame').contentWindow.document,
			num_apps = (bugs ? bugs.length : 0),
			apps_div = doc.getElementById('apps-div'),
			app_list_div,
			userSiteSelections = ghostery.prefs.getWhitelistedDatabase(site),
			bugType,

			// App skeleton
			app_div,
			app_info_container_div,
			app_arrow_div,
			app_text_div,
			app_table_div,
			app_name_div,
			app_type_div,

			selective_unblock_control_div,
			global_blocking_control_div,
			app_site_blocking_div,
			app_global_blocking_div,

			tracker_alert_div,

			app_sources_container_div,
			app_moreinfo_div,
			app_srcs_div,

			settings = doc.getElementById('settings'),
			tutorial = doc.getElementById('tutorial-container');

		// // Trim the list and realign the script sources
		var temp = [], previous = '';
		for (i = 0; i < num_apps; i++) {
			if (previous != bugs[i].bug.aid) {
				previous = bugs[i].bug.aid;
				bugs[i].sources = [];
				bugs[i].sources.push(bugs[i].script);

				temp.push(bugs[i]);
			} else {
				var b = temp.pop();
				b.sources.push(bugs[i].script);

				temp.push(b);
			}
		}



		bugs = temp;
		num_apps = (bugs ? bugs.length : 0);
		ghostery.ui.num_apps = num_apps;
		ghostery.ui.validProtocol = validProtocol;


		// // clean out apps_div
		while(apps_div.firstChild) {
			apps_div.removeChild(apps_div.firstChild);
		}

		for (i = 0; i < num_apps; i++) {
			if (i == 0) {
				doc.getElementById('ghostery-findings-text').textContent = 'Ghostery found ' + num_apps + ' trackers';
			}

			app_div = doc.createElement('div');
			app_div.className = 'app-div';
			app_div.id = 'app-div-' + bugs[i].bug.aid;

			app_info_container_div = doc.createElement('div');
			app_info_container_div.className = 'app-info-container';
			app_info_container_div.addEventListener('click', function (e) {
				ghostery.ui.toggleSources(this);
				e.preventDefault();
			}, true);
			app_div.appendChild(app_info_container_div);

			app_arrow_div = doc.createElement('div');
			app_arrow_div.className = 'app-arrow app-arrow-up';
			app_info_container_div.appendChild(app_arrow_div);

			app_text_div = doc.createElement('div');
			app_text_div.className = 'app-text';
			app_info_container_div.appendChild(app_text_div);


			app_table_div = doc.createElement('div');
			app_table_div.style.display = 'table-cell';
			app_table_div.style.verticalAlign = 'middle';
			app_table_div.style.maxWidth = '185px';
			app_text_div.appendChild(app_table_div);

			app_name_div = doc.createElement('div');
			app_name_div.className = 'app-name ellipsis';
			if (bugs[i].policyBlocked || bugs[i].shouldHaveBeenBlocked) {
				app_name_div.className = app_name_div.className + ' blocked';
			}
			app_name_div.textContent = bugs[i].bug.name;
			app_table_div.appendChild(app_name_div);

			app_type_div = doc.createElement('div');
			app_type_div.className = 'app-type ellipsis';
			bugType = bugs[i].bug.type;
			if (bugType == 'ad') {bugType = 'Advertising'} else {bugType = bugType.charAt(0).toUpperCase() + bugType.slice(1)}
			app_type_div.textContent = bugType;
			app_table_div.appendChild(app_type_div);

			selective_unblock_control_div = doc.createElement('div');
			selective_unblock_control_div.className = 'selective-unblock-control float-right';
			app_site_blocking_div = doc.createElement('div');
			app_site_blocking_div.className = 'app-site-blocking' + (p.isSiteSelected(site, 'allow', bugs[i].bug.aid) ? ' on' : ' off');
			app_site_blocking_div.addEventListener('click', function (e) {
				ghostery.ui.toggleSiteSelection(this);
				e.preventDefault();
			}, true);
			selective_unblock_control_div.appendChild(app_site_blocking_div);
			app_div.appendChild(selective_unblock_control_div);

			global_blocking_control_div = doc.createElement('div');
			global_blocking_control_div.className = 'global-blocking-control float-right' + (p.isSelectedAppId(bugs[i].bug.aid) ? ' blocked' : ' unblocked');
			app_global_blocking_div = doc.createElement('div');
			app_global_blocking_div.className = 'app-global-blocking' + (p.isSelectedAppId(bugs[i].bug.aid) ? ' blocked' : ' unblocked');
			app_global_blocking_div.addEventListener('click', function (e) {
				ghostery.ui.toggleAppBlocking(this);
				e.preventDefault();
			}, true);
			global_blocking_control_div.appendChild(app_global_blocking_div);
			app_div.appendChild(global_blocking_control_div);

			var blocking_message = doc.createElement('div');
			blocking_message.className = 'blocking-message';
			app_div.appendChild(blocking_message);
			var message = doc.createElement('div');
			message.className = 'message float-left ellipsis';
			blocking_message.appendChild(message);
			var message_arrow = doc.createElement('div');
			message_arrow.className = 'message-arrow float-left';
			blocking_message.appendChild(message_arrow);

			if (ghostery.db.hasCompatibilityIssue(bugs[i].bug.aid, pageUrl)) {
				var bm = doc.createElement('div'),
					m = doc.createElement('div'),
					a = doc.createElement('div');

				tracker_alert_div = doc.createElement('div');
				tracker_alert_div.className = 'tracker-alert float-right';
				m.className = 'message';
				a.className = 'message-arrow top';
				bm.className = 'blocking-message';
				m.textContent = 'Blocking this tracker may cause page errors!';
				
				bm.style.display = 'none';
				bm.style.right = '50px';
				bm.style.top = '4px';

				bm.appendChild(a);
				bm.appendChild(m);
				tracker_alert_div.appendChild(bm)

				tracker_alert_div.addEventListener('mouseover', function () {
					this.firstChild.style.display = 'block';
				}, true);
				tracker_alert_div.addEventListener('mouseout', function () {
					this.firstChild.style.display = 'none';
				}, true);

				app_div.appendChild(tracker_alert_div);
			}

			var clear = doc.createElement('div');
			clear.style.clear = 'both';
			app_div.appendChild(clear);

			app_moreinfo_div = doc.createElement('div');
			app_moreinfo_div.className = 'app-moreinfo ellipsis';
			app_moreinfo_div.appendChild(ghostery.ui.createLink(doc, 'http://www.ghostery.com/apps/' + encodeURIComponent(bugs[i].bug.name.replace(/\s+/g, '_').toLowerCase()), 'Click here for more information about ' + bugs[i].bug.name, 'ellipsis'));
			app_div.appendChild(app_moreinfo_div);

			app_sources_container_div = doc.createElement('div');
			app_sources_container_div.className = 'app-srcs-container';
			app_sources_container_div.style.display = 'none';
			app_div.appendChild(app_sources_container_div);

			var found_trackers_div = doc.createElement('div');
			found_trackers_div.className = 'app-srcs-title ellipsis';
			found_trackers_div.style.marginBottom = '0';
			found_trackers_div.textContent = 'Detected tracker source URLs:';
			app_sources_container_div.appendChild(found_trackers_div);

			app_srcs_div = doc.createElement('div');
			app_srcs_div.className = 'app-srcs';

			for (j = 0; j < bugs[i].sources.length; j++) {
				var src_div = doc.createElement('div');
				src_div.className = 'app-src';
				var clip_messsage = doc.createElement('div');
				clip_messsage.className = 'blocking-message clip';
				var clip_message_text = doc.createElement('div');
				clip_message_text.className = 'message';
				clip_message_text.textContent = 'Copied to Clipboard!';
				var clip_message_arrow = doc.createElement('div');
				clip_message_arrow.className = 'message-arrow bottom';

				clip_messsage.appendChild(clip_message_text);
				clip_messsage.appendChild(clip_message_arrow);
				src_div.appendChild(clip_messsage);

				var clip_link = doc.createElement('div');
				clip_link.className = 'zero-clip';
				clip_link.addEventListener('click', function(e) {
					Components.classes["@mozilla.org/widget/clipboardhelper;1"]
						.getService(Components.interfaces.nsIClipboardHelper)
						.copyString(this.parentElement.lastChild.firstChild.textContent);

					var $ = document.getElementById('ghostery-panel-frame').contentWindow.$Ghostery_jQuery;
					$(this.parentElement.firstChild).fadeIn({
						duration: 'fast',
						complete: function () {
							window.setTimeout(function (that) {
								$(that).fadeOut({
									duration: 'fast'
								});
							}, 500, this);
						}
					});

					this.addEventListener('mouseout', function (e) {
						this.parentElement.firstChild.style.display = 'none';
						e.preventDefault();
					}, true);
					e.preventDefault();
				}, true);
				
				src_div.appendChild(clip_link);
				src_div.appendChild(doc.createElement('div'));
				src_div.lastChild.className = 'ellipsis';
				src_div.lastChild.appendChild(ghostery.ui.createLink(doc, 'http://www.ghostery.com/gcache/?n=' + encodeURIComponent(window.btoa(bugs[i].bug.name)) + '&s=' + encodeURIComponent(window.btoa(bugs[i].sources[j])), bugs[i].sources[j], (bugs[i].policyBlocked || bugs[i].shouldHaveBeenBlocked) ? 'blocked' : ''));
				app_srcs_div.appendChild(src_div);
			}

			app_sources_container_div.appendChild(app_srcs_div);


			apps_div.appendChild(app_div);

			// Reset panel
			if (p.expandSources) {
				ghostery.ui.toggleSources(app_info_container_div);
			}
		}

		// Reset panel
		ghostery.ui.toggleSettings(true);
		this.setGhosteryFindingsText(validProtocol);
		this.setPauseButton();
		this.setWhitelisting(validProtocol);
		this.setReload();
		this.tutorialNavigation();
		if (ghostery.prefs.get('showTutorial')) {
			ghostery.ui.toggleTutorial(true);
		} else if (tutorial.style.display == 'block') {
			ghostery.ui.toggleTutorial();
		}

		doc.getElementById('website-url').textContent = site;
	},

	updatePopupHeight: function() {
		var panel = document.getElementById('ghostery-panel');
		panel.firstChild.style.height = ( ghostery.ui.panelFrame.body.offsetHeight + 10) + "px";
	},

	createCheckbox: function(doc, id, checked, class_name) {
		var check = doc.createElement('input');
		check.type = 'checkbox';
		if (checked != undefined) {
			check.checked = !!checked;
		}
		if (class_name) {
			check.className = class_name;
		}
		check.id = id;
		return check;
	},

	createLink: function(doc, href, text, class_name, title) {
		var link = doc.createElement('a');
		link.href = href;
		if (class_name) {
			link.className = class_name;
		}
		if (title) {
			link.title = title;
		}
		link.appendChild(doc.createTextNode(text));

		link.addEventListener('click', function (e) {
			gBrowser.selectedTab = gBrowser.addTab(href);
			e.preventDefault();
		});
		return link;
	},

	ellipsize: function(s, max_length) {
		return (s.length > max_length ? s.slice(0, max_length-3) + '...' : s);
	}
};
