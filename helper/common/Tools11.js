var Tools = {}
var adenBase = require('./BaseConfig.js');
var softName = "亚丁号"
rootPath = "/sdcard/亚丁号/"
//日志输出等级
inputLevel = "info"
//是否显示Toast
isshowToast = false
let softVersion = adenBase.soft_Version()
/**
 * js文件的版本
 */
Tools.version = function () {
    return "0.0.1";
}
/**
 * 获取当前 分钟数
 * @param {} str 
 * @returns 
 */
Tools.getCurrentTime = function () {
    const now = new Date();
    const minutes = now.getMinutes();
    return minutes
}
/**
 * 判断字符串是否为空
 */
Tools.isNullOrEmpty = function (str) {
    if (str == "" || str == undefined || str == NaN || str == "undefined")
        return false
    else
        return true
}
Tools.screenShot = function () {
    "auto";

    /**
     * 同时模拟三个手势：
     * 从(300, 400)到(300, 1400)
     * 从(600, 400)到(600, 1400)
     * 从(900, 400)到(900, 1400)
     * 每一个的时长都为350毫秒
     */

    gestures([350, [300, 400], [300, 1400]],
        [350, [600, 400], [600, 1400]],
        [350, [900, 400], [900, 1400]]
    );
}
/**
 * 清理登录信息
 */
Tools.clearLoginInfo = function () {
    isLogin = false
    adenStorage.remove("AdenDeanLoginInfoSign");
    adenStorage.remove("AdenDeanDeviceToken");
    adenStorage.remove("AdenDeanUserName");
    adenStorage.remove("AccountType");

}

/**
 * 判断UI上的控件是否存在
 * @param {UI上的元素} element 
 */
Tools.controlExists = function (element) {
    if (element == null) {
        return false;
    }
    try {
        if (element.exists()) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}
/**
 * 获取IP地址和IP所在地
 */
Tools.getIpAdressAndIpGps = function () {
    try {
        let ip = ""
        let address = ""
        let ip_gps = false
        let ip_regx = /本机IP:&nbsp;\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}<\/span>([\s\S]*?)<\/td/
        let ipUrl = "http://www.baidu.com/s?ie=UTF-8&wd=ip%E5%BD%92%E5%B1%9E%E5%9C%B0%E6%9F%A5%E8%AF%A2" //百度的
        let response = http.get(ipUrl);
        if (response.statusCode == 200) {
            let htmlResult = response.body.string()
            ip_gps = ip_regx.exec(htmlResult)
            let responseRex = ip_regx.exec(ip_gps)
            ip = responseRex[0].split(";")[1].split("</span>")[0]
            address = responseRex[1]
        } else {
            let response = http.get('http://pv.sohu.com/cityjson?ie=utf-8');
            if (response.statusCode == 200) {
                let InetIP = response.body.string()
                eval(InetIP)
                ip = (returnCitySN.cip)
                address = (returnCitySN.cname)
            } else {
                let ip_gps = false
                let ip_regx = /本机IP:&nbsp;\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}<\/span>([\s\S]*?)<\/td/
                let ipUrl = "http://www.baidu.com/s?ie=UTF-8&wd=ip%E5%BD%92%E5%B1%9E%E5%9C%B0%E6%9F%A5%E8%AF%A2" //百度的
                let response = http.get(ipUrl);
                if (response.statusCode == 200) {
                    let htmlResult = response.body.string()
                    ip_gps = ip_regx.exec(htmlResult)
                    let responseRex = ip_regx.exec(ip_gps)
                    ip = responseRex[0].split(";")[1].split("</span>")[0]
                    address = responseRex[1]
                }
            }
        }




        return ip + "@" + address
    } catch (error) {
        return "获取IP和所在地失败" + "@" + error
    }
}
/**
 * 获取手机安装app的集合 
 */
Tools.getAppList = function () {
    var pm = context.getPackageManager()
    var appList = pm.getInstalledApplications(0)
    var appInfoList = []
    for (let i = 0; i < appList.size(); i++) {
        var app = appList.get(i)
        var appInfo = {
            appName: app.loadLabel(pm),
            packageName: app.packageName,
            isSystemApp: false
        }
        let android_version = device.release
        if (android_version == 11) {

        } else {
            if (!app.isSystemApp()) {
                appInfoList.push(appInfo)
            }
        }
    }
    //追加app 微信阅读
    var appInfo = {
        appName: "微信阅读",
        packageName: "com.yadinghao.wx.read",
        isSystemApp: false
    }
    appInfoList.push(appInfo)
    return appInfoList
}
/**
 * 显示控件的坐标
 * @param {要查找的元素} element 
 * @index {点击的顺序} index 
 */
