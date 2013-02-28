/**
 * Ghostery Firefox Extension: http://www.ghostery.com/
 * Ghostery First Run page scripts
 *
 * @author Felix Shnir
 * @copyright Copyright (C) 2011 Evidon
 */

if ( !ghostery ) { var ghostery = {}; }

ghostery.wizard = {
	bugs: null,
	cats: {bugs:{},cookies:{}},
	blockedCount: null,
	cookiedCount: null,
	active: null,
	activeType: null,
	total_bugs: 0,
	total_cookies: 0,
	currentPage: 0,
	ignoreKeyDirection: false,
	CATEGORIES: {
		'ad': {'full': 'Advertising', 'pop': 'An element that delivers advertisements falls into Advertising category'},
		'analytics': {'full': 'Analytics', 'pop': 'An element that provides research or analytics for web site publishers falls into Analytics category'},
		'privacy': {'full': 'Privacy', 'pop': 'In-ad or in-site privacy notices as well as some other privacy related 3pes fall into Privacy category'},
		'tracker': {'full': 'Beacons', 'pop': 'An element that serves no page purpose other than a tracking beacon (conversion pixel, audience segmentation pixel, etc) falls into Beacons category'},
		'widget': {'full': 'Widgets', 'pop': 'An element that provides some kind of web functionality (social network button, comment form, etc.) falls into Widgets category'},
		'user-created': {'full': 'User Added', 'pop': 'All user added elements belong to this category'}
	},

	init: function() {
		ghostery.translator.translate();
		ghostery.prefs.startup('options');

		this.GH$('prevArrow').style.display = 'none';

		this.f(1);

		var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.ghostery.");
		pref.QueryInterface(Components.interfaces.nsIPrefBranch2);
		if (pref.getBoolPref('shareData')) { this.GH$('GR').checked = 'checked'; }
		if (pref.getBoolPref('autoUpdateBugs')) { this.GH$('AU').checked = 'checked'; }

		this.bugs = [];

		var i, j = 0, ap, _this = this;

		this.GH$('prevArrow').addEventListener('click', function() { _this.prev(); }, true);
		this.GH$('nextArrow').addEventListener('click', function() { _this.next(); }, true);

		$(document).bind('keypress', function(e) {
			if (!ghostery.wizard.ignoreKeyDirection) {
				switch(e.keyCode) {
					case 37:
						_this.prev();
						break;
					case 39:
						_this.next();
						break;
				}
			} else {
				console.log('ignoring keys');
			}
		});

		this.GH$('bug-list-filter-name').addEventListener('keyup', function() { _this.cat(); }, true);
		$('#bug-list-filter-name').focusin( function(e) { ghostery.wizard.ignoreKeyDirection = true; } );
		$('#bug-list-filter-name').focusout( function(e) { ghostery.wizard.ignoreKeyDirection = false; } );
		
		
		this.GH$('bug-list-filter-blocked').addEventListener('change', function() { _this.cat(); }, true);

		$('#bugs-tab').click(function () { _this.switchTab('b'); });
		$('#cookies-tab').click(function () { _this.switchTab('c'); });

		$('#expand-all-2').click(function () { _this.expandAllCats(); });
		$('#collapse-all-2').click(function () { _this.collapseAllCats(); });
		$('#select-all-2').click(function () { _this.selectAllCats(); });
		$('#select-none-2').click(function () { _this.selectAllCats(false); });

		$('#reset-search-2').click(function () {
			$('#bug-list-filter-name').val('');
			$('#bug-list-filter-blocked').val('all');
			_this.cat();
		});

		// hover effect
		$('#bug-list-table-2').on('mouseenter mouseleave', 'tbody', function (e) {
			var $el = $(this);
			if (!$el.hasClass('category-row')) {
				$el = $el.prev('tbody');
			}
			if (e.type === 'mouseenter') {
				$el.addClass('hover');
			} else {
				$el.removeClass('hover');
			}
		});

		// building bugs list based on trackers
		for (i = 0; i < ghostery.db.bugs.length; i++) {
			if (ap == ghostery.db.bugs[i].aid) continue;

			ap = ghostery.db.bugs[i].aid;
			this.bugs[j] = { id: ghostery.db.bugs[i].aid, cid: ghostery.db.bugs[i].cid, name:ghostery.db.bugs[i].name, blocked: ghostery.prefs.isSelectedAppId(ghostery.db.bugs[i].aid), cookied: this.lookupCookieBlocking(ghostery.db.bugs[i].aid), detectCookie: this.cookieDetectionPresent(ghostery.db.bugs[i].aid), detectTracker: true, userCreated: ghostery.db.bugs[i].userCreated, type: ghostery.db.bugs[i].type };

			j++;
		}

		// adding to the bug list using lsos
		for (i = 0; i < ghostery.db.lsos.length; i++) {
			var found = false;
			for (var j = 0; j < this.bugs.length; j++) {
				var bug = this.bugs[j];
				if (bug.id == ghostery.db.lsos[i].aid) { 
					found = true;
					break;
				}
			}

			if (!found) {
				this.bugs[j] = { id: ghostery.db.lsos[i].aid, cid: ghostery.db.lsos[i].cid, name:ghostery.db.lsos[i].name, blocked: ghostery.prefs.isSelectedAppId(ghostery.db.lsos[i].aid), cookied: this.lookupCookieBlocking(ghostery.db.lsos[i].aid), detectCookie: this.cookieDetectionPresent(ghostery.db.lsos[i].aid), detectTracker: false, userCreated: false, type: ghostery.db.lsos[i].type };

				j++;
			}
		}

		for (var i = 0; i < this.bugs.length; i++) {
			var bug = this.bugs[i];

			this.blockedCount = this.blockedCount + (bug.detectTracker ? (bug.blocked ? 1 : 0) : 0 );
			this.cookiedCount = this.cookiedCount + (bug.detectCookie ? (bug.cookied ? 1 : 0) : 0 );
		}

		this.bugs.sort(function(a, b) { var aName = a.type.toLowerCase(); var bName = b.type.toLowerCase(); return aName > bName ? 1 : aName < bName ? -1 : 0 });

		// setup cats for trackers and cookies
		this.cats['bugs']['ad'] = [];
		this.cats['bugs']['analytics'] = [];
		this.cats['bugs']['tracker'] = [];
		this.cats['bugs']['privacy'] = [];
		this.cats['bugs']['user-created'] = [];
		this.cats['bugs']['widget'] = [];

		for (i = 0; i < this.bugs.length; i++) {
			bug = this.bugs[i];

			if (bug.detectTracker) {
				if (!this.cats['bugs'][bug.type]) {
					this.cats['bugs'][bug.type] = [];
				}

				this.cats['bugs'][bug.type].push(bug);
				if (this.bugs[i].detectTracker) this.total_bugs++;
			}

			if (bug.detectCookie) {
				if (!this.cats['cookies'][bug.type]) {
					this.cats['cookies'][bug.type] = [];
				}

				this.cats['cookies'][bug.type].push(bug);
				if (this.bugs[i].detectCookie) this.total_cookies++;
			}
		}

		this.cat('bugs');
	},

	getSelectedBugs: function(type) {
		var selectedBugs = [],
		 selectedApps = {},
		 n = (type == 'blocked' ? 'bugs' : 'lsos'),
		 m = (type == 'blocked' ? 'detectTracker' : 'detectCookie'),
		 i;

		for (i = 0; i < this.bugs.length; i++) {
			if ( (this.bugs[i][m]) && (this.bugs[i][type]) )
				selectedApps[this.bugs[i].id] = true;
		}

		for (i in selectedApps) {
			selectedBugs.push(i);
		}

		return selectedBugs;
	},

	save: function() {
		ghostery.prefs.set('shareData', this.GH$('GR').checked);
		ghostery.prefs.set('autoUpdateBugs', this.GH$('AU').checked);
		ghostery.prefs.set('tutorial', true);

		var selectedBugs = this.getSelectedBugs('blocked');
		var selectedCookies = this.getSelectedBugs('cookied');

		if (selectedBugs.length == 0) {
			ghostery.prefs.set('blockingMode',  -1);
		} else {
			ghostery.prefs.set('blockingMode',  0);
		}

		if (selectedCookies.length == 0) {
			ghostery.prefs.set('cookieProtect',  false);
		} else {
			ghostery.prefs.set('cookieProtect',  true);
		}

		ghostery.prefs.writeSelectionFile('bugs', selectedBugs);
		ghostery.prefs.writeSelectionFile('lsos', selectedCookies);

		ghostery.prefs.set('reloadList', true);
		ghostery.prefs.shutdown();
	},

	lookupCookieBlocking: function (aid) {
		if (this.cookieMap == null) {
			this.cookieMap = {};
			for (var i = 0; i < ghostery.db.lsos.length; i++) {
				if (ghostery.prefs.isSelectedCookie(ghostery.db.lsos[i].aid))
					this.cookieMap[ghostery.db.lsos[i].aid] = true;
			}
		}
	
		var lookup = this.cookieMap[aid];
		if (lookup) return lookup;

		if ( this.cookieDetectionPresent(aid) ) {
			lookup = false;
		}

		return lookup;
	},

	cookieDetectionPresent: function (aid) {
		if (this.cookiePresentMap == null) {
			this.cookiePresentMap = {};
			for (var i = 0; i < ghostery.db.lsos.length; i++) {
				this.cookiePresentMap[ghostery.db.lsos[i].aid] = true;
			}
		}

		return (this.cookiePresentMap[aid] ? true : false);
	},

	setCount: function() {
		var i, bug, filteredBlocked, catTotal, disTotal = 0, total = 0, cats = this.active;

		for(var cat in cats) {
			catTotal = 0;
			disTotal = 0;
			filteredBlocked = 0;

			for (i = 0; i < cats[cat].length; i++) {
				bug = cats[cat][i];
				catTotal = ( this.activeType == 'bugs' ? (bug.blocked ? ++catTotal : catTotal) : (bug.cookied ? ++catTotal : catTotal) );

				if ($('#bug-' + bug.id).length > 0) {
					filteredBlocked = ( this.activeType == 'bugs' ? (bug.blocked ? ++filteredBlocked : filteredBlocked) : (bug.cookied ? ++filteredBlocked : filteredBlocked) );
					disTotal++;
				}
			}

			(this.GH$('total-' + cat)) && (this.GH$('total-' + cat).textContent = catTotal);
			total += catTotal;

			if (disTotal == cats[cat].length) {
				// general case when everything is visible
				if (catTotal == cats[cat].length)
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = true) && (this.GH$('cat-' + cat).indeterminate = false);
				else
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = false) || (this.GH$('cat-' + cat).indeterminate = (catTotal != 0));
			} else {
				// case when filters are being applied
				if (filteredBlocked == disTotal)
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = true) && (this.GH$('cat-' + cat).indeterminate = false);
				else
					(this.GH$('total-' + cat)) && (this.GH$('cat-' + cat).checked = false) || (this.GH$('cat-' + cat).indeterminate = (filteredBlocked != 0));
			}
		}

		this.GH$('blocked-count-2').textContent = total;
		this.GH$('total-count-2').textContent = this['total_' + this.activeType];
		this.GH$('total-count-string').textContent = ghostery.translator.translateString('settings.' + this.activeType + '.label');
	},

	selectBug: function(cat, b) {
		var bug = this.active[cat][b], toggle = ( this.activeType == 'bugs' ? 'blocked' : 'cookied' );

		if (!this.GH$('bug-' + bug.id).checked) {
			bug[toggle] = false;
		} else {
			bug[toggle] = true;
		}

		this.setCount();
	},

	switchTab: function(dest) {
		var g = this.GH$('bugs-tab').parentNode,
		 a = this.GH$('cookies-tab').parentNode;

		if (dest == 'b') {
			if (g.className != 'active') {
				a.className = '';
				g.className = 'active';
				$('#bug-list-table-2').show();

				this.cat('bugs');
			}
		} else if (dest == 'c') {
			if (a.className != 'active') {
				g.className = '';
				a.className = 'active';
				$('#bug-list-table-2').show();

				this.cat('cookies');
			}
		}

		$("html,body").animate({ scrollTop: $('#tabs-bugs').offset().top - 5 }, 0);
	},

	expandAllCats: function() {
		for(var cat in this.active) {
			try {
				if (!this.GH$('selector-' + cat).xpanded) {
					this.GH$('selector-' + cat).xpanded = true;
					this.GH$('selector-' + cat).innerHTML = '<img src="images/down.gif" width="18" height="18">';
					$('#bug-n-cat-' + cat).show();
				}
			} catch (e) {}
		}
	},

	collapseAllCats: function() {
		for (var cat in this.active) {
			try {
				this.GH$('selector-' + cat).xpanded = false;
				this.GH$('selector-' + cat).innerHTML = '<img src="images/right.gif" width="18" height="18">';
				$('#bug-n-cat-' + cat).hide();
			} catch (e) {}
		}
	},

	selectAllCats: function(select) {
		if (select === undefined) {
			select = true;
		}

		for(var cat in this.active) {
			(this.GH$('cat-' + cat)) && (this.GH$('cat-' + cat).checked = !!select);
			this.selectCat(cat);
		}
	},

	isFiltered: function(bug) {
		var isFiltered = false,
		 mode = this.GH$('bug-list-filter-blocked').value,
		 filterText = this.GH$('bug-list-filter-name').value.toLowerCase();

		if (mode == 'blocked') {
			if ( (this.activeType == 'bugs') && (!bug.blocked) ) { isFiltered = true; }
			else if ( (this.activeType == 'cookies') && (!bug.cookied) ) { isFiltered = true; }
		} else if (mode == 'unblocked') {
			if ( (this.activeType == 'bugs') && (bug.blocked) ) { isFiltered = true; }
			else if ( (this.activeType == 'cookies') && (bug.cookied) ) { isFiltered = true; }
		} else if (mode == 'new') {
			if ( (this.activeType == 'bugs') && (!bug.isNew) ) { isFiltered = true; }
			else if ( (this.activeType == 'cookies') && (!bug.isNew) ) { isFiltered = true; }
		}

		if ( (filterText.length > 0) && (filterText) ) {
			if ( bug.name.toLowerCase().indexOf(filterText) < 0 ) { isFiltered = true; }
		}

		return isFiltered;
	},

	selectCat: function(cat) {
		var bug, c = this.GH$('cat-' + cat), toggle = ( this.activeType == 'bugs' ? 'blocked' : 'cookied' ), selecting;

		if (!c) return;

		if (c.checked) {
			// select
			for (var i = 0; i < this.active[cat].length; i++) {
				bug = this.active[cat][i];

				if ($('#bug-' + bug.id).length == 0) continue;

				(this.GH$('bug-' + this.active[cat][i].id)) && (this.GH$('bug-' + this.active[cat][i].id).checked = true);
				this.active[cat][i][toggle] = true;
			}
		} else {
			// unselect
			for (var i = 0; i < this.active[cat].length; i++) {
				bug = this.active[cat][i];

				if ($('#bug-' + bug.id).length == 0) continue;

				(this.GH$('bug-' + this.active[cat][i].id)) && (this.GH$('bug-' + this.active[cat][i].id).checked = false);
				this.active[cat][i][toggle] = false;
			}
		}

		this.setCount();
	},

	showCat: function(cat) {
		if (!this.GH$('selector-' + cat).xpanded) {
			this.GH$('selector-' + cat).xpanded = true;
			this.GH$('selector-' + cat).innerHTML = '<img src="images/down.gif" width="18" height="18">';

			$('#bug-n-cat-' + cat).slideDown();
			$("html,body").animate({
				scrollTop: $('#bug-n-cat-' + cat).prev('tbody').offset().top - 50
			});

		} else {
			this.GH$('selector-' + cat).xpanded = false;
			this.GH$('selector-' + cat).innerHTML = '<img src="images/right.gif" width="18" height="18">';

			$('#bug-n-cat-' + cat).slideUp();
		}
	},

	cat: function(type) {
		this.activeType = (type ? type : this.activeType);

		var i, bug, filtered = false, header, rows, even, catTotal, total = 0,
		 cats = this.cats[this.activeType];

		this.active = cats;

		$('#bug-list-table-2 tbody').remove();
		$('#group-note').html(ghostery.translator.translateString('settings.' + this.activeType + '.note'));

		for (var cat in cats) {
			even = 'background-color: #e7f4fc;';

			header = '<tr><td onclick="ghostery.wizard.showCat(\'' + cat + '\');"><span id="selector-' + cat + '"><img src="images/right.gif" width="18" height="18"></span></td><td ><input type="checkbox" class="bug-checkbox" id="cat-' + cat + '" onclick="ghostery.wizard.selectCat(\'' + cat + '\');"></td><td style="width:100%" onclick="ghostery.wizard.showCat(\'' + cat + '\');"><span class="category-name hotspot" onmouseover="tooltip.show(\'' + this.CATEGORIES[cat].pop + '\', false);" onmouseout="tooltip.hide();">' + this.CATEGORIES[cat].full + '</span> <span style="font-size:x-small;">' + cats[cat].length + ' '  + ghostery.translator.translateString('settings.' + this.activeType + '.label') + '</span> <span style="font-size:x-small;" >(<span id="total-' + cat + '"></span> ' + ghostery.translator.translateString('settings.count.blocked') + ')</span></td></tr>';

			catTotal = 0;
			rows = '';
			for (i = 0; i < cats[cat].length; i++) {
				bug = cats[cat][i];

				if (this.isFiltered(bug)) {
					filtered = true;
					continue;
				}

				var str = '<tr style="width:' + $('#bug-list-table-2 thead').width() + 'px;' + even + '">';
				str += '<td><img src="images/right.gif" style="visibility:hidden" width="18" height="18"></td><td><input type="checkbox" class="bug-checkbox" id="bug-' + bug.id + '" onclick="ghostery.wizard.selectBug(\'' + cat + '\', ' + i + ');" ' + ( this.activeType == 'bugs' ? (bug.blocked ? 'checked="true"' : '') : (bug.cookied ? 'checked="true"' : '') ) + '>';
				str += '</td><td style="width:100%">' + (bug.userCreated ? (bug.name + ' (Locally added)') : '<a onclick="ghostery.wizard.showAppInfo(\'' + cat + '\', ' + i + '); return false;" target="_blank" href="http://www.ghostery.com/apps/' + encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase()) + '">' + bug.name + '</a>');

				str += '</td></tr>';

				str += '<tr><td colspan="3" style="display:none;"><div style="display:none;" id="bug-app-info-' + bug.id + '"></div></td></tr>';

				++catTotal;

				rows += str;

				if (even == '') even = 'background-color: #e7f4fc;'; else even = '';
			}

			if (rows) {
				$('#bug-list-table-2')
					.append($('<tbody class="category-row"></tbody>').append(header) )
					.append($('<tbody class="category-bugs"></tbody>').attr( 'id', 'bug-n-cat-' + cat ).hide().append(rows) );
			}

			total += catTotal;
		}

		if (total == 0) {
			$('#bug-list-table-2')
				.append($('<tbody></tbody>').append('<tr><td>' + ghostery.translator.translateString('settings.noresults') + '</td></tr>') );
		}

		this.setCount();

		if (filtered) {
			// expand cats
			this.expandAllCats();
		}
	},

	fetchAppInfo: function(bug) {
		var cell = $('#bug-app-info-' + bug.id),
			leftMargin = $('#bug-' + bug.id).parent().width() + $('#bug-' + bug.id).parent().prev().width();

		cell.append('<div class="loadbox" style="height:150px;align:center;text-align:center;"><img style="padding-top:65px;" src="chrome://ghostery/content/images/s1.gif" width="24" height="24"></div>');
		cell.slideDown(null, function () {
			cell.parent().parent().scrollIntoGreatness();
		});

		$.ajax({
			cache: false,
			dataType: 'json',
			url: 'http://www.ghostery.com/apps/' + encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase()) + '?format=json',
			complete: function (xhr, status) {
				$('#bug-app-info-' + bug.id + ' div.loadbox').remove();

				if (status == 'success') {
					var ci = JSON.parse(xhr.responseText),
					 apps = '', i;
					ci['ca'] = [];

					for (i in ci.company_app) {
						ci['ca'].push(ci.company_app[i].ca_name);
					}

					ci['ag'] = [];

					if (ci.affiliation_groups.length > 0) {
						for (i in ci.affiliation_groups) {
							ci['ag'].push('<img height="20" src="' + ci.affiliation_groups[i].ag_logo_url + '"/>');
						}
					} else {
						ci['ag'] = ['None'];
					}

					// slide down
					cell.parent().css('display', '').addClass('app-info-shown');
					cell.css('margin-left', leftMargin + 20);
					cell.append('<div class="aboutbox"><img class="company-logo" src="'
						+ ci.company_logo_url + '"><h1>About ' + ci.company_name + ':</h1>'
						+ (ci['ca'].length > 1  ? ('<p class="multi-app">' + ci.company_name
						+ ' operates: ' + ci['ca'].join(', ') + ' </p>') : '')
						+ '<p class="company-desc">'
						+ ci.company_description + '</p><p class="company-site"><h2>Website: </h2><a href="'
						+ ci.company_website_url + '" rel="nofollow" target="_blank">' + ci.company_website_url
						+ '</a></p><p class="company-affiliations"><h2>Industry Affiliations:</h2> '
						+ ci['ag'].join(' ') + '</p><div><h2><a target="_blank" href="http://www.ghostery.com/apps/'
						+ encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase())
						+ '">Continue to full profile</a></h2></div></div>');

				} else {
					// happens when our site is down, profile errors out, or user is offline

					// slide down
					cell.parent().css('display', '').addClass('app-info-shown');
					cell.css('margin-left', leftMargin + 20);
					cell.append('<div class="aboutbox"><h1>Unable to load data from ghostery.com</h1> <a target="_blank" href="http://www.ghostery.com/apps/' + encodeURIComponent(bug.name.replace(/\s+/g, '_').toLowerCase()) + '">Continue to full profile</a></h2></div>');
				}

				cell.slideDown(null, function () {
					cell.parent().parent().scrollIntoGreatness();
				});
			}
		});
	},

	closeAppInfo: function(el) {
		$(el).slideUp(null, function () {
			$(el).parent().css('display', 'none').removeClass('app-info-shown');
		});
		el.xpanded = false;
	},

	showAppInfo: function(cat, bugId) {
		var bug = this.active[cat][bugId],
			cell = $('#bug-app-info-' + bug.id),
			self = this;

		if (!cell[0].xpanded) {
			// close any other aboutboxes, if open
			$('td.app-info-shown > div').not(cell[0]).each(function () {
				self.closeAppInfo(this);
			});

			cell.parent().css('display', '').addClass('app-info-shown');

			if ($('#bug-app-info-' + bug.id + ' div.aboutbox').length > 0) {
				// mini profile already loaded
				cell.slideDown(null, function () {
					cell.parent().parent().scrollIntoGreatness();
				});
			} else {
				this.fetchAppInfo(bug);
			}

			cell[0].xpanded = true;

		} else {
			// slide up
			this.closeAppInfo(cell[0]);
		}
	},

	ghostRankMore: function() {
		var el = $('#ghostrank-moreinfo');
		if (!el[0].xpanded) {
			el[0].xpanded = true;
			el.slideDown('slow', function() {
				$('#settings\\.more\\.info\\.span').hide();
		  });	
		} else {
			el[0].xpanded = false;
			el.slideUp();
		}
	},

	GH$:function(a) { return $('#' + a)[0]; },

	next: function() {
		if (ghostery.wizard.currentPage == 0) {
			ghostery.wizard.currentPage = 1;
			ghostery.wizard.GH$('prevArrow').style.display = '';
			ghostery.wizard.f(2);
		} else if (ghostery.wizard.currentPage == 1) {
			ghostery.wizard.currentPage = 2;
			ghostery.wizard.f(3);
		} else if (ghostery.wizard.currentPage == 2) {
			ghostery.wizard.currentPage = 3;
			ghostery.wizard.GH$('nextArrow').style.display = 'none';
			ghostery.wizard.f(4);
			ghostery.wizard.GH$('skipWizard').style.display = 'none';
			ghostery.wizard.save();
		}
	},

	prev: function() {
		if (ghostery.wizard.currentPage == 0) {
			ghostery.wizard.GH$('prevArrow').style.display = 'none';
		} else if (ghostery.wizard.currentPage == 1) {
			ghostery.wizard.currentPage = 0;
			ghostery.wizard.GH$('prevArrow').style.display = 'none';
			ghostery.wizard.b(1);
		} else if (ghostery.wizard.currentPage == 2) {
			ghostery.wizard.currentPage = 1;
			ghostery.wizard.b(2);
		} else if (ghostery.wizard.currentPage == 3) {
			ghostery.wizard.currentPage = 2;
			ghostery.wizard.GH$('nextArrow').style.display = '';
			ghostery.wizard.GH$('skipWizard').style.display = '';
			ghostery.wizard.b(3);
		}
	},

	f: function(p) {
		try {
			$('#step-' + p)[0].style.display = 'block';
			$('#step-' + (--p))[0].style.display = 'none';
		} catch (e) {}
	},
	
	b: function(p) {
		try {
			$('#step-' + p)[0].style.display = 'block';
			$('#step-' + (++p))[0].style.display = 'none';
		} catch (e) {}
	},
	
	s: function() {
		var skip = confirm(document.getElementById('walkthrough.skip.prompt').textContent);
		if (skip) {
			var element = document.createElement("ghosteryHeadsUp");
			element.setAttribute('skip', true);
			document.documentElement.appendChild(element);
			var ev = document.createEvent("Events");
			ev.initEvent("GhosteryHeadsUpEvent", true, false);
			element.dispatchEvent(ev);
			window.close();
		}
	}
}

/* tooltip. courtesy of: http://sixrevisions.com/tutorials/javascript_tutorial/create_lightweight_javascript_tooltip */
var tooltip=function(){
 var id = 'tt';
 var top = 3;
 var left = 3;
 var maxw = 800;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,timed,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    t = document.createElement('div');
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.setAttribute('id',id + 'bot');
    tt.appendChild(t);
    tt.appendChild(c);
    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
  	document.onmousemove = this.pos;
	 }
	 
	 if (timed) {
   	document.onmousemove = function(e){
	   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
	   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
	   tt.style.top = (u - h) + 'px';
	   tt.style.left = (l + left) + 'px';
	   document.onmousemove = null;
	  };
   } else {
   	document.onmousemove = this.pos;
   }

   tt.style.display = 'block';

   if (document.getElementById(v)) {
   		c.innerHTML = document.getElementById(v).innerHTML;
   } else {
			c.innerHTML = v;
   }

   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
    t.style.display = 'none';
    b.style.display = 'none';
    tt.style.width = tt.offsetWidth;
    t.style.display = 'block';
    b.style.display = 'block';
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;
  
 	clearInterval(tt.timer);
 	tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = (u - h) + 'px';
   tt.style.left = (l + left) + 'px';
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();