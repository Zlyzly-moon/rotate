/**
 //封装一个函数
 函数名
 transformCSS

 //作用
 设置元素的 transform 变形
 获取元素的 transform 变形的值

 //使用示例
 //设置
 box = document.querySelector('#box');

 transformCSS(box, 'translateX', 100);
 transformCSS(box, 'scale', 2);
 transformCSS(box, 'rotate', 45);

 //获取
 var scale = transform(box, 'scale');
 var rotate = transform(box, 'rotate');
 */
/**
 *
 * @param el      元素的事件对象
 * @param style   设置的变形样式 eg: translateX  translateY  scale  rotate...
 * @param value    100   2   注意: 不需要单位 px  2  deg
 */
// var store = undefined;

/*transformCSS(box, 'translateX', 100);
    /*transformCSS(box, 'rotate', 100);
    /*transformCSS(box, 'scale', 2);
            ||
            ||
            ||
            \/
    el.style.transform = 'translateX(100px)';*/
(function (w) {
    function transformCSS(el, style, value) {
        //$('#box').attr('name')   获取 name 属性
        //$('#box').attr('name', 'xiaohigh') 设置 name 属性的值为 xiaohigh

        if (el.store === undefined) {
            el.store = {
                translateZ:0 //
            };
        }

        //根据参数的个数识别
        if (arguments.length === 3) {
            // el.style.transform = style + '(' + value + ')';
            // //判断原来是否有变形样式
            // //创建一个仓库   style translateX   value 100  =>  {translateX : 100}  {translate:100, scale:2}
            // // {translate:100, scale:2}   =>>>>>>   translateX(100px)  scale(2) rotate(80deg)

            // //写入仓库
            el.store[style] = value;

            // //遍历
            var str = '';
            for (var i in el.store) {
                // str += i + '('+store[i]+'px)';
                switch (i) {
                    case 'translateX':
                    case 'translateY':
                    case 'translateZ':
                        str += i + '(' + el.store[i] + 'px) ';
                        break;

                    case 'scale':
                    case 'scaleX':
                    case 'scaleY':
                    case 'scaleZ':
                        str += i + '(' + el.store[i] + ') ';
                        break;

                    case 'rotate':
                    case 'rotateX':
                    case 'rotateY':
                    case 'rotateZ':
                        str += i + '(' + el.store[i] + 'deg) ';
                        break;
                }
            }
            // //设置
            el.style.transform = str;

            // el.style.transform = style + '(' + value + 'px)';
            //设置
            /*
            switch(style){
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    el.style.transform = style+'('+value+'px)';
                    break;

                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'scaleZ':
                    el.style.transform = style+'('+value+')';
                    break;

                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                    el.style.transform = style+'('+value+'deg)';
                    break;
            }
             */
        }

        if (arguments.length === 2) {
            //获取
            //如果变形数据仓库中存在 则返回属性值
            if (el.store[style]) {
                return el.store[style];
            } else {
                //如果不存在则返回默认值  translateX 0   rotate 0   scale  1
                if (style.substr(0, 5) === 'scale') {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    }
    // transformCSS(box, 'translateX', 100);
    // transformCSS(box, 'scale', 2);
    // transformCSS(box, 'rotate', 2);

    //获取样式
    // var scale = transform(box, 'scale');
    w.transformCSS = transformCSS;
})(window);