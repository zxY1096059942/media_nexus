var ksapp = {};

let adenTools = require('../common/Tools11');
let bluetoothTools = require('../common/ToolsBluetooth');
var ws = require('../common/ws');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
let ad_image_array = buildADArray("Image/AD/ad", 17);//关闭按钮定义

let gz_image_array = buildADArray("../Image/ksapp/GZ/gz", 1);//关注

let sc_image_array = buildADArray("../Image/ksapp/SC/sc", 1);//收藏

let lxj_image_array = buildADArray("Image/ksapp/LXJ/lxj", 1);//领现金

let txssy_image_array = buildADArray("Image/ksapp/TXSSY/txssy", 1);//金额30

let txswy_image_array = buildADArray("Image/ksapp/TXSWY/txswy", 1);//金额15

let txldwy_image_array = buildADArray("Image/ksapp/TXLDWY/txldwy", 1);//金额0.5

let ljdh_image_array = buildADArray("Image/ksapp/LJDH/ljdh", 1);//立即兑换

let jsdz_image_array = buildADArray("Image/ksapp/JSDZ/jsdz", 1);//极速到账

let ljtx_image_array = buildADArray("Image/ksapp/LJTX/ljtx", 1);//立即提现

let wc_image_array = buildADArray("Image/ksapp/WC/wc", 1);//完成

let zdl_image_array = buildADArray("Image/ksapp/ZDL/zdl", 1);//知道了


var bjNum = 0; // 获取上一个任务结束的金币数量
const h = device.height || 2310,
    w = device.width || 1080;
setScreenMetrics(w, h);

if(!requestScreenCapture()){
    //如果请求失败则终止脚本
    exit();
}
toastLog("w:"+w+"h:"+h)

//开启存储权限
// openStoragePermissions();
// function openStoragePermissions() {
//     // 检查权限并请求
//     if (!context.getPackageManager().checkPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, context.getPackageName())) {
//         // 权限未开启，请求用户开启
//         var intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
//         intent.setData(android.net.Uri.parse("package:" + context.getPackageName()));
//         context.startActivity(intent);
//     } else {
//         // 权限已开启
//         toast("存储权限已开启");
//     }
// }


// verifyStoragePermissions();
// /* -------------------------------------------------------------------------- */
// function verifyStoragePermissions() {
//     let REQUEST_EXTERNAL_STORAGE = 1;
//     let PERMISSIONS_STORAGE = [
//         "android.permission.READ_EXTERNAL_STORAGE",
//         "android.permission.WRITE_EXTERNAL_STORAGE",
//     ];
//     try {
//         //检测是否有写的权限
//         let permission =
//             Packages.androidx.core.app.ActivityCompat.checkSelfPermission(
//                 activity,
//                 "android.permission.WRITE_EXTERNAL_STORAGE"
//             );
//         if (
//             permission != android.content.pm.PackageManager.PERMISSION_GRANTED
//         ) {
//             // 没有写的权限，去申请写的权限，会弹出对话框
//             Packages.androidx.core.app.ActivityCompat.requestPermissions(
//                 activity,
//                 PERMISSIONS_STORAGE,
//                 REQUEST_EXTERNAL_STORAGE
//             );
//         } else {
//             log("有读写权限");
//         }
//     } catch (e) {
//         log(e);
//     }
// }




ksapp.init = function (appPlan, f) {
    // 安装检测 app 
    // installApp(appPlan);
    this.appId = appPlan.id;
    this.me = appPlan.memberId;
    this.day = appPlan.planKey;
    this.keyPrefix = this.appId + "_" + this.me + "_" + this.day + "_";
    this.fun = f;
    this.curStep = 0;
    this.lastGetCoinTime = 0;
    adenTools.startApp(appPlan.appName); //启动App
    adenTools.sleepRandom7();//启动App时候等待时间
}