Tools.clickControlList = function (element, index) {
    try {
        let controlArray = element.find();
        if (controlArray != null) {
            let controlLength = controlArray.length;
            for (let i = 0; i < controlLength; i++) {
                toastLog(controlArray[i].bounds())
            }
            let b = controlArray[index].bounds()
            return clickBounds(b)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
/**
 * 显示控件的坐标
 * @param {要查找的元素} element 
 */
Tools.getControlList = function (element) {
    try {
        let controlArray = element.find();
        Tools.toastInfo(controlArray.length);
        if (controlArray != null) {
            let controlLength = controlArray.length;
            for (let i = 0; i < controlLength; i++) {
                toastLog(controlArray[i].bounds())
            }
            return controlLength
        } else {
            return 0
        }
    } catch (error) {
        Tools.toastError("getControlList()" + error)
        return 0
    }
}
/**
 * 休眠随机0.1秒至0.5秒
 */
Tools.sleepRandom0 = function () {
    sleep(random(100, 500));
}
/**
 * 休眠随机1秒至3秒
 */
Tools.sleepRandom1 = function () {
    sleep(random(1000, 3000));
}
/**
 * 休眠随机3秒至5秒
 */
Tools.sleepRandom3 = function () {
    sleep(random(3000, 5000));
}
/**
 * 休眠随机5秒至7秒
 */
Tools.sleepRandom5 = function () {
    sleep(random(5000, 7000));
}
/**
 * 休眠随机7秒至9秒
 */
Tools.sleepRandom7 = function () {
    sleep(random(7000, 9000));
}
/**
 * 休眠随机11秒至9秒
 */
Tools.sleepRandom9 = function () {
    sleep(random(9000, 11000));
}

/**
 * 休眠随机30秒至35秒
 */
Tools.sleepRandom30 = function () {
    sleep(random(30000, 35000));
}

Tools.sleepRandom60 = function () {
    sleep(random(58000, 60000));
}

Tools.sleepRandom100 = function () {
    sleep(random(90000, 100000));
}
/**
 * 点击屏幕上的坐标
 * @param {坐标} b 
 */
Tools.clickBounds = function (b) {
    return clickResult = click(b.centerX(), b.centerY());
}
/**
 * 点击屏幕上的坐标
 * @param {坐标} b 
 */
Tools.clickControlBounds = function (element) {
    let clickResult = false;
    if (element == null) {
        toastLog("控件不存在")
        return false;
    }
    try {
        if (element.exists()) {
            toastLog("准备click：" + element);
            let b = element.findOnce().bounds();
            // toastLog("点击控件坐标( left = " + b.left + ",right = " + b.right + ",top = " + b.top + ",bottom = "+ b.bottom + ")")
            // var x2 = random(b.left, b.right)
            // var y2 = random(b.top, b.bottom)
            // let bx = 0 ;
            // if(b.centerX()<=0){
            //     bx = 0.1
            // }else{
            //     bx = b.centerX();
            // }
            // let by = 0;
            // if(b.centerY()<=0){
            //     by = 0.1
            // }else{
            //     by = b.centerY()
            // }
            toastLog("准备点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
            clickResult = click(b.centerX(), b.centerY());
            toastLog("点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
            sleep(random(2000, 3200));
        } else {

        }
        return clickResult;
    } catch (error) {
        Tools.toastError("clickControlBounds方法出现错误：" + error)
        return false;
    }
}
/**
 * 点击UI上的控件
 * @param {UI上的元素} element 
 */
Tools.clickControl = function (element) {
    var obsTest = ""
    let clickResult = false;
    if (element == null) {
        return false;
    }
    try {
        if (element.exists()) {
            let text = element.findOnce().getText()
            if (text == null || text == "") {
                text = element.findOnce().getId()
            }
            toastLog("准备click：" + text);
            obsTest = text

            let clickable = element.findOnce().clickable();//是否可以点击
            if (clickable) {
                clickResult = element.findOnce().click();
                sleep(random(2000, 3200));
            } else {
                let b = element.findOnce().bounds();
                clickResult = click(b.centerX(), b.centerY());
                sleep(random(2000, 3200));
            }
        }
        return clickResult;
    } catch (error) {
        Tools.toastError(obsTest + "clickControl方法出现错误：" + error)
        return false;
    }

}

//超级点击  
//@要点击的控件  return{bool}
Tools.superClick = function (node) {
    try {
        if (node) {
            if (node.click()) {
                return true
            } else if (node.parent().click()) {
                return true
            } else if (node.parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().parent().parent().parent().click()) {
                return true
            }
        }
    } catch (e) { }
    return false
}
/**
 * 元素对象
 * @param {ID或name} obj 
 */
Tools.uiSelector = function (obj) {
    let element = null;
    try {
        if (text("" + obj + "").exists()) {
            toastLog(text("" + obj + ""))
            element = text("" + obj + "");
            return element;
        }
        if (desc("" + obj + "").exists()) {
            toastLog(desc("" + obj + ""))

            element = desc("" + obj + "");
            return element;
        }
        if (id("" + obj + "").exists()) {
            toastLog(id("" + obj + ""))
            element = id("" + obj + "");
            return element;
        }
        return element
    } catch (error) {
        Tools.toastError(error);
        return null;
    }
}
Tools.getAppHavedRunRecord = function (appName) {
    let key = appName + adenBase.storageSign() + Tools.getDate();
    var havedRunTimes = adenStorage.get("" + key + "");
    let havedMinute = (havedRunTimes / 1000) / 60;//读取到的时间是毫秒需要转换成秒，转换成秒后在转换成分钟
    if (havedMinute == undefined || havedMinute == "" || havedMinute == "undefined") {
        havedMinute = 0
    }
    //toastLog(appName + "已经执行" + havedMinute.toFixed(2) + '分' + "总计:" + execTimes + "分");
    return havedMinute.toFixed(2)
}
/**
 * 保持屏幕常亮并且延迟一分钟左右
 */
Tools.keepOnline = function () {
    Tools.sleepRandom9()
    Tools.sleepRandom9()
    Tools.sleepRandom9()
    Tools.sleepRandom9()
    Tools.sleepRandom9()
    Tools.sleepRandom9()
    

    device.keepScreenOn(3600 * 10)
    toastInfo("今日任务完成进入保活无障碍服务...");
    if (!device.isScreenOn()) {
        device.wakeUp();
    }
}
/**
 * 强制停止app
 * @param {应用名称} appName 
 */
Tools.stopApp = function (appName) {
    //try {
        openAppSetting(getPackageName(appName));
        sleep(3000);
    //     if (className("android.widget.Button").text("强行停止").exists()) {
    //         className("android.widget.Button").text("强行停止").findOnce().click();
    //     } else {
    //         if (text("强行停止").exists()) {
    //             text("强行停止").findOnce().click();
    //             back();
    //             back();
    //         }
    //     }
    //     sleep(3000);
    //     if (className("android.widget.Button").text("确定").exists()) {
    //         className("android.widget.Button").text("确定").findOnce().click();
    //         toastLog(appName + "已经停止！");
    //     }
    //     else {
    //         if (text("强行停止").exists()) {
    //             text("强行停止").findOnce().click();
    //             toastLog(appName + "已经停止！");
    //             back();
    //             back();
    //         } else {
    //             if (text("结束运行").exists()) {
    //                 text("结束运行").findOnce().click();
    //                 sleep(500);
    //                 if (text("确定").exists()) {
    //                     text("确定").findOnce().click();
    //                     toastLog("MIUI9 Android7" + appName + "已经停止！");
    //                 }
    //             }
    //         }

    //     }
    //     back();
    //     back();
    //     this.goHome();
    // } catch (e) {
    //     toastLog(e);
    //     this.goHome();
    // }
}

// 返回手机的首页
 Tools.goHome = function (){
    home(); // 这是Auto.js提供的API，用于模拟Home键的功能
}

Tools.clearCach = function (appName) {
    // let deviceModel=device.model
    // if (deviceModel == "OPPO R9sk") {
    //     recents()
    //     sleep(2000);
    //     click(device.width / 2, device.height / 1.19)
    // } else{
    //     Tools.stopApp(appName)
    // }
    Tools.stopApp(appName)
}

/**
 * 贝塞尔曲线
 * @param {坐标点} ScreenPoint 
 * @param {偏移量} Offset 
 */
Tools.bezier_curves = function (ScreenPoint, Offset) {
    cx = 3.0 * (ScreenPoint[1].x - ScreenPoint[0].x);
    bx = 3.0 * (ScreenPoint[2].x - ScreenPoint[1].x) - cx;
    ax = ScreenPoint[3].x - ScreenPoint[0].x - cx - bx;
    cy = 3.0 * (ScreenPoint[1].y - ScreenPoint[0].y);
    by = 3.0 * (ScreenPoint[2].y - ScreenPoint[1].y) - cy;
    ay = ScreenPoint[3].y - ScreenPoint[0].y - cy - by;
    tSquared = Offset * Offset;
    tCubed = tSquared * Offset;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * Offset) + ScreenPoint[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * Offset) + ScreenPoint[0].y;
    return result;
}
/**
 * 滑动(默认概率是百分之三十)
 * @param {*} qx 
 * @param {*} qy 
 * @param {*} zx 
 * @param {*} zy 
 * @param {*} time 
 * @param {*} timesInterval 
 */
Tools.slideScreenDown = function (qx, qy, zx, zy, time, timesInterval, CurveBrushScreen, IsCloseApp, isFragmentation, fragmentationTime) {
    if (CurveBrushScreen, IsCloseApp, isFragmentation, fragmentationTime) {
        Tools.curveDown(qx, qy, zx, zy, time, timesInterval); //曲线概率
    } else {
        Tools.lineDown(qx, qy, zx, zy, time, timesInterval); //直线概率
    }
}
/**
 * 概率0-9 大于3的时候采用曲线概率 小于3的时候直线概率
 */
Tools.randomFunction = function () {
    return Math.floor(Math.random() * 10);
}
/**
 * 
 * @param {*} qx 
 * @param {*} qy 
 * @param {*} zx 
 * @param {*} zy 
 * @param {*} time 
 * @param {*} timesInterval 
 */
Tools.curveDown = function (qx, qy, zx, zy, time, timesInterval) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };
    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");
    };
    for (let i = 0; i < 1; i += 0.08) {
        let newPoint = Tools.bezier_curves(point, i);
        xxyy = [parseInt(newPoint.x), parseInt(newPoint.y)]
        xxy.push(xxyy);
    }
    gesture.apply(null, xxy);

    let randomMin = timesInterval * 1000;
    let randomMax = (parseInt(timesInterval) + 2) * 1000;
    let delayTime = random(randomMin, randomMax);
    sleep(delayTime);
}
Tools.swipeUp = function () {
    let x1 = device.width * 0.5
    let y1 = device.height * 0.75
    let x2 = device.width * 0.5
    let y2 = device.height * 0.1
    swipe(x1, y2, x2, y1, 600);

    sleep(1000)

}
Tools.swipeDown = function () {
    let x1 = random(device.width * 0.8, device.width * 0.9);
    let y1 = device.height - (device.height * 0.2)
    let x2 = random(device.width * 0.8, device.width * 0.9);
    let y2 = device.height * 0.1
    swipe(x1, y1, x2, y2, 600);
    sleep(3000);

}
/**
 * 屏幕向下滑动并延迟8至12秒
 */
Tools.lineDown = function (startX, startY, endX, endY, pressTime, timesInterval) {
    swipe(startX, startY, endX, endY, pressTime);
    let randomMin = timesInterval * 1000;
    let randomMax = (parseInt(timesInterval) + 2) * 1000;
    let delayTime = random(randomMin, randomMax);
    sleep(delayTime);
}
/**
 * 按照指定概率随机上滑
 * @param {*} startX 
 * @param {*} startY 
 * @param {*} endX 
 * @param {*} endY 
 * @param {*} pressTime 
 * @param {*} probability 
 */
Tools.randomUpSildeScreen = function (startX, startY, endX, endY, pressTime, probability) {
    let randomIndex = random(1, parseInt(probability));
    if (randomIndex == 1) {
        swipe(startX, startY, endX, endY, pressTime);
        delayTime = random(12000, 15000);
        sleep(delayTime);
    }
}
/**
 * 连续下滑对上一个无兴趣
 * 其实得和上滑做个排他，既然无兴趣不要在上滑
 */
Tools.randomDownSildeScreen = function (startX, startY, endX, endY, pressTime, timesInterval, probability) {
    let randomIndex = random(1, parseInt(probability));
    if (randomIndex == 1) {
        swipe(startX, startY, endX, endY, pressTime);
        sleep(3500);
        swipe(startX, startY, endX, endY, pressTime);
        sleep(timesInterval);
    }
}
/**
 * 随机点赞
 * @param {点赞ID}} view_id 
 * @param {随机概率}} probability 
 */
Tools.randomHeart = function (view_id, probability) {
    index = random(1, parseInt(probability));
    if (index == 1) {
        let target_element = id(view_id)
        if (target_element.exists()) {
            toastLog("存在" + view_id)
            Tools.clickControlBounds(id("" + view_id + ""))
        } else {
            Tools.doubleClick()
        }

    }
}
/**
 * 随机点赞
 * @param {随机概率}} probability 
 */
Tools.randomDoubleClickHeart = function (probability) {
    index = random(1, parseInt(probability));
    if (index == 1) {

        Tools.doubleClick()
    }
}
/**
 * 双击屏幕(很多视频其实就是点赞)
 */
Tools.doubleClick = function () {
    //增加个随机概念 最多敲击三次
    click(200, 200)
    sleep(100)
    click(202, 210)
}
/**
 * 随机关注
 * @param {控件ID} follow_view_id 
 * @param {概率} probability 
 */
Tools.randomFollow = function (follow_element, probability) {
    index = random(1, parseInt(probability));
    if (index == 1) {
        if (Tools.controlExists(follow_element)) {
            Tools.clickControlBounds(follow_element)
        }
    }
}
/**
 * 判断UI上的控件是否存在
 * @param {UI上的元素} element 
 */
Tools.controlExists = function (element) {
    if (element == null) {
        return false;
    }
    try {
        if (element.exists()) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}
/**
 * 输出Tosat和Info日志
 * @param {日志消息} messagge 
 */
Tools.toastInfo = function (message) {
    writeLog(message, "info");
}
/**
 * 输出Tosat和Error日志
 * @param {日志消息} messagge 
 */
Tools.toastError = function (message) {
    writeLog(message, "error");
}
/**
 * 
 * @param {*} message 
 */
Tools.toastLog = function (message) {
    writeLog(message, "log");
}
Tools.toastWarn = function (message) {
    writeLog(message, "warn");
}
/**
 * 设置界面颜色
 * @param {*} orientation 
 * @param {*} color 
 */
Tools.GradientDrawable = function (orientation, color) {
    var colors = [];
    color.forEach(color => colors.push(Tools.Color(color)));
    return new android.graphics.drawable.GradientDrawable(android.graphics.drawable.GradientDrawable.Orientation[orientation], colors);
}

Tools.Color = function (color) {
    return android.graphics.Color.parseColor(color);
}
/**
 * 写日志，toast、consle和文件日志
 * @param {日志内容} loginfo 
 * @param {日志等级} level 
 */
writeLog = function (loginfo, level) {
    try {
        var logName = ""
        if (level == "error") {
            logName = softName + "" + Tools.getDate() + "_" + "Log.txt";
        } else {
            logName = softName + "" + Tools.getDate() + "_" + "ErrorLog.txt";
        }
        var logPath = rootPath + "/日志/";
        let message = Tools.getTime() + "(" + softVersion + "):" + loginfo;
        if (!files.isDir(rootPath)) {
            if (files.create(rootPath)) {
                files.create(logPath)
            }
        } else {
            files.create(logPath)
        }
        let logFilePath = logPath + "/" + logName;
        if (!files.exists(logFilePath)) {
            files.create(logFilePath);
            files.write(logFilePath, message + "\r");//写日志
        }
        else {
            files.append(logFilePath, message + "\r");//追加日志
        }

        toast(message);
        if (level == "log") {
            console.log(message);
        } else if (level == "info") {
            console.info(message);
        } else if (level == "warn") {
            console.warn(message);
        } else if (level == "error") {
            console.error(message);
        }
    } catch (error) {
        console.error("系统再写日志的时候出现错误若不影响使用请略过" + error);
    }
}
/**
 * 获取当前时间格式yyyyMMdd
 */
Tools.getDate = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    };
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    };
    return year + "-" + month + "-" + day;
}
/**
 * 
 */
