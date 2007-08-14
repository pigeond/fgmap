/* FGMapMPCamControl */

var FGMPCAM_URL = 'http://pigeond.net:8001/mpcam';
//var FGMPCAM_URL = 'http://localhost:8001/mpcam';
var FGMPCAM_WIDTH = 240;
var FGMPCAM_HEIGHT = 192;
var FGMPCAM_CONTROL_URL = 'fg_mpcam_control.cgi';
var FGMPCAM_POLL_INTERVAL = 2000;


function FGMapMPCamControl() {
    GControl.apply(this, [ false, false ]);
}
FGMapMPCamControl.prototype = new GControl();


FGMapMPCamControl.prototype.setFGMap = function(fgmap) {
    this.fgmap = fgmap;
};


FGMapMPCamControl.prototype.initialize = function(gmap) {

    this.gmap = gmap;
    this.div = element_create(gmap.getContainer(), 'div');
    this.div.className = 'fgmap_mpcam_control';


    this.div.style.width = (FGMPCAM_WIDTH + 2) + 'px';
    this.div.style.height = (FGMPCAM_HEIGHT + 24) + 'px';


    this.cam_div = element_create(this.div, 'div');
    this.cam_div.style.position = 'absolute';
    this.cam_div.style.top = '0px';
    this.cam_div.style.right = '0px';
    this.cam_div.style.textAlign = 'right';

    this.cam_img_div = element_create(this.cam_div, 'div');
    this.cam_img_div.style.width = FGMPCAM_WIDTH + 'px';
    this.cam_img_div.style.height = FGMPCAM_HEIGHT + 'px';
    this.cam_img_div.style.border = '1px solid grey';

    this.cam_msg_table = element_create(this.cam_img_div, 'table');
    this.cam_msg_table.style.border = '0px';
    this.cam_msg_table.style.margin = '0px';
    this.cam_msg_table.style.width = '100%';
    this.cam_msg_table.style.height = '100%';
    element_opacity_set(this.cam_msg_table, 0.7);
    var tbody = element_create(this.cam_msg_table, 'tbody');
    var tr = element_create(tbody, 'tr');

    this.cam_msg = element_create(tr, 'td');
    this.cam_msg.style.backgroundColor = 'white';
    this.cam_msg.style.textAlign = 'center';
    this.cam_msg.style.verticalAlign = 'middle';
    this.cam_msg.className = 'fgmap_mpcam_msg';



    this.cam_control = element_create(this.cam_img_div, 'div');
    this.cam_control.style.border = '0px';
    this.cam_control.style.margin = '0px';
    this.cam_control.style.backgroundColor = 'grey';
    this.cam_control.style.paddingTop = '3px';


    this.prevtarget_elem = element_create(this.cam_control, 'img');
    this.prevtarget_elem.src = 'images/prev.png';
    this.prevtarget_elem.title = 'Previous target';
    attach_event(this.prevtarget_elem, 'mousedown',
            this.camera_control.bind_event(this, 'prev_target'));

    this.targetname_elem = element_create(this.cam_control, 'span');
    this.targetname_elem.className = 'fgmap_mpcam_targetname';
    this.targetname_elem.style.verticalAlign = 'top';

    this.nexttarget_elem = element_create(this.cam_control, 'img');
    this.nexttarget_elem.src = 'images/next.png';
    this.nexttarget_elem.title = 'Next target';
    attach_event(this.nexttarget_elem, 'mousedown',
            this.camera_control.bind_event(this, 'next_target'));

    this.zoomin_elem = element_create(this.cam_control, 'img');
    this.zoomin_elem.src = 'images/zoom_in.png';
    this.zoomin_elem.title = 'Zoom in';
    attach_event(this.zoomin_elem, 'mousedown',
            this.camera_control.bind_event(this, 'zoom_in'));

    this.zoomout_elem = element_create(this.cam_control, 'img');
    this.zoomout_elem.src = 'images/zoom_out.png';
    this.zoomout_elem.title = 'Zoom out';
    attach_event(this.zoomout_elem, 'mousedown',
            this.camera_control.bind_event(this, 'zoom_out'));

    this.reload_elem = element_create(this.cam_control, 'img');
    this.reload_elem.src = 'images/reload.png';
    this.reload_elem.title = 'Reload';
    attach_event(this.reload_elem, 'mousedown',
            this.camera_reload.bind_event(this));


    this.toggle_img = element_create(this.div, 'img');
    this.toggle_img.style.position = 'absolute';
    this.toggle_img.style.top = '0px';
    this.toggle_img.style.right = '0px';
    this.toggle_img.title = 'Toggle real-time camera';

    this.cam_visible = true;
    this.cam_visible_toggle();

    attach_event(this.toggle_img, "mousedown",
            this.cam_visible_toggle.bind_event(this));
    attach_event(this.toggle_img, "mouseover",
            this.toggle_img_mouseover_cb.bind_event(this));
    attach_event(this.toggle_img, "mouseout",
            this.toggle_img_mouseout_cb.bind_event(this));


    this.down = -1;

    return this.div;
};


