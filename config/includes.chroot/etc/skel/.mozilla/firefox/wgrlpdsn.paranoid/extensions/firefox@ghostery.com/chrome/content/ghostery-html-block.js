/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 * Ghostery Block Log page scripts
 *
 * @author Felix Shnir
 * @copyright Copyright (C) 2011 Evidon
 */

		var stringBundle = null;
		var li = null;
		var pref = null;

		function init() {
			var h = window.innerHeight;

			ghostery.prefs.startup();
			var b = document.getElementById('block-box');
			b.style.height = (h - 300) + 'px';
			b.value = ghostery.prefs.blockingLog;

			pref = Components.classes['@mozilla.org/preferences-service;1']
					.getService(Components.interfaces.nsIPrefService)
					.getBranch('extensions.ghostery.');
			pref.QueryInterface(Components.interfaces.nsIPrefBranch2);

			li = {
				observe:function (subject, topic, data) {
					if (topic != 'nsPref:changed') { return; }
					if (data == 'blockingLog' ) {
						document.getElementById('block-box').value = pref.getCharPref('blockingLog');
					}
				}
			};

			pref.addObserver('', li, false);

			window.onbeforeunload = function() {
				pref.removeObserver('', li);
				ghostery.prefs.shutdown();
			};

			ghostery.translator.translate();
		}

		function clearBlockLog() {
			ghostery.prefs.set('blockingLog', '');
			document.getElementById('block-box').value = pref.getCharPref('blockingLog');
		}