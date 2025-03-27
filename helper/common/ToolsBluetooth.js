var Tools = {}

// 蓝牙是否开启
Tools.ison = function () {
    var r = http.get("http://127.0.0.1:9123/ison");
    if (r.statusCode == 200) {
        console.log("蓝牙开启成功" + r.body.string());
        return true;
    } else {
        console.error(r.statusCode);
        console.log("蓝牙开启失败" + r.body.string());
        return false;
    }
}
/**
 * 重启服务
 * 重新连接蓝牙服务
 */
Tools.restart = function () {
    var r = http.get("http://127.0.0.1:9123/restart");
    if (r.statusCode == 200) {
        console.log("蓝牙重启服务成功" + r.body.string());
        return true;
    } else {
        console.error(r.statusCode);
        console.log("蓝牙重启服务失败" + r.body.string());
        return false;
    }
}

/**
 * 按住一段时间(长按)
 * x: 整数值，表示按下的 x 坐标。
 * y: 整数值，表示按下的 y 坐标。
 * t: 整数值，表示按下持续时间。
 */
Tools.touch = function (x, y, t) {
    var r = http.get("http://127.0.0.1:9123/touch?x=" + x + "&y=" + y + "&t=" + t);
    if (r.statusCode == 200) {
        console.log("蓝牙长按成功" + r.body.string());
        return true;
    } else {
        console.error(r.statusCode);
        console.log("蓝牙长按失败" + r.body.string());
        return false;
    }
}

/**
 * 点击事件
 * x: 整数值，表示点击的 x 坐标。
 * y: 整数值，表示点击的 y 坐标。
 */
Tools.click = function (x, y) {
    //   var x=x+random(-10,10);
    //   var y=y+random(-10,10);
    var r1 = http.get("http://127.0.0.1:9123/click?x=" + x + "&y=" + y);
    if (r1.statusCode == 200) {
        console.log("蓝牙点击事件成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙点击事件失败" + r1.body.string());
        return false;
    }
}

/**
 * 按下事件
 * x: 整数值，表示按下的 x 坐标。
 * y: 整数值，表示按下的 y 坐标。
 */
Tools.touchdown = function (x, y) {
    var r1 = http.get("http://127.0.0.1:9123/touchdown?x=" + x + "&y=" + y);
    if (r1.statusCode == 200) {
        console.log("蓝牙按下事件成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙按下事件失败" + r1.body.string());
        return false;
    }
}

// /**
//  * 滑动事件
//  * x1: 整数值，表示滑动起始点的 x 坐标。
//  * y1: 整数值，表示滑动起始点的 y 坐标。
//  * x2: 整数值，表示滑动结束点的 x 坐标。
//  * y2: 整数值，表示滑动结束点的 y 坐标。
//  * lv: (可选)整数值，表示滑动弧度,0-300建议。
//  * steps: (可选)整数值，表示滑动的控制点数,越大越慢越精准,建议(10-100)
//  * downtime: (可选)整数值，按下时间（毫秒）。
//  * uptime: (可选)整数值，抬起之前时间（毫秒）。
//  * speed: (可选)整数值，表示滑动的速度。
//  * upcount: (可选)抬起次数:少数设备起不来。可以多次
//  */
// Tools.swipe = function (x1,y1,x2,y2,steps,downTime,upTime){
//     //var r1 = http.get("http://127.0.0.1:9123/swipe?x1=400&y1=600&x2=800&y2=1000&steps=10&downtime=5&uptime=5&speed=100");
//     var r1 = http.get("http://127.0.0.1:9123/swipe?x1="+x1+"&y1="+y1+"&x2="+x2+"&y2="+y2+"&steps="+steps+"&downtime="+downTime+"&speed=1");

//     if (r1.statusCode==200) {
//         console.log("蓝牙滑动事件成功"+r1.body.string());
//         return true;
//     } else {
//         console.error(r1.statusCode);
//         console.log("蓝牙滑动事件失败"+r1.body.string());
//         return false;
//     }
// }


