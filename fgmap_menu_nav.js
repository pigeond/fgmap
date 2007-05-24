/*
 * Nav menu
 *
 * Pigeon <pigeon at pigeond dot net>
 *
 * GPLv2, see LICENSE file for details
 */


//var FGMAP_NAV_INVIEW_ZOOM_MAX = 10;
var FGMAP_NAV_INVIEW_ZOOM_MAX = -1;

var FGMAP_RADIONAV_TYPES = new Object();
FGMAP_RADIONAV_TYPES["DME"] = FGMAP_NAVAID_DME;
FGMAP_RADIONAV_TYPES["TACAN"] = FGMAP_NAVAID_TACAN;
FGMAP_RADIONAV_TYPES["VOR"] = FGMAP_NAVAID_VOR;
FGMAP_RADIONAV_TYPES["VOR-DME"] = FGMAP_NAVAID_VORDME;
FGMAP_RADIONAV_TYPES["VORTAC"] = FGMAP_NAVAID_VORTAC;
FGMAP_RADIONAV_TYPES["NDB"] = FGMAP_NAVAID_NDB;
FGMAP_RADIONAV_TYPES["NDB-DME"] = FGMAP_NAVAID_NDBDME;

var FGMAP_ILS_TYPES = new Object();
FGMAP_ILS_TYPES["ils"] = FGMAP_ILS_TYPE_ILS;
FGMAP_ILS_TYPES["loc"] = FGMAP_ILS_TYPE_LOC;
FGMAP_ILS_TYPES["gs"] = FGMAP_ILS_TYPE_GS;
FGMAP_ILS_TYPES["om"] = FGMAP_ILS_TYPE_OM;
FGMAP_ILS_TYPES["mm"] = FGMAP_ILS_TYPE_MM;
FGMAP_ILS_TYPES["im"] = FGMAP_ILS_TYPE_IM;
FGMAP_ILS_TYPES["dme"] = FGMAP_ILS_TYPE_DME;


/* Translate all radio nav types to general VOR or NDB, otherwise the same type
is returned */
function nav_type_generalize(type) {
    if(type == FGMAP_NAVAID_DME || type == FGMAP_NAVAID_NDBDME) {
        return FGMAP_NAVAID_NDB;
    }
    if(type == FGMAP_NAVAID_VORTAC || type == FGMAP_NAVAID_VORDME ||
        type == FGMAP_NAVAID_TACAN) {
        return FGMAP_NAVAID_VOR;
    }
    if(type == FGMAP_NAVAID_HPT || type == FGMAP_NAVAID_SPT) {
        return FGMAP_NAVAID_APT;
    }
    return type;
};


function FGMapMenuNav(fgmap, tabdiv) {

    this.fgmap = fgmap;
    this.tabdiv = tabdiv;
    this.result_cnt = 0;
    this.setup();
    this.bounds = null;

    /* Preload some images */
    this.preload1 = new Image();
    this.preload1.src = "images/search-pressed.gif";

    this.preload2 = new Image();
    this.preload2.src = "images/inview-pressed.gif";

    this.preload3 = new Image();
    this.preload3.src = "images/trash-pressed.gif";
}


