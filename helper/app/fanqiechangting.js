var fqctapp = {};
var adenTools = require('../common/Tools11');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
let bluetoothTools = require('../common/ToolsBluetooth');
var ws = require('../common/ws');
let ad_image_array = buildADArray("Image/AD", 18);//关闭按钮定义
let clickImageStatus = 0;


const h = device.height || 2340,
    w = device.width || 1080;
setScreenMetrics(w, h);
//fqctapp.log("番茄畅听，h:=" + h + ",w:=" + w);
let stopFlag = false;
let mTime = adenTools.getYMD()

fqctapp.setStopFlag = function() {
    stopFlag = true;
}

fqctapp.init = function (appPlan, f) {
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
    adenTools.sleepRandom9();//启动App时候等待时间
}
fqctapp.preHongBaoTime = null;
fqctapp.start = function (appPlan, f) {
    let staDate = new Date();
    fqctapp.log("番茄畅听启动App")
    fqctapp.init(appPlan, f)
    adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
    adenTools.sleepRandom3();
    clickAreaForFindImage(ad_image_array);
    sleep(2000);
    bluetoothTools.closeUpgradetWindows();

    fqctapp.签到(appPlan, f)  // 签到
    fqctapp.看书(appPlan, f, random(17 * 60, 21 * 60));
    let countTime = 0
    while (countTime <= 80 * 60) {
        fqctapp.开宝箱(appPlan, f);
        if(stopFlag){
            break;
        }
        fqctapp.红包雨(appPlan, f);
        if(stopFlag){
            break;
        }
        fqctapp.看短剧(appPlan, f, random(8 * 60, 10 * 60));
        if(stopFlag){
            break;
        }
        let endDate = new Date();
        countTime = adenTools.getTimeDifference(staDate, endDate)
    }
    fqctapp.时长赚金币(app, f);
    fqctapp.阅读赚金币(app, f);


     let num = fqctapp.获取金币();
     saveStorage.storageInfoData(f,"info","200",num,null,count,"番茄畅听.获取金币",10,appPlan.id,"完成","成功");
    fqctapp.log("番茄畅听任务结束")
    bluetoothTools.back();
}

// 签到
fqctapp.签到 = function (app, f) {
    try {
        fqctapp.log("番茄畅听，签到");
        fqctapp.直到任务中心点击(app, 1);
        var result = false;
        let rwLjqdResult = false;
        let countNum = 0;
        adenTools.sleepRandom3();
        clickAreaForFindImage(ad_image_array);
        while (true) {
            let rwLjqdBounds = fqctapp. isFindOCR("立即签到"); //1bu
            if (rwLjqdBounds.length > 0) {
                bluetoothTools.click(rwLjqdBounds[0], rwLjqdBounds[1]);
                // fqctapp.log("红番茄畅听-->点击任务页立即签到");
                adenTools.sleepRandom3();
                rwLjqdResult = true;
                break;
            }
            bluetoothTools.swipe(w / 2, h - 380, w / 2, h / 8 * 3.5, 80, 2000, 1000);
            adenTools.sleepRandom3();
            countNum++;
            if (countNum > 5) {
                fqctapp.log("暂无任务页立即签到");
                break;
            }
        }
        let tcLjqdResult = false;
        if (rwLjqdResult) {
            // adenTools.sleepRandom3();
            let tcLjqdBounds = fqctapp.isFindOCR("立即签到");
            if (tcLjqdBounds.length <= 0) {
                tcLjqdBounds = fqctapp.isFindOCR("从第一天签到");
                if (tcLjqdBounds.length <= 0) {
                    fqctapp.log("番茄畅听，暂无弹窗立即签到按钮");
                    clickAreaForFindImage(ad_image_array);
                    return null;
                }
            }
            bluetoothTools.click(tcLjqdBounds[0], tcLjqdBounds[1]);
            result = true;
            adenTools.sleepRandom1();
            let kspBounds = fqctapp.isFindOCR("看视频再领");
            if (kspBounds.length <= 0) {
                clickAreaForFindImage(ad_image_array);
                fqctapp.log("番茄畅听，暂无看视频再领按钮");
            } else {
                bluetoothTools.click(kspBounds[0], kspBounds[1]);
                tcLjqdResult = true;
            }
        }

        let lqcgResult = false;
        if (tcLjqdResult) {
            lqcgResult = 领取成功();
        } else {
            clickAreaForFindImage(ad_image_array)
            sleep(2000);
            let res = bluetoothTools.umiocrFindData();
            if (bluetoothTools.umiocrClickWordBounds(res, "添加到主屏幕").length > 0) {
                let pos = bluetoothTools.umiocrClickWordBounds(res, "取消")
                if (pos.length > 0) {
                    bluetoothTools.click(pos[0], pos[1]);
                }
            }
        }
        if (lqcgResult) {
            fqctapp.isOCRCZ("退出");
            // adenTools.sleepRandom1();
            // fqctapp.isOCRCZ("退出");
        }
        fqctapp.log("番茄畅听，签到----结束");
        // if(result){
        //     localStorage.put(isSignKey,true)
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","200",null,null,111,"签到",6,app.id,"完成","成功")
        // }else{
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","201",null,null,null,"签到",6,app.id,"失败","失败")
        // }
    } catch (error) {
        fqctapp.log("番茄畅听，签到方法出现错误：" + error)
    }
};

