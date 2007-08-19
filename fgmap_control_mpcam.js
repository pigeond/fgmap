/* FGMapMPCamControl */

var FGMPCAM_URL = 'http://pigeond.net:8090/mpcam';
//var FGMPCAM_URL = 'http://vejitto.pigeond.net:8090/mpcam';

var FGMPCAM_SWF_URL = 'http://pigeond.net:8090/mpcam.flv';
//var FGMPCAM_SWF_URL = 'http://vejitto.pigeond.net:8090/mpcam.flv';

var FGMPCAM_WIDTH = 240;
var FGMPCAM_HEIGHT = 192;
var FGMPCAM_CONTROL_HEIGHT = 24;
var FGMPCAM_CONTROL_URL = 'fg_mpcam_xml.cgi';
var FGMPCAM_POLL_INTERVAL = 2000;


function FGMapMPCamControl() {
    GControl.apply(this, [ true, true ]);
}
FGMapMPCamControl.prototype = new GControl();


FGMapMPCamControl.prototype.initialize = function(gmap) {

    this.gmap = gmap;
    this.div = element_create(gmap.getContainer(), 'div');
    this.div.className = 'fgmap_mpcam_control';

    this.cam_div = element_create(this.div, 'div');
    this.cam_div.style.position = 'absolute';
    this.cam_div.style.top = '0px';
    this.cam_div.style.right = '0px';
    this.cam_div.style.textAlign = 'right';

    this.cam_cam_div = element_create(this.cam_div, 'div');
    this.cam_cam_div.style.position = 'relative';
    this.cam_cam_div.style.width = FGMPCAM_WIDTH + 'px';
    this.cam_cam_div.style.height =
        (FGMPCAM_HEIGHT + FGMPCAM_CONTROL_HEIGHT) + 'px';
    this.cam_cam_div.style.border = '1px solid #888';

    var table, tbody, tr, td;

    this.cam_msg_table = element_create(this.cam_cam_div, 'table');
    this.cam_msg_table.style.border = '0px';
    this.cam_msg_table.style.margin = '0px';
    this.cam_msg_table.style.width = '100%';
    this.cam_msg_table.style.height = FGMPCAM_HEIGHT + 'px';
    this.cam_msg_table.style.visiblity = 'visible';
    //element_opacity_set(this.cam_msg_table, 0.7);

    tbody = element_create(this.cam_msg_table, 'tbody');
    tr = element_create(tbody, 'tr');

    this.cam_msg = element_create(tr, 'td');
    this.cam_msg.style.backgroundColor = '#fff';
    this.cam_msg.style.textAlign = 'center';
    this.cam_msg.style.verticalAlign = 'middle';
    this.cam_msg.className = 'fgmap_mpcam_msg';


    this.cam_control = element_create(this.cam_cam_div, 'div');
    this.cam_control.style.border = '0px';
    this.cam_control.style.margin = '0px';
    this.cam_control.style.height = FGMPCAM_CONTROL_HEIGHT + 'px';
    this.cam_control.style.backgroundColor = '#888';
    this.cam_control.style.paddingTop = '2px';

    table = element_create(this.cam_control, 'table');
    table.style.border = '0px';
    table.style.margin = '0px';
    //table.style.paddingLeft = '2px';
    //table.style.paddingRight = '2px';
    table.style.width = '100%';
    table.style.height = '100%';
    tbody = element_create(table, 'tbody');
    tr = element_create(tbody, 'tr');

    td = element_create(tr, 'td');
    td.style.textAlign = 'left';
    td.style.whiteSpace = 'nowrap';
    td.style.width = '50%';

    var elem;

    this.prevtarget_elem = elem = element_create(td, 'img');
    elem.src = 'images/mpcam/prev.png';
    elem.title = 'Previous target';
    elem.style.width = '19px';
    elem.style.height = '19px';
    attach_event(elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'prev_target'));
    /*
    attach_event(elem, 'mousedown',
            this.target_change.bind_event(this, 'prev'));
    */
    img_ie_fix(elem);

    element_text_append(td, '\u00a0');

    this.targetname_elem = element_create(td, 'span');
    this.targetname_elem.className = 'fgmap_mpcam_targetname';
    this.targetname_elem.style.verticalAlign = 'top';
    this.targetname_elem.innerHTML = '(no target)';

    element_text_append(td, '\u00a0');

    this.nexttarget_elem = elem = element_create(td, 'img');
    elem.src = 'images/mpcam/next.png';
    elem.title = 'Next target';
    elem.style.width = '19px';
    elem.style.height = '19px';
    attach_event(elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'next_target'));
    /*
    attach_event(elem, 'mousedown',
            this.target_change.bind_event(this, 'next'));
    */
    img_ie_fix(elem);


    td = element_create(tr, 'td');
    td.style.textAlign = 'right';
    td.style.whiteSpace = 'nowrap';
    td.style.width = '50%';

    this.goto_elem = elem = element_create(td, 'img');
    elem.src = 'images/mpcam/goto.png';
    elem.title = 'Goto target immediately';
    elem.style.width = '19px';
    elem.style.height = '19px';
    attach_event(elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'goto'));
    img_ie_fix(elem);

    this.zoomin_elem = elem = element_create(td, 'img');
    elem.src = 'images/mpcam/zoom_in.png';
    elem.title = 'Zoom in';
    elem.style.width = '19px';
    elem.style.height = '19px';
    attach_event(elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'zoom_in'));
    img_ie_fix(elem);

    this.zoomout_elem = elem = element_create(td, 'img');
    elem.src = 'images/mpcam/zoom_out.png';
    elem.title = 'Zoom out';
    elem.style.width = '19px';
    elem.style.height = '19px';
    attach_event(elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'zoom_out'));
    img_ie_fix(elem);

    element_text_append(td, '\u00a0');

    this.reload_elem = elem = element_create(td, 'img');
    elem.src = 'images/mpcam/reload.png';
    elem.title = 'Reload mpcam';
    elem.style.width = '19px';
    elem.style.height = '19px';
    attach_event(elem, 'mousedown',
            this.camera_reload.bind_event(this));
    img_ie_fix(elem);

    this.close_elem = elem = element_create(td, 'img');
    elem.src = 'images/mpcam/close.png';
    elem.title = 'Close mpcam';
    elem.style.width = '19px';
    elem.style.height = '19px';
    attach_event(elem, 'mousedown',
            this.close_cb.bind_event(this));
    img_ie_fix(elem);


    this.toggle_img = elem = element_create(this.div, 'img');
    elem.style.position = 'absolute';
    elem.style.top = '0px';
    elem.style.right = '1px';
    elem.title = 'Toggle real-time camera';

    attach_event(this.toggle_img, "mousedown",
            this.cam_visible_toggle.bind_event(this));
    attach_event(this.toggle_img, "mouseover",
            this.toggle_img_mouseover_cb.bind_event(this));
    attach_event(this.toggle_img, "mouseout",
            this.toggle_img_mouseout_cb.bind_event(this));

    if(!USER_AGENT.is_mozilla && !USER_AGENT.is_gecko) {
        this.use_swf = true;
    }

    this.use_swf = true;

    this.down = -1;

    this.cam_visible = true;
    this.cam_visible_toggle();

    return this.div;
};


