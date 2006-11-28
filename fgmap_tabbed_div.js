/*
 * FGTabbedDiv
 *
 * Pigeon <pigeon at pigeond dot net>
 * All rights reserved, 2006.
 */


/*
 * @param div        the div
 */
function FGTabbedDiv(div) {
    if(!div)
        return;
    this.div = div;
    this.init();
}


FGTabbedDiv.prototype.init = function() {

    var html;
    var elem;

    /* menu body content part */
    elem = this.menu_content = element_create(this.div, 'div');
    elem.setAttribute('id', 'blah');
    elem.className = 'fgmap_menu';
    elem.style.position = 'relative';
    elem.style.overflow = 'hidden';
    //elem.style.width = '100%';
    //elem.style.left = '0px';
    //elem.style.top = '0px';
    elem.style.height = "90%";
    //elem.style.height = "auto";
    //elem.style.backgroundColor = 'green';

    /* menu body tabs */
    elem = this.menu_tabs = element_create(this.div, 'div');
    elem.setAttribute('id', 'fgmap_menu_tabs');
    elem.className = 'fgmap_menu';
    elem.style.position = 'relative';
    //elem.style.width = '100%';
    elem.style.height = '16px';     // FIXME
    elem.style.textAlign = 'left';
    elem.style.whiteSpace = 'nowrap';
    elem.style.overflow = 'hidden';
    elem.style.paddingTop = '0px';
    elem.style.paddingBottom = '4px';
    //elem.style.backgroundColor = 'red';
};


FGTabbedDiv.prototype.tab_height_set = function(height) {
    this.menu_tabs.style.height = height;
};


FGTabbedDiv.prototype.fgmapmenu_sort_func = function(m1, m2) {
    if(m1.gravity < m2.gravity)
        return -1;
    else
        return 1;
};


/**
 * Add a tab to the FGTabbedDiv.
 *
 * @param id                the id for the tab, must be unique
 * @param title             the title for the tab, where it appears at the tab
 * @param child             the html element to be appended into this tab as
 *                          content
 * @param data              the user data attached to this tab
 * @param gravity           optional
 * @param noautofocus       optional
 */
FGTabbedDiv.prototype.tab_add = function(id, title, child, data,
                                        gravity, noautofocus) {

    if(!id || !title || !this.menu_content || !this.menu_tabs) {
        return false;
    }

    if(this.menus && this.menus[id])
        return false;

    var elem;
    
    /* The actual content part of this tab */
    /*
    elem = element_create(this.menu_content, "div");
    elem.style.position = "relative";
    elem.style.left = "0px";
    elem.style.top = "0px";
    elem.style.width = "100%";
    elem.style.height = "100%";

    if(child) {
        elem.appendChild(child);
        // TODO: Should I do these?
        child.style.width = '100%';
        child.style.height = '100%';
    }
    */

    this.menu_content.appendChild(child);

    child.style.position = 'relative';
    /*
    child.style.position = 'absolute';
    child.style.left = '0px';
    child.style.top = '0px';
    child.style.width = '100%';
    */

    if(!this.menus) {
        this.menus = new Object();
    }
    

    if(this.menu_current == null && !noautofocus) {
        this.menu_current = id;
        //element_show(elem);
        element_show(child);
    } else {
        //element_hide(elem);
        element_hide(child);
    }

    // callback functions for the tab
    var mouseover_func = function(e, id) {
        if(this.menu_current != id) {
            this.menus[id].tab_span.className = "hover";
        }
    };

    var mouseout_func = function(e, id) {
        if(this.menu_current != id) {
            this.menus[id].tab_span.className = "";
        }
    };

    var mouseclick_func = function(e, id) {
        this.tab_set(id);
    };

    gravity = (gravity || 0);

    // The tab part, where you click and switch
    var tab_span;
    var attached = false;

    // TODO: this is not very efficient, but this hopefully won't be called
    // that much.
    var tmp_arr = new Array();
    for(var i in this.menus) {
        tmp_arr.push(this.menus[i]);
    }
    tmp_arr = tmp_arr.sort(this.fgmapmenu_sort_func);

    tab_span = element_create(null, 'span');
    tab_span.style.cursor = 'pointer';
    //tab_span.style.width = '1px';
    tab_span.style.height = '100%';
    tab_span.style.paddingLeft = '8px';
    tab_span.style.paddingRight = '8px';
    tab_span.innerHTML = title;

    for(var i = 0; i < tmp_arr.length; i++) {
        if(tmp_arr[i].gravity > gravity) {
            //alert("inserting " + title + " before " + tmp_arr[i].title);
            element_attach_before(tab_span, tmp_arr[i].tab_span,
                this.menu_tabs);
            attached = true;
            break;
        }
    }

    if(!attached) {
        //alert("inserting " + title + " at the end");
        element_attach(tab_span, this.menu_tabs);
    }

    this.menus[id] = new Object();
    this.menus[id].title = title;
    this.menus[id].data = data;
    //this.menus[id].tab_content = elem;
    this.menus[id].tab_child = child;
    this.menus[id].tab_span = tab_span;
    this.menus[id].gravity = gravity;

    if(id == this.menu_current) {
        tab_span.className = "current";
    }

    attach_event(tab_span, "mouseover", mouseover_func.bind_event(this, id));
    attach_event(tab_span, "mouseout", mouseout_func.bind_event(this, id));
    attach_event(tab_span, "click", mouseclick_func.bind_event(this, id));

    this.reconfigure();

    return true;
};


