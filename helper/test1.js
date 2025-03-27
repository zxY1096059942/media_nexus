//  function clickControlBounds(element) {
//     log(element)
//     let clickResult = false;
//     if (element == null) {
//         return false;
//     }
//     try {
//         if (element.exists()) {
//             toastLog("准备click：" + element);
//             let b = element.findOnce().bounds();
//             log("点击控件坐标( left = " + b.left + ",right = " + b.right + ",top = " + b.top + ",bottom = "+ b.bottom + ")")
//             // var x2 = random(b.left, b.right)
//             // var y2 = random(b.top, b.bottom)
//             // let bx = 0 ;
//             // if(b.centerX()<=0){
//             //     bx = 0.1
//             // }else{
//             //     bx = b.centerX();
//             // }
//             // let by = 0;
//             // if(b.centerY()<=0){
//             //     by = 0.1
//             // }else{
//             //     by = b.centerY()
//             // }
//             log("点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
//             clickResult = click(b.centerX(), b.centerY());
//             // log("点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
//             sleep(random(2000, 3200));
//         } else {

//         }
//         return clickResult;
//     } catch (error) {
//         log("clickControlBounds方法出现错误：" + error)
//         return false;
//     }
// }

// sleep(3000);
// toastLog("番茄畅听点击领现金");
// //className("android.widget.RadioButton").text("领现金").findOne(2000).parent()
// var exitCondition = className("android.widget.RadioButton").find().forEach(element => {
//     log(element.text())
// });
// let a=id("a4p").findOne();
// log(a.text());

// let aaa=className("android.widget.RadioButton").text("首页")
// clickControlBounds(aaa)
// let bbb=className("android.widget.TextView").text("音乐")
// sleep(1000)
// clickControlBounds(bbb)

// let item=id("com.xs.fm:id/dj6")
// clickControlBounds(item)

// let ljlq = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("立即签到").findOne(2000);
// log(ljlq)
// clickControlBounds(ljlq)
// className("androidx.recyclerview.widget.RecyclerView").findOne().children().forEach(child => {
//     var target = child.findOne(className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("立即签到"));
//     log(target)
//     clickControlBounds(target)
// });
// clickControlBounds(desc("立即签到"))
// sleep(1000)
// clickControlBounds(desc("立即签到"))  1
// clickControlBounds(descStartsWith("额外领"))

// 听歌
// let aa=className("android.view.ViewGroup")
// log(aa)
// className("android.view.ViewGroup").findOne().children().forEach(child => {
//     // var target = child.findOne(className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("立即签到"));
//     log(child)
//     clickControlBounds(child)
//     return ;
// });
// let aaa=className("android.widget.LinearLayout").textStartsWith("com.xs.fm:id/").findOne();
// log(aaa)
// className("android.view.ViewGroup").scrollable(true).depth(17).findOne().children().forEach(child => {
//     var target = child.findOne();
//     clickControlBounds(target)
//     log(target)
//     return;
//     });
// click(420,172+280)

// log(new Date().getTime)
// let tm=new Date().getTime();
// log(tm);
// sleep(5000);
// let pp=new Date().getTime();
// log(pp-tm);
//关闭听歌控件按钮
// sleep(2000)    
// back()
// log(keys.back)
// // keycode(4);
// sleep(2000)
// let ids=id("com.dragon.read:id/ac1")
// clickControlBounds(ids)

// let ff =className("android.widget.TextView").text("1");
// log(clickControlBounds(ff));

// (id("com.dragon.read:id/kc")).click();
// back();   
// sleep(3000);                      
// clickControlBounds(className("android.widget.TextView").text("暂不加入"));
// clickControlBounds(id("com.dragon.read:id/hl"))
// back()

//听书
// click(300,330)
// sleep(1000)
// // clickControlBounds(id("com.xs.fm:id/d0i"))//听歌
// id("com.xs.fm:id/d0i").click()
// // clickControlBounds(id("com.xs.fm:id/d1n"))//听书
// sleep(1000)
// back()
// clickControlBounds(className("android.widget.TextView").text("暂不加入"));
// fullId("com.xs.fm:id/d0i")
// sleep(1000)
// swipe(300, 500, 300, 2000, 500);
sleep(1000)
// let hc = id("com.xs.fm:id/hc")
// clickControlBounds(hc);

