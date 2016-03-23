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
    var mask_obj, dialog_obj;
    var cancel_func, ok_func;
    var dialog;
    var layout_init = function(){
        if (layout_loaded){
            return;
        }
        $("head").append("<style>\
            ._layout_mask{\
            z-index: 10000;\
            position: fixed;\
            background: #000;\
            opacity: 0;\
            transition:opacity 300ms;\
            -moz-transition:opacity 300ms;\
            -webkit-transition:opacity 300ms;\
            -o-transition:opacity 300ms;\
            display: none;\
        }\
        ._layout_dialog{\
            z-index: 10001;\
            position: fixed;\
            opacity: 0;\
            transition:opacity 300ms;\
            -moz-transition:opacity 300ms;\
            -webkit-transition:opacity 300ms;\
            -o-transition:opacity 300ms;\
            display: none;\
        }\
            </style>");

        $("body").append(mask_html);
        $("body").append(dialog_html);
        layout_loaded = true;
        mask_obj = $("._layout_mask");
        dialog_obj = $("._layout_dialog");
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
    }
    var layout = function(){

    };
    layout.prototype.hiddenMask = function(){
        clearTimeout(mask_interval);
        mask_obj.css("opacity", 0);
        mask_interval = setTimeout(function(){
            mask_obj.css("display", "none");
        }, 300);
    }
    layout.prototype.hiddenDialog = function(){
        clearTimeout(dialog_interval);
        dialog_obj.css("opacity", 0);
        dialog_interval = setTimeout(function(){
            dialog_obj.css("display", "none");

        }, 300);
    }
    layout.prototype.hidden = function(){
        this.hiddenMask();
        this.hiddenDialog();
    }
    layout.prototype.showMask = function(){
        layout_init();
        clearTimeout(mask_interval);
        mask_full_screen();
        mask_obj.css({
            "display" : "block",
            "opacity" : 0.3
        });
    }
    layout.prototype.showDialog = function(html, options){
        var _this = this;
        var def_evt = "click";
        layout_init();
        options = $.extend({
            "ok" : function(){},
            "cancel" : function(){},
            "auto_hidden" : false
        }, options);
        dialog_obj.html("");
        clearTimeout(dialog_interval);
        clearTimeout(auto_hidden_interval);
        html = $(html);
        if ($.fn.tap) {
            def_evt = "tap";
        }
        $("._layout_tap_ok", html)[def_evt](function(){
            options.ok();
            _this.hidden();
        });
        $("._layout_tap_cancel", html)[def_evt](function(){
            options.cancel();
            _this.hidden();
        });
        dialog_obj.append(html);
        dialog_middle_screen();
        dialog_obj.css({
            "display" : "block",
            "opacity" : 1
        });
        if (options["auto_hidden"]){
            var _this = this;
            auto_hidden_interval = setTimeout(function(){
                _this.hidden();
            }, 1500);
        }
    }
    layout.prototype.show = function(html, options){
        this.showMask();
        this.showDialog(html, options);
    }
    dialog = new layout();
    $.extend({"dialog" : dialog});
})($);