/**
 函数
 gesture

 作用
 为元素绑定手势事件

 示例
 gesture(box, {
        //手势事件的处理程序
        start: function(){},
        //s手势改变
        change: function(){},
        //手势结束
        end: function(){}
    });
    依赖
     - transformCSS.js
 */
/**
 * 事件三要素
 * @param el         事件源
 * @param callback   事件类型与事件处理程序
 */
function gesture(el, callback) {
    //标识当前手势开始事件是否触发
    el.hasGestureStartTiggered = false;//
    //绑定事件
    el.addEventListener('touchstart', function (e) {
        //判断是否是两个或两个手指以上
        if (e.touches.length >= 2) {
            //设置状态值
            this.hasGestureStartTiggered = true;
            //执行手势开始的事件处理程序
            if (callback && typeof callback.start === 'function') {
                //起始状态下两个触点的距离
                el.startDis = getDistance(e.touches[0], e.touches[1]);
                //获取起始状态下的夹角
                el.startDegree = getDegree(e.touches[0], e.touches[1]);

                callback.start(e);
            }
        }
    });

    //手势改变事件
    el.addEventListener('touchmove', function (e) {
        //判断是否是两个或两个手指以上
        if (e.touches.length >= 2) {
            //运行手势改变事件处理程序
            if (callback && typeof callback.change === 'function') {
                //获取滑动之后 两个触点之间的距离
                el.endDis = getDistance(e.touches[0], e.touches[1]);
                //设置缩放比例
                e.scale = el.endDis / el.startDis;
                //获取手势改变之后的夹角
                el.endDegree = getDegree(e.touches[0], e.touches[1]);
                //计算两个夹角的差
                e.rotation = el.endDegree - el.startDegree;

                callback.change(e);
            }
        }
    });

    //手势改变事件
    el.addEventListener('touchend', function (e) {
        //判断是否是两个或两个手指以上
        if (e.touches.length < 2 && el.hasGestureStartTiggered) {
            //运行手势开始事件处理程序
            if (callback && typeof callback.end === 'function') {
                callback.end();
            }
            //还原标识变量的初始值
            el.hasGestureStartTiggered = false;
        }
    });

    //计算两个触点之间的距离
    function getDistance(t1, t2) {
        //计算位置差
        var disX = t2.clientX - t1.clientX;
        var disY = t2.clientY - t1.clientY;
        return Math.sqrt(disX * disX + disY * disY);
    }

    /* *
    计算两个触点形成的夹角
     */
    function getDegree(t1, t2) {
        //获取垂直方向上的距离差
        var disY = t2.clientY - t1.clientY;
        var disX = t2.clientX - t1.clientX;
        return Math.atan2(disY, disX);
    }

}