ksapp.start = function (appPlan,f) {
    ksapp.init(appPlan, f)
    adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
    let staDate = new Date()
    toastLog("w：  " + w  + "  h: "+h);
   // bluetoothTools.closeUpgradetWindows()
    adenTools.sleepRandom9();
   // toastLog("w：  " + w  + "  h: "+h);
    let count = 0 ;
    ksapp.搜索刷视频(appPlan,f,10);
    adenTools.sleepRandom3();

    ksapp.设置金币(appPlan,ksapp.获取金币());
    adenTools.sleepRandom5();
   // bluetoothTools.back();

    let mTime = new Date();
    let isSignKey = "kuaishoujisubanSign_"+appPlan.appId+"_"+appPlan.memberId+"_"+mTime; 
    let isSign = localStorage.get(isSignKey);
    if(!isSign){
    adenTools.sleepRandom3();
    ksapp.签到(appPlan,f,isSignKey);
   // bluetoothTools.back();
   // adenTools.sleepRandom3();
    }else{
        log("本地存储 签到状态 为 true 跳过执行"); 
    }
    while(count <= 60*2){
        ksapp.开宝箱(appPlan,f);
        adenTools.sleepRandom3();
        ksapp.预约领金币(appPlan,f);
        //bluetoothTools.back();
        //ksapp.搜索刷视频(appPlan,f,1);
        // adenTools.sleepRandom3();
        // ksapp.逛街领金币(appPlan,f);
        // bluetoothTools.back();
        // adenTools.sleepRandom3();
        // ksapp.看广告得金币(appPlan,f);
        // bluetoothTools.back();
        let endDate = new Date()
        count = adenTools.getTimeDifference(staDate ,endDate);
     }
     let newCoin =ksapp.获取金币();
     let num =newCoin -ksapp.获取首次金币(appPlan);
     saveStorage.storageInfoData(f,"info","200",num,null,count,"获取金币",10,appPlan.id,"完成","成功");
     toastLog("【本轮获取金币数量】："+num+",花费时间："+count)
     bluetoothTools.back();
     sleep(2000);
     adenTools.clearCach(appPlan.appName)
     bluetoothTools.back();

};



// 首页刷视频
ksapp.搜索刷视频 = function (app, f,taskTime) {
    //ksapp.跳转首页();
    let minu =  adenTools.getCurrentTimeMinu()
    search(taskTime)
    let end =  adenTools.getCurrentTimeMinu()
    let num = 0
    saveStorage.storageInfoData(f,"info","200",num,null,end-minu,"首页刷视频",1,app.id,"完成","成功")
}
// 搜索刷视频
function search(taskTime){
    var staDate = new Date();
    adenTools.sleepRandom5();
    let count = 0
    while(count <= 60*random(taskTime-30, taskTime)){
        console.log("滑动次数"+count);
        bluetoothTools.randomSwipe(w, h, "上", 50, 100)
        adenTools.sleepRandom5()
        // if(random(1, 20) == 2){// 关注
        //     toastLog("开始关注")
        //     guanZhu();
        //     adenTools.sleepRandom3()
        // }
        if(random(1, 10) == 3){  // 点赞
           // toastLog("开始点赞")
            dianZan()
            adenTools.sleepRandom3()
            bluetoothTools.back(); //要用蓝牙工具类的返回
           
        }
        // if(random(1, 20) == 4){ // 收藏
        //     toastLog("开始收藏")
        //     shouCang()
        //     adenTools.sleepRandom3()
        // }
        var endDate = new Date();
        count = adenTools.getTimeDifference(staDate,endDate)
    }
    bluetoothTools.back(); //要用蓝牙工具类的返回
    adenTools.sleepRandom3();
}
function guanZhu() {
    adenTools.sleepRandom3();
    var gzBounds = clickAreaForFindImage(gz_image_array);//关注
    if (gzBounds) {
        toastLog("关注成功")
    }else{
        toastLog("暂无关注")
    }
}
function dianZan() {
    toastLog("点赞")
    //最多敲击三次
    bluetoothTools.click(300, 500)
    sleep(100)
    bluetoothTools.click(302, 510)
}

