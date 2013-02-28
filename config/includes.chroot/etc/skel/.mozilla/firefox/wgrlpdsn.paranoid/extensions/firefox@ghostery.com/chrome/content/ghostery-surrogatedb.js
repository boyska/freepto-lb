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

ghostery.surrogatedb = (function () {
	var surrogates = {
		pattern_ids: {},
		app_ids: {},
		site_surrogates: {}
	},
		id = 1;
	
	function buildSurrogateDb(surrogate_obj, property, db_name) {
		surrogate_obj[property].forEach(function (each_value) {
			if (!surrogates[db_name].hasOwnProperty(each_value)) {
				surrogates[db_name][each_value] = [];
			}
			surrogates[db_name][each_value].push(surrogate_obj);
		});
	}

	function hasMatchSitesProperty(surrogate_obj, script, host_name) {
		if (surrogate_obj.hasOwnProperty("match") && surrogate_obj.hasOwnProperty("sites")) {
			if (script.match(new RegExp(surrogate_obj.match, '')) && surrogate_obj.sites.indexOf(host_name) >= 0) {
				return surrogate_obj.code;
			}
		} else if (surrogate_obj.hasOwnProperty("match")) {
			if (script.match(new RegExp(surrogate_obj.match, ''))) {
				return surrogate_obj.code;
			}
		} else if (surrogate_obj.hasOwnProperty("sites")) {
			if (surrogate_obj.sites.indexOf(host_name) >= 0) {
				return surrogate_obj.code;
			}
		} else {
			return surrogate_obj.code;
		}
	}

	function iterateTrackers(surrogate_obj, script, host_name) {
		var replacement = '',
			temp_replacement = '',
			surrogate_ids = [];
		for (var j = 0; j < surrogate_obj.length; j++) {
			temp_replacement = hasMatchSitesProperty(surrogate_obj[j], script, host_name);
			if (temp_replacement) {
				replacement += temp_replacement;
				surrogate_ids.push(surrogate_obj[j].id)
			}
		}
		return {
			'replacement': replacement,
			'surrogate_ids': surrogate_ids
		};
	}

	function insertSurrogate(replacement, script_ids) {
		var ids='';	
		ghostery.prefs.arrayForEach(script_ids, function(each_id) {
			ids += '_'+each_id;
		});
		var scriptId = "ghostery"+ids;
		
		var doc = gBrowser.selectedBrowser.contentDocument;
		if (!doc.getElementById(scriptId)) {
		var scriptSurrogate = doc.createElement("script");
		scriptSurrogate.id = scriptId;
		scriptSurrogate.appendChild(doc.createTextNode(replacement));
		doc.documentElement.insertBefore(scriptSurrogate, doc.documentElement.firstChild);
	}
	}
	
	var db = ghostery.db.loadSurrogates();

	ghostery.prefs.arrayForEach(db, function (surrogate_obj) {
		surrogate_obj["id"] = id;
		id++; 
		if (surrogate_obj.hasOwnProperty("pattern_id")) {
			buildSurrogateDb(surrogate_obj, "pattern_id", "pattern_ids");
		}
		if (surrogate_obj.hasOwnProperty("app_id")) {
			buildSurrogateDb(surrogate_obj, "app_id", "app_ids");
		}
		if (surrogate_obj.hasOwnProperty("sites") && !surrogate_obj.hasOwnProperty("pattern_id") && !surrogate_obj.hasOwnProperty("app_id")) {
			buildSurrogateDb(surrogate_obj, "sites", "site_surrogates");
		}
	});
		
	return {
			
		getTrackerSurrogate: function (script, app_id, pattern_id, host_name) {
			
			var replacement = '',
				db = surrogates,
				temp_replacement = '',
				surrogate_obj,
				appIdResult,
				patternIdResult,
				script_ids = [];
				
			if (db.app_ids.hasOwnProperty(app_id)) {
				surrogate_obj = db.app_ids[app_id];
				appIdResult = iterateTrackers(surrogate_obj, script, host_name);
				replacement += appIdResult['replacement'];
				ghostery.prefs.arrayForEach(appIdResult['surrogate_ids'], function(each) {
					script_ids.push(each);
				});
			}
			
			if (db.pattern_ids.hasOwnProperty(pattern_id)) {
				surrogate_obj = db.pattern_ids[pattern_id];
				patternIdResult = iterateTrackers(surrogate_obj, script, host_name);
				replacement += patternIdResult['replacement'];
				ghostery.prefs.arrayForEach(patternIdResult['surrogate_ids'], function(each) {
					script_ids.push(each);
				});
			}
			
			if (replacement) {
				insertSurrogate(replacement, script_ids);
			}
		},

		getSiteSurrogate: function (host_name) {
			if (surrogates.site_surrogates.hasOwnProperty(host_name)) {
				insertSurrogate(surrogates.site_surrogates[host_name].code);
			}
		}
	};
}());