fqctapp.看短剧 = function (app, f, fqctEndTime) {
    try {
        var result = false;
        fqctapp.log("番茄畅听：看短赚金币,时长 fqctEndTime = " + fqctEndTime);
        fqctapp.直到任务中心点击(app, 0);
        if (fqctapp.看短剧赚金币第一步()) {
            while (true) {
                if (fqctapp.看短剧赚金币第二步()) {
                    sleep(2000);
                    fqctapp.看短剧赚金币第一步()
                } else {
                    break;
                }
            }
            fqctapp.看短剧赚金币第三步(fqctEndTime)
            result = true;
        }
        fqctapp.log("番茄畅听：看短赚金币 结束");
        // if(result){
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","200",null,null,111,"番茄畅听：看短赚金币",6,app.id,"完成","成功")
        // }else{
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","201",null,null,null,"番茄畅听：看短赚金币",6,app.id,"失败","失败")
        // }
    } catch (error) {
        fqctapp.log("番茄畅听：看短赚金币方法出现错误：" + error)
    }

}
fqctapp.看短剧赚金币第一步 = function () {
    fqctapp.log("番茄畅听，看短剧赚金币第一步")
    var countNum = 0;
    var result = false;
    // bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
    while (true) {
        if (bluetoothTools.isOCRCZArray(["看短剧赚钱", "去看剧"])) {
            result = true;
            // fqctapp.log("番茄畅听看短剧赚钱");
            break;
        }

        // bluetoothTools.swipe(w / 2, h - 390, w / 2, h/8*3.5,5,80,5);
        bluetoothTools.swipe(w / 2, h * 4.8 / 8, w / 2, h / 8, 50, 2000, 1000);
        adenTools.sleepRandom3();
        countNum++;
        if (countNum > 8) {
            fqctapp.log("暂无番茄畅听看短剧赚金币");
            break;
        }
    }
    return result;
}
fqctapp.看短剧赚金币第二步 = function () {
    fqctapp.log("番茄畅听，看短剧赚金币第二步")
    var jctcCountNum = 0;
    var result = false;
    let isBlack = false;
    clickAreaForFindImage(ad_image_array);
    sleep(2000);//弹窗有时可能还没有出来
    // let kspzlClicksFlag = fqctapp.isOCRArrayCZ(["看视频再得","看视频领"]);
    let kspzlClicksFlag = fqctapp.isOCRArrayCZ([/^看视频再得\d+金币$/, /^看视频领\d+金币$/, /^看视频再得\d+金币/, /^看视频领\d+金币/]);
    fqctapp.log("看短剧赚金币，看视频再领是否存在:" + kspzlClicksFlag);
    if (kspzlClicksFlag) {  //判断“看视频最高再领”，如果是true说明是领取金币， 否则就是看剧
        while (true) {
            adenTools.sleepRandom3();
            let lqcgBounds = fqctapp.isPerfectFindOCR("领取成功");
            if (lqcgBounds.length > 0) {
                bluetoothTools.click(lqcgBounds[0] + 100, lqcgBounds[1]);
                sleep(3000);
                fqctapp.isOCRCZ("退出");
                result = true;
                break;
            }
            if (!isBlack && jctcCountNum > 1) {
                bluetoothTools.back();
                isBlack = true;
                // break;
            }
            if (jctcCountNum > 3) {
                result = true;
                break;
            }
            // adenTools.sleepRandom1();
            jctcCountNum++;
        }
    }
    return result;
}
fqctapp.看短剧赚金币第三步 = function (hpEndTime) {
    fqctapp.log("番茄畅听，看短剧赚金币第三步")
    var result = false;
    if (fqctapp.isPerfectFindOCR("短剧").length > 0) {
        // 随机点击一个视频
        bluetoothTools.click(w / 5 * 2, h / 5 * 3);
    }

    result = true;
    fqctapp.log("番茄畅听，看短剧睡眠开始")
    // sleep(60 * 1000);//60*10*1000
    sleep(hpEndTime * 1000);//60*10*1000
    fqctapp.log("番茄畅听，看短剧睡眠结束")
    clickAreaForFindImage(ad_image_array);
    bluetoothTools.back();
    // bluetoothTools.closeUpgradetWindows();
    return result;

}
fqctapp.开宝箱 = function (app, f) {
    try {
        fqctapp.log("番茄畅听，开宝箱");
        let result = false;
        fqctapp.直到任务中心点击(app, 1);
        let kbxBounds = fqctapp.isFindOCR开宝箱();
        if (kbxBounds <= 0) {
            kbxBounds = fqctapp.isFindOCR("开宝箱得金币");
            if (kbxBounds <= 0) {
                fqctapp.log("番茄畅听，未找到宝箱");
                return false;
            }
        }
        bluetoothTools.click(kbxBounds[0], kbxBounds[1]);
        fqctapp.log("番茄畅听-->点击开宝箱");
        adenTools.sleepRandom3();
        result = true;
        let kspResult = cycleClick("看视频再得");

        let lqcgResult = false;
        if (kspResult) {
            lqcgResult = 领取成功();
            adenTools.sleepRandom1();
            // fqctapp.isOCRCZ("直接退出");
            // adenTools.sleepRandom1();
            fqctapp.isOCRCZ("退出");
        }
        // if(!lqcgResult){
        //     cycleClick("直接退出")
        // }
        adenTools.sleepRandom3();
        fqctapp.log("番茄畅听，开宝箱---结束");
        // if(result){
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","200",null,null,111,"番茄畅听，开宝箱",6,app.id,"完成","成功")
        // }else{
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","201",null,null,null,"番茄畅听，开宝箱",6,app.id,"失败","失败")
        // }
    } catch (error) {
        fqctapp.log("番茄畅听，开宝箱方法出现错误：" + error)
    }

}
fqctapp.红包雨 = function (app, f) {
    if (fqctapp.preHongBaoTime
        && adenTools.getTimeDifference(fqctapp.preHongBaoTime, new Date()) < 20 * 60) {
        log("距离上一场红包雨任务结束还不到1小时...");
        return;
    }
    try {
        fqctapp.log("番茄畅听，红包雨");
        fqctapp.直到任务中心点击(app, 0);
        var result = false;
        let countNum = 0;
        let lhbResult = false
        while (true) {
            let lhbBounds = fqctapp.isFindOCR("金币红包雨");
            if (lhbBounds.length > 0) {
                bluetoothTools.click(lhbBounds[0], lhbBounds[1]);
                fqctapp.log("番茄畅听-->红包雨，领红包");
                adenTools.sleepRandom3();
                lhbResult = true;
                break;
            }
            bluetoothTools.swipe(w / 2, h - 330, w / 2, h / 8 * 2, 80, 2000, 1000);
            adenTools.sleepRandom3();
            countNum++;
            if (countNum > 8) {
                fqctapp.log("番茄畅听-->暂无红包雨，领红包，countNum = " + countNum);
                break;
            }
        }

        let kspResult = false;
        if (lhbResult) {
            let x = 150, y = 300;
            let stepx = 50, stepy = 50;
            let width = 500, height = 800;
            let xj = x + Math.round(Math.random(10))
            let yj = y + Math.round(Math.random(15))
            let cc = 0;
            // 随机点击
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
            result = true;
            fqctapp.preHongBaoTime = new Date();
            adenTools.sleepRandom3();
            kspResult = cycleClick("看视频翻倍领取");
        }

        let lqcgResult = false;
        if (kspResult) {
            lqcgResult = 领取成功();
            adenTools.sleepRandom3();
            fqctapp.isOCRCZ("退出");

        }

        if (!lqcgResult) {
            fqctapp.isOCRCZ("返回福利页");
        }

        fqctapp.log("番茄畅听，红包雨---结束");
        // if(result){
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","200",null,null,111,"番茄畅听，红包雨",6,app.id,"完成","成功")
        // }else{
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","201",null,null,null,"番茄畅听，红包雨",6,app.id,"失败","失败")
        // }
    } catch (error) {
        fqctapp.log("番茄畅听，红包雨方法出现错误：" + error)
    }

}
fqctapp.翻卡片 = function (app, f) {
    fqctapp.log("番茄畅听，翻卡片");
    fqctapp.直到任务中心点击(app, 1);

    while (true) {
        let fkBounds = [];
        for (var i = 1; i < 8; i++) {
            fkBounds = fqctapp.isFindOCR("翻卡赢金币");
            if (fkBounds.length > 0) {
                break;
            }
            bluetoothTools.swipe(w / 2, (h / 8) * 6, w / 2, h / 8 * 3.5, 10, 1000, 100);//往上滑
            adenTools.sleepRandom1();
        }


        if (fkBounds.length <= 0) {
            fqctapp.log("番茄畅听，翻卡片,未找到翻卡任务");
            break;
        }
        // 点击翻卡任务
        bluetoothTools.click(fkBounds[0], fkBounds[1]);
        adenTools.sleepRandom3();

        let kxsxBounds = fqctapp.isFindOCR("开心收下");
        if (kxsxBounds.length > 0) {
            bluetoothTools.click(kxsxBounds[0], kxsxBounds[1]);
            fqctapp.log("番茄畅听，翻卡片,点击开心收下");
            break;
        }

        let jxfBounds = fqctapp.isFindOCR("看视频继续翻");
        if (jxfBounds.length < 0) {
            fqctapp.log("番茄畅听，翻卡片,翻卡任务结束");
            break;
        }
        // 点击翻卡任务弹窗
        bluetoothTools.click(jxfBounds[0], jxfBounds[1]);
        领取成功();
    }
}
fqctapp.看书 = function (app, f, time) {
    try {
        fqctapp.log("红番茄畅听,看书任务,看书时长 = " + time);
        clickAreaForFindImage(ad_image_array)
        let syResut = fqctapp.首页();
        if (!syResut) {
            fqctapp.log("红番茄畅听,未找到首页，不执行任务");
            return null;
        }
        let ksBounds = [];
        for (let index = 0; index < 5; index++) {
            ksBounds = fqctapp.isFindOCR("看书");
            if (ksBounds.length > 0) {
                break;
            }
            bluetoothTools.swipe(w / 5 * 4, h / 1000 * 118.5, w / 5, h / 1000 * 118.5, 10, 1000, 100);
        }
        if (ksBounds.length < 0) {
            fqctapp.log("红番茄畅听,未找到看书按钮，不执行任务");
            return null;
        }
        fqctapp.log("看书 x = " + ksBounds[0] + ",看书Y = " + ksBounds[1]);

        bluetoothTools.click(ksBounds[0], ksBounds[1]);
        adenTools.sleepRandom1();
        // 随机点一本
        bluetoothTools.click(w / 2, h / 2);
        fqctapp.log("随机点击一本 x = " + w / 2 + ",看书Y = " + h / 2);
        let countTime = 0
        let staDate = new Date();
        while (countTime <= time) {
            // while (countTime <= 60) {
            bluetoothTools.swipe(w / 5 * 4, h / 2, w / 5, h / 2, 5, 100, 10);
            adenTools.sleepRandom3()
            let endDate = new Date();
            countTime = adenTools.getTimeDifference(staDate, endDate)
            fqctapp.log("countTime = " + countTime)
        }
        bluetoothTools.back();
        sleep(2000);
        //退出书架
        bluetoothTools.closeUpgradetWindows();
        sleep(2000);
        let res = bluetoothTools.umiocrFindData();
        if (bluetoothTools.umiocrClickWordBounds(res, "继续看本书").length > 0) {
            let pos = bluetoothTools.umiocrClickWordBounds(res, "我知道了")
            if (pos.length > 0) {
                bluetoothTools.click(pos[0], pos[1]);
            }
        }
        fqctapp.log("红番茄畅听,看书任务-----结束");
    } catch (error) {
        fqctapp.log("番茄畅听，看书方法出现错误：" + error)
    }

}
fqctapp.阅读赚金币 = function () {
    try {
        var result = false;
        fqctapp.log("番茄畅听,阅读赚金币");
        fqctapp.直到任务中心点击(app, 0);
        if (fqctapp.阅读赚金币第一步()) {
            while (true) {
                if (fqctapp.阅读赚金币第二步()) {
                    sleep(2000);
                    fqctapp.阅读赚金币第一步()
                } else {
                    break;
                }
            }
            bluetoothTools.back();
            adenTools.sleepRandom3()
            clickAreaForFindImage(ad_image_array); //关闭
            result = true;
        }
        // if(result){
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","200",null,null,111,"番茄畅听,时长赚金币",6,app.id,"完成","成功")
        // }else{
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","201",null,null,null,"番茄畅听,时长赚金币",6,app.id,"失败","失败")
        // }

    } catch (error) {
        fqctapp.log("番茄畅听,阅读赚金币金币方法出现错误：" + error)
    }
}
fqctapp.阅读赚金币第一步 = function () {
    fqctapp.log("番茄畅听,阅读赚金币,第一步");
    var result = false;
    var countNum = 0;
    // bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
    while (true) {
        if (fqctapp.isOCRCZ("阅读赚金币")) {
            result = true;
            // fqctapp.log("点击阅读赚金币");
            break;
        }
        if (!result) {
            bluetoothTools.swipe(w / 2, h - 390, w / 2, h / 8 * 3.5, 80, 2000, 1000);
            adenTools.sleepRandom3();
            countNum++;
            if (countNum > 8) {
                fqctapp.log("暂无阅读赚金币赚金币");
                break;
            }
        }
    }
    return result;
}
fqctapp.阅读赚金币第二步 = function () {
    fqctapp.log("番茄畅听,阅读赚金币,第二步");
    var jctcCountNum = 0;
    var result = false;
    let isBlack = false;
    sleep(2000);
    fqctapp.isOCRCZ("立即领奖"); //出现就执行一下
    sleep(3000);
    // let kspzlClicksFlag = fqctapp.isOCRArrayCZ(["看视频再得","看视频领"]);
    let kspzlClicksFlag = fqctapp.isOCRArrayCZ([/^看视频再得\d+金币$/, /^看视频领\d+金币$/, /^看视频再得\d+金币/, /^看视频领\d+金币/]);
    fqctapp.log("看视频最高再领:" + kspzlClicksFlag);
    if (kspzlClicksFlag) {  //判断“看视频最高再领”，如果是true说明是领取金币， 否则就是看剧
        while (true) {
            adenTools.sleepRandom3();
            let lqcgBounds = fqctapp.isFindOCR("领取成功");
            if (lqcgBounds.length > 0) {
                bluetoothTools.click(lqcgBounds[0] + 100, lqcgBounds[1]);
                sleep(3000);
                fqctapp.isOCRCZ("坚持退出");
                result = true;
                break;
            }
            if (!isBlack && jctcCountNum > 1) {//退出直播间
                bluetoothTools.back();
                isBlack = true;
                // break;
            }
            if (jctcCountNum > 3) {
                result = true;
                break;
            }
            adenTools.sleepRandom1();
            jctcCountNum++;
        }
    } else {
        bluetoothTools.back();
    }
    return result;
}
//时长赚金币主方法
fqctapp.时长赚金币 = function (app, f, fqctEndTime) {
    try {
        var result = false;
        fqctapp.log("番茄畅听,时长赚金币");
        fqctapp.直到任务中心点击(app, 1);
        if (fqctapp.领现金页阅时长赚金币查找第一步()) {
            while (true) {
                if (fqctapp.领现金页阅时长赚金币查找第二步()) {
                    sleep(2000);
                    fqctapp.领现金页阅时长赚金币查找第一步()
                } else {
                    break;
                }
            }
            //fqctapp.领现金页阅时长赚金币查找第三步(fqctEndTime)
            bluetoothTools.back();
            adenTools.sleepRandom3()
            clickAreaForFindImage(ad_image_array); //关闭
            result = true;
        }
        // if(result){
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","200",null,null,111,"番茄畅听,时长赚金币",6,app.id,"完成","成功")
        // }else{
        //     //将每次任务存储到本地记录
        //     saveStorage.storageInfoData(f,"info","201",null,null,null,"番茄畅听,时长赚金币",6,app.id,"失败","失败")
        // }

    } catch (error) {
        fqctapp.log("番茄畅听,时长赚金币方法出现错误：" + error)
    }

}
fqctapp.领现金页阅时长赚金币查找第一步 = function () {
    fqctapp.log("番茄畅听,时长赚金币，第一步");
    var result = false;
    var countNum = 0;
    // bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
    while (true) {
        if (fqctapp.isOCRCZ("时长赚金币")) {
            adenTools.sleepRandom1();
            // clickAreaForFindImage(ad_image_array)
            result = true;
            fqctapp.log("点击领现金页阅时长赚金币");
            break;
        }
        if (!result) {
            bluetoothTools.swipe(w / 2, h - 390, w / 2, h / 8 * 3.5, 80, 2000, 1000);
            adenTools.sleepRandom3();
            countNum++;
            if (countNum > 8) {
                fqctapp.log("暂无领现金页阅时长赚金币");
                break;
            }
        }

    }
    return result;
}
fqctapp.领现金页阅时长赚金币查找第二步 = function () {

    fqctapp.log("番茄畅听,时长赚金币，第二步");
    var jctcCountNum = 0;
    var result = false;
    let isBlack = false;
    sleep(2000);
    fqctapp.isOCRCZ("立即领奖"); //出现就执行一下
    adenTools.sleepRandom3();
    // let kspzlClicksFlag = fqctapp.isOCRArrayCZ(["看视频再得","看视频领"]);
    let kspzlClicksFlag = fqctapp.isOCRArrayCZ([/^看视频再得\d+金币$/, /^看视频领\d+金币$/, /^看视频再得\d+金币/, /^看视频领\d+金币/]);
    fqctapp.log("看视频再得:" + kspzlClicksFlag);
    if (kspzlClicksFlag) {  //判断“看视频最高再领”，如果是true说明是领取金币， 否则就是看剧
        while (true) {
            adenTools.sleepRandom3();
            let lqcgBounds = fqctapp.isFindOCR("领取成功");
            if (lqcgBounds.length > 0) {
                bluetoothTools.click(lqcgBounds[0] + 100, lqcgBounds[1]);
                sleep(3000);
                fqctapp.isOCRCZ("退出");

                result = true;
                break;
            }
            if (!isBlack && jctcCountNum > 1) {
                bluetoothTools.back();
                isBlack = true
                // break;
            }
            if (jctcCountNum > 3) {
                result = true;
                break;
            }
            // adenTools.sleepRandom1();
            jctcCountNum++;

        }
    } else {
        bluetoothTools.back();
    }
    return result;
}
fqctapp.领现金页阅时长赚金币查找第三步 = function (fqctEndTime) {
    var result = false;
    var staDate = new Date();
    let hpStarTime = 0;// 滑屏开始时间
    // 随便点击
    fqctapp.log("随便点击");
    bluetoothTools.click(1000, random(2000, random(1068, 1268)));

    bluetoothTools.swipe(w / 2, h - 380, w / 2, h / 8 * 3.5, 5, 80, 5);//往上滑一次
    adenTools.sleepRandom1();
    sleep(fqctEndTime)
    // while(hpStarTime < fqctEndTime){ // 十分钟
    //     adenTools.sleepRandom9();
    //     var endDate = new Date();
    //     hpStarTime = adenTools.getTimeDifference(staDate,endDate)
    //     result = true;
    // }
    bluetoothTools.back();
    adenTools.sleepRandom3()
    clickAreaForFindImage(ad_image_array); //关闭
    bluetoothTools.back();
    return result;

}