// //随机时间 随机坐标滑动
// //@设备宽度  @设备像素高度  @方向  @最小随机时间  @最大随机时间 
// Tools.randomSwipe = function (w, h, dir, sleeptiemMin, sleeptiemMax) {

//     let _swipe = {
//         x1: random(w / 3, w / 2),
//         x2: random(w / 3, w / 2),
//         y1: random(h / 1.5, h / 1.2),
//         y2: random(h / 8, h / 9),
//         steps:50,
//         downTime: random(1, 5),
//         upTime: random(sleeptiemMin, sleeptiemMax)
//     }
//     console.log('${_swipe.sleep_time / 1000}秒后将向${dir}滑')
//     sleep(_swipe.upTime)
//     if (dir == "上") {
//         Tools.swipe(_swipe.x1, _swipe.y1, _swipe.x2, _swipe.y2,_swipe.steps, _swipe.downTime, _swipe.upTime)
//     } else if (dir == "下") {
//         Tools.swipe(_swipe.x1, _swipe.y2, _swipe.x2, _swipe.y1,_swipe.steps, _swipe.downTime, _swipe.upTime)
//     } else if (dir == "左") {
//         Tools.swipe(w / 8, _swipe.y2, w / 1.3, _swipe.y2,_swipe.steps, _swipe.downTime, _swipe.upTime)
//     } else {
//         Tools.swipe(w / 1.3, _swipe.y2, w / 8, _swipe.y2,_swipe.steps, _swipe.downTime, _swipe.upTime)
//     }



// }

/**
 * 滑动事件
 * x1: 整数值，表示滑动起始点的 x 坐标。
 * y1: 整数值，表示滑动起始点的 y 坐标。
 * x2: 整数值，表示滑动结束点的 x 坐标。
 * y2: 整数值，表示滑动结束点的 y 坐标。
 * lv: (可选)整数值，表示滑动弧度,0-300建议。
 * steps: (可选)整数值，表示滑动的控制点数,越大越慢越精准,建议(10-100)
 * downtime: (可选)整数值，按下时间（毫秒）。
 * uptime: (可选)整数值，抬起之前时间（毫秒）。
 * speed: (可选)整数值，表示滑动的速度。
 * upcount: (可选)抬起次数:少数设备起不来。可以多次
 */
Tools.swipex = function (x1, y1, x2, y2, steps, downTime, upTime) {
    var r1 = http.get("http://127.0.0.1:9123/swipex?x1=10&x2=1030&y1=1000&y2=1000");
    if (r1.statusCode == 200) {
        console.log("蓝牙滑动事件成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙滑动事件失败" + r1.body.string());
        return false;
    }
}



/**
 * 滑动事件
 * x1: 整数值，表示滑动起始点的 x 坐标。
 * y1: 整数值，表示滑动起始点的 y 坐标。
 * x2: 整数值，表示滑动结束点的 x 坐标。
 * y2: 整数值，表示滑动结束点的 y 坐标。
 * lv: (可选)整数值，表示滑动弧度,0-300建议。
 * steps: (可选)整数值，表示滑动的控制点数,越大越慢越精准,建议(10-100)
 * downtime: (可选)整数值，按下时间（毫秒）。
 * uptime: (可选)整数值，抬起之前时间（毫秒）。
 * speed: (可选)整数值，表示滑动的速度。
 * upcount: (可选)抬起次数:少数设备起不来。可以多次
 */
Tools.swipe = function (x1, y1, x2, y2, steps, downTime, upTime) {
    //var r1 = http.get("http://127.0.0.1:9123/swipe?x1=400&y1=600&x2=800&y2=1000&steps=10&downtime=5&uptime=5&speed=100");
    var r1 = http.get("http://127.0.0.1:9123/swipe?x1=" + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2 + "&steps=" + steps + "&downtime=" + downTime + "&speed=40&upTime=" + upTime);
    if (r1.statusCode == 200) {
        console.log("蓝牙滑动事件成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙滑动事件失败" + r1.body.string());
        return false;
    }
}

