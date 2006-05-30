/*
 * Nav menu
 */


var FGMAP_NAV_INVIEW_ZOOM_MAX = 10;


function FGMapMenuNav(fgmapmenu) {
    this.fgmapmenu = fgmapmenu;
    this.fgmap = fgmapmenu.fgmap;
    this.result_cnt = 0;
    this.setup();
    this.bounds = null;
}

FGMapMenuNav.prototype.setup = function() {

    var elem = this.div = element_create(null, "div");
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
    input.title = "search by navaids id (airport, vor, fix)";

    element_text_append(this.nav_form, "\u00a0\u00a0");

    var but;
    
    /* search button */
    but = this.sbutton =
        element_create(this.nav_form, "input", "button");
    but.className = "fgmap_menu";
    but.title = "search by navaids id (airport, vor, fix)";
    attach_event(but, "click", this.nav_form_submit_cb.bind_event(this));
    this.sbutton_enabled_set(true);

    element_text_append(this.nav_form, "\u00a0\u00a0");

    /* Show all in current view button */
    but = this.cbutton =
        element_create(this.nav_form, "input", "button");
    but.className = "fgmap_menu";
    but.title = "Show all navaids in current view (high zoom level only)";
    attach_event(but, "click", this.nav_cbutton_onclick_cb.bind_event(this));
    this.cbutton_enabled_set(true);

    element_create(this.nav_form, "br");

    var chbx;
    var base_chbx = element_create(null, "input", "checkbox");
    base_chbx.style.verticalAlign = "middle";
    base_chbx.checked = false;

    this.aptname_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.mychecked = true;
    element_attach(chbx, this.nav_form);
    element_text_append(this.nav_form, "apt name");
    element_text_append(this.nav_form, "\u00a0\u00a0");

    this.aptcode_chbx = chbx = element_clone(base_chbx);
    chbx.checked = true;
    chbx.mychecked = true;
    element_attach(chbx, this.nav_form);
    element_text_append(this.nav_form, "apt code");
    element_text_append(this.nav_form, "\u00a0\u00a0");

    this.vor_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, this.nav_form);
    element_text_append(this.nav_form, "vor");
    element_text_append(this.nav_form, "\u00a0\u00a0");

    this.ndb_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, this.nav_form);
    element_text_append(this.nav_form, "ndb");
    element_text_append(this.nav_form, "\u00a0\u00a0");

    this.fix_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, this.nav_form);
    element_text_append(this.nav_form, "fix");
    element_text_append(this.nav_form, "\u00a0\u00a0");

    this.awy_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, this.nav_form);
    element_text_append(this.nav_form, "airway");
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
    result_box.style.verticalAlign = "top";

    var panel = this.panel = element_create(box, "div");
    panel.style.position = "absolute";
    panel.style.overflow = "hidden";
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
    base_chbx.mychecked = true;

    li = element_clone(base_li, false);
    element_attach(li, ul);
    this.apt_show_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, li);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    element_text_append(li, "apt");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    this.vor_show_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, li);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    element_text_append(li, "vor");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    this.ndb_show_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, li);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    element_text_append(li, "ndb");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    this.fix_show_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, li);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    element_text_append(li, "fix");

    li = element_clone(base_li, false);
    element_attach(li, ul);
    this.awy_show_chbx = chbx = element_clone(base_chbx);
    element_attach(chbx, li);
    attach_event(chbx, "click", this.toggle_click_cb.bind_event(this));
    element_text_append(li, "awy");

    GEvent.addListener(this.fgmap.gmap, "zoomend",
        this.gmap_zoomend_cb.bind_event(this));

    this.gmap_zoomend_cb(-1, this.fgmap.gmap.getZoom());

    this.fgmapmenu.tab_add("nav", "nav", elem, this);

};



