
/**
 * @file
 * @brief FGMap - FlightGear server online map API.
 *
 * An extension on top of Google Map API.
 * Pigeon &lt;pigeon at pigeond dot net&gt;
 */

/*
 * Generate doxygen documentation via js2doxy.pl
 */

/**
 * FGMap events
 */

var event_cnt = 1;
/**
 * When a pilot joins the server.
 * @tparam String callsign          the callsign of the plot
 */
var FGMAP_EVENT_PILOT_JOIN = event_cnt++;

/**
 * When a pilot parts the server.
 * @tparam String callsign          the callsign of the plot
 */
var FGMAP_EVENT_PILOT_PART = event_cnt++;


/**
 * When an update of the map has finished.
 */
var FGMAP_EVENT_PILOTS_POS_UPDATE = event_cnt++;


/**
 * When server is added to the map.
 * @tparam String name              the name of the server added
 * @tparam String longname          the longname of the server added
 * @tparam String host              the host of the server added
 * @tparam Integer port             the port of the server added
 */
var FGMAP_EVENT_SERVER_ADDED = event_cnt++;

var FGMAP_EVENT_SERVER_REMOVED = event_cnt++;


/**
 * When the server is changed.
 * @tparam String name              the name of the server changed to
 */
var FGMAP_EVENT_SERVER_CHANGED = event_cnt++;

/**
 * When the map is being resized
 */
var FGMAP_EVENT_MAP_RESIZE = event_cnt++;


/**
 * When the map view has changed. Example: zoom in/out, pan, scroll, etc.
 */
var FGMAP_EVENT_MAP_VIEW_CHANGED = event_cnt++;


/**
 * When a pilot is panned/zoomed to.
 * @tparam String callsign          the callsign of the pilot
 */
var FGMAP_EVENT_PILOT_PAN = event_cnt++;


/**
 * When a pilot is added to the follow list.
 * @tparam String callsign          the callsign of the pilot
 */
var FGMAP_EVENT_PILOT_FOLLOW_ADD = event_cnt++;


/**
 * When a pilot is removed from the follow list.
 * @tparam String callsign          the callsign of the pilot
 */
var FGMAP_EVENT_PILOT_FOLLOW_REMOVE = event_cnt++;


/**
 * When the follow list has been cleared
 */
var FGMAP_EVENT_PILOT_FOLLOWS_CLEAR = event_cnt++;



/** FGMapPilotInfoType @see FGMap.info_type_set */
var FGMAP_PILOT_INFO_ALWAYS = 1;
/** FGMapPilotInfoType @see FGMap.info_type_set */
var FGMAP_PILOT_INFO_FOLLOWS = 2;
/** FGMapPilotInfoType @see FGMap.info_type_set */
var FGMAP_PILOT_INFO_MOUSEOVER = 3;


var FGMAP_PILOT_INFO_ZINDEX = 10;


var FGMAP_CRAFT_ICON_PREFIX = "images/aircraft_icons/";
var FGMAP_CRAFT_ICON_SUFFIX = ".png";
var FGMAP_CRAFT_ICON_ZINDEX = 5;


var FGMAP_CRAFT_ICON_GENERIC = "generic/fg_generic_craft"

var FGMAP_CRAFT_ICON_HELI = "heli/heli"
var FGMAP_CRAFT_MODELS_HELI = [ "bo105" ];

var FGMAP_CRAFT_ICON_SINGLEPROP = "singleprop/singleprop";
var FGMAP_CRAFT_MODELS_SINGLEPROP = [ "ov10", "c150", "c172p", "c172-dpm", "c182-dpm", "c310-dpm", "c310u3a", "dhc2floats", "pa28-161", "pc7", "j3cub" ];

var FGMAP_CRAFT_ICON_TWINPROP = "twinprop/twinprop";
var FGMAP_CRAFT_MODELS_TWINPROP = [ "Boeing314Clipper", "Lockheed1049_twa", "TU-114-model", "b1900d-anim", "b29-model", "beech99-model", "dc3-dpm", "fokker50" ];

var FGMAP_CRAFT_ICON_SMALLJET = "smalljet/smalljet";
var FGMAP_CRAFT_MODELS_SMALLJET = [ "Citation-II", "Bravo", "fokker100", "tu154B" ];

var FGMAP_CRAFT_ICON_HEAVYJET = "heavyjet/heavyjet";
var FGMAP_CRAFT_MODELS_HEAVYJET = [ "boeing733", "boeing747-400-jw", "a320-fb", "A380", "AN-225-model", "B-52F-model", "Concorde-ba", "FINNAIRmd11", "MD11", "KLMmd11" ];



// TODO
var pi_size = new GSize(40, 40);
var pi_anchor = new GPoint(20, 20);
var pi_heading_scale = 10;


/* Helper functions */

function deg_to_rad(deg) {
    return (deg * Math.PI / 180);
}


function rad_to_deg(rad) {
    return (rad * 180 / Math.PI);
}



// Handy functions for Array objects
Array.prototype.indexOf = function(item) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] == item) {
            return i;
        }
    }
    return -1;
};

Array.prototype.removeItem = function(item) {
    var i = this.indexOf(item);
    if(i == -1)
        return false;
    this.splice(i, 1);
    return true;
};



function str_to_pos(str) {
    if(typeof(str) == "string" && str.charAt(str.length - 1) == "%")
        return str;
    else if(typeof(str) == "number")
        return str + "px";
    else
        return str;
}


function opacity_style_str(opacity) {
    var style_str = "filter: alpha(opacity=" + (parseInt(opacity * 100)) + ");";
    style_str += " -moz-opacity: " + opacity + "; opacity: " + opacity + ";";
    return style_str;
}

function target_get(event) {
    return (event.target || event.srcElement);
}


