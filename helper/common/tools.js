 var tools = {};


//手机屏幕唤醒  适合数字密码锁屏
//@密码  [type]:str
tools.openPhone = function (password) {
    console.log("openPhone()----------------->")
    sleep(2000)
    if (!device.isScreenOn()) {
        log("openPhone()-->熄屏状态，尝试唤醒&输入密码")
        device.wakeUp()
        //让设备一直亮屏
        // device.keepScreenOn()
        sleep(2000)
        swipe(device.width / 2, device.height / 1.3, device.width / 2, device.height / 8, 200)
        sleep(1000)
        //有密码则
        log("openPhone()-->输入密码中")
        if (text("1").findOne(2000)) {

            for (var i = 0; i <= password.length; i++) {
                click(password[i])
                sleep(100)
            }
        } else if (desc("1").findOne(2000)) {
            for (var i = 0; i <= password.length; i++) {
                var p = desc(password[i]).findOne(1000)
                if (p) {
                    p.click()
                }
                sleep(100)
            }
        } else {
            log("openPhone()-->未找到密码锁")
        }


    }
};

//在"Autox.js v6"app页面 打开其他应用成功率高，提高容错
//@app名字  @打开app后休眠时间
tools.openApp = function (name, time) {
    home()
    sleep(1000)
    launchApp(name)
    sleep(5000)
    sleep(time)

};

//自动化 杀死app后台
//@app包名
tools.killApp = function (packageName) {
    var name = getPackageName(packageName);
    if (!name) {
        if (getAppName(packageName)) {
            name = packageName;
        } else {
            return false;
        }
    }
    app.openAppSetting(name);
    text(app.getAppName(name)).waitFor();
    sleep(2000);
    let is_sure = textMatches(/(强行|停止|结束|强制|运行){2}/).findOne(2000);
    if (is_sure && is_sure.enabled()) {
        click(is_sure.text())
        sleep(2000);
        let next = text("确定").findOne(3000) || textMatches(/(强行|停止|结束|强制|运行){2}/).findOne(2000)
        if (next && next.enabled()) {
            click(next.text())

            console.log('killApp()---------->应用已被关闭');
            sleep(2000);
        } else {
            console.log('killApp()---------->应用不能被正常关闭或不在后台运行');
        }



    } else {
        console.log('killApp()---------->应用不能被正常关闭或不在后台运行');

    }

}


