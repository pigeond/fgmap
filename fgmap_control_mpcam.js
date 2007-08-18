/* FGMapMPCamControl */

var FGMPCAM_URL = 'http://pigeond.net:8090/mpcam';
//var FGMPCAM_URL = 'http://localhost:8090/mpcam';

var FGMPCAM_SWF_URL = 'http://pigeond.net:8090/mpcam.flv';
//var FGMPCAM_SWF_URL = 'http://localhost:8090/mpcam.flv';

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

    this.prevtarget_elem = element_create(td, 'img');
    this.prevtarget_elem.src = 'images/mpcam/prev.png';
    this.prevtarget_elem.title = 'Previous target';
    attach_event(this.prevtarget_elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'prev_target'));

    element_text_append(td, '\u00a0');

    this.targetname_elem = element_create(td, 'span');
    this.targetname_elem.className = 'fgmap_mpcam_targetname';
    this.targetname_elem.style.verticalAlign = 'top';
    this.targetname_elem.innerHTML = '(no target)';

    element_text_append(td, '\u00a0');

    this.nexttarget_elem = element_create(td, 'img');
    this.nexttarget_elem.src = 'images/mpcam/next.png';
    this.nexttarget_elem.title = 'Next target';
    attach_event(this.nexttarget_elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'next_target'));


    td = element_create(tr, 'td');
    td.style.textAlign = 'right';
    td.style.whiteSpace = 'nowrap';
    td.style.width = '50%';

    this.zoomin_elem = element_create(td, 'img');
    this.zoomin_elem.src = 'images/mpcam/zoom_in.png';
    this.zoomin_elem.title = 'Zoom in';
    attach_event(this.zoomin_elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'zoom_in'));

    this.zoomout_elem = element_create(td, 'img');
    this.zoomout_elem.src = 'images/mpcam/zoom_out.png';
    this.zoomout_elem.title = 'Zoom out';
    attach_event(this.zoomout_elem, 'mousedown',
            this.camera_control_cb.bind_event(this, 'zoom_out'));

    element_text_append(td, '\u00a0');

    this.reload_elem = element_create(td, 'img');
    this.reload_elem.src = 'images/mpcam/reload.png';
    this.reload_elem.title = 'Reload mpcam';
    attach_event(this.reload_elem, 'mousedown',
            this.camera_reload.bind_event(this));

    this.close_elem = element_create(td, 'img');
    this.close_elem.src = 'images/mpcam/close.png';
    this.close_elem.title = 'Close mpcam';
    attach_event(this.close_elem, 'mousedown',
            this.close_cb.bind_event(this));


    this.toggle_img = element_create(this.div, 'img');
    this.toggle_img.style.position = 'absolute';
    this.toggle_img.style.top = '0px';
    this.toggle_img.style.right = '1px';
    this.toggle_img.title = 'Toggle real-time camera';

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
<param name="flashvars" value=\'config={ autoPlay: true, loop: false, hideControls: true, showFullScreenButton: false, showLoopButton: false, showPlayListButtons: false, showPlayList: false, showMenu: false, initialScale: "scale", showLoopButton: false, showPlayListButtons: false, videoHeight: 240, playList: [ { url: "' + FGMPCAM_SWF_URL + '" } ] }\' />\
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
        } else {
            this.camera_load();
        }
    }
    
    this.down = down;
}


FGMapMPCamControl.prototype.camera_control_cb = function(e, action) {
    this.camera_control(action);
}

FGMapMPCamControl.prototype.camera_control = function(action) {

    if(this.down == 1) {
        return;
    }

    if(this.control_request) {
        this.control_request.abort();
    }

    var url = FGMPCAM_CONTROL_URL + '?' + action;
    this.control_request = GXmlHttp.create();
    this.control_request.open('GET', url, true);
    this.control_request.onreadystatechange =
        this.control_request_cb.bind_event(this);
    this.control_request.send(null);

    /* Hack */
    if(action == 'next_target' || action == 'prev_target') {
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


FGMapMPCamControl.prototype.control_request_cb = function() {

    if(!this.control_request)
        return;

    if(this.control_request.readyState >= 4) {
        delete(this.control_request);
        this.control_request = null;
    }
};

