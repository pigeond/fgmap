/*
 * Server tab
 *
 * Pigeon <pigeon at pigeond dot net>
 * All rights reserved, 2006.
 */

function FGMapMenuServer(fgmapmenu) {
    this.fgmapmenu = fgmapmenu;
    this.fgmap = fgmapmenu.fgmap;
    this.setup();
}


FGMapMenuServer.prototype.setup = function() {

    var elem = element_create(null, "div");
    elem.style.textAlign = "center";
    elem.style.width = "100%";
    elem.style.height = "100%";
    elem.style.paddingTop = "8px";

    var ul = element_create(elem, "ul");
    ul.style.width = "90%";
    ul.style.listStyle = "none inside none";
    ul.style.margin = "0px auto";
    ul.style.padding = "0px"

    var li;
    
    li = element_create(ul, "li");
    li.style.verticalAlign = "middle";
    li.style.whiteSpace = "nowrap";
    li.style.paddingTop = "6px";
    li.style.paddingBottom = "6px";
    li.className = "fgmap_field_label";

    element_text_append(li, "Server: ");

    var select = this.select = element_create(li, "select");
    select.className = "fgmap_menu";
    select.size = 1;

    attach_event(select, "change",
                    this.server_select_changed_cb.bind_event(this));

    li = element_clone(li, false);
    element_attach(li, ul);

    var checkbox = this.update_checkbox =
        element_create(li, "input", "checkbox");
    checkbox.className = "fgmap_menu";
    if(this.fgmap.update) {
        checkbox.checked = true;
        checkbox.defaultChecked = true;
    }

    attach_event(checkbox, "click", this.update_checkbox_cb.bind_event(this));


    var label;
    
    label = element_create(li, "span");
    label.className = "fgmap_field_label";
    label.innerHTML = "&nbsp;Update&nbsp;";


    //element_create(elem, "br");

    label = element_create(li, "span");
    label.className = "fgmap_field_label";
    label.innerHTML = "every&nbsp;";

    var textfield = this.update_interval = element_create(li, "input", "text");
    textfield.className = "fgmap_menu";
    textfield.size = 3;
    textfield.maxLength = 3;
    textfield.style.textAlign = "right";
    textfield.value = this.fgmap.update_interval / 1000;

    attach_event(textfield, "change",
        this.update_interval_change_cb.bind_event(this));

    label = element_create(li, "span");
    label.className = "fgmap_field_label";
    label.innerHTML = "&nbsp;secs";

    this.fgmapmenu.tab_add("server", "server", elem, this);

    this.server_added_cb();

    this.fgmap.event_callback_add(FGMAP_EVENT_SERVER_ADDED,
        this.server_added_cb.bind_event(this), null);
    this.fgmap.event_callback_add(FGMAP_EVENT_SERVER_CHANGED,
        this.server_changed_cb.bind_event(this), null);
};


FGMapMenuServer.prototype.update = function() {

    // Clear the list
    //this.select.length = 0;

    // Clear all options and optgroups
    this.select.innerHTML = "";

    var current_host = null;
    var current_port = null;

    if(this.fgmap.fg_server_current) {
        current_host = this.fgmap.fg_server_current.host;
        current_port = this.fgmap.fg_server_current.port;
    }

    var group = null;
    var optgroup = null;

    for(var name in this.fgmap.fg_servers) {

        var fg_server = this.fgmap.fg_servers[name];

        if(group != fg_server.group) {
            group = fg_server.group;
            optgroup = element_create(this.select, "optgroup");
            optgroup.label = group;
            optgroup.text = group;
        }

        var option = element_create((optgroup ? optgroup : this.select),
            "option");

        if(fg_server.longname == null) {
            option.text = fg_server.name;
        } else {
            option.text = fg_server.longname;
        }

        option.server_name = fg_server.name;

        if(fg_server.host == null || fg_server.port == 0) {
            option.value = "";
        } else {

            option.value = fg_server.host + ":" + fg_server.port;

            if((current_host != null) &&
                (current_host == fg_server.host) &&
                (current_port == fg_server.port)) {
                option.selected = true;
            }

        }
    }
};



FGMapMenuServer.prototype.server_select_changed_cb = function(e) {

    var sindex = this.select.selectedIndex;

    if(sindex == -1) {
        return;
    }

    this.server_select_changed = true;

    var selected = this.select.options[sindex];
    //this.fgmap.server_set(selected.text);
    this.fgmap.server_set(selected.server_name);
};


FGMapMenuServer.prototype.update_interval_change_cb = function(e) {
    var textfield = target_get((e || window.event));
    this.fgmap.map_update_interval_set(textfield.value);
};


FGMapMenuServer.prototype.update_checkbox_cb = function(e) {
    var checkbox = target_get((e || window.event));
    this.fgmap.server_update_set(checkbox.checked);
};


FGMapMenuServer.prototype.server_added_cb = function(event,
                                                    cb_data,
                                                    name, longname, host, port) {
    this.update();
};

FGMapMenuServer.prototype.server_changed_cb = function(event, name) {
    if(this.server_select_changed) {
        this.server_select_changed = false;
        return;
    }
    this.update();
};