function shouCang() {
    toastLog("收藏")
    sleep(2000)
    var scBounds = clickAreaForFindImage(sc_image_array);//关注
    if (scBounds) {
        toastLog("收藏成功")
    }else{
        toastLog("暂无收藏")
    }
}
function zhuanFa() {
    toastLog("转发")
        let fengxiang =  id("com.kuaishou.nebula:id/forward_icon");//.findOne(2000)
        if(!fengxiang){
            toastLog("暂无分享按钮")
        }else{
            adenTools.clickControlBounds(fengxiang);
            adenTools.sleepRandom3();
        }
        let faBuZuoPing =   className("android.widget.TextView").text("转发作品");//.findOne(2000)
        toastLog("转发作品:" + faBuZuoPing.text());
        if(faBuZuoPing == null || faBuZuoPing == "" || !faBuZuoPing){
            toastLog("暂无转发作品按钮")
        }else{
            adenTools.clickControlBounds(faBuZuoPing);
            adenTools.sleepRandom9();
        }
        let fasong  =  textStartsWith("发送")//.findOne(2000) 
        adenTools.sleepRandom3();
        if(!fasong){
            toastLog("暂无发送按钮")
        }else{
            adenTools.clickControlBounds(fasong);
        }
    }
        

// 签到
ksapp.签到 = function (app, f,isSignKey) {
    toastLog("进入快手极速版进入签到");
    ksapp.跳转任务中心();
    var result = false;
    let countNum=0;
    while(true){
        let bounds = [];
        bounds = ksapp.isFindOCR("立即签到");
        if(bounds.length>0){
            bluetoothTools.click(bounds[0], bounds[1]);
            result = true;
            ksapp.log("快手极速版，签到-->点击签到");
            adenTools.sleepRandom3();
            break;
        }
        bluetoothTools.swipe(w / 2, h - 380, w / 2, 0,5,100,10);
        adenTools.sleepRandom3();
        countNum++;
        if(countNum>6){
            ksapp.log("暂无签到");
            break;
        }
    }
    
    if(result){
        localStorage.put(isSignKey,true)
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",null,null,111,"签到",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"签到",6,app.id,"失败","失败")
    }


}



//预约领金币
ksapp.预约领金币 = function (app, f) {
    ksapp.log("进入快手极速版预约领金币");
    ksapp.跳转任务中心();
    let result = false;
    let countNum=0;
    while(true){
        let bounds = [];
        let ljyybounds = [];
        bounds = ksapp.isFindOCR("预约领金币");
        if(bounds.length>0){
            bluetoothTools.click(bounds[0], bounds[1]);
            result = true;

            ksapp.log("进入立即预约进行点击预约按钮");
            adenTools.sleepRandom3();
            ljyybounds = ksapp.isFindOCR("立即预约");
            if(ljyybounds.length>0){
                bluetoothTools.click(ljyybounds[0], ljyybounds[1]);
            }
            break;
        }
        bluetoothTools.swipe(w / 2, h - 380, w / 2, 0,5,100,10);
        adenTools.sleepRandom3();
        countNum++;
        if(countNum>6){
            ksapp.log("暂无预约领金币");
            break;
        }
    }
    bluetoothTools.back();
    if(result){
        //将每次任务存储到本地记录
         saveStorage.storageInfoData(f,"info","200",null,null,10,"预约领金币",7,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,1,"预约领金币",7,app.id,"失败","未找到预约领金币按钮")
    }   
   
}

