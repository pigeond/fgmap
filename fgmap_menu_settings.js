/*
 * Settings menu
 */

function FGMapMenuSettings(fgmapmenu) {
    this.fgmapmenu = fgmapmenu;
    this.fgmap = fgmapmenu.fgmap;
    this.setup();
}

FGMapMenuSettings.prototype.setup = function() {

    var elem = element_create(null, "div");
    elem.style.width = "100%";
    elem.style.height = "100%";

    var ul = element_create(elem, "ul");
    ul.style.width = "90%";
    ul.style.listStyle = "none inside none";
    ul.style.margin = "0px auto";
    ul.style.padding = "0px"

    var li, checkbox;
    
    li = element_create(ul, "li");
    li.style.width = "48%";
    li.style.cssFloat = "left";
    li.style.styleFloat = "left";
    li.style.verticalAlign = "middle";
    li.style.whiteSpace = "nowrap";
    //li.style.paddingLeft = "4px";
    li.style.paddingTop = "6px";
    li.style.paddingBottom = "6px";


    // Pilot label
    element_text_append(li, "Pilot label");
    li.className = "fgmap_field_label";
    element_create(li, "br");

    element_text_append(li, "\u00a0\u00a0\u00a0");

    var select = this.info_select = element_create(li, "select");
    select.className = "fgmap_menu";
    select.size = 1;
    attach_event(select, "change",
                    this.info_type_changed_cb.bind_event(this));

    var option;
    option = element_create(select, "option");
    option.text = "always";
    option.value = FGMAP_PILOT_INFO_ALWAYS;
    if(this.fgmap.info_type == FGMAP_PILOT_INFO_ALWAYS) {
        option.selected = true;
    }

    option = element_create(select, "option");
    option.text = "follow always";
    option.value = FGMAP_PILOT_INFO_FOLLOWS;
    if(this.fgmap.info_type == FGMAP_PILOT_INFO_FOLLOWS) {
        option.selected = true;
    }

    option = element_create(select, "option");
    option.text = "mouse over only";
    option.value = FGMAP_PILOT_INFO_MOUSEOVER;
    if(this.fgmap.info_type == FGMAP_PILOT_INFO_MOUSEOVER) {
        option.selected = true;
    }


    // Pilot trail
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);
    this.trail_checkbox = checkbox = element_create(li, "input", "checkbox");
    checkbox.className = "fgmap_menu";
    if(this.trail_visible) {
        checkbox.checked = true;
        if(USER_AGENT.is_ie) {
            checkbox.mychecked = true;
        }
    }
    element_text_append(li, "\u00a0");
    element_text_append(li, "Pilot trails");
    attach_event(checkbox, "click", this.trail_checkbox_cb.bind_event(this));


    // Model icon
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);
    this.model_icon_checkbox = checkbox =
        element_create(li, "input", "checkbox");
    checkbox.className = "fgmap_menu";
    if(this.fgmap.model_icon) {
        checkbox.checked = true;
        if(USER_AGENT.is_ie) {
            checkbox.mychecked = true;
        }
    }
    element_text_append(li, "\u00a0");
    element_text_append(li, "Model icon");
    attach_event(checkbox, "click",
        this.model_icon_checkbox_cb.bind_event(this));



    // Debug
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);
    this.debug_checkbox = checkbox = element_create(li, "input", "checkbox");
    checkbox.className = "fgmap_menu";
    if(this.fgmap.debug) {
        checkbox.checked = true;
        if(USER_AGENT.is_ie) {
            checkbox.mychecked = true;
        }
        this.debug_show(true);
    }
    element_text_append(li, "\u00a0");
    element_text_append(li, "Debug");
    attach_event(checkbox, "click", this.debug_checkbox_cb.bind_event(this));


    // Zoom all
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);
    this.debug_checkbox = checkbox = element_create(li, "input", "checkbox");
    checkbox.className = "fgmap_menu";
    if(this.fgmap.pantoall) {
        checkbox.checked = true;
        if(USER_AGENT.is_ie) {
            checkbox.mychecked = true;
        }
        this.debug_show(true);
    }
    element_text_append(li, "\u00a0");
    element_text_append(li, "Zoom/Pan to all pilots");
    attach_event(checkbox, "click", this.pantoall_checkbox_cb.bind_event(this));


    this.fgmapmenu.tab_add("settings", "settings", elem, this);
};


FGMapMenuSettings.prototype.info_type_changed_cb = function(e) {
    var target = target_get(e || window.event);
    this.fgmap.info_type_set(target.value);
};


FGMapMenuSettings.prototype.trail_checkbox_cb = function(e) {
    var target = target_get(e || window.event);
    this.fgmap.trail_visible_set(target.checked);
};


FGMapMenuSettings.prototype.debug_show = function(bool) {

    this.fgmap.debug_set(bool)

    if(bool) {

        if(this.fgmap.debug_elem == null &&
            typeof(FGMapMenuDebug) == "function") {

            new FGMapMenuDebug(this.fgmapmenu);
        }

    } else {

        var debug = this.fgmapmenu.tab_data_get("debug");

        if(debug) {
            debug.remove();
        }
    }

};


FGMapMenuSettings.prototype.debug_checkbox_cb = function(e) {
    var target = target_get(e || window.event);
    this.debug_show(target.checked);
};


FGMapMenuSettings.prototype.pantoall_checkbox_cb = function(e) {
    var target = target_get(e || window.event);
    this.fgmap.pantoall_set(target.checked);
};


FGMapMenuSettings.prototype.model_icon_checkbox_cb = function(e) {
    this.fgmap.model_icon = (target_get(e || window.event)).checked;
    for(var p in this.fgmap.pilots) {
        // TODO
        this.fgmap.pilots[p].marker_update(true);
    }
};