FGMapMenuNav.prototype.setup = function() {

    var elem = this.div = element_create(null, 'div');
    elem.style.className = "fgmap_nav";
    elem.style.overflow = "hidden";
    elem.style.width = "95%";
    elem.style.height = "95%";
    elem.style.padding = "0px";
    elem.style.margin = "4px auto 0px auto";
    elem.style.textAlign = "center";


    // Lookup
    var form = this.nav_form = element_create(elem, "form");
    form.style.display = "inline";
    form.action = "";
    form.method = "";

    element_text_append(form, "Navaids lookup:");
    element_text_append(form, "\u00a0\u00a0\u00a0");

    /* I forgot, but it seems i need both to have it working in both IE and
     * FF/MZ */
    attach_event(form, "submit",
        this.nav_form_submit_cb.bind_event(this));
    form.onsubmit = this.nav_form_submit_cb.bind_event(this);


    var input = this.nav_lookup =
        element_create(this.nav_form, "input", "text");

    input.size = 16;
    input.maxLength = 16;
    input.className = "fgmap_menu";
    input.value = "";
    input.title = "search selected navaids by string";
    input.style.verticalAlign = "middle";

    element_text_append(this.nav_form, "\u00a0\u00a0");

    var but;
    
    /* search button */
/*
    but = this.sbutton =
        element_create(this.nav_form, "input", "button");
*/
    but = this.sbutton = element_create(this.nav_form, "img");
    but.src = "images/search.gif";
    but.style.verticalAlign = "middle";
    but.className = "fgmap_menu";
    but.title = "search selected types of navaids by string";
    but.style.cursor = "pointer";
    attach_event(but, "mousedown", this.nav_search_mouse_cb.bind_event(this));
    attach_event(but, "mouseup", this.nav_search_mouse_cb.bind_event(this));
    attach_event(but, "mouseout", this.nav_search_mouse_cb.bind_event(this));
    this.sbutton_enabled_set(true);

    element_text_append(this.nav_form, "\u00a0\u00a0");

    /* Show all in current view button */
    but = this.cbutton = element_create(this.nav_form, "img");
    but.src = "images/inview.gif";
    but.className = "fgmap_menu";
    but.style.verticalAlign = "middle";
    but.title = "show selected types of navaids in current view (100 navaids max)";
    but.style.cursor = "pointer";
    attach_event(but, "mousedown", this.nav_inview_mouse_cb.bind_event(this));
    attach_event(but, "mouseup", this.nav_inview_mouse_cb.bind_event(this));
    attach_event(but, "mouseout", this.nav_inview_mouse_cb.bind_event(this));
    this.cbutton_enabled_set(true);

    element_text_append(this.nav_form, "\u00a0\u00a0");

    /* Trash (clear all) button */
    but = this.tbutton = element_create(this.nav_form, "img");
    but.src = "images/trash.gif";
    but.style.verticalAlign = "middle";
    but.className = "fgmap_menu";
    but.title = "clear all shown navaids";
    but.style.cursor = "pointer";
    attach_event(but, "mousedown", this.nav_clearall_mouse_cb.bind_event(this));
    attach_event(but, "mouseup", this.nav_clearall_mouse_cb.bind_event(this));
    attach_event(but, "mouseout", this.nav_clearall_mouse_cb.bind_event(this));

    element_create(this.nav_form, "br");

    var chbx;
    var base_chbx = element_create(null, "input", "checkbox");
    base_chbx.style.verticalAlign = "middle";
    base_chbx.checked = false;
    base_chbx.style.cursor = 'pointer';

    var span;
    var base_span = element_create(null, 'span');
    base_span.style.cursor = 'pointer';

    span = element_clone(base_span);
    this.aptname_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.defaultChecked = true;
    element_attach(chbx, span);
    attach_event(span, "mousedown",
            this.nav_search_checkbox_text_toggle_cb.bind_event(this, chbx));
    element_text_append(span, "apt name");
    element_attach(span, this.nav_form);
    element_text_append(this.nav_form, "\u00a0\u00a0");

    span = element_clone(base_span);
    this.aptcode_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.defaultChecked = true;
    element_attach(chbx, span);
    attach_event(span, "mousedown",
            this.nav_search_checkbox_text_toggle_cb.bind_event(this, chbx));
    element_text_append(span, "apt code");
    element_attach(span, this.nav_form);
    element_text_append(this.nav_form, "\u00a0\u00a0");

    span = element_clone(base_span);
    this.vor_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.defaultChecked = true;
    element_attach(chbx, span);
    attach_event(span, "mousedown",
            this.nav_search_checkbox_text_toggle_cb.bind_event(this, chbx));
    element_text_append(span, "vor");
    element_attach(span, this.nav_form);
    element_text_append(this.nav_form, "\u00a0\u00a0");

    span = element_clone(base_span);
    this.ndb_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.defaultChecked = true;
    element_attach(chbx, span);
    attach_event(span, "mousedown",
            this.nav_search_checkbox_text_toggle_cb.bind_event(this, chbx));
    element_text_append(span, "ndb");
    element_attach(span, this.nav_form);
    element_text_append(this.nav_form, "\u00a0\u00a0");

    span = element_clone(base_span);
    this.fix_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.defaultChecked = true;
    element_attach(chbx, span);
    attach_event(span, "mousedown",
            this.nav_search_checkbox_text_toggle_cb.bind_event(this, chbx));
    element_text_append(span, "fix");
    element_attach(span, this.nav_form);
    element_text_append(this.nav_form, "\u00a0\u00a0");

    span = element_clone(base_span);
    this.awy_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.defaultChecked = true;
    element_attach(chbx, span);
    attach_event(span, "mousedown",
            this.nav_search_checkbox_text_toggle_cb.bind_event(this, chbx));
    element_text_append(span, "airway");
    element_attach(span, this.nav_form);
    element_text_append(this.nav_form, "\u00a0\u00a0");

    var box = this.box =
        element_create(this.div, "div");
    box.style.textAlign = "left";
    box.style.overflow = "hidden";
    box.style.position = "relative";
    box.style.marginTop = "1px";
    box.style.borderTop = "1px dotted white";
    box.style.height = "65%";

    var result_box = this.result_box = element_create(box, "div");
    result_box.style.position = "absolute";
    result_box.style.overflow = "auto";
    result_box.style.width = "78%";
    result_box.style.height = "95%";
    result_box.style.top = "0px";
    result_box.style.left = "0px";
    result_box.style.margin = "0px";
    result_box.style.paddingTop = "4px";
    result_box.style.paddingLeft = "4px";
    result_box.style.verticalAlign = "top";

    var panel = this.panel = element_create(box, "div");
    panel.style.position = "absolute";
    panel.style.overflow = "auto";
    panel.style.width = "20%";
    panel.style.height = "85%";
    panel.style.right = "0px";
    panel.style.top = "0px";
    panel.style.paddingTop = "4px";
    panel.style.textAlign = "center";

    element_text_append(this.panel, "show");

    var ul = element_create(this.panel, "ul");
    ul.style.width = "100%";
    ul.style.listStyle = "none inside none";
    ul.style.margin = "0px auto";
    ul.style.padding = "0px"
    ul.style.textAlign = "left";

    var base_li = element_create(null, "li");
    base_li.style.width = "48%";
    base_li.style.cssFloat = "left";
    base_li.style.styleFloat = "left";
    base_li.style.verticalAlign = "middle";
    base_li.style.whiteSpace = "nowrap";
    base_li.style.padding = "0px";
    base_li.style.margin = "0px";
    base_li.style.textAlign = "left";

    var li;

    base_chbx.checked = true;
    base_chbx.defaultChecked = true;

    /* A hash lookup table for checkboxes */
    this.toggles = new Object();

    li = element_clone(base_li, false);
    element_attach(li, ul);
    chbx = element_clone(base_chbx);
    chbx.value = FGMAP_NAVAID_APT;
    this.toggles[FGMAP_NAVAID_APT] = chbx;
    span = element_clone(base_span);
    element_attach(chbx, span);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    span.value = FGMAP_NAVAID_APT;
    element_attach(span, li);
    attach_event(span, "mousedown",
            this.toggle_click_cb.bind_event(this, chbx));
    element_text_append(span, "apt");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    chbx = element_clone(base_chbx);
    chbx.value = FGMAP_NAVAID_VOR;
    this.toggles[FGMAP_NAVAID_VOR] = chbx;
    span = element_clone(base_span);
    element_attach(chbx, span);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    span.value = FGMAP_NAVAID_VOR;
    element_attach(span, li);
    attach_event(span, "mousedown",
            this.toggle_click_cb.bind_event(this, chbx));
    element_text_append(span, "vor");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    chbx = element_clone(base_chbx);
    chbx.value = FGMAP_NAVAID_NDB;
    this.toggles[FGMAP_NAVAID_NDB] = chbx;
    span = element_clone(base_span);
    element_attach(chbx, span);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    element_attach(span, li);
    span.value = FGMAP_NAVAID_NDB;
    attach_event(span, "mousedown",
            this.toggle_click_cb.bind_event(this, chbx));
    element_text_append(span, "ndb");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    chbx = element_clone(base_chbx);
    chbx.value = FGMAP_NAVAID_FIX;
    this.toggles[FGMAP_NAVAID_FIX] = chbx;
    span = element_clone(base_span);
    element_attach(chbx, span);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    span.value = FGMAP_NAVAID_FIX;
    element_attach(span, li);
    attach_event(span, "mousedown",
            this.toggle_click_cb.bind_event(this, chbx));
    element_text_append(span, "fix");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    chbx = element_clone(base_chbx);
    chbx.value = FGMAP_NAVAID_AWY;
    this.toggles[FGMAP_NAVAID_AWY] = chbx;
    span = element_clone(base_span);
    element_attach(chbx, span);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    span.value = FGMAP_NAVAID_AWY;
    element_attach(span, li);
    attach_event(span, "mousedown",
            this.toggle_click_cb.bind_event(this, chbx));
    element_text_append(span, "awy");

/* TODO
    GEvent.addListener(this.fgmap.gmap, "zoomend",
        this.gmap_zoomend_cb.bind_event(this));

    this.gmap_zoomend_cb(-1, this.fgmap.gmap.getZoom());
*/

    this.tabdiv.tab_add("nav", "nav", elem, this);

};