fqctapp.获取金币 = function () {
    fqctapp.log("【番茄畅听，获取金币数量】")
    fqctapp.直到任务中心点击(app, 1);
    adenTools.sleepRandom3()
    let objCoin = bluetoothTools.umiocrFindData();
    let numbers = []; // 初始化一个空数组用于存储数字
    if (objCoin != null) {
        console.log("成功识别到文字！");
        for (var i = 0; i < objCoin.data.length; i++) {
            if (objCoin.data[i].text) {
                if (!isNaN(parseFloat(objCoin.data[i].text))) {
                    numbers.push(parseFloat(objCoin.data[i].text)); // 将数字转换为浮点数后存入数组
                    fqctapp.log("文字：", objCoin.data[i].text)
                }
            }
        }
    } else {
        return 0;
    }
    let newCoin = numbers[0];
    fqctapp.log("找到 -- 我的金币" + newCoin)
    return newCoin;

}
function cycleClick(str) {
    let result = false;
    for (var i = 0; i < 3; i++) {
        let kspBounds = fqctapp.isFindOCR(str);
        if (kspBounds.length > 0) {
            bluetoothTools.click(kspBounds[0], kspBounds[1]);
            fqctapp.log("番茄畅听-->" + str);
            adenTools.sleepRandom1();
            result = true;
            break;
        }
    }
    adenTools.sleepRandom3();
    return result;
}