// let array = textContains("分").findOne().parent().children();
// array.forEach(element => {
//     log(element.className())
// });

// let tt=textContains("标签找书").findOne()
// log(tt.bounds().centerX())
// click(tt.bounds().centerX(),tt.bounds().centerY()+200)
// className("android.widget.TextView").text("开始播放")
// sleep(1000)
// clickControlBounds(className("android.widget.TextView").text("开始播放"));

// let kanshu=className("android.widget.TextView").text("看书").findOne();
// sleep(1000)
// click(kanshu.bounds().centerX(), kanshu.bounds().centerY()+100);
// sleep(4000)
// click(600,300)
// sleep(1000)
// back()


// let music=className("android.widget.TextView").text("音乐");
// clickControlBounds(music)
// sleep(1000)
// let tuijian=className("android.widget.Button").text("推荐");
// clickControlBounds(tuijian)
// log(tuijian)
// tj=tuijian.findOne()
// click(tj.bounds().centerX(), tj.bounds().centerY()+100);
// sleep(4000)
// click(600,300)
// sleep(1000)
// back()


// let tuijian=className("android.widget.TextView").text("推荐");
// clickControlBounds(tuijian)
// log(tuijian)
// tj=tuijian.findOne()
// click(tj.bounds().centerX(), tj.bounds().centerY()+100);
// sleep(5000)
// back()
// let mycoin = text("金币收益")
// clickControlBounds(mycoin)
// let pp=className("com.lynx.tasm.behavior.ui.LynxFlattenUI").text("金币收益(币)")
// for(i in pp){
//     log(i)
// }

// let aa=className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("3038")
// let aa=className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("金币收益")






//let srk = className("android.widget.EditText").id("et_search_kw");

//let srk = id("fl_input_hint_container");

// let fangdajing = className("android.widget.Button").desc("搜索");
// if (!fangdajing) {
//     log("暂无点击放大镜")
//     return;
// }
// toastLog("找到放大镜")
// let b = fangdajing.findOnce().bounds();

// toastLog("准备点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
// click(b.centerX(), b.centerY());
// sleep(3000)

// let srk = className("android.widget.EditText").findOne(2000);


// if (!srk) {
//     log('未找到输入框')
//     return;
// }
// log('找到输入框')
//     var aa = srk.getText();
//     log('设置文字成功' + aa)
//     srk.setText("989898989");

//测试番茄畅听的顺序

// let yy = className("android.widget.TextView").text("音乐");
// let cyy = yy.findOne(20000);
// log()
// if (cyy != null) {
// let boudyy = cyy.bounds();
// click(boudyy.centerX(), boudyy.centerY())
// log("yy----------------")
// }

// back();
// sleep(20000);
// let dj = className("android.widget.TextView").text("短剧");
// let cdj = dj.findOne(20000);
// if (cdj != null) {
// let bouddj = cdj.bounds();
// click(bouddj.centerX(), bouddj.centerY())
// log("dj----------------")
// }
// sleep(10000);
// back();
// let ks = className("android.widget.TextView").text("看书");
// let cks = ks.findOne(20000);
// sleep(20000);
// if (cks != null) {
// let boudks = cks.bounds();
// sleep(20000);
// click(boudks.centerX(), boudks.centerY())
// log("ks----------------")
// }
// sleep(10000);
// back();




// let element = className("com.lynx.tasm.behavior.ui.LynxFlattenUI").text("开宝箱得金币");

// if (element.exists()) {
//     toastLog("准备click：" + element);
//     let b = element.findOnce().bounds();
//     toastLog("准备点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
//     let clickResult = click(b.centerX(), b.centerY());
//     toastLog("点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
//     sleep(random(2000, 3200));
// } else {

// }


