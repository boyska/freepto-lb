/**
 *  Ghostery Firefox Extension: http://www.ghostery.com/
 *
 *  Copyright (C) 2010 Better Advertising
 *
 *	@author Felix Shnir
 *  @author David Cancel
 *	@copyright Copyright (C) 2010 Felix Shnir <felix@betteradvertising.com>
 *  @copyright Copyright (C) 2008-2009 David Cancel <dcancel@dcancel.com>
 */
function openURL(aUrl){
  if("@mozilla.org/xre/app-info;1" in Components.classes)      
     return;
  else{
     //for pre 1.5 version
     window.opener.openURL(aUrl)  
  }
}

function openChrome(aUrl) {
	var win = Components.classes['@mozilla.org/appshell/window-mediator;1']
											.getService(Components.interfaces.nsIWindowMediator)
											.getMostRecentWindow('navigator:browser');
	win.gBrowser.selectedTab = win.gBrowser.addTab(aUrl);
}

function init() {
	document.getElementById('ghostery.version').value = ghostery.prefs.version;
}