Tools.swipeSpeed = function (x1, y1, x2, y2, steps, downTime, upTime, speed) {
    //var r1 = http.get("http://127.0.0.1:9123/swipe?x1=400&y1=600&x2=800&y2=1000&steps=10&downtime=5&uptime=5&speed=100");
    var r1 = http.get("http://127.0.0.1:9123/swipe?x1=" + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2 + "&steps=" + steps + "&downtime=" + downTime + "&speed=" + speed + "&upTime=" + upTime);
    if (r1.statusCode == 200) {
        console.log("蓝牙滑动事件成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙滑动事件失败" + r1.body.string());
        return false;
    }
}

//随机时间 随机坐标滑动
//@设备宽度  @设备像素高度  @方向  @最小随机时间  @最大随机时间 
Tools.randomSwipe = function (w, h, dir, sleeptiemMin, sleeptiemMax) {
    let _swipe = {
        x1: random(w / 3, w / 2),
        x2: random(w / 3, w / 2),
        y1: random(h / 1.5, h / 1.2),
        y2: random(h / 8, h / 9),
        steps: 5,
        downTime: 100,
        upTime: 100
        //upTime: random(80, 100)
    }
    console.log(_swipe.upTime + "毫秒后将向" + dir + " 滑动");
    sleep(_swipe.upTime)
    if (dir == "上") {
        Tools.swipe(_swipe.x1, _swipe.y1, _swipe.x2, _swipe.y2, _swipe.steps, _swipe.downTime, _swipe.upTime)
    } else if (dir == "下") {
        Tools.swipe(_swipe.x1, _swipe.y2, _swipe.x2, _swipe.y1, _swipe.steps, _swipe.downTime, _swipe.upTime)
    } else if (dir == "左") {
        Tools.swipe(w / 8, _swipe.y2, w / 1.3, _swipe.y2, _swipe.steps, _swipe.downTime, _swipe.upTime)
    } else {
        Tools.swipe(w / 1.3, _swipe.y2, w / 8, _swipe.y2, _swipe.steps, _swipe.downTime, _swipe.upTime)
    }
}

/**
 * 模式移动
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} steps 
 * @param {*} downTime 
 * @param {*} upTime 
 */
Tools.touchMove = function (x1, y1, x2, y2, steps, downTime, upTime) {
    var r1 = http.get("http://127.0.0.1:9123/touchMove?id=3&x=200&y=500");
    if (r1.statusCode == 200) {
        console.log("蓝牙模式移动成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙模式移动失败" + r1.body.string());
        return false;
    }
}

/**
 * 抬起
 * x (可选): 整数值，表示抬起的 x 坐标。
 * y (可选): 整数值，表示抬起的 y 坐标。
 */
Tools.touchup = function (x, y) {
    var r1 = http.get("http://127.0.0.1:9123/touchup?x=200&y=500");
    if (r1.statusCode == 200) {
        console.log("蓝牙抬起成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙抬起失败" + r1.body.string());
        return false;
    }
}

//  坐标点击
Tools.setxy = function (x, y) {
    var r1 = http.get("http://127.0.0.1:9123/setxy?x=" + x + "&y=" + y);
    if (r1.statusCode == 200) {
        console.log("蓝牙坐标点击成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙坐标点击失败" + r1.body.string());
        return false;
    }
}
//  返回键
Tools.back = function () {
    var r1 = http.get("http://127.0.0.1:9123/back");
    if (r1.statusCode == 200) {
        console.log("蓝牙返回键成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙返回键失败" + r1.body.string());
        return false;
    }
}

//  返回首页
Tools.home = function () {
    var r1 = http.get("http://127.0.0.1:9123/home");
    if (r1.statusCode == 200) {
        console.log("蓝牙返回首页成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙返回首页失败" + r1.body.string());
        return false;
    }
}

//  电源开关熄屏
Tools.power = function () {

    var r1 = http.get("http://127.0.0.1:9123/power");
    if (r1.statusCode == 200) {
        console.log("蓝牙电源开关熄屏成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙电源开关熄屏失败" + r1.body.string());
        return false;
    }
}



