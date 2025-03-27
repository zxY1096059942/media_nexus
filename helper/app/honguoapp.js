var hgapp = {};

let adenTools = require('../common/Tools11');
let bluetoothTools = require('../common/ToolsBluetooth');
var ws = require('../common/ws');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
//const { clickAreaForFindImage } = require('../common/Tools11');
let ad_image_array = buildADArray("Image/AD", 18);//关闭按钮定义

const h = device.height || 2340,
    w = device.width || 1080;
setScreenMetrics(w, h);

// if(!requestScreenCapture()){
//     //如果请求失败则终止脚本
//     exit();
// }
// toastLog("w:"+w+"h:"+h)
let stopFlag = false;

hgapp.init = function (appPlan, f) {
    // 安装检测 app 
    // installApp(appPlan);
    this.appId = appPlan.id;
    this.me = appPlan.memberId;
    this.day = appPlan.planKey;
    this.keyPrefix = this.appId + "_" + this.me + "_" + this.day + "_";
    this.fun = f;
    this.curStep = 0;
    this.lastGetCoinTime = 0;
    stopFlag = false;
    adenTools.startApp(appPlan.appName); //启动App
    adenTools.sleepRandom1();//启动App时候等待时间
    //bluetoothTools.closeApp(appPlan);
}

hgapp.setStopFlag = function() {
    stopFlag = true;
}

//统一入口
hgapp.start = function (appPlan,f) {
    hgapp.init(appPlan, f)
    adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
    hgapp.log("红果启动App")
    let sjCount = 0 ;
   // bluetoothTools.closeUpgradetWindows();
   // hgapp.isPerfectFindOCRCZ("首页");

    // hgapp.log("开始设置金币")
    // hgapp.设置金币(appPlan,hgapp.获取金币());
    // adenTools.sleepRandom3();
    // hgapp.log("获取金币结束")

    let mTime = adenTools.getYMD();
    let isSignKey = "hongguoSign_"+appPlan.appId+"_"+appPlan.memberId+"_"+mTime; 
    // let isSign = localStorage.get(isSignKey);
    // if(!isSign){
    //     hgapp.签到(appPlan,f,isSignKey)  // 签到
    // }
   hgapp.签到(appPlan,f,isSignKey)  // 签到

    var sjRunTime = 60*random(100, 118);// 110到130分钟
    let sjStaDate = new Date()
    while(sjCount <= sjRunTime){
        let ydzjbRunTime = 60*random(28, 30);// 35到40分钟
        //let ydzjbRunTime = 60*random(3, 5);// 35到40分钟
        hgapp.阅读赚金币(appPlan,f,ydzjbRunTime);
        if(stopFlag){
            break;
        }
        hgapp.开宝箱(appPlan,f);
        if(stopFlag){
            break;
        }
        hgapp.红包雨(appPlan,f);
        if(stopFlag){
            break;
        }
        let hpEndTime = 60*random(10, 11);// 10到11分钟
        //let hpEndTime = 60*random(3, 5);// 10到11分钟
        hgapp.看短剧赚金币(appPlan,f,hpEndTime);
        if(stopFlag){
            break;
        }
        let sjEndDate = new Date()
        sjCount = adenTools.getTimeDifference(sjStaDate ,sjEndDate);
     }
     hgapp.log("开始获取金币")
     let num =hgapp.获取金币();  //step=100的时候给总控传对象要包括金币数
     //let newCoin =hgapp.获取金币();
     //let num =newCoin - hgapp.获取首次金币(appPlan);
     saveStorage.storageInfoData(f,"info","200",num,null,count,"获取金币",100,appPlan.id,"完成","成功");
     hgapp.log("红果任务结束")
    // bluetoothTools.back();
};