//逛街领金币
ksapp.逛街领金币 = function (app, f) {
    ksapp.log("开始逛街领金币");
    ksapp.跳转任务中心();
    var staDate = new Date();
    var result = false; 
    let count = 0
    while(true){
        let bounds = [];
        bounds = ksapp.isFindOCR("逛街领金币");
        if(bounds.length>0){
            bluetoothTools.click(bounds[0], bounds[1]);
            result = true;
            ksapp.log("进入逛街领金币，点击逛街领金币");
            adenTools.sleepRandom100();
            var endDate = new Date();
            count = adenTools.getTimeDifference(staDate,endDate)
            if(count/4){
                bluetoothTools.randomSwipe(w, h, "上", 3000, 5000)
            }else{
                bluetoothTools.randomSwipe(w, h, "下", 3000, 5000)
            }
            while (true) {
                adenTools.sleepRandom9();
                if(ksapp.isOCRCZ("已成功领取")){
                    if(!ksapp.isOCRCZ("领取奖励")){
                      break;
                    }
                }
            }
            ksapp.isOCRCZ("放弃奖励");
            ksapp.isOCRCZ("坚持退出");
            break;
        }
        bluetoothTools.swipe(w / 2, h - 380, w / 2, 0,5,100,10);
        adenTools.sleepRandom3();
        countNum++;
        if(countNum>6){
            ksapp.log("暂无逛街领金币");
            break;
        }
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",0,null,count,"逛街领金币",5,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,count,"逛街领金币未找到",5,app.id,"失败","逛街领金币未找到")
     }

}

// 看广告得金币
ksapp.看广告得金币 = function (app, f) {
    let result = false;
    ksapp.log("快手极速版，看广告得金币");
    ksapp.跳转任务中心();
    while(true){
        let bounds = [];
        bounds = ksapp.isFindOCR("看广告得");
        if(bounds.length>0){
            bluetoothTools.click(bounds[0], bounds[1]);
            result = true;
            ksapp.log("进入看广告得金币，点击看广告得金币");
            adenTools.sleepRandom100();
            var endDate = new Date();
            count = adenTools.getTimeDifference(staDate,endDate)
            if(count/4){
                bluetoothTools.randomSwipe(w, h, "上", 3000, 5000)
            }else{
                bluetoothTools.randomSwipe(w, h, "下", 3000, 5000)
            }
            while (true) {
                adenTools.sleepRandom9();
                if(ksapp.isOCRCZ("已成功领取")){
                    if(!ksapp.isOCRCZ("领取奖励")){
                      break;
                    }
                }
            }
            ksapp.isOCRCZ("放弃奖励");
            ksapp.isOCRCZ("坚持退出");
            break;
        }
        bluetoothTools.swipe(w / 2, h - 380, w / 2, 0,5,100,10);
        adenTools.sleepRandom3();
        countNum++;
        if(countNum>8){
            ksapp.log("暂无看广告得金币");
            break;
        }
    }

    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",null,null,10,"看广告任务",3,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,1,"看广告任务",3,app.id,"失败","未找到广告任务入口")
    }

}

//通过ocr点击是否成功
ksapp.isOCRCZ = function(word){
    var isFlag = false;
    let bounds = [];

    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom3();
    bounds = bluetoothTools.umiocrClickWordBounds(objData,word);
    ksapp.log("通过ocr查找word："+word+"返回值"+bounds);
    adenTools.sleepRandom3();
    if(bounds.length>0)
    {
        bluetoothTools.click(bounds[0], bounds[1]);
        isFlag = true;
    }
    return isFlag;
}

//通过ocr查找是否存在
ksapp.isFindOCR = function(word){
    ksapp.log("通过ocr查找对象关键字："+word);
    let bounds = [];
    adenTools.sleepRandom3();
    let objData = bluetoothTools.umiocrFindData();
    ksapp.log("通过ocr查找对象："+objData);
    adenTools.sleepRandom3();
    bounds = bluetoothTools.umiocrClickWordBounds(objData,word);
    ksapp.log("通过ocr查找word："+word+"返回值"+bounds);
    return bounds;
}