//  后台键
Tools.recents = function () {
    var r1 = http.get("http://127.0.0.1:9123/recents");
    if (r1.statusCode == 200) {
        console.log("蓝牙后台键成功" + r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙后台键失败" + r1.body.string());
        return false;
    }
}
//结束app任务并恢复上一个app
Tools.closeApp = function (app) {
    let bounds = [];
    if (!Tools.recents()) {
        console.log("关闭APP失败：未打开后台页面");
        return false;
    }
    sleep(1000);
    let x1 = Math.floor((Math.random() * 1 + 8) * 100);
    let y1 = Math.floor((Math.random() * 1 + 9) * 100);
    let x2 = Math.floor((Math.random() * 1 + 3) * 100);
    let y2 = Math.floor((Math.random() * 1 + 10) * 100);
    console.log("开始向左滑动, start x:" + x1 + ", start y:" + y1 + ", end x:" + x2 + ", end y:" + y2);
    Tools.swipeSpeed(x1, y1, x2, y2, 80, 1000, 500, 10);
    // Tools.touchMove(x1, y1, x2, y2, 60, 1000, 500);
    sleep(1000);
    bounds = Tools.isFindOCRArray(app.appName);
    if (bounds.length == 0) {
        console.log("关闭APP失败, 未找到APP:" + app.appName);
        return false;
    }
    x1 = bounds[0];
    y1 = Math.floor((Math.random() * 1 + 17) * 100);
    x2 = bounds[0] + 10;
    y2 = Math.floor((Math.random() * 1 + 1) * 80);
    console.log("开始滑动关闭app, start x:" + x1 + ", start y:" + y1 + ", end x:" + x2 + ", end y:" + y2);
    Tools.swipeSpeed(x1, y1, x2, y2, 80, 1000, 500, 10);
    // Tools.touchMove(x1, y1, x2, y2, 10, 1000, 500);
    sleep(5000);
    x1 = Math.floor((Math.random() * 2 + 5) * 100);
    y1 = Math.floor((Math.random() * 3 + 8) * 100);
    Tools.click(x1, y1);
}

//结束app任务并恢复上一个app
Tools.closeApp2 = function (app) {
    let bounds = [];
    if (!Tools.recents()) {
        console.log("关闭APP失败：未打开后台页面");
        return false;
    }
    sleep(1000);
    let rs = false;
    for (let i = 0; i < 10; i++) {
        if (i > 0) {
            let x1 = Math.floor((Math.random() * 1 + 8) * 100);
            let y1 = Math.floor((Math.random() * 1 + 9) * 100);
            let x2 = Math.floor((Math.random() * 1 + 3) * 100);
            let y2 = Math.floor((Math.random() * 1 + 10) * 100);
            console.log("开始向左滑动, start x:" + x1 + ", start y:" + y1 + ", end x:" + x2 + ", end y:" + y2);
            Tools.swipeSpeed(x1, y1, x2, y2, 80, 1000, 500, 10);
            // Tools.touchMove(x1, y1, x2, y2, 60, 1000, 500);
            sleep(2000);
        }
        // 关闭
        bounds = Tools.findPerfectMatchOCRAndClick(app.appName, '，', '');
        if (bounds.length == 0) {
            console.log("关闭APP失败, 未找到APP:" + app.appName + ", 重新尝试");
            continue;
        }
        console.log("[" + app.appName + "]位于,x:" + bounds[0] + "  y:" + bounds[1])
        x1 = bounds[0];
        y1 = Math.floor((Math.random() * 1 + 17) * 100);
        x2 = bounds[0] + 10;
        y2 = Math.floor((Math.random() * 1 + 1) * 80);
        console.log("开始滑动关闭app, start x:" + x1 + ", start y:" + y1 + ", end x:" + x2 + ", end y:" + y2);
        Tools.swipeSpeed(x1, y1, x2, y2, 80, 1000, 500, 10);
        sleep(3000);
        rs = true;
        break;
    }

    if (!rs) {
        console.log("关闭APP失败, 未找到APP:" + app.appName);
    }

    for (let i = 0; i < 5; i++) {
        if (i > 0) {
            let x1 = Math.floor((Math.random() * 1 + 8) * 100);
            let y1 = Math.floor((Math.random() * 1 + 9) * 100);
            let x2 = Math.floor((Math.random() * 1 + 3) * 100);
            let y2 = Math.floor((Math.random() * 1 + 10) * 100);
            console.log("开始向左滑动, start x:" + x1 + ", start y:" + y1 + ", end x:" + x2 + ", end y:" + y2);
            Tools.swipeSpeed(x1, y1, x2, y2, 80, 1000, 500, 10);
            // Tools.touchMove(x1, y1, x2, y2, 60, 1000, 500);
            sleep(2000);
        }

        bounds = Tools.findPerfectMatchOCRAndClick("萤火");
        if (bounds.length == 0) {
            console.log("进入萤火失败, 未找到APP:萤火, 重新尝试");
            continue;
        }

        x1 = Math.floor((Math.random() * 2 + 5) * 100);
        y1 = Math.floor((Math.random() * 3 + 8) * 100);
        Tools.click(x1, y1);
        break;
    }
}


// //阿里云ocr识别
// Tools.ocrFindData = function (){
//     // 设置图片路径
//     var path = "/sdcard/tmp/default.jpg";
//     // 截图保存
//     var 截图保存 = images.captureScreen(path);
//     sleep(2000)
//     if (!截图保存) {
//         console.error("截图保存失败，请检查是否有权限");
//         exit();
//     }
//     // OCR 接口链接
//     var url = "https://tysbgpu.market.alicloudapi.com/api/predict/ocr_general";
//     // 获取图片的 Base64 编码
//     var b64 = images.toBase64(images.read(path));
//     var response = http.postJson(
//         url=url, 
//         data={
//         "image":b64,
//         "configure": 
//             {
//                 "output_prob" : true,              
//                 "output_keypoints": true,         
//                 "skip_detection": false,            
//                 "without_predicting_direction": false   
//             }
//         },
//         {"headers":{"Authorization":"APPCODE 86c05c20beca4e8ba63343d6650935fb"}
//     });
//     var res=JSON.parse(response.body.string());
//     if (res.success) {
//         console.log("成功识别到文字！");
//         return res;
//     }else{
//         console.log("识别失败，请检查res报错");
//     }
//     return null;
// }

//阿里云ocr识别坐标
// Tools.ocrClickWordBounds = function (res,word){
//     let Bounds = []; // 初始化一个空数组用于存储数字
//     for (var i = 0; i < res.ret.length; i++) {
//         console.log("文字：", res.ret[i].word, "，范围left:", res.ret[i].rect.left," top:",res.ret[i].rect.top," height:",res.ret[i].rect.height," width:",res.ret[i].rect.width,
//             " 四点坐标:",JSON.stringify(res.ret[i].keypoints)
//         );
//         console.log("--------------"+res.ret[i].word +"============="+word+"--------"+res.ret[i].word.indexOf(word)+"============"+res.ret[i].word.includes(word))
//         if(res.ret[i].word.indexOf(word)>=0){
//             var x=res.ret[i].keypoints[0].x+(res.ret[i].keypoints[1].x-res.ret[i].keypoints[0].x)/2;
//             var y=res.ret[i].keypoints[0].y+(res.ret[i].keypoints[1].y-res.ret[i].keypoints[0].y)/2;
//             Bounds.push(x);
//             Bounds.push(y);
//             console.log("命中坐标，x:",x,"y:",y)
//            // var r = http.get("http://127.0.0.1:9123/touch?x="+x+"&y="+y+"&t=1000");
//             return Bounds;
//         }
//     }

// }

//umig开源ocr识别
Tools.umiocrFindData = function () {
    // 设置图片路径
    var path_imag = "/sdcard/whb1.png";
    if (!requestScreenCapture()) {
        //如果请求失败则终止脚本
        exit();
    }
    //toastLog("ocr识别设置截屏");
    var 截图保存 = images.captureScreen(path_imag);
    // toastLog("ocr开始识别！");
    // sleep(3000)
    if (!截图保存) {
        toastLog("ocr识别截图保存失败，请检查是否有权限");
        exit();
    }
    for (var i = 1; i < 3; i++) {
        try {
            // OCR 接口链接
            var url = "http://39.106.64.84:1224/api/ocr";
            // 获取图片的 Base64 编码
            var b64 = images.toBase64(images.read(path_imag));
            // 发送 HTTP POST 请求
            var response = http.postJson(url, {
                "base64": b64
            });
            var res = response.body.json();
            // console.log(JSON.stringify(res));
            if (res.code == 100) {
                toastLog("ocr识别成功识别到文字！");
                // 删除图片
                files.remove(path_imag);
                return res;
            } else {
                toastLog("识别失败，请检查res报错");
                files.remove(path_imag);
                return null;
            }
        } catch (error) {
            toastLog("umiocrFindData方法出现错误：" + error)
        }
    }

    return null;
}

//umi开源ocr识别坐标
Tools.umiocrClickWordBounds = function (res, word) {
    let Bounds = []; // 初始化一个空数组用于存储数字
    if (!res || !res.data) {
        return Bounds;
    }
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        // toastLog(JSON.stringify(res.data[i].box));
        var 左上 = 坐标数组[0];
        var 右下 = 坐标数组[2];
        // toastLog("文字：", res.data[i].text, "，范围为：", JSON.stringify(res.data[i].box));
        // console.log("文字：", res.data[i].text, "，范围为：", 左上[0], 左上[1], 右下[0], 右下[1]);
        if (res.data[i].text.indexOf(word) >= 0) {
            var 右上 = 坐标数组[1];
            var 左下 = 坐标数组[3];
            var x = 左上[0] + (右上[0] - 左上[0]) / 2;
            var y = 左下[1] + (右上[1] - 左下[1]) / 2;
            toastLog("找到:" + word + "，坐标x:" + x + "，y:" + y);
            Bounds.push(x);
            Bounds.push(y);
            return Bounds;
        }
    }

    toastLog("没有定位到：" + word);
    return Bounds

}