FGMapMenuNav.prototype.nav_search_checkbox_text_toggle_cb =
    function(e, chbx) {

    e = e || window.event;

    if(target_get(e) != chbx) {
        if(chbx) {
            chbx.checked = !chbx.checked;
        }
    }
};

FGMapMenuNav.prototype.nav_type_visible_set = function(type, visible) {

    this.fgmap.nav_type_visible_set(type, visible);

    if(type == FGMAP_NAVAID_VOR) {

        this.fgmap.nav_type_visible_set(FGMAP_NAVAID_VORTAC, visible);
        this.fgmap.nav_type_visible_set(FGMAP_NAVAID_VORDME, visible);
        this.fgmap.nav_type_visible_set(FGMAP_NAVAID_TACAN, visible);

    } else if(type == FGMAP_NAVAID_NDB) {

        this.fgmap.nav_type_visible_set(FGMAP_NAVAID_NDBDME, visible);
        this.fgmap.nav_type_visible_set(FGMAP_NAVAID_DME, visible);

    } else if(type == FGMAP_NAVAID_APT) {
    
        this.fgmap.nav_type_visible_set(FGMAP_NAVAID_HPT, visible);

    }
};


FGMapMenuNav.prototype.toggle_click_cb = function(e, chbx) {

    var target = target_get(e || window.event);
    var checked;

    if(target == chbx) {
        return;
    }

    if(chbx) {
        chbx.checked = !chbx.checked;
        checked = chbx.checked;
    } else {
        checked = target.checked;
    }
    if(target.value != null) {
        this.nav_type_visible_set(target.value, checked);
    }
};