Tools.getTime = function (dateTime) {


    dateTime = dateTime || new Date() // 默认的相识度0.8
    var date = dateTime
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    };
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    };
    var hour = date.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    };
    var minute = date.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    };
    var seconds = date.getSeconds();     //获取当前秒数(0-59)
    var millisecond = date.getMilliseconds();    //获取当前毫秒数(0-999)
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + ":" + millisecond;
}
/**
 * JS构建Map
 */
Tools.Map = function () {
    var obj = {};
    this.put = function (key, value) {
        obj[key] = value;//把键值绑定到obj对象上
    }
    //size方法，获取Map容器的个数
    this.size = function () {
        var count = 0;
        for (var attr in obj) {
            count++;
        }
        return count;
    }
    //get方法，根据key获取value的值
    this.get = function (key) {
        if (obj[key] || obj[key] === 0 || obj[key] === false) {
            return obj[key]
        } else {
            return null;
        }
    }
    //remove方法,删除方法
    this.remove = function (key) {
        if (obj[key] || obj[key] === 0 || obj[key] === false) {
            delete obj[key]
        }
    }
    //each方法,遍历方法
    this.eachMap = function (callBack) {
        for (var attr in obj) {
            callBack(attr, obj[attr])
        }
    }

}
/**
 * map排序（核心是冒泡有点笨）
 */