FGTabbedDiv.prototype.reconfigure = function() {

    if(this.menu_current == null) {
        return;
    }

    var span = this.menus[this.menu_current].tab_span;
    var h = parseInt(span.offsetHeight);
    h += parseInt(this.menu_tabs.style.paddingBottom);

    if(this.div.offsetHeight > h) {
        this.menu_content.style.height = (this.div.offsetHeight - h) + 'px';

        /* hmm */
        for(var i in this.menus) {
            this.menus[i].tab_child.style.height =
                this.menu_content.style.height;
        }
    }
};


FGTabbedDiv.prototype.tab_remove = function(id) {

    if(!this.menus[id])
        return false;

    element_remove(this.menus[id].tab_span);
    element_remove(this.menus[id].tab_child);
    //element_remove(this.menus[id].tab_content);
    delete(this.menus[id]);

    if(this.menu_current == id) {
        // TODO: How to get just the first key from the hash?
        for(var i in this.menus) {
            this.tab_set(this.menus[i]);
            break;
        }
    }
};


FGTabbedDiv.prototype.tab_data_get = function(id) {

    if(!this.menus[id])
        return null;

    return this.menus[id].data;
};


FGTabbedDiv.prototype.tab_set = function(id) {

    if(this.menu_current == id)
        return false;

    if(!this.menus[id])
        return false;

    //element_hide(this.menus[this.menu_current].tab_content);
    element_hide(this.menus[this.menu_current].tab_child);
    this.menus[this.menu_current].tab_span.className = "";

    //element_show(this.menus[id].tab_content);
    element_show(this.menus[id].tab_child);
    this.menus[id].tab_span.className = "current";

    if(this.menus[this.menu_current].data &&
        typeof(this.menus[this.menu_current].data.onblur) == "function") {

        var func = this.menus[this.menu_current].data.onblur.bind_event(
                    this.menus[this.menu_current].data);
        func();
    }

    this.menu_current = id;

    if(this.menus[this.menu_current].data &&
        typeof(this.menus[this.menu_current].data.onfocus) == "function") {

        var func = this.menus[id].data.onfocus.bind_event(this.menus[id].data);
        func();
    }

    return true;
};


/*
FGTabbedDiv.prototype.children_max_size_get = function() {

    var w = null, h = null;

    for(var i in this.menus) {

        var child = this.menus[i].tab_child;
        element_show(child);

        if(w == null && w == null) {
            w = child.clientWidth;
            h = child.clientHeight;
        } else {

            if(w < child.clientWidth) {
                w = child.clientWidth;
            }

            if(h < child.clientHeight) {
                h = child.clientHeight;
            }
        }

        if(this.menu_current != i) {
            element_hide(child);
        }
    }

    return { w:w, h:h };
};
*/


/* vim: set sw=4 sts=4:*/