FGMapMPCamControl.prototype.getDefaultPosition = function() {
    return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(7, 60));
}


FGMapMPCamControl.prototype.printable = function() {
    return true;
};


FGMapMPCamControl.prototype.selectable = function() {
    return true;
};


FGMapMPCamControl.prototype.setFGMap = function(fgmap) {
    this.fgmap = fgmap;
};


FGMapMPCamControl.prototype.cam_visible_set = function(visible) {

    this.cam_visible = visible;

    if(this.cam_visible) {
        this.toggle_img.src = 'images/mpcam/mpcam_button_selected.png';
        element_show(this.cam_div);
        this.camera_poll_start();
        element_show(this.cam_msg_table);
    } else {
        this.toggle_img.src = 'images/mpcam/mpcam_button.png';
        element_show(this.toggle_img);
        this.camera_poll_stop();
        this.camera_unload();
        element_hide(this.cam_div);
        element_hide(this.cam_msg_table);
        this.fgmap.pilot_follows_clear();
    }

    this.toggle_img.style.width = '38px';
    this.toggle_img.style.height = '38px';
    img_ie_fix(this.toggle_img);
};


FGMapMPCamControl.prototype.cam_visible_toggle = function() {
    this.cam_visible_set(!this.cam_visible);
};


FGMapMPCamControl.prototype.cam_complete_cb = function() {
    
    if(this.cam == null)
        return;

    if(this.cam.complete) {
        this.msg_set('mpcam connection lost<br>try the reload button below');
    } else {
        setTimeout(this.cam_complete_cb.bind_event(this), 300);
    }
};


