
/**
 * @file
 * @brief FGMap - FlightGear server online map API.
 *
 * An extension on top of Google Map API.
 * Pigeon &lt;pigeon at pigeond dot net&gt;
 *
 * GPLv2, see LICENSE file for details
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
var FGMAP_PILOT_INFO_OFF = 0;
/** FGMapPilotInfoType @see FGMap.info_type_set */
var FGMAP_PILOT_INFO_ALWAYS = 1;
/** FGMapPilotInfoType @see FGMap.info_type_set */
var FGMAP_PILOT_INFO_FOLLOWS = 2;
/** FGMapPilotInfoType @see FGMap.info_type_set */
var FGMAP_PILOT_INFO_MOUSEOVER = 3;



/** @see FGMap.aircraft_icon_mode_set */
var FGMAP_ICON_MODE_NORMAL = 0;
var FGMAP_ICON_MODE_PHOTO = 1;
var FGMAP_ICON_MODE_DOT = 2;

var FGMAP_CRAFT_DOT = "aircraft_dot";

var FGMAP_PILOT_INFO_ZINDEX = 10;


var FGMAP_CRAFT_ICON_PREFIX = "images/aircraft_icons/";
var FGMAP_CRAFT_ICON_SUFFIX = ".png";
var FGMAP_CRAFT_ICON_ZINDEX = 5;


var FGMAP_CRAFT_ICON_GENERIC = "generic/fg_generic_craft"

var FGMAP_CRAFT_ICON_HELI = "heli/heli"
var FGMAP_CRAFT_MODELS_HELI = [ "bo105", "sikorsky76c", "ec135", "r22", "s76c", "Lynx-WG13", "S51-sikorsky", "CH47", "R22", "apache-model", "uh-1", "uh60", "OH-1" ];

var FGMAP_CRAFT_ICON_SINGLEPROP = "singleprop/singleprop";
var FGMAP_CRAFT_MODELS_SINGLEPROP = [ "c150", "c172p", "c172-dpm", "c182-dpm", "c310-dpm", "c310u3a", "dhc2floats", "pa28-161", "pc7", "j3cub" ];

var FGMAP_CRAFT_ICON_TWINPROP = "twinprop/twinprop";
var FGMAP_CRAFT_MODELS_TWINPROP = [ "Boeing314Clipper", "Lockheed1049_twa", "TU-114-model", "b1900d-anim", "b29-model", "beech99-model", "dc3-dpm", "fokker50" ];

var FGMAP_CRAFT_ICON_SMALLJET = "smalljet/smalljet";
var FGMAP_CRAFT_MODELS_SMALLJET = [ "Citation-II", "Bravo", "fokker100", "tu154B" ];

var FGMAP_CRAFT_ICON_HEAVYJET = "heavyjet/heavyjet";
var FGMAP_CRAFT_MODELS_HEAVYJET = [ "boeing733", "boeing747-400-jw", "a320-fb", "A380", "AN-225-model", "B-52F-model", "Concorde-ba", "FINNAIRmd11", "MD11", "KLMmd11", "737-300", "787", "777-200", "747-400", "737-100", "737-400" ];


var FGMAP_CRAFT_ICON_GLIDER = "glider/glider";
var FGMAP_CRAFT_MODELS_GLIDER = [ "hgldr-cs-model", "paraglider_model", "colditz-model", "sgs233" ];

var FGMAP_CRAFT_ICON_BLIMP = "blimp/blimp";
var FGMAP_CRAFT_MODELS_BLIMP = [ "ZLT-NT", "ZF-balloon", "Submarine_Scout", "LZ-129", "Excelsior-model" ];

var FGMAP_CRAFT_ICON_CARRIER = "carrier/fg_carrier";
var FGMAP_CRAFT_MODELS_CARRIER = [ "mp-nimitz", "mp-eisenhower", "mp-foch" ];


/* Specific aircraft (non-photo) icons */
var FGMAP_CRAFT_ICON_OV10 = "ov10/ov10";
var FGMAP_CRAFT_MODELS_OV10 = [ "OV10", "OV10_USAFE" ];

var FGMAP_CRAFT_ICON_KC135 = "kc135/kc135";
var FGMAP_CRAFT_MODELS_KC135 = [ "KC135" ];

var FGMAP_CRAFT_ICON_CH53E = "ch53e/ch53e";
var FGMAP_CRAFT_MODELS_CH53E = [ "ch53e-model" ];

var FGMAP_CRAFT_ICON_E3B = "e3b/e3b";
var FGMAP_CRAFT_MODELS_E3B = [ "E3B" ];

var FGMAP_CRAFT_ICON_ATC = "atc/atc";
var FGMAP_CRAFT_MODELS_ATC = [ "atc-tower", "atc-tower2", "mibs", "atc" ];

var dummy_cnt = 1;

/* Navaid types */
var FGMAP_NAVAID_APT = dummy_cnt++;
var FGMAP_NAVAID_HPT = dummy_cnt++;
var FGMAP_NAVAID_SPT = dummy_cnt++;
var FGMAP_NAVAID_DME = dummy_cnt++;
var FGMAP_NAVAID_TACAN = dummy_cnt++;
var FGMAP_NAVAID_VOR = dummy_cnt++;
var FGMAP_NAVAID_VORDME = dummy_cnt++;
var FGMAP_NAVAID_VORTAC = dummy_cnt++;
var FGMAP_NAVAID_NDB = dummy_cnt++;
var FGMAP_NAVAID_NDBDME = dummy_cnt++;
var FGMAP_NAVAID_FIX = dummy_cnt++;
var FGMAP_NAVAID_AWY = dummy_cnt++;
var FGMAP_NAVAID_ILS = dummy_cnt++;

var FGMAP_NAVAID_NAMES = new Object();
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_APT] = 'Airport';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_HPT] = 'Heliport';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_SPT] = 'Seaport';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_DME] = 'DME';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_TACAN] = 'TACAN';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_VOR] = 'VOR';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_VORDME] = 'VOR-DME';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_VORTAC] = 'VORTAC';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_NDB] = 'NDB';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_NDBDME] = 'NDB-DME';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_FIX] = 'Fix';
FGMAP_NAVAID_NAMES[FGMAP_NAVAID_AWY] = 'Airway';

var FGMAP_NAVAID_ICONS = new Object();
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_HPT] = 'images/nav_icons/heliport.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_DME] = 'images/nav_icons/dme.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_TACAN] = 'images/nav_icons/tacan.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_VOR] = 'images/nav_icons/vor.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_VORDME] = 'images/nav_icons/vordme.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_VORTAC] = 'images/nav_icons/vortac.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_NDB] = 'images/nav_icons/ndb.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_NDBDME] = 'images/nav_icons/ndbdme.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_FIX] = 'images/nav_icons/fix.png';
FGMAP_NAVAID_ICONS[FGMAP_NAVAID_AWY] = 'images/nav_icons/awy.png';

var FGMAP_NAVAID_ICONS_DIMEN = new Object();
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_HPT] = '32x33';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_DME] = '32x32';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_TACAN] = '32x28';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_VOR] = '32x28';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_VORDME] = '32x28';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_VORTAC] = '32x28';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_NDB] = '32x32';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_NDBDME] = '32x32';
FGMAP_NAVAID_ICONS_DIMEN[FGMAP_NAVAID_FIX] = '16x12';

var FGMAP_NAV_INFO_CLASSES = new Object();
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_APT] = 'fgmap_nav_apt';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_HPT] = 'fgmap_nav_hpt';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_SPT] = 'fgmap_nav_apt';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_DME] = 'fgmap_nav_ndb';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_TACAN] = 'fgmap_nav_vor';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_VOR] = 'fgmap_nav_vor';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_VORDME] = 'fgmap_nav_vor';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_VORTAC] = 'fgmap_nav_vor';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_NDB] = 'fgmap_nav_ndb';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_FIX] = 'fgmap_nav_fix';
FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_AWY] = 'fgmap_nav_awy';


/* ATC enums */
var FGMAP_ATC_TYPE_ATIS = 50;
var FGMAP_ATC_TYPE_RADIO = 51;
var FGMAP_ATC_TYPE_CLEAR = 52;
var FGMAP_ATC_TYPE_GND = 53;
var FGMAP_ATC_TYPE_TWR = 54;
var FGMAP_ATC_TYPE_APP = 55;
var FGMAP_ATC_TYPE_DEP = 56;

/* Airport ATC types */
var FGMAP_ATC_TYPES = new Object();
FGMAP_ATC_TYPES[FGMAP_ATC_TYPE_ATIS] = 'ATIS';
FGMAP_ATC_TYPES[FGMAP_ATC_TYPE_RADIO] = 'Radio';
FGMAP_ATC_TYPES[FGMAP_ATC_TYPE_CLEAR] = 'Clearance';
FGMAP_ATC_TYPES[FGMAP_ATC_TYPE_GND] = 'Ground';
FGMAP_ATC_TYPES[FGMAP_ATC_TYPE_TWR] = 'Tower';
FGMAP_ATC_TYPES[FGMAP_ATC_TYPE_APP] = 'Approach';
FGMAP_ATC_TYPES[FGMAP_ATC_TYPE_DEP] = 'Departure';


/* ILS type */
var FGMAP_ILS_TYPE_ILS = dummy_cnt++;   /* Full ILS (LOC + GS) */
var FGMAP_ILS_TYPE_LOC = dummy_cnt++;   /* LOC only */
var FGMAP_ILS_TYPE_GS = dummy_cnt++;
var FGMAP_ILS_TYPE_OM = dummy_cnt++;
var FGMAP_ILS_TYPE_MM = dummy_cnt++;
var FGMAP_ILS_TYPE_IM = dummy_cnt++;
var FGMAP_ILS_TYPE_DME = dummy_cnt++;

var FGMAP_ILS_NAMES = new Object();
FGMAP_ILS_NAMES[FGMAP_ILS_TYPE_ILS] = 'ILS';
FGMAP_ILS_NAMES[FGMAP_ILS_TYPE_LOC] = 'LOC';
FGMAP_ILS_NAMES[FGMAP_ILS_TYPE_GS] = 'GS';
FGMAP_ILS_NAMES[FGMAP_ILS_TYPE_OM] = 'OM';
FGMAP_ILS_NAMES[FGMAP_ILS_TYPE_MM] = 'MM';
FGMAP_ILS_NAMES[FGMAP_ILS_TYPE_IM] = 'IM';
FGMAP_ILS_NAMES[FGMAP_ILS_TYPE_DME] = 'DME';


/* ILS course "dart" */
var FGMAP_ILS_COURSE_ICON = 'images/nav_icons/ils-course/ils-course';
var FGMAP_ILS_COURSE_ICON_SUFFIX = '.png';
var FGMAP_ILS_COURSE_ICON_DIMEN = '808x808';

