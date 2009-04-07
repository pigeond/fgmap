/*
 * Random handy utils to deal with HTML/DOM/etc
 *
 * GPLv2, see LICENSE file for details
 *
 */


// Browser stuff

var USER_AGENT = new Object();
var agent_str = navigator.userAgent.toLowerCase();

if(agent_str.indexOf("msie") != -1) {
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
if(agent_str.indexOf("safari") != -1) {
    USER_AGENT.is_safari = true;
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



/* Various helper functions */
function dimen_to_wh(dimen) {
    var arr = dimen.match(/(\d+)x(\d+)/);
    w = parseInt(arr[1]);
    h = parseInt(arr[2]);
    return { w:w, h:h };
}


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




// Events related helpers

function target_get(event) {
    return (event.target || event.srcElement);
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


/* Inspired by http://www.phpied.com/javascript-include/ */
/* TODO: Doesn't work well under m$ shitty crappy IE, they sure are the dumbest
 * software company */
/*
function include_js(file) {

    var head;
    
    head = document.getElementsByTagName('head').item(0);

    if(head == null) {
        return false;
    }

    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', file);
    head.appendChild(js);

    return true;
}

include_js("fgmap_tabbed_div.js");

include_js("fgmap_menu.js");
include_js("fgmap_menu_pilots.js");
include_js("fgmap_menu_server.js");
include_js("fgmap_menu_settings.js");
include_js("fgmap_menu_debug.js");
include_js("fgmap_menu_nav.js");
*/



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


function element_raise(elem) {
    var parent = elem.parentNode;
    if(parent && parent.lastChild) {
        // TODO
        element_attach_after(elem, parent.lastChild, parent);
        /*
        parent.removeChild(elem);
        parent.appendChild(elem);
        */
    }
}


function element_remove(elem) {
    if(elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
    } else {
        // Err?
    }
}


function element_text_create(parent, text) {
    var text = document.createTextNode(text);
    if(parent) {
        parent.appendChild(text);
    }
    return text;
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

function element_visible_get(elem) {
    return elem.style.display == 'block';
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


function element_event_bubble_cancel_cb(event) {
    if(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
}


function element_event_bubble_cancel(elem) {
    attach_event(elem, "mousedown", element_event_bubble_cancel_cb);
    attach_event(elem, "mouseup", element_event_bubble_cancel_cb);
    //attach_event(elem, "mousemove", element_event_bubble_cancel_cb);
    //attach_event(elem, "mouseover", element_event_bubble_cancel_cb);
    //attach_event(elem, "mouseout", element_event_bubble_cancel_cb);
    attach_event(elem, "click", element_event_bubble_cancel_cb);
    attach_event(elem, "dblclick", element_event_bubble_cancel_cb);
}



/* GMapElement ***************************************************************/
/* Helper class for creating/manipulating overlay within GMap */

function GMapElement(latlng, align, child, gmap_pane, classname) {
    this.latlng = latlng;
    this.align = align || new GPoint(0, 0);
    //this.gmap_pane = gmap_pane || G_MAP_MARKER_PANE;
    this.gmap_pane = gmap_pane || G_MAP_MARKER_MOUSE_TARGET_PANE;
    this.child = child;
    this.classname = classname || "";

    if(child) {
        element_hide(child);
    }
}
GMapElement.prototype = new GOverlay();

GMapElement.prototype.copy = function() {
    return new GMapElement(this.latlng, this.align, this.child, this.gmap_pane, this.classname);
};

GMapElement.prototype.initialize = function(gmap) {

    this.gmap = gmap;
    this.elem = element_create(gmap.getPane(this.gmap_pane), "div");
    this.elem.style.position = "absolute";
    this.elem.className = this.classname;

    // TODO: Not setting zindex according to GMap here allows raise() to work,
    // but check me
    //this.elem.style.zIndex = GOverlay.getZIndex(this.latlng.lat());
    this.elem.style.zIndex = 32767;

    this.update(this.latlng, this.align);
    this.child_set(this.child);

    if(this.child) {
        element_show(this.child);
    }

    if(this.opacity != null) {
        this.opacity_set(this.opacity);
    }
};


GMapElement.prototype.child_set = function(child) {
    if(child) {
        if(this.child) {
            element_remove(this.child);
        }
        this.child = child;
        element_attach(child, this.elem);
    }
};


GMapElement.prototype.update = function(latlng, align) {

    if(latlng)
        this.latlng = latlng;

    if(align)
        this.align = align;

    var dc = this.gmap.fromLatLngToDivPixel(this.latlng);
    this.elem.style.left = str_to_pos(parseInt(dc.x + this.align.x));
    this.elem.style.top = str_to_pos(parseInt(dc.y + this.align.y));
};


GMapElement.prototype.redraw = function(force) {
    if(force) {
        this.update(this.latlng, this.align);
    }
};


GMapElement.prototype.show = function() {
    element_show(this.elem);
};


GMapElement.prototype.hide = function() {
    element_hide(this.elem);
};


GMapElement.prototype.visible_set = function(visible) {
    if(visible)
        element_show(this.elem);
    else
        element_hide(this.elem);
}


GMapElement.prototype.opacity_set = function(opacity) {
    this.opacity = opacity;
    //element_opacity_set(this.child, opacity);
    if(this.elem) {
        element_opacity_set(this.elem, opacity);
    }
};


GMapElement.prototype.raise = function() {
    element_raise(this.elem);
};


GMapElement.prototype.remove = function() {
    element_remove(this.child);
    this.child = null;
    element_remove(this.elem);
    this.eleme = null;
    delete(this.latlng);
    this.latlng = null;
    delete(this.align);
    this.align = null;
};


/*****/

var IMG_CHECK_INTERVAL = 200;

function GMapImageElement(latlng, src) {
    GMapElement.apply(this, [ latlng, null, null, null, null ]);
    this.img = null;
    this.pending = null;
    this.src_set(src);
}
GMapImageElement.prototype = new GMapElement();


GMapImageElement.prototype.img_complete_cb = function() {

    if(!this.pending) {
        return;
    }

    if((this.pending.complete == true) ||
            ((this.pending.old_width != this.pending.offsetWidth) ||
             (this.pending.old_height != this.pending.offsetHeight))) {

        var oldimg = this.img;

        this.img = this.pending;
        this.pending = null;

        this.child_set(this.img);

        // TODO: check those magic numbers...
        var align = new GPoint(-this.img.width / 2 + 1,
                -this.img.height / 2 - 6);
        this.update(null, align);

        img_ie_fix(this.img);
        element_show(this.img);

        if(oldimg) {
            element_hide(oldimg);
            delete(oldimg);
            oldimg = null;
        }
    } else {
        setTimeout(this.img_complete_cb.bind_event(this), IMG_CHECK_INTERVAL);
    }
};


GMapImageElement.prototype.src_set = function(src) {

    if(src == this.src) {
        return;
    }

    this.src = src;

    if(this.pending) {
        element_hide(this.pending);
        delete(this.pending);
    }

    if(src == null) {
        element_hide(this.img);
        return;
    }

    this.pending = element_create(null, 'img');
    element_hide(this.pending);
    this.pending.old_width = this.pending.offsetWidth;
    this.pending.old_height = this.pending.offsetHeight;
    this.pending.src = src;
    this.img_complete_cb();
};




/* Button helper */

function button_create(parent, img_normal, img_pressed, tooltip, cb, cb_data) {

    var but = element_create(parent, 'img');
    but.src = img_normal;
    but.style.cursor = "pointer";

    if(tooltip) {
	but.title = tooltip;
    }

    var button_func = function(e) {

	e = e || window.event;
	var target = target_get(e);

	if(e.type == 'mouseup') {
	    target.src = img_normal;
	    if(cb) {
		cb(cb_data);
	    }
	} else if(e.type == 'mouseout') {
	    target.src = img_normal;
	} else if(e.type == 'mousedown' && img_pressed) {
	    target.src = img_pressed;
	}
    };

    attach_event(but, "mousedown", button_func);
    attach_event(but, "mouseup", button_func);
    attach_event(but, "mouseout", button_func);

    return but;
}



/* Toggle button helper */

function toggle_button_create(parent, img_normal, img_pressed,
	tooltip_normal, tooltip_pressed, cb_down, cb_up, cb_data) {

    var but = element_create(parent, 'img');
    but.src = img_normal;
    but.style.cursor = "pointer";
    but.up = true;

    if(tooltip_normal) {
	but.title = tooltip_normal;
    }

    var button_func = function(e) {

	e = e || window.event;
	var target = target_get(e);

	if(target.up) {
	    target.up = false;
	    if(img_pressed) {
		target.src = img_pressed;
	    }
	    if(tooltip_pressed) {
		target.title = tooltip_pressed;
	    }
	    if(cb_down) {
		cb_down(cb_data);
	    }
	} else {
	    target.up = true;
	    target.src = img_normal;
	    if(tooltip_normal) {
		target.title = tooltip_normal;
	    }
	    if(cb_up) {
		cb_up(cb_data);
	    }
	}
    };

    attach_event(but, "mousedown", button_func);

    return but;
}