FGMapMenuNav.prototype.sbutton_enabled_set = function(enabled) {
    this.sbutton.disabled = !enabled;
    if(enabled) {
        this.sbutton.value = "search";
    } else {
        this.sbutton.value = " wait ";
    }
};


FGMapMenuNav.prototype.cbutton_enabled_set = function(enabled) {
    this.cbutton.disabled = !enabled;
    if(enabled) {
        this.cbutton.value = "in view";
    } else {
        this.cbutton.value = " wait ";
    }
};


FGMapMenuNav.prototype.nav_form_submit_cb = function(e) {

    if((this.nav_lookup.value == "" || this.nav_lookup.value.length < 2)
        && this.bounds == null) {

        this.result_box_msg_set("Search string too short, minimum length 2.");
        return false;
    }

    if(this.xml_request) {
        //this.xml_request.abort();
        return false;
    }

    var url;
    var loc = window.location;

    // TODO
    if(loc.hostname.match(/^mpmap02\./i) ||
            loc.hostname.match(/^mpserver02\./i) ||
            loc.hostname.match(/^pigeond\.net/i) ||
            loc.hostname.match(/^localhost/i)) {
        url = "fg_nav_xml.cgi?";
    } else {
        url = "fg_nav_xml_proxy.cgi?";
    }
    
    if(this.bounds) {
        /* This override search string */
        var ne = this.bounds.getNorthEast();
        var sw = this.bounds.getSouthWest();
        url += "ne=" + ne.lat() + "," + ne.lng() +
                "&sw=" + sw.lat() + "," + sw.lng();
    } else {
        url += "sstr=" + this.nav_lookup.value;
    }

    if(this.aptcode_chbx.checked == true)
        url += "&apt_code";
    if(this.aptname_chbx.checked == true)
        url += "&apt_name";
    if(this.vor_chbx.checked == true)
        url += "&vor";
    if(this.ndb_chbx.checked == true)
        url += "&ndb";
    if(this.fix_chbx.checked == true)
        url += "&fix";
    if(this.awy_chbx.checked == true)
        url += "&awy";
    
    this.xml_request = GXmlHttp.create();
    this.xml_request.open("GET", url, true);
    this.xml_request.onreadystatechange =
        this.nav_form_xml_request_cb.bind_event(this);
    this.xml_request.send(null);
    
    this.result_box_result_clear();
    this.result_box_msg_set("Please wait...");
    this.sbutton_enabled_set(false);
    this.cbutton_enabled_set(false);

    return false;
};


