/*
 * Nav menu
 */


function FGMapMenuNav(fgmapmenu) {
    this.fgmapmenu = fgmapmenu;
    this.fgmap = fgmapmenu.fgmap;
    this.setup();
}

FGMapMenuNav.prototype.setup = function() {

    var elem = this.div = element_create(null, "div");
    elem.style.className = "fgmap_nav";
    elem.style.overflow = "hidden";
    elem.style.width = "95%";
    elem.style.height = "95%";
    elem.style.padding = "0px";
    elem.style.margin = "0px auto";

    var ul = element_create(elem, "ul");
    ul.style.width = "90%";
    ul.style.listStyle = "none inside none";
    ul.style.margin = "0px auto";
    ul.style.padding = "0px"

    var li;
    
    li = element_create(ul, "li");
    li.style.width = "48%";
    li.style.cssFloat = "left";
    li.style.styleFloat = "left";
    li.style.verticalAlign = "middle";
    li.style.whiteSpace = "nowrap";
    //li.style.paddingLeft = "4px";
    li.style.paddingTop = "6px";
    li.style.paddingBottom = "6px";


    // Lookup
    element_text_append(li, "Navaids lookup:");
    element_text_append(li, "\u00a0\u00a0\u00a0");

    var form = this.nav_form = element_create(li, "form");
    form.style.display = "inline";
    form.action = "";
    form.method = "";

    attach_event(form, "submit",
        this.nav_form_submit_cb.bind_event(this));
    form.onsubmit = this.nav_form_submit_cb.bind_event(this);


    var input = this.nav_lookup =
        element_create(this.nav_form, "input", "text");

    input.size = 20;
    input.maxLength = 20;
    input.className = "fgmap_menu";
    input.value = "";
    input.title = "search by navaids id (airport, vor, fix)";

    element_text_append(this.nav_form, " ");

    var but = this.nav_sbutton =
        element_create(this.nav_form, "input", "button");
    but.className = "fgmap_menu";
    but.onclick = this.nav_form_submit_cb.bind_event(this);
    this.nav_sbutton_enabled_set(true);

    this.fgmapmenu.tab_add("nav", "nav", elem, this);

};


FGMapMenuNav.prototype.nav_sbutton_enabled_set = function(enabled) {
    this.nav_sbutton.disabled = !enabled;
    if(enabled) {
        this.nav_sbutton.value = "search";
    } else {
        this.nav_sbutton.value = " wait ";
    }
};


FGMapMenuNav.prototype.nav_form_submit_cb = function(e) {

    if(this.nav_lookup.value != "") {

        var url = "fg_nav_xml.cgi?apt&sstr=" + this.nav_lookup.value;

        if(this.xml_request) {
            this.xml_request.abort();
        }

        this.xml_request = GXmlHttp.create();
        this.xml_request.open("GET", url, true);
        this.xml_request.onreadystatechange =
            this.xml_request_cb.bind_event(this);
        this.xml_request.send(null);
        
        this.nav_sbutton_enabled_set(false);
    }

    return false;
};


FGMapMenuNav.prototype.xml_request_cb = function() {
    if(!this.xml_request)
        return;

    if(this.xml_request.readyState == 4) {

        var xmldoc = this.xml_request.responseXML;

        if(xmldoc == null || xmldoc.documentElement == null) {
            return;
        }

        var apts = xmldoc.documentElement.getElementsByTagName("airport");

        for(var i = 0; i < apts.length; i++) {

            var code = apts[i].getAttribute("code");
            var name = apts[i].getAttribute("name");
            var elevation = apts[i].getAttribute("elevation");

            var runways = apts[i].getElementsByTagName("runway");

            for(var r = 0; r < runways.length; r++) {
                var num = runways[r].getAttribute("num");
                var lat = parseFloat(runways[r].getAttribute("lat"));
                var lng = parseFloat(runways[r].getAttribute("lng"));
                var heading = parseFloat(runways[r].getAttribute("heading"));
                var length = parseFloat(runways[r].getAttribute("length"));
                var width = parseFloat(runways[r].getAttribute("width"));

                var apt = new FGAirport(this.fgmap,
                                        code, name, elevation, false);
                apt.runway_add(num, lat, lng, heading, length, width);
                apt.visible_set(true);
            }
        }

        this.nav_sbutton_enabled_set(true);

    } else if(this.xml_request.readyState > 4) {
        this.nav_sbutton_enabled_set(true);
    }
};

FGMapMenuNav.prototype.remove = function() {
    this.fgmapmenu.tab_remove("nav");
};