function dprint(fgmap, str) {

    var elem;

    if(!fgmap || !fgmap.debug || !fgmap.debug_elem)
        return;

    elem = fgmap.debug_elem;

    var date = new Date();
    var mins = date.getMinutes();
    var secs = date.getSeconds();

    if(elem.tagName == "TEXTAREA") {
        elem.value = date.getHours() + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs + ": " + str + "\n" + elem.value;
    } else if(elem.tagName = "DIV") {
        elem.innerHTML += date.getHours() + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs + ": " + str + "<br>\n";
        elem.scrollTop = elem.scrollHeight - elem.clientHeight;
    }
}


// IE workaround, because M$ can never follow specs.
function img_ie_fix(elem) {
    if(elem && USER_AGENT.is_ie) {
        var src = elem.src;
        var w = elem.style.width || elem.offsetWidth;
        var h = elem.style.height || elem.offsetHeight;
        elem.src = "images/1x1.gif";
        elem.style.width = str_to_pos(w);
        elem.style.height = str_to_pos(h);
        elem.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale');";
    }
}


/*
 * Functions from
 * http://www.brockman.se/writing/method-references.html.utf8
 * pretty much. I've renamed function names/variables just to make it more
 * consistence with other things.
 */
function arr_concat() {
    var result = [];
    for(var i = 0; i < arguments.length; i++) {
        for(var j = 0; j < arguments[i].length; j++) {
            result.push(arguments[i][j]);
        }
    }
    return result;
}

function arr_remove_first(args) {
    result = [];
    for(var i = 1; i < args.length; i++) {
        result.push(args[i]);
    }
    return result;
}

function arr_cons(element, sequence) {
    return arr_concat([element], sequence);
}


/*
Function.prototype.bind_event = function(obj) {
    var func = this;
    var args = arr_remove_first(arguments);
    return function(event) {
        return func.apply(obj, arr_cons(event || window.event, args));
    };
};
*/


Function.prototype.bind_event = function(obj) {
    var func = this;
    var args = arr_remove_first(arguments);
    return function(event) {
        var args_arr = arr_cons((event || window.event), args);
        return func.apply(obj,
            arr_concat(args_arr, arr_remove_first(arguments)));
        //return func.apply(obj, arr_cons(event || window.event, args));
    };
};


/*
 * My own helper function for events 
 */
function attach_event(elem, event_str, bind_func) {
    if(elem.attachEvent) { 
        elem.attachEvent("on" + event_str, bind_func);
    } else if(elem.addEventListener) {
        elem.addEventListener(event_str, bind_func, false);
    }
}


/*
 * GMap additional function from Chris Smoak
 * @see http://groups.google.com/group/Google-Maps-API/tree/browse_frm/thread/4cedb228f3a86ea0/e48fa56dbd04c6f4?rnum=1&hl=en&_done=%2Fgroup%2FGoogle-Maps-API%2Fbrowse_frm%2Fthread%2F4cedb228f3a86ea0%2F%3F#doc_5643aa572b0e01ff
 */