FGMapMPCamControl.prototype.getDefaultPosition = function() {
    return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(7, 60));
}


FGMapMPCamControl.prototype.printable = function() {
};


FGMapMPCamControl.prototype.selectable = function() {
    return false;
};


FGMapMPCamControl.prototype.cam_visible_toggle = function() {

    this.cam_visible = !this.cam_visible;

    if(this.cam_visible) {
        this.toggle_img.src = 'images/mpcam_button_selected.png';
        element_show(this.cam_div);
        element_show(this.cam_msg_table);
        this.camera_poll_start();
    } else {
        this.toggle_img.src = 'images/mpcam_button.png';
        this.camera_poll_stop();
        this.camera_unload();
        element_hide(this.cam_div);
        element_hide(this.cam_msg_table);
        this.fgmap.pilot_follows_clear();
    }

};


FGMapMPCamControl.prototype.cam_img_complete_cb = function() {
    
    if(this.cam_img.complete) {
        this.msg_set('mpcam connection lost');
    } else {
        setTimeout(this.cam_img_complete_cb.bind_event(this), 300);
    }
};


FGMapMPCamControl.prototype.camera_load = function() {

    this.cam_img = element_create(this.cam_img_div, 'img');
    this.cam_img.style.position = 'absolute';
    this.cam_img.style.border = '0px';
    this.cam_img.style.margin = '0px';
    this.cam_img.style.top = '0px';
    this.cam_img.style.right = '0px';
    this.cam_img.style.width = FGMPCAM_WIDTH + 'px';
    this.cam_img.style.height = FGMPCAM_HEIGHT + 'px';
    this.cam_img.style.border = '0px';
    this.cam_img.style.margin = '0px';
    this.cam_img.style.border = '1px solid grey';
    element_raise(this.cam_img);

    attach_event(this.cam_img, "mouseover",
            this.cam_img_mouseover_cb.bind_event(this));
    attach_event(this.cam_img, "mouseout",
            this.cam_img_mouseout_cb.bind_event(this));

    this.cam_img.src = FGMPCAM_URL;
    this.cam_img_complete_cb();
};


FGMapMPCamControl.prototype.camera_unload = function() {
    if(this.cam_img) {
        this.cam_img.src = '';
        element_remove(this.cam_img);
        delete(this.cam_img);
        this.cam_img = null;
    }
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

                this.targetname_elem.innerHTML = this.targetname;

                if(this.targetname != '') {
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


FGMapMPCamControl.prototype.cam_img_mouseover_cb = function() {
    if(this.cam_visible && !element_is_visible(this.toggle_img)) {
        element_show(this.toggle_img);
    }
};


FGMapMPCamControl.prototype.cam_img_mouseout_cb = function() {
    setTimeout(this.cam_img_mouseout_timeout_cb.bind_event(this), 100);
};


FGMapMPCamControl.prototype.toggle_img_mouseover_cb = function() {
    this.toggle_img_mouseover = true;
};


FGMapMPCamControl.prototype.toggle_img_mouseout_cb = function() {
    this.toggle_img_mouseover = false;
};


FGMapMPCamControl.prototype.cam_img_mouseout_timeout_cb = function() {
    if(this.cam_visible && element_is_visible(this.toggle_img) &&
            !this.toggle_img_mouseover) {
        element_hide(this.toggle_img);
    }
};


FGMapMPCamControl.prototype.camera_down_set = function(down) {

    if(down != this.down) {

        if(down == 1) {
            this.camera_unload();
            //element_hide(this.cam_img);
            this.msg_set('mpcam is currently down');
        } else {
            this.camera_load();
            element_show(this.cam_img);
        }
    }
    
    this.down = down;
}
            

FGMapMPCamControl.prototype.camera_control = function(e, action) {

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

