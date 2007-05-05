/*
 * Settings menu
 *
 * Pigeon <pigeon at pigeond dot net>
 *
 * GPLv2, see LICENSE file for details
 */

function FGMapMenuSettings(fgmap, tabdiv) {
    this.fgmap = fgmap;
    this.tabdiv = tabdiv;
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
    option.text = "off";
    option.value = FGMAP_PILOT_INFO_OFF;
    if(this.fgmap.info_type == FGMAP_PILOT_INFO_OFF) {
        option.selected = true;
    }

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


    // Icon mode
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);

    element_text_append(li, "Aircraft icon mode");
    li.className = "fgmap_field_label";
    element_create(li, "br");

    element_text_append(li, "\u00a0\u00a0\u00a0");

    var select = this.info_select = element_create(li, "select");
    select.className = "fgmap_menu";
    select.size = 1;
    attach_event(select, "change",
                    this.aircraft_icon_mode_changed_cb.bind_event(this));

    var option;
    option = element_create(select, "option");
    option.text = "normal";
    option.value = FGMAP_ICON_MODE_NORMAL;
    if(this.fgmap.aircraft_icon_mode == FGMAP_ICON_MODE_NORMAL) {
        option.selected = true;
    }

    option = element_create(select, "option");
    option.text = "photo (if available)";
    option.value = FGMAP_ICON_MODE_PHOTO;
    if(this.fgmap.aircraft_icon_mode == FGMAP_ICON_MODE_PHOTO) {
        option.selected = true;
    }

    option = element_create(select, "option");
    option.text = "dot";
    option.value = FGMAP_ICON_MODE_DOT;
    if(this.fgmap.aircraft_icon_mode == FGMAP_ICON_MODE_DOT) {
        option.selected = true;
    }



    var span;
    var base_span;

    base_span = element_create(null, 'span');
    base_span.style.cursor = 'pointer';


    // Debug
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);

    span = element_clone(base_span);
    element_attach(span, li);

    this.debug_checkbox = checkbox = element_create(span, "input", "checkbox");
    //checkbox.className = "fgmap_menu";
    checkbox.style.cursor = 'pointer';
    if(this.fgmap.debug) {
        checkbox.checked = true;
        checkbox.defaultChecked = true;
        this.debug_show(true);
    }
    element_text_append(span, "\u00a0");
    element_text_append(span, "Debug");
    attach_event(checkbox, "click", this.debug_checkbox_cb.bind_event(this));
    attach_event(span, "click",
            this.debug_checkbox_cb.bind_event(this, checkbox));



    // Pilot trail
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);

    span = element_clone(base_span);
    element_attach(span, li);

    this.trail_checkbox = checkbox = element_create(span, "input", "checkbox");
    //checkbox.className = "fgmap_menu";
    checkbox.style.cursor = 'pointer';
    if(this.trail_visible) {
        checkbox.checked = true;
        checkbox.defaultChecked = true;
    }
    element_text_append(span, "\u00a0");
    element_text_append(span, "Pilot trails");
    attach_event(checkbox, "click", this.trail_checkbox_cb.bind_event(this));
    attach_event(span, "click", this.trail_checkbox_cb.bind_event(this, checkbox));



    // Placeholder
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);
    element_text_append(li, "\u00a0");


    // Zoom all
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);

    span = element_clone(base_span);
    element_attach(span, li);

    this.debug_checkbox = checkbox = element_create(span, "input", "checkbox");
    //checkbox.className = "fgmap_menu";
    checkbox.style.cursor = 'pointer';
    if(this.fgmap.pantoall) {
        checkbox.checked = true;
        checkbox.defaultChecked = true;
        this.debug_show(true);
    }
    element_text_append(span, "\u00a0");
    element_text_append(span, "Zoom/Pan to all pilots");
    attach_event(checkbox, "click", this.pantoall_checkbox_cb.bind_event(this));
    attach_event(span, "click",
            this.pantoall_checkbox_cb.bind_event(this, checkbox));


    // Placeholder
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);
    element_text_append(li, "\u00a0");


    // Always center
    li = element_clone(li, false);
    li.className = "fgmap_field_label";
    element_attach(li, ul);

    span = element_clone(base_span);
    element_attach(span, li);

    this.debug_checkbox = checkbox = element_create(span, "input", "checkbox");
    //checkbox.className = "fgmap_menu";
    checkbox.style.cursor = 'pointer';
    if(this.fgmap.follow_always_center) {
        checkbox.checked = true;
        checkbox.defaultChecked = true;
    }
    element_text_append(span, "\u00a0");
    element_text_append(span, "Always center follows");
    attach_event(checkbox, "click",
            this.follows_always_center_checkbox_cb.bind_event(this));
    attach_event(span, "click",
            this.follows_always_center_checkbox_cb.bind_event(this, checkbox));


    this.tabdiv.tab_add("settings", "settings", elem, this);
};


FGMapMenuSettings.prototype.info_type_changed_cb = function(e) {
    var target = target_get(e || window.event);
    this.fgmap.info_type_set(target.value);
};


FGMapMenuSettings.prototype.aircraft_icon_mode_changed_cb = function(e) {
    var target = target_get(e || window.event);
    this.fgmap.aircraft_icon_mode_set(target.value);
};


FGMapMenuSettings.prototype.trail_checkbox_cb = function(e, chkbox) {

    var target = target_get(e || window.event);
    var checked;

    if(target == chkbox) {
        return;
    }

    if(chkbox) {
        chkbox.checked = !chkbox.checked;
        checked = chkbox.checked;
    } else {
        checked = target.checked;
    }

    this.fgmap.trail_visible_set(checked);
};


FGMapMenuSettings.prototype.debug_show = function(bool) {

    this.fgmap.debug_set(bool)

    if(bool) {

        if(this.fgmap.debug_elem == null &&
            typeof(FGMapMenuDebug) == "function") {

            new FGMapMenuDebug(this.fgmap, this.tabdiv);
        }

    } else {

        var debug = this.tabdiv.tab_data_get("debug");

        if(debug) {
            debug.remove();
        }
    }

};


FGMapMenuSettings.prototype.debug_checkbox_cb = function(e, chkbox) {
    var target = target_get(e || window.event);
    var checked;

    if(target == chkbox) {
        return;
    }

    if(chkbox) {
        chkbox.checked = !chkbox.checked;
        checked = chkbox.checked;
    } else {
        checked = target.checked;
    }

    this.debug_show(checked);
};


FGMapMenuSettings.prototype.pantoall_checkbox_cb = function(e, chkbox) {
    var target = target_get(e || window.event);
    var checked;

    if(target == chkbox) {
        return;
    }

    if(chkbox) {
        chkbox.checked = !chkbox.checked;
        checked = chkbox.checked;
    } else {
        checked = target.checked;
    }

    this.fgmap.pantoall_set(checked);
};


FGMapMenuSettings.prototype.follows_always_center_checkbox_cb = function(e, chkbox) {
    var target = target_get(e || window.event);
    var checked;

    if(target == chkbox) {
        return;
    }

    if(chkbox) {
        chkbox.checked = !chkbox.checked;
        checked = chkbox.checked;
    } else {
        checked = target.checked;
    }

    this.fgmap.follows_always_center_set(checked);
};


/* vim: set sw=4 sts=4 expandtab: */
