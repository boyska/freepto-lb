/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2011 Evidon
 *
 * @author Chetan Sarva
 * @copyright Copyright (C) 2011 Evidon
 */

if( !ghostery ) { var ghostery = {}; }

ghostery.cleaner = {
	cleanup: function() {		
		var start = new Date();
		try { ghostery.lso.cleanupLso(); } catch (e) {}
		try { ghostery.silverlight.cleanupSilverlight(); } catch (e) {}
		ghostery.debug.log("Completed in: " + (new Date() - start) + "ms\n\n\n");
	},

	/**
	 * Creates a regex for all selected trackers. Differs from regex in 
	 * ghostery.prefs.fullBlockingRegex() in that the forward slash is removed from hostnames.
	 * v2.5 (Felix Shnir): selecting all lsos for nuking.
	 */
	fullBlockingRegex: function() {
		var regex = null;

		try {
			for ( var i = 0; i < ghostery.db.lsos.length; i++ ) {
				var bug = ghostery.db.lsos[i];
				regex = (regex ? regex : "") + "|" + bug.pattern.substring(1, bug.pattern.length - 1);
			}

			if (regex) regex = regex.substring(1);
		} catch (err) {}
		
		return regex;
	}	
};

ghostery.cleaner.SystemHelper = {
	osName: null,

	nsiFile: function(f) {
		try {
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(f);
			return file;
		} catch (err) {
			return null; // TODO file doesn't exist, generally
		}
	},
	
	unlink: function(f, recursive) {
		var file = this.nsiFile(f);
		if (file.exists()) {
			file.remove(recursive);
		}
	},
	
	fileEnumerator: function(f) {
		var file = this.nsiFile(f);
		if (file && file.exists() && file.isDirectory()) {
			return file.directoryEntries;
		}
		return null;
	},
	
	exists: function(f) {
		var file = this.nsiFile(f);
		if (file === null) {
			return false;
		}
		return file.exists();
	},
	
	getDir: function(dir) {
		var dirService = Components.classes["@mozilla.org/file/directory_service;1"]
							.getService(Components.interfaces.nsIProperties);
		var dirFile = dirService.get(dir, Components.interfaces.nsIFile); // returns an nsIFile object  
		return dirFile.path;		
	},

	homeDir: function() {
		return this.getDir("Home");
	},

	appDataDir: function() {
		return this.getDir("AppData");
	},

	docsDir: function() {
		var home = this.homeDir();
		if (this.isWindowsVista()) {
			return home.charAt(0) + ":\\ProgramData\\";
		}
		return home.charAt(0) + ":\\Documents and Settings\\";
	},
	
	isMac: function() {
		return ((this.os() != null && this.os().match(/Darwin/)));
	},
	
	isWindows: function() {
		return ((this.os() != null && this.os().match(/WINNT/)));
	},
	
	isWindowsVista: function() {
		if (!this.isWindows()) {
			return false;
		}
		return this.exists(this.homeDir() + "\\AppData\\");
	},
	
	isLinux: function() {
		return ((this.os() != null && this.os().match(/Linux/)));
	},
	
	// Returns "WINNT" on Windows Vista, XP, 2000, and NT systems;  
	// "Linux" on GNU/Linux; and "Darwin" on Mac OS X.
	//
	// NOTE: May also include Version # on older versions of FF/SeaMonkey
	os: function() {
		if (this.osName != null) {
			return this.osName;
		}
		try {
			this.osName = Components.classes["@mozilla.org/xre/app-info;1"]  
								.getService(Components.interfaces.nsIXULRuntime).OS;
		} catch (err) {
			// use alternate method for older versions of FF/SeaMonkey
			this.osName = Components.classes["@mozilla.org/network/protocol;1?name=http"]  
								.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;
			
		}
		return this.osName;
	}
}; // SystemHelper

ghostery.cleaner.PathHelper = function PathHelper() {
	this.list = [];
};

ghostery.cleaner.PathHelper.prototype = {
	add: function(p) {
		if (ghostery.cleaner.SystemHelper.exists(p)) {
			this.list.push(p);
		}
	},
	addAll: function(p, ex) {
		// ex: regex pattern of files/directories to exclude from the list
		
		var re = (ex == null ? null : new RegExp(ex));
		
		var en = ghostery.cleaner.SystemHelper.fileEnumerator(p);
		if (en === null) {
			return;
		}
		var f;
		while (en.hasMoreElements() && (f = en.getNext())) {
			f.QueryInterface(Components.interfaces.nsIFile);			
			if (re == null || !re.test(f.path)) {
				this.add(f.path);
			}
			if (f.isDirectory()) {
				this.addAll(f.path, ex);
			}
			
		}
	}
}; // PathHelper

//ghostery.debug.log("registering lso");
//ghostery.cleaner.registerShutdownHook();
//ghostery.cleaner.cleanup();
