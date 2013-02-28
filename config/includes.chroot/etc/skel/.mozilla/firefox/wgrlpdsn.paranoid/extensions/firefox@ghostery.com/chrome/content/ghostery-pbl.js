if( !ghostery ) { var ghostery = {}; }

ghostery.pbl = function PrivateBrowsingListener() {
  this.init();
}

ghostery.pbl.prototype = {
  _os: null,
  _inPrivateBrowsing: false, // whether we are in private browsing mode
  _watcher: null, // the watcher object
 
  init : function () {
    this._inited = true;
    this._os = Components.classes["@mozilla.org/observer-service;1"]
                         .getService(Components.interfaces.nsIObserverService);
    this._os.addObserver(this, "private-browsing", false);
    this._os.addObserver(this, "quit-application", false);
    try {
      var pbs = Components.classes["@mozilla.org/privatebrowsing;1"]
                          .getService(Components.interfaces.nsIPrivateBrowsingService);
      this._inPrivateBrowsing = pbs.privateBrowsingEnabled;
    } catch(ex) {
      // ignore exceptions in older versions of Firefox
    }
  },
 
  observe : function (aSubject, aTopic, aData) {
    if (aTopic == "private-browsing") {
      if (aData == "enter") {
        this._inPrivateBrowsing = true;
        if (this.watcher &&
            "onEnterPrivateBrowsing" in this._watcher) {
          this.watcher.onEnterPrivateBrowsing();
        }
      } else if (aData == "exit") {
        this._inPrivateBrowsing = false;
        if (this.watcher &&
            "onExitPrivateBrowsing" in this._watcher) {
          this.watcher.onExitPrivateBrowsing();
        }
      }
    } else if (aTopic == "quit-application") {
      this._os.removeObserver(this, "quit-application");
      this._os.removeObserver(this, "private-browsing");
    }
  },
 
  get inPrivateBrowsing() {
    return this._inPrivateBrowsing;
  },
 
  get watcher() {
    return this._watcher;
  },
 
  set watcher(val) {
    this._watcher = val;
  }
};