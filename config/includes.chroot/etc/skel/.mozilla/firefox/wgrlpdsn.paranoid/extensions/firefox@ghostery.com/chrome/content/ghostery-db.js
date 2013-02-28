/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2010 Better Advertising
 *
 * @author Felix Shnir
 * @author David Cancel
 * @author Jon Pierce
 * @copyright Copyright (C) 2010 Felix Shnir <felix@betteradvertising.com>
 * @copyright Copyright (C) 2008-2009 David Cancel <dcancel@dcancel.com>
*/

if ( !ghostery ) { var ghostery = {}; }

ghostery.db = {
	bugs: null,
	bugsAppCount: 0,
	lsosAppCount: 0,
	bugsMap: null,
	lsos: null,
	lsosMap: null,
	partialRegex: null,
	partialBugs: null,
	surrogates: null,
	_loadedSurrogates: false,
	bugsVersion: 0,
	compatibility: null,

	loadSelections: function() {
		var selections = {};

		// Load the legacy file
		var file = ghostery.prefs.getProfileDirectory();
		file = ghostery.prefs.getOrCreateFile(file, "ghostery", true);
		file = ghostery.prefs.getOrCreateFile(file, "user.site.preferences.db", false);

		var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
		is.init(file, 0x01, 00004, null);
		var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance( Components.interfaces.nsIScriptableInputStream );
		sis.init( is );
		var data = sis.read( sis.available() );

		try {
			selections = this.fromJSON(data);
		} catch (e) {}

		is.close();
		sis.close();

		// Load the preference and append
		var savedUserSiteSelections = ghostery.prefs.get('userSiteSelections');
		if (savedUserSiteSelections) {
			savedUserSiteSelections = this.fromJSON(savedUserSiteSelections);
			for (var host in savedUserSiteSelections) {
				if (!savedUserSiteSelections.hasOwnProperty(host)) { continue; }
				if (!savedUserSiteSelections[host].allow) { continue; }

				if (!selections[host]) {
					selections[host] = {
						"allow": []
					};
				}

				var allow = savedUserSiteSelections[host].allow;
				for (var i = 0; i < allow.length; i++) {
					if (selections[host].allow.indexOf(allow[i]) < 0) {
						selections[host].allow.push(allow[i]);
					}
				}
			}

			// Save the preference here to remove any allow_once entries.
			ghostery.prefs.set('userSiteSelections', JSON.stringify(selections));
		}

		return selections;
	},

	loadCompatibility: function() {
		var i, comp = {},
		file = ghostery.prefs.getProfileDirectory();
		file = ghostery.prefs.getOrCreateFile(file, "ghostery", true);
		file = ghostery.prefs.getOrCreateFile(file, "compatibility.db", false);

		var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
		is.init(file, 0x01, 00004, null);
		var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance( Components.interfaces.nsIScriptableInputStream );
		sis.init( is );
		var data = sis.read( sis.available() );

		/* Ghostery supplied database */
 		if (data == '') {
			this.loadDefaultFile('compatibility');
 		} else {
 			try {
 				this.compatibility = this.fromJSON(data);
 				this.compatibility = this.compatibility;
 			} catch (e) {
 				this.loadDefaultFile('compatibility');
 			}
 		}
		is.close();
		sis.close();

		// reformat to be a lookup by aid:
		
		for (i = 0; i < this.compatibility.length; i++) {
			var row = this.compatibility[i];

			comp[row.aid] = row.urls;
		}

		this.compatibility = comp;
	},

	hasCompatibilityIssue: function (aid, pageUrl) {
		var i,
			host,
			onlyHost,
			starred;

		pageUrl = (pageUrl.indexOf('://') >= 0) ? pageUrl.substr(pageUrl.indexOf('://') + 3) : pageUrl;
		pageUrl = (pageUrl.indexOf('www.') >= 0) ? pageUrl.substr(pageUrl.indexOf('www.') + 4) : pageUrl;
		host = pageUrl.split('/')[0];

		if (!this.compatibility.hasOwnProperty(aid)) {
			return false;
		}

		for (i = 0; i < this.compatibility[aid].length; i++) {
			onlyHost = (this.compatibility[aid][i].indexOf('/') === -1);

			if (onlyHost) {
				if (this.compatibility[aid][i] == host) {
					return true;
				}
			} else {
				starred = (this.compatibility[aid][i].indexOf('*') >= 0);

				if (!starred) {
					if (this.compatibility[aid][i] == pageUrl) {
						return true;
					}
				} else {
					if (pageUrl.indexOf(this.compatibility[aid][i].substr(0, this.compatibility[aid][i].length-1)) == 0) {
						return true;
					}
				}
			}
		}

		return false;
	},

	loadSurrogates: function() {
		if (this._loadedSurrogates) { return this.surrogates; }

		var file = ghostery.prefs.getProfileDirectory();
		file = ghostery.prefs.getOrCreateFile(file, "ghostery", true);
		file = ghostery.prefs.getOrCreateFile(file, "surrogates.db", false);

		var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
		is.init(file, 0x01, 00004, null);
		var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance( Components.interfaces.nsIScriptableInputStream );
		sis.init( is );
		var data = sis.read( sis.available() );

		/* Ghostery supplied database */
 		if (data == '') {
			this.loadDefaultFile('surrogates');
 		} else {
 			try {
 				this.surrogates = this.fromJSON(data);
 				this.surrogates = this.surrogates;
 			} catch (e) {
 				this.loadDefaultFile('surrogates');
 			}
 		}
		is.close();
		sis.close();

		this._loadedSurrogates = true;

		return this.surrogates;
	},

	loadClick2Play: function() {
		var c2p, file = ghostery.prefs.getProfileDirectory();
		file = ghostery.prefs.getOrCreateFile(file, "ghostery", true);
		file = ghostery.prefs.getOrCreateFile(file, "click2play.db", false);

		var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
		is.init(file, 0x01, 00004, null);
		var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance( Components.interfaces.nsIScriptableInputStream );
		sis.init( is );
		var data = sis.read( sis.available() );

		/* Ghostery supplied database */
 		if (data == '') {
			c2p = this.loadDefaultFile('click2play');
 		} else {
 			try {
 				c2p = this.fromJSON(data);
 			} catch (e) {
 				c2p = this.loadDefaultFile('click2play');
 			}
 		}
		is.close();
		sis.close();

		return c2p;
	},

	loadDB: function() {
		this.loadBugs();		
		this.loadLsos();
		this.loadCompatibility();
	},

	updateDatabase: function(doAlert, _doc, doUpdate) {
		if (!doUpdate) {
			var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest),
			ver = ghostery.prefs.get('allVersion'),
			_this = this;

			req.open('GET', 'https://www.ghostery.com/update/version?format=json');

			req.onreadystatechange = function() {
				if ( (req.readyState == 4) && (req.status == 200) ) {
					try {
						var json = _this.fromJSON(req.responseText);
						_this.lastUpdateIsNow();

						if (ver != json.allVersion ) {
							// there is an update
							_this.updateDatabase(doAlert, _doc, true);
							ghostery.prefs.set('allVersion', json.allVersion);
						} else if (_doc) {
							var el = _doc.getElementById('update-now-span');

							while (el.firstChild) {
				  				el.removeChild(el.firstChild);
							}

							el.textContent = 'No updates';
							el.style.color = "green";
						} else if (doAlert) {
							alert('Ghostery is already at the latest library version');
						}

						if (_doc) {
							_doc.getElementById('bugs-last-updated').textContent = ghostery.translator.translateString('settings.autoupdate.lastupdate') + ' ' + (new Date()).toDateString() + '.';
						}
					} catch (ex) {
						var cs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
						cs.logStringMessage('GHOSTERY UPDATE EXCEPTION');
						cs.logStringMessage(ex + ' on: ' + ex.lineNumber + '|' + ex.toSource());
					}
				}
			}

			req.send(null);
			return;
		}

		if (doUpdate) {
			var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest),
			 prevCount = this.bugs.length,
			 cookieCount = this.lsos.length,
			 currCount = 0,
			 prevAppCount = 0,
			 _this = this,
			 ap = null;

			// pre app count.
			for (var i = 0; i < this.bugs.length; i++) {
				if (ap == this.bugs[i].aid) continue;
				if (this.bugs[i].userCreated) continue;

				ap = this.bugs[i].aid;
				prevAppCount++;
			}

			// Changing the text to Updating... TODO: translate?
			if (_doc) {
				var el = _doc.getElementById('update-now-span');

				while (el.firstChild) {
	  				el.removeChild(el.firstChild);
				}

				el.textContent = 'Updating...';
			}

			req.open('GET', 'https://www.ghostery.com/update/all?format=json');

			req.onreadystatechange = function() {
				if ( (req.readyState == 4) && (req.status == 200) ) {
					try {
						var json = _this.fromJSON(req.responseText),
						 bugs = json.bugs,
						 lsos = json.lsos,
						 bugCount = 0,
						 ap, i, bugsMap = {}, lsosMap = {};
		
						_this.bugsVersion = json.bugsVersion;
		
						if (bugs.length) {
		
							// create a map for new stuff
							for (i = 0; i < bugs.length; i++) {
								var bug = bugs[i];
								bug.id = bug.id.toString();
								bugsMap[bug.id] = bug;
							}
		
							// compare old map to new map and remove all entries that are the same
							for (i in _this.bugsMap) {
								if (bugsMap[i]) {
									delete bugsMap[i];
								}
							}
							// bugsMap now only has new entries
		
							// create a map for new stuff
							for (i = 0; i < lsos.length; i++) {
								var bug = lsos[i];
								bug.id = bug.id.toString();
								lsosMap[bug.id] = bug;
							}
		
							for (i in _this.lsosMap) {
								if (lsosMap[i]) {
									delete lsosMap[i];
								}
							}
		
							if (ghostery.prefs.updateNotification) {
								// need to store new entries
								var entries = [], newEntries = false;
								for (i in bugsMap) {
									entries.push(i);
									newEntries = true;
								}
		
								ghostery.prefs.set('updateLatestBugEntries', entries.join(','));
		
								entries = [];
								for (i in lsosMap) {
									entries.push(i);
									newEntries = true;
								}
		
								ghostery.prefs.set('updateLatestCookieEntries', entries.join(','));
		
								if ( (newEntries) && (!_doc) ) {
									ghostery.prefs.fireNewEntriesNotification = true;
								}
							}
		
							bugCount = _this.bugs.length - bugs.length;
		
							if (bugs.length > 0) { _this.saveBugs( { bugs: bugs, bugsVersion: _this.bugsVersion }, "bugs"); }
							if (lsos.length > 0) { _this.saveBugs(lsos, "lsos"); }
		
							// block new entries if blockBehaviour is set to true
							if (ghostery.prefs.updateBlockBehaviour) {
								_this.writeNewSelections('bugs', bugsMap);
								_this.writeNewSelections('lsos', lsosMap);
							}
		
							_this.loadDB();
						}

						if (json.hasOwnProperty('surrogates'))
							_this.saveBugs(json.surrogates, 'surrogates');

						if (json.hasOwnProperty('click2play'))
							_this.saveBugs(json.click2play, 'click2play');

						if (json.hasOwnProperty('compatibility'))
							_this.saveBugs(json.compatibility, 'compatibility');

						_this.lastUpdateIsNow();

						if (doAlert) {
							ghostery.locale.init();

							bugs.sort(ghostery.db.sorter);

							// count new array only.
							for (i = 0; i < bugs.length; i++) {
								if (ap == bugs[i].aid) continue;
								ap = bugs[i].aid;
								currCount++;
							}

							if (_doc) {
								var el = _doc.getElementById('update-now-span');
								el.textContent = 'Update successful';
								el.style.color = "green";
							}

							alert(ghostery.locale.updateComplete + '\n' + (prevAppCount == currCount ? ghostery.locale.zeroNewTrackers : ghostery.locale.totalTrackers + ' ' + currCount + ' ' + ghostery.locale.previousTrackers + ': ' + prevAppCount) + '.');

							// reload options page when passed in.
							if (_doc) {
								if (prevAppCount != currCount) {
									_doc.location.reload();
								}
							}
						}
					} catch (ex) {
						if (_doc) {
							var el = _doc.getElementById('update-now-span');
							el.textContent = 'Updating failed';
							el.style.color = "red";
						}

						var cs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
						cs.logStringMessage('GHOSTERY UPDATE EXCEPTION');
						cs.logStringMessage(ex + ' on: ' + ex.lineNumber + '|' + ex.toSource());
					}
				} else if ( (req.readyState == 4) && (req.status != 200) && (doAlert) ) {
					// looks like an error occured, notify the user.
					alert('Sorry, updating failed. Please try again later.\nServer Response: ' + req.status + '|' + req.statusText);
				} else if ( (req.readyState == 4) && (req.status == 503) && (doAlert) ) {
					// looks like an error occured, notify the user of administrative shutdown.
					alert('Sorry, updating has been temporarily disabled\nby server administration. Please try again later.');
				}
			}

			req.send(null);
		}
	},

	writeNewSelections: function(db, map) {
		function contains(arr, obj) {
			var i = arr.length;
			while (i--) {
				if (arr[i] === obj) {
					return true;
				}
			}
			return false;
		}

		var i, s = [], ap = {}, cur, t;

		if (db == 'lsos') t = 'Cookies';
		else t = 'Bugs';

		if (ghostery.prefs['selected' + t + 'String'] != '') {
			cur = ghostery.prefs['selected' + t + 'String'].split(',');
		} else {
			cur = [];
		}

		for (i in map) {
			if ( (!contains(cur, map[i].aid)) && (!contains(s, map[i].aid)) ) {
				s.push(map[i].aid);
			}
		}

		if (s.length > 0) {
			cur = cur.concat( s );
  		ghostery.prefs.writeSelectionFile(db, cur);
  		ghostery.prefs.set('reloadList', true);
  	}
	},

	lastUpdateIsNow: function() {
		var today = new Date();
		ghostery.prefs.pref.setCharPref('lastBugUpdate', today.getFullYear() + "_" + today.getMonth() + "_" + today.getDate());
		ghostery.prefs.lastBugUpdate = today;
	},

	refreshOnUpdate: function() {
		// Replace the bugs.db with ghostery-bugs.js on an update.
		this.loadDefaultFile('bugs');
		this.loadDefaultFile('lsos');
	},

	loadDefaultFile: function(dbName) {
		var starter = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader).loadSubScript("chrome://ghostery/content/ghostery-" + dbName + ".json");

		if (dbName == 'bugs') {
			this.bugs = starter;
			this.bugsVersion = this.bugs.bugsVersion;
			this.bugs = this.bugs.bugs;
		}

		if (dbName == 'lsos')
			this.lsos = starter;

		if (dbName == 'surrogates') {
			this.surrogates = starter;
			this.surrogates = this.surrogates.surrogates;
			starter = this.surrogates;
		}

		if (dbName == 'compatibility') {
			this.compatibility = starter;
			this.compatibility = this.compatibility.compatibility;
			starter = this.compatibility;
		}

		if (dbName == 'click2play') {
			var c2p = starter;

			this.saveBugs(starter, dbName);
			return c2p;
		}

		this.saveBugs(starter, dbName);
	},

	loadBugs: function() {
		var file = ghostery.prefs.getProfileDirectory(),
		 map = {},
		 partial_patterns_arr = [],
		 partial_patterns_aids = [],
		 i, j, is, sis, data, unwrapped, prev;

		file = ghostery.prefs.getOrCreateFile(file, "ghostery", true);
		file = ghostery.prefs.getOrCreateFile(file, "bugs.db", false);

		is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
		is.init(file, 0x01, 00004, null);
		sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance( Components.interfaces.nsIScriptableInputStream );
		sis.init( is );
		data = sis.read( sis.available() );

		/* Ghostery supplied database */
 		if (data == '') {
			this.loadDefaultFile('bugs');
 		} else {
 			try {
 				this.bugs = this.fromJSON(data).bugs;
 				this.bugsVersion = this.fromJSON(data).bugsVersion;

				// Happens when formatting on bugs.db is old
				if (!this.bugs)
					throw 'Reload Bug List from defaults.';
 			} catch (e) {
 				this.loadDefaultFile('bugs');
 			}
 		}

		// set official database non-user created
		for (i = 0; i < this.bugs.length; i++) {
			var bug = this.bugs[i];
			bug.userCreated = false;
		}

		is.close();
		sis.close();

		/* User supplied database */
		try {
			file = ghostery.prefs.getProfileDirectory();
			file = ghostery.prefs.getOrCreateFile(file, "ghostery", true);
			file = ghostery.prefs.getOrCreateFile(file, "user.bugs.db", false);
			is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
			is.init(file, 0x01, 00004, null);
			sis.init( is );
			data = sis.read( sis.available() );

			if (data != '') {
				data = this.fromJSON(data);

				// set user database as user created
				for (i = 0; i < data.length; i++) {
					var bug = data[i];
					bug.userCreated = true;
					bug.type = 'user-created';

					if (!bug.hasOwnProperty('aid')) bug.aid = 10000 + i;
					if (!bug.hasOwnProperty('cid')) bug.cid = 10000 + i;
					if (!bug.hasOwnProperty('id')) bug.id = 10000 + i;
				}

				this.bugs = this.bugs.concat( data );
			}

			is.close();
			sis.close();
		}	catch(ex) {
	  	var cs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	  	cs.logStringMessage('[GHOSTERY USER DATABASE EXCEPTION ' + ex + ']');
		}

		this.bugs.sort(ghostery.db.sorter);

		prev = '';
		for (i = 0; i < this.bugs.length; i++) {
			var bug = this.bugs[i];
			bug.regex = this.patternToRegex(bug.pattern);
			bug.id = bug.id.toString(); // coerce to string, just in case
			map[bug.id] = bug; // support key lookup

			if (prev != bug.aid) {
				this.bugsAppCount++;
				prev = bug.aid;
			}

			if ( ghostery.prefs.shouldBlockBug(bug.aid) ) {
				unwrapped = [];
				var pattern = bug.pattern;

				if (bug.pattern.replace(/(\\\.|\\\/|\\\?|\\\-)/g, '').match(/^[A-Za-z0-9;\-_]+$/)) {
					bug.simple = [bug.pattern.replace(/\\/g, '')];
				} else { // not a simple pattern
					var count = bug.pattern.split('(').length;
					if (count == 2) {
						unwrapped = this.unwrap(bug.pattern);

					} else {
						partial_patterns_arr.push(pattern);
						partial_patterns_aids.push(bug.aid);

						continue;
					}

					// process unwrapped patterns;
					var keep = true;
					if ( (unwrapped) && (unwrapped.length > 0) ) {
						for (j = 0; j < unwrapped.length; j++) {
							if (unwrapped[j].replace(/(\.|\/|\?)/g, '').match(/^[A-Za-z0-9;\-_]+$/)) {
								// a keeper!
							} else {
								keep = false;

								// remove all simple entries and move it into partials.
								bug.simple = [];
								partial_patterns_arr.push(pattern);
								partial_patterns_aids.push(bug.aid);

								break;
							}
						}

						if (keep) {
							bug.simple = unwrapped;
						}
					} else {
						partial_patterns_arr.push(pattern);
						partial_patterns_aids.push(bug.aid);
					}
				}
			}
		}

		if (partial_patterns_arr.length > 0) {
			this.partialBugs = [];
			for (i = 0; i < partial_patterns_arr.length; i++) {
				this.partialBugs.push({pattern: partial_patterns_arr[i], id: partial_patterns_aids[i]});
			}

			this.partialRegex = new RegExp(partial_patterns_arr.join('|'), 'i');
		} else {
			this.partialRegex = null;
		}

		this.bugsMap = map;
	},
	
	loadLsos: function() {
		var file = ghostery.prefs.getProfileDirectory();
		file = ghostery.prefs.getOrCreateFile(file, "ghostery", true);
		file = ghostery.prefs.getOrCreateFile(file, "lsos.db", false);

		var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
		is.init(file, 0x01, 00004, null);
		var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance( Components.interfaces.nsIScriptableInputStream );
		sis.init( is );
		var data = sis.read( sis.available() );

 		if (data == '') {
			this.loadDefaultFile('lsos');
 		} else {
 			try {
 				this.lsos = this.fromJSON(data);
 			} catch (e) {
 				this.loadDefaultFile('lsos');
 			}
 		}

		is.close();
		sis.close();

		this.lsos.sort(ghostery.db.sorter);

		var prev, map = {};
		for (var i = 0; i < this.lsos.length; i++) {
			var lso = this.lsos[i];
			lso.regex = this.patternToRegex(lso.pattern);
			lso.id = lso.id.toString(); // coerce to string, just in case
			map[lso.id] = lso; // support key lookup

			if (prev != lso.aid) {
				prev = lso.aid;
				this.lsosAppCount++;
			}
		}

		this.lsosMap = map;
	},

	saveBugs: function(obj, dbName) {
		var file = ghostery.prefs.getProfileDirectory();
		file = ghostery.prefs.getOrCreateFile(file, 'ghostery', true);
		file = ghostery.prefs.getOrCreateFile(file, dbName + '.db', false);

		var ois = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		ois.init( file, 0x04 | 0x08 | 0x20, 420, 0 );
		var result = ois.write( this.toJSON(obj), this.toJSON(obj).length );
		ois.close();
	},

	patternToRegex: function(pattern) {
		try {
			if (pattern)
				return new RegExp(pattern);
		} catch (e) { }
		return null;
	},

	/* JSON.stringify */
	toJSON: function(data) {
		try {
			return JSON.stringify(data);
		} catch (e) {
			var json = Components.classes["@mozilla.org/dom/json;1"].createInstance( Components.interfaces.nsIJSON );
			return json.encode(data);
		}
	},

	/* JSON.parse */
	fromJSON: function(data) {
		try {
			return JSON.parse(data);
		} catch (e) {
			var json = Components.classes["@mozilla.org/dom/json;1"].createInstance( Components.interfaces.nsIJSON );
			return json.decode(data);
		}
	},

	sorter: function(a, b) {
		var aName = a.name.toLowerCase();
		var bName = b.name.toLowerCase();
		return aName > bName ? 1 : aName < bName ? -1 : 0
	},

	unwrap: function(pattern) {
		var combined = [],
			first = pattern.substring(0, pattern.indexOf('(')),
			last = pattern.substring(pattern.lastIndexOf(')') + 1, pattern.length),
			parts = pattern.substring(pattern.indexOf('(') + 1, pattern.lastIndexOf(')')).split('|');

		// if this is an optional group, end all processing
		if ( (last == '?') || (last.charAt(0) == '?') ) {
			return combined;
		}
	
		for (var i = 0; i < parts.length; i++) {
			combined.push( (first + parts[i] + last).replace(/\\/g, '') );
		}
	
		return combined;
	}
};

ghostery.censusCache = {};
ghostery.chainCache = {};