//umi开源ocr精确识别坐标
Tools.umiocrPerfectMatchWord = function (res, word) {
    let bounds = []; // 初始化一个空数组用于存储数字
    if (!res || !res.data) {
        return bounds;
    }
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        // toastLog(JSON.stringify(res.data[i].box));
        var 左上 = 坐标数组[0];
        var 右下 = 坐标数组[2];
        // toastLog("文字：", res.data[i].text, "，范围为：", JSON.stringify(res.data[i].box));
        // console.log("文字：", res.data[i].text, "，范围为：", 左上[0], 左上[1], 右下[0], 右下[1]);
        if (res.data[i].text == word) {
            var 右上 = 坐标数组[1];
            var 左下 = 坐标数组[3];
            var x = 左上[0] + (右上[0] - 左上[0]) / 2;
            var y = 左下[1] + (右上[1] - 左下[1]) / 2;
            console.log("命中:" + word + "，坐标x:" + x + ", y:" + y)
            bounds.push(x);
            bounds.push(y);
            return bounds;
        }
    }

    toastLog("没有定位到：" + word);
    return bounds
}


//通过ocr查找是否存在
Tools.isFindOCRArray = function (words) {
    let bounds = [];
    // sleep(3000)
    let objData = Tools.umiocrFindData();
    // sleep(3000)
    bounds = Tools.umiocrClickWordBounds(objData, words);
    return bounds;
}