FGMapMenuNav.prototype.toggle_click_cb = function() {

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

    if(this.nav_lookup.value == "" && this.bounds == null) {
        return false;
    }

    if(this.xml_request) {
        //this.xml_request.abort();
        return false;
    }

    var url = "fg_nav_xml.cgi?";
    
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

        var apt = new FGAirport(this.fgmap,
            apt_id, apt_code, apt_name, apt_elevation, /* TODO */ false);

        /* Runways */
        var runways = apts[i].getElementsByTagName("runway");

        for(var r = 0; r < runways.length; r++) {
            var r_num = runways[r].getAttribute("num");
            var r_lat = parseFloat(runways[r].getAttribute("lat"));
            var r_lng = parseFloat(runways[r].getAttribute("lng"));
            var r_heading = parseFloat(runways[r].getAttribute("heading"));
            var r_length = parseFloat(runways[r].getAttribute("length"));
            var r_width = parseFloat(runways[r].getAttribute("width"));
            apt.runway_add(r_num,
                r_lat, r_lng, r_heading, r_length, r_width);

            /* ILS */
            var ilss = runways[r].getElementsByTagName("ils");

            if(ilss.length > 0) {
                var ils = ilss[0];
                var ils_type = ils.getAttribute("type");
                var ils_lat = ils.getAttribute("lat");
                var ils_lng = ils.getAttribute("lng");
                var ils_elevation = ils.getAttribute("elevation");
                var ils_freq = ils.getAttribute("freq");
                var ils_range = ils.getAttribute("range");
                var ils_multi = ils.getAttribute("multi");
                var ils_ident = ils.getAttribute("ident");
                var ils_name = ils.getAttribute("name");

                if(apt.ils_add(r_num, ils_type, ils_lat, ils_lng,
                                ils_elevation, ils_freq, ils_range,
                                ils_multi, ils_ident, ils_name) == false) {

                    /* TODO */
                    dprint(this.fgmap, "ILS add failed for apt[" + apt_code + "] runway[" + num + "] ils[" + ident + "]");
                }
            }

            /* TODO: GS/IM/MM/OM */
        }
        
        /* ATC */
        var atcs = apts[i].getElementsByTagName("atc");

        for(var a = 0; a < atcs.length; a++) {
            var atc_type = atcs[a].getAttribute("atc_type");
            var freq = atcs[a].getAttribute("freq");
            var name = atcs[a].getAttribute("name");
            apt.atc_add(atc_type, freq, name);
        }

        this.result_box_result_add(apt);

    }

};


/* This includes VOR and NDB */
FGMapMenuNav.prototype.nav_vor_parse = function(xmldoc) {

    var i;
    var id;
    var lat, lng, elevation, freq, range, multi, ident, name;

    var vors = xmldoc.documentElement.getElementsByTagName("vor");
    var vor, ndb;

    for(i = 0; i < vors.length; i++) {
        lat = vors[i].getAttribute('lat');
        lng = vors[i].getAttribute('lng');
        elevation = vors[i].getAttribute('elevation');
        freq = vors[i].getAttribute('freq');
        range = vors[i].getAttribute('range');
        multi = vors[i].getAttribute('multi');
        ident = vors[i].getAttribute('ident');
        name = vors[i].getAttribute('name');

        id = 'vor:' + ident + ':' + lat + ':' + lng;
        vor = new FGNavVor(this.fgmap, id, ident, name, lat, lng, freq);
        this.result_box_result_add(vor);
    }

    var ndbs = xmldoc.documentElement.getElementsByTagName("ndb");

    for(i = 0; i < ndbs.length; i++) {
        lat = ndbs[i].getAttribute('lat');
        lng = ndbs[i].getAttribute('lng');
        elevation = ndbs[i].getAttribute('elevation');
        freq = ndbs[i].getAttribute('freq');
        range = ndbs[i].getAttribute('range');
        multi = ndbs[i].getAttribute('multi');
        ident = ndbs[i].getAttribute('ident');
        name = ndbs[i].getAttribute('name');

        id = 'ndb:' + ident + ':' + lat + ':' + lng;
        ndb = new FGNavNdb(this.fgmap, id, ident, name, lat, lng, freq);
        this.result_box_result_add(ndb);
    }

};


FGMapMenuNav.prototype.nav_fix_parse = function(xmldoc) {

    var fixes = xmldoc.documentElement.getElementsByTagName("fix");
    var fix;

    for(i = 0; i < fixes.length; i++) {
        lat = fixes[i].getAttribute('lat');
        lng = fixes[i].getAttribute('lng');
        name = fixes[i].getAttribute('name');

        id = 'fix:' + name + ':' + lat + ':' + lng;
        fix = new FGNavFix(this.fgmap, id, name, lat, lng);
        this.result_box_result_add(fix);
    }

};


FGMapMenuNav.prototype.nav_awy_parse = function(xmldoc) {
    /* TODO */
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
            return;
        }

        var result_cnt = xmldoc.documentElement.getAttribute("cnt");

        if(result_cnt == 0) {
            this.result_box_msg_set("No result found");
            this.sbutton_enabled_set(true);
            this.cbutton_enabled_set(true);
            return;
        }

        this.result_box_result_clear();

        this.nav_apt_parse(xmldoc);
        this.nav_vor_parse(xmldoc);
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


FGMapMenuNav.prototype.nav_cbutton_onclick_cb = function() {
    this.bounds = this.fgmap.gmap.getBounds();
    this.nav_form_submit_cb();
};


FGMapMenuNav.prototype.remove = function() {
    this.fgmapmenu.tab_remove("nav");
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
        /* In view lookup, show it straight away */
        if(this.fgmap.nav_add(nav) == true) {
            this.fgmap.nav_visible_set(nav.id, true);
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
            this.fgmap.nav_panto(nav.id, nav);
            this.fgmap.nav_visible_set(nav.id, true);
        }
    }
};


FGMapMenuNav.prototype.gmap_zoomend_cb = function(oldLevel, newLevel) {
    this.cbutton.disabled = !(newLevel > FGMAP_NAV_INVIEW_ZOOM_MAX);
};