// let lookProtask = text("领红包"); 
// log("番茄畅听，红包雨----"+lookProtask.toString());     
// let jbhbyOne = lookProtask.findOne(20000);   
// log("番茄畅听，红包雨"+jbhbyOne);     
// let c = jbhbyOne.bounds();
// if( c.centerY() > h/4*3){
//     swipe(w / 2, h/5*4, w / 2, h/5*4-500, 500);
//     sleep(1000)
// }else{
//     if (lookProtask.exists()) {
//         toastLog("准备click：" + lookProtask);
//         let b = lookProtask.findOnce().bounds();
//         toastLog("准备点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
//         let clickResult = click(b.centerX(), b.centerY());
//         toastLog("点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")
//         sleep(random(2000, 3200));
//     } else {
    
//     }
// }


// app.launchApp("西瓜视频");//启动App


// console.show();


// this.ison();
// sleep(1000);
// app.launchApp("快手极速版");//启动App
// sleep(6000)
// let actSelector =  desc("去赚钱");
// let actObj = getUiObject(actSelector);
// if (actObj == null) {
//     console.log("进入活动页失败");
// }
// let b = actSelector.findOnce().bounds();

// sleep(1000)
// toastLog("准备点击控件坐标(" + b.centerX() + "," + b.centerY() + ")")

// let xh=2;
// while (xh>=0) {
      
//        sleep(10000);
//        xh--;
//        console.log("滑动次数"+xh);
// }


// this.click(300,400);
// sleep(1000)
// this.swipe(100,200,300,400,10,5,5);
// sleep(1000)
// this.setxy(300,500);
// sleep(1000)
// this.back();
// sleep(1000);
// this.home();
// sleep(1000);
//this.power(); //注意熄屏会造成蓝牙关闭，建议使用熄屏
// const h = device.height || 2310,
//     w = device.width || 1080;
// setScreenMetrics(w, h);

 //this.click(543,2143.5);

//  this.click(665, 2176.5);

this.setsendmode(2);
sleep(1000);
  this.senddata("z:ab12");



    //  // 随便点击一本书
    //  let boubings = isPerfectFindOCR(2)
    //  if(boubings.length>0){
    //     console.log("点击一本书坐标:"+boubings[0]);
    //      if(boubings[0]>272) {
    //         console.log("点击一本书1");
    //         click(boubings[0],boubings[1]);
    //      }else{
    //         console.log("点击一本书2");
    //          click(272,1068.5);
    //      }
    //  }else{
    //     console.log("点击一本书3");
    //      click(272,1068.5);
    //  }

//     sleep(1000);
//  recents()
//  sleep(1000);
//  recents()
//  sleep(1000);
//  recents()
// isPerfectFindOCRCZ(random(2,4))


// var yourString="12,13";
// var result=yourString.split(",");
// for(var i=0;i<result.length;i++){
//     console.log(result[i]);
// }

//通过ocr精准查找是否存在
function isPerfectFindOCR (word){
    console.log("通过ocr查找对象关键字："+word);
    let bounds = [];
    sleep(3000);
    let objData = umiocrFindData();
    //hgapp.log("通过ocr查找对象："+objData);
    sleep(3000);
    bounds =umiocrPerfectMatchWord(objData,word);
    console.log("通过ocr查找word："+word+"返回值"+bounds);
    return bounds;
}





//umi开源ocr精确识别坐标
function umiocrPerfectMatchWord(res, word) {
    let bounds = []; // 初始化一个空数组用于存储数字
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        // toastLog(JSON.stringify(res.data[i].box));
        var 左上 = 坐标数组[0];
        var 右下 = 坐标数组[2];
        // toastLog("文字：", res.data[i].text, "，范围为：", JSON.stringify(res.data[i].box));
         console.log("文字：", res.data[i].text, "，范围为：", 左上[0], 左上[1], 右下[0], 右下[1]);
        if (res.data[i].text == word) {
            var 右上 = 坐标数组[1];
            var 左下 = 坐标数组[3];
            var x = 左上[0] + (右上[0] - 左上[0]) / 2;
            var y = 左下[1] + (右上[1] - 左下[1]) / 2;
            console.log("命中:" + word + "，坐标x:", x, "y:", y)
            bounds.push(x);
            bounds.push(y);
            return bounds;
        }
    }

    toastLog("没有定位到：" + word);
    return bounds
}