FGMapMenuNav.prototype.nav_apt_parse = function(xmldoc) {
    
    var apts = xmldoc.documentElement.getElementsByTagName("airport");

    for(var i = 0; i < apts.length; i++) {

        var apt_id = apts[i].getAttribute("id");

        var apt_code = apts[i].getAttribute("code");
        var apt_name = apts[i].getAttribute("name");
        var apt_elevation = apts[i].getAttribute("elevation");
        var apt_heli = apts[i].getAttribute("heliport");

        var apt;
        
        if(apt_heli == 1) {
            apt = new FGHeliport(this.fgmap,
                    apt_id, apt_code, apt_name, apt_elevation);
        } else {
            apt = new FGAirport(this.fgmap,
                    apt_id, apt_code, apt_name, apt_elevation);
        }

        /* Runways */
        var runways = apts[i].getElementsByTagName("runway");

        for(var r = 0; r < runways.length; r++) {

            var r_num = runways[r].getAttribute("num");
            var r_lat = parseFloat(runways[r].getAttribute("lat"));
            var r_lng = parseFloat(runways[r].getAttribute("lng"));
            var r_heading = parseFloat(runways[r].getAttribute("heading"));
            var r_length = parseFloat(runways[r].getAttribute("length"));
            var r_width = parseFloat(runways[r].getAttribute("width"));

            if(apt_heli == 1) {

                apt.pad_add(r_num,
                    r_lat, r_lng, r_heading, r_length, r_width);
                continue;

            } else {

                apt.runway_add(r_num,
                    r_lat, r_lng, r_heading, r_length, r_width);

            }

            /* ILS */
            var ilss = runways[r].getElementsByTagName("ils");

            if(ilss.length > 0) {
            
                for(var ii = 0; ii < ilss.length; ii++) {

                    var ils_hash = new Object();

                    var ils = ilss[ii];

                    var ils_type = ils.getAttribute('type');
                    ils_type = FGMAP_ILS_TYPES[ils_type];

                    ils_hash['type'] = ils_type;
                    ils_hash['lat'] = ils.getAttribute('lat');
                    ils_hash['lng'] = ils.getAttribute('lng');
                    ils_hash['elevation'] = ils.getAttribute('elevation');
                    ils_hash['freq'] = ils.getAttribute('freq');
                    ils_hash['channel'] = ils.getAttribute('channel');
                    ils_hash['range'] = ils.getAttribute('range');
                    ils_hash['ident'] = ils.getAttribute('ident');
                    ils_hash['name'] = ils.getAttribute('name');
                    ils_hash['heading'] = ils.getAttribute('heading');

                    /* GS */
                    if(ils_type == FGMAP_ILS_TYPE_GS) {
                        ils_hash['angle'] = ils.getAttribute('angle');
                    }

                    if(ils_type == FGMAP_ILS_TYPE_ILS) {
                        ils_hash['type_name'] = ils.getAttribute('type_name');
                    }

                    if(apt.ils_add(r_num, ils_hash) == false) {
                        /* TODO */
                    }
                }
            }

            /* TODO: GS/IM/MM/OM */
        }
        
        if(apt_heli == 0) {
            /* ATC */
            var atcs = apts[i].getElementsByTagName("atc");

            for(var a = 0; a < atcs.length; a++) {
                var atc_type = atcs[a].getAttribute("atc_type");
                var freq = atcs[a].getAttribute("freq");
                var name = atcs[a].getAttribute("name");
                apt.atc_add(atc_type, freq, name);
            }
        }

        this.result_box_result_add(apt);

    }

};


