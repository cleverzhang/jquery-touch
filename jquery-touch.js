/**
 * Created by shijun on 15/2/26.
 */

(function($){
    var touch_events = "touchstart touchmove touchend touchcancel";
    var tap_func_maps = {};
    var press_func_maps = {};
    var tap_crash = false;
    var pressed = false;
    var press_inter = null;
    var press_time_def = 1000;
    var is_mobi_dev = "ontouchstart" in window;
    var tap_base_id = 100;
    var _get_tap_id = function(elm){
        var tap_id;
        if ($(elm).attr("tap_id")){
            tap_id = $(elm).attr("tap_id");
        }
        else{
            tap_id = "tap_id_" + tap_base_id++;
            $(elm).attr("tap_id", tap_id);
        }
        return tap_id;
    };
    var _get_tap_target = function(elm){
        var tag_name;
        do{
            elm = $(elm);
            tag_name = elm[0].tagName.toLowerCase();
            if (elm.attr("tap_id")){
                return elm;
            }
            elm = elm.parent();
        }while (tag_name != "body" && tag_name != "html");
        return false;
    };
    var touch_handler = function(evt){
        //默认的evt是被jq标准化过的event，不含有touches
        evt = event || evt;
        if (evt.touches && evt.touches.length > 1){
            tap_crash = true;
            return;
        }
        var tap_target = _get_tap_target(evt.target);
        if (!tap_target){
            return;
        }
        var tap_id = tap_target.attr("tap_id");
        switch(evt.type){
            case "touchstart" :
                clearTimeout(press_inter);
                press_inter = setTimeout(function(){
                    !tap_crash && !pressed && press_func_maps[tap_id] && press_func_maps[tap_id]();
                    pressed = true;
                }, press_time_def)
                break;
            case "touchmove" :
                clearTimeout(press_inter);
                tap_crash = true;
                pressed = false;
                break;
            case "touchend" :
                !tap_crash && !pressed && tap_func_maps[tap_id] && tap_func_maps[tap_id]();
                clearTimeout(press_inter);
                tap_crash = false;
                pressed = false;
                break;
            case "touchcancel" :
                clearTimeout(press_inter);
                tap_crash = false;
                pressed = false;
                break;
            default:
        }
        return false;
    };

    var init = function(){
        if (!is_mobi_dev){
            return;
        }
        touch_events.split(" ").forEach(function(event_name){
            $(document).on(event_name, touch_handler);
        });
    };

    $(document).ready(init);

    var touch =  {
        "ontap" : function(tap_id, tap_func){
            if (!tap_func_maps[tap_id]){
                tap_func_maps[tap_id] = tap_func;
            }
        },
        "untap" : function(tap_id){
            delete tap_func_maps[tap_id];
        },
        "onpress" : function(tap_id, tap_func){
            if (!press_func_maps[tap_id]){
                press_func_maps[tap_id] = tap_func;
            }
        },
        "unpress" : function(tap_id){
            delete press_func_maps[tap_id];
        }
    };
    $.fn.extend({
        "tap" : function(func){
            touch.ontap(_get_tap_id($(this)), $.proxy(func, this));
        },
        "untap" : function(){
            touch.untap(_get_tap_id($(this)));
        },
        "press" : function(func){
            touch.onpress(_get_tap_id($(this)), $.proxy(func, this));
        },
        "unpress" : function(){
            touch.unpress(_get_tap_id($(this)));
        }
    });
})($);