function 看视频翻倍领取() {
    let result = false;
    let countTime = 0
    let staDate = new Date();
    while (countTime <= 40) {
        let kspBounds = fqctapp.isFindOCR("看视频翻倍领取"); //1bu
        if (kspBounds.length > 0) {
            bluetoothTools.click(kspBounds[0], kspBounds[1]);
            fqctapp.log("番茄畅听-->看视频翻倍领取");
            adenTools.sleepRandom1();
            result = true;
            break;
        } else {
            adenTools.sleepRandom3();
            let endDate = new Date();
            countTime = adenTools.getTimeDifference(staDate, endDate)
        }
    }
    return result;
}

function 领取成功() {
    let result = false;
    let countTime = 0
    let staDate = new Date();
    let isBlack = false;
    while (countTime <= 100) {
        let lqcgBounds = fqctapp.isFindOCR("领取成功"); //1bu
        if (lqcgBounds.length > 0) {
            bluetoothTools.click(lqcgBounds[0] + 100, lqcgBounds[1]);
            fqctapp.log("番茄畅听-->领取成功");
            adenTools.sleepRandom1();
            result = true;
            break;
        }
        // adenTools.sleepRandom3();
        let endDate = new Date();
        countTime = adenTools.getTimeDifference(staDate, endDate)
        if (!isBlack && countTime > 60) {//退出直播间或下载页
            bluetoothTools.back();
            isBlack = true;
        }
    }
    adenTools.sleepRandom3();
    return result;
}
//通过ocr查找是否存在
fqctapp.isFindOCR = function (word) {
    fqctapp.log("通过ocr查找对象关键字：" + word);
    let bounds = [];
    adenTools.sleepRandom3();
    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom3();
    bounds = bluetoothTools.umiocrClickWordBounds(objData, word);
    fqctapp.log("通过ocr查找word：" + word + "返回值" + bounds);
    return bounds;
};