/* VOR VORTAC VOR-DME NDB NDB-DME TACAN DME */
FGMapMenuNav.prototype.nav_radio_parse = function(xmldoc) {

    var i;
    var id;
    var lat, lng, elevation, freq, channel, range, multi, ident, name;

    var navs = xmldoc.documentElement.getElementsByTagName("radionav");
    var nav;

    for(i = 0; i < navs.length; i++) {

        lat = navs[i].getAttribute('lat');
        lng = navs[i].getAttribute('lng');
        elevation = navs[i].getAttribute('elevation');
        freq = navs[i].getAttribute('freq');
        channel = navs[i].getAttribute('channel');
        range = navs[i].getAttribute('range');
        multi = navs[i].getAttribute('multi');
        ident = navs[i].getAttribute('ident');
        name = navs[i].getAttribute('name');
        type_name = navs[i].getAttribute('type_name');

        // An easy id / hash
        id = 'radionav:' + type_name + ':' + ident + ':' + lat + ':' + lng;

        nav = new FGRadioNav(this.fgmap, id,
            FGMAP_RADIONAV_TYPES[type_name],
            ident, name, lat, lng, freq, channel);

        this.result_box_result_add(nav);
    }

};


FGMapMenuNav.prototype.nav_fix_parse = function(xmldoc) {

    var fixes = xmldoc.documentElement.getElementsByTagName("fix");

    for(var i = 0; i < fixes.length; i++) {
        var lat = fixes[i].getAttribute('lat');
        var lng = fixes[i].getAttribute('lng');
        var name = fixes[i].getAttribute('name');

        var id = 'fix:' + name + ':' + lat + ':' + lng;
        var fix = new FGNavFix(this.fgmap, id, name, lat, lng);
        this.result_box_result_add(fix);
    }

};


