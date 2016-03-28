/**
 * Created by @厕所的灯 on 16/3/25.
 */

(function($){
    var class_name = "_layout_full_page";
    var close_button_class_name = "_layout_full_page_close";
    var full_page_html = "<div class='" + class_name + "'></div>";
    var page_obj_arr = [];
    var layout_loaded;
    var z_index = 10000;
    var layout_init = function(){
        if (layout_loaded){
            return;
        }
        $("head").append("<style>\
        ._hidden_scroll{overflow: hidden;}\
        ." + class_name + "{\
            background-color: #FFF;\
            position: fixed;\
            opacity: 0;\
            transition:opacity 500ms;\
            -moz-transition:opacity 500ms;\
            -webkit-transition:opacity 500ms;\
            -o-transition:opacity 500ms;\
            top     : 0;\
            left    : 0;\
            right   : 0;\
            bottom  : 0;\
            display: none;\
            overflow: auto;\
        }\
            </style>");
        layout_loaded = true;
        $(window).resize(page_full_screen);
    };
    var page_full_screen = function(){
        var win = $(window);
        $("." + class_name).css({
            "height"  : win.height(),
            "width"   : win.width(),
        });
    }
    var fullPage = function(){
        layout_init();
    };

    fullPage.prototype.addNewPage = function(html, back_color){
        var _this = this;
        var def_evt = "click";
        html = $(html);
        html = $(full_page_html).append(html);
        if ($.fn.tap) {
            def_evt = "tap";
        }

        $("." + close_button_class_name, html)[def_evt](function(){
            _this.hidden();
        });
        page_obj_arr.push(html);
       if (!back_color){
           back_color = "#FFF";
       }
        html.css("backgroundColor", back_color);
        $("body").append(html);
        return this;
    }
    fullPage.prototype.hidden = function(){
        var cur = page_obj_arr.pop();
        var _this = this;
        if (cur){
            cur.css("opacity", 0);
            setTimeout(function(){
                cur.css("display", "none");
                cur.remove();
            }, 600);
        }
        if (page_obj_arr.length == 0){
            $("body").removeClass('_hidden_scroll');
        }
        return this;
    }
    fullPage.prototype.show = function(){
        var cur = page_obj_arr[page_obj_arr.length - 1];
        if (cur){
            $("body").addClass('_hidden_scroll');
            var win = $(window);
            cur.css({
                "display" : "block",
                "height"  : win.height(),
                "width"   : win.width(),
                "zIndex"  : z_index++
            });
            setTimeout(function(){
                cur.css("opacity", 1);
            },15);
        }
        return this;
    }
    fullPage.prototype.clearAll = function(){
        var cur;
        setTimeout(function(){
            $("." + class_name).remove();
        },300);
    }
    fullPage = new fullPage();
    $.extend({"fullPage" : fullPage});
})($);