//通过ocr点击是否成功
fqctapp.isOCRCZ = function (word) {
    var isFlag = false;
    let bounds = [];
    adenTools.sleepRandom3();
    let objData = bluetoothTools.umiocrFindData();
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrClickWordBounds(objData, word);
    fqctapp.log("通过ocr查找word：" + word + "返回值" + bounds);
    adenTools.sleepRandom1();
    if (bounds.length > 0) {
        bluetoothTools.click(bounds[0], bounds[1]);
        isFlag = true;
    }
    return isFlag;
}

//通过ocr点击是否成功
fqctapp.isOCRArrayCZ = function (words) {
    var isFlag = false;
    let bounds = [];
    adenTools.sleepRandom3();
    let objData = bluetoothTools.umiocrFindData();
    // console.log("res--->"+JSON.stringify(objData));
    adenTools.sleepRandom1();
    for (var i = 0; i < words.length; i++) {
        bounds = fqctapp.umiocrClickWordBounds(objData, words[i]);
        fqctapp.log("通过ocr查找word：" + words[i] + "返回值" + bounds);
        adenTools.sleepRandom1();
        if (bounds.length > 0) {
            bluetoothTools.click(bounds[0], bounds[1]);
            isFlag = true;
            break;
        }
    }
    return isFlag;
}