//返回到某个页面       
//@控件对象   @最大返回/查找次数  return{bool}
tools.backTo = function (selector_obj, maxFind) {
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


//截屏权限获取
tools.getScreenCapture = function () {
    console.log("请求截屏权限");
    let Thread = null
    if (device.sdkInt > 28) {
        //等待截屏权限申请并同意   线程多开
        Thread = threads.start(function () {
            // sleep(500)
            // click(846, 1553) 如果无法自动点击 可用坐标
            packageName('com.android.systemui').text(/(允许|立即开始|统一)/).waitFor();
            text(/(允许|立即开始|统一)/).click();
        });

    }
    //申请截屏权限
    if (!requestScreenCapture()) {
        console.log("请求截图失败");
        exit();
        return false;
    } else {
        Thread.interrupt()
        console.log("已获得截图权限");
        return true;

    }
}

//截屏
tools.ScreenCapture = function () {
    console.log("ScreenCapture()----------------->")
    // captureScreen("/sdcard/结果图.png");  -->不会保存到系统相册
    takeScreenshot()//模拟电源+音量键 进行截图-->保存到系统相册
    sleep(4000)
}


//qq邮箱发送
//@目标邮箱  @标题  @正文
tools.email = function (targetEmail, tag, content) {
    if (app.getPackageName("QQ邮箱")) {
        console.log("email()----------------->" + targetEmail)
        let intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(android.net.Uri.parse(targetEmail));
        intent.putExtra(Intent.EXTRA_SUBJECT, tag);
        intent.putExtra(Intent.EXTRA_TEXT, content);
        app.startActivity(intent);
        sleep(4000)
        click("发送")
    } else {
        log("未安装qq邮箱")
    }

}


//随机时间 随机坐标滑动
//@设备宽度  @设备像素高度  @方向  @最小随机时间  @最大随机时间 
tools.randomSwipe = function (w, h, dir, sleeptiemMin, sleeptiemMax) {

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

//点击 在当前页面的控件 
//@uiSelects 控件条件数组   @rangeTop/rangebottom 控件出现得上下范围  有默认值  return{bool}
tools.clickBounds = function (uiSelects, findtime, rangeTop, rangebottom) {
    let i = 0
    rangeTop = rangeTop || 0
    rangebottom = rangebottom || device.height
    while (true) {
        let click_target = uiSelects[i].findOne(findtime)
        if (click_target) {
            if (click_target.bounds().centerY() < rangeTop) {  //得向下滑动
                console.log('clickBounds()------->${uiSelects[i]}控件在屏幕上方')
                swipe(w / 2, h / 2, w / 2, h / 1.2, 300)
            } else if (click_target.bounds().centerY() > rangebottom) { //得向上滑动
                console.log('clickBounds()------->${uiSelects[i]}控件在屏幕下方')
                swipe(w / 2, h / 1.2, w / 2, h / 2, 300)
            } else {
                console.log('点击--->${click_target.text()}')
                click(click_target.bounds().centerX(), click_target.bounds().centerY())
                return true;
            }
        } else {
            if (i < uiSelects.length - 1) {
                i++;
            } else {
                console.log('未找到----->${uiSelects}')
                return false;
            }
        }
    }
}


//主线程 在一定时间内 执行fn() 直到目标控件出现 或者时间结束  
//@uiselector控件条件   @maxWaitCount 最大执行fn()次数
tools.waitforUi = function (uiSelector, maxWaitCount, fn) {
    let i = 1
    do {
        //最大等待次数 
        if (i > maxWaitCount) {
            tools.backTo(uiSelector, 3);
            return;
        }
        console.log('主线程第${i}/${maxWaitCount}次等待')
        fn()
        i++


    }
    while (!uiSelector.exists())
}


//停止出自己之外的所有脚本
tools.stopOtherScript = function () {
    engines.all().map((ScriptEngine) => {
        if (engines.myEngine().toString() !== ScriptEngine.toString()) {
            ScriptEngine.forceStop();
        }
    });

}
//超级点击  
//@要点击的控件  return{bool}
tools.superClick = function (node) {
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

//用户信息报错时的构造函数
tools.UserErroyInfo = function (name, message) {
    this.message = message;
    this.name = name;
}
//适配不同设备的点击方法
//注意,测试机型为1080*2400,
tools.clicks = function (x, y) {
    x1 = device.width / 1080
    y1 = device.height / 2400
    click(x * x1, y * y1)
}

//脚本结尾操作: sync() 把里面的函数加上同步锁，使得在同一时刻最多只能有一个线程执行这个函数
//@是否发送【qq邮箱通知】  @邮箱内容 
tools.exitEnd = sync(function (content, is_sendemail, data) {
    console.log(">>>>>>>>>>>>>>退出脚本准备<<<<<<<<<<<<<<<")
    //is_sendemail 默认为false
    is_sendemail = !!is_sendemail
    content += '已成功任务次数：${data.suceeseTaskCount}\n脚本开始时的金币：${data.begin_coinNum}\n脚本结束时的金币：${data.end_coinNum}\n本次获取金币数量为：${data.end_coinNum - data.begin_coinNum}\n'
    console.log("脚本完成情况:\n" + content)
    // TODO: qq邮箱汇报  必须是qq邮箱app  微信关联qq邮箱即可在微信上直接查看脚本情况
    // is_sendemail && tools.email(targetEmail, appname, content)
    sleep(3000)
    tools.killApp(packageName)
    home()
    //取消屏幕常亮
    device.cancelKeepingAwake()
    threads.shutDownAll()//关闭所有子线程
    engines.stopAll()//关闭所有脚本
})

// 安装应用
tools.installApp = function(appPackage) {
    // 通过包名安装应用
    app.install(appPackage);
}

// 卸载应用
tools.uninstallApp = function(appPackage) {
    // 通过包名卸载应用
    app.uninstall(appPackage);
}

// 启动应用
tools.launchApp = function(appPackage) {
    // 通过包名启动应用
    app.launchApp(appPackage);
}

// 停止应用
tools.stopApp = function(appPackage) {
    // 通过包名停止应用
    app.stopApp(appPackage);
}
// 判断无障碍服务是否开启，为true表示开启；
tools.isAccessibilityEnabled =function(){
    let accessibilityManager = context.getSystemService(android.content.Context.ACCESSIBILITY_SERVICE);
    // 获取已启用的无障碍服务列表
    let enabledServices = accessibilityManager.getEnabledAccessibilityServiceList(android.accessibilityservice.AccessibilityServiceInfo.FEEDBACK_GENERIC);
    // 遍历已启用的无障碍服务列表
    for (let i = 0; i < enabledServices.size(); i++) {
      let service = enabledServices.get(i);
      if (service.getId().startsWith(context.getPackageName())) {
        return true;
      }
    }
    return false;
  }
//暴露模块
module.exports = tools;