/**
 函数
 Touchscroll

 功能
 能快速实现内容的滑动

 示例
 new Touchscroll('#outer', '#inner');

 new Touchscroll('#main', '#content');


 new Touchscroll('#main', '#content',{
    start: function(){},
    move: function(){},
    end: function(){},
 });


 */
/**
 *
 * @param outer  外层包裹元素的选择器
 * @param inner  内层包裹元素的选择器
 * @constructor
 */
function Touchscroll(outer, inner, options = {}) {
    //获取元素对象
    var main = document.querySelector(outer);
    var content = document.querySelector(inner);
    var scrollBar = null;

    //绑定触摸开始事件
    main.addEventListener('touchstart', function (e) {
        //获取触点位置
        this.y = e.targetTouches[0].clientY;
        this.top = transformCSS(content, 'translateY');
        //获取触摸开始的时间
        this.startTime = Date.now();
        //清空定时器
        if (content.timer && content.timer.translateY) {
            clearInterval(content.timer.translateY);
        }

        if (scrollBar.timer && scrollBar.timer.translateY) {
            clearInterval(scrollBar.timer.translateY);
        }
        //运行用户的 start 回调
        if (options && typeof options.start === 'function') {
            options.start();
        }
    });

    //触摸滑动
    main.addEventListener('touchmove', function (e) {
        this._y = e.targetTouches[0].clientY;
        var translateY = this._y - this.y + this.top;
        //设置 translateY 的值
        transformCSS(content, 'translateY', translateY);
        //修改滚动条的垂直方向的偏移
        var y = -translateY / content.offsetHeight * main.offsetHeight;
        //设置偏移
        transformCSS(scrollBar, 'translateY', y);
        //运行用户的 start 回调
        if (options && typeof options.move === 'function') {
            options.move();
        }
    });

    //触摸结束
    main.addEventListener('touchend', function (e) {
        //获取触摸结束的时间
        this.endTime = Date.now();
        var disTime = this.endTime - this.startTime;
        //距离差
        var disY = e.changedTouches[0].clientY - this.y;
        var speed = disY / disTime;
        //计算位移
        var distance = speed * 200;
        //设置最终的 translateY 的值
        var translateY = transformCSS(content, 'translateY');// -200
        var endTranslateY = translateY + distance;//   -500
        //判断 默认的变换样式
        var transitionType = 'easeOut';
        if (endTranslateY >= 0) {
            endTranslateY = 0;
            transitionType = 'back';
        }
        //计算最小的 translateY
        var minTranslateY = -(content.offsetHeight - main.offsetHeight);
        if (endTranslateY <= minTranslateY) {
            endTranslateY = minTranslateY;
            transitionType = 'back';
        }
        //处理内容元素的位移
        tweenTransition(content, 'translateY', translateY, endTranslateY, 500, 20, transitionType, options.move);
        //处理滚动条的惯性位移
        //获取滚动条最终的位置
        var _y = -endTranslateY / content.offsetHeight * main.offsetHeight;
        //获取滚动条当前的位置
        var y = transformCSS(scrollBar, 'translateY');
        tweenTransition(scrollBar, 'translateY', y, _y, 500, 20, transitionType);

        //运行用户的 start 回调
        if (options && typeof options.end === 'function') {
            options.end();
        }
    });

    //计算滚动条的高度
    function init() {
        //相对定位样式增加
        main.style.position = 'relative';
        main.style.overflow = 'hidden';
        if (!scrollBar) {
            //创建scrollbar 元素
            scrollBar = document.createElement('div');

            scrollBar.className = 'scroll-bar';
            scrollBar.style.width = '4px';
            scrollBar.style.background = 'rgba(36,62,0,0.6)';
            scrollBar.style.position = 'absolute';
            scrollBar.style.right = '0';
            scrollBar.style.top = '0';
            scrollBar.style.borderRadius = '2px';
            //插入到容器中
            main.appendChild(scrollBar);
            //计算滚动条的高度
            window.addEventListener('load', function () {
                var h = Math.abs(main.offsetHeight / content.offsetHeight * main.offsetHeight);
                //设置高度
                scrollBar.style.height = h + 'px';
            });
        } else {
            var h = Math.abs(main.offsetHeight / content.offsetHeight * main.offsetHeight);
            //设置高度
            scrollBar.style.height = h + 'px';
        }

    }

    init();

    //
    this.init = init;
}