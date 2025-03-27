var wxapp = {};

let adenTools = require('../common/Tools11');
let bluetoothTools = require('../common/ToolsBluetooth');

let ad_image_array = buildADArray("Image/AD", 15);//关闭按钮定义

const h = device.height || 2340,
    w = device.width || 1080;
setScreenMetrics(w, h);

wxapp.init = function (appPlan, f) {
    this.appId = appPlan.id;
    this.me = appPlan.memberId;
    this.day = appPlan.planKey;
    this.keyPrefix = this.appId + "_" + this.me + "_" + this.day + "_";
    this.fun = f;
    this.curStep = 0;
    this.lastGetCoinTime = 0;
    adenTools.startApp(appPlan.appName); //启动App
    adenTools.sleepRandom1();//启动App时候等待时间
}
//统一入口
wxapp.start = function (appPlan,f) {
    wxapp.init(appPlan, f)
    adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
    wxapp.log("微信启动App");
    var word = "互联网的形成之";
    wxapp.刷文章(word);
    wxapp.log("微信任务结束");
}


wxapp.刷文章 = function (word){
    wxapp.跳转发现(1);
    wxapp.log("进入发现");
    wxapp.跳转朋友圈(1);
    wxapp.log("进入朋友圈");
    wxapp.查看文章(word);
    bluetoothTools.back();
}

wxapp.查看文章 = function (word){
    var flag = wxapp.isPerfectFindOCRCZ(word);
    if(flag){
        adenTools.sleepRandom5();
        var sjRunTime = 60*random(30, 55);// 30到55分钟
        let sjStaDate = new Date();
        while(sjCount <= sjRunTime){
            let sjEndDate = new Date()
            sjCount = adenTools.getTimeDifference(sjStaDate ,sjEndDate);
            bluetoothTools.randomSwipe(w, h, "上", 50, 100)
        }
    }else{
        wxapp.log("没有找到"+word);
    }
}

wxapp.跳转发现 = function (step){
    var flag = false;
    let countNum = 0;
    if(step==1){
        let bounds = [];
        wxapp.log("通过ocr查找word：发现");
        bounds = wxapp.isPerfectFindOCR("发现");
        log("通过ocr查找word:发现" + "返回值" + bounds);
        if(bounds.length>0){
            flag = true;
            bluetoothTools.click(bounds[0], bounds[1]);
            adenTools.sleepRandom1();
            clickAreaForFindImage(ad_image_array);
        }else{
            throw new java.lang.RuntimeException("没有找到发现，结束任务")
        }
    }
    
    wxapp.log("微信进入发现页面");
    
    while(countNum<3){
        bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
        countNum++;
    }

}

wxapp.跳转朋友圈 = function (step){
    var flag = false;
    let countNum = 0;
    if(step==1){
        let bounds = [];
        wxapp.log("通过ocr查找word：朋友圈");
        bounds = wxapp.isPerfectFindOCR("朋友圈");
        log("通过ocr查找word:朋友圈" + "返回值" + bounds);
        if(bounds.length>0){
            flag = true;
            bluetoothTools.click(bounds[0], bounds[1]);
            adenTools.sleepRandom1();
            clickAreaForFindImage(ad_image_array);
        }else{
            throw new java.lang.RuntimeException("没有找到朋友圈，结束任务")
        }
    }
    
    wxapp.log("微信进入朋友圈页面");
    
    while(countNum<3){
        bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
        countNum++;
    }

}


//通过ocr精确点击是否成功
wxapp.isPerfectFindOCRCZ = function(word){
    var isFlag = false;
    let bounds = [];
    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrPerfectMatchWord(objData,word);
    wxapp.log("通过ocr查找word："+word+"返回值"+bounds);
    adenTools.sleepRandom1();
    if(bounds.length>0)
    {
        bluetoothTools.click(bounds[0]-20, bounds[1]);
        isFlag = true;
    }
    return isFlag;
}
//通过ocr精准查找是否存在
wxapp.isPerfectFindOCR = function(word){
    wxapp.log("通过ocr查找对象关键字："+word);
    let bounds = [];
    adenTools.sleepRandom1();
    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrPerfectMatchWord(objData,word);
    wxapp.log("通过ocr查找word："+word+"返回值"+bounds);
    return bounds;
}



wxapp.log = function (text){
    toastLog(text);
}