GMap.prototype.centerAndZoomOnBounds = function(bounds) {

    var span = new GSize(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

    var center = new GPoint(bounds.minX + span.width / 2.,
                            bounds.minY + span.height / 2.);

    var newZoom = this.spec.getLowestZoomLevel(center, span, this.viewSize);

    // My own change here
    //if (this.getZoomLevel() != newZoom) {

    if (this.getZoomLevel() < newZoom) {
        this.centerAndZoom(center, newZoom);
    } else {
        this.recenterOrPanToLatLng(center);
    }
} 



// Browser stuff

var USER_AGENT = new Object();
var agent_str = navigator.userAgent.toLowerCase();

if((agent_str.indexOf("msie") != -1) && (agent_str.indexOf("opera") == -1)) {
    USER_AGENT.is_ie = true;
}
if(agent_str.indexOf("mozilla") != -1) {
    USER_AGENT.is_mozilla = true;
}
if(agent_str.indexOf("gecko") != -1) {
    USER_AGENT.is_gecko = true;
}
if(agent_str.indexOf("opera") != -1) {
    USER_AGENT.is_opera = true;
}



/* element ********************************************************************/
/* DOM helper functions for convenience */

function element_create(parent, tag, type) {
    var elem = document.createElement(tag);
    if(type) {
        elem.setAttribute("type", type);
    }
    if(parent) {
        parent.appendChild(elem);
    }

    if(tag == "div") {
        elem.style.display = "block";
    } else {
        elem.style.visibility = "visible";
    }
    return elem;
}


function element_attach(elem, parent) {
    parent.appendChild(elem);
}


function element_attach_before(elem, ref_elem, parent) {
    parent.insertBefore(elem, ref_elem);
}


function element_attach_after(elem, ref_elem, parent) {
    parent.insertBefore(elem, ref_elem.nextSibling);
}


function element_remove(elem) {
    if(elem.parentNode) {
        elem.parentNode.removeChild(elem);
    } else {
        // Err?
    }
}


function element_text_append(elem, text) {
    if(elem) {
        elem.appendChild(document.createTextNode(text));
    }
}


function element_show(elem) {
    if(elem.style.display == "none")
        elem.style.display = "block";
    if(elem.style.visibility == "hidden")
        elem.style.visibility = "visible";
}


function element_hide(elem) {
    if(elem.style.display == "block")
        elem.style.display = "none";
    if(elem.style.visibility == "visible")
        elem.style.visibility = "hidden";
}


function element_visible_toggle(elem) {
    if(elem.style.display == "block") {
        element_hide(elem);
    } else {
        element_show(elem);
    }
}


function element_opacity_set(elem, opacity) {
    if(USER_AGENT.is_ie) {
        elem.style["filter"] = "alpha(opacity=" + parseInt(opacity * 100) + ")";
        //elem.style.filters.alpha.opacity = parseInt(opacity * 100);
    }
    elem.style.MozOpacity = opacity;
    elem.style.opacity = opacity;
}


function element_clone(elem, deep) {
    return elem.cloneNode(deep);
}




/* gmap_element ***************************************************************/
/* Helper functions for creating/manipulating element within GMap */


function gmap_element(gmap, lnglat, align, child) {

    this.gmap = gmap;
    this.point = lnglat;
    this.align = align;

    this.elem = element_create(gmap.div, "div");
    this.elem.style.position = "absolute";
    this.elem.style.zIndex = 10; // FIXME

    GEvent.bind(gmap, "zoom", this, function() { this.update(); });
    GEvent.bind(gmap, "moveend", this, function() { this.update(); });

    this.update(lnglat, align);

    this.child_set(child);
}


gmap_element.prototype.child_set = function(child) {
    if(child) {
        this.child = child;
        this.elem.appendChild(child);
    }
};

gmap_element.prototype.update = function(lnglat, align) {

    if(lnglat)
        this.point = lnglat;

    if(align)
        this.align = align;

    var bc = this.gmap.spec.getBitmapCoordinate(this.point.y, this.point.x,
                                            this.gmap.getZoomLevel());
    var dc = this.gmap.getDivCoordinate(bc.x, bc.y);

    this.elem.style.left = str_to_pos(dc.x + this.align.x);
    this.elem.style.top = str_to_pos(dc.y + this.align.y);
};


gmap_element.prototype.show = function() {
    element_show(this.elem);
};


gmap_element.prototype.hide = function() {
    element_hide(this.elem);
};


gmap_element.prototype.remove = function() {
    element_remove(this.child);
    this.child = null;
    element_remove(this.elem);
    this.eleme = null;
    delete(this.point);
    this.point = null;
    delete(this.align);
    this.align = null;
};



/* Pilot class ***************************************************************/

/**
 * Create an FGMap pilot object.
 * @brief Pilot object
 * @ctor
 *
 * Create a pilot object.
 *
 * @tparam Object fgmap         The FGMap object which this pilot object
 *                              belongs to.
 * @tparam String callsign      The callsign of the pilot.
 * @tparam Float lng            The longitude of the pilot.
 * @tparam Float lat            The latitude of the pilot.
 * @tparam Float alt            The altitude of the pilot.
 * @tparam String model         The aircraft model of the pilot.
 * @tparam String server_ip     The server ip or host name which this pilot
 *                              connected to.
 */
function FGPilot(fgmap, callsign, lng, lat, alt, model, server_ip) {

    this.fgmap = fgmap;
    this.callsign = callsign;
    this.server_ip = server_ip;
    this.model = model;

    if(isNaN(lng))
        lng = 0;
    if(isNaN(lat))
        lat = 0;

    this.point = new GPoint(lng, lat);

    this.hdg = "N/A";
    this.last_disp_hdg = -1;

    // Seems to be FGFS starting alt
    if(alt == -9999) {
        alt = 0;
    }

    this.alt = alt;
    this.last_alt = alt;

    this.spd = "N/A";
    this.last_spd = "N/A";

    /* Arrays of GPolyline */
    this.polylines = new Array();

    /* Arrays of GPoint for the polyline */
    this.trails = [ this.point ];


    var elem, span;

    // info box div
    elem = this.info_elem = element_create(null, "div");
    elem.className = "fgmap_pilot_info";
    elem.style.zIndex = FGMAP_PILOT_INFO_ZINDEX;
    //element_opacity_set(elem, 0.65);

    this.info = new gmap_element(fgmap.gmap, this.point,
                                    new GPoint(20, 15),
                                    this.info_elem);
    // TODO
    element_opacity_set(this.info.elem, 0.65);


    // callsign
    span = element_create(elem, "span");
    span.className = "fgmap_pilot_info_callsign";
    span.innerHTML = callsign;


    // lat/lng
    element_text_append(elem, " (");

    span = element_create(elem, "span");
    span.className = "fgmap_pilot_info_model";
    span.innerHTML = model; // TODO: one day when FG can switch craft

    element_text_append(elem, ")");
    element_create(elem, "br");


    // alt
    span = this.alt_elem = element_create(elem, "span");
    span.className = "fgmap_pilot_info_alt";
    span.innerHTML = this.alt.toFixed(0);

    span = element_create(elem, "span");
    span.className = "fgmap_pilot_info_alt";
    span.innerHTML = "ft";

    // alt trend
    span = this.alt_trend_elem = element_create(elem, "span");
    span.className = "fgmap_pilot_info_alt";
    element_hide(span);


    element_text_append(elem, "\u00a0\u00a0\u00a0");


    // hdg
    span = this.hdg_elem = element_create(elem, "span");
    span.className = "fgmap_pilot_info_hdg";
    span.innerHTML = this.hdg;

    span = this.hdg_unit = element_create(elem, "span");
    span.className = "fgmap_pilot_info_hdg";
    span.innerHTML = "\u00b0";
    element_hide(span);

    element_create(elem, "br");


    // spd
    span = this.spd_elem = element_create(elem, "span");
    span.className = "fgmap_pilot_info_spd";
    span.innerHTML = this.spd;

    span = this.spd_unit = element_create(elem, "span");
    span.className = "fgmap_pilot_info_spd";
    span.innerHTML = "kts";
    element_hide(span);

    // spd trend
    span = this.spd_trend_elem = element_create(elem, "span");
    span.className = "fgmap_pilot_info_spd";
    element_hide(span);



    /* pilot icon */
    elem = this.icon_elem = element_create(null, "img");
    elem.className = "fgmap_pilot_icon";
    elem.style.zIndex = FGMAP_CRAFT_ICON_ZINDEX;
    attach_event(elem, "mouseover",
        this.marker_mouse_event_cb.bind_event(this));
    attach_event(elem, "mouseout",
        this.marker_mouse_event_cb.bind_event(this));


    this.marker = new gmap_element(fgmap.gmap, this.point,
                                    new GPoint(-(pi_anchor.x), -(pi_anchor.y)),
                                    this.icon_elem);


    this.marker_update(true);

}


/**
 * Update the position of the pilot.
 *
 * This function will update the pilot's position and altitude. Then it will
 * update the position of the pilot's icon. It will also calculate and update
 * the heading and ground speed of this pilot.
 *
 * @tparam Float lng            the new longitude of this pilot.
 * @tparam Float lat            the new latitude of this pilot.
 * @tparam Float alt            the new altitude of this pilot.
 */
FGPilot.prototype.position_update = function(lng, lat, alt) {

    if(isNaN(lng))
        lng = 0;
    if(isNaN(lat))
        lat = 0;

    this.alt = alt;

    if((this.point.x == lng) && (this.point.y == lat) &&
        (this.alt == this.last_alt)) {

        dprint(this.fgmap, this.callsign + ": hasn't moved...");
        element_hide(this.alt_trend_elem);
        element_hide(this.spd_trend_elem);
        return;
    }

    var last_x = this.point.x;
    var last_y = this.point.y;

    this.point.x = lng;
    this.point.y = lat;

    /* Updating the array of points */
    if(this.trails && this.trails.length == this.fgmap.gmap_trail_limit) {
        //delete(this.trails.shift());
        this.trails.shift();
    }
    this.trails.push(new GPoint(lng, lat));

    if(this.fgmap.trail_visible) {
        this.trail_visible_set(true);
    }


    // Calculate heading
    var o = lng - last_x;
    var a = lat - last_y;
    var deg = rad_to_deg(Math.atan(o / a));


    /* Check if the differences is toooo big, it might be a reset, or
     * changing position from the menu or something */
    if((Math.abs(o) >= 0.07) || (Math.abs(a) >= 0.07)) {

        this.trail_visible_set(false);
        delete(this.trails);
        this.trails = new Array();
        this.hdg = 0;
        this.spd = 0;
        this.last_spd = 0;
        this.last_alt = alt;

        dprint(this.fgmap, this.callsign + ": possible reset, clearing points");

    } else {

        if(a < 0) {
            deg += 180;
        } else if(o < 0 && a > 0) {
            deg += 360;
        }

        if(deg < 0) {
            deg += 360;
        } else if(deg >= 360) {
            deg -= 360;
        }
        this.hdg = deg;
    }



    // Calculate speed
    if(this.trails.length > 0) {
        var d;

        with(Math) {
            d = 2 * asin(
                        sqrt(
                            pow(sin(deg_to_rad(a) / 2), 2) +
                            cos(deg_to_rad(lat)) *
                            cos(deg_to_rad(last_y)) *
                            pow(sin(deg_to_rad(o) / 2), 2)
                        )
                    );

            d = rad_to_deg(d) * 60;
            this.spd = d * 60 * 60 * 1000 / this.fgmap.update_interval;
            //dprint(this.fgmap, "d: " + d + ", speed: " + this.spd);
        }
    }


    // Calculate alt trend
    var oldalt = parseInt(this.last_alt);
    var newalt = parseInt(this.alt);

    if(newalt > oldalt) {
        this.alt_trend_elem.innerHTML = "\u00a0+" + (newalt - oldalt);
        element_show(this.alt_trend_elem);
    } else if(newalt < oldalt) {
        this.alt_trend_elem.innerHTML = "\u00a0-" + (oldalt - newalt);
        element_show(this.alt_trend_elem);
    } else {
        element_hide(this.alt_trend_elem);
    }

    this.last_alt = this.alt;


    // Calculate spd trend
    var oldspd = parseInt(this.last_spd);
    var newspd = parseInt(this.spd);

    if(newspd > oldspd) {
        this.spd_trend_elem.innerHTML = "\u00a0+" + (newspd - oldspd);
        element_show(this.spd_trend_elem);
    } else if(newspd < oldspd) {
        this.spd_trend_elem.innerHTML = "\u00a0-" + (oldspd - newspd);
        element_show(this.spd_trend_elem);
    } else {
        element_hide(this.spd_trend_elem);
    }

    this.last_spd = this.spd;

    if(isNaN(this.hdg)) {
        this.hdg_elem.innerHTML = "N/A";
        element_hide(this.hdg_unit);
    } else {
        this.hdg_elem.innerHTML = this.hdg.toFixed(0);
        element_show(this.hdg_unit);
    }

    if(isNaN(this.spd)) {
        this.spd_elem.innerHTML = "N/A";
        element_hide(this.spd_unit);
    } else {
        this.spd_elem.innerHTML = this.spd.toFixed(0);
        element_show(this.spd_unit);
    }


    this.alt_elem.innerHTML = this.alt.toFixed(0);

    this.info.update(this.point);

    this.marker_update();

    if(this.fgmap.trail_on) {
        this.trail_update();
    }

};


FGPilot.prototype.marker_update = function(force) {

    var deg;
    var hdg;

    if(isNaN(this.hdg)) {
        deg = 0;
    } else {
        hdg = Math.round(this.hdg) + 7;
        deg = hdg - (hdg % pi_heading_scale);
    }

    if(deg < 0) {
        deg += 360;
    } else if(deg >= 360) {
        deg -= 360;
    }

    if(this.last_disp_hdg == deg && !force) {

        dprint(this.fgmap, this.callsign + ": heading was the same");
        this.marker.update(this.point, null);

    } else {

        this.last_disp_hdg = deg;

        dprint(this.fgmap,
            this.callsign + ": heading: " + this.hdg + ", deg: " + deg);

        var img = FGMAP_CRAFT_ICON_PREFIX;
        
        // TODO

        if(this.fgmap.model_icon &&
            (this.fgmap.aircraft_model_icons.indexOf(this.model) != -1)) {

            // specific model icon
            img += this.model + "/" + this.model;

        } else {

            if(FGMAP_CRAFT_MODELS_HELI.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_HELI;
            } else if(FGMAP_CRAFT_MODELS_SINGLEPROP.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_SINGLEPROP;
            } else if(FGMAP_CRAFT_MODELS_TWINPROP.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_TWINPROP;
            } else if(FGMAP_CRAFT_MODELS_SMALLJET.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_SMALLJET;
            } else if(FGMAP_CRAFT_MODELS_HEAVYJET.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_HEAVYJET;
            } else {
                // TODO
                img += FGMAP_CRAFT_ICON_GENERIC;
            }
        }

        img += "-";
        img += deg + FGMAP_CRAFT_ICON_SUFFIX;

        this.icon_elem.src = img;
        this.marker.update(this.point);
        img_ie_fix(this.icon_elem);
    }
};


/**
 * Set whether the info box of this pilot is visible or not.
 *
 * @tparam Boolean visible          visible or not.
 */
FGPilot.prototype.info_visible_set = function(visible) {
    if(visible) {
        element_show(this.info_elem);
    } else {
        element_hide(this.info_elem);
    }
};


/**
 * Set whether the trail line of this pilot is visible or not.
 *
 * @tparam Boolean visible          visible or not.
 */
FGPilot.prototype.trail_visible_set = function(visible) {

    if(visible) {

        if(!this.trails || this.trails.length <= 1) {
            return;
        }

        var pl;
        var tlen = this.trails.length;
        var plen = this.polylines.length;

        if(plen == (this.fgmap.gmap_trail_limit - 1)) {
            pl = this.polylines.shift();
            this.fgmap.gmap.removeOverlay(pl);
            delete(pl);
        }

        //dprint(this.fgmap, "tlen: " + tlen);
        //dprint(this.fgmap, "plen: " + plen);

        for(var n = 0; n < (tlen - 1); n++) {

            var opacity = (n + 1) / Math.min(tlen, this.fgmap.gmap_trail_limit);

            opacity = opacity.toFixed(1);

            //dprint(this.fgmap, "opacity " + opacity);
            //dprint(this.fgmap, "n " + n);

            if(!this.polylines[n]) {
                //dprint(this.fgmap, "creating new polyline " + n);
                var pl = new GPolyline([ this.trails[n], this.trails[(n + 1)] ],
                            this.fgmap.gmap_trail_color,
                            this.fgmap.gmap_trail_weight, opacity);
                //dprint(this.fgmap, "created new polyline " + n);
                this.fgmap.gmap.addOverlay(pl);
                this.polylines[n] = pl;
            } else {
                //dprint(this.fgmap, "updating polyline " + n);
                this.polylines[n].opacity = opacity;
                this.polylines[n].redraw(true);
            }
        }

    } else {

        while(this.polylines.length) {
            var pl = this.polylines.shift();
            this.fgmap.gmap.removeOverlay(pl);
            delete(pl);
        }
    }
};


/**
 * Remove and delete this pilot.
 */
FGPilot.prototype.remove = function() {

    dprint(this.fgmap, this.callsign + ": being removed");

    this.fgmap.pilot_follow_remove(this.callsign);

    this.info.remove();
    this.marker.remove();

    this.trail_visible_set(false);
    // TODO: do I need to delete each element...
    delete(this.trails);
    this.trails = null;
};



FGPilot.prototype.marker_mouse_event_cb = function(e) {

    if(this.fgmap.info_type == FGMAP_PILOT_INFO_ALWAYS)
        return;

    if(this.fgmap.info_type == FGMAP_PILOT_INFO_FOLLOWS &&
        this.fgmap.follows.indexOf(this.callsign) != -1)
        return;

    if(!e) e = window.event;

    if(e.type == "mouseover") {
        element_show(this.info_elem);
    } else if(e.type == "mouseout") {
        element_hide(this.info_elem);
    }

}




/* fg_server ******************************************************************/

function fg_server(name, longname, host, port) {
    this.name = name;
    this.longname = longname;
    this.host = host;
    this.port = port;
}


/* FGMap **********************************************************************/

/**
 * Create a new FGMap object.
 * @brief FGMap object
 * @ctor
 *
 * Create a new FGMap, with a given id to the div element where the map should
 * be shown.
 *
 * @tparam String id        the div id that will be binded for showing the map.
 */
function FGMap(id)
{
    this.id = "FGMap";
    this.force = 0;

    this.div = document.getElementById(id);

    this.updating = false;
    this.xml_request = null;

    /* pilots related */
    this.pilots = new Object();
    this.pilots_cnt = 0;
    this.follows = new Array();

    /* menus */
    this.menus = null;

    /* list of servers */
    this.fg_servers = new Object();
    this.fg_server_current = null;

    this.update = true;
    this.update_interval = 5000;
    this.trail_visible = false;
    this.info_type = FGMAP_PILOT_INFO_ALWAYS;
    this.menu_visible = true;
    this.model_icon = false;
    this.debug = false;
    this.pantoall = false;

    /* gmap initial settings */
    this.gmap = null;
    this.gmap_zoom = 4;

    this.gmap_trail_weight = 2;
    this.gmap_trail_color = "#ff0000";
    this.gmap_trail_limit = 6;

    attach_event(window, "resize", this.resize_cb.bind_event(this));

    if(this.div)
    {
        //this.div.style.position = "absolute";
        this.div.style.overflow = "hidden";
    }

    this.init(true);

}


/**
 * Returns the version string of the FGMap API used.
 * @treturn String  the version of the FGMap API used.
 */
FGMap.prototype.version = "0.1";


/**
 * @param force             true means to skip compatibility check
 */
FGMap.prototype.init = function(force) {

    if(!this.div)
        return false;

    // FIXME
    if(!GBrowserIsCompatible() && !force) {
        this.div.innerHTML =
            "<p align=\"center\"><br><br>"
            "Your browser is not supported by Google Maps,<br>"
            "hence the FlightGear map is not likely going to work either...<br><br>"
            "Click <a href=\"javascript:map_init(1);\">here</a> to force it to load and see how it goes...</p><br>";

        return false;

    } else if(force) {

        this.div.innerHTML = "";

    }

    this.gmap = new GMap(this.div);
    this.gmap_start_point = new GPoint(-122.357237, 37.613545); // KSFO
    this.gmap_type = G_SATELLITE_TYPE;

    if(!this.gmap) {
        this.div.innerHTML =
            "<p align=\"center\"><br>Map failed to load :(</p>";
        return false;
    }

    this.query_string_parse();

    //this.gmap.addControl(new GSmallMapControl());
    this.gmap.addControl(new GLargeMapControl());
    this.gmap.addControl(new GMapTypeControl());


    GEvent.addListener(this.gmap, "moveend",
        this.linktomap_update.bind_event(this));
    GEvent.addListener(this.gmap, "zoom",
        this.linktomap_update.bind_event(this));
    GEvent.addListener(this.gmap, "maptypechanged",
        this.linktomap_update.bind_event(this));


    this.gmap.setMapType(this.gmap_type);
    this.gmap.centerAndZoom(this.gmap_start_point, this.gmap_zoom);


    // TODO: Put this somewhere else better?
    this.aircraft_model_icons = [
        "c172p",
        "boeing733",
        "ufo",
        /* TODO
        "b1900d-anim",
        "seahawk-3d-model",
        "hunter-model",
        "Bravo"
        */
        ];


    this.linktomap_update();

    //this.pilot_test();

};


/**
 * Add a server to servers list.
 * 
 * @tparam String name      a short name to be appeared for this server, must be
 *                          unique
 * @tparam String longname  a long name, possibly with description of this
 *                          server
 * @tparam String host      the host of the server to connect to (ip or host
 *                          name). null for a placeholder item.
 * @tparam Integer port     the port to connect to (FG server admin port)
 * @treturn Boolean         true on success, false on failure
 */
FGMap.prototype.server_add = function(name, longname, host, port) {

    var server;

    if(((server = this.fg_servers[name]) != null) &&
        (server.host != null) &&
        (server.host > 0))
    {
        this.fg_server_current = server;
        return true;
    }

    if(name == null)
        return false;

    this.fg_servers[name] = new fg_server(name, longname, host, port);

    this.event_callback_call(FGMAP_EVENT_SERVER_ADDED,
        name, longname, host, port);

    if(this.fg_server_current == null) {
        this.server_set(name);

        if(this.update) {
            this.map_update_start();
        }
    }

    return true;
};


/**
 * Set the server by name of the FGMap.
 *
 * @tparam String name      The name of the server to set to. Server name must
 *                          exist in the FGMap's server list.
 * @treturn Boolean         true on success, false on error.
 * @see server_add
 */
FGMap.prototype.server_set = function(name) {

    var server;

    if((server = this.fg_servers[name]) == null) {
        return false;
    }

    if((this.fg_server_current != null) &&
        (this.fg_server_current.name == server.name) &&
        (this.fg_server_current.port == server.port)) {

        return false;
    }

    if(server.host == null || server.port == 0) {
        return false;
    }

    this.fg_server_current = server;
    this.pilots_clear();

    // TODO: Should we?
    //this.pilot_follows_clear();

    if(this.update) {
        this.map_update(true);
    }

    this.linktomap_update();

    this.event_callback_call(FGMAP_EVENT_SERVER_CHANGED, name);
};


FGMap.prototype.map_update_start = function() {
    if(this.update) {
        this.map_update();
        setTimeout(this.map_update_start.bind_event(this),
                this.update_interval);
    }
};


FGMap.prototype.debug_set = function(bool) {
    this.debug = bool;
};


FGMap.prototype.debug_elem_set = function(elem) {

    if(this.debug_elem == elem)
        return;

    this.debug_elem = elem;

};


FGMap.prototype.pilot_test = function() {

    for(var n = 0; n < 11; n++) {
        var p = new FGPilot(this, "testpilot" + (n + 1),
                this.gmap_start_point.x + Math.random(),
                this.gmap_start_point.y + Math.random(),
                (n + 1) * 100, "test", "test");
        this.pilots["testpilot" + (n + 1)] = p;
        //p.info_visible_set(true);
    }

    this.pilots_tab_update();
};


// TODO: Document these somewhere
FGMap.prototype.query_string_parse = function() {

    if(!location || !(location.search))
        return false;

    var query_string = location.search;

    if(query_string[0] = '?')
        query_string = query_string.substring(1);

    if(query_string == "")
        return false;

    dprint(this, "query_string: " + query_string);
    //var pairs = query_string.split("&amp;");
    var pairs = query_string.split("&");

    for(var n = 0; n < pairs.length; n++) {

        var pair = pairs[n].split("=");
        dprint(this, "parsing: [" + pair[0] + "]:[" + pair[1] + "]");

        if(pair[0] == "fg_server") {

            var spp = pair[1].split(",");
            this.server_add(spp[0], spp[0], spp[1], spp[2]);

        } else if(pair[0] == "follow") {

            this.pilot_follow_add(pair[1]);

        } else if(pair[0] == "ll") {

            var ll = pair[1].split(",");
            this.gmap_start_point = new GPoint(ll[0], ll[1]);

        } else if(pair[0] == "z") {

            this.gmap_zoom = pair[1];

        } else if(pair[0] == "t") {

            this.gmap_type = (pair[1] == "m" ? G_MAP_TYPE :
                                (pair[1] == "s" ? G_SATELLITE_TYPE :
                                    G_HYBRID_TYPE));
        }
    }

};


FGMap.prototype.map_update = function(force) {

    if(this.fg_server_current == null)
        return false;

    // TODO: At the moment, this mean we'll wait forever (or whatever the
    // default timeout is for a request
    if(this.updating && !force) {
        return false;
    }

    if(this.xml_request != null) {
        this.xml_request.abort();
    }

    this.updating = true;

    var url = "fg_server_xml.cgi?" +
                this.fg_server_current.host + ":" +
                this.fg_server_current.port;

    this.xml_request = GXmlHttp.create();
    this.xml_request.open("GET", url, true);
    this.xml_request.onreadystatechange = this.xml_request_cb.bind_event(this);

    dprint(this, "getting info from " +
        this.fg_server_current.host + ":" + this.fg_server_current.port);

    this.xml_request.send(null);

};


FGMap.prototype.xml_request_cb = function() {

    if(!this.xml_request)
        return;

    if(this.xml_request.readyState == 4) {

        var xmlDoc = this.xml_request.responseXML;

        if(xmlDoc == null || xmlDoc.documentElement == null) {
            this.updating = false;
            return;
        }

        var markers = xmlDoc.documentElement.getElementsByTagName("marker");
        var onlines = new Object();
        var follows_need_update = false;
        var has_new_pilots = false;

        for(var i = 0; i < markers.length; i++) {

            var callsign = markers[i].getAttribute("callsign");
            var lng = parseFloat(markers[i].getAttribute("lng"));
            var lat = parseFloat(markers[i].getAttribute("lat"));
            var alt = parseFloat(markers[i].getAttribute("alt"));
            var model = markers[i].getAttribute("model");
            var server_ip = markers[i].getAttribute("server_ip");

            onlines[callsign] = 1;

            var p;

            if(this.pilots[callsign] == null) {

                p = new FGPilot(this, callsign,
                            lng, lat, alt, model, server_ip);
                this.pilots[callsign] = p;
                dprint(this, "added " + callsign + " " + lng + " " + lat);
                this.pilots_cnt += 1;
                has_new_pilots = true;
                this.event_callback_call(FGMAP_EVENT_PILOT_JOIN, callsign);

                if(this.pantoall) {
                    this.pilot_follow_add(callsign);
                }

            } else {

                p = this.pilots[callsign];
                p.position_update(lng, lat, alt);

                dprint(this, "updated " + callsign + " " + lng + " " + lat);
            }

            if(!follows_need_update && (this.follows.indexOf(callsign) != -1)) {
                follows_need_update = true;
            }
        }

        /* Clean up old pilots */
        for(var callsign in this.pilots) {
            if(onlines[callsign] == null) {
                dprint(this, "deleted " + callsign);
                this.pilots_cnt -= 1;
                this.pilots[callsign].remove();
                delete(this.pilots[callsign]);
                this.event_callback_call(FGMAP_EVENT_PILOT_PART, callsign);
            }
        }

        this.event_callback_call(FGMAP_EVENT_PILOTS_POS_UPDATE);

        if(follows_need_update) {
            this.follows_update();
        }

        if(has_new_pilots) {
            this.info_type_set(this.info_type);
        }

        this.updating = false;
        this.xml_request = null;

        dprint(this, "info request complete");
    }
    else if(this.xml_request.readyState > 4)
    {
        // TODO
        dprint(this, "xml_request state " + this.xml_request.readyState);
    }

};


/**
 * Pan to a pilot, given its callsign.
 *
 * @tparam String callsign        the callsign of the pilot to center.
 */
FGMap.prototype.pilot_pan = function(callsign) {

    if(this.pilots[callsign]) {

        dprint(this, "panning to pilot " + callsign);
        //map.centerAtLatLng(this.pilots[callsign].point);
        this.gmap.recenterOrPanToLatLng(this.pilots[callsign].marker.point);

        this.event_callback_call(FGMAP_EVENT_PILOT_PAN, callsign);
    }
};


FGMap.prototype.pilots_clear = function() {
    for(var callsign in this.pilots) {
        this.pilots[callsign].remove();
        delete this.pilots[callsign];
    }
    this.pilots_cnt = 0;
};


/**
 * Set whether the map should do any update or not.
 *
 * @tparam Boolean update        true for update, false for no update
 */
FGMap.prototype.map_update_set = function(update) {
    if(this.update != update) {
        this.update = update;
        dprint(this, "server update is now " + update);
        if(update) {
            this.map_update_start();
        }
    }
};


/**
 * Set how often the map should do an update.
 *
 * @tparam Integer sec            How often the map should update, in seconds.
 */
FGMap.prototype.map_update_interval_set = function(sec) {
    dprint(this, "changing update interval from " +
        (this.update_interval / 1000) + " to " + sec);
    this.update_interval = sec * 1000;
};


/**
 * Add a pilot, by its callsign, to the follow list of the map.
 *
 * The callsign may or may not be an existing pilot. Hence a pilot can be added
 * to the follow list before he/she has joined.
 *
 * @tparam String callsign          the callsign of the pilot to be added
 * @treturn Boolean                 true on success, false on failure
 * @see pilot_follow_remove
 */
FGMap.prototype.pilot_follow_add = function(callsign) {

    /*
    if(!this.pilots[callsign])
        return false;
    */

    if(this.follows.indexOf(callsign) != -1)
        return false;

    this.follows.push(callsign);
    this.follows_update();
    
    if(this.info_type == FGMAP_PILOT_INFO_FOLLOWS) {
        this.pilots[callsign].info_visible_set(true);
    }

    this.event_callback_call(FGMAP_EVENT_PILOT_FOLLOW_ADD, callsign);

    this.linktomap_update();

    return true;
};


/**
 * Remove a pilot, by its callsign, from the follow list of the map.
 *
 * @tparam String callsign          the callsign of the pilot to be removed
 * @treturn Boolean                 true on success, false on failure
 * @see pilot_follow_add
 */
FGMap.prototype.pilot_follow_remove = function(callsign) {

    /*
    if(!this.pilots[callsign])
        return false;
    */

    if(this.follows.removeItem(callsign)) {
        if(this.info_type == FGMAP_PILOT_INFO_FOLLOWS) {
            this.pilots[callsign].info_visible_set(false);
        }
        this.linktomap_update();
        this.event_callback_call(FGMAP_EVENT_PILOT_FOLLOW_REMOVE, callsign);
        return true;
    } else {
        return false;
    }
};


/**
 * Remove all pilot from the follow list.
 */
FGMap.prototype.pilot_follows_clear = function() {
    this.follows = new Array();
    this.event_callback_call(FGMAP_EVENT_PILOT_FOLLOWS_CLEAR);
};


FGMap.prototype.follows_update = function() {

    var follow_bounds = new GBounds(181, 91, -181, -91);

    for(var i = 0; i < this.follows.length; i++) {

        var pilot = this.pilots[this.follows[i]];

        if(!pilot)
            continue;

        var point = pilot.point;

        if(follow_bounds.minX > point.x)
            follow_bounds.minX = point.x;

        if(follow_bounds.minY > point.y)
            follow_bounds.minY = point.y;

        if(follow_bounds.maxX < point.x)
            follow_bounds.maxX = point.x;

        if(follow_bounds.maxY < point.y)
            follow_bounds.maxY = point.y;

    }

    var follow_padding;
    
    if(this.follows.length <= 1) {
        follow_padding = 0;
    } else {
        //follow_padding = 0.0008;
        //follow_padding = 0.005;
        //follow_padding = 0.08;
        follow_padding = 0.06;
        //follow_padding = 0.04;
    }

    // Add some padding
    follow_bounds.minX -= follow_padding;
    follow_bounds.minY -= follow_padding;
    follow_bounds.maxX += follow_padding;
    follow_bounds.maxY += follow_padding;

    var bounds = this.gmap.getBoundsLatLng();

    if((follow_bounds.minX < bounds.minX) ||
        (follow_bounds.minY < bounds.minY) ||
        (follow_bounds.maxX > bounds.maxX) ||
        (follow_bounds.maxY > bounds.maxY)) {
    
        this.gmap.centerAndZoomOnBounds(follow_bounds);
    }
};


FGMap.prototype.trail_visible_set = function(visible) {

    if(this.trail_visible == visible)
        return;

    this.trail_visible = visible;

    for(var callsign in this.pilots) {
        this.pilots[callsign].trail_visible_set(visible);
    }
};


/**
 * Set the type mode of when the info box of pilots will be shown.
 *
 * Type could be:
 * <ul>
 * <li>#FGMAP_PILOT_INFO_ALWAYS: info box is always shown
 * <li>#FGMAP_PILOT_INFO_FOLLOWS: info box is visible for pilots in the follow
 * list
 * <li>#FGMAP_PILOT_INFO_MOUSEOVER: info box is visible only on mouse over on
 * the pilot's icon marker
 * </ul>
 *
 * @tparam FGMapPilotInfoType type        The type
 */
FGMap.prototype.info_type_set = function(type) {

    /*
    if(this.info_type == type)
        return;
    */

    this.info_type = type;

    if(type == FGMAP_PILOT_INFO_ALWAYS) {
        for(var callsign in this.pilots) {
            this.pilots[callsign].info_visible_set(true);
        }
    } else if(type == FGMAP_PILOT_INFO_FOLLOWS) {
        for(var callsign in this.pilots) {
            if(this.follows.indexOf(callsign) == -1) {
                this.pilots[callsign].info_visible_set(false);
            } else {
                this.pilots[callsign].info_visible_set(true);
            }
        }
    } else if(type == FGMAP_PILOT_INFO_MOUSEOVER) {
        for(var callsign in this.pilots) {
            this.pilots[callsign].info_visible_set(false);
        }
    }

};


/**
 * Enable/Disable the Zoom/Pan to all pilots mode.
 *
 * @tparam Boolean pantoall     pan to all or not
 */
FGMap.prototype.pantoall_set = function(pantoall) {

    if(this.pantoall == pantoall) {
        return;
    }

    this.pantoall = pantoall;

    if(pantoall) {
        for(var callsign in this.pilots) {
            this.pilot_follow_add(callsign);
        }
    } else {
        this.pilot_follows_clear();
    }
};


FGMap.prototype.linktomap_update = function() {

    if(!this.gmap)
        return;

    var zoomlevel = this.gmap.getZoomLevel();
    var maptype = this.gmap.getCurrentMapType();
    var center = this.gmap.getCenterLatLng();

    var href = "";

    // GMap settings
    href += "?ll=" + center.x + "," + center.y;
    href += "&z=" + zoomlevel;
    href += "&t=" + (maptype == G_MAP_TYPE ? "m" :
                        (maptype == G_SATELLITE_TYPE ? "s" : "h"));
    
    // FGMap settings
    for(var i = 0; i < this.follows.length; i++) {
        href += "&follow=" + this.follows[i];
    }

    // Current server
    if(this.fg_server_current != null) {
        href += "&fg_server=" + this.fg_server_current.name + "," +
            this.fg_server_current.host + "," +
            this.fg_server_current.port;
    }

    this.linktomap = href;

    this.event_callback_call(FGMAP_EVENT_MAP_VIEW_CHANGED);
};


/**
 * Add a callback function for an FGMap event.
 *
 * When the callback function is called, the following arguments will be passed:
 *
 * func(event, data, event specific arguments...)
 *
 * @tparam FGMapEvent event     The FGMap event
 * @tparam Function func        The callback function
 * @tparam void* data           The callback data
 */
FGMap.prototype.event_callback_add = function(event, func, data) {

    if(this.event_cbs == null) {
        this.event_cbs = new Object();
    }

    if(this.event_cbs[event] == null) {
        this.event_cbs[event] = new Array();
    }

    var cb = new Object();
    cb.func = func;
    cb.data = data;

    // We don't care about duplicates atm
    this.event_cbs[event].push(cb);

    return true;
};


FGMap.prototype.event_callback_remove = function(event, func, data) {
    
    if(this.event_cbs == null || this.event_cbs[event] == null)
        return false;

    for(var i = 0; i < this.event_cbs[event].length; i++) {
        var cb = this.event_cbs[event][i];
        if(cb.func == func && cb.data == data) {
            this.event_cbs[event][i] = null;
            return true;
        }
    }

    return false;
};


FGMap.prototype.event_callback_call = function(event /*, ... */) {

    if(this.event_cbs == null || this.event_cbs[event] == null)
        return;

    for(var i = 0; i < this.event_cbs[event].length; i++) {
        var cb = this.event_cbs[event][i];
        cb.func.apply(null, [ event, cb.data, arr_remove_first(arguments) ]);
    }
};





/* FGMap internal callback functions */

FGMap.prototype.resize_cb = function() {
    this.gmap.onResize();
    this.event_callback_call(FGMAP_EVENT_MAP_RESIZE);
};





/* vim: set sw=4 sts=4:*/

