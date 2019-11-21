/**
 函数
 函数名
 tweenTransition

 作用
 快速实现元素的样式过渡   2000   100  500

 示例
 tweenTransition(el, style, init, end, duration, step);

 tweenTransition(el, style, init, end, duration, step, type);

 box  width  200 ->  1000  5s  20ms
 tweenTransition(box, 'width', 200, 1000, 5000, 20);
 tweenTransition(box, 'width', 200, 1000, 5000, 20, 'linear');

 tweenTransition(box, 'width', 200, 1000, 5000, 20, 'linear', function(){
    console.log('test');
 });
 依赖:
 - transformCSS.js
 */
/**
 *
 * @param el    元素对象
 * @param style 样式
 * @param init  起始样式值
 * @param end   结束样式值
 * @param duration  持续的时间
 * @param step  变换的时间步进
 * @param type  linear  back  other  变换类型
 */
function tweenTransition(el, style, init, end, duration = 2000, step = 20, type = 'linear', callback) {
    //tween函数
    var tweens = {
        back: function (t, b, c, d, s) {
            if (s == undefined) s = 1.8;// 回弹系数
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        }
    };

    //1. 变量声明
    var t = 0;
    var b = init;
    var c = end - init;
    var d = duration;

    /**
     * el.timer = {
     *     left: 2,
     *     top:  3
     * }
     *
     * @type {number}
     */
    if (el.timer === undefined) {
        el.timer = {};
    }
    //确保定时器不重复
    clearInterval(el.timer[style]);//content.timer.translateY =>  2    3
    //2. 定时器
    el.timer[style] = setInterval(function () {
        //检测
        if (t >= d) {
            clearInterval(el.timer[style]);

            return;
        }

        //时间自增
        t += step;

        //计算当前时刻的样式值
        var res = tweens[type](t, b, c, d);

        //控制单位
        var unit = '';

        //计算样式值
        switch (style) {
            case 'width':
            case 'height':
            case 'left':
            case 'top':
            case 'right':
            case 'bottom':
                //设置
                el.style[style] = res + 'px';
                break;
            case 'translateX':
            case 'translateY':
            case 'translateZ':
            case 'rotate':
            case 'rotateX':
            case 'rotateY':
            case 'rotateZ':
            case 'scale':
            case 'scaleX':
            case 'scaleY':
            case 'scaleZ':
                transformCSS(el, style, res);
                break;

            case 'opacity':
                el.style[style] = res;
        }

        //执行用户的回调
        if (callback && typeof callback === 'function') {
            callback();
        }
    }, step)
}