FGMapMPCamControl.prototype.camera_load = function() {

    this.camera_unload();

    if(this.cam == null) {

        if(this.use_swf) {

            this.cam = element_create(this.cam_cam_div, 'div');

            this.cam.innerHTML = '\
<object type="application/x-shockwave-flash" data="FlowPlayer.swf" \
id="flowplayer" name="flowplayer" \
width="' + FGMPCAM_WIDTH + '"' + ' height="' + FGMPCAM_HEIGHT + '" \
<param name="allowScriptAccess" value="always" />\
<param name="movie" value="FlowPlayer.swf" />\
<param name="quality" value="high" />\
<param name="scaleMode" value="showAll" />\
<param name="allowfullscreen" value="false" />\
<param name="wmode" value="transparent" />\
<param name="allowNetworking" value="all" />\
<param name="flashvars" value=\'config={ autoPlay: true, loop: false, hideControls: true, showFullScreenButton: false, showLoopButton: false, showPlayListButtons: false, showPlayList: false, showMenu: false, initialScale: "scale", showLoopButton: false, showPlayListButtons: false, autoBuffering: false, bufferLength: 2,startingBufferLength: 2, videoHeight: ' + FGMPCAM_HEIGHT + ', playList: [ { url: "' + FGMPCAM_SWF_URL + '" } ] }\' />\
</object>\
';
            this.swf = document.getElementById('flowplayer');

        } else {

            this.cam = cam = element_create(this.cam_cam_div, 'img');
        }
    }

    this.cam.style.position = 'absolute';
    this.cam.style.border = '0px';
    this.cam.style.margin = '0px';
    this.cam.style.top = '0px';
    this.cam.style.right = '0px';
    this.cam.style.width = FGMPCAM_WIDTH + 'px';
    this.cam.style.height = FGMPCAM_HEIGHT + 'px';

    attach_event(this.cam, "mouseover", this.cam_mouseover_cb.bind_event(this));
    attach_event(this.cam, "mouseout", this.cam_mouseout_cb.bind_event(this));

    if(this.use_swf) {
        if(this.DoPlay) {
            this.swf.DoPlay();
        }
    } else {
        this.cam.src = FGMPCAM_URL;
        this.cam_complete_cb();
    }

};


FGMapMPCamControl.prototype.camera_unload = function() {

    if(this.cam == null)
        return;

    if(this.use_swf) {

        if(this.swf) {
            if(this.swf.DoStop) {
                this.swf.DoStop();
            }
            element_remove(this.swf);
            delete(this.swf);
        }

    } else {
        this.cam.src = '';
    }

    element_remove(this.cam);
    delete(this.cam);
    this.cam = null;
};


FGMapMPCamControl.prototype.camera_poll_start = function() {
    this.down = -1;
    this.msg_set('mpcam loading...');
    this.should_poll = true;
    this.camera_poll_cb();
};


FGMapMPCamControl.prototype.camera_poll_stop = function() {
    this.should_poll = false;
    if(this.poll_request) {
        this.poll_request.abort();
    }
    this.down = -1;
};


FGMapMPCamControl.prototype.camera_poll_cb = function() {

    if(this.poll_request) {
        this.poll_request.abort();
    }

    var url = FGMPCAM_CONTROL_URL + '?poll';
    this.poll_request = GXmlHttp.create();
    this.poll_request.open('GET', url, true);
    this.poll_request.onreadystatechange =
        this.poll_request_cb.bind_event(this);
    this.poll_request.send(null);
};