FGMapMenuNav.prototype.nav_awy_parse = function(xmldoc) {

    var awys = xmldoc.documentElement.getElementsByTagName("awy");

    for(var i = 0; i < awys.length; i++) {

        var awy_hash = new Object();

        awy_hash['name_start'] = awys[i].getAttribute('name_start');
        awy_hash['lat_start'] = awys[i].getAttribute('lat_start');
        awy_hash['lng_start'] = awys[i].getAttribute('lng_start');

        awy_hash['name_end'] = awys[i].getAttribute('name_end');
        awy_hash['lat_end'] = awys[i].getAttribute('lat_end');
        awy_hash['lng_end'] = awys[i].getAttribute('lng_end');

        awy_hash['enroute'] = awys[i].getAttribute('enroute');
        awy_hash['base'] = awys[i].getAttribute('base');
        awy_hash['top'] = awys[i].getAttribute('top');
        awy_hash['seg_name'] = awys[i].getAttribute('seg_name');

        awy_hash['m'] = awys[i].getAttribute('m');
        awy_hash['b'] = awys[i].getAttribute('b');

        var id = awys[i].getAttribute('awy_id');
        var awy = new FGNavAirway(this.fgmap, id, awy_hash);
        this.result_box_result_add(awy);
    }
};


FGMapMenuNav.prototype.nav_form_xml_request_cb = function() {

    if(!this.xml_request)
        return;

    if(this.xml_request.readyState == 4) {

        var xmldoc = this.xml_request.responseXML;

        if(xmldoc == null || xmldoc.documentElement == null) {
            return;
        }

        var err = xmldoc.documentElement.getAttribute("err");

        if(err)
        {
            this.result_box_msg_set(err);
            this.sbutton_enabled_set(true);
            this.cbutton_enabled_set(true);
            this.xml_request = null;
            return;
        }

        var debug = xmldoc.documentElement.getAttribute("debug");

        if(debug != "") {
            dprint(this.fgmap, debug);
        }

        var result_cnt = xmldoc.documentElement.getAttribute("cnt");

        if(result_cnt == 0) {
            this.result_box_msg_set("No result found");
            this.sbutton_enabled_set(true);
            this.cbutton_enabled_set(true);
            this.xml_request = null;
            this.bounds = null;
            return;
        }

        this.result_box_result_clear();

        this.nav_apt_parse(xmldoc);
        this.nav_radio_parse(xmldoc);
        this.nav_fix_parse(xmldoc);
        this.nav_awy_parse(xmldoc);

        // Make sure it's at the top
        this.result_box.scrollTop = 0;

        this.sbutton_enabled_set(true);
        this.cbutton_enabled_set(true);
        this.bounds = null;
        this.xml_request = null;

    } else if(this.xml_request.readyState > 4) {
        this.result_box_msg_set("Error occured, please try again");
        this.sbutton_enabled_set(true);
        this.cbutton_enabled_set(true);
        this.bounds = null;
        this.xml_request = null;

    }
};


FGMapMenuNav.prototype.remove = function() {
    this.tabdiv.tab_remove("nav");
};


FGMapMenuNav.prototype.onfocus = function() {
    /* Focus the lookup textbox when someone switches to this tab */
    this.nav_lookup.focus();
};


FGMapMenuNav.prototype.result_box_result_clear = function() {
    this.result_box.innerHTML = "";
    this.result_cnt = 0;
};


FGMapMenuNav.prototype.result_box_msg_set = function(msg) {

    msg = msg || "";

    this.result_box.innerHTML = "";

    var center = element_create(this.result_box, "center");
    element_create(center, "br");
    element_create(center, "br");
    element_text_append(center, msg);
    return true;
};


