/**
 * Created by @厕所的灯 on 16/3/23.
 */

(function($){
    var mask_interval;
    var dialog_interval;
    var auto_hidden_interval;
    var layout_loaded = false;
    var mask_html = "<div class='_layout_mask'></div>";
    var dialog_html = "<div class='_layout_dialog'></div>";
    var actions_html = "<div class='_layout_actions '></div>";
    var mask_obj, dialog_obj, actions_obj;
    var cancel_func, ok_func;
    var dialog;
    var def_evt = $.fn.tap ? "tap" : "click";

    var layout_init = function(){
        if (layout_loaded){
            return;
        }
        $("head").append("<style>\
            ._layout_mask{\
            z-index: 100000;\
            position: fixed;\
            background: #000;\
            opacity: 0;\
            transition:opacity 500ms;\
            -moz-transition:opacity 500ms;\
            -webkit-transition:opacity 500ms;\
            -o-transition:opacity 500ms;\
            display: none;\
        }\
        ._layout_dialog{\
            z-index: 100001;\
            position: fixed;\
            opacity: 0;\
            transition:opacity 500ms;\
            -moz-transition:opacity 500ms;\
            -webkit-transition:opacity 500ms;\
            -o-transition:opacity 500ms;\
            display: none;\
        }\
        ._layout_actions{\
            z-index: 100002;\
            background-color: #FFF;\
            width: 100%;\
            text-align: center;\
            position: fixed;\
            display: none;\
        }\
            </style>");
        $("body").append(mask_html);
        $("body").append(dialog_html);
        $("body").append(actions_html);
        layout_loaded = true;
        mask_obj = $("._layout_mask");
        dialog_obj = $("._layout_dialog");
        actions_obj = $("._layout_actions");
        $(window).resize(mask_full_screen);
        $(window).resize(dialog_middle_screen);
    };
    var mask_full_screen = function(){
        var win = $(window);
        mask_obj.css({
            "height"  : win.height(),
            "width"   : win.width(),
            "top"     : 0,
            "left"    : 0,
            "right"   : 0,
            "bottom"  : 0
        });
    }
    var dialog_middle_screen = function(){
        var win = $(window);
        var w_w = win.width();
        var w_h = win.height();
        var w = dialog_obj.width();
        var h = dialog_obj.height();
        dialog_obj.css({
            "top"     : (w_h - h) / 2,
            "left"    : (w_w - w) / 2
        });
    };
    var layout = function(){

    };
    layout.prototype.hiddenMask = function(){
        clearTimeout(mask_interval);
        mask_obj.css("opacity", 0);
        mask_interval = setTimeout(function(){
            mask_obj.css("display", "none");
        }, 600);
    }
    layout.prototype.hiddenDialog = function(){
        clearTimeout(dialog_interval);
        dialog_obj.css("opacity", 0);
        dialog_interval = setTimeout(function(){
            dialog_obj.html("");
            dialog_obj.css("display", "none");
        }, 600);
    }
    layout.prototype.hidden = function(){
        this.hiddenMask();
        this.hiddenDialog();
        this.hiddenActions();
    }
    layout.prototype.showMask = function(){
        layout_init();
        clearTimeout(mask_interval);
        mask_full_screen();
        mask_obj.css("display", "block");
        setTimeout(function(){
            mask_obj.css("opacity", 0.3);
        },15);
    }
    layout.prototype.showDialog = function(html, options){
        clearTimeout(dialog_interval);
        clearTimeout(auto_hidden_interval);
        var _this = this;
        layout_init();
        options = $.extend({
            "ok" : function(){return true;},
            "cancel" : function(){return true;},
            "auto_hidden" : false
        }, options);
        dialog_obj.html("");
        html = $(html);
        $("._layout_tap_ok", html)[def_evt](function(){
            options.ok() && _this.hidden();
        });
        $("._layout_tap_cancel", html)[def_evt](function(){
            options.cancel() && _this.hidden();
        });
        dialog_obj.append(html);
        dialog_middle_screen();
        dialog_obj.css("display", "block");
        setTimeout(function(){
            dialog_obj.css("opacity", 1);
        },15);
        if (options["auto_hidden"]){
            var _this = this;
            auto_hidden_interval = setTimeout(function(){
                _this.hidden();
            }, 500);
        }
    }
    layout.prototype.show = function(html, options){
        this.showMask();
        this.showDialog(html, options);
    }
    layout.prototype.showActions = function(html, type){
        type = type || "bottom";
        html = $(html);
        layout_init();
        this.showMask();
        var _this = this;
        $("._layout_actions_cancel", html)[def_evt](function(){
            _this.hiddenActions()
        });
        actions_obj.append(html);
        actions_obj.css("display", "block");
        actions_obj.css(type, 0 - actions_obj.height());
        setTimeout(function(){
            actions_obj.css("transition",  type + " 200ms");
            actions_obj.css(type,  0);
        },20);
        var _this = this;
        mask_obj.tap(function(){
            _this.hiddenActions(type);
        })
    };
    layout.prototype.hiddenActions = function(type){
        type = type || "bottom";
        this.hiddenMask();
        actions_obj.css(type, 0 - actions_obj.height());
        setTimeout(function(){
            actions_obj.empty();
            actions_obj.css({
                "transition" : "",
                "display"     : "none"
            });
            actions_obj.css(type, "");
        },200);
        mask_obj.untap();
    };
    layout.prototype.showTopAction = function(html){
        this.showActions(html, "top");
    };
    layout.prototype.hiddenTopAction = function(){
        this.hiddenActions("top");
    };
    dialog = new layout();
    $.extend({"dialog" : dialog});
})($);