FGMapMPCamControl.prototype.poll_request_cb = function() {

    if(!this.poll_request)
        return;

    if(this.poll_request.readyState >= 4) {

        if(this.poll_request.readyState == 4) {

            var xmldoc = this.poll_request.responseXML;

            if(xmldoc == null || xmldoc.documentElement == null) {
                return;
            }

            var down = xmldoc.documentElement.getAttribute('down');

            this.camera_down_set(down);

            if(this.down == 0) {
                this.targetname =
                    xmldoc.documentElement.getAttribute('targetname');

                if(this.targetname == '') {
                    this.targetname_elem.innerHTML = '(no target)';
                } else {
                    this.targetname_elem.innerHTML = this.targetname;
                    this.fgmap.pilot_follows_clear();
                    this.fgmap.pilot_follow_add(this.targetname);
                }
            }
        }

        delete(this.poll_request);
        this.poll_request = null;

        if(this.should_poll) {
            setTimeout(this.camera_poll_cb.bind_event(this),
                    FGMPCAM_POLL_INTERVAL);
        } else {
            this.down = 1;
        }
    }

};


FGMapMPCamControl.prototype.cam_mouseover_cb = function() {
    if(this.cam_visible && !element_is_visible(this.toggle_img)) {
        element_show(this.toggle_img);
        element_raise(this.toggle_img);
    }
};


FGMapMPCamControl.prototype.cam_mouseout_cb = function() {
    setTimeout(this.cam_mouseout_timeout_cb.bind_event(this), 100);
};


FGMapMPCamControl.prototype.toggle_img_mouseover_cb = function() {
    this.toggle_img_mouseover = true;
};


FGMapMPCamControl.prototype.toggle_img_mouseout_cb = function() {
    this.toggle_img_mouseover = false;
};


FGMapMPCamControl.prototype.cam_mouseout_timeout_cb = function() {
    if(this.cam_visible && element_is_visible(this.toggle_img) &&
            !this.toggle_img_mouseover) {
        element_hide(this.toggle_img);
    }
};


FGMapMPCamControl.prototype.camera_down_set = function(down) {

    if(down != this.down) {

        if(down == 1) {
            this.camera_unload();
            this.msg_set('mpcam is currently down');
            this.targetname_elem.innerHTML = '(no target)';
        } else {
            this.camera_load();
        }
    }
    
    this.down = down;
}


FGMapMPCamControl.prototype.camera_control_cb = function(e, action) {
    this.camera_control(action, null);
}

FGMapMPCamControl.prototype.camera_control = function(action, arg) {

    if(this.down == 1) {
        return;
    }

    var url = FGMPCAM_CONTROL_URL + '?' + action;

    if(arg) {
        url += '=' + arg;
    }

    var request = GXmlHttp.create();
    request.open('GET', url, true);
    request.onreadystatechange =
        this.control_request_cb.bind_event(this, request);
    request.send(null);

    /* Hack */
    if(action == 'next_target' ||
            action == 'prev_target' ||
            action == 'set_target_name') {
        this.camera_poll_cb();
    }
};


FGMapMPCamControl.prototype.close_cb = function() {
    this.cam_visible_set(false);
};


FGMapMPCamControl.prototype.camera_reload = function() {
    this.camera_poll_start();
};


FGMapMPCamControl.prototype.msg_set = function(msg) {
    this.cam_msg.innerHTML = msg;
};


FGMapMPCamControl.prototype.control_request_cb = function(request) {

    if(!request)
        return;

    if(request.readyState >= 4) {
    }
};


FGMapMPCamControl.prototype.target_change = function(e, action) {

    var arr = new Array();
    var i = 0;
    var cur = 0;

    if(this.fgmap.pilots == null) {
        return;
    }

    for(var callsign in this.fgmap.pilots) {

        /* Hack */
        if(callsign == 'mpcam') {
            continue;
        }

        arr.push(callsign);

        if(this.targetname == callsign) {
            cur = i;
        }

        i++;
    }

    if(arr.length == 0) {
        return;
    }

    if(action == 'prev') {
        cur -= 1;
    } else if(action == 'next') {
        cur += 1;
    }

    /* Wrap around */
    if(cur < 0) {
        cur = arr.length - 1;
    } else if(cur >= arr.length) {
        cur = 0;
    }

    var pilot = this.fgmap.pilots[arr[cur]];

    var lat = pilot.latlng.lat();
    var lng = pilot.latlng.lng();

    this.camera_control('set_target_name', pilot.callsign);

    this.camera_control('set_latlng', lat + ',' + lng);
};