//开宝箱
ksapp.开宝箱 = function (app,f) {
    ksapp.log("快手极速版,开宝箱");
    ksapp.跳转任务中心();
    var result = false;
    var countNum= 0;
    while(true){
        if(ksapp.isOCRCZ("点可领")){
            result = true;
            ksapp.log("点击开宝箱得金币");
            break;
        }
        bluetoothTools.swipe(w / 2, h - 380, w / 2, 0,5,100,10);
        adenTools.sleepRandom3();
        countNum++;
        if(countNum>6){
            ksapp.log("暂无逛街领金币");
            break;
        }
    }

    if(ksapp.开宝箱查去看广告得最高()){
        while (true) {
            adenTools.sleepRandom9();
            if(ksapp.isOCRCZ("已成功领取")){
                adenTools.sleepRandom9();
                ksapp.isOCRCZ("放弃奖励");
                ksapp.isOCRCZ("坚持退出");
                break;
            }
        }
     }else{
        clickAreaForFindImage(ad_image_array); //关闭
     }
    
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",0,null,111,"快手极速版,开宝箱",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"快手极速版,开宝箱",6,app.id,"失败","失败")
    }
    
}

ksapp.开宝箱查去看广告得最高 = function () {
    var countQkgNum= 0;
    var qkggFlag =false;
    while(countQkgNum<3){
        if(ksapp.isOCRCZ("去看广告得最高")){
            ksapp.log("点击去看广告得最高");
            qkggFlag = true;
            break;
        }
        countQkgNum++;
     }
     return qkggFlag;
}


ksapp.跳转任务中心 = function () {
    //bluetoothTools.swipe(w / 2,h/9,w / 2, 5*h,5,100,10);
    var flag = false;
    let num = 0;
    let countNum = 0;
    clickAreaForFindImage(ad_image_array)
    while (true) {
        let bounds = [];
        ksapp.log("通过ocr查找word：去赚钱");
        bounds = ksapp.isFindOCR("去赚钱");
        if(bounds.length>0){
            bluetoothTools.click(bounds[0], bounds[1]);
            flag = true;
        }
        if (flag) {
            toastLog("快手极速版进入任务中心页面");
            bluetoothTools.randomSwipe(w, h, "上", 3000, 5000);
            //bluetoothTools.swipe(w / 2,h/9,w / 2, 5*h,5,100,10);
            adenTools.sleepRandom1();
            break;
        }else{
            adenTools.sleepRandom3();
            num ++;
            bluetoothTools.back();//直到返回首页
            toastLog("back后退"+num+"次");
        }
    }
    while(countNum<6){
        bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
        adenTools.sleepRandom1();
        countNum++;
    }
    clickAreaForFindImage(ad_image_array)
    ksapp.log("第"+ num + "次，找到快手极速版去赚钱");
}

ksapp.跳转首页 = function () {
    toastLog("快手极速版点击首页");
    var flag = false;
    let num = 0;
    while (true) {
        let bounds = [];
        bounds = ksapp.isFindOCR("首页");
        if(bounds.length>0){
            bluetoothTools.click(bounds[0], bounds[1]);
            flag = true;
        }
        // 定义需要点击的元素
        if (flag) {
            toastLog("快手极速版点击首页成功");
            adenTools.sleepRandom3();
            break;
        }
        num ++;
        adenTools.sleepRandom1();
        console.log("为找到去首页，无法进入首页 第" + num  +"次！！！！！！！") ;
    }
     console.log("循环退出条件满足，退出循环");
}

ksapp.log = function (textLog){
    toastLog(textLog);
}