//umig开源ocr识别
function umiocrFindData(){
    // 设置图片路径
    var path_imag="/sdcard/whb1.png";
    sleep(3000)
    if(!requestScreenCapture()){
        //如果请求失败则终止脚本
        exit();
    }
    //toastLog("ocr识别设置截屏");
    var 截图保存 = images.captureScreen(path_imag);
    // toastLog("ocr开始识别！");
    sleep(5000)
    if (!截图保存) {
        toastLog("ocr识别截图保存失败，请检查是否有权限");
        exit();
    }
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
    }else{
        toastLog("识别失败，请检查res报错");
        files.remove(path_imag);
    }
    return null;
}
  
// // 目标应用的包名
// var packageName = "com.phoenix.read";
 
// // 结束进程的函数
// function killProcessByName(packageName) {
//     var pid = -1;
//     var manager = auto.getActivity().getSystemService(Context.ACTIVITY_SERVICE);
//     if (manager != null && manager instanceof ActivityManager) {
//         var runningApps = manager.getRunningAppProcesses();
//         if (runningApps != null) {
//             for (var i = 0; i < runningApps.size(); i++) {
//                 var processInfo = runningApps.get(i);
//                 if (processInfo.processName.equals(packageName)) {
//                     pid = processInfo.pid;
//                     break;
//                 }
//             }
//         }
//     }
 
//     if (pid != -1) {
//         // 结束进程
//         runShellCommand("am kill " + pid);
//     }
// }
 
// // 运行Shell命令的函数
// function runShellCommand(command) {
//     var runtime = auto.getRuntime();
//     runtime.exec("sh", ["-c", command]);
// }
 
// // 调用结束进程的函数
// killProcessByName(packageName);


// var countNum = 0;
// while(countNum<3){
//     randomSwipe(w, h, "下", 3000, 5000);
//     sleep(1000)
//     countNum++;
// }
//随机时间 随机坐标滑动
//@设备宽度  @设备像素高度  @方向  @最小随机时间  @最大随机时间 
function randomSwipe(w, h, dir, sleeptiemMin, sleeptiemMax) {

    let _swipe = {
        x1: random(w / 3, w / 2),
        x2: random(w / 3, w / 2),
        y1: random(h / 1.5, h / 1.2),
        y2: random(h / 8, h / 9),
        steps:5,
        downTime: 100,
        upTime: random(80, 100)
    }
    console.log('${_swipe.sleep_time / 1000}秒后将向${dir}滑')
    sleep(_swipe.upTime)
    if (dir == "上") {
        swipe(_swipe.x1, _swipe.y1, _swipe.x2, _swipe.y2,_swipe.steps, _swipe.downTime, _swipe.upTime)
    } else if (dir == "下") {
        swipe(_swipe.x1, _swipe.y2, _swipe.x2, _swipe.y1,_swipe.steps, _swipe.downTime, _swipe.upTime)
    } else if (dir == "左") {
        swipe(w / 8, _swipe.y2, w / 1.3, _swipe.y2,_swipe.steps, _swipe.downTime, _swipe.upTime)
    } else {
        swipe(w / 1.3, _swipe.y2, w / 8, _swipe.y2,_swipe.steps, _swipe.downTime, _swipe.upTime)
    }
}




function setsendmode(mode){
    var r = http.get("http://127.0.0.1:9123/setsendmode?mode="+mode);
    if (r.statusCode==200) {
        console.log("是否开启"+r.body.string());
        return true;
    } else {
        console.error(r.statusCode);
        console.log("是否开启"+r.body.string());
        return false;
    }
}

//  是否开启
function senddata(code){
    var r = http.get("http://127.0.0.1:9123/senddata?data="+code);
    if (r.statusCode==200) {
        console.log("是否开启"+r.body.string());
        return true;
    } else {
        console.error(r.statusCode);
        console.log("是否开启"+r.body.string());
        return false;
    }
}


//  是否开启
function ison(){
    var r = http.get("http://127.0.0.1:9123/ison");
    if (r.statusCode==200) {
        console.log("是否开启"+r.body.string());
    } else {
        console.error(r.statusCode);
        console.log("是否开启"+r.body.string());
    }
}
//  点击事件
function click(x,y){
    var r1 = http.get("http://127.0.0.1:9123/click?x="+x+"&y="+y);
    if (r1.statusCode==200) {
        console.log("点击事件"+r1.body.string());
    } else {
        console.error(r1.statusCode);
        console.log("点击事件"+r1.body.string());
    }
}
//  按下事件
function touchdown(x,y){
    var r1 = http.get("http://127.0.0.1:9123/touchdown?x="+x+"&y="+y);
    if (r1.statusCode==200) {
        console.log("按下事件"+r1.body.string());
    } else {
        console.error(r1.statusCode);
        console.log("按下事件"+r1.body.string());
    }
}