Tools.mapSort = function (mapTask) {
    var arr = [];
    var result = [];
    mapTask.eachMap(function (key, value) {
        arr.push(parseInt(value));
        result.push(key);
    });
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            // 相邻元素两两对比，元素交换，大的元素交换到后面
            if (arr[j] > arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                //value交换key也得换
                var keyTemp = result[j + 1];
                result[j + 1] = result[j];
                result[j] = keyTemp;
            }
        }
    }
    return result;//返回数组  
}
/**
 *点击一下屏幕
 */
Tools.clickScreen = function () {
    var x = device.width - device.width * 0.2;
    var y = device.height - device.height * 0.2;
    toastLog("点击屏幕" + x + ":" + y);
    let clickResult = click(x, y);
    toastLog(clickResult);
}
/**
 * 生成随机数
 * @param {最大随机数} num 
 * @param {随机数得数量} n 
 */
Tools.randomNum = function (num, n) {
    if (typeof num !== "number" || typeof n !== "number") return false;  //对象检测
    var aNum = [];
    if (num <= n) {
        for (var j = 0; j < num; j++) {
            if (random != 0) {
                aNum.push(j);
            }
        };
        return aNum;
    }         //如果n大于num就生成0到num-1的每一个数
    else {
        while (aNum.length < n) {
            var random = Math.round(Math.random() * num);
            if (aNum.indexOf(random) == -1) {
                if (random != 0) {
                    aNum.push(random);
                }
            }
        }
        return aNum;
    }
}
/**
 * 倒计时方法适用于脚本
 * @param {倒计时时间} lasterTime 
 */