FGMapMenuNav.prototype.result_box_result_add = function(nav) {

    /*
    var hash = code + ":" + lat + ":" + lng;
    */

    if(!(nav instanceof FGNav)) {
        return false;
    }

    var table, tbody, tr, td;

    if(this.result_cnt == 0) {
        table = element_create(this.result_box, "table");
        table.border = 0;
        table.cellPadding = 2;
        table.cellSpacing = 0;
        table.width = "92%";
        table.style.width = "92%";
        table.style.margin = "0px";
        table.style.padding = "0px";
        table.style.cursor = "pointer";
        this.result_tbody = tbody = element_create(table, "tbody");
    } else {
        tbody = this.result_tbody;
    }

    tr = element_create(tbody, "tr");
    tr.style.width = "100%";
    attach_event(tr, "click",
        this.result_click_cb.bind_event(this, tr, nav));
    attach_event(tr, "mouseover",
        this.result_mouseover_cb.bind_event(this, tr, nav));
    attach_event(tr, "mouseout",
        this.result_mouseout_cb.bind_event(this, tr, nav));

    var classname = FGMAP_NAV_INFO_CLASSES[nav.type];

    td = element_create(tr, "td");
    td.innerHTML = FGMAP_NAVAID_NAMES[nav.type];
    td.className = classname;

    td = element_create(tr, "td");
    td.innerHTML = nav.code;
    td.className = classname;

    td = element_create(tr, "td");
    td.innerHTML = nav.name;
    td.className = classname;

    this.result_cnt += 1;

    if(this.bounds) {
        if(this.fgmap.nav_add(nav) == true) {
            /* In view lookup, show it straight away if we have that type
             * checked */
            if(this.toggles[nav_type_generalize(nav.type)].checked) {
                this.fgmap.nav_visible_set(nav.id, true);
            }
        }
    }

    return true;
};


FGMapMenuNav.prototype.result_mouseover_cb = function(e, tr, nav) {
    tr.className = "fgmap_nav_result_hover";
};


FGMapMenuNav.prototype.result_mouseout_cb = function(e, tr, nav) {
    tr.className = "fgmap_nav_result_normal";
};


FGMapMenuNav.prototype.result_click_cb = function(e, tr, nav) {
    if(nav) {
        if(this.fgmap.nav_add(nav) == true) {

            /* Turn the corresponding toggle checkbox on for the user */
            this.toggles[nav_type_generalize(nav.type)].checked = true;

            this.fgmap.nav_panto(nav.id);
            this.fgmap.nav_visible_set(nav.id, true);

            /* Raise it, too */
            /* TODO: This doesn't work sometimes, very odd */
            nav.raise();
        }
    }
};


FGMapMenuNav.prototype.nav_clearall_mouse_cb = function(e) {

    e = e || window.event;
    var target = target_get(e);

    if(e.type == "mouseup") {
        target.src = "images/trash.gif";
        this.fgmap.nav_clear();
        this.result_box_result_clear();
        this.sbutton_enabled_set(true);
        this.cbutton_enabled_set(true);
    } else if(e.type == "mouseout") {
        target.src = "images/trash.gif";
    } else if(e.type == "mousedown") {
        target.src = "images/trash-pressed.gif";
    }
};


FGMapMenuNav.prototype.nav_inview_mouse_cb = function(e) {

    e = e || window.event;
    var target = target_get(e);

    if(e.type == "mouseup") {
        target.src = "images/inview.gif";
            
        if(this.fgmap.gmap.getZoom() > FGMAP_NAV_INVIEW_ZOOM_MAX) {
            this.bounds = this.fgmap.gmap.getBounds();
            this.nav_form_submit_cb();
        } else {
            this.result_box_msg_set("Zoom level too low, try zooming in a bit.");
        }
    } else if(e.type == "mouseout") {
        target.src = "images/inview.gif";
    } else if(e.type == "mousedown") {
        target.src = "images/inview-pressed.gif";
    }
};


FGMapMenuNav.prototype.nav_search_mouse_cb = function(e) {

    e = e || window.event;
    var target = target_get(e);

    if(e.type == "mouseup") {
        target.src = "images/search.gif";
        this.nav_form_submit_cb();
    } else if(e.type == "mouseout") {
        target.src = "images/search.gif";
    } else if(e.type == "mousedown") {
        target.src = "images/search-pressed.gif";
    }
};


/* TODO
FGMapMenuNav.prototype.gmap_zoomend_cb = function(oldLevel, newLevel) {
    this.cbutton.disabled = !(newLevel > FGMAP_NAV_INVIEW_ZOOM_MAX);
};
*/


/* vim: set sw=4 sts=4 expandtab: */
