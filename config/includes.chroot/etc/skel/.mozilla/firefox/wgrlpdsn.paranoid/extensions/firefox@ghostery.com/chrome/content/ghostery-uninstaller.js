/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2011 Evidon
 *
 * @author Felix Shnir
 * @copyright Copyright (C) 2011 Felix Shnir <felix@evidon.com>
*/

if ( !ghostery ) { var ghostery = {}; }

ghostery.uninstaller = {
	uninstall: false,

	init: function() {
		try {
			// Firefox 4
			Components.utils.import("resource://gre/modules/AddonManager.jsm");
			AddonManager.addAddonListener({
				onUninstalling: function(addon) {
					if (addon.id == 'firefox@ghostery.com') {
						ghostery.uninstaller.uninstall = true;
					}
				},
			
				onOperationCancelled: function(addon) {
					if (addon.id == 'firefox@ghostery.com') {
						ghostery.uninstaller.uninstall = (addon.pendingOperations & AddonManager.PENDING_UNINSTALL) != 0;
					}
				}
			});
		} catch (e) {
			// Firefox 3.6
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.addObserver(ghostery.uninstaller, "em-action-requested", false);
		}
	},

	observe: function(subject, topic, data) {
		if (topic != 'em-action-requested') { return; }
		subject.QueryInterface(Components.interfaces.nsIUpdateItem);

		if ( (data == 'item-uninstalled') && (subject.id == 'firefox@ghostery.com') ) {
			ghostery.uninstaller.uninstall = true;
		} else if ( (data == 'item-cancel-action') && (subject.id == 'firefox@ghostery.com') ) {
			ghostery.uninstaller.uninstall = false;
		}
	},

	housekeeping: function() {
		try {
			// remove profiles/ghostery/*.* except for users files -- if it contains anything.
			var storage = ghostery.prefs.getStorageDirectory();
			var custom = false;

			// Check if any custom bugs are in the database.  If yes, dont delete the whole folder.  If no, nuk the folder.
			for ( var bug_num = 0; bug_num < ghostery.db.bugs.length; bug_num++ ) {
				var bug = ghostery.db.bugs[bug_num];
				if (bug.userCreated) {
					custom = true;
					break;
				}
			}

			if (custom) {
				// delete by file.
				var r = storage.clone();
				r.append('bugs.db');
				r.remove(false);

				r = storage.clone();
				r.append('lsos.db');
				r.remove(false);

				r = storage.clone();
				r.append('surrogates.db');
				r.remove(false);

				r = storage.clone();
				r.append('selectedBugs');
				r.remove(false);

				r = storage.clone();
				r.append('selectedLsos');
				r.remove(false);
			} else {
				// delete the dir recursively
				storage.remove(true);
			}
		} catch(e) { }
	}
}