Tools.cutDownBySleep = function (lasterTime, message) {
    message = message || ""

    for (let i = lasterTime; i => 0; i--) {
        console.info(message + "剩余" + i + "秒...")
        sleep(1000)
        if (i == 1) {
            return
        }
    }
}
/**
 * 支付宝付款转成链接
 * @param {付款码} code 
 */
Tools.alipay = function (code) {
    try {
        app.startActivity({
            action: "android.intent.action.VIEW",
            data: "alipayqr://platformapi/startapp?saId=10000007&qrcode=" +
                "HTTPS://QR.ALIPAY.COM/" + code
        });
    } catch (error) {
        alert("没有安装支付宝请安装后再试")
    }
}
Tools.downJsFile = function (rootPath, fileName) {
    var url = "http://www.autojs.org/assets/uploads/profile/3-profileavatar.png";
    var res = http.get(url);
    if (res.statusCode != 200) {
        toast("请求失败");
    }
    files.writeBytes("/sdcard/1.png", res.body.bytes());
    toast("下载成功");
    app.viewFile("/sdcard/1.png");
}

Tools.md532Bit = function (string) {

    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function md5_AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function md5_G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function md5_H(x, y, z) {
        return (x ^ y ^ z);
    }
    function md5_I(x, y, z) {
        return (y ^ (x | (~z)));
    }
    function md5_FF(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    function md5_WordToHex(lValue) {
        var WordToHexValue = "",
            WordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = md5_AddUnsigned(a, AA);
        b = md5_AddUnsigned(b, BB);
        c = md5_AddUnsigned(c, CC);
        d = md5_AddUnsigned(d, DD);
    }
    return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
}
/**
 * 设备唯一token 主要目的还是公共
 * @returns base64编码字符
 */
Tools.getDeviceToken = function () {
    //设备名称 设备品牌 设备型号 AndroidID device.width + "X" + device.height;
    let token_string = device.device + device.model + device.brand + device.getAndroidId() + device.width + device.height
    token_string = $base64.encode(token_string)
    return token_string
}
Tools.downLoadScript = function (url, folder, fileName) {
    try {
        var res = http.get(url);
        if (res.statusCode != 200) {
            toastLog("downLoadScript请求失败...");
        }
        let fileFullPath = folder
        files.create(fileFullPath)

        files.writeBytes(fileFullPath + fileName, res.body.bytes());
        return true
    } catch (error) {
        toastLog("downLoadScript下载文件失败" + error);
        return false
    }
}
Tools.removeFile = function (fileFullName, targetFileFullName) {
    try {
        files.copy(fileFullName, targetFileFullName)
        files.remove(fileFullName)
        return true
    } catch (error) {
        toastLog("removeFile移动文件失败" + error);
        return false
    }
}
Tools.findScriptObject = function (script_app_name, configPath) {
    let fileName = Tools.getConfigFileName(adenBase.root_Url())
    let fullFileName = configPath + fileName //文件全路径
    let isExists = files.exists(fullFileName)
    if (isExists || isExists == "true") {
        //文件存在读取文件
        let adenJson = JSON.parse(files.read(fullFileName))
        var adenArray = eval(adenJson);
        for (let i = 0; i < adenArray.length; i++) {
            if (adenArray[i].name == script_app_name) {
                return adenArray[i]
            }
        }
    }
    return ""
}
Tools.buildScriptConfig = function (scriptJson, action, configPath) {
    try {
        let fileName = Tools.getConfigFileName(adenBase.root_Url())
        let fullFileName = configPath + fileName //文件全路径
        if (action == "add") {
            if (files.exists(fullFileName)) {
                let adenJson = JSON.parse(files.read(fullFileName))
                var adenArray = eval(adenJson);
                adenArray.push(scriptJson)
                files.write(fullFileName, JSON.stringify(adenArray));
            } else {
                files.create(fullFileName)
                //文件不存在直接写就行了
                var scriptJson = [scriptJson]; //变成数组
                files.write(fullFileName, JSON.stringify(scriptJson));
            }
        }
        if (action == "update") {
            //文件存在读取文件
            let adenJson = JSON.parse(files.read(fullFileName))
            var adenArray = eval(adenJson);
            for (let i = 0; i < adenArray.length; i++) {
                if (adenArray[i].file == scriptJson.file) {
                    adenArray.splice(i, 1, scriptJson)
                }
            }
            files.write(fullFileName, JSON.stringify(adenArray));
            return
        }
        if (action == "delete") {
            //文件存在读取文件
            let adenJson = JSON.parse(files.read(fullFileName))
            var adenArray = eval(adenJson);
            for (let i = 0; i < adenArray.length; i++) {
                if (adenArray[i].file == scriptJson.file) {
                    adenArray.splice(i, 1)
                }
            }
            files.write(fullFileName, JSON.stringify(adenArray));
            return
        }

        // if (!files.isDir(configPath)) {
        //     if (files.create(configPath)) {
        //         files.create(fullFileName)
        //     }
        // } else {
        //     if (!files.exists(fullFileName)) {
        //         files.create(fullFileName);
        //         toastLog("Create file")

        //         var scriptJson = [scriptJson]; //变成数组
        //         files.write(fullFileName, JSON.stringify(scriptJson));
        //     } else {
        //         toastLog("文件存在")
        //         //文件存在读取文件
        //         let adenJson = JSON.parse(files.read(fullFileName))
        //         let isExists = false
        //         adenJson.forEach(element => {
        //             if (element.name == scriptJson.name && element.file == scriptJson.file) {
        //                 isExists = true
        //                 //更新版本
        //                 element.version = scriptJson.version
        //             }
        //         });

        //         //追加元素
        //         if (!isExists) {
        //             var adenArray = eval(adenJson);
        //             adenArray.push(scriptJson)

        //             files.write(fullFileName, JSON.stringify(adenArray));
        //         }

        //     }
        // }
    } catch (e) {
        toastLog("构建Json方法出现错误...程序将无法运行请联系攻城狮" + e)
    }
}
Tools.getConfigFileName = function (root_url) {
    if (root_url == "") {
        return "aden.json"
    }
    let reg1 = new RegExp(":", "g");//g,表示全部替换。
    let new_url = root_url.replace(reg1, "")
    let file_name = new_url.replace("//", "").replace(".", "").replace(".", "").replace(".", "").replace("/", "") + "aden.json"
    return file_name
}
Tools.compareVersion = function (curV, reqV) {
    if (curV && reqV) {
        //将两个版本号拆成数字
        var arr1 = curV.split('.'),
            arr2 = reqV.split('.');
        var minLength = Math.min(arr1.length, arr2.length),
            position = 0,
            diff = 0;
        //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
        while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {
            position++;
        }
        diff = (diff != 0) ? diff : (arr1.length - arr2.length);
        //若curV大于reqV，则返回true
        return diff > 0;
    } else {
        //输入为空
        console.log("版本号不能为空");
        return false;
    }
}
/**
 * 记录App一次运行的时间
 * @param {appName} appName 
 * @param {本次运行时间} recordTimes 
 */
Tools.appRunTimeRecord = function (appName, recordTimes) {
    let key = appName + adenBase.storageSign() + adenTools.getDate();
    let havedRunTimes = adenStorage.get("" + key + "");
    let value = "";
    if (havedRunTimes == null) {
        adenStorage.put(key, parseInt(recordTimes));
    } else {
        value = parseInt(havedRunTimes) + parseInt(recordTimes);
        adenStorage.put(key, value);
    }
}
/**
 * 倒计时方法适用于UI
 * @param {倒计时时间} lasterTime 
 * @param {倒计时时间} message 
 * 
 */
Tools.countDown = function (seconds, message) {
    message = message || ""
    if (seconds == 0) {
        console.info(message + "剩余" + seconds + "秒...")
        return;
    }
    console.info(message + "剩余" + seconds + "秒...")
    setTimeout(function () {
        seconds--;
        Tools.countDown(seconds, message);
    }, 1000);
}
Tools.buildADArray = function (ad_path, ad_number) {
    let ad_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = ad_path + "/ad" + (i) + ".png"
        ad_array.push(ad_full_path)
    }
    return ad_array;
}
Tools.buildImageArray = function (image_name, image_path, ad_number) {
    let image_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = image_path + "/" + image_name + "" + (i) + ".png"
        image_array.push(ad_full_path)
    }
    return image_array;
}
/**
 * 启动app
 * @param {*} appName 
 */
