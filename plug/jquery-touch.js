/**
 * Created by @厕所的灯 on 15/2/26.
 */

(function($){
    var touch_events = "touchstart touchmove touchend touchcancel";
    var mouse_events = "mousedown mousemove mouseup mousecancel";
    var event_arr = [];
    var tap_func_maps = {};
    var press_func_maps = {};
    var move_func_maps = {};
    var tap_crash = false;
    var pressed = false;
    var can_move = false;
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
        evt = evt || event;
        if (evt.touches && evt.touches.length > 1){
            tap_crash = true;
            return false;
        }
        var tap_target = _get_tap_target(evt.target);
        if (!tap_target){
            return;
        }
        var tap_id = tap_target.attr("tap_id");
        switch(evt.type){
            case event_arr[0] :
                clearTimeout(press_inter);
                can_move = true;
                press_inter = setTimeout(function(){
                    if (!tap_crash && !pressed && press_func_maps[tap_id]){
                        pressed = true;
                        can_move = false;
                        return press_func_maps[tap_id](evt);
                    }
                }, press_time_def);
                break;
            case event_arr[1] :
                clearTimeout(press_inter);
                //阻止pc mouse move事件
                if (!can_move){
                    return false;
                }
                tap_crash = true;
                pressed = false;
                if (can_move && move_func_maps[tap_id]){
                    return move_func_maps[tap_id](evt);
                }
                break;
            case event_arr[2] :
                clearTimeout(press_inter);
                !tap_crash && !pressed && tap_func_maps[tap_id] && tap_func_maps[tap_id](evt);
                tap_crash = false;
                pressed = false;
                can_move = false;
                return false;
                break;
            case event_arr[3] :
                clearTimeout(press_inter);
                tap_crash = false;
                pressed = false;
                can_move = false;
                break;
            default:
        }
    };

    var init = function(){
        if (!is_mobi_dev){
            touch_events = mouse_events;
        }
        event_arr = touch_events.split(" ");
        event_arr.forEach(function(event_name){
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
        },
        "onmove" : function(tap_id, tap_func){
            if (!move_func_maps[tap_id]){
                move_func_maps[tap_id] = tap_func;
            }
        },
        "unmove" : function(tap_id){
            delete move_func_maps[tap_id];
        }
    };
    $.fn.extend({
        "tap" : function(func){
            $(this).each(function(){
                touch.ontap(_get_tap_id($(this)), $.proxy(func, this));
            })
        },
        "untap" : function(){
            $(this).each(function(){
                touch.untap(_get_tap_id($(this)));
            })
        },
        "press" : function(func){
            $(this).each(function(){
                touch.onpress(_get_tap_id($(this)), $.proxy(func, this));
            })
        },
        "unpress" : function(){
            $(this).each(function(){
                touch.unpress(_get_tap_id($(this)));
            })
        },
        "move" : function(func){
            $(this).each(function(){
                touch.onmove(_get_tap_id($(this)), $.proxy(func, this));
            })
        },
        "unmove" : function(){
            $(this).each(function(){
                touch.unmove(_get_tap_id($(this)));
            })
        }
    });
})($);