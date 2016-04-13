/**
 * Created by @厕所的灯 on 15/2/28.
 */

(function($){
    /**
     * 获取touch坐标
     * @param e
     * @returns {{x: (*|Number), y: (*|Number)}}
     * @private
     */
    var _get_touch_position = function(e) {
        var touch_events = "touchstart touchmove touchend".split(" ");
        e = e.originalEvent || e;
        if ($.inArray(e.type, touch_events)){
            return {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            };
        }
        else {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
    };
    /**
     * 简单的js模板实现
     * @param dom_id
     * @param vars
     * @returns {*}
     * @private
     */
    var _template_render = function(dom_id, vars){
        var html_template = $("<span>").html($("#" + dom_id).html());
        var html_result = html_template.html();
        var reg;
        if ($.isPlainObject(vars)){
            for (var name in vars){
                if ($.isArray(vars[name])){
                    var f_html = "";
                    var foreach_template = $("#" + name, html_template);
                    if (foreach_template.length){
                        vars[name].forEach(function(f_o){
                            var foreach_html = foreach_template.html();
                            for (var f_name in f_o){
                                var reg = new RegExp("{#\\s*" + name + "\\s*\\[\\s*" + f_name + "\\s*\\]\\s*#}");
                                foreach_html = foreach_html.replace(reg, f_o[f_name]);
                            }
                            f_html += foreach_html;
                        });
                    }
                    reg = new RegExp("<foreach\\s+id=['\\\"]" + name + "['\\\"]>[\\s\\S]*?<\\/foreach>", "igm");
                    html_result = html_result.replace(reg, f_html);
                }
                else{
                    reg = new RegExp("{#\\s*" + name + "\\s*#}");
                    html_result = html_result.replace(reg, vars[name]);
                }
            }
        }
        reg = new RegExp("<foreach[\\s\\S]+?foreach>", "img");
        html_result = html_result.replace(reg, "");
        reg = new RegExp("{#\\s*\.+\\s*#}", "img");
        html_result = html_result.replace(reg, "");
        return html_result;
    };
    $.extend({
        "touchPosition" : _get_touch_position,
        "templateRender" : _template_render
    });
})($);