ksapp.提现 = function (appPlan,f) {
    adenTools.sleepRandom3()
   
    let msg = "";
    toastLog("打开任务中心");
    ksapp.跳转任务中心();
    adenTools.sleepRandom9()
    let objCoin = bluetoothTools.umiocrFindData();
    if (objCoin==null) {
        return 0;
    }
    let numbers = res.ret.filter(function(item) {
        return isFinite(item);
    });
    console.log(numbers);
    if (numbers==null) {
        return 0;
    }
    let newStrw =numbers[1];

    toastLog("开始提现提现..."+newStrw)
    adenTools.sleepRandom3() //是个网页加载的慢
    var lxjBounds = clickAreaForFindImage(lxj_image_array);//领现金
    if (lxjBounds) {
        adenTools.sleepRandom9()
        if(newStrw>30){
            clickMoney(30)
        }else if(newStrw>15){
            clickMoney(15)
        }else if(newStrw>0.5){
            clickMoney(0.5)
        }
    }
    saveStorage.storageInfoData(f,"info","201",null,0,1,"提现",0,appPlan.id,"失败","提现失败")
}



function clickMoney(money){
    if(money == 30){
        ksapp.isPerfectFindOCRCZ("30")//选择金额30
    }else if(money == 15){
        ksapp.isPerfectFindOCRCZ("15");//选择金额15
    }else {
        ksapp.isPerfectFindOCRCZ("0.5");//选择金额0.5
    }
    adenTools.sleepRandom9()
    var ljdhBounds = ksapp.isPerfectFindOCR("立即兑换");
    if (ljdhBounds) {//立即兑换
        adenTools.sleepRandom9();
        var jsdzBounds = ksapp.isPerfectFindOCR("极速到账"); 
        if (jsdzBounds) {
            adenTools.sleepRandom9()
            var ljtxBounds = ksapp.isPerfectFindOCR("立即提现"); 
            if (ljtxBounds) {
                adenTools.sleepRandom9()
                var wcBounds = ksapp.isPerfectFindOCR("完成"); 
                if (wcBounds) {
                    localStorage.put("xianJinNum",money)
                    localStorage.put("xianJin",true);
                    saveStorage.storageInfoData(f,"info","200",null,money,1,"提现",0,app.id,"完成","成功")
                    adenTools.sleepRandom9()
                    ksapp.isPerfectFindOCRCZ("知道了")//选择金额30
                    adenTools.sleepRandom1()
                    bluetoothTools.back()
                }
            }
        }
    } else {
        toastLog("提现金额不够，请下次再来")
        msg = "提现金额不够";
    }
}


//通过ocr精确点击是否成功
ksapp.isPerfectFindOCRCZ = function(word){
    var isFlag = false;
    let bounds = [];
    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrPerfectMatchWord(objData,word);
    ksapp.log("通过ocr查找word："+word+"返回值"+bounds);
    adenTools.sleepRandom1();
    if(bounds.length>0)
    {
        bluetoothTools.click(bounds[0]-20, bounds[1]);
        isFlag = true;
    }
    return isFlag;
}

//通过ocr精准查找是否存在
ksapp.isPerfectFindOCR = function(word){
    ksapp.log("通过ocr查找对象关键字："+word);
    let bounds = [];
    adenTools.sleepRandom1();
    let objData = bluetoothTools.umiocrFindData();
    //ksapp.log("通过ocr查找对象："+objData);
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrPerfectMatchWord(objData,word);
    ksapp.log("通过ocr查找word："+word+"返回值"+bounds);
    return bounds;
}



ksapp.设置金币 = function (info,coin) {
    toastLog("设置金币" + coin);
    let mTime = new Date();
    // 定义要更新的数据的键 定义规则 业务key_appId_用户id_当前时间
    let key = "ks_bjNum"+info.appId+"_"+info.memberId+"_"+mTime.getDay(); 
    return localStorage.put(key, coin);
},
ksapp.获取首次金币 = function (info) {
    let mTime = new Date();
    // 定义要更新的数据的键 定义规则 业务key_appId_用户id_当前时间
    let key = "ks_bjNum"+info.appId+"_"+info.memberId+"_"+mTime.getDay(); 
    return localStorage.get(key);
},
// TODO 需要调试