var FGMAP_ILS_MARKER_ICON = 'images/nav_icons/ils-marker/ils-marker';
var FGMAP_ILS_MARKER_ICON_SUFFIX = '.png';
var FGMAP_ILS_MARKER_ICON_DIMEN = '56x57';

var FGMAP_ILS_LOC_ICON = 'images/nav_icons/loc.png';
var FGMAP_ILS_LOC_ICON_DIMEN = '32x32';

var FGMAP_ILS_LOCDME_ICON = 'images/nav_icons/locdme.png';  // DME only
var FGMAP_ILS_LOCDME_ICON_DIMEN = '32x32';

var FGMAP_PILOT_OPACITY = 0.75;
var FGMAP_NAV_OPACITY = 0.80;




/* Helper functions */

function deg_to_rad(deg) {
    return (deg * Math.PI / 180);
}

function deg_to_quad(deg) {
    return parseInt(deg / 90);
}

function rad_to_deg(rad) {
    return (rad * 180 / Math.PI);
}


function rev_deg(deg) {
    return (deg > 180 ? deg - 180 : deg + 180);
}


/* @return the point, as GLatLng, given a point (GLatLng), given a distance in
 * feet and the heading in degree (0 degree being north, ascending clockwise)
 * definitely not the best function name in the world...
 */
function latlng_dist_heading(latlng, dist, heading) {

    // The simpliest lat/lon to distance formula
    var r = 365239.5;
    var rad = deg_to_rad(parseFloat(heading));
    var a = Math.cos(rad) * dist;
    var o = Math.sin(rad) * dist;

    var dlat = a / r;
    var dlng = o / Math.cos(deg_to_rad(latlng.lat() + dlat)) / r;

    return new GLatLng(latlng.lat() + dlat, latlng.lng() + dlng);
}


