/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2010 Evidon
 *
 * @author Felix Shnir
 * @copyright Copyright (C) 2010 Felix Shnir <felix@evidon.com>
*/
 
if ( !ghostery ) { var ghostery = {}; }

ghostery.cookieMonster = {
	cookieManager: null,
	current: null,

	init: function() {
		try {
			Components.utils.import('resource://gre/modules/AddonManager.jsm');

			AddonManager.getAddonByID('optout@google.com', function(addon) {
		  	if ((addon) && (addon.isActive)) {
		  		ghostery.cookieMonster.remove();
		  	}
			});

			AddonManager.getAddonByID('john@velvetcache.org', function(addon) {
		  	if ((addon) && (addon.isActive)) {
		  		ghostery.cookieMonster.remove();
		  	}
			});
		} catch (err) {}

		var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
		observerService.addObserver(this, "cookie-changed", false);

		this.cookieManager = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager);
	},

	remove: function() {
		// colliding addon present, disable
		var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);

		try {
			observerService.removeObserver(this, "cookie-changed");
		} catch (e) {}
	},

	observe: function(subject, topic, data) {
		if (topic != 'cookie-changed') { return; }

		try {
			if (!ghostery.prefs.cookieProtect) { return; }

			if ( (data == 'added') || (data == 'changed') ) {
				var cookie = subject.QueryInterface(Components.interfaces.nsICookie);
				var matcher = ghostery.prefs.fullCookieRegex();
				if ( (matcher.test(cookie.host)) 
					&& (!ghostery.prefs.isWhiteListed( this.current )) ) {
					this.cookieManager.remove(cookie.host, cookie.name, cookie.path, false);
					ghostery.prefs.appendBlockingLog('Blocked cookie: ' + cookie.name + ' on ' + cookie.host + cookie.path + ' with value: ' + cookie.value 
						+ ' loaded from ' + this.current );
				}
			}
		} catch (err) {}
	}
}