//通过ocr精确查找并点击
Tools.findPerfectMatchOCRAndClick = function (word, search, replace) {
    let bounds = [];
    let objData = Tools.umiocrFindData();
    // console.log("objData--->"+JSON.stringify(objData));
    bounds = Tools.umiocrPerfectMatch(objData, word, search, replace);
    return bounds;
}

Tools.umiocrPerfectMatch = function (res, word, search, replace) {
    let bounds = []; // 初始化一个空数组用于存储数字
    if (!res || !res.data) {
        return bounds;
    }
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        // toastLog(JSON.stringify(res.data[i].box));
        var 左上 = 坐标数组[0];
        var 右下 = 坐标数组[2];
        // toastLog("文字：", res.data[i].text, "，范围为：", JSON.stringify(res.data[i].box));
        // console.log("文字：", res.data[i].text, "，范围为：", 左上[0], 左上[1], 右下[0], 右下[1]);
        let text = res.data[i].text;
        if (search) {
            text = text.replace(search, replace);
        }
        if (text == word) {
            var 右上 = 坐标数组[1];
            var 左下 = 坐标数组[3];
            var x = 左上[0] + (右上[0] - 左上[0]) / 2;
            var y = 左下[1] + (右上[1] - 左下[1]) / 2;
            console.log("命中:" + word + "，坐标x:" + x + ", y:" + y)
            bounds.push(x);
            bounds.push(y);
            return bounds;
        }
    }

    toastLog("没有定位到：" + word);
    return bounds
}

