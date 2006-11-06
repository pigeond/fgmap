/*
 * Debug menu
 *
 * Pigeon <pigeon at pigeond dot net>
 * All rights reserved, 2006.
 */


function FGMapMenuDebug(fgmap, tabdiv) {
    this.fgmap = fgmap;
    this.tabdiv = tabdiv;
    this.setup();
}

FGMapMenuDebug.prototype.setup = function() {

    var elem = element_create(null, "div");
    elem.style.className = "fgmap_debug";
    elem.style.overflow = "hidden";
    elem.style.width = "95%";
    elem.style.height = "95%";
    elem.style.padding = "0px";
    elem.style.margin = "0px auto";

    var debug = this.debug = element_create(elem, "textarea");
    debug.style.width = "100%";
    debug.style.height = "100%";
    debug.style.padding = "0px";
    debug.style.margin = "0px";
    debug.rows = 10;
    debug.readOnly = true;

    this.tabdiv.tab_add("debug", "debug", elem, this, 100);

    this.fgmap.debug_elem_set(this.debug);

    dprint(this.fgmap, "FGMap debug ready...");

};


FGMapMenuDebug.prototype.remove = function() {
    this.fgmap.debug_elem_set(null);
    this.tabdiv.tab_remove("debug");
};