/* returns true if val is between bound1 and bound2, inclusive */
function value_in_bounds(val, bound1, bound2) {
    val = parseFloat(val);
    bound1 = parseFloat(bound1);
    bound2 = parseFloat(bound2);
    if(bound1 < bound2) {
        return ((val >= bound1) && (val <= bound2));
    } else {
        return ((val >= bound2) && (val <= bound1));
    }
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
 * @tparam Float heading        The heading
 */
function FGPilot(fgmap, callsign, lat, lng, alt, model, server_ip, heading) {

    this.fgmap = fgmap;
    this.callsign = callsign;
    this.server_ip = server_ip;
    this.model = model;

    if(isNaN(lng))
        lng = 0;
    if(isNaN(lat))
        lat = 0;

    this.latlng = new GLatLng(lat, lng);

    this.last_disp_hdg = -1;

    // Seems to be FGFS starting alt
    if(alt == -9999) {
        alt = 0;
    }

    this.alt = alt;
    this.last_alt = alt;

    this.spd = "N/A";
    this.last_spd = "N/A";

    this.hdg = this.last_hdg = heading;

    /* Arrays of GPolyline */
    this.polylines = new Array();

    /* Arrays of GLatLng for the polyline */
    this.trails = [ this.latlng ];


    var elem, span;

    // info box div
    elem = this.info_elem = element_create(null, "div");
    elem.className = "fgmap_pilot_info";
    //elem.style.zIndex = FGMAP_PILOT_INFO_ZINDEX;

    attach_event(elem, "mouseover",
        this.info_mouseover_cb.bind_event(this));

    this.info = new GMapElement(this.latlng,
                                new GPoint(20, 15),
                                this.info_elem);
    fgmap.gmap.addOverlay(this.info);
    this.info.opacity_set(FGMAP_PILOT_OPACITY);


    // callsign
    span = element_create(elem, "span");
    span.className = "fgmap_pilot_info_callsign";
    element_text_create(span, callsign);


    // lat/lng
    element_text_append(elem, " (");

    span = element_create(elem, "span");
    span.className = "fgmap_pilot_info_model";

    // TODO: one day when FG can switch craft
    this.aircraft = model_lookup[model];
    if(!this.aircraft) {
        this.aircraft = model.replace(/-model$/, '');
        this.aircraft = model.replace(/-anim$/, '');
    }
    span.innerHTML = this.aircraft;

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
    span.innerHTML = this.hdg.toFixed(2);

    span = this.hdg_unit = element_create(elem, "span");
    span.className = "fgmap_pilot_info_hdg";
    span.innerHTML = "\u00b0";
    //element_hide(span);

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
    this.marker = new GMapImageElement(this.latlng, null);
    fgmap.gmap.addOverlay(this.marker);

    // TODO
    attach_event(this.marker.elem, "mouseover",
        this.marker_mouse_event_cb.bind_event(this));
    attach_event(this.marker.elem, "mouseout",
        this.marker_mouse_event_cb.bind_event(this));


    /* pilots filters */
    this.filtered_pilots_cnt = 0;

    this.marker_update(true);
}


/**
 * Update the position of the pilot.
 *
 * This function will update the pilot's position and altitude. Then it will
 * update the position of the pilot's icon. It will also calculate and update
 * the heading and ground speed of this pilot.
 *
 * @tparam Float lat            the new latitude of this pilot.
 * @tparam Float lng            the new longitude of this pilot.
 * @tparam Float alt            the new altitude of this pilot.
 */
FGPilot.prototype.position_update = function(lat, lng, alt, heading) {

    if(isNaN(lat))
        lat = 0;
    if(isNaN(lng))
        lng = 0;

    this.alt = alt;
    this.hdg = heading;

    if((this.latlng.lng() == lng) && (this.latlng.lat() == lat) &&
        (this.alt == this.last_alt) && (this.hdg == this.last_hdg)) {

        dprint(this.fgmap, this.callsign + ": hasn't moved...");
        element_hide(this.alt_trend_elem);
        element_hide(this.spd_trend_elem);
        return;
    }

    this.last_hdg = this.hdg;

    var last_x = this.latlng.lng();
    var last_y = this.latlng.lat();

    this.latlng = new GLatLng(lat, lng);

    /* Updating the array of points */
    if(this.trails && this.trails.length == this.fgmap.gmap_trail_limit) {
        //delete(this.trails.shift());
        this.trails.shift();
    }
    this.trails.push(new GLatLng(lat, lng));

    if(this.fgmap.trail_visible) {
        this.trail_visible_set(true);
    }


    var o = lng - last_x;
    var a = lat - last_y;


    /* Check if the differences is toooo big, it might be a reset, or
     * changing position from the menu or something */
    if((Math.abs(o) >= 0.07) || (Math.abs(a) >= 0.07)) {

        this.trail_visible_set(false);
        delete(this.trails);
        this.trails = new Array();

        this.spd = 0;
        this.last_spd = 0;
        this.last_alt = alt;

        /* Now we have real headings */
        //this.hdg = 0;
        //this.last_hdg = 0;

        dprint(this.fgmap, this.callsign + ": possible reset, clearing points");

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
        this.hdg_elem.innerHTML = this.hdg.toFixed(2);
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

    this.info.update(this.latlng);

    this.marker_update();

    if(this.fgmap.trail_on) {
        this.trail_update();
    }

};


FGPilot.prototype.marker_update = function(force) {

    var pi_heading_scale = 10;

    var deg;
    var hdg;

    if(isNaN(this.hdg)) {
        deg = 0;
    } else {
        hdg = Math.round(this.hdg);
        deg = hdg - (hdg % pi_heading_scale);
    }

    if(deg < 0) {
        deg += 360;
    } else if(deg >= 360) {
        deg -= 360;
    }

    if(this.last_disp_hdg == deg && !force) {

        dprint(this.fgmap, this.callsign + ": heading was the same");
        this.marker.update(this.latlng, null);

    } else {

        this.last_disp_hdg = deg;

        dprint(this.fgmap,
            this.callsign + ": heading: " + this.hdg + ", deg: " + deg);

        var img = FGMAP_CRAFT_ICON_PREFIX;
        
        // TODO

        if(this.fgmap.aircraft_icon_mode == FGMAP_ICON_MODE_PHOTO &&
            (this.fgmap.aircraft_photo_icons[this.model] != null)) {

            // specific model icon
            img += this.fgmap.aircraft_photo_icons[this.model];

        } else if(this.fgmap.aircraft_icon_mode == FGMAP_ICON_MODE_DOT) {

            img += FGMAP_CRAFT_DOT;

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
            } else if(FGMAP_CRAFT_MODELS_GLIDER.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_GLIDER;
            } else if(FGMAP_CRAFT_MODELS_BLIMP.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_BLIMP;
            } else if(FGMAP_CRAFT_MODELS_CARRIER.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_CARRIER;


            } else if(FGMAP_CRAFT_MODELS_OV10.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_OV10;
            } else if(FGMAP_CRAFT_MODELS_KC135.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_KC135;
            } else if(FGMAP_CRAFT_MODELS_CH53E.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_CH53E;
            } else if(FGMAP_CRAFT_MODELS_E3B.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_E3B;
            } else if(FGMAP_CRAFT_MODELS_ATC.indexOf(this.model) != -1) {
                img += FGMAP_CRAFT_ICON_ATC;

            } else {
                // TODO
                img += FGMAP_CRAFT_ICON_GENERIC;
            }
        }

        if(this.fgmap.aircraft_icon_mode != FGMAP_ICON_MODE_DOT) {
            img += "-";
            img += deg;
        }
        
        img += FGMAP_CRAFT_ICON_SUFFIX;

        this.marker.src_set(img);
        this.marker.update(this.latlng);
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

            if(this.polylines[n]) {
                this.fgmap.gmap.removeOverlay(this.polylines[n]);
                this.polylines[n] = null;
            }

            /* TODO */
            if(!this.polylines[n]) {
                //dprint(this.fgmap, "creating new polyline " + n);
                var pl = new GPolyline([ this.trails[n], this.trails[(n + 1)] ],
                            this.fgmap.gmap_trail_color,
                            this.fgmap.gmap_trail_weight, opacity);
                //dprint(this.fgmap, "created new polyline " + n);
                this.fgmap.gmap.addOverlay(pl);
                this.polylines[n] = pl;
            } /* TODO else {
                //dprint(this.fgmap, "updating polyline " + n);

                //this.polylines[n].opacity = opacity;
                // XXX TODO FIXME
                if(this.polylines[n].B) {
                    this.polylines[n].B = opacity;
                }

                this.polylines[n].redraw(true);
            } */
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

    this.fgmap.gmap.removeOverlay(this.info);
    this.fgmap.gmap.removeOverlay(this.marker);

    this.trail_visible_set(false);
    // TODO: do I need to delete each element...
    delete(this.trails);
    this.trails = null;
};



FGPilot.prototype.marker_mouse_event_cb = function(e) {

    if(!e) e = window.event;

    if(e.type == "mouseover") {
        this.raise();
    }

    if(this.fgmap.info_type == FGMAP_PILOT_INFO_OFF ||
        this.fgmap.info_type == FGMAP_PILOT_INFO_ALWAYS)
        return;

    if(this.fgmap.info_type == FGMAP_PILOT_INFO_FOLLOWS &&
        this.fgmap.follows.indexOf(this.callsign) != -1)
        return;

    if(e.type == "mouseover") {
        element_show(this.info_elem);
    } else if(e.type == "mouseout") {
        element_hide(this.info_elem);
    }

}


FGPilot.prototype.info_mouseover_cb = function(e) {
    this.raise();
};


FGPilot.prototype.raise = function() {
    this.marker.raise();
    this.info.raise();
};



/* fg_server ******************************************************************/

function fg_server(name, longname, host, ip, port, group) {
    this.name = name;
    this.longname = longname;
    this.host = host;
    this.ip = ip;
    this.port = port;
    this.group = group;
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
    this.pilots_cnt = 0;        // TODO: get rid of it
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
    this.aircraft_icon_mode = FGMAP_ICON_MODE_NORMAL;
    this.debug = false;
    this.pantoall = false;
    this.latlng_visible = false;

    /* gmap initial settings */
    this.gmap = null;
    this.gmap_zoom = 13;

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
FGMap.prototype.version = "0.2";


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

    this.gmap = new GMap2(this.div);

    if(!this.gmap) {
        this.div.innerHTML =
            "<p align=\"center\"><br>Map failed to load :(</p>";
        return false;
    }

    this.gmap_start_point = new GLatLng(37.613545, -122.357237); // KSFO
    this.gmap_type = G_SATELLITE_MAP;

    this.gmap.setCenter(this.gmap_start_point, this.gmap_zoom);
    this.gmap.setMapType(this.gmap_type);

    this.query_string_parse();

    if(!this.nomapcontrol) {
        //this.gmap.addControl(new GSmallMapControl());
        this.gmap.addControl(new GLargeMapControl());
        this.gmap.addControl(new GMapTypeControl());
        this.gmap.addControl(new GScaleControl());

        this.gmap_overview = new GOverviewMapControl();
        this.gmap.addControl(this.gmap_overview);

        setTimeout(this.maptypechanged_cb.bind_event(this), 1);
    }

    this.gmap.setCenter(this.gmap_start_point);
    this.gmap.setZoom(this.gmap_zoom);
    this.gmap.setMapType(this.gmap_type);


    GEvent.addListener(this.gmap, "maptypechanged",
        this.maptypechanged_cb.bind_event(this));

    GEvent.addListener(this.gmap, "moveend",
        this.linktomap_update.bind_event(this));

    GEvent.addListener(this.gmap, "maptypechanged",
        this.linktomap_update.bind_event(this));



    // TODO: Put this somewhere else better?
    this.aircraft_photo_icons = new Object();
    this.aircraft_photo_icons["c172p"] = "c172p/c172p";
    this.aircraft_photo_icons["boeing733"] = "boeing733/boeing733";
    this.aircraft_photo_icons["ufo"] = "ufo/ufo";
    this.aircraft_photo_icons["KC135"] = "kc135/kc135-model";
    this.aircraft_photo_icons["A-10-model"] = "a10/a10-model";


    this.linktomap_update();

    //this.pilot_test();

    this.menu_setup();

    /* TODO */
    this.latlng_visible_set(true);
};


/* GMapLatLngControl */

function GMapLatLngControl() {
    GControl.apply(this, [ true, false ]);
}
GMapLatLngControl.prototype = new GControl();

GMapLatLngControl.prototype.initialize = function(gmap) {
    this.gmap = gmap;
    this.latlngcontrol = element_create(gmap.getContainer(), 'div');
    this.latlngcontrol.className = 'fgmap_latlng_control';
    element_opacity_set(this.latlngcontrol, 0.6);
    GEvent.addListener(gmap, "mousemove", this.gmap_mousemove_cb.bind_event(this));
    this.gmap_mousemove_cb(gmap.getCenter());
    return this.latlngcontrol;
};

GMapLatLngControl.prototype.getDefaultPosition = function() {
    return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(18, 32));
}

GMapLatLngControl.prototype.printable = function() {
    return true;
};

GMapLatLngControl.prototype.selectable = function() {
    return false;
};

GMapLatLngControl.prototype.gmap_mousemove_cb = function(latlng) {
    this.latlngcontrol.innerHTML =
        latlng.lat().toFixed(6) + " " + latlng.lng().toFixed(6);
};


FGMap.prototype.latlng_visible_set = function(visible) {
    if(this.latlng_visible == visible)
        return;

    this.latlng_visible = visible;

    if(this.latlng_visible) {

        if(this.latlng_control == null) {
            this.latlng_control = new GMapLatLngControl();
        }

        this.gmap.addControl(this.latlng_control);
    } else {
        this.gmap.removeControl(this.latlng_control);
    }
}

FGMap.prototype.maptypechanged_cb = function() {

    this.gmap_type = this.gmap.getCurrentMapType();

    if(this.gmap_overview != null) {
        this.gmap_overview.getOverviewMap().setMapType(this.gmap_type);
    }
};


FGMap.prototype.menu_setup = function() {

    if(!this.nomenu) {
        this.fgmap_menu = new FGMapMenu(this);

        if(!this.menuminimized) {
            this.fgmap_menu.menu_visible_set(true);
        }

        if(this.start_tab != null) {
            /* FIXME */
            this.fgmap_menu.tabdiv.tab_set(this.start_tab);
        }
    }
};


/**
 * Start a server group
 */
FGMap.prototype.server_group_add = function(group) {
    if(group == null)
        return;

    this.fg_server_group = group;
};

/**
 * Add a server to servers list.
 * 
 * @tparam String name      a short name to be appeared for this server, must be
 *                          unique

 * @tparam String longname  a long name, possibly with description of this
 *                          server

 * @tparam String host      the host of the server to connect to (ip or host
 *                          name)

 * @tparam Integer port     the port to connect to (FG server admin port)

 * @tparam String ip        the IP of the server. This is used for looking up
 *			    which server a pilot is connected directly to, as
 *			    the server output uses only IP

 * @treturn Boolean         true on success, false on failure
 */
FGMap.prototype.server_add = function(name, longname, host, port, ip) {

    var server;

    if(((server = this.fg_servers[name]) != null) &&
        (server.host != null) &&
        (server.host > 0))
    {
        this.fg_server_current = server;
        return true;
    }

    if(name == null || host == null || port <= 0)
        return false;

    this.fg_servers[name] = new fg_server(name, longname, host, ip, port,
        this.fg_server_group);

    this.event_callback_call(FGMAP_EVENT_SERVER_ADDED,
        name, longname, host, port, this.fg_server_group);

    if(this.fg_server_current == null) {
        this.server_set(name);

        if(this.update) {
            this.server_update_start();
        }
    }

    return true;
};


FGMap.prototype.server_get_by_ip = function(ip) {

    if(ip == null) {
        return null;
    }

    if(ip == 'LOCAL') {
        return this.fg_server_current;
    }

    for(var k in this.fg_servers) {
        if(this.fg_servers[k].ip == ip) {
            return this.fg_servers[k];
        }
    }
    return null;
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


FGMap.prototype.server_update_start = function() {
    if(this.update) {
        this.map_update();
        setTimeout(this.server_update_start.bind_event(this),
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
                this.gmap_start_point.lat() + (n * 0.01),
                this.gmap_start_point.lng() + (n * 0.01),
                (n + 1) * 100, "test", "test", n * 10.0);
        this.pilots["testpilot" + (n + 1)] = p;
        //p.info_visible_set(true);
        this.pilots_cnt++;
    }

    //this.pilots_tab_update();
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
            this.gmap_start_point =
                new GLatLng(parseFloat(ll[0]), parseFloat(ll[1]));

        } else if(pair[0] == "z") {

            this.gmap_zoom = parseInt(pair[1]);

        } else if(pair[0] == "t") {

            this.gmap_type = (pair[1] == "m" ? G_NORMAL_MAP :
                                (pair[1] == "s" ? G_SATELLITE_MAP :
                                    G_HYBRID_MAP));

        } else if(pair[0] == "nomapcontrol") {

            this.nomapcontrol = true;

        } else if(pair[0] == "nomenu") {

            this.nomenu = true;

        } else if(pair[0] == "menuminimized") {

            this.menuminimized = true;

        } else if(pair[0] == "pilot_label") {

            if(pair[1] == "off") {
                this.info_type = FGMAP_PILOT_INFO_OFF;
            } else if(pair[1] == "always") {
                this.info_type = FGMAP_PILOT_INFO_ALWAYS;
            } else if(pair[1] == "follows") {
                this.info_type = FGMAP_PILOT_INFO_FOLLOWS;
            } else if(pair[1] == "mouseover") {
                this.info_type = FGMAP_PILOT_INFO_MOUSEOVER;
            }

        } else if(pair[0] == "menu") {
        
            this.start_tab = pair[1];

        } else if(pair[0] == "icon_mode") {
        
            if(pair[1] == "normal") {
                this.aircraft_icon_mode = FGMAP_ICON_MODE_NORMAL;
            } else if(pair[1] == "photo") {
                this.aircraft_icon_mode = FGMAP_ICON_MODE_PHOTO;
            } else if(pair[1] == "dot") {
                this.aircraft_icon_mode = FGMAP_ICON_MODE_DOT;
            }

        } else if(pair[0] == "update_interval" && pair[1] >= 1) {
            this.update_interval = pair[1] * 1000;

        } else if(pair[0] == 'pilots_filter_callsign') {
            this.pilots_filter_query_string_set(
                    FGMAP_PILOTS_FILTER_TYPE_CALLSIGN,
                    pair[1]);
        } else if(pair[0] == 'pilots_filter_aircraft') {
            this.pilots_filter_query_string_set(
                    FGMAP_PILOTS_FILTER_TYPE_AIRCRAFT,
                    pair[1]);
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

        var xmldoc = this.xml_request.responseXML;

        if(xmldoc == null || xmldoc.documentElement == null) {
            this.updating = false;
            return;
        }

        var markers = xmldoc.documentElement.getElementsByTagName("marker");
        var onlines = new Object();
        var follows_need_update = false;
        var has_new_pilots = false;
        this.filtered_pilots_cnt = 0;

        for(var i = 0; i < markers.length; i++) {

            var callsign = markers[i].getAttribute("callsign");
            var lng = parseFloat(markers[i].getAttribute("lng"));
            var lat = parseFloat(markers[i].getAttribute("lat"));
            var alt = parseFloat(markers[i].getAttribute("alt"));
            var model = markers[i].getAttribute("model");
            var server_ip = markers[i].getAttribute("server_ip");
            var heading = parseFloat(markers[i].getAttribute("heading"));

            if(!this.pilots_filter_match(callsign, model, server_ip)) {
                this.filtered_pilots_cnt++;
                continue;
            }

            onlines[callsign] = 1;

            var p;

            if(this.pilots[callsign] == null) {

                p = new FGPilot(this, callsign,
                            lat, lng, alt, model, server_ip, heading);
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
                p.position_update(lat, lng, alt, heading);

                dprint(this, "updated " + callsign + " " + lng + " " + lat + " " + heading);
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
        this.gmap.panTo(this.pilots[callsign].marker.latlng);

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
FGMap.prototype.server_update_set = function(update) {
    if(this.update != update) {
        this.update = update;
        dprint(this, "server update is now " + update);
        if(update) {
            this.server_update_start();
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
    this.linktomap_update();
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

    if(this.follows.length == 0) {
        return;
    }

    var follow_bounds = new GLatLngBounds();

    for(var i = 0; i < this.follows.length; i++) {

        var pilot = this.pilots[this.follows[i]];

        if(!pilot)
            continue;

        follow_bounds.extend(pilot.latlng);
    }

    var map_bounds = this.gmap.getBounds();

    if(map_bounds.containsBounds(follow_bounds) == false ||
            this.follows_always_center) {

        /* Change the zoom only if we need to */
        var map_zoom = this.gmap.getZoom();
        var follow_zoom = this.gmap.getBoundsZoomLevel(follow_bounds);

        if(map_zoom > follow_zoom) {
            map_zoom = follow_zoom;
        }

        var clat = (follow_bounds.getNorthEast().lat() +
                    follow_bounds.getSouthWest().lat()) / 2;

        var clng = (follow_bounds.getNorthEast().lng() +
                    follow_bounds.getSouthWest().lng()) / 2;

        this.gmap.setCenter(new GLatLng(clat, clng), map_zoom);

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
 * <li>#FGMAP_PILOT_INFO_OFF: info box is always off
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

    } else if(type == FGMAP_PILOT_INFO_OFF ||
        type == FGMAP_PILOT_INFO_MOUSEOVER) {

        for(var callsign in this.pilots) {
            this.pilots[callsign].info_visible_set(false);
        }

    }

    this.linktomap_update();
};


FGMap.prototype.aircraft_icon_mode_set = function(mode) {
    if(this.aircraft_icon_mode == mode) {
        return;
    }
    this.aircraft_icon_mode = mode;
    
    for(var p in this.pilots) {
        this.pilots[p].marker_update(true);
    }

    this.linktomap_update();
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


FGMap.prototype.follows_always_center_set = function(follows_always_center) {
    if(this.follows_always_center == follows_always_center)
        return;
    this.follows_always_center = follows_always_center;
    if(follows_always_center) {
        this.follows_update();
    }
};


FGMap.prototype.linktomap_update = function() {

    if(!this.gmap)
        return;

    var zoomlevel = this.gmap.getZoom();
    var maptype = this.gmap.getCurrentMapType();
    var center = this.gmap.getCenter();

    var href = "";

    // GMap settings
    href += "?ll=" + center.lat() + "," + center.lng();
    href += "&z=" + zoomlevel;
    href += "&t=" + (maptype == G_NORMAL_MAP ? "m" :
                        (maptype == G_SATELLITE_MAP ? "s" : "h"));
    
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

    // Update internval
    href += "&update_interval=" + (this.update_interval / 1000);

    // Pilot label mode
    href += '&pilot_label=';
    if(this.info_type == FGMAP_PILOT_INFO_OFF) {
        href += 'off';
    } else if(this.info_type == FGMAP_PILOT_INFO_ALWAYS) {
        href += 'always';
    } else if(this.info_type == FGMAP_PILOT_INFO_FOLLOWS) {
        href += 'follows';
    } else if(this.info_type == FGMAP_PILOT_INFO_MOUSEOVER) {
        href += 'mouseover';
    }

    // Icon mode
    href += '&icon_mode=';
    if(this.aircraft_icon_mode == FGMAP_ICON_MODE_NORMAL) {
        href += 'normal';
    } else if(this.aircraft_icon_mode == FGMAP_ICON_MODE_PHOTO) {
        href += 'photo';
    } else if(this.aircraft_icon_mode == FGMAP_ICON_MODE_DOT) {
        href += 'dot';
    }

    // Pilot filters
    if(this.pilots_filters) {
        var f;
        if((f = this.pilots_filters[FGMAP_PILOTS_FILTER_TYPE_CALLSIGN])
                != null && f.str && f.str != '') {
            href += '&pilots_filter_callsign=';
            if(!f.cond) {
                href += '!';
            }
            href += f.str;
        }
        if((f = this.pilots_filters[FGMAP_PILOTS_FILTER_TYPE_AIRCRAFT])
               != null && f.str && f.str != '') {
            href += '&pilots_filter_aircraft=';
            if(!f.cond) {
                href += '!';
            }
            href += f.str;
        }
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

    if(this.gmap) {
        this.gmap.checkResize();
    }
    this.event_callback_call(FGMAP_EVENT_MAP_RESIZE);
};






/* Airport and Nav stuff */


/* FGNav abstract class */
function FGNav(fgmap, type, id, code, name) {
    this.fgmap = fgmap;
    this.type = type;
    this.id = id;
    this.code = code;
    this.name = name;

    this.visible = false;
    this.initialized = false;
}


FGNav.prototype.init = function() {

    if(this.initialized == false) {

        this.initialized = this.setup();

        if(this.initialized == false)
            return false;
    }

    return true;
};


/* Abstract methods */
FGNav.prototype.setup = function() {};
FGNav.prototype.visible_set = function(visible) {};
FGNav.prototype.center_get = function() {};
FGNav.prototype.remove = function() {};
FGNav.prototype.raise = function() {};



/* FGMap */

FGMap.prototype.nav_add = function(nav) {

    if(!(nav instanceof FGNav)) {
        return false;
    }

    if(nav.id == null) {
        return false;
    }

    if(this.navs == null) {
        this.navs = new Object();
    }

    if(this.navs[nav.id] == null) {
        this.navs[nav.id] = nav;
    }

    return true;
};


FGMap.prototype.nav_remove = function(nav_id) {

    var nav = this.nav_get(nav_id);

    if(nav != null) {
        delete this.navs[nav.id];
        return true;
    }

    return false;
};


FGMap.prototype.nav_clear = function() {
    for(var n in this.navs) {
        var nav = this.navs[n];
        nav.visible_set(false);
        nav.remove();
        delete(nav);
    }
    delete(this.navs);
    this.navs = null;
};


FGMap.prototype.nav_get = function(nav_id) {
    return this.navs[nav_id];
};


FGMap.prototype.is_nav_loaded = function(nav_id) {
    return (this.navs[nav_id] != null);
};


FGMap.prototype.nav_visible_set = function(nav_id, visible) {

    var nav = this.navs[nav_id];

    if(nav == null)
        return false;

    if(nav.init() == false)
        return false;

    return (nav.visible_set(visible));
};


FGMap.prototype.nav_panto = function(nav_id) {

    var nav = this.navs[nav_id];

    if(nav == null)
        return false;

    if(nav.init() == false)
        return false;

    var latlng = nav.center_get();

    if(latlng) {
        this.gmap.setCenter(latlng);
        return true;
    }

    return false;
};


FGMap.prototype.nav_type_visible_set = function(nav_type, visible) {

    // TODO: See if we need to optimize this function

    for(var n in this.navs) {
        var nav = this.navs[n];
        if(nav.type == nav_type) {
            nav.init();
            nav.visible_set(visible);
        }
    }
};



/* FGAirport */
function FGAirport(fgmap, id, code, name, elevation) {

    FGNav.apply(this, [ fgmap, FGMAP_NAVAID_APT, id, code, name ]);

    this.elevation = elevation;
    this.label = null;

    this.atcs = null;
    this.bounds = new GLatLngBounds();

    this.runways = null;
    this.rwy_cnt = 0;
}
FGAirport.prototype = new FGNav();


/* TODO: name */
FGAirport.prototype.atc_add = function(atc_type, freq, name) {

    if(this.atcs == null) {
        this.atcs = new Object(); 
    }

    if(this.atcs[atc_type] == null) {
        this.atcs[atc_type] = [ freq ];
    } else {
        this.atcs[atc_type].push(freq);
    }
};


FGAirport.prototype.runway_add = function(num, lat, lng,
                                            heading, length, width) {
    var runway = new Object();
    runway.num = num;
    runway.lat = lat;
    runway.lng = lng;
    runway.heading = heading;
    runway.length = length;
    runway.width = width;

    if(this.runways == null) {
        this.runways = new Object();
    }

    this.runways[num] = runway;
    this.rwy_cnt += 1;

    return true;
};


/* This includes ILS, GS, OM/MM/IM.
 * freq, range, angle, heading are optional */
FGAirport.prototype.ils_add = function(num, ils_hash) {

    /* type, ident, name, lat, lng, elevation, freq, channel, range, heading, angle /* for GS */
    var runway;

    if((runway = this.runways[num]) == null)
        return false;

    /*
    var ils = new Object();
    ils.type = type;
    ils.ident = ident;
    ils.name = name;
    ils.lat = lat;
    ils.lng = lng;
    ils.elevation = elevation;
    ils.freq = freq;
    ils.channel = channel;
    ils.range = range;
    ils.heading = heading;
    ils.angle = angle;
    */

    if(runway.ilss == null) {
        runway.ilss = new Object();
    }

    runway.ilss[ils_hash.type] = ils_hash;

    return true;
};


FGAirport.prototype.setup = function() {
    this.runway_setup();
    this.airport_setup();
    return true;
};


FGAirport.prototype.ils_setup = function(runway) {

    var ils_range = 0;
    var ils_course_length = 40000;
    var ils_course_side_length = ils_course_length + 2000;
    var ils_course_angle = 6;
    var ils_course_color = '#ffff00';
    var ils_course_line_width = 2;
    var ils_course_opacity = 1.0;
    //var ils_course_step = 5;

    var ils_marker_step = 5;

    var elem = runway.label_elem;
    var img, imgsrc, imgdimen, wh;
    var hdg;

    var ils_heading;

    element_text_append(elem, "\u00a0");

    // ILS toggle icon
    img = runway.ils_toggle_img = element_create(elem, "img");

    if(USER_AGENT.is_ie) {
        img.src = "images/nav_icons/ils-off.ie.png";
    } else {
        img.src = "images/nav_icons/ils-off.png";
    }

    img.style.cursor = "pointer";
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.verticalAlign = "middle";
    img.title = "Toggle ILS details";
    attach_event(img, "click",
        this.ils_toggle_img_click_cb.bind_event(this, runway));
    //img_ie_fix(img);

    /*
    var ils;

    // Pick either the full ILS of LOC for the ident and details
    if((ils = runway.ilss[FGMAP_ILS_TYPE_ILS]) == null) { 
        ils = runway.ilss[FGMAP_ILS_TYPE_LOC];
    }

    var div = runway.ils_table = element_create(elem, "div");
    element_opacity_set(div, FGMAP_NAV_OPACITY);
    div.style.display = "block";

    var span = element_create(div, "span");
    span.className = "fgmap_nav_ils";
    //element_text_append(span, ils.name + " - " + ils.ident);
    element_text_append(span, ils.ident + " " + ils.freq);

    */

    var ils;

    element_create(elem, 'br');
    var div = runway.ils_detail = element_create(elem, 'div');
    element_opacity_set(div, FGMAP_NAV_OPACITY);
    var span = element_create(div, 'span');
    span.className = "fgmap_nav_ils";

    if((ils = runway.ilss[FGMAP_ILS_TYPE_ILS]) != null) {
        element_text_append(span, ils.type_name);
    } else if((ils = runway.ilss[FGMAP_ILS_TYPE_LOC]) != null) {
        element_text_append(span, 'Loc');
    } else {
        // Hmm...
    }

    if(ils) {
        ils_heading = ils.heading;
    }

    // Use ILS/LOC's range for the length of the ILS dart
    // Commented out as it seems too long
    /*
    if(ils) {
        ils_course_length = ils.range * 6076.1155;
        ils_course_side_length = ils_course_length + 2000;
        //GLog.write(ils_course_length + ':' + ils_course_side_length);
    }
    */

    /* Glide slope angle */
    if((ils = runway.ilss[FGMAP_ILS_TYPE_GS]) != null) {

        element_text_append(span, "\u00a0\u00a0");

        element_text_append(span, 'GS ' +
            runway.ilss[FGMAP_ILS_TYPE_GS].angle + "\u00b0");

        this.ils_visible_set(runway, false);
    }

/*
    // Course image
    img = element_create(null, "img");
    hdg = Math.round(ils.heading);
    hdg = hdg - (hdg % ils_course_step);
    img.src = FGMAP_ILS_COURSE_ICON + '-' +
        hdg + FGMAP_ILS_COURSE_ICON_SUFFIX;
    wh = dimen_to_wh(FGMAP_ILS_COURSE_ICON_DIMEN);
    img.style.width = wh.w;
    img.style.height = wh.h;

    ils.course = new GMapElement(this.fgmap,
        num + ":ilscourse:" + ils.ident, FGMAP_NAVAID_ILS,
        ils.ident, ils.name, p2.lat(), p2.lng(), null, imgsrc, imgdimen);
    ils.course.init();
    ils.course.visible_set(false);
    img_ie_fix(img);
*/

    // Course drawing, made of 5 lines
    var latlng = new GLatLng(runway.lat, runway.lng);
    var hdg = rev_deg(runway.heading);

    var spt = latlng_dist_heading(latlng, runway.length / 2.0, hdg);

    var ept1 = latlng_dist_heading(spt, ils_course_length, hdg);

    if(runway.ils_course_lines == null) {
        runway.ils_course_lines = new Array();
    }

    var line;

    line = new GPolyline([spt, ept1],
            ils_course_color, ils_course_line_width, ils_course_opacity);
    runway.ils_course_lines.push(line);

    var ept2 = latlng_dist_heading(spt, ils_course_side_length,
            hdg - ils_course_angle / 2);
    line = new GPolyline([spt, ept2],
            ils_course_color, ils_course_line_width, ils_course_opacity);
    runway.ils_course_lines.push(line);

    var ept3 = latlng_dist_heading(spt, ils_course_side_length,
            hdg + ils_course_angle / 2);
    line = new GPolyline([spt, ept3],
            ils_course_color, ils_course_line_width, ils_course_opacity);
    runway.ils_course_lines.push(line);

    line = new GPolyline([ept1, ept2],
            ils_course_color, ils_course_line_width, ils_course_opacity);
    runway.ils_course_lines.push(line);

    line = new GPolyline([ept1, ept3],
            ils_course_color, ils_course_line_width, ils_course_opacity);
    runway.ils_course_lines.push(line);

    // Debug
    /*
    if(runway.num == '28R') {
        this.fgmap.gmap.addOverlay(new GMarker(spt));
        this.fgmap.gmap.addOverlay(new GMarker(ept1));
        this.fgmap.gmap.addOverlay(new GMarker(ept2));
        this.fgmap.gmap.addOverlay(new GMarker(ept3));
    }
    */

    var span;

    /* ILS heading label */
    var ils_hdg_elem = element_create(null, 'div');
    ils_hdg_elem.className = 'fgmap_nav_info';

    span = element_create(ils_hdg_elem, 'span');
    span.style.textAlign = 'center';
    span.className = 'fgmap_nav_ils';
    element_text_append(span, ils_heading + "\u00b0");
    attach_event(span, "mouseover",
        this.runway_mouseover_cb.bind_event(this, runway));
    runway.ils_hdg_label = new GMapElement(
            latlng_dist_heading(spt, ils_course_length / 2, hdg),
            new GPoint(-10, -10),
            ils_hdg_elem);
    this.fgmap.gmap.addOverlay(runway.ils_hdg_label);
    runway.ils_hdg_label.hide();
    runway.ils_hdg_label.opacity_set(FGMAP_NAV_OPACITY);


    // For each ILS type, add the icon/info, if needed
    for(var ii in runway.ilss) {

        var info_elem = null;
        span = null;

        imgdimen = null;
        
        ils = runway.ilss[ii];

        /* debugging */
        /*
        var dummy = new GMarker(new GLatLng(ils.lat, ils.lng),
                {title:FGMAP_ILS_NAMES[ii] + ":" + ils.name + ":" + ils.ident});
        this.fgmap.gmap.addOverlay(dummy);
        */

        if(ii == FGMAP_ILS_TYPE_ILS ||
            ii == FGMAP_ILS_TYPE_LOC) {

            imgsrc = FGMAP_ILS_LOC_ICON;
            imgdimen = FGMAP_ILS_LOC_ICON_DIMEN;

            info_elem = element_create(null, 'div');
            span = element_create(info_elem, 'span');
            element_text_append(span, runway.num +
                ' Localizer ' + ils.freq);
            element_create(span, 'br');
            element_text_append(span, ils.ident);  /* morse code? */
            element_create(span, 'br');
            element_text_append(span, "Chan " + ils.channel);

        } else if(ii == FGMAP_ILS_TYPE_IM ||
            ii == FGMAP_ILS_TYPE_MM ||
            ii == FGMAP_ILS_TYPE_OM) {

            imgsrc = FGMAP_ILS_MARKER_ICON;
            hdg = Math.round(ils.heading);
            hdg = hdg - (hdg % ils_marker_step);
            if(hdg == 360) {
                hdg = 0;
            }
            imgsrc += '-' + hdg + FGMAP_ILS_MARKER_ICON_SUFFIX;
            imgdimen = FGMAP_ILS_MARKER_ICON_DIMEN;

            info_elem = element_create(null, 'div');
            span = element_create(info_elem, 'span');
            element_text_append(span, runway.num + ' ' +
                FGMAP_ILS_NAMES[ii]);

        } else if(ii == FGMAP_ILS_TYPE_DME) {

            imgsrc = FGMAP_ILS_LOCDME_ICON;
            imgdimen = FGMAP_ILS_LOCDME_ICON_DIMEN;

        } else if(ii == FGMAP_ILS_TYPE_GS) {
            // TODO
            continue;
        } else {
            // TODO
            GLog.write("Got unknown ILS type [" + ii + "]");
            continue;
        }

        /*
        ils.icon = new FGNavMarker(this.fgmap,
            runway.num + ":ils:" + ii + ils.ident, FGMAP_NAVAID_ILS,
            ils.ident, ils.name, ils.lat, ils.lng, div, imgsrc, imgdimen);
        ils.icon.init();
        ils.icon.visible_set(false);
        */

        img = element_create(null, "img");
        img.src = imgsrc;
        wh = dimen_to_wh(imgdimen);
        img.style.width = str_to_pos(wh.w);
        img.style.height = str_to_pos(wh.h);
        img_ie_fix(img);

        ils.icon = new GMapElement(new GLatLng(ils.lat, ils.lng),
                new GPoint(-wh.w / 2, -wh.h / 2),
                img, null, null);
        this.fgmap.gmap.addOverlay(ils.icon);
        ils.icon.visible_set(false);

        attach_event(img, "mouseover",
            this.runway_mouseover_cb.bind_event(this, runway));

        if(info_elem && span) {
            span.className = 'fgmap_nav_ils';
            info_elem.style.textAlign = 'center';
            info_elem.className = 'fgmap_nav_info';
            ils.info = new GMapElement(new GLatLng(ils.lat, ils.lng),
                    new GPoint(10, 15),
                    info_elem);
            ils.info.opacity_set(FGMAP_NAV_OPACITY);
            this.fgmap.gmap.addOverlay(ils.info);
            ils.info.visible_set(false);

            attach_event(info_elem, "mouseover",
                this.runway_mouseover_cb.bind_event(this, runway));
        }
    }

    /* Silly, but it works */
    runway.ils_toggle = true;
    this.ils_toggle(runway);
};


FGAirport.prototype.runway_setup = function() {

    // TODO: Move these somewhere else better?
    // Runway stuff
    var runway_opacity = FGMAP_NAV_OPACITY;
    var runway_color = "#0000ff";
    var runway_opacity = FGMAP_NAV_OPACITY;
    var runway_width = 3;
    var runway_info_offset = 1000;


    if(this.rwy_cnt <= 0) {
        return false;
    }

    for(var r in this.runways) {

        var runway = this.runways[r];

        var num = runway.num;
        var lat = runway.lat;
        var lng = runway.lng;
        var heading = runway.heading;
        var length = runway.length;

        var latlng = new GLatLng(lat, lng);
        var p1 = latlng_dist_heading(latlng, length / 2.0, heading);
        var p2 = latlng_dist_heading(latlng, length / 2.0, rev_deg(heading));

        // The runway line
        runway.polyline = new GPolyline([ p1, p2 ],
                                    runway_color, runway_width, runway_opacity);

        // Start building the airport bounds
        this.bounds.extend(p1);
        this.bounds.extend(p2);

        var elem = runway.label_elem = element_create(null, "div");
        elem.className = "fgmap_runway_info";
        element_text_append(elem, num);
        element_text_append(elem, " (" + heading + "\u00b0)");


        // Calculating/Adjusting the position for the runway label
        var hdg = rev_deg(heading);
        var len = (length / 2.0) + runway_info_offset;
        var q = deg_to_quad(hdg);

        var runway_info_align_x = 0;
        var runway_info_align_y = 0;

        if(q == 0 || q == 3) {
            len += runway_info_offset / 2;
        }

        if(num.match(/\d+L$/i)) {
            if(q == 2) {
                hdg += 25;
            } else {
                hdg += 15;
            }
        } else if(num.match(/\d+R$/i)) {
            if(q == 0) {
                hdg -= 25;
            } else {
                hdg -= 15;
            }
        }


        var label = runway.label =
            new GMapElement(latlng_dist_heading(latlng, len, hdg),
                        new GPoint(runway_info_align_x, runway_info_align_y),
                        elem /*, G_MAP_MARKER_SHADOW_PANE */);
        attach_event(elem, "mouseover",
            this.runway_mouseover_cb.bind_event(this, runway));

        this.fgmap.gmap.addOverlay(label);
        label.hide();
        label.opacity_set(runway_opacity);

        if(runway.ilss) {
            this.ils_setup(runway);
        }
    }

    return true;
};



FGAirport.prototype.airport_setup = function() {

    if(this.label != null) {
        return true;
    }

    /* TODO: seaport */

    var airport_info_opacity = FGMAP_NAV_OPACITY;
    var airport_info_align = new GPoint(48, 0);

    var elem = element_create(null, "div");
    elem.className = "fgmap_airport_info";
    elem.style.padding = '4px';

    element_event_bubble_cancel(elem);

    var span;

    span = element_create(elem, "span");
    span.className = "fgmap_airport_info_name";
    element_text_append(span, this.name + '-');

    //element_text_append(elem, " - ");

    span = element_create(elem, "span");
    span.className = "fgmap_airport_info_code";
    element_text_append(span, this.code);

    element_text_append(elem, "\u00a0");

    var div;
    var img;
    
    img = this.details_toggle_img = element_create(elem, "img");
    img.style.cursor = "pointer";
    //img.style.width = "12px";
    //img.style.height = "6px";
    //img_ie_fix(img);
    img.style.verticalAlign = "middle";
    img.title = "Toggle airport details";
    attach_event(img, "click",
        this.details_toggle_img_click_cb.bind_event(this));

    element_create(elem, "br");

    div = this.details_div = element_create(elem, 'div');
    div.style.position = 'relative';
    div.style.display = 'block';
    div.style.overflow = 'hidden';
    div.style.minWidth = '168px';
    div.style.maxWidth = '256px';
    div.style.width = '184px';
    div.style.height = '128px';
    //div.style.paddingTop = '6px';
    //div.style.paddingBottom = '10px';
    element_hide(div);
    //element_event_bubble_cancel(div);

    var tabdiv;
    tabdiv = this.details_tabdiv = new FGTabbedDiv(this.details_div);
    this.details_visible_set(false);


    // General airport details info tab
    div = element_create(null, 'div');
    div.style.maxWidth = '256px';
    div.style.width = '168px';

    var tbody = element_create(element_create(div, 'table'), 'tbody');
    var tr, td;

    tr = element_create(tbody, 'tr');
    td = element_create(tr, 'td');
    td.className = 'fgmap_airport_info_elevation';
    td.style.verticalAlign = 'top';
    element_text_append(td, 'Elevation:');
    td = element_create(tr, 'td');
    td.className = 'fgmap_airport_info_elevation';
    td.style.verticalAlign = 'top';
    element_text_append(td, this.elevation + 'ft');

    tr = element_create(tbody, 'tr');
    td = element_create(tr, 'td');
    td.className = 'fgmap_airport_info_runways';
    td.style.verticalAlign = 'top';
    element_text_append(td, 'Runways:');

    td = element_create(tr, 'td');
    td.className = 'fgmap_airport_info_runways';
    td.style.verticalAlign = 'top';
    td.style.whiteSpace = 'normal';

    if(this.rwy_cnt > 0) {
        element_text_append(td, ' ');
        var n = 0;
        for(var r in this.runways) {
            if(n != 0) {
                element_text_append(td, ', ');
            }
            element_text_append(td, r);
            n++;
        }
    }

    element_create(div, 'br');

    this.details_tabdiv.tab_add("info", "info", div);


    // ATC details tab
    if(this.atcs) {

        var table = null;
        var tbody, tr, td;

        for(var type in this.atcs) {

            /* TODO */
            if(type == FGMAP_ATC_TYPE_ATIS || type == FGMAP_ATC_TYPE_TWR) {

                if(table == null) {
                    table = this.atc_table = element_create(null, "table");
                    table.style.display = "block";
                    table.cellPadding = '2px';
                    table.cellSpacing = 0;
                    table.border = 0;
                    table.width = '100%';
                    tbody = element_create(table, "tbody");
                }

                var span_class = (type == FGMAP_ATC_TYPE_ATIS ?
                                    "fgmap_airport_info_atc_atis" :
                                    "fgmap_airport_info_atc_tower");

                for(var i = 0; i < this.atcs[type].length; i++) {

                    tr = element_create(tbody, "tr");

                    td = element_create(tr, "td");
                    td.className = span_class;
                    element_text_append(td, FGMAP_ATC_TYPES[type]);
                    
                    td = element_create(tr, "td");
                    td.className = span_class;
                    element_text_append(td, this.atcs[type][i]);
                }
            }
        }

        if(table != null) {
            div = element_create(null, 'div');
            div.style.overflow = 'auto';
            //element_event_bubble_cancel(div);
            element_attach(table, div);
            this.details_tabdiv.tab_add("atc", "atc", div);
        }
    }


    // Metar tab
    this.metar_div = element_create(null, 'div');
    this.metar_div.style.overflow = 'auto';
    var metar = new Object();
    metar.onfocus = this.metar_update.bind_event(this);
    this.details_tabdiv.tab_add("metar", "metar", this.metar_div, metar);


    // Links tab
    div = element_create(null, 'div');
    this.details_tabdiv.tab_add("links", "links", div);

    var lnk;
    
    lnk = element_create(div, 'a');
    lnk.href = 'http://worldaerodata.com/wad.cgi?apt_nv=1&search=' + this.code;
    lnk.target = '_blank';
    element_text_append(lnk, "World Aero Data");

    element_create(div, 'br');

    lnk = element_create(div, 'a');
    lnk.href = 'http://www.airnav.com/airport/' + this.code;
    lnk.target = '_blank';
    element_text_append(lnk, "AirNav (U.S. only)");


    if(!this.bounds.isEmpty())
    {
        this.label = new GMapElement(this.bounds.getNorthEast(),
                                        airport_info_align, elem
                                        /*, G_MAP_MARKER_SHADOW_PANE */);
        this.fgmap.gmap.addOverlay(this.label);
        this.label.hide();
        this.label.opacity_set(airport_info_opacity);
        attach_event(elem, "click",
            this.airport_mousemove_cb.bind_event(this));
    }

    return true;
};


FGAirport.prototype.metar_xml_cb = function() {

    this.metar_loaded = true;

    if(this.metar_request.readyState == 4) {

        this.metar_div.innerHTML = "";
        var xmldoc = this.metar_request.responseXML;

        if(xmldoc.documentElement == null) {
            this.metar_div.innerHTML = "No METAR info available";
            return;
        }

        var metars = xmldoc.documentElement.getElementsByTagName('metar');
        var fields = metars[0].getElementsByTagName('field');

        var table = element_create(null, 'table');
        var tbody = element_create(table, 'tbody');
        var tr, td;

        var raw, day, time;

        for(var i = 0; i < fields.length; i++) {

            var n = fields[i].getAttribute('name');
            var v = fields[i].getAttribute('value');

            if(n == "" || v == "") {
                continue;
            } else if(n == 'Raw') {
                /* TODO */
                raw = v;
                continue;
            } else if(n == 'Day') {
                /* TODO */
                day = v;
                continue;
            }

            tr = element_create(tbody, 'tr');
            td = element_create(tr, 'td');
            td.className = 'fgmap_airport_info_metar';
            td.style.verticalAlign = 'top';
            td.style.whiteSpace = 'normal';
            element_text_append(td, n);

            td = element_create(tr, 'td');
            td.className = 'fgmap_airport_info_metar';
            td.style.verticalAlign = 'top';
            td.style.whiteSpace = 'normal';
            element_text_append(td, v);
        }

        element_attach(table, this.metar_div);
        element_create(this.div, 'br');

        var div = element_create(this.metar_div, 'div');
        div.style.textAlign = 'center';
        div.style.padding= '12px 0px 24px 0px';

        var span = element_create(div, 'span');
        span.className = 'fgmap_airport_info_metar';
        span.style.textAlign = 'center';
        span.style.textDecoration = 'underline';
        span.style.cursor = 'pointer';
        element_text_append(span, 'Update now');

        var apt = this;
        span.onclick = function() {
            apt.metar_loaded = false;
            apt.metar_update();
        }

    } else if(this.metar_request.readyState > 4) {
        this.metar_div.innerHTML = "No METAR info available";
    }

};


FGAirport.prototype.metar_update = function() {
    if(this.metar_loaded)
        return;
    this.metar_div.innerHTML = "";
    element_create(this.metar_div, 'br');
    element_text_append(this.metar_div, 'Loading METAR...');

    var url;
    var loc = window.location;
    
    // TODO
    if(loc.hostname.match(/^mpmap02\./i) ||
            loc.hostname.match(/^mpserver02\./i) ||
            loc.hostname.match(/^pigeond\.net/i) ||
            loc.hostname.match(/^localhost/i)) {
        url = "fg_metar_xml.cgi";
    } else {
        url = "fg_metar_xml_proxy.cgi";
    }

    url += "?" + this.code;

    this.metar_request = GXmlHttp.create();
    this.metar_request.open('GET', url, true);
    this.metar_request.onreadystatechange = this.metar_xml_cb.bind_event(this);
    this.metar_request.send(null);
};

FGAirport.prototype.airport_mousedown_cb = function(e) {
    if(e) {
        // TODO
        e.cancelBubble = false;
    }
}

FGAirport.prototype.airport_mousemove_cb = function(e) {
    this.raise();
};


FGAirport.prototype.runway_mouseover_cb = function(e, runway) {
    this.raise();
    this.runway_raise(runway);
};


FGAirport.prototype.runways_raise = function() {
    for(var r in this.runways) {
        this.runway_raise(this.runways[r]);
    }
};


FGAirport.prototype.runway_raise = function(runway) {

    if(runway.ils_toggle) {
        for(var ii in runway.ilss) {
            var ils = runway.ilss[ii];
            if(ils.icon) {
                ils.icon.raise();
            }
            if(ils.info) {
                ils.info.raise();
            }
        }
    }

    if(runway.label) {
        runway.label.raise();
    }

    if(runway.ils_hdg_label) {
        runway.ils_hdg_label.raise();
    }
};


FGAirport.prototype.airport_raise = function() {
    if(this.label) {
        this.label.raise();
    }
};


FGAirport.prototype.raise = function() {
    this.runways_raise();
    this.airport_raise();
};


FGAirport.prototype.details_visible_set = function(visible) {
    if(this.details_div) {
        if(visible) {
            this.details_toggle_img.src = "images/arrow_up.gif";
            element_show(this.details_div);
            this.details_tabdiv.reconfigure();  // FIXME
            this.airport_raise();
        } else {
            this.details_toggle_img.src = "images/arrow_down.gif";
            element_hide(this.details_div);
        }
    }
};


FGAirport.prototype.details_toggle_img_click_cb = function(e) {
    this.details_visible_set(this.details_div.style.display != "block");
};


FGAirport.prototype.ils_visible_set = function(runway, visible) {

    if(runway.ilss == null) {
        return;
    }

    if(runway.ils_toggle) {

        if(visible) {
            if(runway.ils_course_lines) {
                for(var i = 0; i < runway.ils_course_lines.length; i++) {
                    this.fgmap.gmap.addOverlay(runway.ils_course_lines[i]);
                }
            }
        } else {
            if(runway.ils_course_lines) {
                for(var i = 0; i < runway.ils_course_lines.length; i++) {
                    this.fgmap.gmap.removeOverlay(runway.ils_course_lines[i]);
                }
            }
        }

        runway.ils_hdg_label.visible_set(visible);

        for(var ii in runway.ilss) {
            ils = runway.ilss[ii];
            if(ils.icon) {
                ils.icon.visible_set(visible);
            }
            if(ils.info) {
                ils.info.visible_set(visible);
            }
        }
    }
};


FGAirport.prototype.ils_toggle = function(runway) {

    if(runway.ilss == null) {
        return;
    }

    runway.ils_toggle = !runway.ils_toggle;

    for(var ii in runway.ilss) {
        ils = runway.ilss[ii];
        if(ils.icon) {
            ils.icon.visible_set(runway.ils_toggle);
        }
        if(ils.info) {
            ils.info.visible_set(runway.ils_toggle);
        }
    }

    if(runway.ils_toggle) {
        if(USER_AGENT.is_ie) {
            runway.ils_toggle_img.src = "images/nav_icons/ils-on.ie.png";
        } else {
            runway.ils_toggle_img.src = "images/nav_icons/ils-on.png";
        }
        if(runway.ils_detail) {
            element_show(runway.ils_detail);
        }
        if(runway.ils_hdg_label) {
            runway.ils_hdg_label.show();
        }
        if(runway.ils_course_lines) {
            for(var i = 0; i < runway.ils_course_lines.length; i++) {
                this.fgmap.gmap.addOverlay(runway.ils_course_lines[i]);
            }
        }

        this.runway_raise(runway);

    } else {
        if(USER_AGENT.is_ie) {
            runway.ils_toggle_img.src = "images/nav_icons/ils-off.ie.png";
        } else {
            runway.ils_toggle_img.src = "images/nav_icons/ils-off.png";
        }
        if(runway.ils_detail) {
            element_hide(runway.ils_detail);
        }
        if(runway.ils_hdg_label) {
            runway.ils_hdg_label.hide();
        }
        if(runway.ils_course_lines) {
            for(var i = 0; i < runway.ils_course_lines.length; i++) {
                this.fgmap.gmap.removeOverlay(runway.ils_course_lines[i]);
            }
        }
    }
}

FGAirport.prototype.ils_toggle_img_click_cb = function(e, runway) {
    if(!runway)
        return;
    this.ils_toggle(runway);
};


FGAirport.prototype.visible_set = function(visible) {

    if(this.visible == visible) {
        return true;
    }

    if(visible) {

        for(var r in this.runways) {
            var runway = this.runways[r];
            if(runway.polyline) {
                this.fgmap.gmap.addOverlay(runway.polyline);
            }
            if(runway.label) {
                runway.label.show();
            }
            this.ils_visible_set(runway, visible);
        }

        if(this.label)
            this.label.show();

    } else {

        for(var r in this.runways) {
            var runway = this.runways[r];
            if(runway.polyline) {
                this.fgmap.gmap.removeOverlay(runway.polyline);
            }
            if(runway.label) {
                runway.label.hide();
            }
            this.ils_visible_set(runway, visible);
        }

        if(this.label)
            this.label.hide();
    }

    this.visible = visible;

    return true;
};


FGAirport.prototype.center_get = function() {
    return this.bounds.getCenter();
};


FGAirport.prototype.remove = function() {

    for(var r in this.runways) {

        var runway = this.runways[r];

        if(runway.polyline) {
            this.fgmap.gmap.removeOverlay(runway.polyline)
        }
        if(runway.label) {
            this.fgmap.gmap.removeOverlay(runway.label);
            delete(runway.label);
        }

        delete(runway.ilss); // TODO: possible leak
    }

    if(this.label)
        this.fgmap.gmap.removeOverlay(this.label);

    delete(this.runways);
};



/* FGNavMarker, the simple marker class for things like VOR/NDB  */
function FGNavMarker(fgmap, id, type, code, name, lat, lng, info_elem,
    imgsrc, imgdimen) {

    FGNav.apply(this, [ fgmap, type, id, code, name ]);
    this.latlng = new GLatLng(lat, lng);

    this.img = null;
    this.info_elem = info_elem;
    this.imgsrc = imgsrc;
    this.imgdimen = imgdimen;
}

FGNavMarker.prototype = new FGNav();


FGNavMarker.prototype.setup = function() {

    var align;
    var dimen;
    var w, h;
    var img;
    var src;


    /* Image marker */
    src = this.imgsrc || FGMAP_NAVAID_ICONS[this.type];

    if(src == null) {
        /* TODO */
    } else {

        var img = element_create(null, "img");
        img.src = src;

        if((dimen = this.imgdimen) != null) {
            // Do nothing
        } else if((dimen = FGMAP_NAVAID_ICONS_DIMEN[this.type]) == null) {
            w = 32;
            h = 32;
        }

        var wh = dimen_to_wh(dimen);
        w = wh.w;
        h = wh.h;
        
        img.style.width = w + "px";
        img.style.height = h + "px";
        img_ie_fix(img);
        
        align = new GPoint(w / -2, h / -2);
        this.img = new GMapElement(this.latlng, align,
                                    img
                                    /*, G_MAP_MARKER_SHADOW_PANE */);
        attach_event(img, "mouseover", this.info_mouseover_cb.bind_event(this));
        this.fgmap.gmap.addOverlay(this.img);
        this.img.hide();
    }


    /* Info elem */
    if(this.info_elem != null) {

        this.info_elem.className = "fgmap_nav_info";
        this.info_elem.style.textAlign = "center";

        // TODO
        align = new GPoint(w * 3 / 4, h / -2);

        this.info = new GMapElement(this.latlng, align,
                                    this.info_elem
                                    /*, G_MAP_MARKER_SHADOW_PANE */);

        /* Debug */
        //this.fgmap.gmap.addOverlay(new GMarker(this.latlng));

        this.fgmap.gmap.addOverlay(this.info);
        this.info.hide();

        this.info.opacity_set(FGMAP_NAV_OPACITY);

        attach_event(this.info_elem, "mouseover",
            this.info_mouseover_cb.bind_event(this));
    }

    return true;
};


FGNavMarker.prototype.info_mouseover_cb = function(e) {
    this.raise();
};


FGNavMarker.prototype.raise = function() {
    if(this.info)
        this.info.raise();
    if(this.img)
        this.img.raise();
};


FGNavMarker.prototype.visible_set = function(visible) {

    if(this.visible == visible) {
        return true;
    }

    if(visible) {
        if(this.img)
            this.img.show();
        if(this.info)
            this.info.show();
    } else {
        if(this.img)
            this.img.hide();
        if(this.info)
            this.info.hide();
    }

    this.visible = visible;
    return true;
};


FGNavMarker.prototype.center_get = function() {
    return this.latlng;
};


FGNavMarker.prototype.remove = function() {

    this.visible_set(false);

    if(this.img) {
        this.fgmap.gmap.removeOverlay(this.img);
        delete(this.img);
    }

    if(this.info) {
        this.fgmap.gmap.removeOverlay(this.info);
        delete(this.info);
    }
};



/* FGRadioNav includes VOR VORTAC VOR-DME TACAN NDB NDB-DME DME */
/* FGRadioNav inherits FGNavMarker */

function FGRadioNav(fgmap, id, type, code, name, lat, lng, freq, channel) {

    var elem = element_create(null, "div");

    var span = element_create(elem, "span");
    span.className = FGMAP_NAV_INFO_CLASSES[type];
    span.style.textAlign = "center";
    element_text_append(span, name + " " + FGMAP_NAVAID_NAMES[type]);
    element_create(span, "br");

    if(freq) {
        element_text_append(span, freq);
        element_text_append(span, "\u00a0\u00a0\u00a0");
    }

    element_text_append(span, code);

    if(channel) {
        element_text_append(span, "\u00a0\u00a0\u00a0");
        element_text_append(span, channel);
    }

    FGNavMarker.apply(this,
        [ fgmap, id, type, code, name, lat, lng, elem ]);
}
FGRadioNav.prototype = new FGNavMarker();



/* FGNavFix inherits FGNavMarker */
function FGNavFix(fgmap, id, name, lat, lng) {

    var elem = element_create(null, "div");

    var span = element_create(elem, "span");
    span.className = "fgmap_nav_fix";
    element_text_append(span, name);

    FGNavMarker.apply(this,
        [ fgmap, id, FGMAP_NAVAID_FIX, name, name, lat, lng, elem ]);
}
FGNavFix.prototype = new FGNavMarker();


/* FGNavAirway */
function FGNavAirway(fgmap, id, awy_hash) {
    this.awy_hash = awy_hash;
    FGNav.apply(this, [ fgmap, FGMAP_NAVAID_AWY, id,
        awy_hash['seg_name'],
        awy_hash['name_start'] + ' .. ' + awy_hash['name_end'] ]);
}
FGNavAirway.prototype = new FGNav();

FGNavAirway.prototype.setup = function() {

    var awy_high_color = '#ffb972';
    var awy_low_color = '#ff8000';
    var awy_width = 2;
    var awy_opacity = 0.8;
    var awy_align = new GPoint(-34, -16);

    var latlng_start = new GLatLng(
            this.awy_hash['lat_start'], this.awy_hash['lng_start']);

    var latlng_end = new GLatLng(
            this.awy_hash['lat_end'], this.awy_hash['lng_end']);

    this.polyline = new GPolyline([ latlng_start, latlng_end ],
        (this.awy_hash['route'] == 'high' ? awy_high_color : awy_low_color),
        awy_width, awy_opacity);

    this.bounds = new GLatLngBounds();
    this.bounds.extend(latlng_start);
    this.bounds.extend(latlng_end);
    this.latlng_center = this.bounds.getCenter();

    var div = element_create(null, 'div');
    div.className = 'fgmap_runway_info';
    div.style.textAlign = 'center';
    attach_event(div, "mouseover",
        this.airway_mouseover_cb.bind_event(this));

    var span = element_create(div, 'span');
    span.className = 'fgmap_nav_awy';
    span.textAlign = 'center';
    element_text_append(span, this.awy_hash['seg_name']);
    element_create(span, 'br');
    element_text_append(span, this.awy_hash['name_start'] + ' .. ' +
            this.awy_hash['name_end']);
    element_create(span, 'br');
    element_text_append(span, 'FL' + this.awy_hash['base'] + ' - FL' +
            this.awy_hash['top']);

    this.info = new GMapElement(this.latlng_center, awy_align, div);
    this.fgmap.gmap.addOverlay(this.info);
    this.info.opacity_set(FGMAP_NAV_OPACITY);
    this.info.hide();


    GEvent.addListener(this.fgmap.gmap, "moveend",
        this.gmap_moveend_cb.bind_event(this));

    GEvent.addListener(this.fgmap.gmap, "zoomend",
        this.gmap_zoomend_cb.bind_event(this));

    return true;
};

FGNavAirway.prototype.airway_mouseover_cb = function() {
    this.info.raise();
};

FGNavAirway.prototype.info_reposition = function() {

    if(this.info == null)
        return;

    var latlng;

    var gmap_bounds = this.fgmap.gmap.getBounds();

    if(gmap_bounds.containsBounds(this.bounds)) {

        latlng = this.latlng_center;

    } else if(gmap_bounds.intersects(this.bounds)) {

        /* This check is only a rough check */

        // Adjust the label position so that it's visible if the part of
        // the airway is visible

        // TODO: Make this a generic action for all overlay

        var mbt = gmap_bounds.getNorthEast().lat();
        var mbb = gmap_bounds.getSouthWest().lat();
        var mbl = gmap_bounds.getSouthWest().lng();
        var mbr = gmap_bounds.getNorthEast().lng();
        if(mbl > mbr && mbr < 0) mbr += 360;

        var bt = this.bounds.getNorthEast().lat();
        var bb = this.bounds.getSouthWest().lat();
        var bl = this.bounds.getSouthWest().lng();
        var br = this.bounds.getNorthEast().lng();
        if(bl > br && br < 0) br += 360;

        bt = Math.min(mbt, bt);
        bb = Math.max(mbb, bb);
        bl = Math.max(mbl, bl);
        br = Math.min(mbr, br);

        var lat_start = this.awy_hash['lat_start'];
        var lng_start = this.awy_hash['lng_start'];
        var lat_end = this.awy_hash['lat_end'];
        var lng_end = this.awy_hash['lng_end'];

        if(lng_start > lng_end && lng_end < 0) lng_end += 360;

        // More checks
        var x, y;
        var m, b;
        var lat, lng;

        m = parseFloat(this.awy_hash['m']);
        b = parseFloat(this.awy_hash['b']);

        // TODO: Account for null m and null b

        // x = (y - b) / m
        // y = mx + b

        // top bound
        x = (mbt - b) / m;
        if(!isNaN(x) && value_in_bounds(x, lng_start, lng_end)) {
            if(m < 0) {
                bl = Math.max(x, bl);
            } else {
                br = Math.min(x, br);
            }
        }

        // bottom bound
        x = (mbb - b) / m;
        if(!isNaN(x) && value_in_bounds(x, lng_start, lng_end)) {
            if(m < 0) {
                br = Math.min(x, br);
            } else {
                bl = Math.max(x, bl);
            }
        }

        // left bound
        y = m * mbl + b;
        if(!isNaN(y) && value_in_bounds(y, lat_start, lat_end)) {
            if(m < 0) {
                bt = Math.min(y, bt);
            } else {
                bb = Math.max(y, bb);
            }
        }

        // right bound
        y = m * mbr + b;
        if(!isNaN(y) && value_in_bounds(y, lat_start, lat_end)) {
            if(m < 0) {
                bb = Math.max(y, bb);
            } else {
                bt = Math.min(y, bt);
            }
        }

        var bounds = new GLatLngBounds();
        bounds.extend(new GLatLng(bt, bl));
        bounds.extend(new GLatLng(bt, br));
        bounds.extend(new GLatLng(bb, bl));
        bounds.extend(new GLatLng(bb, br));

        latlng = bounds.getCenter();

        /* Re-adjust it line up with the airway line */
        lng = latlng.lng();

        if(isNaN(m)) {
            lat = bt;
        } else {
            lat = m * lng + b;
        }

        if(!value_in_bounds(lat, bb, bt)) {
            lat = latlng.lat();

            if(isNaN(m)) {
                lng = bl;
            } else {
                lng = (lat - b) / m;
            }
        }

        latlng = new GLatLng(lat, lng);

    }

    // Debug
    /*
    if(this.debug2)
        this.fgmap.gmap.removeOverlay(this.debug2);
    this.debug2 = new GPolyline(
        [ new GLatLng(bt, bl),
          new GLatLng(bt, br),
          new GLatLng(bb, br),
          new GLatLng(bb, bl),
          new GLatLng(bt, bl) ],
          '#ff0000', 1.0, 0.5);
    this.fgmap.gmap.addOverlay(this.debug2);

    if(this.debug == null) {
        this.debug = new GMarker(latlng);
        this.fgmap.gmap.addOverlay(this.debug);
    } else {
        this.debug.setPoint(latlng);
    }
    */

    this.info.update(latlng);

};


FGNavAirway.prototype.gmap_moveend_cb = function() {
    if(this.visible) {
        this.info_reposition();
    }
};


FGNavAirway.prototype.gmap_zoomend_cb = function() {
    if(this.visible) {
        this.info_reposition();
    }
};


FGNavAirway.prototype.center_get = function() {
    return this.latlng_center;
};


FGNavAirway.prototype.visible_set = function(visible) {

    if(this.visible == visible)
        return true;

    this.visible = visible;

    this.info.visible_set(visible);

    if(visible) {
        this.fgmap.gmap.addOverlay(this.polyline);
        this.info_reposition();
    } else {
        this.fgmap.gmap.removeOverlay(this.polyline);
    }

    this.visible = visible;

    return true;
};

FGNavAirway.prototype.remove = function() {
    this.fgmap.gmap.removeOverlay(this.polyline);
    this.fgmap.gmap.removeOverlay(this.info);
    delete(this.info);
    this.info = null;
};


/* Heliport, it uses FGNavMarker for each pad */
function FGHeliport(fgmap, id, code, name, elevation) {
    FGNav.apply(this, [ fgmap, FGMAP_NAVAID_HPT, id, code, name ]);
    this.fgmap = fgmap;
    this.elevation = elevation;
    this.pads = new Object();
    this.bounds = new GLatLngBounds();
};
FGHeliport.prototype = new FGNav();


FGHeliport.prototype.pad_add = function(num, lat, lng, heading, length, width) {

    var div = element_create(null, "div");
    
    elem = element_create(div, "span");
    elem.className = FGMAP_NAV_INFO_CLASSES[FGMAP_NAVAID_HPT];
    element_text_append(elem, num);

    var pad = new FGNavMarker(this.fgmap,
        this.id + ":" + num, FGMAP_NAVAID_HPT, num, this.name, lat, lng, div);

    /* As we're not adding it to the map directly... */
    pad.init();
    pad.visible_set(false);

    this.pads[num] = pad;

    this.bounds.extend(pad.latlng);
};


FGHeliport.prototype.setup = function() {

    var heliport_info_align = new GPoint(48, -16); /* TODO */
    var heliport_info_opacity = FGMAP_NAV_OPACITY;

    this.info_elem = element_create(null, "div");
    this.info_elem.className = "fgmap_nav_info";
    this.info_elem.style.textAlign = "center";

    var span = element_create(this.info_elem, "span");
    span.className = "fgmap_nav_hpt";
    element_text_append(span, this.name + " - " + this.code);

    this.info = new GMapElement(this.bounds.getNorthEast(),
                                heliport_info_align,
                                this.info_elem
                                /*, G_MAP_MARKER_SHADOW_PANE */);
    this.fgmap.gmap.addOverlay(this.info);
    this.info.hide();
    this.info.opacity_set(heliport_info_opacity);

    attach_event(this.info_elem, "mouseover",
        this.heliport_mouseover_cb.bind_event(this));

    return true;
};


FGHeliport.prototype.center_get = function() {
    return this.bounds.getCenter();
};


FGHeliport.prototype.raise = function() {
    for(var p in this.pads) {
        var pad = this.pads[p];
        pad.raise();
    }
    this.info.raise();
};


FGHeliport.prototype.heliport_mouseover_cb = function(e) {
    this.raise();
};


FGHeliport.prototype.visible_set = function(visible) {

    if(this.visible == visible) {
        return true;
    }

    this.visible = visible;

    for(var p in this.pads) {
        this.pads[p].visible_set(visible);
    }

    if(visible)
        this.info.show();
    else
        this.info.hide();
};


FGHeliport.prototype.remove = function() {

    this.visible_set(false);

    for(var p in this.pads) {
        this.pads[p].remove();
    }

    delete(this.pads);
    this.pads = null;

    delete(this.info);
    delete(this.bounds);
};



/* Pilots filters */

var FGMAP_PILOTS_FILTER_TYPE_CALLSIGN = 0;
var FGMAP_PILOTS_FILTER_TYPE_AIRCRAFT = 1;
var FGMAP_PILOTS_FILTER_TYPE_SERVER = 2;


FGMap.prototype.pilots_filter_query_string_set = function(type, str) {
    var cond = 1;
    if(str[0] == '!') {
        cond = 0;
        str = str.substring(1);
    }
    this.pilots_filter_set(type, str, cond);
};


FGMap.prototype.pilots_filter_get = function(type) {
    if(this.pilots_filters == null) {
        return null;
    }
    return this.pilots_filters[type];
};


FGMap.prototype.pilots_filter_set = function(type, str, cond) {

    if(this.pilots_filters == null) {
        this.pilots_filters = new Object();
    }

    var need_update = false;

    var f = this.pilots_filters[type];

    if(f == null) {
        f = new Object();
    }

    if(str == null || str == '') {
        if(f.str != null) {
            need_update = true;
        }
        f.str = null;
    } else {
        f.str = str;
        f.cond = !!parseInt(cond);
        need_update = true;
    }

    this.pilots_filters[type] = f;

    if(need_update) {
        this.linktomap_update();
        this.map_update(true);
    }
};


FGMap.prototype.pilots_filter_match = function(callsign, model, server_ip) {

    if(this.pilots_filters == null || this.pilots_filters.length == 0) {
        return true;
    }

    var totests = new Object();
    totests[FGMAP_PILOTS_FILTER_TYPE_CALLSIGN] = callsign;
    totests[FGMAP_PILOTS_FILTER_TYPE_AIRCRAFT] = model;
    totests[FGMAP_PILOTS_FILTER_TYPE_SERVER] = this.server_get_by_ip(server_ip);

    // TODO: clear follows?

    var has_filter = false;
    var matched = true;

    for(var type in this.pilots_filters) {

        var f = this.pilots_filters[type];

        if(f == null || f.str == null) {
            continue;
        }

        has_filter = true;

        var re = RegExp(f.str, 'i');
        var totest = totests[type];

        if(!(f.cond && re.test(totest)) &&
                !(!f.cond && !re.test(totest))) {
            matched = false;
        }

    }

    if(has_filter) {
        return matched;
    }

    return true;
};


/* vim: set sw=4 sts=4 expandtab: */