//  模式滑动
function touchMove(){
    var r1 = http.get("http://127.0.0.1:9123/touchMove?id=1&x=300&y=600");
    if (r1.statusCode==200) {
        console.log("模式滑动"+r1.body.string());
    } else {
        console.error(r1.statusCode);
        console.log("模式滑动"+r1.body.string());
    }
}


//  滑动事件
// function swipe(){
//     var r1 = http.get("http://127.0.0.1:9123/swipe?x1=400&y1=600&x2=800&y2=1000&steps=10&downtime=5&uptime=5&speed=100");
//     if (r1.statusCode==200) {
//         console.log("滑动事件"+r1.body.string());
//     } else {
//         console.error(r1.statusCode);
//         console.log("滑动事件"+r1.body.string());
//     }
// }

function swipe(x1,y1,x2,y2,steps,downTime,upTime){
    //var r1 = http.get("http://127.0.0.1:9123/swipe?x1=400&y1=600&x2=800&y2=1000&steps=10&downtime=5&uptime=5&speed=100");
    var r1 = http.get("http://127.0.0.1:9123/swipe?x1="+x1+"&y1="+y1+"&x2="+x2+"&y2="+y2+"&steps="+steps+"&downtime="+downTime+"&speed=10");
    
    if (r1.statusCode==200) {
        console.log("蓝牙滑动事件成功"+r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙滑动事件失败"+r1.body.string());
        return false;
    }
}


//  后台键
function recents(){

    var r1 = http.get("http://127.0.0.1:9123/recents");
    if (r1.statusCode==200) {
        console.log("蓝牙后台键成功"+r1.body.string());
        return true;
    } else {
        console.error(r1.statusCode);
        console.log("蓝牙后台键失败"+r1.body.string());
        return false;
    }
}

//  坐标点击
function setxy(x,y){
    var r1 = http.get("http://127.0.0.1:9123/setxy?x="+x+"&y="+y);
    if (r1.statusCode==200) {
        console.log("坐标点击"+r1.body.string());
    } else {
        console.error(r1.statusCode);
        console.log("坐标点击"+r1.body.string());
    }
}
//  返回键
function back(){
    var r1 = http.get("http://127.0.0.1:9123/back");
    if (r1.statusCode==200) {
        console.log("返回键"+r1.body.string());
    } else {
        console.error(r1.statusCode);
        console.log("返回键"+r1.body.string());
    }
}

//  返回首页
function home(){
    var r1 = http.get("http://127.0.0.1:9123/home");
    if (r1.statusCode==200) {
        console.log("返回首页"+r1.body.string());
    } else {
        console.error(r1.statusCode);
        console.log("返回首页"+r1.body.string());
    }
}




//  电源开关熄屏
function power(){

    var r1 = http.get("http://127.0.0.1:9123/power");
    if (r1.statusCode==200) {
        console.log("电源开关熄屏"+r1.body.string());
    } else {
        console.error(r1.statusCode);
        console.log("电源开关熄屏"+r1.body.string());
    }
}
// //  后台键
// function recents(){

//     var r1 = http.get("http://127.0.0.1:9123/recents");
//     if (r1.statusCode==200) {
//         console.log("后台键"+r1.body.string());
//     } else {
//         console.error(r1.statusCode);
//         console.log("后台键"+r1.body.string());
//     }
// }




function getUiObject(uiselector) {
    let count = 0;
    while (!uiselector.exists() && count < 10) {
        console.log("获取控件:" + uiselector + "..., 次数：" + count);
        sleep(2000);
        count = count + 1;
    }
    if (!uiselector.exists()) {
        console.log("未获取到控件" + uiselector);
        throw new Error("获取控件失败");
    }
    return uiselector.findOnce();
}



