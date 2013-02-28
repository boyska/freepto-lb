/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2011 Evidon
 *
 * @author Chetan Sarva
 * @copyright Copyright (C) 2011 Evidon
 */
 
if( !ghostery ) { var ghostery = {}; }

ghostery.lso = {
	cleanupLso: function() {
		paths = this.getLsoPaths();
		filtered = this.filterBlockedPaths(paths);
		for (i = 0, len = filtered.length; i < len; i++) {
			ghostery.debug.log("[flash] deleting: " + filtered[i]);
			ghostery.cleaner.SystemHelper.unlink(filtered[i], true);
		}
	},
	
	filterBlockedPaths: function(paths) {
		var re = new RegExp(ghostery.cleaner.fullBlockingRegex(), "i");
		var i, len;
		var matches = [];
		for (i = 0, len = paths.length; i < len; i++) {
			var p = paths[i];
			// extract the basename (host)
			var b = p.replace(/^.*[\/\\]/g, '');
			if (b.charAt(0) == "#") {
				b = b.substr(1);
			}
			if (re.test(b)) {
				matches.push(p);
			}
		}
		return matches;
	},


	getLsoPaths: function() {
		if (ghostery.cleaner.SystemHelper.isMac()) {
			return this.getMacLsoPaths();
		
		} else if (ghostery.cleaner.SystemHelper.isLinux()) {
			return this.getLinuxLsoPaths();
			
		} else if (ghostery.cleaner.SystemHelper.isWindows()) {
			return this.getWindowsLsoPaths();
			
		}
		var paths = new ghostery.cleaner.PathHelper();
		return paths.list;
	},
	
	getMacLsoPaths: function() {
		var paths = new ghostery.cleaner.PathHelper();
		var home = ghostery.cleaner.SystemHelper.homeDir();
		
		// enumerate paths in here and add each to list, except special ## 
		var sys = home + "/Library/Preferences/Macromedia/Flash Player/macromedia.com/support/flashplayer/sys/";
		paths.addAll(sys, "##");
		paths.addAll(sys + "##/");	
			
		// enumerate all the dirs under SharedObjects
		this.enumerateSubDir(paths, home + "/Library/Preferences/Macromedia/Flash Player/#SharedObjects/");
		
		return paths.list;
	},
	
	getLinuxLsoPaths: function() {
		var paths = new ghostery.cleaner.PathHelper();
		var home = ghostery.cleaner.SystemHelper.homeDir();
			
		// enumerate all the dirs under SharedObjects
		this.enumerateSubDir(paths, home + "/.macromedia/Flash_Player/#SharedObjects/");
		
		return paths.list;
	},
	
	getWindowsLsoPaths: function() {
		var paths = new ghostery.cleaner.PathHelper();
		var home = ghostery.cleaner.SystemHelper.homeDir();
		var data = ghostery.cleaner.SystemHelper.appDataDir();

		if (ghostery.cleaner.SystemHelper.isWindowsVista()) {
			// shared
			this.enumerateSubDir(paths, data + "\\Roaming\\Macromedia\\Flash Player\\#SharedObjects\\");
			// sys
			paths.addAll(data + "\\Roaming\\Macromedia\\Flash Player\\macromedia.com\\support\\flashplayer\\sys\\");
		} else {
			// shared objects
			this.enumerateSubDir(paths, data + "\\Macromedia\\Flash Player\\#SharedObjects\\");
			this.enumerateSubDir(paths, "C:\\Documents and Settings\\LocalService\\Application Data\\Macromedia\\Flash Player\\#SharedObjects\\");
			this.enumerateSubDir(paths, "C:\\Documents and Settings\\NetworkService\\Application Data\\Macromedia\\Flash Player\\#SharedObjects\\");
			// sys
			paths.addAll(data + "\\Macromedia\\Flash Player\\macromedia.com\\support\\flashplayer\\sys\\");
			paths.addAll("C:\\Documents and Settings\\LocalService\\Application Data\\Macromedia\\Flash Player\\macromedia.com\\support\\flashplayer\\sys\\");
			paths.addAll("C:\\Documents and Settings\\NetworkService\\Application Data\\Macromedia\\Flash Player\\macromedia.com\\support\\flashplayer\\sys\\");			
		}

		return paths.list;
	},
	
	enumerateSubDir: function(paths, dir) {
		var en = ghostery.cleaner.SystemHelper.fileEnumerator(dir);
		if (en === null) {
			return paths;
		}

		while (en.hasMoreElements() && (f = en.getNext())) {
			f.QueryInterface(Components.interfaces.nsIFile);
			if (f.isDirectory()) {
				paths.addAll(f.path);
			}	
		}
	}
};