// 签到
hgapp.签到 = function (app, f,isSignKey) {
    //try{
        hgapp.log("红果免费短剧，签到");
        hgapp.直到任务中心点击(1,app);
        var result = false;
        let kspLqcgResult = false;
        let countNum=0;
        var jctcCountNum= 0;
        while(true){
            let bounds = [];
            bounds = hgapp.isPerfectFindOCR("去签到"); //1bu
            if(bounds.length>0){
                bluetoothTools.click(bounds[0], bounds[1]);
                hgapp.log("红果免费短剧-->点击签到");
                adenTools.sleepRandom3();
                kspLqcgResult = true;
                break;
            }
            bluetoothTools.swipe(w / 2, h - 390, w / 2, 0,5,100,10);
            adenTools.sleepRandom3();
            countNum++;
            if(countNum>3){
                hgapp.log("暂无签到");
                break;
            }
        }

        
        if(kspLqcgResult){
        let ljqdBounds = hgapp.isFindOCR("立即签到");
        if(ljqdBounds.length<=0){
            kspLqcgResult = false;
        hgapp.log("红果免费短剧，暂无立即签到按钮");
        }
        bluetoothTools.click(ljqdBounds[0], ljqdBounds[1]);//todo:没有加，如果找到，的判断
        result = true;
        adenTools.sleepRandom3();
        let kspBounds = hgapp.isFindOCR("看视频最高再领");
        if(kspBounds.length<=0){
            hgapp.log("红果免费短剧，暂无看视频最高再领按钮");
            kspLqcgResult = false;
        }else{
            bluetoothTools.click(kspBounds[0], kspBounds[1]);
            while(true){
                adenTools.sleepRandom7();
                let lqcgBounds = hgapp.isPerfectFindOCR("领取成功");
                jctcCountNum ++;
                if(lqcgBounds.length>0){
                    bluetoothTools.click(lqcgBounds[0]+100, lqcgBounds[1]);
                    adenTools.sleepRandom3();
                    hgapp.isOCRCZ("坚持退出");
                    break;
                }else if(jctcCountNum>4){
                    hgapp.log("暂无领取成功");
                    kspLqcgResult = false;
                    break;
                }
            }
        }

        while(!kspLqcgResult){
            clickAreaForFindImage(ad_image_array); //关闭
            adenTools.sleepRandom3();
            hgapp.isOCRCZ("取消");
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

    // } catch (error) {
    //     hgapp.log("红果免费短剧，红包雨方法出现错误：" + error)
    // }
    
}


hgapp.福利页看短剧赚金币点击第一步 = function () {
    var countNum= 0;
    var result = false;
    bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
    while(true){
        if(hgapp.isOCRCZ("看短剧赚金币")||hgapp.isOCRCZ("看短剧赚钱")){
        //if(hgapp.isPerfectFindOCRCZ("看短剧赚金币")||hgapp.isPerfectFindOCRCZ("看短剧赚钱")){    
            result = true;
            hgapp.log("点击红果免费短剧");
            break;
        }
         
        bluetoothTools.swipe(w / 2, h - 390, w / 2, 0,5,100,10);
        adenTools.sleepRandom3();
        countNum++;
        if(countNum>3){
            hgapp.log("暂无看短剧赚金币");
            break;
        }
    }
    return result;
}

hgapp.看短剧赚金币取金币第二步 = function () {
    var jctcCountNum= 0;
    var result = false;
    let kspzlClicksFlag = hgapp.isOCRCZ("看视频再领");
    hgapp.log("看短剧赚金币，看视频再领是否存在:"+kspzlClicksFlag);
    if(kspzlClicksFlag){  //判断“看视频最高再领”，如果是true说明是领取金币， 否则就是看剧
        while(true){
            adenTools.sleepRandom9();
            let lqcgBounds = hgapp.isPerfectFindOCR("领取成功");
            if(lqcgBounds.length>0){
                bluetoothTools.click(lqcgBounds[0]+100, lqcgBounds[1]);
                adenTools.sleepRandom3();
                hgapp.isOCRCZ("坚持退出");
                result = true;
                break;
            }
            if(jctcCountNum>3){
                bluetoothTools.back();
                break;
            }
            adenTools.sleepRandom1();
            jctcCountNum++;
        }
    }
    return result;
}

hgapp.看短剧赚金币看短剧第三步 = function (hpEndTime) {
    var result = false;
    if(hgapp.isPerfectFindOCRCZ("剧场")){ //如果有福利说明是有二级页面的，需要随机点一个短剧
        hgapp.log("点击一个视频");
        let homeBounds = hgapp.isPerfectFindOCR("首页")
        bluetoothTools.click(homeBounds[0], homeBounds[1]-300);
    }
    result = true;
    sleep(hpEndTime*1000);//60*10*1000
    bluetoothTools.back();
    bluetoothTools.closeUpgradetWindows();
    return result;
  
}

// 看短剧赚金币总方法
hgapp.看短剧赚金币 = function (app, f,hpEndTime) {
    //try{
        var result = false;
        hgapp.log("红果免费短剧,阅读赚金币");
        hgapp.直到任务中心点击(1,app);
        if(hgapp.福利页看短剧赚金币点击第一步()){
            while(true){
                if(hgapp.看短剧赚金币取金币第二步()){
                hgapp.福利页看短剧赚金币点击第一步()
                }else{
                    break;
                }
            }
            hgapp.看短剧赚金币看短剧第三步(hpEndTime)
            result = true;
        }
        if(result){
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","200",null,null,111,"红果免费短剧,阅读赚金币",6,app.id,"完成","成功")
        }else{
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","201",null,null,null,"红果免费短剧,阅读赚金币",6,app.id,"失败","失败")
        }
    // } catch (error) {
    //     hgapp.log("红果免费短剧，看短剧赚金币方法出现错误：" + error)
    // }

}



// 看视屏赚海量金币
hgapp.看视屏赚海量金币 = function (app, f) {
        var runTime = 1000*60 * 1;
        let result = false;
        let kspzhljbClicksFlag = false;
        hgapp.log("红果免费短剧，看视屏赚海量金币");
        hgapp.直到任务中心点击();
        let count = 0
        while(count <= 60*random(runTime-30, runTime)){
            let lqcgBounds = hgapp.isFindOCR("看视频赚海量金币");
            if(lqcgBounds.length>0){
                bluetoothTools.click(lqcgBounds[0], lqcgBounds[1]);
                hgapp.log("进入看视频赚海量金币");
                result = true;
                kspzhljbClicksFlag = true;
                break;
            }
            bluetoothTools.swipe(w / 2, h - 390, w / 2, 0,5,100,10);
            adenTools.sleepRandom3();
            countNum++;
            if(countNum>3){
                hgapp.log("暂无看视频赚海量金币");
                break;
            }
        }

        if(kspzhljbClicksFlag){  
            while(true){
                adenTools.sleepRandom5();
                let lqcgBounds = hgapp.isPerfectFindOCR("领取成功");
                if(lqcgBounds.length>0){
                    bluetoothTools.click(lqcgBounds[0]+100, lqcgBounds[1]);
                }
                if(jctcCountNum>3){
                    hgapp.isPerfectFindOCRCZ("坚持退出");
                    clickAreaForFindImage(ad_image_array); //关闭
                    break;
                }
                adenTools.sleepRandom1();
                jctcCountNum++;
            }
        }else{
            bluetoothTools.back();
        }


        if(result){
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","200",0,null,111,"红果免费短剧，看视屏赚海量金币",6,app.id,"完成","成功")
        }else{
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","201",null,null,null,"红果免费短剧，看视屏赚海量金币",6,app.id,"失败","失败")
        }
}
// 红包雨
hgapp.红包雨 = function (app, f) {
    //try{
        hgapp.log("红果免费短剧,红包雨");
        hgapp.直到任务中心点击(1,app);
        let jbhbyClicksFlag = false;
        let result = false;
        var countNum= 0;
        while(true){
           // let jbhbyBounds = hgapp.isPerfectFindOCRCZ("金币红包雨");
            if(hgapp.isPerfectFindOCRCZ("金币红包雨")){
               // bluetoothTools.click(jbhbyBounds[0], jbhbyBounds[1]);
                hgapp.log("进入金币红包雨");
                result = true;
                jbhbyClicksFlag = true;
                break;
            }
            bluetoothTools.swipe(w / 2, h - 390, w / 2, 0,5,100,10);
            adenTools.sleepRandom3();
            countNum++;
            if(countNum>6){
                hgapp.log("暂无金币红包雨");
                break;
            }
            // let shzlBounds = hgapp.isFindOCR("稍后再领");
            // if(shzlBounds.length>0){
            //     break;
            // }
        }
        if(jbhbyClicksFlag){
            hgapp.log("红果免费短剧，红包雨，点击金币红包雨");
            result = true;
            adenTools.sleepRandom3()
            let x = 150, y = 300;
            let stepx = 50, stepy = 50;
            let width = 500, height = 800;
            let xj = x + Math.round(Math.random(10))
            let yj = y + Math.round(Math.random(15))
            let cc = 0;
            while (cc < 1) {
                while (yj < height) {
                    while (xj < width) {
                        xj = xj + stepx
                        bluetoothTools.click(xj, yj)
                    }
                    yj = yj + stepy;
                    xj = x + Math.round(Math.random(20))
                    adenTools.sleepRandom1()
                }
                cc = cc + 1
                yj = y + Math.round(Math.random(15))
                xj = x + Math.round(Math.random(10))
                adenTools.sleepRandom1()
            }
            adenTools.sleepRandom3();
            if(!hgapp.isPerfectFindOCRCZ("返回福利页")){
                let kspBounds =  hgapp.isFindOCR("看视频翻倍领取");
                if (kspBounds.length>0) {
                    bluetoothTools.click(kspBounds[0], kspBounds[1]);
                    hgapp.log("红果免费短剧，点击看视频翻倍领取");
                    var jctcCountNum = 0;
                    while(true){
                        adenTools.sleepRandom9();
                        let lqcgBounds = hgapp.isPerfectFindOCR("领取成功");
                        if(lqcgBounds.length>0){
                            hgapp.log("红果免费短剧红包雨广告，领取成功");
                            bluetoothTools.click(lqcgBounds[0]+100, lqcgBounds[1]);
                            adenTools.sleepRandom1();
                            hgapp.log("红果免费短剧红包雨广告，坚持退出");
                            hgapp.isOCRCZ("坚持退出");
                            break;
                        }
                        if(jctcCountNum>5){
                            let lqcgBounds = hgapp.isFindOCR("领取成功");
                            bluetoothTools.back();
                            clickAreaForFindImage(ad_image_array); //关闭
                            break;
                        }
                        jctcCountNum++;
                    }
                } 
    
            }
            
        }
        if(result){
           // localStorage.put("hongguoSign",true)
            let num = 0;//getNum(lodNum);
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","200",0,null,1,"红果免费短剧，红包雨",6,app.id,"完成","成功")
        }else{
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","201",null,null,null,"红果免费短剧，红包雨",6,app.id,"失败","红果免费短剧，红包雨失败")
        }
    // } catch (error) {
    //     hgapp.log("红果免费短剧，红包雨方法出现错误：" + error)
    // }
    
}

//阅读赚金币第一步
hgapp.福利页阅读赚金币查找第一步 = function () {
    var result = false;
    var countNum= 0;
    bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
    while(true){
        if(hgapp.isOCRCZ("阅读赚金币") || hgapp.isOCRCZ("阅读赚钱")){
        //if(hgapp.isPerfectFindOCRCZ("阅读赚金币") || hgapp.isPerfectFindOCRCZ("阅读赚钱")){    
            result = true;
            hgapp.log("点击阅读赚金币");
            break;
        }
        bluetoothTools.swipe(w / 2, h - 390, w / 2, 0,5,100,10);
        adenTools.sleepRandom3();
        countNum++;
        if(countNum>3){
            hgapp.log("暂无阅读赚金币");
            break;
        }
    }
    return result;
}

//阅读赚金币第二步
hgapp.阅读赚金币领取金币第二步 = function () {
    var jctcCountNum= 0;
    var result = false;
    let kspzlClicksFlag = hgapp.isOCRCZ("看视频最高再领");
    hgapp.log("看视频最高再领:"+kspzlClicksFlag);
    if(kspzlClicksFlag){  //判断“看视频最高再领”，如果是true说明是领取金币， 否则就是看剧
        while(true){
            adenTools.sleepRandom9();
            let lqcgBounds = hgapp.isPerfectFindOCR("领取成功");
            if(lqcgBounds.length>0){
                bluetoothTools.click(lqcgBounds[0]+100, lqcgBounds[1]);
                adenTools.sleepRandom3();
                hgapp.isOCRCZ("坚持退出");
                result = true;
                break;
            }
            if(jctcCountNum>3){
                bluetoothTools.back();
                break;
            }
            adenTools.sleepRandom1();
            jctcCountNum++;
        }
    }
    return result;
}
//阅读赚金币第三步
hgapp.阅读赚金币看小说第三步 = function (ydzjbRunTime) {
    var result = false;
    var staDate = new Date();
    let hpStarTime = 0;// 滑屏开始时间
    hgapp.isPerfectFindOCRCZ("小说");
    adenTools.sleepRandom5();
    // 随便点击一本书
    hgapp.log("点击一本书");
    let boubings = hgapp.isPerfectFindOCR(random(2,4))
    if(boubings.length>0){
        if(boubings[0]>272) {
            bluetoothTools.click(boubings[0],boubings[1]);
        }else{
            bluetoothTools.click(272,1068.5);
        }
    }else{
        bluetoothTools.click(272,1068.5);
    }
    
    while(hpStarTime < ydzjbRunTime){ // 十分钟
        adenTools.sleepRandom3();
        var endDate = new Date();
        hpStarTime = adenTools.getTimeDifference(staDate,endDate)
        //bluetoothTools.click(1000,random(2000,random(1068,1268)));
        bluetoothTools.randomSwipe(w, h, "右", 50, 100)
        result = true;
    }
    bluetoothTools.back();
    adenTools.sleepRandom3()
    hgapp.isOCRCZ("暂不加入");
    clickAreaForFindImage(ad_image_array); //关闭
    bluetoothTools.back();
    return result;

}

//阅读赚金币主方法
hgapp.阅读赚金币 = function (app, f,ydzjbRunTime) {
   // try{
        var result = false;
        hgapp.log("红果免费短剧,阅读赚金币");
        hgapp.直到任务中心点击(1,app);
        if(hgapp.福利页阅读赚金币查找第一步()){
            while(true){
                if(hgapp.阅读赚金币领取金币第二步()){
                hgapp.福利页阅读赚金币查找第一步()
                }else{
                    break;
                }
            }
            hgapp.阅读赚金币看小说第三步(ydzjbRunTime)
            result = true;
        }
        if(result){
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","200",null,null,111,"红果免费短剧,阅读赚金币",6,app.id,"完成","成功")
        }else{
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","201",null,null,null,"红果免费短剧,阅读赚金币",6,app.id,"失败","失败")
        }

    // } catch (error) {
    //     hgapp.log("红果免费短剧，阅读赚金币方法出现错误：" + error)
    // }
    

}


//开宝箱得金币
hgapp.开宝箱 = function (app, f) {
    //try{
        hgapp.log("红果免费短剧,开宝箱");
        hgapp.直到任务中心点击(1,app);
        var result = false;
        var countNum= 0;
        var jctcCountNum= 0;
        while(true){
            if(hgapp.isOCRCZ("点击领") || hgapp.isOCRCZ("开宝箱得金币")){
                result = true;
                hgapp.log("点击开宝箱得金币");
                break;
            }
            bluetoothTools.swipe(w / 2, h - 390, w / 2, 0,5,100,10);
            adenTools.sleepRandom3();
            countNum++;
            if(countNum>3){
                hgapp.log("暂无开宝箱");
                break;
            }
        }
        if(hgapp.开宝箱查去看广告得最高()){
            while(true){
                adenTools.sleepRandom9();
                let lqcgBounds = hgapp.isPerfectFindOCR("领取成功");
                if(lqcgBounds.length>0){
                    bluetoothTools.click(lqcgBounds[0]+100, lqcgBounds[1]);
                    adenTools.sleepRandom3();
                    hgapp.isOCRCZ("坚持退出");
                    // if(!hgapp.isOCRCZ("放弃奖励")){
                    //     hgapp.isOCRCZ("坚持退出");
                    // }
                    break;
                }
                if(jctcCountNum>3){
                    bluetoothTools.back();
                    clickAreaForFindImage(ad_image_array); //关闭
                    break;
                }
                adenTools.sleepRandom1();
                jctcCountNum++;
            }

        }else{
            clickAreaForFindImage(ad_image_array); //关闭
        }
        
        if(result){
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","200",0,null,111,"开宝箱",6,app.id,"完成","成功")
        }else{
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","201",null,null,null,"开宝箱",6,app.id,"失败","失败")
        }
    // } catch (error) {
    //     hgapp.log("红果免费短剧，开宝箱方法出现错误：" + error)
    // }
}

hgapp.开宝箱查去看广告得最高 = function () {
    var countQkgNum= 0;
    var qkggFlag =false;
    while(countQkgNum<3){
        if(hgapp.isOCRCZ("看视频最高再领")){
            hgapp.log("点击看视频最高再领");
            qkggFlag = true;
            break;
        }
        countQkgNum++;
     }
     return qkggFlag;
}

hgapp.设置金币 = function (appPlan,coin) {
    hgapp.log("设置金币" + coin);
    let mTime = new Date();
    // 定义要更新的数据的键 定义规则 业务key_appId_用户id_当前时间
    let key = "hg_bjNum"+appPlan.appId+"_"+appPlan.memberId+"_"+mTime.getDay(); 
    hgapp.log("设置金币key" + key);
    return localStorage.put(key, coin);
},

hgapp.获取首次金币 = function (appPlan) {
    let mTime = adenTools.getYMD();
    // 定义要更新的数据的键 定义规则 业务key_appId_用户id_当前时间
    let key = "hg_bjNum"+appPlan.appId+"_"+appPlan.memberId+"_"+mTime; 
    hgapp.log("设置金获取首次金币币key" + key);
    return localStorage.get(key);
},

hgapp.获取金币 = function(){
    hgapp.log("【获取金币数量】")
    hgapp.直到任务中心点击(1);
    adenTools.sleepRandom3()
    let objCoin = bluetoothTools.umiocrFindData();
    let numbers = []; // 初始化一个空数组用于存储数字
    if (objCoin!=null) {
        console.log("成功识别到文字！");
        for (var i = 0; i < objCoin.data.length; i++) {
            if(objCoin.data[i].text){
                if (!isNaN(parseFloat(objCoin.data[i].text))) {
                    numbers.push(parseFloat(objCoin.data[i].text)); // 将数字转换为浮点数后存入数组
                    hgapp.log("文字：", objCoin.data[i].text)
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
hgapp.获取现金收益 = function() {
    hgapp.log("获取现金收益")
    adenTools.sleepRandom3()
    let mycoin = textStartsWith("现金收益(元)").findOne();
    if (mycoin) {
        let boundsLeft = mycoin.bounds().left;
        let arry = mycoin.parent().children();
        let coin = 0;
        let i = 0;
        while (i <= 100) {
            if (arry[i].bounds().left == boundsLeft) {
                if (arry[i].text() && isFinite(arry[i].text())) {
                    hgapp.log("i----=" + i + "----------" + arry[i].text() + "------------" + arry[i].bounds() + "------left-----" + arry[i].bounds().left)
                    coin = arry[i].text();
                    break;
                }
            }
            i++;
        }
        hgapp.log("找到 -- 我的现金" + coin)
        return coin;
    } else {
        hgapp.log("未找到 -- 我的现金")
    }
    return 0;
}
function 关闭弹窗(){
    let object = className("com.lynx.tasm.behavior.ui.LynxFlattenUI").depth(11).drawingOrder(1).indexInParent(111).findOne(2000);
    if (object) {
        var x = object.bounds().centerX();
        var y = object.bounds().centerY();
        click(x, y);
        log("关闭弹窗11  x  ===" + x + ";;;;;y====" + y)
        // exit();
    }

    let object11 = id("com.phoenix.read:id/f").findOne(2000);
    if (object11) {
        var x = object11.bounds().centerX();
        var y = object11.bounds().centerY();
        click(x, y);
        log("关闭弹窗22 x  ===" + x + ";;;;;y====" + y)
        // exit();
    }
}
hgapp.提现 = function (appPlan,f) {
    adenTools.sleepRandom3()
    let msg = "";
    toastLog("直到任务中心点击");
    ksapp.直到任务中心点击();
    adenTools.sleepRandom3()
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
};

function clickMoney(money){
    if(money == 30){
       hgapp.isPerfectFindOCRCZ("30")//选择金额30
    }else if(money == 15){
        hgapp.isPerfectFindOCRCZ("15");//选择金额15
    }else {
        hgapp.isPerfectFindOCRCZ("0.5");//选择金额0.5
    }
    adenTools.sleepRandom9()
    var ljdhBounds = hgapp.isPerfectFindOCR("立即兑换");
    if (ljdhBounds) {//立即兑换
        adenTools.sleepRandom9();
        var jsdzBounds = hgapp.isPerfectFindOCR("极速到账"); 
        if (jsdzBounds) {
            adenTools.sleepRandom9()
            var ljtxBounds = hgapp.isPerfectFindOCR("立即提现"); 
            if (ljtxBounds) {
                adenTools.sleepRandom9()
                var wcBounds = hgapp.isPerfectFindOCR("完成"); 
                if (wcBounds) {
                    localStorage.put("xianJinNum",money)
                    localStorage.put("xianJin",true);
                    saveStorage.storageInfoData(f,"info","200",null,money,1,"提现",0,app.id,"完成","成功")
                    adenTools.sleepRandom9()
                    hgapp.isPerfectFindOCRCZ("知道了")//选择金额30
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

hgapp.直到任务中心点击 = function (step,app) {
        var flag = false;
        let countNum = 0;
        if(step==1){
            let bounds = [];
            hgapp.log("通过ocr查找word：福利");
            bounds = hgapp.isPerfectFindOCR("福利");
            log("通过ocr查找word:福利" + "返回值" + bounds);
            if(bounds.length>0){
                flag = true;
                bluetoothTools.click(bounds[0], bounds[1]);
                bluetoothTools.click(666.5, 2176.5);
                adenTools.sleepRandom1();
                clickAreaForFindImage(ad_image_array);
            }else{
                throw new Error("没有找到福利页，结束任务")
            }
        }
        
        hgapp.log("红果免费短剧进入福利页面");
        clickAreaForFindImage(ad_image_array);
        while(countNum<3){
            bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
            //adenTools.sleepRandom1();
            countNum++;
        }
        // if(!flag){
        //     hgapp.log("红果没有找到福利页，结束任务");
            
            // let boundsFlagArray = hgapp.isPerfectFindOCR("福利");
            // while (boundsFlagArray.length<=0) {
            //     clickAreaForFindImage(ad_image_array);
            //     bluetoothTools.back();//直到返回首页
            //     bluetoothTools.closeUpgradetWindows();
            //     let newBoundsFlagArray = hgapp.isPerfectFindOCR("福利");
            //     if(newBoundsFlagArray.length>0){
            //         bluetoothTools.click(newBoundsFlagArray[0], newBoundsFlagArray[1]);
            //         bluetoothTools.click(665, 2176.5);
            //         break;
            //     }else{
            //         bluetoothTools.closeApp(app);
            //     }
            // }
        //} 
}



hgapp.跳转首页 = function () {
    toastLog("红果免费短剧点击首页");
    var flag = false;
    let num = 0;
    while (true) {
        let bounds = [];
        bounds = hgapp.isPerfectFindOCR("首页");
        if(bounds.length>0){
            flag = true;
        }
        // 定义需要点击的元素
        if (flag) {
            bluetoothTools.click(bounds[0], bounds[1]);
            toastLog("红果免费短剧点击首页成功");
            adenTools.sleepRandom1();
            break;
        }
        if(num>3){
            break;
        }
        num ++;
        adenTools.sleepRandom1();
        console.log("为找到去首页，无法进入首页 第" + num  +"次！！！！！！！") ;
    }
     console.log("循环退出条件满足，退出循环");
}

//通过ocr精确点击是否成功
hgapp.isPerfectFindOCRCZ = function(word){
    var isFlag = false;
    let bounds = [];

    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrPerfectMatchWord(objData,word);
    hgapp.log("通过ocr查找word："+word+"返回值"+bounds);
    adenTools.sleepRandom1();
    if(bounds.length>0)
    {
        bluetoothTools.click(bounds[0]-20, bounds[1]);
        isFlag = true;
    }
    return isFlag;
}

//通过ocr点击是否成功
hgapp.isOCRCZ = function(word){
    var isFlag = false;
    let bounds = [];
    adenTools.sleepRandom3();
    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrClickWordBounds(objData,word);
    hgapp.log("通过ocr查找word："+word+"返回值"+bounds);
    adenTools.sleepRandom1();
    if(bounds.length>0)
    {
        bluetoothTools.click(bounds[0], bounds[1]);
        isFlag = true;
    }
    return isFlag;
}

//通过ocr查找是否存在
hgapp.isFindOCR = function(word){
    hgapp.log("通过ocr查找对象关键字："+word);
    let bounds = [];
    adenTools.sleepRandom1();
    let objData = bluetoothTools.umiocrFindData();
   // hgapp.log("通过ocr查找对象："+objData);
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrClickWordBounds(objData,word);
    hgapp.log("通过ocr查找word："+word+"返回值"+bounds);
    return bounds;
}

//通过ocr精准查找是否存在
hgapp.isPerfectFindOCR = function(word){
    hgapp.log("通过ocr查找对象关键字："+word);
    let bounds = [];
    adenTools.sleepRandom1();
    let objData = bluetoothTools.umiocrFindData();
    //hgapp.log("通过ocr查找对象："+objData);
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrPerfectMatchWord(objData,word);
    hgapp.log("通过ocr查找word："+word+"返回值"+bounds);
    return bounds;
}






hgapp.log = function (text){
    toastLog(text);
}
function isNumeric(value) {
    return isFinite(value);
}



//  function main(){
//     hgapp.提现(app, f)
// }

// main();


function buildADArray (ad_path, ad_number) {
    let ad_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = ad_path + "/ad" + (i) + ".png"
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
        area_region = area_region || [0, 0, w, h] //默认的找图区域 全屏找图 前2位是坐标 后面是长度和宽度   千万别理解成是坐标
        threshold = threshold || 0.8 // 默认的相识度0.8
        is_continue = is_continue || false
        if (img_path_array instanceof Array) {
            let arrayLength = img_path_array.length
            for (let i = 0; i < arrayLength; i++) {
                //hgapp.log("正在进行第" + (i + 1) + "次找图...")
                img_path = img_path_array[i] //小图地址可判断是否存在
                if (!files.exists(img_path)) {
                    hgapp.log(img_path + "文件不存在因此跳过")
                    continue
                }
                var little_image = images.read(img_path) //小图
                hgapp.log("分辨率："+w+"*"+h+"，巡查关闭弹框")
                var find_result_bounds = images.findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                if (find_result_bounds) {
                    hgapp.log(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                    bluetoothTools.click(find_result_bounds.x, find_result_bounds.y)
                    return true
                } else {
                    //hgapp.log(img_path+"小图存在但是在大图中未找到图片进入下一次循环...")
                }
            }
            return false
        }
        if (typeof (img_path_array) == "string") {
            img_path = img_path_array//小图地址可判断是否存在
            if (!files.exists(img_path)) {
                hgapp.log(img_path + "文件不存在因此跳过")
                return false
            }
            var little_image = images.read(img_path) //小图
            var find_result_bounds = images.findImage(
                captureScreen(), little_image, {
                region: area_region,
                threshold: threshold
            });
            if (find_result_bounds) {
                hgapp.log(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                bluetoothTools.click(find_result_bounds.x, find_result_bounds.y)
                return true
            } else {
                //hgapp.log(img_path + "小图存在但是在大图中未找到图片")
                return false
            }
        }
    } catch (error) {
        hgapp.log("clickAreaForFindImage方法出现错误：" + error)
        return false;
    }
}


module.exports = hgapp;
