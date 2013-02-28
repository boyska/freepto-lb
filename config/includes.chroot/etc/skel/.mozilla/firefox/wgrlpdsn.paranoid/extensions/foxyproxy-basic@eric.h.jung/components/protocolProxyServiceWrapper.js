/**
  FoxyProxy
  Copyright (C) 2006-2012 Eric H. Jung and FoxyProxy, Inc.
  http://getfoxyproxy.org/
  eric.jung@yahoo.com

  This source code is released under the GPL license,
  available in the LICENSE file at the root of this installation
  and also online at http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
**/

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

var Cc = Components.classes, Ci = Components.interfaces;

function ProtocolProxyServiceWrapper() {
  this.wrappedJSObject = this;
  // Getting the old protocolProxyService in order to execute the methods we are
  // not interested in adapting.
  this.oldPPS = Components.
    classesByID["{E9B301C0-E0E4-11d3-A1A8-0050041CAF44}"].
    getService(Ci.nsIProtocolProxyService);
};

ProtocolProxyServiceWrapper.prototype = {
  oldPPS : null,
  fp : null,
  queuedRequests : [],

  // nsIProtocolProxyService
  asyncResolve : function(aURI, aFlags, aCallback) {
    // We can be pretty sure that we only get called if Gecko > 17. Thus, no
    // special check here. There is one call to asyncResolve() in Gecko <= 17
    // (http://mxr.mozilla.org/mozilla-esr17/source/netwerk/protocol/http/
    //  nsHttpChannel.cpp#1791) but that may happen only after the proxy got
    // resolved via applyFilter(). FoxyProxy ensures via the latter that this
    // asyncResolve() is never called, though, as mConnectionInfo->ProxyType()
    // can never be "unknown" in nsHttpChannel::Connect() with FoxyProxy
    // enabled: We are returning the last resort proxy if we got an error while
    // determining the proxy to use.
    if (this.fp.mode != "disabled") {
      let pi = this.fp.applyFilter(null, aURI, null);
      if (typeof pi != "string") {
        // TODO: Can we be sure we got a nsIProxyInfo object here? I don't think
        // so: _err() seems to give back a proxy!?
        aCallback.onProxyAvailable(null, aURI, pi, 0);
      } else {
        // We are not ready yet, queue the callback... We save the proxy ID as
        // well to be able to only call the onProxyAvailable() method of those
        // requests whose proxy just loaded the PAC file. Otherwise it could
        // happen in pattern mode that one proxy has already loaded a PAC file
        // and thus emptying the request queue which contains requests that
        // should be done via an other proxy which is still loading its PAC.
        this.queuedRequests.push([aCallback, aURI, pi.slice(5)]);
      }
    } else {
      this.oldPPS.asyncResolve.apply(this.oldPPS, arguments);
    }
  },

  getFailoverForProxy : function(aProxyInfo, aURI, aReason) {
    return this.oldPPS.getFailoverForProxy.apply(this.oldPPS, arguments);
  },

  newProxyInfo : function(aType, aHost, aPort, aFlags, aFailoverTimeout,
                          aFailoverProxy) {
    return this.oldPPS.newProxyInfo.apply(this.oldPPS, arguments);
  },

  resolve : function(aURI, aFlags) {
    return this.oldPPS.resolve.apply(this.oldPPS, arguments);
  },

  registerFilter : function(aFilter, aPosition) {
    this.oldPPS.registerFilter.apply(this.oldPPS, arguments);
  },

  unregisterFilter : function(aFilter) {
    this.oldPPS.unregisterFilter.apply(this.oldPPS, arguments);
  },

  // nsIProtocolProxyService2
  reloadPAC : function() {
    this.oldPPS.QueryInterface(nsIProtocolProxyService2).reloadPAC();
  },

  // It is deprecated but Java(tm) at least is using it. Thus we need to handle
  // it as well...
  deprecatedBlockingResolve : function(aURI, aFlags) {
    return this.fp.applyFilter(null, aURI, null);
  },

  classDescription: "FoxyProxy's protocol proxy service wrapper",
  contractID: "@mozilla.org/network/protocol-proxy-service;1",
  classID: Components.ID("{e52f4b1f-3338-4be6-b9b3-ac0861749627}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolProxyService,
    Ci.nsIProtocolProxyService2, Ci.nsISupports]),
  _xpcom_factory: {
    singleton: null,
    createInstance: function (aOuter, aIID) {
      if (aOuter) throw CR.NS_ERROR_NO_AGGREGATION;
      if (!this.singleton) this.singleton = new ProtocolProxyServiceWrapper();
      return this.singleton.QueryInterface(aIID);
    }
  }
};

/**
 * XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4)
 * XPCOMUtils.generateNSGetModule is for Mozilla 1.9.2 and earlier (Firefox 3.6)
 */
if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.
    generateNSGetFactory([ProtocolProxyServiceWrapper]);
else
  var NSGetModule = XPCOMUtils.
    generateNSGetModule([ProtocolProxyServiceWrapper]);
