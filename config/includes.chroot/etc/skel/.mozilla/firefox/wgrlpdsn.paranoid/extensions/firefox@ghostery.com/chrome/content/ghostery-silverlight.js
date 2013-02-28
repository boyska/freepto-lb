/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2011 Evidon
 *
 * @author Chetan Sarva
 * @copyright Copyright (C) 2011 Evidon
 */
 
if( !ghostery ) { var ghostery = {}; }

ghostery.silverlight = {
	linux: false,

	cleanupSilverlight: function() {
		paths = this.getSilverlightPaths();
		filtered = this.filterBlockedPaths(paths);
		for (i = 0, len = filtered.length; i < len; i++) {
			ghostery.debug.log("[silverlight] deleting: " + filtered[i]);
			ghostery.cleaner.SystemHelper.unlink(filtered[i], true);
		}
	},

	filterBlockedPaths: function(paths) {
		var idfile = "/" + this.idFilename();
		if (ghostery.cleaner.SystemHelper.isWindows()) { idfile = "\\" + this.idFilename(); }

		var re = new RegExp(ghostery.cleaner.fullBlockingRegex(), "i");
		var i, len;
		var matches = [];
		for (i = 0, len = paths.length; i < len; i++) {
			var p = paths[i];
			var id = this.readId(p + idfile);
			if (re.test(id)) {
				matches.push(p);
			}
		}

		return matches;
	},

	readId: function(file) {
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);  
		istream.init(ghostery.cleaner.SystemHelper.nsiFile(file), 0x01, 0444, 0);
		istream.QueryInterface(Components.interfaces.nsILineInputStream);  

		var line = {};
		hasmore = istream.readLine(line); 
		istream.close();

		if (this.linux) {
			matches = line.value.match(/^URI = (.*)$/);
			return matches[1];
		} else {
			return line.value;
		}
	},
	
	idFilename: function() {
		return (ghostery.cleaner.SystemHelper.isLinux() ? "config" : "id.dat");
	},

	getSilverlightPaths: function() {
		var paths = new ghostery.cleaner.PathHelper;
		var home = ghostery.cleaner.SystemHelper.homeDir();
		if (ghostery.cleaner.SystemHelper.isMac()) {
			return this.getMacSilverlightPaths();
		} else if (ghostery.cleaner.SystemHelper.isLinux()) {
			this.linux = true;
			return this.getLinuxSilverlightPaths();
		} else if (ghostery.cleaner.SystemHelper.isWindows()) {
			return this.getWindowsSilverlightPaths();
		}

		return paths.list;
	},
	
	// tested with Silverlight Version 3.0 (3.0.40818.0) on Mac OS X 10.6.2
	getMacSilverlightPaths: function() {
		var paths = new ghostery.cleaner.PathHelper();
		var home = ghostery.cleaner.SystemHelper.homeDir();
		
		is = home + "/Library/Application Support/Microsoft/Silverlight/is/";
		this.findSilverlightPaths(this.idFilename(), paths, is);
		
		return paths.list; 
	},
	
	getLinuxSilverlightPaths: function() {
		var paths = new ghostery.cleaner.PathHelper();
		var home = ghostery.cleaner.SystemHelper.homeDir();
		
		is = home + "/.local/share/moonlight/is/";
		this.findSilverlightPaths(this.idFilename(), paths, is);
		
		return paths.list;
	},
	
	getWindowsSilverlightPaths: function() {
		var paths = new ghostery.cleaner.PathHelper();
		var home = ghostery.cleaner.SystemHelper.homeDir();

		var is;
		if (ghostery.cleaner.SystemHelper.isWindowsVista()) {
			is = home + "\\AppData\\LocalLow\\Microsoft\\Silverlight\\is\\";
		} else {
			is = home + "\\Local Settings\\Application Data\\Microsoft\\Silverlight\\is\\";
		}

		this.findSilverlightPaths(this.idFilename(), paths, is);

		return paths.list;
	},
	
	/**
	 * Recursively searches path 'p', adding all directories containing the
	 * file idfile the paths list. 
	 *
	 * Windows/Mac: idfile = id.dat
	 * Linux (Moonlight): idfile = config
	 */
	findSilverlightPaths: function(idfile, paths, p) {
		var en = ghostery.cleaner.SystemHelper.fileEnumerator(p);
		if (en === null) {
			return;
		}

		var f;
		while (en.hasMoreElements() && (f = en.getNext())) {
			f.QueryInterface(Components.interfaces.nsIFile);
			if (f.isFile()) {
				var b = f.path.replace(/^.*[\/\\]/g, '');
				if (b.toLowerCase() == idfile) {
					paths.add(p);
					return;
				}
			} else if (f.isDirectory()) {
				this.findSilverlightPaths(idfile, paths, f.path);
			}
		}
	}
	
};