Tools.startApp = function (appName) {
    try {
        app.launchApp(appName);//启动App
        sleep(3000);//启动App时候等待时间
        toastLog("启动App：" + appName)
        // Tools.adolescentWindows();//关闭青少年窗口
        // Tools.closeUpgradetWindows();//关闭升级提示框
    } catch (error) {
        toastLog("启动App方法出现失败：" + error)
        return false;
    }
}
/**
 * 青少年窗口
 */
Tools.adolescentWindows = function () {
    if (text("我知道了").exists()) {
        text("我知道了").findOnce().click();
    }
    if (text("以后再说").exists()) {
        text("以后再说").findOnce().click();
    }
    if (text("知道了").exists()) {
        text("知道了").findOnce().click();
    }
    if (text("同意").exists()) {
        Tools.clickControlBounds(text("同意"));
    }
}
Tools.getCurrentTimeMinu = function () {
    return new Date().getTime()
}


/**
 * 升级窗口
 */
Tools.closeUpgradetWindows = function () {
    Tools.clickControl(text("直接无视"))
    Tools.clickControl(text("点击重播"))
    Tools.clickControl(text("我在想想"))
    Tools.clickControl(text("稍候再说"))

    Tools.clickControl(text("以后"))

    Tools.clickControl(text("以后更新"))
    Tools.clickControl(text("回头再说"))
    Tools.clickControl(text("回头在说"))
    Tools.clickControl(text("先去看看"))
    Tools.clickControl(text("先去逛逛"))
    Tools.clickControl(text("以后再说"))
    Tools.clickControl(text("忽略该版本"))
    Tools.clickControl(text("游客逛逛"))
    Tools.clickControl(text("暂不更新"))
    Tools.clickControl(text("好的"))
}


 Tools.getScreenCapture = function() {
    if(!requestScreenCapture()){
        log("请求截图权限失败");
        return false;
    }else{
        // Thread.interrupt()
        log("已获得截图权限");
        return true;
    }
}


/**
 *  * 判断app今日时间否到达false 未执行完毕 true执行完毕
 * @param {App名称} appName 
 * @param {总共执行时间} execTimes 
 */
Tools.computerExctueTimeIsOver = function (appName, execTimes, isCheckCurrentApp) {

    isCheckCurrentApp = isCheckCurrentApp || false
    if (!isCheckCurrentApp || isCheckCurrentApp == "false") {
        if (appName == app.getAppName(currentPackage())) {
        } else {
            startApp(appName)
        }
        //一直保持屏幕常亮
        device.keepScreenOn()
    }
    let key = appName + adenBase.storageSign() + adenTools.getDate();
    let havedRunTimes = adenStorage.get("" + key + ""); //系统存储已经执行的时间
    if (havedRunTimes == null) {
        return false;//无记录继续执行
    } else {
        let havedMinute = (havedRunTimes / 1000) / 60;//读取到的时间是毫秒需要转换成秒，转换成秒后在转换成分钟
        toastLog(appName + "已经执行" + havedMinute.toFixed(2) + '分' + "总计:" + execTimes + "分");
        if (havedMinute < execTimes) {
            return false;//执行时间小于计划时间继续执行
        } else {
            return true;//执行时间大于计划时间执行完毕
        }
    }
}

/**
 *  * 判断app今日时间否到达
 * 1、完成部分
 * 2、全部完成
 * 3、继续执行
 * @param {App名称} appName 
 * @param {总共执行时间} execTimes 
 * @param {是否碎片化} isFragmentation 
 * @param {碎片化时间} fragmentationTime 
 */
