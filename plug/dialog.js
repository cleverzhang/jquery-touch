/**
 * Created by @厕所的灯 on 16/4/13.
 */

(function($){
    var _get_error_html = function(text, is_error){
        var c = is_error ? "m-font-warn" : "m-font-check";
        return "<div class='m-popup'>\
            <div class='m-box m-box-dir m-box-center'>\
            <header>\
            <i class='m-font " + c + "'></i>\
            </header>\
            <h3>" + text + "</h3>\
            </div>\
            </div>";
    };
    var _get_loading_html = function(){
        return "<div class='m-popup loading'>\
        <div class='m-box m-box-dir m-box-center '>\
            <header>\
            <div class='m-loading m-loading-light'><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>\
            </header>\
            <h3>处理中</h3>\
            </div>\
            </div>";
    };
    var _get_confirm_html = function(text, extend_html){
        extend_html = extend_html || "";
        return "<div class='m-dialog'>\
        <header>\
        <h3>" + text + "</h3>\
        <aside class='m-box-center-a'>" + extend_html + "</aside>\
        </header>\
        <footer class='m-btm-btns m-box'>\
            <div class='m-box-col'><a href='javascript:;' class='m-btn m-btn-white cancel _layout_tap_cancel'>取消</a></div>\
            <div class='m-box-col'><a href='javascript:;' class='m-btn m-btn-white text-orange _layout_tap_ok'>确定</a></div>\
            </footer>\
            </div>";
    };
    var _get_alert_html = function(text, extend_html){
        extend_html = extend_html || "";
        return "<div class='m-dialog'>\
        <header>\
        <h3>" + text + "</h3>\
        \<aside class='m-box-center-a'>" + extend_html + "</aside>\
        </header>\
        <footer class='m-btm-btns m-box'>\
            <div class='m-box-col'><a href='javascript:;' class='m-btn m-btn-white text-orange _layout_tap_ok'>我知道了</a></div>\
            </footer>\
            </div>";
    };
    var _get_actions_html = function(){
        return "<div style='line-height:60px;'>\
            <div class='cancel_box'>\
                <div class='cancel_btn _layout_actions_cancel'><a class='txt-f18'>取消</a></div>\
            </div>\
            </div>";
    };
    var extend = {};
    extend["success"] = function(text, params){
        $.dialog.show(_get_error_html(text), {'auto_hidden':true});
    };
    extend["error"] = function(text){
        $.dialog.show(_get_error_html(text, true), {'auto_hidden':true});
    };
    extend["confirm"] = function(text, params, ext){
        params = params || {};
        $.dialog.show(_get_confirm_html(text, ext), params);
    };
    extend["alert"] = function(text, params, ext){
        params = params || {};
        $.dialog.show(_get_alert_html(text, ext), params);
    };
    extend["actions"] = function(options){
        var cancel = $.dialog.hiddenActions;
        var html = $(_get_actions_html());
        if ($.type(options) !== "array"){
            options = [];
        }
        $.each(options, function(i, o){
            options[i] = $.extend({
                "text" : "button text",
                "func" : function(){return true;}
            }, options[i]);
        });

        $.each(options, function(i, n){
            var def_evt = $.fn.tap ? "tap" : "click";
            var item = $("<p class='alert_txt line-bot-box'><a class='txt-f17'>" + n.text + "</a></p>");
            item[def_evt](function(){
                n.func();
                $.dialog.hiddenActions();
            });
            $("._layout_actions_cancel", html).before(item);
        });
        $.dialog.showActions(html)
    };
    extend["waiting"] = {};
    extend["waiting"]["show"] = function(){
        $.dialog.show(_get_loading_html());
    };
    extend["waiting"]["hidden"] = function(){
        $.dialog.hidden();
    };
    $.extend(extend);
})($);
(function($){
    var _get_stockjobbing_html = function(params){
        var num = params["act"] == 1 ? params["buy"] : params["sale"];
        return "<div class='m-dialog'>\
        <header>\
        <p class='tit'>" + (params["act"] == 1 ? "买入":"卖出") + "</p>\
            <div class='s_cont'>\
            <p><span>" + params["name"]  + params["em"] + "</span><i>当前价：<em class='" + params["color"] + "'>" + params["price"] + "</em></i></p>\
            <div class='in_area'><input id='stockjobbing_number' type='tel' placeholder='" + (params["act"] == 1 ? "买入":"卖出") + "量'><span id='tips'>可" + (params["act"] == 1 ? "买":"卖") + "<i>" + num + "</i>股</span></div>\
            </div>\
            <div class='m-box-col all_buy'>\
            <a href='javascript:;' type='1' class='m-btn m-btn-white cancel'>全部</a>\
            <a href='javascript:;' type='2' class='m-btn m-btn-white cancel'>1/2</a>\
            <a href='javascript:;' type='3' class='m-btn m-btn-white cancel'>1/3</a>\
        <a href='javascript:;' type='4' class='m-btn m-btn-white cancel'>1/4</a>\
        </div>\
        </header>\
        <footer class='m-btm-btns m-box'>\
            <div class='m-box-col'><a href='javascript:;' class='m-btn m-btn-white cancel _layout_tap_cancel'>取消</a></div>\
            <div class='m-box-col'><a href='javascript:;' class='m-btn m-btn-white text-orange buy_sure _layout_tap_ok'>确定</a></div>\
            </footer>\
            </div>";
    };
    var _execute_stockjobbing = function(code, act, number, func){
        var params = {};
        params["zh_id"] = STOCK.zh_id;
        params["code"] = code;
        params["act"] = act;
        params["number"] = number;
        $.post("/h5/ajax/zh/stockjobbing", params, function(json){
            if (json.code == 10000){
                func(number);
            }
            else{
                $.error(json.msg);
            }
        });
    };
    var extend = {};
    extend["stockjobbing"] = function(code, act, func){
        $.waiting.show();
        $.post("/h5/ajax/zh/stockinfo", {"code" : code, "zh_id" : STOCK.zh_id}, function(json){
            var stock = json.data[code];
            if (json.code == 10000 && stock){
                if (stock.jiaoyistate == 2){
                    $.error("停牌股票不可交易");
                    return;
                }
                else if (stock.jiaoyistate == 3){
                    $.error("退市股票不可交易");
                    return;
                }
                $.waiting.hidden();
                $params = {};
                $params["act"] = act;
                $params["name"] = stock.stock_name;
                $params["color"] = stock.fallingup_num > 0 ? "red" : "green";
                $params["price"] = stock.zuixin;
                $params["em"] = "";
                $params["buy"] = stock.buy;
                $params["sale"] = stock.sale;

                if (stock.upstop == stock.zuixin){
                    $params["em"] = "<em class='up'>涨停</em>";
                }
                else if (stock.downstop == stock.zuixin){
                    $params["em"] = "<em class='down'>跌停</em>";
                }
                $html = $(_get_stockjobbing_html($params));
                var _click_ok = function(){
                    var stockjobbing_number = $("#stockjobbing_number", $html).val();
                    var text;
                    if (act){
                        if (stockjobbing_number == "" || isNaN(stockjobbing_number) || stockjobbing_number <= 0){
                            text = "请输入买入股数";
                        }
                        else if (stockjobbing_number % 100 != 0){
                            text = "买入必须是100的倍数";
                        }
                        else if(stockjobbing_number > $params["buy"]){
                            text = "买入超出上限";
                        }
                    }
                    else{
                        if (stockjobbing_number == "" || isNaN(stockjobbing_number) || stockjobbing_number <= 0){
                            text = "请输入卖入股数";
                        }
                        else if(stockjobbing_number > $params["sale"]){
                            text = "卖出超出上限";
                        }
                    }
                    if (text){
                        $("#tips", $html).html("<em>" + text + "</em>");
                        return;
                    }
                    else{
                        $("#tips", $html).html("提交中..");
                    }
                    _execute_stockjobbing(code, act, stockjobbing_number, func);
                };
                $.dialog.show($html, {"ok" : _click_ok});
                $("a").tap(function(){
                    var t = $(this).attr("type");
                    var s_num = act == 1 ? Math.floor(stock.buy /100 / t) * 100 : Math.floor(stock.sale / t);
                    $("#stockjobbing_number", $html).val(s_num);
                });
            }
            else{
                $.waiting.hidden();
            }
        });
    };
    $.extend(extend);
})($);