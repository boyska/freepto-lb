/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2011 Evidon
 *
 * @author Felix Shnir
 * @copyright Copyright (C) 2011 Evidon
 */

var scannerBugs = null,
 fullRegex = null;

function patternToRegex(pattern) {
	try {
		if (pattern)
			return new RegExp(pattern);
	} catch (e) {
		throw e;
	}

	return null;
}

function setScanRegex(event) {
	fullRegex = new RegExp(event.data.fullRegex);
}

function setBugs(event) {	
	scannerBugs = event.data.bugs;
	var priority,
			regexes = {
				high: [],
				regular: [],
				low: []
			}

	for ( var bug_num = 0; bug_num < scannerBugs.length; bug_num++ ) {
		var bug = scannerBugs[bug_num];
		scannerBugs[bug_num].regex = patternToRegex(bug.pattern);

		priority = 'regular';

		if (bug.hasOwnProperty('priority')) {
			priority = bug.priority;
		}

		regexes[priority].push(bug);
	}

	scannerBugs = regexes;
}

function stage11scan(event) {
	var src = event.data.src.toLowerCase(), isBug = false;
	try {
		if ( fullRegex.test(src) ) {
			isBug = true;
		}

		postMessage({"action": "stage11", "uid": event.data.uid, "isBug": isBug});
	} catch (e) {
		throw e;
	}
}

function stage22scan(event) {
	try {
		var uid = event.data.uid,
		 src = event.data.src.toLowerCase(),
		 detectedBug,
		 i, j,
		 priorities = ['high', 'regular', 'low'],
		 regexes;

		for (i = 0; i < priorities.length; i++) {
			regexes = scannerBugs[priorities[i]];

			for (j = 0; j < regexes.length; j++) {
				var bug = regexes[j];

				if ( bug.regex.test(src) ) {
					detectedBug = { "bug": bug, "script": event.data.src };
					break;
				}
			}

			if (detectedBug) {
				break;
			}
		}

		postMessage({"action": "stage22", "uid": uid, "bug": detectedBug});
	} catch (e) {
		postMessage({"action": "stageError", "error": e});
	}
}

onmessage = function(event) {
	if (event.data.action == 'setRegex') {
		setScanRegex(event);
	}

	if (event.data.action == 'setBugs') {
		setBugs(event);
	}

	if (event.data.action == 'stage11') {
		stage11scan(event);
	}

	if (event.data.action == 'stage22') {
		stage22scan(event);
	}
}