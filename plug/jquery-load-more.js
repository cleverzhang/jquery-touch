/**
 * Created by @厕所的灯 on 16/3/22.
 */

(function($){
    var div_loaded = false;
    var loading = false;
    var destory = false;
        var pull_init = function(){
        div_loaded = $("head").append("<style>._loadmore {height: 24px;line-height: 24px;padding: 10px;text-align: center;}._loadmore .icon {display: inline-block;margin-right: 4px;vertical-align: -4px;width: 20px;height: 20px; -webkit-transform-origin: 50%;transform-origin: 50%; -webkit-animation: loadmore-icon 1s steps(12, end) infinite;animation: loadmore-icon 1s steps(12, end) infinite;background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");background-repeat: no-repeat;background-position: 50%;background-size: 100%;}@-webkit-keyframes loadmore-icon {100% { -webkit-transform: rotate(360deg);transform: rotate(360deg);}}@keyframes loadmore-icon {100% {-webkit-transform: rotate(360deg);transform: rotate(360deg);}}</style>");
            $("body").append("<div class='_loadmore'><div class='icon'></div>正在加载...</div>");
        };
        var scroll_event = function(){
            if (loading || destory || !div_loaded){
                return;
            }
            var doc = $("body");
            var offset = $('._loadmore').offset().top - (doc.height() + doc.scrollTop());
            if(offset <= 50) {
                loading = true;
                event_func();
            }
        };
        var event_func = function(){};
        var pull = {};
        pull.loadStart = function(){
            loading = true;
        };
        pull.loadEnd = function(){
            loading = false;
        };
        pull.load = function(load_func){
            if (div_loaded === false){
                pull_init();
            }
            event_func = load_func;
            $(window).on("scroll", scroll_event);
        };
        pull.destory = function(){
            $("._loadmore").remove();
            $(window).off("scroll", scroll_event);
            destory = true;
    };

    $.extend({
        "loadmore" : pull
    });
})($);