fqctapp.umiocrClickWordBounds = function (res, word) {
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
        if (word.test(res.data[i].text.replace(' ', '').replace('　', ''))) {
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

//通过ocr查找是否存在
fqctapp.isFindOCR开宝箱 = function () {
    fqctapp.log("通过ocr查找对象关键字：番茄畅听 开宝箱");
    let bounds = [];
    adenTools.sleepRandom3();
    let res = bluetoothTools.umiocrFindData();
    fqctapp.log("通过ocr查找对象：" + res);
    adenTools.sleepRandom3();
    let Bounds = []; // 初始化一个空数组用于存储数字
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        // toastLog(JSON.stringify(res.data[i].box));
        var 左上 = 坐标数组[0];
        var 右下 = 坐标数组[2];
        // toastLog("文字：", res.data[i].text, "，范围为：", JSON.stringify(res.data[i].box));
        // console.log("文字：", res.data[i].text, "，范围为：", 左上[0], 左上[1], 右下[0], 右下[1]);

        let nr = res.data[i].text;
        const regex = /^领\d+金币$/;
        if (regex.test(nr) || nr.indexOf("开宝箱") >= 0) {
            var 右上 = 坐标数组[1];
            var 左下 = 坐标数组[3];
            var x = 左上[0] + (右上[0] - 左上[0]) / 2;
            var y = 左下[1] + (右上[1] - 左下[1]) / 2;
            console.log("命中:" + "开宝箱" + "，坐标x:", x, "y:", y)
            Bounds.push(x);
            Bounds.push(y);
            return Bounds;
        }
    }
    toastLog("没有定位到宝箱");
    return bounds;
};

//通过ocr精准查找是否存在
fqctapp.isPerfectFindOCR = function (word) {
    fqctapp.log("通过ocr查找对象关键字：" + word);
    let bounds = [];
    adenTools.sleepRandom1();
    let objData = bluetoothTools.umiocrFindData();
    //fqctapp.log("通过ocr查找对象："+objData);
    adenTools.sleepRandom1();
    bounds = bluetoothTools.umiocrPerfectMatchWord(objData, word);
    fqctapp.log("通过ocr查找word：" + word + "返回值" + bounds);
    return bounds;
}

fqctapp.直到任务中心点击 = function (app, step) {
    let countNum = 0;
    if (step == 1) {
        for (var i = 1; i <= 3; i++) {
            let bounds = [];
            fqctapp.log("通过ocr查找word：领现金");
            bounds = fqctapp.isFindOCR("领现金") || fqctapp.isFindOCR("领现");
            if (bounds.length > 0) {
                bluetoothTools.click(bounds[0], bounds[1]);
                adenTools.sleepRandom1();
                break;
            } else if (i == 3) {//有时是倒计时识别不到
                throw new Error("没有找到领现金，结束任务")
            }
        }

    }
    clickAreaForFindImage(ad_image_array);
    while (countNum < 7) {
        // bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
        fqctapp.log("正在奋力回到首屏,目前第" + countNum + "页");
        bluetoothTools.swipe(w / 2, h / 8, w / 2, (h / 8) * 6, 50, 2000, 1000);
        countNum++;
    }

    bluetoothTools.closeUpgradetWindows();
}




// fqctapp.直到任务中心点击 = function (step) {
//     var flag = false;
//     let num = 0;
//     let countNum = 0;
//     if(step==1){
//         clickAreaForFindImage(ad_image_array)
//     }
//     while (true) {
//         let bounds = [];
//         fqctapp.log("番茄畅听，通过ocr查找word：福利");
//         bounds = fqctapp.isFindOCR("领现金");
//         if(bounds.length>0){
//             flag = true;
//         }
//         if (flag) {
//             bluetoothTools.click(bounds[0]-10, bounds[1]+10);
//             fqctapp.log("番茄畅听进入福利页面");
//             //bluetoothTools.swipe(w / 2,h/9,w / 2, 5*h,5,80,5);
//             break;
//         }
//        if(num>3){
//            bluetoothTools.back();//直到返回首页
//             break;
//         }
//         num ++;
//         //
//     }

//     while(countNum<3){
//         bluetoothTools.randomSwipe(w, h, "下", 3000, 5000);
//         adenTools.sleepRandom1();
//         countNum++;
//     }
//     // if(clickImageStatus == 1){
//     //     clickAreaForFindImage(ad_image_array)
//     // }
// }


fqctapp.首页 = function () {
    var flag = false;
    let num = 0;
    let result = false;

    while (true) {
        let bounds = [];
        fqctapp.log("番茄畅听，通过ocr查找word：首页");
        bounds = fqctapp.isFindOCR("首页");
        if (bounds.length > 0) {
            flag = true;
        }
        if (flag) {
            bluetoothTools.click(bounds[0], bounds[1]);
            result = true;
            sleep(3000);
            clickAreaForFindImage(ad_image_array)
            for (let index = 0; index < 4; index++) {
                // 右划
                bluetoothTools.swipe(w / 5, h / 1000 * 118.5, w / 5 * 4, h / 1000 * 118.5, 5, 100, 10);
                adenTools.sleepRandom1();
            }
            fqctapp.log("番茄畅听进入首页页面");
            break;
        }
        if (num > 3) {
            bluetoothTools.back();//直到找到首页
            break;
        }
        num++;
    }

    return result;
}
fqctapp.log = function (text) {
    toastLog(text);
}
function buildADArray(ad_path, ad_number) {
    let ad_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = ad_path + (i) + ".png"
        ad_array.push(ad_full_path)
    }
    return ad_array;
}