Tools.computerExctueTime = function (appName, execTimes, isFragmentation, fragmentationTime) {
    //toastLog("fragmentationTime:"+fragmentationTime)
    if (appName == app.getAppName(currentPackage())) {
        //toastLog("Run the same app as the task app")
    } else {
        Tools.startApp(appName)
    }
    let key = appName + adenBase.storageSign() + Tools.getDate();
    let havedRunTimes = adenStorage.get("" + key + ""); //系统存储已经执行的时间
    if (havedRunTimes == null) {
        //toastInfo("第一次进入...")
        return 3;//无记录继续执行
    } else {
        let havedMinute = (havedRunTimes / 1000) / 60;//读取到的时间是毫秒需要转换成秒，转换成秒后在转换成分钟
        toastLog(appName + "已经执行" + havedMinute.toFixed(2) + '分' + "总计:" + execTimes + "分");
        if (havedMinute < execTimes) {
            //碎片化执行
            if (isFragmentation) {
                let execCountKey = appName + adenBase.storageSign() + Tools.getDate() + "execCount"; //记录执行次数
                let execCountValue = adenStorage.get("" + execCountKey + ""); //碎片化执行次数
                //toastLog("execCountValue:"+execCountValue)
                if (execCountValue == null) {
                    newCount = 0
                }
                else {
                    newCount = execCountValue;
                }
                newCount = parseInt(newCount) + 1;
                //toastLog("第" + newCount + "次")
                let remainder = parseInt(fragmentationTime * newCount) - parseInt(havedMinute);//计算公式：周期乘以执行次数减去已经执行时间=0（0说明本次执行完毕跳出循环）
                //adenTools.toastInfo("remainder值:" + remainder)
                if (remainder <= 0) {
                    if (execCountValue == null) {
                        //adenTools.toastWarn("记录第一次:" + 1)
                        adenStorage.put(execCountKey, 1);
                    } else {
                        let value = parseInt(execCountValue) + parseInt(1);
                        //adenTools.toastWarn("此数值累加:" + value)
                        adenStorage.put(execCountKey, value);
                    }
                    return 1;
                }
            }
            return 3;//执行时间小于计划时间继续执行
        } else {
            return 2;//执行时间大于计划时间执行完毕
        }
    }
}
/**
 * 记录App签到时间
 * @param {App名称} appName 
 */
Tools.recordBusinessInfo = function (appName, businessName) {
    let key = appName + adenBase.storageSign() + businessName + Tools.getDate();
    let value = Tools.getDate();
    adenStorage.put(key, value);
}
Tools.getBusinessInfo = function (appName, businessName) {
    let key = appName + adenBase.storageSign() + businessName + Tools.getDate();
    let value = adenStorage.get(key);
    return value;
}

/**
 * 记录App签到时间
 * @param {App名称} appName 
 */
Tools.recordSignTime = function (appName) {
    let key = appName + adenBase.storageSign() + "sign";
    let value = Tools.getDate();
    adenStorage.put(key, value);
}
/**
 * 记录App签到时间
 * @param {App名称} appName 
 */
Tools.getSignTime = function (appName) {
    let key = appName + adenBase.storageSign() + "sign";
    let value = adenStorage.get(key);
    return value;
}
Tools.clearSignTime = function (appName) {
    let key = appName + adenBase.storageSign() + "sign";
    adenStorage.remove(key)
    print(appName + "清理签到信息")
}

//返回到某个页面       
//@控件对象   @最大返回/查找次数  return{bool}
Tools.backTo = function (selector_obj, maxFind) {
    console.log("backTo()----------------->" + selector_obj)
    while (!selector_obj.findOne(2000)) {
        if (maxFind > 0) {
            back()
            maxFind--;
            sleep(2000)
        } else {
            console.log("backTo()-->失败")
            return false;
        }
    }
    console.log("backTo()-->成功")
    return true;
}

//主线程 在一定时间内 执行fn() 直到目标控件出现 或者时间结束  
//@uiselector控件条件   @maxWaitCount 最大执行fn()次数
Tools.waitforUi = function (uiSelector, maxWaitCount, fn) {
    let i = 1
    do {
        //最大等待次数 
        if (i > maxWaitCount) {
            Tools.backTo(uiSelector, 3);
            return;
        }
        console.log('主线程第${i}/${maxWaitCount}次等待')
        fn()
        i++
    }
    while (!uiSelector.exists())
}

//返回到某个页面       
//@控件对象   @最大返回/查找次数  return{bool}
Tools.backTo = function (selector_obj, maxFind) {
    console.log("backTo()----------------->" + selector_obj)
    while (!selector_obj.findOne(2000)) {
        if (maxFind > 0) {
            back()
            maxFind--;
            sleep(2000)
        } else {
            console.log("backTo()-->失败")
            return false;
        }
    }
    console.log("backTo()-->成功")
    return true;
}