ksapp.获取金币 = function () {
    ksapp.log("快手极速版,获取金币");
    ksapp.跳转任务中心();
    adenTools.sleepRandom9()
    let objCoin = bluetoothTools.umiocrFindData();
    let numbers = []; // 初始化一个空数组用于存储数字
    if (objCoin!=null) {
        console.log("成功识别到文字！");
        for (var i = 0; i < objCoin.data.length; i++) {
            if(objCoin.data[i].text){
                if (!isNaN(parseFloat(objCoin.data[i].text))) {
                    numbers.push(parseFloat(objCoin.data[i].text)); // 将数字转换为浮点数后存入数组
                    console.log("文字：", objCoin.data[i].text)
                }
            }
        }
    }else{
        return 0;
    }
    let newCoin =numbers[0];
    toastLog("找到 -- 我的金币" + newCoin)
    return newCoin;
}


function buildADArray (ad_path, ad_number) {
    let ad_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = ad_path + (i) + ".png"
        ad_array.push(ad_full_path)
    }
    return ad_array;
}


/**
 * 找图，找到并点击
 * @param {可以是数组也可以是字符串，传输数组可以多次找图知道找到为止} img_path_array 
 * @param {找图区域，默认是全屏找图，该参数可以不传输} area_region 
 * @param {相似度，默认是0.8，可以不传输} threshold 
 * @returns true表示执行成功Flase表示失败
 */
function clickAreaForFindImage(img_path_array, area_region, threshold, is_continue) {
    try {
        toastLog("找图0")
        area_region = area_region || [0, 0, w, h] //默认的找图区域 全屏找图 前2位是坐标 后面是长度和宽度   千万别理解成是坐标
        threshold = threshold || 0.5 // 默认的相识度0.8
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
                toastLog("分辨率："+w+"*"+h+"，巡查关闭弹框")
                var find_result_bounds = findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                if (find_result_bounds) {
                    toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                    bluetoothTools.click(find_result_bounds.x, find_result_bounds.y+10)
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
                bluetoothTools.click(find_result_bounds.x, find_result_bounds.y)
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




/**
 * 找图，找到并点击
 * @param {可以是数组也可以是字符串，传输数组可以多次找图知道找到为止} img_path_array 
 * @param {找图区域，默认是全屏找图，该参数可以不传输} area_region 
 * @param {相似度，默认是0.8，可以不传输} threshold 
 * @returns true表示执行成功Flase表示失败
 */
function clickAreaForFindImageBounds(img_path_array, area_region, threshold, is_continue) {
    try {
        toastLog("找图0")
        area_region = area_region || [0, 0, w, h] //默认的找图区域 全屏找图 前2位是坐标 后面是长度和宽度   千万别理解成是坐标
        threshold = threshold || 0.8 // 默认的相识度0.8
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
                toastLog("分辨率："+w+"*"+h+"，巡查关闭弹框")
                var find_result_bounds = findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                if (find_result_bounds) {
                    // toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                    // click(find_result_bounds.x, find_result_bounds.y)
                    return find_result_bounds
                } else {
                    //toastLog(img_path+"小图存在但是在大图中未找到图片进入下一次循环...")
                }
            }
            return null
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
                return find_result_bounds
               // click(find_result_bounds.x, find_result_bounds.y)
                return find_result_bounds
            } else {
                //toastLog(img_path + "小图存在但是在大图中未找到图片")
                return null
            }
        }
    } catch (error) {
        toastLog("clickAreaForFindImage方法出现错误：" + error)
        return false;
    }
}

// function main (){
//     // function f (){}
//     // log("快手极速版")
//     // app.launchApp("快手极速版");//启动App
//     // adenTools.sleepRandom9();
//    // ksapp.搜索刷视频(app,f); //测试关注和收藏识别不了
//    // ksapp.设置金币(app,ksapp.获取金币()); 测试通过
//    //ksapp.开宝箱(app,f);
//   //ksapp.签到(app,f);
//   //ksapp.预约领金币(app,f);
// }
// //main();

module.exports = ksapp;