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
        var for_arr ={}, var_arr = {};
        var clear_reg = [
            //new RegExp("<foreach[\\s\\S]+?foreach>", "img"),
            //new RegExp("<if[\\s\\S]+?if>", "img"),
            new RegExp("{#\\s*\.+\\s*#}", "img")
        ];
        var get_var_reg = function(name){
            return new RegExp("{#\\s*" + name + "\\s*#}", "igm");
        };
        var get_foreach_reg = function(name){
            return new RegExp("<foreach\\s+id=['\\\"]" + name + "['\\\"]>[\\s\\S]*?<\\/foreach>", "igm");
        };
        var get_foreach_var_reg = function(name, f_name){
            return new RegExp("{#\\s*" + name + "\\s*\\[\\s*" + f_name + "\\s*\\]\\s*#}", "igm");
        };
        var parse_var = function(){
            for (var name in var_arr){
                reg = get_var_reg(name);
                html_result = html_result.replace(reg, vars[name]);
            }
            html_template = $("<span>").html(html_result);
            $("var", html_template).each(function(){
                var var_tag = $(this);
                var var_name = var_tag.attr("name");
                try{
                    var val = var_arr[var_name];
                    if (val){
                        var_tag.replaceWith(val);
                    }
                    else{
                        var def = var_tag.attr("default");
                        if (def){
                            var_tag.replaceWith(def);
                        }
                        else{
                            var_tag.remove();
                        }
                    }
                }
                catch(e){
                    var_tag.remove();
                }
            });
            html_result = html_template.html();
        };
        var parse_foreach = function(){
            for (var name in for_arr){
                var f_html = "";
                var foreach_template = $("#" + name, html_template);
                if (foreach_template.length){
                    for_arr[name].forEach(function(f_o){
                        var foreach_html = foreach_template.html();
                        for (var f_name in f_o){
                            reg = get_foreach_var_reg(name, f_name);
                            foreach_html = foreach_html.replace(reg, f_o[f_name]);
                        }
                        f_html += foreach_html;
                    });
                }
                $("foreach[id='" + name + "']" + name, html_template).replaceWith(f_html);
                html_result = html_template.html();
            }
        };
        var parse_if = function(){
            $("if", html_template).each(function(){
                var if_tag = $(this);
                var condition = if_tag.attr("condition");
                try{
                    var _ret = eval(condition);
                    if (_ret){
                        if_tag.replaceWith(if_tag.html());
                    }
                    else{
                        if_tag.remove();
                    }
                }
                catch(e){
                    if_tag.remove();
                }
            });
            html_result = html_template.html();
        };
        if ($.isPlainObject(vars)){
            for (var name in vars){
                if ($.isArray(vars[name])){
                    for_arr[name] = vars[name];
                }
                else{
                    var_arr[name] = vars[name];
                }
            }
            parse_var();
            parse_foreach();
            parse_if();
        }
        $("if,var,foreach", html_template).each(function(){
            $(this).remove();
        });
        html_result = html_template.html();
        $.each(clear_reg, function(i){
            html_result = html_result.replace(clear_reg[i], "");
        });
        reg = new RegExp("t_src", "img");
        html_result = html_result.replace(reg, "src");
        delete html_template;
        return html_result;
    };
    $.extend({
        "touchPosition" : _get_touch_position,
        "templateRender" : _template_render
    });
})($);