//随机时间 随机坐标滑动
//@设备宽度  @设备像素高度  @方向  @最小随机时间  @最大随机时间 
Tools.randomSwipe = function (w, h, dir, sleeptiemMin, sleeptiemMax) {

    let _swipe = {
        x1: random(w / 3, w / 2),
        x2: random(w / 3, w / 2),
        y1: random(h / 1.5, h / 1.2),
        y2: random(h / 8, h / 9),
        time: random(200, 300),
        sleep_time: random(sleeptiemMin, sleeptiemMax)
    }
    console.log('${_swipe.sleep_time / 1000}秒后将向${dir}滑')
    sleep(_swipe.sleep_time)
    if (dir == "上") {
        swipe(_swipe.x1, _swipe.y1, _swipe.x2, _swipe.y2, _swipe.time)
    } else if (dir == "下") {
        swipe(_swipe.x1, _swipe.y2, _swipe.x2, _swipe.y1, _swipe.time)
    } else if (dir == "左") {
        swipe(w / 8, _swipe.y2, w / 1.3, _swipe.y2, _swipe.time)
    } else {
        swipe(w / 1.3, _swipe.y2, w / 8, _swipe.y2, _swipe.time)
    }



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
                var find_result_bounds = findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                if (find_result_bounds) {
                    toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                    click(find_result_bounds.x, find_result_bounds.y)
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
            var find_result_bounds = findImage(
                captureScreen(), little_image, {
                region: area_region,
                threshold: threshold
            });
            if (find_result_bounds) {
                toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                click(find_result_bounds.x, find_result_bounds.y)
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
Tools.clickRegionForFindImage = function (img_path_array, area_region, threshold, is_continue) {
    try {
        area_region = area_region || [0, 0, device.width, device.height] //默认的找图区域 全屏找图 前2位是坐标 后面是长度和宽度   千万别理解成是坐标
        threshold = threshold || 0.9 // 默认的相识度0.85
        is_continue = is_continue || false
        if (img_path_array instanceof Array) {
            let arrayLength = img_path_array.length
            for (let i = 0; i < arrayLength; i++) {
                img_path = img_path_array[i] //小图地址可判断是否存在
                if (!files.exists(img_path)) {
                    toastLog(img_path + "文件不存在因此跳过")
                    continue
                }
                var little_image = images.read(img_path) //小图
                var find_result_bounds = images.matchTemplate(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold,
                    max: 100
                });
                if (find_result_bounds) {
                    find_result_bounds.matches.forEach(match => {
                        log(img_path + "point = " + match.point + ", similarity = " + match.similarity);
                        click(match.point.x, match.point.y)
                    });
                    if (is_continue || is_continue == "true") {
                        continue;
                    }
                    return true
                } else {
                    //toastLog(img_path + "小图存在但是在大图中未找到图片进入下一次循环...")
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
            var find_result_bounds = images.matchTemplate(
                captureScreen(), little_image, {
                region: area_region,
                threshold: threshold,
                max: 100
            });
            toastLog(find_result_bounds)
            if (find_result_bounds) {
                //toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                click(find_result_bounds.x, find_result_bounds.y)
                return true
            } else {
                //toastLog(img_path + "小图存在但是在大图中未找到图片")
                return false
            }
        }
    } catch (error) {
        toastLog("clickRegionForFindImage方法出现错误：" + error)
        return false;
    }
}
/**
 * 找图，找到并点击
 * @param {可以是数组也可以是字符串，传输数组可以多次找图知道找到为止} img_path_array 
 * @param {找图区域，默认是全屏找图，该参数可以不传输} area_region 
 * @param {相似度，默认是0.8，可以不传输} threshold 
 * @returns 
 */
Tools.findImageCoordinate = function (img_path_array, area_region, threshold) {
    try {
        let return_region = null
        area_region = area_region || [0, 0, device.width, device.height] //默认的找图区域 全屏找图 前2位是坐标 后面是长度和宽度   千万别理解成是坐标
        threshold = threshold || 0.8 // 默认的相识度0.8
        if (img_path_array instanceof Array) {
            let arrayLength = img_path_array.length
            for (let i = 0; i < arrayLength; i++) {
                img_path = img_path_array[i] //小图地址可判断是否存在
                if (!files.exists(img_path)) {
                    toastLog(img_path + "文件不存在因此跳过")
                    continue
                }
                var little_image = images.read(img_path) //小图
                var find_result_bounds = findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                //this.toastLog(img_path+":"+find_result_bounds)
                if (find_result_bounds == null || find_result_bounds == undefined) {
                    continue
                } else {
                    return find_result_bounds
                }
            }
            return return_region
        }

        if (typeof (img_path_array) == "string") {
            img_path = img_path_array //小图地址可判断是否存在
            if (!files.exists(img_path)) {
                toastLog(img_path + "文件不存在因此跳过")
                return return_region
            }
            var little_image = images.read(img_path) //小图
            var find_result_bounds = findImage(
                captureScreen(), little_image, {
                region: area_region,
                threshold: threshold
            });
            if (find_result_bounds) {
                return find_result_bounds
            } else {
                return return_region
            }
        }
    } catch (error) {
        toastLog("findImageCoordinate方法出现错误：" + error)
        return return_region;
    }
}
/**
 * 获取UI上元素的坐标
 * @param {UI上的元素} element 
 * @returns 元素存在则返回坐标不存在则返回Null值
 */
Tools.getControlBounds = function (element) {
    if (element == null) {
        return null;
    }
    try {
        if (element.exists()) {
            let b = element.findOnce().bounds();
            let result_json = { x: b.centerX(), y: b.centerY() }
            return result_json
        } else {
            return null;
        }
    } catch (error) {
        toastLog("getControlBounds方法出现错误：" + error)
        return null;
    }
}
/**
 * 点击UI上元素的偏移坐标
 * @param {查找的元素} element 
 * @param {偏移的坐标} cordinates 
 * @returns 成功返回True失败错误等返回False
 */
Tools.clickControOffsetCoordinates = function (element, cordinates) {
    try {
        let resultJson = Tools.getControlBounds(element)
        if (resultJson == null || resultJson == undefined) {
            return false
        } else {
            if (cordinates instanceof Array) {
                toastLog(cordinates[1])
                let x = parseInt(resultJson.x) + parseInt(cordinates[0])
                let y = parseInt(resultJson.y) + parseInt(cordinates[1])
                toastLog(y)
                return click(x, y);
            }
            return false
        }
    } catch (error) {
        toastLog("clickControOffsetCoordinates方法出现错误：" + error)
        return false
    }
}

/**
 * 计算两个时间差  返回秒
 */
Tools.getTimeDifference = function (staDate, endDate) {
    var difference = endDate.getTime() - staDate.getTime(); // 计算两个时间戳的差值
    // 转换秒
    var seconds = Math.floor(difference / 1000);
    return seconds;
}

/**
 * 获取当前年月日  用  "- " 拼接
 */
Tools.getYMD = function () {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1; // 注意月份从0开始，所以要加1
    let date = today.getDate();
    return year+"_" +month +"_" +date;
}

module.exports = Tools;