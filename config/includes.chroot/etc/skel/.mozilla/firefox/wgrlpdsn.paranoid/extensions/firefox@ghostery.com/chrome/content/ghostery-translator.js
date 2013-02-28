/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 *
 * Copyright (C) 2008-2009 David Cancel
 * Copyright (C) 2010 Better Advertising
 *
 * @author Felix Shnir
 * @author David Cancel
 * @copyright Copyright (C) 2008-2009 David Cancel <dcancel@dcancel.com>
 * @copyright Copyright (C) 2010 Better Advertising
 */
if( !ghostery ) { var ghostery = {}; }

ghostery.translator = {
	lang: '',

	'en': {
		'settings.title': 'Ghostery Options',

		'general-tab': 'General',
		'advanced-tab': 'Advanced',

		'settings.promo.desc': 'Like Ghostery?',
		'settings.promo.rate': '<a target="new" id="ratelink" href="https://addons.mozilla.org/en-US/firefox/addon/ghostery/">Rate It!</a>',
		'settings.promo.survey': 'Also, <a target="new" href="http://www.surveymonkey.com/s/ghostghost">Take our Survey!</a>',

		'settings.inthe':'in the',
		'settings.corner.label':'corner',
		'settings.filter.show.any':'any',
		'settings.filter.show.no':'no',
		'settings.filter.show.some':'some',
		'settings.filter.show.new':'new since last update',

		'settings.showalert':'Show Alert Bubble',
		'settings.showalert.extra':'(while browsing)',
		'settings.expandsources':'Show tracker sources by default',
		'settings.expandsources.extra':'(in the browser popup)',
		'settings.autoupdate':'Enable library auto-update',
		'block_log': 'Block Log',
		'close.label': 'Close',
		'clear.label': 'Clear',
		'settings.tab.sharing_options': 'Sharing Options',
		'settings.tab.update_options': 'Auto Update',
		'settings.tab.update_options.desc': "Ghostery routinely updates its tracker library of beacons, advertisements, analytics services, page widgets, and other third-party page elements.",
		'settings.tab.blocking.note': "Ghostery groups trackers into categories. Click on a category row to browse trackers in that category. Mark checkboxes to block, click element names for more information.",
		'settings.tab.blocking.note2': 'Note: Blocking may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc., pause blocking by clicking on the Ghostery icon, or whitelist the affected page.',
		'settings.careful': 'Help support Ghostery',
		'settings.desc': "GhostRank sends anonymous statistical information about the trackers, ads, and other scripts that Ghostery encounters and the pages on which they're found. It does not make use of browser cookies or flash cookies and stores no unique information about the user (not even an IP address).",
		'settings.desc2': "Ghostery uses this information to create panel data about the proliferation of these scripts and shares this data with the Ghostery community, companies interested in measuring their own activity and compliance with privacy standards across the web, and organizations dedicated to holding these companies accountable. GhostRank data is not used to target advertising and is never shared for that purpose. For more details on exactly what GhostRank collects, please visit our <a target='_blank' href='http://www.ghostery.com/faq'>FAQ</a>.",
		'settings.desc3':"By participating in GhostRank, you're agreeing to become part of this anonymous panel and you\'re helping to support Ghostery as you browse the web.",
		'settings.bugrank': 'Enable GhostRank',
		'settings.tab.options':'Display Options',
		'settings.bugcount':'Show Ghostery in Add-on Bar',
		'settings.navbar':'Show Ghostery button in Navigation Bar',
		'settings.bugcount.inbrowsing':'(while browsing)',
		'settings.dismiss':'Dismiss Alert Bubble after',
		'settings.dismiss.seconds':'seconds',
		'settings.label.bubble_location': 'Bubble Location',
		'settings.label.bubble_location.top-left': 'top-left',
		'settings.label.bubble_location.top-right': 'top-right',
		'settings.label.bubble_location.bottom-left': 'bottom-left',
		'settings.label.bubble_location.bottom-right': 'bottom-right',
		'settings.tab.blocking': 'Blocking Options',
		'settings.blocking.description': 'Enable web bug blocking',
		'settings.save': 'Save',
		'settings.cancel': 'Cancel',
		'settings.blocking.cleanup': 'Delete Flash and Silverlight cookies on exit',
		'settings.whitelist.desc':'You can specify a list of sites where Ghostery will not block any trackers or cookies.',
		'settings.whitelist.add_desc': 'Add new site:',
		'settings.whitelist.add':'Add',
		'settings.whitelist.remove':'Remove',
		'settings.whitelist.removeAll':'Remove All',
		'settings.walkthrough.link': "For a walkthrough of Ghostery's key options, try the <a href='chrome://ghostery/content/wizard.html'>Ghostery Configuration Wizard</a>.",
		'settings.warning.yahoo': "It looks like you're also using the Yahoo! Toolbar Addon. This extension has been known to conflict with Ghostery, and may cause Ghostery not to operate properly. For best results, please disable or remove the Yahoo! Toolbar before browsing with Ghostery.",
		'settings.warning.beeftaco': "It looks like you're also using the <strong>Beef Taco</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.<br/><br/>",
		'settings.warning.googleoptout': "It looks like you're also using the <strong>Google Opt-Out</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.",
		'settings.autoupdate.noupdate': 'Auto-updates are highly recommended.',
		'settings.autoupdate.updatenow': 'Update now',
		'settings.autoupdate.lastupdate': 'Library updated on',
		/* Blocking (all or no or 123 of 321) bugs */
		'settings.blocking.label':'Blocking',
		'settings.bugs.label':'trackers',
		'settings.bugs.category.label':'elements',
		'settings.elements':'elements',
		'settings.of.label':'of',
		'settings.all.label':'all',
		'settings.no.label':'no',
		/* (check to block, click for more info) or (click for more info) */
		'settings.check2block':'check to block, ',
		'settings.click4moreinfo':'click for more info',
		'settings.affiltable.header':'Companies may belong to trade groups that work to standardize practices and procedures. Click below for more information.',
		'settings.anon.tail': 'by sending anonymous statistical data back to Ghostery HQ.',
		'settings.more.info': "Click here for more information",
		'settings.saving': 'Saving...',
		'settings.noresults': 'No Results',

		'settings.count.total': 'total',
		'settings.count.blocked': 'blocked',

		'reset-search-2': 'Reset search',
		'expand-all-2': 'Expand all',
		'collapse-all-2': 'Collapse all',
		'select-all-2': 'Select all',
		'select-none-2': 'Select none',

		'settings.filter.show': 'Show',
		'settings.filter.with': 'with',
		'settings.filter.affiliation': 'affiliation',
		'settings.filter.show.all': 'all',
		'settings.filter.show.blocked': 'blocked',
		'settings.filter.show.unblocked': 'unblocked',
		'settings.filter.label':'Search for',
		'settings.filter.search_placeholder':'name',
		'settings.whitelist.donotperform':'Do not perform blocking on these sites:',
		'settings.cookie.label': 'cookies',
		'settings.cookies.label': 'cookies',
		'settings.cookie_protect': 'Enable cookie protection',
		'label.bugs': 'Trackers',
		'label.cookies': 'Cookies',
		'label.sites': 'Site whitelist',

		'settings.bugs.note': 'When you block a tracker, that element is prevented from communicating with its third-party provider.',
		'settings.cookies.note': 'When you block a cookie, selected third-party providers are unable to write cookies to your browser.<br><br><em><strong>Warning!</strong></em> When combined with other cookie monitoring addons such as <strong>Beef Taco</strong>, <strong>Cookie Monster</strong>, and <strong>Google Opt-Out</strong>, this feature can cause <b>unresponsive script</b> errors. If you experience this error, please try disabling this feature or conflicting addons.',

		/* performance options */
		'settings.tab.performance': 'Performance Options',
		'settings.blockImage': 'Scan and block images',
		'settings.blockFrame': 'Scan and block iframes',
		'settings.blockObject': 'Scan and block embed and object tags',
		'settings.preventRedirect':'Look for and prevent redirection',

		/* update options */
		'settings.updateBlockBehaviour': 'Block new elements by default',
		'settings.updateNotification': 'Notify me of new elements',

		/* walkthrough items */
		'walkthrough.desc.communicate': 'These options configure how often, if ever, you communicate with Ghostery HQ.',
		'walkthrough.desc.ghostrank.head':'Help Support Ghostery!',
		'label.experimental':'[experimental]',
		'walkthrough.cookie.addon.warning': '<span><em><strong>Warning!</strong></em> When combined with other cookie monitoring addons such as <strong>Beef Taco</strong>, <strong>Cookie Monster</strong>, and <strong>Google Opt-Out</strong>, this feature can cause <b>unresponsive script</b> errors. If you experience this error, please try disabling this feature or conflicting addons.</span>',
		'walkthrough.button.skip-wizard':'Skip Wizard',
		'walkthrough.button.get-started':'Get Started',
		'walkthrough.button.next':'Next',
		'walkthrough.label.intro':'Intro',
		'walkthrough.label.ghostrank':'Sharing',
		'walkthrough.label.notification':'Notification',
		'walkthrough.label.autoupdatebuglist':'3pe Library Updates',
		'walkthrough.label.blocking':'Blocking',
		'walkthrough.label.back-cover':'Back Cover',
		'walkthrough.desc.intro.1':'Welcome to Ghostery',
		'walkthrough.desc.intro.2':'Ghostery looks for third party page elements (which we call "trackers") on the web pages you visit. These can be things like social network plugins, advertisements, invisible pixels used for tracking and analytics, etc. Ghostery notifies you that these things are present, and which companies operate them. You can learn more about these companies, and if you wish, choose to block the trackers they operate. <br><br>This quick walkthrough will highlight some of Ghostery\'s options and give you a chance to set things up straight-away. You can change any of these decisions (and view more options) by visiting the Ghostery options menu at any time. If you have any questions during the process, drop us a line at <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a>.',
		'walkthrough.desc.ghostrank.1':'Enabling GhostRank will allow you to anonymously participate in an information-gathering panel designed to improve Ghostery performance and create a census of advertisements, tracking beacons, and other page scripts across the web.  The data collected is used only in aggregate, contains no personally identifiable information, and will never be used to target advertising.',
		'walkthrough.desc.ghostrank.2':'When you encounter a third-party page element (and have GhostRank enabled), Ghostery sends a record that includes the following:',
		'walkthrough.desc.ghostrank.3':'<li>Page element(s) identified by Ghostery</li><li>Element(s) blocked by Ghostery</li><li>Number of times the element has been identified</li><li>Domains identified as serving elements</li><li>Advertisements served at particular domains, including companies associated with each ad</li><li>Information about the type of notice associated with each ad</li><li>The browser in which Ghostery has been installed</li><li>Ghostery version information</li>',
		'walkthrough.desc.ghostrank.4':'GhostRank is an opt-in feature.  You can opt-in to GhostRank now, or any time in the future via the Ghostery options menu.',
		'walkthrough.checkbox.ghostrank':'Click here to enable GhostRank',
		'walkthrough.desc.notification.1':'When Ghostery detects trackers on a page you\'re visiting, it displays the companies that operate those elements in a purple box at the top right corner of the screen. If you\'d rather Ghostery work in the background, you can uncheck the box below. There are more ways to customize the purple box in the Ghostery options menu.',
		'walkthrough.checkbox.notification':'Click here to enable Alert Bubble',
		'walkthrough.desc.autoupdatebuglist.1':'Ghostery routinely adds to and refines our list of companies that operate trackers, ad servers, analytics services, page widgets, and other trackers. You can update this list manually from the Ghostery options menu, or you can enable Ghostery\'s auto-update service, which periodically checks for new additions to Ghostery\'s library and includes them automatically.',
		'walkthrough.checkbox.autoupdatebuglist':'Click here to enable library Auto-Update',
		'walkthrough.desc.blocking.1':'Ghostery can prevent the page elements it detects from running in your browser. Trackers that are blocked will appear crossed out in the notification bubble. Blocking trackers will prevent them from running in your browser, which can help control how your behavioral data is tracked.',
		'walkthrough.desc.blocking.2':'Note: Blocking elements and/or cookies may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc. - pause blocking by clicking on the Ghostery icon or whitelist the affected site in the Ghostery options menu.',
		'walkthrough.checkbox.blocking.1':'Click here to enable Blocking',
		'walkthrough.checkbox.blocking.2':'Click here to enable Cookie Protection',
		'walkthrough.helper.blocking.1':'(and block all known trackers)',
		'walkthrough.desc.back-cover.1':'You\'re all done - Ghostery is ready to use.',
		'walkthrough.desc.back-cover.2':'To learn the latest about Ghostery and user privacy across the web, check out our <a href="http://news.ghostery.com/" target="_blank">blog</a>, <a href="http://twitter.com/ghostery" target="_blank">follow us</a> on Twitter, or visit our <a href="http://www.facebook.com/ghostery/" target="_blank">Facebook page</a>.',
		'walkthrough.desc.back-cover.3':'For support, email <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a> or visit <a href="http://www.ghostery.com/feedback" target="_blank">our forums</a>.',
		'walkthrough.desc.back-cover.4':'Thanks for using Ghostery!',
		'walkthrough.skip.prompt':'This will skip the configuration wizard. You can access it again from the Ghostery menu, or manage your options directly by selecting "Manage Ghostery Options". Skip Wizard?',
		
		/* click2play text strings */
		'settings.tab.click2play': 'Click-to-Play Options',
		'settings.click2play_desc': 'Replace certain blocked content with an option to allow it. (This helps with certain video players, comment forms, etc.)',
		'settings.click2play_desc.button': 'Also replace Social Buttons (Like Google+ Button, Twitter Badge, Facebook Like, and Pinterest\' Pin-it.)',

		'click2play.comment_form': 'Ghostery blocked the $NAME$ comment form.',
			
		/* popup tooltips */
		'tooltip.pause': 'Enable / Disable Blocking',
		'tooltip.options': 'Options',
		'tooltip.feedback': 'Give us feedback',
		'tooltip.help': 'Help',
		'tooltip.share': 'Share Ghostery',

		/* new panel toggle */
		'settings.panel.new.info': 'Not ready for the new panel? Revert to the old menu temporarily (restart required)'
	},

	'de': {
		'settings.title': 'Ghostery Options',

		'general-tab': 'General',
		'advanced-tab': 'Advanced',

		'settings.promo.desc': 'Like Ghostery?',
		'settings.promo.rate': '<a target="new" id="ratelink" href="https://addons.mozilla.org/en-US/firefox/addon/ghostery/">Rate It!</a>',
		'settings.promo.survey': 'Also, <a target="new" href="http://www.surveymonkey.com/s/ghostghost">Take our Survey!</a>',

		'settings.inthe':'in the',
		'settings.corner.label':'corner',
		'settings.filter.show.any':'any',
		'settings.filter.show.no':'no',
		'settings.filter.show.some':'some',
		'settings.filter.show.new':'new since last update',

		'settings.showalert':'Warnmeldung einblenden',
		'settings.showalert.extra':'(bei Nutzung des Browsers)',
		'settings.expandsources':'Show tracker sources by default',
		'settings.expandsources.extra':'(in the browser popup)',
		'settings.autoupdate':'Automatische Aktualisierung der Zählpixelliste aktivieren',
		'block_log': 'Blockierprotokoll',
		'close.label': 'Schließen',
		'clear.label': 'Löschen',
		'settings.tab.sharing_options': 'Freigabeoptionen',
		'settings.tab.update_options': 'Auto Update',
		'settings.tab.update_options.desc': 'Ghostery routinely updates its tracker library of beacons, advertisements, analytics services, page widgets, and other third-party page elements.',
		'settings.tab.blocking.note': 'Note: Blocking elements and/or cookies may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc. - pause blocking by clicking on the Ghostery icon or whitelist the affected site (below).',

		'settings.careful': 'Unterstützen Sie Ghostery! LESEN SIE SICH DIESEN TEXT SORGFÄLTIG DURCH.',
		'settings.desc': "GhostRank sendet anonyme statistische Informationen zu Trackern, Anzeigen und anderen Skripten, die Ghostery findet, und zu den Seiten, auf denen sie gefunden wurden. Es nutzt keine Browser-Cookies oder Flash-Cookies und speichert keine individuellen Benutzerinformationen (nicht einmal IP-Adressen).",
		'settings.desc2': "Ghostery nutzt diese Informationen, um Paneldaten zur Verbreitung dieser Skripte zu erstellen, und teilt diese Daten mit der Ghostery-Community, Unternehmen, die ihre eigenen Aktivitäten genau bestimmen möchten und Compliance mit Datenschutzbestimmungen für das Internet erreichen möchten, sowie Organisationen, die sich für die Übernahme von Verantwortung durch diese Unternehmen einsetzen. GhostRank-Daten werden nicht für individuelle Werbung verwendet und niemals für diesen Zweck weitergegeben. Weitere Details zu den Daten, die GhostRank erfasst, finden Sie in unseren <a target='_blank' href='http://www.ghostery.com/faq'>FAQs</a>.",
		'settings.desc3':"Mit der Teilnahme an GhostRank stimmen Sie zu, Teil dieses anonymen Panels zu werden, und Sie unterstützen Ghostery, wenn Sie im Internet surfen.",
		'settings.bugrank': "GhostRank aktivieren",
		'settings.tab.options':'Allgemeine Optionen',
		'settings.bugcount':'Ghostery in Add-on-Leiste anzeigen',
		'settings.navbar':'Ghostery Schaltfläche in Navigationsleiste anzeigen',
		'settings.bugcount.inbrowsing':'(bei Nutzung des Browsers)',
		'settings.dismiss':'Warnmeldung ausblenden nach',
		'settings.dismiss.seconds':'Sekunden',
		'settings.label.bubble_location': 'Position der Warnmeldung',
		'settings.label.bubble_location.top-left': 'oben links',
		'settings.label.bubble_location.top-right': 'oben rechts',
		'settings.label.bubble_location.bottom-left': 'unten links',
		'settings.label.bubble_location.bottom-right': 'unten rechts',
		'settings.tab.blocking': 'Blockieroptionen',
		'settings.blocking.description': 'Blockieren von Zählpixeln aktivieren',
		'settings.save': 'Speichern',
		'settings.cancel': 'Abbrechen',
		'settings.blocking.cleanup': 'Flash- und Silverlight-Cookies beim Verlassen löschen',
		'settings.whitelist.desc':'Sie können eine Whitelist mit Websites erstellen, auf denen Ghostery nicht nach Trackern sucht und keine Inhalte blockiert. Geben Sie die URL der Site ein und klicken Sie auf "Hinzufügen", um die Site zur Whitelist hinzuzufügen.',
		'settings.whitelist.add':'Hinzufügen',
		'settings.whitelist.remove':'Entfernen',
		'settings.whitelist.removeAll':'Alle entfernen',
		'settings.walkthrough.link': 'Um die wichtigsten Optionen von Ghostery kennenzulernen, verwenden Sie den <a href="chrome://ghostery/content/wizard.html">Ghostery Konfigurationsassistenten</a>.',
		'settings.warning.yahoo': 'Offenbar nutzen Sie auch das Add-on Yahoo! Toolbar. Dieses Add-on verursacht nachweislich Konflikte mit Ghostery und kann die Funktionstüchtigkeit von Ghostery beeinträchtigen. Deaktivieren oder entfernen Sie die Yahoo! Toolbar, bevor Sie Ghostery mit Ihrem Browser nutzen, um optimale Ergebnisse zu erzielen.',
		'settings.warning.beeftaco': "It looks like you're also using the <strong>Beef Taco</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.<br/><br/>",
		'settings.warning.googleoptout': "It looks like you're also using the <strong>Google Opt-Out</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.",
		'settings.autoupdate.noupdate': 'Auto-updates are highly recommended.',
		'settings.autoupdate.noupdate': 'Keine Aktualisierungen der Zählpixelliste gefunden.',
		'settings.autoupdate.updatenow': 'Jetzt aktualisieren',
		'settings.autoupdate.lastupdate': 'Zählpixelliste zuletzt aktualisiert am',
		/* Blocking (all or no or 123 of 321) bugs */
		'settings.blocking.label':'Blockiert',
		'settings.bugs.label':'zählpixel',
		'settings.bugs.category.label':'Zählpixel',
		'settings.elements':'elements',
		'settings.of.label':'von',
		'settings.all.label':'alle',
		'settings.no.label':'keine',
		/* (check to block, click for more info) or (click for more info) */
		'settings.check2block':'für Blockade prüfen, ',
		'settings.click4moreinfo':'für weitere Informationen klicken',
		'settings.affiltable.header':'Companies may belong to trade groups that work to standardize practices and procedures. Click below for more information.',
		'settings.anon.tail': 'by sending anonymous statistical data back to Ghostery HQ.',
		'settings.more.info': 'expand for more info',
		'settings.saving': 'Saving...',
		'settings.noresults': 'No Results',

		'settings.filter.show': 'Anzeigen',
		'settings.filter.with': 'mit',
		'settings.filter.affiliation': 'Zuordnung',
		'settings.filter.show.all': 'alle',
		'settings.filter.show.blocked': 'blockierte',
		'settings.filter.show.unblocked': 'nicht blockierte',
		'settings.filter.label':'Filtern nach',
		'settings.whitelist.donotperform':'Auf diesen Websites keine Inhalte blockieren:',
		'settings.cookie.label': 'Cookies',
		'settings.cookies.label': 'Cookies',
		'settings.cookie_protect': 'Cookie-Schutz aktivieren',
		'label.bugs': 'Zählpixel',
		'label.cookies': 'Cookies',

		'settings.bugs.note': 'When you block a 3pe, that element is prevented from communicating with its third-party provider.',
		'settings.cookies.note': 'When you block a cookie, selected third-party providers are unable to write cookies to your browser.',

		'settings.click2play_desc': 'Replace certain blocked content with an option to allow it. (This helps with certain video players, comment forms, social buttons, etc.)',

		/* performance options */
		'settings.tab.performance': 'Leistungsoptionen',
		'settings.blockImage': 'Bilder, die vom Server der übereinstimmenden Tracker-Domain stammen, überprüfen und blockieren',
		'settings.blockFrame': 'iframes, die vom Server der übereinstimmenden Tracker-Domain stammen, überprüfen und blockieren',
		'settings.blockObject': 'Einbettungs- und Objekttags, die vom Server der übereinstimmenden Tracker-Domain stammen, überprüfen und blockieren',
		'settings.preventRedirect':'Nach Umleitung von bekannten Trackern suchen und diese verhindern',

		/* update options */
		'settings.updateBlockBehaviour': 'Block new elements by default',
		'settings.updateNotification': 'Notify me of new elements',

		/* walkthrough items */
		'walkthrough.desc.communicate': 'These options configure how often, if ever, you communicate with Ghostery HQ.',
		'walkthrough.desc.ghostrank.head':'Unterstützen Sie Ghostery!',
		'label.experimental':'[experimental]',
		'walkthrough.cookie.addon.warning': '<span><em><strong>Warning!</strong></em> When combined with other cookie monitoring addons such as <strong>Beef Taco</strong>, <strong>Cookie Monster</strong>, and <strong>Google Opt-Out</strong>, this feature can cause <b>unresponsive script</b> errors. If you experience this error, please try disabling this feature or conflicting addons.</span>',

		'walkthrough.button.skip-wizard':'Assistenten überspringen',
		'walkthrough.button.get-started':'Beginnen',
		'walkthrough.button.next':'Weiter',
		'walkthrough.label.intro':'Intro',
		'walkthrough.label.ghostrank':'Sharing',
		'walkthrough.label.notification':'Benachrichtigung',
		'walkthrough.label.autoupdatebuglist':'3pe-Bibliothekaktualisierungen',
		'walkthrough.label.blocking':'Blockiert',
		'walkthrough.label.back-cover':'Rückseite',
		'walkthrough.desc.intro.1':'Willkommen bei Ghostery',
		'walkthrough.desc.intro.2':'Ghostery sucht auf den Webseiten, die Sie besuchen, nach Seitenelementen von Dritten (auch "trackers" genannt). Hierbei kann es sich um Plug-ins von sozialen Netzwerken, Werbung, unsichtbare Pixel zur Nachverfolgung und Analyse usw. handeln. Ghostery benachrichtigt Sie über solche Elemente und die Unternehmen, von denen sie stammen. Sie können mehr über diese Unternehmen erfahren und optional deren trackers blockieren. <br><br>Bei dieser kurzen Tour werden einige Optionen von Ghostery vorgestellt und Sie haben die Gelegenheit, alle Einstellungen direkt vorzunehmen. Sie können Ihre Einstellungen jederzeit ändern (und weitere Optionen anzeigen), indem Sie das Optionsmenü von Ghostery aufrufen. Wenn Sie Fragen zu diesem Vorgang haben, schreiben Sie uns unter <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a>.',
		'walkthrough.desc.ghostrank.1':'Wenn Sie GhostRank aktivieren, können Sie anonym an einem Panel zur Datenerfassung teilnehmen, das die Leistung von Ghostery verbessern und die Anzahl von Anzeigen, Tracking-Beacons und anderen Seiten-Skripten im Internet erfassen soll. Die erfassten Daten werden nur gesammelt verwendet, enthalten keine Informationen zur persönlichen Identität und werden niemals für individuelle Werbung verwendet.',
		'walkthrough.desc.ghostrank.2':'Wenn Sie auf ein Seitenelement eines Dritten stoßen (und GhostRank aktiviert ist), sendet Ghostery einen Datensatz mit Folgendem:',
		'walkthrough.desc.ghostrank.3':'<li>Von Ghostery gefundene(s) Seitenelement(e)</li><li>Von Ghostery blockierte(s) Element(e)</li><li>Wie oft das Element gefunden wurde</li><li>Domains, die als Server identifiziert wurden</li><li>Werbung, die in bestimmten Domains bereitgestellt wird, einschließlich der Unternehmen, die jede Anzeige schalten</li><li>Informationen zur Art der Benachrichtigung für jede Anzeige</li><li>Der Browser, in dem Ghostery installiert wurde</li><li>Versionsinformationen zu Ghostery</li>',
		'walkthrough.desc.ghostrank.4':'GhostRank ist eine Opt-In-Funktion. Sie können sich jetzt oder jederzeit zu einem späteren Zeitpunkt über das Optionsmenü von Ghostery für das Opt-In für GhostRank entscheiden.',
		'walkthrough.checkbox.ghostrank':'Klicken Sie hier, um GhostRank zu aktivieren',
		'walkthrough.desc.notification.1':'Wenn Ghostery trackers auf einer Seite, die Sie gerade besuchen, erkennt, zeigt es die Unternehmen, von denen diese Elemente stammen, in einem violetten Kästchen in der oberen rechten Bildschirmecke an. Wenn Sie Ghostery lieber im Hintergrund laufen lassen möchten, können Sie das Kästchen unten abwählen. Im Optionsmenü von Ghostery finden Sie weitere Möglichkeiten, das violette Kästchen an Ihre Anforderungen anzupassen.',
		'walkthrough.checkbox.notification':'Klicken Sie hier, um die Warnmeldung zu aktivieren',
		'walkthrough.desc.autoupdatebuglist.1':'Ghostery erweitert und überarbeitet regelmäßig unsere Liste mit Unternehmen, die Tracker, Werbeserver, Analytics-Services, Seitenwidgets und andere trackers betreiben. Sie können diese Liste im Optionsmenü von Ghostery manuell aktualisieren oder Sie können den automatischen Aktualisierungsservice von Ghostery aktivieren, der regelmäßig Überprüfungen auf Neuzugänge zur Bibliothek von Ghostery durchführt und diese automatisch zur Liste hinzufügt.',
		'walkthrough.checkbox.autoupdatebuglist':'Klicken Sie hier, um die automatische Aktualisierung der Bibliothek zu aktivieren',
		'walkthrough.desc.blocking.1':'Ghostery kann verhindern, dass die gefundenen Seitenelemente in Ihrem Browser ausgeführt werden. Blockierte trackers werden im Hinweis durchgestrichen angezeigt. Wenn trackers blockiert werden, werden sie nicht in Ihrem Browser ausgeführt, wodurch Sie besser kontrollieren können, wie Ihre interessenbasierten Daten nachverfolgt werden. Bedenken Sie, dass einige trackers auch nützlich sein können, z. B. Feed-Widgets für soziale Netzwerke oder browserbasierte Spiele ... Blockieren kann also auch unbeabsichtigte Auswirkungen auf die Sites, die Sie besuchen, haben.',
		'walkthrough.desc.blocking.2':'Ghostery kann auch verhindern, dass Domains in unserer Bibliothek Browser-Cookies erstellen. Wenn Sie den Cookie-Schutz aktiviert haben, werden diese Domains im Blockierprotokoll aufgelistet.',
		'walkthrough.checkbox.blocking.1':'Klicken Sie hier, um Blockieren zu aktivieren',
		'walkthrough.checkbox.blocking.2':'Klicken Sie hier, um den Cookie-Schutz zu aktivieren',
		'walkthrough.helper.blocking.1':'(und alle bekannten Tracker zu blockieren)',
		'walkthrough.desc.back-cover.1':'Sie sind fertig – Sie können Ghostery nun nutzen.',
		'walkthrough.desc.back-cover.2':'Um die neuesten Informationen zu Ghostery und zum Datenschutz für Internetznutzer zu erfahren, lesen Sie unseren <a href="http://news.ghostery.com/" target="_blank">Blog</a>, <a href="http://twitter.com/ghostery" target="_blank">folgen Sie uns</a> auf Twitter oder besuchen Sie unsere <a href="http://www.facebook.com/ghostery/" target="_blank">Facebook-Seite</a>.',
		'walkthrough.desc.back-cover.3':'Support erhalten Sie per E-Mail unter <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a> oder besuchen Sie <a href="http://www.ghostery.com/feedback" target="_blank">unsere Foren</a>.',
		'walkthrough.desc.back-cover.4':'Vielen Dank, dass Sie Ghostery nutzen!',
		'walkthrough.skip.prompt':'This will skip the configuration wizard. You can access it again from the Ghostery menu, or manage your options directly by selecting "Manage Ghostery Options". Skip Wizard?',
	
		/* popup tooltips */
		'tooltip.pause': 'Enable / Disable Blocking',
		'tooltip.options': 'Options',
		'tooltip.feedback': 'Give us feedback',
		'tooltip.help': 'Help',
		'tooltip.share': 'Share Ghostery',

		/* new panel toggle */
		'settings.panel.new.info': 'Not ready for the new panel? Revert to the old menu temporarily (restart required)'
	},

	'es': {
		'settings.title': 'Ghostery Options',

		'general-tab': 'General',
		'advanced-tab': 'Advanced',

		'settings.promo.desc': 'Like Ghostery?',
		'settings.promo.rate': '<a target="new" id="ratelink" href="https://addons.mozilla.org/en-US/firefox/addon/ghostery/">Rate It!</a>',
		'settings.promo.survey': 'Also, <a target="new" href="http://www.surveymonkey.com/s/ghostghost">Take our Survey!</a>',

		'settings.inthe':'in the',
		'settings.corner.label':'corner',
		'settings.filter.show.any':'any',
		'settings.filter.show.no':'no',
		'settings.filter.show.some':'some',
		'settings.filter.show.new':'new since last update',

		'settings.showalert':'"Mostrar recuadro de alerta',
		'settings.showalert.extra':'(while browsing)',
		'settings.expandsources':'Show tracker sources by default',
		'settings.expandsources.extra':'(in the browser popup)',
		'block_log': 'Log de Bloqueo',
		'close.label': 'Cerrar',
		'clear.label': 'Limpiar',
		'settings.tab.sharing_options': 'Sharing Options',
		'settings.tab.update_options': 'Auto Update',
		'settings.tab.update_options.desc': 'Ghostery routinely updates its tracker library of beacons, advertisements, analytics services, page widgets, and other third-party page elements.',
		'settings.tab.blocking.note': 'Note: Blocking elements and/or cookies may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc. - pause blocking by clicking on the Ghostery icon or whitelist the affected site (below).',
		'settings.careful': 'Apoye a Ghostery! POR FAVOR LEA ESTO CUIDADOSAMENTE.',
		'settings.desc': "GhostRank envía información estadística anónima acerca de los anuncios, seguidores, y otros comandos que Ghostery encuentra y las páginas donde se descubrieron. No utiliza cookies de navegador o cookies de flash y no almacena ninguna información única o personal acerca del usuario (ni siquiera una dirección de IP).",
		'settings.desc2': "Ghostery utiliza esta información para crear datos agregados acerca de la proliferación de estos comandos y comparte esta información con la comunidad de Ghostery, las empresas interesadas en medir sus propias actividades y el cumplimiento de las normas de privacidad a través de la web, y organizaciones dedicadas a mantener a estas compañías responsables por sus acciones. Los datos obtenidos por GhostRank no son usados para mostrar ningún anuncio publicitario y nunca son compartidos con este fin. Para más detalles sobre exactamente que información recoge GhostRank, por favor visite nuestro enlace <a target='_blank' href='http://www.ghostery.com/faq'>FAQ</a>.",
		'settings.desc3': "Al participar en GhostRank, usted acepta formar parte de este grupo anónimo ayudando a Ghostery mientras navega por la web.",
		'settings.bugrank': "Activar GhostRank",
		'settings.tab.options':'Opciones',
		'settings.autoupdate':'Activar actualización automática de la lista de elementos',
		'settings.bugcount':'Show Ghostery in Add-on Bar',
		'settings.navbar':'Show Ghostery button in Navigation Bar',
		'settings.bugcount.inbrowsing':'(while browsing)',
		'settings.dismiss':'Ignorar recuadro de alerta tras',
		'settings.dismiss.seconds':'seconds',
		'settings.label.bubble_location': 'Posicion del recuadro',
		'settings.label.bubble_location.top-left': 'Arriba-izquierda',
		'settings.label.bubble_location.top-right': 'Arriba-derecha',
		'settings.label.bubble_location.bottom-left': 'Abajo-izquierda',
		'settings.label.bubble_location.bottom-right': 'Abajo-derecha',
		'settings.tab.blocking': 'Opciones de bloqueo',
		'settings.blocking.description': 'Habilitar el bloqueo de la web de error',
		'settings.save': 'Save',
		'settings.cancel': 'Cancel',
		'settings.blocking.cleanup': 'Borrar galletas de Flash y Silverlight al salir',
		'settings.whitelist.desc':'Usted puede especificar una lista blanca de sitios donde Ghostery no realizará la detección y bloqueo de rastreadores. Introduzca la URL del sitio y haga click en Añadir para añadir a la lista blanca.',
		'settings.whitelist.add':'Añadir',
		'settings.whitelist.remove':'Eliminar',
		'settings.whitelist.removeAll':'Eliminar Todos',
		'settings.walkthrough.link': 'For a walkthrough of Ghostery\'s key options, try the <a href="chrome://ghostery/content/wizard.html">Ghostery Configuration Wizard</a>.',
		'settings.warning.yahoo': 'It looks like you\'re also using the Yahoo! Toolbar Addon. This extension has been known to conflict with Ghostery, and may cause Ghostery not to operate properly. For best results, please disable or remove the Yahoo! Toolbar before browsing with Ghostery.',
		'settings.warning.beeftaco': "It looks like you're also using the <strong>Beef Taco</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.<br/><br/>",
		'settings.warning.googleoptout': "It looks like you're also using the <strong>Google Opt-Out</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.",
		'settings.autoupdate.noupdate': 'Auto-updates are highly recommended.',
		'settings.autoupdate.noupdate': 'No library updates detected.',
		'settings.autoupdate.updatenow': 'Update now',
		'settings.autoupdate.lastupdate': 'Bug list last updated on',
		/* Blocking (all or no or 123 of 321) bugs */
		'settings.blocking.label':'Blocking',
		'settings.bugs.label':'trackers',
		'settings.bugs.category.label':'elements',
		'settings.elements':'elements',
		'settings.of.label':'of',
		'settings.all.label':'all',
		'settings.no.label':'no',
		/* (check to block, click for more info) or (click for more info) */
		'settings.check2block':'check to block, ',
		'settings.click4moreinfo':'click for more info',
		'settings.affiltable.header':'Companies may belong to trade groups that work to standardize practices and procedures. Click below for more information.',
		'settings.anon.tail': 'by sending anonymous statistical data back to Ghostery HQ.',
		'settings.more.info': 'expand for more info',
		'settings.saving': 'Saving...',
		'settings.noresults': 'No Results',

		'settings.filter.show': 'Show',
		'settings.filter.with': 'with',
		'settings.filter.affiliation': 'affiliation',
		'settings.filter.show.all': 'all',
		'settings.filter.show.blocked': 'blocked',
		'settings.filter.show.unblocked': 'unblocked',
		'settings.filter.label':'Filtro:',
		'settings.whitelist.donotperform':'Do not perform blocking on these sites:',
		'settings.cookie.label': 'cookies',
		'settings.cookies.label': 'cookies',
		'settings.cookie_protect': 'Enable cookie protection',
		'label.bugs': 'Trackers',
		'label.cookies': 'Cookies',

		'settings.bugs.note': 'When you block a 3pe, that element is prevented from communicating with its third-party provider.',
		'settings.cookies.note': 'When you block a cookie, selected third-party providers are unable to write cookies to your browser.',

		'settings.click2play_desc': 'Replace certain blocked content with an option to allow it. (This helps with certain video players, comment forms, social buttons, etc.)',

		/* performance options */
		'settings.tab.performance': 'Performance Options',
		'settings.blockImage': 'Scan and block images',
		'settings.blockFrame': 'Scan and block iframes',
		'settings.blockObject': 'Scan and block embed and object tags',
		'settings.preventRedirect':'Look for and prevent redirection',

		/* update options */
		'settings.updateBlockBehaviour': 'Block new elements by default',
		'settings.updateNotification': 'Notify me of new elements',

		/* walkthrough items */
		'walkthrough.desc.communicate': 'These options configure how often, if ever, you communicate with Ghostery HQ.',
		'walkthrough.desc.ghostrank.head':'Help Support Ghostery!',
		'label.experimental':'[experimental]',
		'walkthrough.cookie.addon.warning': '<span><em><strong>Warning!</strong></em> When combined with other cookie monitoring addons such as <strong>Beef Taco</strong>, <strong>Cookie Monster</strong>, and <strong>Google Opt-Out</strong>, this feature can cause <b>unresponsive script</b> errors. If you experience this error, please try disabling this feature or conflicting addons.</span>',

		'walkthrough.button.skip-wizard':'Skip Wizard',
		'walkthrough.button.get-started':'Get Started',
		'walkthrough.button.next':'Next',
		'walkthrough.label.intro':'Intro',
		'walkthrough.label.ghostrank':'Sharing',
		'walkthrough.label.notification':'Notification',
		'walkthrough.label.autoupdatebuglist':'3pe Library Updates',
		'walkthrough.label.blocking':'Blocking',
		'walkthrough.label.back-cover':'Back Cover',
		'walkthrough.desc.intro.1':'Welcome to Ghostery',
		'walkthrough.desc.intro.2':'This quick walkthrough will highlight some of Ghostery\'s options and give you a chance to set things up straight-away.  If you have any questions during the process, drop us a line at <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a>.',
		'walkthrough.desc.ghostrank.1':'Enabling GhostRank will allow you to anonymously participate in an information-gathering panel designed to improve Ghostery performance and create a census of advertisements, tracking beacons, and other page scripts across the web.  The data collected is used only in aggregate, contains no personally identifiable information, and will never be used to target advertising.',
		'walkthrough.desc.ghostrank.2':'When you encounter a third-party page element (and have GhostRank enabled), Ghostery sends a record that includes the following:',
		'walkthrough.desc.ghostrank.3':'<li>Page element(s) identified by Ghostery</li><li>Element(s) blocked by Ghostery</li><li>Number of times the element has been identified</li><li>Domains identified as serving elements</li><li>Advertisements served at particular domains, including companies associated with each ad</li><li>Information about the type of notice associated with each ad</li><li>The browser in which Ghostery has been installed</li><li>Ghostery version information</li>',
		'walkthrough.desc.ghostrank.4':'GhostRank is an opt-in feature.  You can opt-in to GhostRank now, or any time in the future via the Ghostery options menu.',
		'walkthrough.checkbox.ghostrank':'Click here to enable GhostRank',
		'walkthrough.desc.notification.1':'When Ghostery detects trackers on a page you\'re visiting, it displays the companies that operate those elements in a purple box at the top right corner of the screen. If you\'d rather Ghostery work in the background, you can uncheck the box below. There are more ways to customize the purple box in the Ghostery options menu.',
		'walkthrough.checkbox.notification':'Click here to enable Alert Bubble',
		'walkthrough.desc.autoupdatebuglist.1':'Ghostery routinely adds to and refines our list of companies that operate trackers, ad servers, analytics services, page widgets, and other trackers. You can update this list manually from the Ghostery options menu, or you can enable Ghostery\'s auto-update service, which periodically checks for new additions to Ghostery\'s library and includes them automatically.',
		'walkthrough.checkbox.autoupdatebuglist':'Click here to enable library Auto-Update',
		'walkthrough.desc.blocking.1':'Ghostery can prevent the page elements it detects from running in your browser. Trackers that are blocked will appear crossed out in the notification bubble. Blocking trackers will prevent them from running in your browser, which can help control how your behavioral data is tracked.',
		'walkthrough.desc.blocking.2':'Note: Blocking elements and/or cookies may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc. - pause blocking by clicking on the Ghostery icon or whitelist the affected site in the Ghostery options menu.',
		'walkthrough.checkbox.blocking.1':'Click here to enable Blocking',
		'walkthrough.checkbox.blocking.2':'Click here to enable Cookie Protection',
		'walkthrough.helper.blocking.1':'(and block all known trackers)',
		'walkthrough.desc.back-cover.1':'You\'re all done - Ghostery is ready to use.',
		'walkthrough.desc.back-cover.2':'To learn the latest about Ghostery and user privacy across the web, check out our <a href="http://news.ghostery.com/" target="_blank">blog</a>, <a href="http://twitter.com/ghostery" target="_blank">follow us</a> on Twitter, or visit our <a href="http://www.facebook.com/ghostery/" target="_blank">Facebook page</a>.',
		'walkthrough.desc.back-cover.3':'For support, email <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a> or visit <a href="http://www.ghostery.com/feedback" target="_blank">our forums</a>.',
		'walkthrough.desc.back-cover.4':'Thanks for using Ghostery!',
		'walkthrough.skip.prompt':'This will skip the configuration wizard. You can access it again from the Ghostery menu, or manage your options directly by selecting "Manage Ghostery Options". Skip Wizard?',
	
		/* popup tooltips */
		'tooltip.pause': 'Activar / Desactivar Bloqueo',
		'tooltip.options': 'Opciones',
		'tooltip.feedback': 'Dénos su opinión',
		'tooltip.help': 'Ayuda',
		'tooltip.share': 'Comparta Ghostery',

		/* new panel toggle */
		'settings.panel.new.info': 'Not ready for the new panel? Revert to the old menu temporarily (restart required)'
	},

	'fr': {
		'settings.title': 'Ghostery Options',

		'general-tab': 'General',
		'advanced-tab': 'Advanced',

		'settings.promo.desc': 'Like Ghostery?',
		'settings.promo.rate': '<a target="new" id="ratelink" href="https://addons.mozilla.org/en-US/firefox/addon/ghostery/">Rate It!</a>',
		'settings.promo.survey': 'Also, <a target="new" href="http://www.surveymonkey.com/s/ghostghost">Take our Survey!</a>',

		'settings.inthe':'in the',
		'settings.corner.label':'corner',
		'settings.filter.show.any':'any',
		'settings.filter.show.no':'no',
		'settings.filter.show.some':'some',
		'settings.filter.show.new':'new since last update',

		'settings.showalert':'Afficher les bulles d\'alerte',
		'settings.showalert.extra':'(lors de la navigation)',
		'settings.expandsources':'Show tracker sources by default',
		'settings.expandsources.extra':'(in the browser popup)',
		'settings.autoupdate':'Activer la mise à jour automatique de la liste des mouchards',
		'block_log': 'Bloquer la connexion',
		'close.label': 'Fermer',
		'clear.label': 'Effacer',
		'settings.tab.sharing_options': 'Options de partage',
		'settings.tab.update_options': 'Auto Update',
		'settings.tab.update_options.desc': 'Ghostery routinely updates its tracker library of beacons, advertisements, analytics services, page widgets, and other third-party page elements.',
		'settings.tab.blocking.note': 'Note: Blocking elements and/or cookies may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc. - pause blocking by clicking on the Ghostery icon or whitelist the affected site (below).',
		'settings.careful': 'Contribuez à soutenir Ghostery ! VEUILLEZ LIRE CE QUI SUIT ATTENTIVEMENT.',
		'settings.desc': "GhostRank envoie des informations statistiques anonymes sur les traqueurs, les publicités et les autres scripts que Ghostery rencontre ainsi que les pages sur lesquelles ils se trouvent. Il n'utilise pas les cookies de votre navigateur ni les cookies Flash et ne conserve aucune information unique au sujet de l'utilisateur (même pas l'adresse IP).",
		'settings.desc2': "Ghostery utilise ces informations pour créer des données de panel sur la prolifération de ces scripts et il partage ces données avec la communauté Ghostery, les entreprises intéressées à mesurer leur propre activité et évaluer la conformité avec les normes en matière de confidentialité sur le Web, ainsi que les organisations chargées de responsabiliser ces entreprises. Les données de GhostRank ne sont pas utilisées pour cibler une campagne promotionnelle et ne sont jamais communiquées à cette fin. Pour obtenir plus de détails pour savoir ce que GhostRank collecte exactement, veuillez consulter notre <a target='_blank' href='http://www.ghostery.com/faq'>FAQ</a>.",
		'settings.desc3':"En participant à GhostRank, vous acceptez de faire partie de ce panel anonyme et vous contribuez à soutenir Ghostery pendant votre navigation sur le Web.",
		'settings.bugrank': "Activer GhostRank",
		'settings.tab.options':'Options générales',
		'settings.bugcount':'Afficher Ghostery dans la barre des modules',
		'settings.navbar':'Afficher le bouton Ghostery dans la barre de navigation',
		'settings.bugcount.inbrowsing':'(lors de la navigation)',
		'settings.dismiss':'Fermer la bulle d\'alerte après',
		'settings.dismiss.seconds':'secondes',
		'settings.label.bubble_location': 'Emplacement de la bulle',
		'settings.label.bubble_location.top-left': 'en haut à gauche',
		'settings.label.bubble_location.top-right': 'en haut à droite',
		'settings.label.bubble_location.bottom-left': 'en bas à gauche',
		'settings.label.bubble_location.bottom-right': 'en bas à droite',
		'settings.tab.blocking': 'Options de blocage',
		'settings.blocking.description': 'Activer le blocage des mouchards',
		'settings.save': 'Enregistrer',
		'settings.cancel': 'Annuler',
		'settings.blocking.cleanup': 'Supprimer les cookies Flash et les cookies Silverlight à la fermeture',
		'settings.whitelist.desc':'Vous pouvez définir une liste blanche des sites sur lesquels Ghostery n\'exécutera pas la détection ni le blocage des traqueurs. Saisissez l\'adresse URL du site puis cliquez sur Ajouter pour l\'ajouter à la liste blanche.',
		'settings.whitelist.add':'Ajouter',
		'settings.whitelist.remove':'Supprimer',
		'settings.whitelist.removeAll':'Tout supprimer',
		'settings.walkthrough.link': 'Pour obtenir un aperçu des principales options de Ghostery, essayez l\'<a href="chrome://ghostery/content/wizard.html">assistant de configuration Ghostery</a>.',
		'settings.warning.yahoo': 'Il semble que vous\' utilisez également l\'utilitaire de la Barre d\'outils Yahoo. Cette extension est connue pour générer un conflit avec Ghostery et peut faire en sorte que Ghostery ne fonctionne pas correctement. Pour de meilleurs résultats, veuillez désactiver ou supprimer la Barre d\'outils Yahoo avant de surfer avec Ghostery.',
		'settings.warning.beeftaco': "It looks like you're also using the <strong>Beef Taco</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.<br/><br/>",
		'settings.warning.googleoptout': "It looks like you're also using the <strong>Google Opt-Out</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.",
		'settings.autoupdate.noupdate': 'Auto-updates are highly recommended.',
		'settings.autoupdate.noupdate': 'Aucune mise à jour de la liste des mouchards n\'a été détectée.',
		'settings.autoupdate.updatenow': 'Mettre à jour maintenant',
		'settings.autoupdate.lastupdate': 'La liste des mouchards a été mise à jour le',
		/* Blocking (all or no or 123 of 321) bugs */
		'settings.blocking.label':'Blocage',
		'settings.bugs.label':'mouchards',
		'settings.bugs.category.label':'mouchards',
		'settings.elements':'elements',
		'settings.of.label':'de',
		'settings.all.label':'tous les',
		'settings.no.label':'pas de',
		/* (check to block, click for more info) or (click for more info) */
		'settings.check2block':'cocher cette case pour bloquer, ',
		'settings.click4moreinfo':'cliquer ici pour plus d\'informations',
		'settings.affiltable.header':'Companies may belong to trade groups that work to standardize practices and procedures. Click below for more information.',
		'settings.anon.tail': 'by sending anonymous statistical data back to Ghostery HQ.',
		'settings.more.info': 'expand for more info',
		'settings.saving': 'Saving...',
		'settings.noresults': 'No Results',

		'settings.filter.show': 'Afficher',
		'settings.filter.with': 'avec',
		'settings.filter.affiliation': 'affiliation',
		'settings.filter.show.all': 'tout',
		'settings.filter.show.blocked': 'bloqué',
		'settings.filter.show.unblocked': 'autorisé',
		'settings.filter.label':'Filtrer par',
		'settings.whitelist.donotperform':'Ne pas effecteur de blocage sur ces sites :',
		'settings.cookie.label': 'cookies',
		'settings.cookies.label': 'cookies',
		'settings.cookie_protect': 'Activer la protection contre les cookies',
		'label.bugs': 'Mouchards',
		'label.cookies': 'Cookies',

		'settings.bugs.note': 'When you block a 3pe, that element is prevented from communicating with its third-party provider.',
		'settings.cookies.note': 'When you block a cookie, selected third-party providers are unable to write cookies to your browser.',

		'settings.click2play_desc': 'Replace certain blocked content with an option to allow it. (This helps with certain video players, comment forms, social buttons, etc.)',

		/* performance options */
		'settings.tab.performance': 'Options de performance',
		'settings.blockImage': 'Analyser et bloquer les images envoyé depuis le domaine du traqueur correspondant',
		'settings.blockFrame': 'Analyser et bloquer les iframes envoyé depuis le domaine du traqueur correspondant',
		'settings.blockObject': 'Analyser et bloquer les balises embed et objets qui servent le nom de domaine du traqueur correspondant',
		'settings.preventRedirect':'Rechercher et empêcher la redirection depuis les traqueurs connus',

		/* update options */
		'settings.updateBlockBehaviour': 'Block new elements by default',
		'settings.updateNotification': 'Notify me of new elements',

		/* walkthrough items */
		'walkthrough.desc.communicate': 'These options configure how often, if ever, you communicate with Ghostery HQ.',
		'walkthrough.desc.ghostrank.head':'Contribuez à soutenir Ghostery !',
		'label.experimental':'[experimental]',
		'walkthrough.cookie.addon.warning': '<span><em><strong>Warning!</strong></em> When combined with other cookie monitoring addons such as <strong>Beef Taco</strong>, <strong>Cookie Monster</strong>, and <strong>Google Opt-Out</strong>, this feature can cause <b>unresponsive script</b> errors. If you experience this error, please try disabling this feature or conflicting addons.</span>',

		'walkthrough.button.skip-wizard':'Se passer de l\'assistant',
		'walkthrough.button.get-started':'Démarrer',
		'walkthrough.button.next':'Suivant',
		'walkthrough.label.intro':'Introduction',
		'walkthrough.label.ghostrank':'Sharing',
		'walkthrough.label.notification':'Notification',
		'walkthrough.label.autoupdatebuglist':'Mise à jour des bibliothèques des éléments tiers',
		'walkthrough.label.blocking':'Blocage',
		'walkthrough.label.back-cover':'Dernière page de couverture',
		'walkthrough.desc.intro.1':'Accueil de Ghostery',
		'walkthrough.desc.intro.2':'Ghostery recherche les éléments tiers (que nous appelons "trackers") sur les pages Internet que vous visitez. Ils peuvent être les plugins des réseaux sociaux, des publicités, des pixels invisibles utilisés pour le suivi et les analyses, etc. Ghostery vous informe lorsque ces éléments sont présents et quelles sociétés les gèrent. Vous pouvez en savoir plus sur ces sociétés et, si vous le souhaitez, choisir de bloquer les éléments tiers qu\'elles utilisent. <br><br>Ce rapide aperçu va souligner quelques options de Ghostery et vous donner l\'occasion de définir votre configuration immédiatement. Vous pouvez changer ces décisions (et afficher plus d\'options) en visitant à tout moment le menu des options Ghostery. Si vous avez des questions au cours de cette action, écrivez-nous à l\'adresse <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a>.',
		'walkthrough.desc.ghostrank.1':'Activer GhostRank vous permettra de participer anonymement à un panel de recueil d\'informations destinées à améliorer les performances de Ghostery et créer un recensement des publicités, des balises de suivi et des autres scripts de pages sur le Web. Les données recueillies ne sont utilisées que globalement, ne contiennent aucun renseignement personnellement identifiable et ne seront jamais utilisées pour cibler une campagne promotionnelle.',
		'walkthrough.desc.ghostrank.2':'Lorsque vous rencontrez un élément tiers (et que GhostRank est activé), Ghostery vous envoie un enregistrement comprenant ce qui suit :',
		'walkthrough.desc.ghostrank.3':'<li>Les élément(s) sur les pages identifié(s) par Ghostery</li><li>Les élément(s) bloqué(s) par Ghostery</li><li>Le nombre de fois que l\'élément a été identifié</li><li>Les nom de domaine identifiées en tant qu\'éléments de support</li><li>Les publicités utilisées sur des noms de domaine particuliers, dont les entreprises associées à chaque publicité</li><li>Les informations sur le type de notification associé à chaque publicité</li><li>Le navigateur sur lequel Ghostery est installé</li><li>Informations relatives à la version de Ghostery</li>',
		'walkthrough.desc.ghostrank.4':'GhostRank est une fonctionnalité opt-in. Vous pouvez donner votre accord pour GhostRank maintenant, ou par la suite, dans le menu des options de Ghostery.',
		'walkthrough.checkbox.ghostrank':'Cliquer ici pour activer GhostRank',
		'walkthrough.desc.notification.1':'Quand Ghostery détecte des éléments tiers sur une page que vous\' visitez, il affiche les sociétés qui exploitent ces éléments dans une boîte violette en haut à droite de l\'écran. Si vous\' préférez que Ghostery fonctionne en arrière-plan, vous pouvez décocher la case ci-dessous. Il existe plus d\'options pour personnaliser la boîte violette dans le menu options de Ghostery.',
		'walkthrough.checkbox.notification':'Cliquer ici pour activer la bulle d\'alerte',
		'walkthrough.desc.autoupdatebuglist.1':'Ghostery apporte régulièrement des ajouts et affine notre liste des sociétés qui utilisent des traqueurs, des serveurs publicitaires, des services d\'analyse, des widgets de page et autres éléments tiers. Vous pouvez mettre à jour cette liste manuellement depuis le menu des options Ghostery ou activer le service de mise à jour automatique de Ghostery\', qui vérifie régulièrement les nouveaux ajouts à la bibliothèque de Ghostery\' et les intègre automatiquement.',
		'walkthrough.checkbox.autoupdatebuglist':'Cliquer ici pour activer la Mise à jour automatique de la bibliothèque',
		'walkthrough.desc.blocking.1':'Ghostery peut empêcher les éléments qu\'il détecte de fonctionner dans votre navigateur. Les éléments tiers qui sont bloqués apparaissent barrés dans la bulle de notification. Le blocage des éléments tiers les empêchera de fonctionner dans votre navigateur, ce qui peut aider à contrôler comment vos données comportementales sont suivies. N\'oubliez pas que certains éléments tiers sont potentiellement dangereux, comme les widgets de flux des réseaux sociaux, les jeux par navigateur... le fait de les bloquer peut avoir un effet inattendu sur les sites que vous visitez.',
		'walkthrough.desc.blocking.2':'Ghostery peut, de plus, empêcher les noms de domaine dans votre bibliothèque de créer des cookies de navigateur. Si vous avez activé la protection contre les cookies, ces noms de domaine seront listés dans le blocage de connexion.',
		'walkthrough.checkbox.blocking.1':'Cliquer ici pour activer le Blocage',
		'walkthrough.checkbox.blocking.2':'Cliquer ici pour activer la protection contre les cookies',
		'walkthrough.helper.blocking.1':'(et bloquer tous les traqueurs connus)',
		'walkthrough.desc.back-cover.1':'Vous\' avez terminé, Ghostery est prêt à être utilisé.',
		'walkthrough.desc.back-cover.2':'Pour prendre connaissance des nouveautés à propos de Ghostery et du respect de la vie privée des utilisateurs sur le Web, consultez notre <a href="http://news.ghostery.com/" target="_blank">blog</a>, <a href="http://twitter.com/ghostery" target="_blank">suivez-nous</a> sur Twitter ou rendez-vous sur notre <a href="http://www.facebook.com/ghostery/" target="_blank">page Facebook</a>.',
		'walkthrough.desc.back-cover.3':'Pour obtenir de l\'aide, envoyer un message électronique à <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a> ou visitez <a href="http://www.ghostery.com/feedback" target="_blank">nos forums</a>.',
		'walkthrough.desc.back-cover.4':'Merci d\'utiliser Ghostery !',
		'walkthrough.skip.prompt':'This will skip the configuration wizard. You can access it again from the Ghostery menu, or manage your options directly by selecting "Manage Ghostery Options". Skip Wizard?',
	
		/* popup tooltips */
		'tooltip.pause': 'Enable / Disable Blocking',
		'tooltip.options': 'Options',
		'tooltip.feedback': 'Give us feedback',
		'tooltip.help': 'Help',
		'tooltip.share': 'Share Ghostery',

		/* new panel toggle */
		'settings.panel.new.info': 'Not ready for the new panel? Revert to the old menu temporarily (restart required)'
	},

	'ja': {
		'settings.title': 'Ghostery Options',

		'general-tab': 'General',
		'advanced-tab': 'Advanced',

		'settings.promo.desc': 'Like Ghostery?',
		'settings.promo.rate': '<a target="new" id="ratelink" href="https://addons.mozilla.org/en-US/firefox/addon/ghostery/">Rate It!</a>',
		'settings.promo.survey': 'Also, <a target="new" href="http://www.surveymonkey.com/s/ghostghost">Take our Survey!</a>',

		'settings.inthe':'in the',
		'settings.corner.label':'corner',
		'settings.filter.show.any':'any',
		'settings.filter.show.no':'no',
		'settings.filter.show.some':'some',
		'settings.filter.show.new':'new since last update',

		'settings.showalert':'ポップアップ通知を表示',
		'settings.showalert.extra':'(while browsing)',
		'settings.expandsources':'Show tracker sources by default',
		'settings.expandsources.extra':'(in the browser popup)',
		'block_log': 'ブロック ログ',
		'close.label': '閉じる',
		'clear.label': 'クリア',
		'settings.tab.sharing_options': 'Sharing Options',
		'settings.tab.update_options': 'Auto Update',
		'settings.tab.update_options.desc': 'Ghostery routinely updates its tracker library of beacons, advertisements, analytics services, page widgets, and other third-party page elements.',
		'settings.tab.blocking.note': 'Note: Blocking elements and/or cookies may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc. - pause blocking by clicking on the Ghostery icon or whitelist the affected site (below).',
		'settings.careful': 'Help Support Ghostery! 以下をよく読んでください',
		'settings.desc': "GhostRank sends anonymous statistical information about the trackers, ads, and other scripts that Ghostery encounters and the pages on which they're found. It does not make use of browser cookies or flash cookies and stores no unique information about the user (not even an IP address).",
		'settings.desc2': "Ghostery uses this information to create panel data about the proliferation of these scripts and shares this data with the Ghostery community, companies interested in measuring their own activity and compliance with privacy standards across the web, and organizations dedicated to holding these companies accountable. GhostRank data is not used to target advertising and is never shared for that purpose. For more details on exactly what GhostRank collects, please visit our <a target='_blank' href='http://www.ghostery.com/faq'>FAQ</a>.",
		'settings.desc3':"By participating in GhostRank, you're agreeing to become part of this anonymous panel and you\'re helping to support Ghostery as you browse the web.",
		'settings.bugrank': "GhostRank を有効にする",
		'settings.tab.options':'オプション',
		'settings.autoupdate':'バグ リストの自動更新',
		'settings.bugcount':'Show Ghostery in Add-on Bar',
		'settings.navbar':'Show Ghostery button in Navigation Bar',
		'settings.bugcount.inbrowsing':'(while browsing)',
		'settings.dismiss':'"ポップアップ通知表示時間',
		'settings.dismiss.seconds':'seconds',
		'settings.label.bubble_location': 'ポップアップ場所',
		'settings.label.bubble_location.top-left': '左上',
		'settings.label.bubble_location.top-right': '右上',
		'settings.label.bubble_location.bottom-left': '左下',
		'settings.label.bubble_location.bottom-right': '右下',
		'settings.tab.blocking': '"ブロック オプション',
		'settings.blocking.description': 'Web バグ ブロックを有効にする',
		'settings.save': 'Save',
		'settings.cancel': 'Cancel',
		'settings.blocking.cleanup': '終了時に Flash および Silverlight のクッキーを削除',
		'settings.whitelist.desc':'Ghostery がトラッカーを検出およびブロックしないようホワイト リスト サイトを指定することができます。ホワイト リストへ追加するにはサイトの URL を入力して [追加] ボタンをクリックします。',
		'settings.whitelist.add':'追加',
		'settings.whitelist.remove':'削除',
		'settings.whitelist.removeAll':'すべて削除',
		'settings.walkthrough.link': 'For a walkthrough of Ghostery\'s key options, try the <a href="chrome://ghostery/content/wizard.html">Ghostery Configuration Wizard</a>.',
		'settings.warning.yahoo': 'It looks like you\'re also using the Yahoo! Toolbar Addon. This extension has been known to conflict with Ghostery, and may cause Ghostery not to operate properly. For best results, please disable or remove the Yahoo! Toolbar before browsing with Ghostery.',
		'settings.warning.beeftaco': "It looks like you're also using the <strong>Beef Taco</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.<br/><br/>",
		'settings.warning.googleoptout': "It looks like you're also using the <strong>Google Opt-Out</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.",
		'settings.autoupdate.noupdate': 'Auto-updates are highly recommended.',
		'settings.autoupdate.noupdate': 'No bug list updates detected.',
		'settings.autoupdate.updatenow': 'Update now',
		'settings.autoupdate.lastupdate': 'Bug list last updated on',
		/* Blocking (all or no or 123 of 321) bugs */
		'settings.blocking.label':'Blocking',
		'settings.bugs.label':'trackers',
		'settings.bugs.category.label':'elements',
		'settings.elements':'elements',
		'settings.of.label':'of',
		'settings.all.label':'all',
		'settings.no.label':'no',
		/* (check to block, click for more info) or (click for more info) */
		'settings.check2block':'check to block, ',
		'settings.click4moreinfo':'click for more info',
		'settings.affiltable.header':'Companies may belong to trade groups that work to standardize practices and procedures. Click below for more information.',
		'settings.anon.tail': 'by sending anonymous statistical data back to Ghostery HQ.',
		'settings.more.info': 'expand for more info',
		'settings.saving': 'Saving...',
		'settings.noresults': 'No Results',

		'settings.filter.show': 'Show',
		'settings.filter.with': 'with',
		'settings.filter.affiliation': 'affiliation',
		'settings.filter.show.all': 'all',
		'settings.filter.show.blocked': 'blocked',
		'settings.filter.show.unblocked': 'unblocked',
		'settings.filter.label':'フィルター:',
		'settings.whitelist.donotperform':'Do not perform blocking on these sites:',
		'settings.cookie.label': 'cookies',
		'settings.cookies.label': 'cookies',
		'settings.cookie_protect': 'Enable cookie protection',
		'label.bugs': 'Trackers',
		'label.cookies': 'Cookies',

		'settings.bugs.note': 'When you block a 3pe, that element is prevented from communicating with its third-party provider.',
		'settings.cookies.note': 'When you block a cookie, selected third-party providers are unable to write cookies to your browser.',

		'settings.click2play_desc': 'Replace certain blocked content with an option to allow it. (This helps with certain video players, comment forms, social buttons, etc.)',

		/* performance options */
		'settings.tab.performance': 'Performance Options',
		'settings.blockImage': 'Scan and block images',
		'settings.blockFrame': 'Scan and block iframes',
		'settings.blockObject': 'Scan and block embed and object tags',
		'settings.preventRedirect':'Look for and prevent redirection',

		/* update options */
		'settings.updateBlockBehaviour': 'Block new elements by default',
		'settings.updateNotification': 'Notify me of new elements',

		/* walkthrough items */
		'walkthrough.desc.communicate': 'These options configure how often, if ever, you communicate with Ghostery HQ.',
		'walkthrough.desc.ghostrank.head':'Help Support Ghostery!',
		'label.experimental':'[experimental]',
		'walkthrough.cookie.addon.warning': '<span><em><strong>Warning!</strong></em> When combined with other cookie monitoring addons such as <strong>Beef Taco</strong>, <strong>Cookie Monster</strong>, and <strong>Google Opt-Out</strong>, this feature can cause <b>unresponsive script</b> errors. If you experience this error, please try disabling this feature or conflicting addons.</span>',

		'walkthrough.button.skip-wizard':'Skip Wizard',
		'walkthrough.button.get-started':'Get Started',
		'walkthrough.button.next':'Next',
		'walkthrough.label.intro':'Intro',
		'walkthrough.label.ghostrank':'Sharing',
		'walkthrough.label.notification':'Notification',
		'walkthrough.label.autoupdatebuglist':'3pe Library Updates',
		'walkthrough.label.blocking':'Blocking',
		'walkthrough.label.back-cover':'Back Cover',
		'walkthrough.desc.intro.1':'Welcome to Ghostery',
		'walkthrough.desc.intro.2':'This quick walkthrough will highlight some of Ghostery\'s options and give you a chance to set things up straight-away.  If you have any questions during the process, drop us a line at <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a>.',
		'walkthrough.desc.ghostrank.1':'Enabling GhostRank will allow you to anonymously participate in an information-gathering panel designed to improve Ghostery performance and create a census of advertisements, tracking beacons, and other page scripts across the web.  The data collected is used only in aggregate, contains no personally identifiable information, and will never be used to target advertising.',
		'walkthrough.desc.ghostrank.2':'When you encounter a third-party page element (and have GhostRank enabled), Ghostery sends a record that includes the following:',
		'walkthrough.desc.ghostrank.3':'<li>Page element(s) identified by Ghostery</li><li>Element(s) blocked by Ghostery</li><li>Number of times the element has been identified</li><li>Domains identified as serving elements</li><li>Advertisements served at particular domains, including companies associated with each ad</li><li>Information about the type of notice associated with each ad</li><li>The browser in which Ghostery has been installed</li><li>Ghostery version information</li>',
		'walkthrough.desc.ghostrank.4':'GhostRank is an opt-in feature.  You can opt-in to GhostRank now, or any time in the future via the Ghostery options menu.',
		'walkthrough.checkbox.ghostrank':'Click here to enable GhostRank',
		'walkthrough.desc.notification.1':'When Ghostery detects trackers on a page you\'re visiting, it displays the companies that operate those elements in a purple box at the top right corner of the screen. If you\'d rather Ghostery work in the background, you can uncheck the box below. There are more ways to customize the purple box in the Ghostery options menu.',
		'walkthrough.checkbox.notification':'Click here to enable Alert Bubble',
		'walkthrough.desc.autoupdatebuglist.1':'Ghostery routinely adds to and refines our list of companies that operate trackers, ad servers, analytics services, page widgets, and other beacons. You can update this list manually from the Ghostery options menu, or you can enable Ghostery\'s auto-update service, which periodically checks for new additions to Ghostery\'s library and includes them automatically.',
		'walkthrough.checkbox.autoupdatebuglist':'Click here to enable library Auto-Update',
		'walkthrough.desc.blocking.1':'Ghostery can prevent the page elements it detects from running in your browser. Trackers that are blocked will appear crossed out in the notification bubble. Blocking trackers will prevent them from running in your browser, which can help control how your behavioral data is tracked.',
		'walkthrough.desc.blocking.2':'Note: Blocking elements and/or cookies may interfere with webpages in unexpected ways. If you experience issues with videos, logins, comment forms, etc. - pause blocking by clicking on the Ghostery icon or whitelist the affected site in the Ghostery options menu.',
		'walkthrough.checkbox.blocking.1':'Click here to enable Blocking',
		'walkthrough.checkbox.blocking.2':'Click here to enable Cookie Protection',
		'walkthrough.helper.blocking.1':'(and block all known trackers)',
		'walkthrough.desc.back-cover.1':'You\'re all done - Ghostery is ready to use.',
		'walkthrough.desc.back-cover.2':'To learn the latest about Ghostery and user privacy across the web, check out our <a href="http://news.ghostery.com/" target="_blank">blog</a>, <a href="http://twitter.com/ghostery" target="_blank">follow us</a> on Twitter, or visit our <a href="http://www.facebook.com/ghostery/" target="_blank">Facebook page</a>.',
		'walkthrough.desc.back-cover.3':'For support, email <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a> or visit <a href="http://www.ghostery.com/feedback" target="_blank">our forums</a>.',
		'walkthrough.desc.back-cover.4':'Thanks for using Ghostery!',
		'walkthrough.skip.prompt':'This will skip the configuration wizard. You can access it again from the Ghostery menu, or manage your options directly by selecting "Manage Ghostery Options". Skip Wizard?',
	
		/* popup tooltips */
		'tooltip.pause': 'Enable / Disable Blocking',
		'tooltip.options': 'Options',
		'tooltip.feedback': 'Give us feedback',
		'tooltip.help': 'Help',
		'tooltip.share': 'Share Ghostery',

		/* new panel toggle */
		'settings.panel.new.info': 'Not ready for the new panel? Revert to the old menu temporarily (restart required)'
	},

	'ru': {
		'settings.title': 'Настройки Ghostery',

		'general-tab': 'Общие настройки',
		'advanced-tab': 'Расширенные настройки',

		'settings.promo.desc': 'Нравится Ghostery?',
		'settings.promo.rate': '<a target="new" id="ratelink" href="https://addons.mozilla.org/en-US/firefox/addon/ghostery/#reviews">Зацени!</a>',
		'settings.promo.survey': 'Кроме того, <a target="new" href="http://www.surveymonkey.com/s/ghostghost">Примите участие в опросе!</a>',

		'settings.inthe':' ',
		'settings.corner.label':' ',
		'settings.filter.show.any':'any',
		'settings.filter.show.no':'no',
		'settings.filter.show.some':'some',
		'settings.filter.show.new':'новые с последнего обновления',

		'settings.showalert':'Показывать пузырёк-предупреждение',
		'settings.showalert.extra':' ',
		'settings.expandsources':'Show tracker sources by default',
		'settings.expandsources.extra':'(in the browser popup)',
		'block_log': 'Лог Блокировки',
		'close.label': 'Закрыть',
		'clear.label': 'Очистить',
		'settings.tab.sharing_options': 'Настройки Обмена',
		'settings.tab.update_options': 'Автообновление',
		'settings.tab.update_options.desc': 'Ghostery регулярно обновляет свою библиотеку <b>элементов</b> (рекламы, отслеживание пикселей, виджеты и т.п.).',
		'settings.tab.blocking.note': 'Ghostery группирует элементы в категории. Нажмите на категорию, чтобы просмотреть все trackers в этой категории. Нажмите на флажкок, чтобы блокировать, щелкните имя элемента для получения дополнительной информации о нём.',
		'settings.tab.blocking.note2': 'Примечание: Блокирование может влиять на веб-страницы самым неожиданным образом. Если у вас возникли проблемы с видео, логином, формой для комментариев  и т.д., нажмите на временное отклучение блокировки (нажав на значок Ghostery), или добавте страницу в whitelist.',
		'settings.careful': 'Пожалуйста, поддержите Ghostery',
		'settings.desc': "GhostRank отправляет анонимные статистические сведения о трекерах, рекламе, и других скриптов которые Ghostery встречает, а также страницы, на которых они найдены. Никакой уникальной информации о пользователе не отправляется.",
		'settings.desc2': "Ghostery использует эту информацию для создания панельных данных относительно распространения этих скриптов и раздаёт эти данные Ghostery пользователям, компанияам заинтересованным в оценке их собственной деятельности и соблюдения конфиденциальности в Интернете, и организациям, занимающиеся проверкой этих компаний. GhostRank данные никогда не будут использованы для рекламы и никогда не отдаются для этой цели. Для более подробной информации о точно, что GhostRank собирает, пожалуйста, посетите наш <a target='_blank' href='http://www.ghostery.com/faq'>FAQ</a>.",
		'settings.desc3':"Участвуя в GhostRank, вы соглашаетесь стать частью этой анонимной панели и вы помогаете поддерживать Ghostery.",
		'settings.bugrank': "Включить GhostRank",
		'settings.tab.options':'Общие Настройки',
		'settings.autoupdate':'Включить авто обновление',
		'settings.bugcount':'Показывать Ghostery в Add-on Bar',
		'settings.navbar':'Показывать Ghostery в Navigation Bar',
		'settings.bugcount.inbrowsing':'(while browsing)',
		'settings.dismiss':'Убирать предупреждение после',
		'settings.dismiss.seconds':'секунд',
		'settings.label.bubble_location': 'Место пузырька-предупреждения',
		'settings.label.bubble_location.top-left': 'сверху-слева',
		'settings.label.bubble_location.top-right': 'сверху-справа',
		'settings.label.bubble_location.bottom-left': 'снизу-слева',
		'settings.label.bubble_location.bottom-right': 'снизу-справа',
		'settings.tab.blocking': 'Настройки блокировки',
		'settings.blocking.description': 'Включить блокировку веб-жучков',
		'settings.save': 'Сохранить',
		'settings.cancel': 'Отменить',
		'settings.blocking.cleanup': 'Убирать Flash и Silverlight cookies при выходе',
		'settings.whitelist.desc':'Здесь вы можете просмотреть лист веб-сайтов где Ghostery не будет блокировать веб-жучки. Введите URL адрес и щелкните Добавить чтобы ввести новый сайт.',
		'settings.whitelist.add':'Добавить',
		'settings.whitelist.remove':'Удалить',
		'settings.whitelist.removeAll':'Удалить Все',
		'settings.walkthrough.link': 'Для просмотра ключевых опций Ghostery, взляните в <a href="chrome://ghostery/content/wizard.html">Ghostery авто-настройки</a>.',
		'settings.warning.yahoo': 'It looks like you\'re also using the Yahoo! Toolbar Addon. This extension has been known to conflict with Ghostery, and may cause Ghostery not to operate properly. For best results, please disable or remove the Yahoo! Toolbar before browsing with Ghostery.',
		'settings.warning.beeftaco': "It looks like you're also using the <strong>Beef Taco</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.<br/><br/>",
		'settings.warning.googleoptout': "It looks like you're also using the <strong>Google Opt-Out</strong> addon. Unfortunately, cookie protection from Ghostery must be disabled<br/> to avoid browser lock-up. Please disable or remove this addon if you wish to use Ghostery cookie protection.",
		'settings.autoupdate.noupdate': 'Auto-updates are highly recommended.',
		'settings.autoupdate.noupdate': 'Предыдущие обновления веб-жучков не найденно.',
		'settings.autoupdate.updatenow': 'Обновить',
		'settings.autoupdate.lastupdate': 'Дата последнего обновления:',
		/* Блокировка (все или нет или 123 из 321) ошибок */
		'settings.blocking.label':'Блокировка',
		'settings.bugs.label':'веб-жучков',
		'settings.bugs.category.label':'элементов',
		'settings.elements':'элементов',
		'settings.of.label':'из',
		'settings.all.label':'всех',
		'settings.no.label':'не выбрана для',
		/* галочку для блокировки, клик для дополнительной информации */
		'settings.check2block':'галочку для блокировки, ',
		'settings.click4moreinfo':'клик для дополнительной инфы',
		'settings.affiltable.header':'Companies may belong to trade groups that work to standardize practices and procedures. Click below for more information.',
		'settings.anon.tail': 'отправив анонимные статистические данные обратно в Ghostery HQ.',
		'settings.more.info': 'расширить для дополнительной информации',
		'settings.saving': 'Сохраняю...',
		'settings.noresults': 'Результатов нет',

		'reset-search-2': 'Сбросить поиск',
		'expand-all-2': 'Развернуть все',
		'collapse-all-2': 'Свернуть все',
		'select-all-2': 'Выбрать все',
		'select-none-2': 'Убрать все',

		'settings.count.total': ' ',
		'settings.count.blocked': 'блокированно',

		'settings.filter.show': 'Показать',
		'settings.filter.with': 'with',
		'settings.filter.affiliation': 'affiliation',
		'settings.filter.show.all': 'все',
		'settings.filter.show.blocked': 'блокированные',
		'settings.filter.show.unblocked': 'разблокированные',
		'settings.filter.label':'Фильтр:',
		'settings.whitelist.donotperform':'Не выполнять блокировку на этих сайтах:',
		'settings.cookie.label': 'куков',
		'settings.cookies.label': 'куков',
		'settings.cookie_protect': 'Включить защиту куки',
		'label.bugs': 'Веб-жуки',
		'label.cookies': 'Куки',
		'label.sites': 'Whitelist сайтов',

		'settings.bugs.note': 'Когда вы блокируете 3pe, этот элемент не имеет возможности общаться с его сервером.',
		'settings.cookies.note': 'Когда вы блокируете куки, его сервер не сможет записать куки в браузер.',

		'settings.click2play_desc': 'Replace certain blocked content with an option to allow it. (This helps with certain video players, comment forms, social buttons, etc.)',

		/* performance options */
		'settings.tab.performance': 'Настройки Быстродействия',
		'settings.blockImage': 'Сканировать и блокировать изображения',
		'settings.blockFrame': 'Сканировать и блокировать iфреймы',
		'settings.blockObject': 'Сканировать и блокировать embed и object теги',
		'settings.preventRedirect':'Искать и предотвращать перенаправление',

		/* update options */
		'settings.updateBlockBehaviour': 'Блокировать новые элементы по умолчанию',
		'settings.updateNotification': 'Уведомлять меня о новых элементах',

		/* walkthrough items */
		'walkthrough.desc.communicate': 'Эти параметры настроят, как часто (если вообще), вы общаетесь с Ghostery HQ.',
		'walkthrough.desc.ghostrank.head':'Help Support Ghostery!',
		'label.experimental':'[эксперимент]',
		'walkthrough.cookie.addon.warning': '<span><em><strong>Warning!</strong></em> When combined with other cookie monitoring addons such as <strong>Beef Taco</strong>, <strong>Cookie Monster</strong>, and <strong>Google Opt-Out</strong>, this feature can cause <b>unresponsive script</b> errors. If you experience this error, please try disabling this feature or conflicting addons.</span>',

		'walkthrough.button.skip-wizard':'Пропустить Настройки',
		'walkthrough.button.get-started':'Продолжить',
		'walkthrough.button.next':'Дальше',
		'walkthrough.label.intro':'Введение',
		'walkthrough.label.ghostrank':'Обмен',
		'walkthrough.label.notification':'Уведомление',
		'walkthrough.label.autoupdatebuglist':'Авто Обновление',
		'walkthrough.label.blocking':'Блокирование',
		'walkthrough.label.back-cover':'Всё!',
		'walkthrough.desc.intro.1':'Добро пожаловать в первичные настройки Ghostery',
		'walkthrough.desc.intro.2':'Первичные настройки дадут вам шанс взглянуть и установить всё что нужно для мгновенной работы с Ghostery.  Если у вас есть какие-либо вопросы в ходе процесса, пожалуйста напишите нам на <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a>.',
		'walkthrough.desc.ghostrank.1':'Включение GhostRank позволит вам анонимно участвовать в панели, направленной на улучшение производительности Ghostery а также помогает нам в отслеживании новых маяков, рекламы и других элементов веб-сраниц в Интернете. Собранные данные используются только в совокупности, не содержат личную информацию, и никогда не используються для рекламы.',
		'walkthrough.desc.ghostrank.2':'Когда вы сталкиваетесь с веб-жучком (и GhostRank включен), Ghostery отправляет отчет, который включает следующее:',
		'walkthrough.desc.ghostrank.3':'<li>Элементы определенные Ghostery</li><li>Элементы заблокированные Ghostery</li><li>Сколько раз элемент был найден</li><li>Домены-источники найденных элементов</li><li>Реклама и компании связанные с подачей этой рекламы</li><li>Информация о типе уведомления связанных с каждым рекламным объявлением</li><li>Тип браузера, в котором Ghostery установлен</li><li>Версия Ghostery</li>',
		'walkthrough.desc.ghostrank.4':'Вы можете включить GhostRank сейчас, или в любое время в будущем через меню настроек Ghostery.',
		'walkthrough.checkbox.ghostrank':'Щелкните здесь, чтобы включить GhostRank',
		'walkthrough.desc.notification.1':'Когда Ghostery обнаруживает веб-жучки в элементах загруженной страницы которую вы просматриваете, он уведомляет Вас, перечисляя названия найденных компаний в пузыре-предупреждении. По умолчанию, этот пузырь появляется в верхнем правом углу браузера. Здесь Вы можете настроить включен он или нет:',
		'walkthrough.checkbox.notification':'Щелкните здесь, чтобы включить пузырёк-предупреждение',
		'walkthrough.desc.autoupdatebuglist.1':'Ghostery все время дополняет и уточняет список компаний которые используют трекеры, рекламные сервера, веб-аналитику, виджеты, и другие виды маяков. Вы можете обновлять этот список вручную из Ghostery меню, или вы можете включить автоматическое обновление, которое периодически проверяет наличие новых изменений в центральной и локальной библиотеке Ghostery и обновляет их автоматически.',
		'walkthrough.checkbox.autoupdatebuglist':'Щелкните здесь, чтобы включить авто обновление листа веб-жучков',
		'walkthrough.desc.blocking.1':'Ghostery может блокировать загрузку найденных элементов в вашем браузере. Заблокированные элементы будут выглядеть вычеркнутыми из пузыря-предупреждения.',
		'walkthrough.desc.blocking.2':'Примечание: Блокирование может влиять на веб-страницы самым неожиданным образом. Если у вас возникли проблемы с видео, логином, формой для комментариев  и т.д., нажмите на временное отклучение блокировки (нажав на значок Ghostery), или добавте страницу в whitelist.',
		'settings.careful': 'Пожалуйста, поддержите Ghostery',
		'walkthrough.checkbox.blocking.1':'Щелкните здесь, чтобы включить блокировку веб-жучков',
		'walkthrough.checkbox.blocking.2':'Щелкните здесь, чтобы включить защиту куки',
		'walkthrough.helper.blocking.1':'(и блокировать все известные трекеры)',
		'walkthrough.desc.back-cover.1':'Ghostery готова к использованию.',
		'walkthrough.desc.back-cover.2':'Чтобы узнать о последних новостях Ghostery, взгляните на наш <a href="http://news.ghostery.com/" target="_blank">блог</a>, <a href="http://twitter.com/ghostery" target="_blank">Twitter</a>, или посетите нашу страницу на <a href="http://www.facebook.com/ghostery/" target="_blank">Facebook</a>.',
		'walkthrough.desc.back-cover.3':'Для поддержки через электронную почту пишите на <a href="mailto:support@ghostery.com" target="_blank">support@ghostery.com</a> или посетите <a href="http://www.ghostery.com/feedback" target="_blank">наш форум</a>.',
		'walkthrough.desc.back-cover.4':'Спасибо за использование Ghostery!',
		'walkthrough.skip.prompt':'This will skip the configuration wizard. You can access it again from the Ghostery menu, or manage your options directly by selecting "Manage Ghostery Options". Skip Wizard?',
	
		/* popup tooltips */
		'tooltip.pause': 'Enable / Disable Blocking',
		'tooltip.options': 'Options',
		'tooltip.feedback': 'Give us feedback',
		'tooltip.help': 'Help',
		'tooltip.share': 'Share Ghostery',

		/* new panel toggle */
		'settings.panel.new.info': 'Not ready for the new panel? Revert to the old menu temporarily (restart required)'
	},

	setLanguage: function() {
		if (ghostery.translator.lang != '') {
			return;
		}

		var i, l, exists = false;
		try {
			try {
				l = navigator.language;
			} catch(e) {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("general.useragent.");

				l = prefs.getCharPref("locale");
			}

			if ( (l.indexOf('-') > 0) || (l.indexOf('_') > 0) ) {
				l = l.substring(0, 2).toLowerCase();
			}
		} catch (e2) {
			l = 'en';
		}

		for (i in ghostery.translator) {
			if (i.length == 2) {
				if (i == l) {
					exists = true;
					break;
				}
			}
		}

		if (!exists) {
			l = 'en';
		}

		ghostery.translator.lang = l;
	},

	translate: function() {
		ghostery.translator.setLanguage();

		try {
			var strings = document.getElementsByClassName('trans');

			if (strings.length > 0) {
				for (var i = 0; i < strings.length; i++) {
					var el = strings[i];

					var translation = ghostery.translator[ghostery.translator.lang][el.id];
					if (!translation)
						translation = ghostery.translator['en'][el.id];

					if (translation)
						el.innerHTML = translation;
				}
			}
		} catch (e) {}
	},

	translateString: function(key) {
		ghostery.translator.setLanguage();

		var translation = '';
		try {
			translation = ghostery.translator[ghostery.translator.lang][key];
			if (!translation) translation = ghostery.translator['en'][key];
		} catch (e) {
			try { translation = ghostery.translator['en'][key]; } catch (e2) {}
		}

		return translation;
	}
};
