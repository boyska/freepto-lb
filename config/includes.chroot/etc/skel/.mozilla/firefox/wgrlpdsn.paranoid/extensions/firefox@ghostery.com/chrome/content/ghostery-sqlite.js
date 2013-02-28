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

ghostery.sqlite = {
	_init: false,
	ghostrankDb: null,

	_dbCreate: function(aDBService, aDBFile) {
		var dbConnection = aDBService.openDatabase(aDBFile);

		dbConnection.executeSimpleSQL("CREATE TABLE ghostrank (id INTEGER PRIMARY KEY, timestamp INTEGER, domain TEXT, path TEXT, aid INTEGER, was_blocked INTEGER, latency REAL )");

		return dbConnection;
	},
 
	init: function() {
		var dirService = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties);

		var file = dirService.get("ProfD", Ci.nsIFile);
		file.append("ghostery"); 
		file.append("ghostrank.sqlite"); 


		var dbService = Cc["@mozilla.org/storage/service;1"].getService(Ci.mozIStorageService);
		var dbConnection;

		if (!file.exists())
			dbConnection = this._dbCreate(dbService, file);
		else
			dbConnection = dbService.openDatabase(file);

		this.ghostrankDb = dbConnection;  
	},

	record: function(tracker) {
		if (!this._init)
			this.init();

		// (id INTEGER PRIMARY KEY, timestamp INTEGER, domain TEXT, path TEXT, aid INTEGER, was_blocked INTEGER, latency REAL )
		let stmt = this.ghostrankDb.createStatement("INSERT INTO ghostrank (timestamp, domain, path, aid, was_blocked, latency) "+
													"VALUES (:timestamp, :domain, :path, :aid, :was_blocked, :latency)");

		let params = stmt.newBindingParamsArray();
		let bp = params.newBindingParams();

		bp.bindByName("timestamp", (new Date()).getTime() );
		bp.bindByName("domain", tracker.host);
		bp.bindByName("path", tracker.pathname.split('?')[0] );
		bp.bindByName("aid", tracker.bugs[0].aid);
		bp.bindByName("was_blocked", (tracker.policyBlocked ? tracker.policyBlocked : false) );
		bp.bindByName("latency", tracker.latency);

		params.addParams(bp);
		stmt.bindParameters(params);

		stmt.executeStep();
	}
}