//通过ocr点击是否成功
Tools.isOCRCZArray = function (words) {
    var isFlag = false;
    let bounds = [];
    let objData = Tools.umiocrFindData();
    sleep(1000)
    for (let i = 0; i < words.length; i++) {
        // bounds = Tools.umiocrClickWordBounds(objData,words[i]);
        bounds = Tools.umiocrPerfectMatchWord(objData, words[i]);
        console.log("通过ocr查找word：" + words[i] + ", 返回坐标：" + bounds);
        sleep(1000)
        if (bounds.length > 0) {
            Tools.click(bounds[0], bounds[1]);
            isFlag = true;
            break;
        }
    }
    return isFlag;
}

/**
 * 升级窗口
 */
Tools.closeUpgradetWindows = function () {
    var array = ["下次再说", "暂不加入", "坚持退出", "继续退出", "立即开始", "同意", "知道了", "以后再说", "我知道了", "直接无视", "直接无视", "点击重播", "我在想想", "稍候再说", "以后", "以后更新", "回头再说", "回头在说", "先去看看", "先去逛逛", "以后再说", "忽略该版本", "游客逛逛", "暂不更新", "好的", "不再提醒"];
    Tools.isOCRCZArray(array);
}

/**
 * 找图，找到并点击
 * @param {可以是数组也可以是字符串，传输数组可以多次找图知道找到为止} img_path_array 
 * @param {找图区域，默认是全屏找图，该参数可以不传输} area_region 
 * @param {相似度，默认是0.8，可以不传输} threshold 
 * @returns true表示执行成功Flase表示失败
 */
Tools.clickAreaForFindImage = function (img_path_array, area_region, threshold, is_continue) {
    try {
        area_region = area_region || [0, 0, device.width, device.height] //默认的找图区域 全屏找图 前2位是坐标 后面是长度和宽度   千万别理解成是坐标
        threshold = threshold || 0.8 // 默认的相识度0.8
        is_continue = is_continue || false
        if (img_path_array instanceof Array) {
            let arrayLength = img_path_array.length
            for (let i = 0; i < arrayLength; i++) {
                //toastLog("正在进行第" + (i + 1) + "次找图...")
                img_path = img_path_array[i] //小图地址可判断是否存在
                if (!files.exists(img_path)) {
                    toastLog(img_path + "文件不存在因此跳过")
                    continue
                }
                var little_image = images.read(img_path) //小图
                var find_result_bounds = images.findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                if (find_result_bounds) {
                    toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                    Tools.click(find_result_bounds.x, find_result_bounds.y)
                    return true
                } else {
                    //toastLog(img_path+"小图存在但是在大图中未找到图片进入下一次循环...")
                }
            }
            return false
        }
        if (typeof (img_path_array) == "string") {
            img_path = img_path_array//小图地址可判断是否存在
            if (!files.exists(img_path)) {
                toastLog(img_path + "文件不存在因此跳过")
                return false
            }
            var little_image = images.read(img_path) //小图
            var find_result_bounds = images.findImage(
                captureScreen(), little_image, {
                region: area_region,
                threshold: threshold
            });
            if (find_result_bounds) {
                toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                Tools.click(find_result_bounds.x, find_result_bounds.y)
                return true
            } else {
                //toastLog(img_path + "小图存在但是在大图中未找到图片")
                return false
            }
        }
    } catch (error) {
        toastLog("clickAreaForFindImage方法出现错误：" + error)
        return false;
    }
}


module.exports = Tools;