function buildADArray(ad_path, ad_number) {
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
                //fqctapp.log("正在进行第" + (i + 1) + "次找图...")
                img_path = img_path_array[i] //小图地址可判断是否存在
                if (!files.exists(img_path)) {
                    fqctapp.log(img_path + "文件不存在因此跳过")
                    continue
                }
                var little_image = images.read(img_path) //小图
                // fqctapp.log("分辨率：" + w + "*" + h + "，巡查关闭弹框")
                var find_result_bounds = images.findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                if (find_result_bounds) {
                    fqctapp.log(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                    bluetoothTools.click(find_result_bounds.x, find_result_bounds.y)
                    return true
                } else {
                    //fqctapp.log(img_path+"小图存在但是在大图中未找到图片进入下一次循环...")
                }
            }
            return false
        }
        if (typeof (img_path_array) == "string") {
            img_path = img_path_array//小图地址可判断是否存在
            if (!files.exists(img_path)) {
                fqctapp.log(img_path + "文件不存在因此跳过")
                return false
            }
            var little_image = images.read(img_path) //小图
            var find_result_bounds = images.findImage(
                captureScreen(), little_image, {
                region: area_region,
                threshold: threshold
            });
            if (find_result_bounds) {
                fqctapp.log(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                bluetoothTools.click(find_result_bounds.x, find_result_bounds.y)
                return true
            } else {
                //fqctapp.log(img_path + "小图存在但是在大图中未找到图片")
                return false
            }
        }
    } catch (error) {
        fqctapp.log("clickAreaForFindImage方法出现错误：" + error)
        return false;
    }
}



function main() {
    adenTools.startApp("番茄畅听"); //启动App
    adenTools.sleepRandom9();//启动App时候等待时间
    function f() { };
    //fqctapp.签到(app,f,"isSignKey")
    //fqctapp.看短剧(app,f,10)
    // fqctapp.开宝箱();
    // fqctapp.红包雨();
    // fqctapp.翻卡片(app,f);
    //fqctapp.看书(app,f,20);
    //fqctapp.start(app,f)
}
// main();

module.exports = fqctapp;
