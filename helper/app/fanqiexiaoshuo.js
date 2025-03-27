var adenTools = require('../common/Tools11');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
let bluetoothTools = require('../common/ToolsBluetooth');
const h = device.height || 2400,
    w = device.width || 1280;
setScreenMetrics(w, h);
let ad_image_array = adenTools.buildADArray("Image/AD", 18);//关闭按钮定义
let stop_image_array = buildADArray("Image/fqxsapp/stop/stop", 4);//待金币定义
const imgCloseSwitch = true;//开关
let stopFlag = false;
/* App v5.8.9  2小时2分钟*/
var fqxsapp = {
    app: null,
    appId: null,
    me: null,
    day: null,
    keyPrefix: null,
    fun: null,
    curStep: 0,
    lastGetCoinTime: 0,
    st: null,
    preHongBaoTime: null,
    preAmount: 0,
    errorFlag: null,
    init: function (appPlan, f) {
        // 安装检测 app 
        // installApp(appPlan);
        this.app = appPlan;
        this.appId = appPlan.id;
        this.me = appPlan.memberId;
        this.day = appPlan.planKey;
        this.keyPrefix = this.appId + "_" + this.me + "_" + this.day + "_";
        this.fun = f;
        this.curStep = 0;
        this.lastGetCoinTime = 0;
        stopFlag = false;
        adenTools.startApp(appPlan.appName); //启动App
        adenTools.sleepRandom5();
        log('分辨率,w:' + w + ',h:' + h);
    },
    setStopFlag: function() {
        stopFlag = true;
    },
    //统一入口
    start: function (appPlan, f) {
        this.init(appPlan, f)
        adenTools.getScreenCapture();
        sleep(3000);
        bluetoothTools.clickAreaForFindImage(ad_image_array);
        sleep(2000);
        bluetoothTools.closeUpgradetWindows();
        this.st = new Date();
        let isSignKey = "fanqiexiaoshuo" + appPlan.appId + "_" + appPlan.memberId + "_" + adenTools.getYMD();
        // let isSign = localStorage.get(isSignKey);
        let flag = false;
        try {
            flag = fqxsapp.去福利页();
            if (!flag) {
                return;
            }
            this.preAmount = this.获取金币();//获取做任务前的金币
            this.签到(isSignKey);
            this.听书();
            flag = fqxsapp.去福利页();
            if (!flag) {
                return;
            }
            this.翻牌任务();
            this.开宝箱任务();
            this.红包雨任务();
            let t = 1.5 * 60 * 60;
            // let t = 45 * 60;
            while (true) {
                this.看短剧();
                let flag = fqxsapp.去福利页();
                if (!flag) {
                    log("因任务时间达到上限,本轮任务结束");
                    break;
                }
                if(stopFlag){
                    break;
                }
                this.翻牌任务();
                if (adenTools.getTimeDifference(this.st, new Date()) > t) {
                    log("因任务时间达到上限,本轮任务结束");
                    break;
                }
                if(stopFlag){
                    break;
                }
                this.开宝箱任务();
                if (adenTools.getTimeDifference(this.st, new Date()) > t) {
                    log("因任务时间达到上限,本轮任务结束");
                    break;
                }
                if(stopFlag){
                    break;
                }
                this.红包雨任务();
                if (adenTools.getTimeDifference(this.st, new Date()) > t) {
                    log("因任务时间达到上限,本轮任务结束");
                    break;
                }
                if(stopFlag){
                    break;
                }
            }
        } catch (error) {
            fqctapp.log("番茄小说，出现未知错误：" + error)
            this.errorFlag = error;
        } finally {
            if (fqxsapp.去福利页()) {
                let num = this.获取金币();
                //let num = newCoin - fqxsapp.preAmount;
                log("本次任务共领取金币:" + num);
                 saveStorage.storageInfoData(this.fun, "info", "200", num, null, this.获取执行时间(fqxsapp.st.getTime()), "获取金币", 10, this.appId, "完成", "获取金币完成");
            }
        }
        if (this.errorFlag) {
            throw this.errorFlag;
        }
        log("番茄小说任务结束");
        adenTools.clearCach(appPlan.appName);
        bluetoothTools.back();

    },
    设置执行标识: function (key, status) {
        localStorage.put(this.keyPrefix + key, status);
    },
    设置完成标识: function (key) {
        localStorage.put(this.keyPrefix + key, true);
    },
    获取完成标识: function (key) {
        return localStorage.get(this.keyPrefix + key);
    },
    获取金币: function () {
        var res = bluetoothTools.umiocrFindData();//识别出来文字先
        // console.log("res-->", JSON.stringify(res));
        for (var i = 0; i < res.data.length; i++) {
            if (isNumeric(res.data[i].text)) {
                log("搬砖前金币收益:" + res.data[i].text);
                return res.data[i].text;
            }
        }

        log("未找到搬砖前金币收益");
        return 0;
    },
    // 获取最新金币: function () {
    //     return localStorage.get(this.keyPrefix + "bjNum");
    // },
    获取执行时间: function (s) {
        let start = s || 0;
        return new Date().getTime() - start;
    },
    是否完成任务: function () {
        let isSign = this.获取完成标识("sign");//1
        let isSeeVedio = this.获取完成标识("seeVedio");//2
        let isSeeShortplay = this.获取完成标识("seeShortplay");//3
        let isYuedu = this.获取完成标识("yuedu");//4
        let isTinshu = this.获取完成标识("tinshu");//5
        let isRedPacket = true;//this.获取完成标识("redPacket");//6
        let isOpenBox = true;//this.获取完成标识("openBox");//7
        let isFinish = isSign || isSeeVedio || isSeeShortplay || isYuedu || isTinshu || isRedPacket || isOpenBox;
        return isFinish;
    },
    去福利页: function () {
        log("开始进入福利页");
        sleep(3000);
        for (var i = 1; i < 4; i++) {
            var res = bluetoothTools.umiocrFindData();//识别出来文字先
            let bounds = bluetoothTools.umiocrClickWordBounds(res, "福利");//找到福利坐标
            log("通过ocr查找word:福利" + "返回值" + bounds);
            if (bounds.length == 0) {
                continue;
            }
            bluetoothTools.click(bounds[0], bounds[1] + 20);//点击'福利'两个字
            sleep(4000);

            if (检查当前页('福利中心')) {
                log("成功进入福利中心");
                bluetoothTools.clickAreaForFindImage(ad_image_array);
                return true;
            }
        }

        log("尝试3次进入福利页未成功,退出程序");
        throw new Error('尝试3次进入福利页未成功,退出程序');
    },
    签到: function (isSignKey) {
        log("进入签到流程...");

        // 回到首屏();
        //定位"签到领金币"坐标
        let bounds = [];
        for (var i = 1; i < 10; i++) {
            var res = bluetoothTools.umiocrFindData();
            bounds = bluetoothTools.umiocrClickWordBounds(res, "签到领金币");//明日签到
            if (bounds.length > 0) {
                break;
            }
            bluetoothTools.swipe(w / 2, (h / 8) * 3.5, w / 2, h / 8, 50, 2000, 1000);
            sleep(2000);
        }
        if (bounds.length == 0) {
            log("因没有找到签到入口退出");
            return;
        }
        sleep(2000);
        bluetoothTools.click(bounds[0], bounds[1]);//点击'签到领金币'两个字
        adenTools.sleepRandom3();


        //定位浮窗上'立即签到'坐标
        res = bluetoothTools.umiocrFindData();
        bounds = bluetoothTools.umiocrClickWordBounds(res, "立即签到");
        if (bounds.length == 0) {
            log("因没有定位到'立即签到'按钮退出");
            return;
        }
        sleep(2000);
        bluetoothTools.click(bounds[0], bounds[1]);//点击'立即签到'两个字
        sleep(3000);
        //关闭添加到主屏幕
        res = bluetoothTools.umiocrFindData();
        bounds = ocrBounds(res, "添加到主屏幕");
        if (bounds.length > 0) {
            bounds = ocrBounds(res, "取消");
            bluetoothTools.click(bounds[0], bounds[1]);//点击'取消'两个字
        }
        //去看视频广告
        去看视频广告();
        // localStorage.put(isSignKey, true)
        log("签到成功退出流程");
    },
    看视频: function () {
        log("进入看视频赚金币流程");
        if (!this.去福利页()) {
            log("进入福利页失败,无法看视频");
            return;
        }
        while (true) {
            //定位"看视频赚金币"坐标
            let bounds = [];
            for (var i = 1; i < 7; i++) {
                var res = bluetoothTools.umiocrFindData();//识别出来文字先
                bounds = bluetoothTools.umiocrClickWordBounds(res, "看视频赚金币");//找签到领金币坐标
                if (bounds.length > 0) {
                    break;
                }
                bluetoothTools.swipe(w / 2, h - 380, w / 2, 0, 5, 100, 10);
            }
            if (bounds.length == 0) {
                log("没有找到看视频赚金币入口");
                return;
            }

            //弹出广告浮窗
            // log("这里先人工点一下,后续有了设备需要注释");
            // adenTools.sleepRandom3();
            bluetoothTools.click(bounds[0], bounds[1]);//点击'看视频赚金币'两个字

            adenTools.sleepRandom100();//播放90~100秒

            //定位'领取成功'坐标
            res = bluetoothTools.umiocrFindData();//识别出来文字先
            bounds = bluetoothTools.umiocrClickWordBounds(res, "领取成功");//找领取成功坐标
            if (bounds.length == 0) {
                log("没有定位到'领取成功'按钮");
                bluetoothTools.back();
                return;
            }
            // log("这里先人工点一下,后续有了设备需要注释");
            // adenTools.sleepRandom3();
            bluetoothTools.click(bounds[0] + 15, bounds[1]);//点击'领取成功后面的X'两个字

        }
        log("退出看视频赚金币流程");
    },
    看短剧: function () {
        log("进入看剧流程...");
        //定位"看短剧"坐标
        let bounds = [];
        for (var i = 1; i < 10; i++) {
            var res = bluetoothTools.umiocrFindData();
            bounds = bluetoothTools.umiocrClickWordBounds(res, "看短剧");
            if (bounds.length > 0) {
                break;
            } else if (i == 1) {
                回到首屏();
            }
            bluetoothTools.swipe(w / 2, (h / 8) * 5.5, w / 2, h / 8, 50, 2000, 1000);
            // sleep(2000);
        }
        if (bounds.length == 0) {
            log("因没有找到看短剧入口退出");
            return;
        }
        bluetoothTools.click(bounds[0], bounds[1]);//点击'看短剧'两个字
        sleep(3000);

        var res = bluetoothTools.umiocrFindData();
        bounds = ocrBounds(res, "取消");
        if (bounds.length > 0) {
            bluetoothTools.click(bounds[0], bounds[1]);//关闭添加到主屏幕
            sleep(1200);
        }
        for (var i = 1; i < 4; i++) {
            let x = w * random(2, 4) / 5;
            let y = h * random(2, 3) / 4;
            log("随机点击一个短剧,x:" + x + ",y:" + y)
            bluetoothTools.click(x, y);//todo 加随机选择一个
            sleep(3000);
            res = bluetoothTools.umiocrFindData();
            //检验有没有打开剧集
            let bounds1 = ocrBounds(res, "短剧");
            let bounds2 = ocrBounds(res, "视频");
            if (bounds1.length == 0 && bounds2.length == 0) {
                break;
            }
            if (i == 3) {
                log("没有找到剧集,退出看剧流程");
                return;
            }
        }


        sleep(random(1000 * 60 * 10, 1000 * 60 * 12));//7~9分钟
        // log("测试看15秒");
        // sleep(60 * 1000 * 2);

        res = bluetoothTools.umiocrFindData();
        bounds = ocrBounds(res, "下次再说");
        if (bounds.length > 0) {
            bluetoothTools.click(bounds[0], bounds[1]);
        }

        sleep(2000);
        bluetoothTools.back();
        //检验有没有退出成功
        bounds1 = ocrBounds(res, "短剧");
        bounds2 = ocrBounds(res, "视频");
        if (bounds1.length == 0 && bounds2.length == 0) {
            bluetoothTools.back();
        }
        log("成功退出看剧流程");
    },

    听书: function () {
        log("进入听书流程...");
        let isFind = false;

        //定位"去听书"坐标
        let bounds = [];
        for (var i = 1; i < 10; i++) {
            var res = bluetoothTools.umiocrFindData();
            bounds = bluetoothTools.umiocrClickWordBounds(res, "去听书");
            if (bounds.length > 0) {
                break;
            } else if (i == 1) {
                回到首屏();
            }
            bluetoothTools.swipe(w / 2, (h / 8) * 4, w / 2, h / 8, 50, 2000, 1000);
        }
        if (bounds.length == 0) {
            log("因没有找到去听书入口退出");
            return;
        }
        //验证是否进入书城
        for (var i = 0; i < 3; i++) {
            bluetoothTools.click(bounds[0], bounds[1]);//点击'去听书'两个字
            sleep(4000);
            var res = bluetoothTools.umiocrFindData();
            let bounds1 = bluetoothTools.umiocrClickWordBounds(res, "知识");
            let bounds2 = bluetoothTools.umiocrClickWordBounds(res, "经典");
            let bounds3 = bluetoothTools.umiocrClickWordBounds(res, "听书");
            if (bounds1.length > 0 || bounds2.length > 0 || bounds3.length > 0) {
                log("已经成功进入书城");
                break;
            }
            if (i == 2) {
                log("进入书城失败,退出看书流程");
                return;
            }
        }
        //选择一本书
        for (var i = 1; i < 4; i++) {
            let x = w * random(1, 2) / 3 - 200;
            let y = h * random(1, 3) / 4 - 200;
            log("选择一本书,位置:x:" + x + "y:" + y);
            bluetoothTools.click(x, y);
            sleep(3000);
            res = bluetoothTools.umiocrFindData();
            //检验有没有打开书
            let bounds1 = ocrBounds(res, "语速");
            let bounds2 = ocrBounds(res, "定时");
            if (bounds1.length > 0 || bounds2.length > 0) {
                break;
            }
            if (i == 3) {
                log("没有找到书籍,退出看书流程");
                return;
            }
        }
        // sleep(2 * 60 * 1000);//播放20~25分钟
        sleep(random(15 * 60 * 1000, 20 * 60 * 1000));//播放20~25分钟
        res = bluetoothTools.umiocrFindData();
        bounds = ocrBounds(res, "语速");
        let stopBounds = areaForFindImage(stop_image_array, [300, 1000, 450, 450]);
        if (bounds.length > 0 && stopBounds) {
            isFind = true;
            bluetoothTools.click(bounds[0], bounds[1] - (bounds[1] - stopBounds.y) / 2);
        } else {
            bluetoothTools.click(bounds[0], bounds[1] - 166.5);
        }
        sleep(2000);
        res = bluetoothTools.umiocrFindData();
        bounds = bluetoothTools.umiocrClickWordBounds(res, "坚持退出");
        if (bounds.length == 0) {
            bluetoothTools.clickAreaForFindImage(ad_image_array);
        } else {
            bluetoothTools.click(bounds[0], bounds[1]);//点击'坚持退出'
        }
        log("成功退出听书流程");

        bluetoothTools.back();
        if (!isFind) {
            bluetoothTools.back();
        }
        sleep(3000);
        // res = bluetoothTools.umiocrFindData();
        // bounds = bluetoothTools.umiocrClickWordBounds(res, "坚持退出");
        // if (bounds.length == 0) {
        //     bluetoothTools.clickAreaForFindImage(ad_image_array);
        // }
        log("成功退出听书流程");

    },

    红包雨任务: function () {

        if (fqxsapp.preHongBaoTime
            && adenTools.getTimeDifference(fqxsapp.preHongBaoTime, new Date()) < 60 * 60) {
            log("距离上一场红包雨任务结束还不到1小时...");
            return;
        }
        log("进入红包雨流程...");

        let bounds = [];
        for (var i = 1; i < 8; i++) {
            var res = bluetoothTools.umiocrFindData();//识别出来文字先
            bounds = bluetoothTools.umiocrClickWordBounds(res, "金币红包雨");//找到坐标
            bounds2 = bluetoothTools.umiocrClickWordBounds(res, "开启下一场红包雨");//避免误点
            if (bounds.length > 0 && bounds2.length == 0) {
                break;
            } else if (i == 1) {
                回到首屏();
            }
            bluetoothTools.swipe(w / 2, (h / 8) * 4, w / 2, h / 8, 50, 2000, 1000);//往上滑
            adenTools.sleepRandom1();
        }
        if (bounds.length == 0 || bounds2.length > 0) {
            log("因为没有找到红包雨入口,退出流程")
            return;
        }
        bluetoothTools.click(bounds[0], bounds[1]);

        sleep(2000)

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
                xj = x + Math.round(Math.random(20));
                sleep(100);
            }
            cc = cc + 1
            yj = y + Math.round(Math.random(15));
            xj = x + Math.round(Math.random(10));
        }
        fqxsapp.preHongBaoTime = new Date();
        sleep(2000)
        var res = bluetoothTools.umiocrFindData();//识别出来文字先
        bounds = bluetoothTools.umiocrClickWordBounds(res, "返回福利页");//找到坐标
        if (bounds.length > 0) {
            bluetoothTools.click(bounds[0], bounds[1]);
        }
        去看视频广告('看视频翻倍领取');

        log('成功退出红包雨流程');
    },

    开宝箱任务: function () {
        log("进入开宝箱流程...");

        var res = bluetoothTools.umiocrFindData();
        let bounds = bluetoothTools.umiocrClickWordBounds(res, "开宝箱得金币");
        if (bounds.length == 0) {
            bounds = ocrRegexBounds(res, /^点击领\d+金币$/);
            if (bounds.length == 0) {
                log("因为没找到宝箱,退出开宝箱流程");
                return;
            }
        }

        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();

        去看视频广告();
        log("成功退出开宝箱流程");
    },

    翻牌任务: function () {
        log("进入翻牌领红包流程....");

        let bounds = [];
        let bounds2 = [];
        let bounds3 = [];
        for (var i = 1; i < 8; i++) {
            //定位'看听读赚'坐标
            res = bluetoothTools.umiocrFindData();
            // console.log(JSON.stringify(res));
            bounds = ocrRegexBounds(res, /^看听读赚.*?金币/);
            bounds2 = bluetoothTools.umiocrPerfectMatchWord(res, "去听书");
            bounds3 = bluetoothTools.umiocrPerfectMatchWord(res, "去阅读");
            if (bounds.length == 0 || (bounds2.length == 0 && bounds3.length == 0)) {
                log("第" + i + "屏没有定位到'看听读赚金币'");
                if (i == 1) {
                    回到首屏();
                }
            } else {
                break;
            }
            bluetoothTools.swipe(w / 2, (h / 8) * 4, w / 2, h / 8, 50, 2000, 1000);//没找到往上滑
            sleep(1000);
        }
        if (bounds.length == 0 || (bounds2.length == 0 && bounds3.length == 0)) {
            log("因为没有定位到看听读赚,所以退出领金币流程");
            return;
        }
        log("看视频加倍坐标:" + JSON.stringify(bounds) + JSON.stringify(bounds2));

        do {
            sleep(2000);
            res = bluetoothTools.umiocrFindData();//识别出来文字先
            bounds = ocrBounds(res, "领取");
            if (bounds.length == 0) {
                log("没有待领取红包");
                break;
            }
            //领取
            bluetoothTools.click(bounds[0], bounds[1]);
            去看视频广告();
        } while (bounds.length > 0)

        log("退出翻牌领红包流程");
    },
    //8
    提现: function () {
        this.去福利页();
        回到首屏();
        var res = bluetoothTools.umiocrFindData();
        // log(JSON.stringify(res));
        log("开始找现金收益....");
        let flag = 0;
        let coin = 0;
        for (var i = 0; i < res.data.length; i++) {
            if (isNumeric(res.data[i].text)) {
                flag++;
                log("找到收益" + res.data[i].text);
                coin = res.data[i].text;
            }
            if (flag == 2) {
                break;
            }
        }

        log("找到现金收益" + coin)

        if (!coin || coin < 3.00) {
            log("提现金额不够，请下次再来")
            return 0;
        }

        // var res = bluetoothTools.umiocrFindData();
        let bounds = ocrBounds(res, "现金收益");
        if (bounds.length == 0) {
            log("因没有找到提现入口退出");
            return 0;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom3();
        log("开始提现提现...");
        //切换到支付宝
        res = bluetoothTools.umiocrFindData();
        bounds = bluetoothTools.umiocrClickWordBounds(res, "支付宝");//找坐标
        if (bounds.length == 0) {
            log("因没有找到支付宝标签,所以退出提现操作");
            return;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        res = bluetoothTools.umiocrFindData();
        // log(JSON.stringify(res));

        if (coin >= 0.30) {
            bounds = ocrBounds(res, "0.30元");
        }
        if (coin >= 30.00) {
            bounds = ocrBounds(res, "30.00元");
        }
        if (coin >= 15.00) {
            bounds = ocrBounds(res, "15.00元");
        }
        if (bounds.length == 0) {
            log("因没有找到提现档次退出");
            return 0;
        }
        bluetoothTools.click(bounds[0], bounds[1]);//选中提现档次
        adenTools.sleepRandom1();

        bounds = ocrBounds(res, "立即提现");
        if (bounds.length == 0) {
            log("因没有找到提现按钮退出");
            return 0;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();
        bounds = ocrBounds(res, "立即提现");
        if (bounds.length == 0) {
            log("因没有找到提现按钮退出");
            return 0;
        }
        //二次确认弹窗
        res = bluetoothTools.umiocrFindData();
        bounds = ocrBounds(res, "立即提现");
        if (bounds.length == 0) {
            log("因没有找到提现按钮退出");
            return 0;
        }

        saveStorage.storageInfoData(this.fun, "info", "200", null, 0, this.获取执行时间(), "提现", 0, this.appId, "完成", "")
        log("成功提现" + coin + "元");

        bluetoothTools.back();
        return coin;

    },
};

// function 获取现金收益() {
//     var res = bluetoothTools.umiocrFindData();
//     // log(JSON.stringify(res));
//     log("开始找现金收益....");
//     let flag = 0;
//     let coin = 0;
//     for (var i = 0; i < res.data.length; i++) {
//         if (isNumeric(res.data[i].text)) {
//             flag++;
//             log("找到收益" + res.data[i].text);
//             coin = res.data[i].text;
//         }
//         if (flag == 2) {
//             break;
//         }
//     }

//     log("找到现金收益" + coin)

//     return coin;
// }

// function 获取金币() {
//     log("开始获取金币...");
//     // let flag = fqxsapp.去福利页();
//     // if (!flag) {
//     //     return 0;
//     // }

//     回到首屏();
//     var res = bluetoothTools.umiocrFindData();//识别出来文字先
//     // console.log("res-->", JSON.stringify(res));
//     for (var i = 0; i < res.data.length; i++) {
//         if (isNumeric(res.data[i].text)) {
//             log("找到金币收益:" + res.data[i].text)
//             return res.data[i].text;
//         }
//     }

//     log("未找到金币收益退出")

//     return 0;
// }

function isNumeric(value) {
    // var rex=new RegExp(/^-?\d+(\.\d+)?$/,"i");
    return /^-?\d+(\.\d+)?$/.test(value);
    // return isFinite(value);
}
//安装app
function installApp(appPlan) {
    if (!app.launchApp(appPlan.appName)) {
        console.log("应用未安装");
        // 如果没有安装，则打开链接进行安装
        app.openUrl(appPlan.androidDownUrl);//todo 把他存到oss  但是需要域名，域名要申请
        console.log("正在下载" + appPlan.androidDownUrl);
        // 此处添加等待用户手动安装的逻辑
        var waitForInstall = true;
        while (waitForInstall && !app.launchApp(appPlan.appName)) {
            sleep(5000); // 每5秒检查一次
        }
    }
    return
    // TODO 提现时候下载
    // //支付宝
    // let alipayPackageName = "com.alipay.sdk";
    // let alipayAndroidDownUrl = "http://webrs.xingbo.tv/app/alipay.apk";//现在apk的地址
    // installGlApp(alipayPackageName, alipayAndroidDownUrl);
    // //微信
    // let winxiPackageName = "ccom.tencent.mm";
    // let winxiAndroidDownUrl = "http://webrs.xingbo.tv/app/winxi.apk";//现在apk的地址
    // installGlApp(winxiPackageName, winxiAndroidDownUrl);
}

function installGlApp(packageName, androidDownUrl) {
    if (!app.launchApp(packageName)) {
        console.log("应用未安装");
        // 如果没有安装，则打开链接进行安装
        app.openUrl(androidDownUrl);
        console.log("正在下载" + androidDownUrl);
        // 此处添加等待用户手动安装的逻辑
        var waitForInstall = true;
        while (waitForInstall && !app.launchApp(packageName)) {
            sleep(5000); // 每5秒检查一次
        }
    }
}
/**
 * 关闭通知
 */
function fanqieCloseInvitationNotice() {
    if (id("close").exists()) {
        id("close").findOnce().click();
    }
}

function getNum(lodNum) {
    let newNum = 100;//获取金币()
    let num = 0;
    if (newNum != null) {
        num = newNum - lodNum;
    }
    return num;
}

function log(text) {
    toastLog(text);
}


function buildADArray(ad_path, ad_number) {
    let ad_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = ad_path + (i) + ".jpg"
        ad_array.push(ad_full_path)
    }
    return ad_array;
}

//umi开源ocr识别坐标
function ocrBounds(res, word) {
    let Bounds = []; // 初始化一个空数组用于存储数字
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        // console.log(JSON.stringify(res.data[i].box));
        var 左上 = 坐标数组[0];
        // var 右下 = 坐标数组[2];
        // console.log("文字：", res.data[i].text, "，范围为：", JSON.stringify(res.data[i].box));
        // console.log("文字：", res.data[i].text, "，范围为：", 左上[0], 左上[1], 右下[0], 右下[1]);
        if (res.data[i].text == word) {
            var 右上 = 坐标数组[1];
            var 左下 = 坐标数组[3];
            var x = 左上[0] + (右上[0] - 左上[0]) / 2;
            var y = 左下[1] + (右上[1] - 左下[1]) / 2;
            log("找到[" + word + "]坐标x:" + x + ",y:" + y);
            Bounds.push(x);
            Bounds.push(y);
            return Bounds;
        }
    }
    log("没找到[" + word + "]坐标");
    return Bounds

}

function ocrRegexBounds(res, word) {
    let Bounds = []; // 初始化一个空数组用于存储数字
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        // console.log(JSON.stringify(res.data[i].box));
        var 左上 = 坐标数组[0];
        var 右下 = 坐标数组[2];
        if (word.test(res.data[i].text.replace(' ', '').replace('　', ''))) {
            var 右上 = 坐标数组[1];
            var 左下 = 坐标数组[3];
            var x = 左上[0] + (右上[0] - 左上[0]) / 2;
            var y = 左下[1] + (右上[1] - 左下[1]) / 2;
            log("命中坐标，x:" + x + ",y:" + y);
            Bounds.push(x);
            Bounds.push(y);
            return Bounds;
        }
    }

    return Bounds

}
function 检查当前页(pageName) {
    var newRes = bluetoothTools.umiocrFindData();//为了验证是否翻页成功
    if (!newRes || !newRes.data) {
        return false;
    }
    // console.log("检查当前页res-->",JSON.stringify(newRes));
    var d = newRes.data.filter(function (item) {
        return item.text.includes(pageName);
    });
    if (d.length > 0) {
        var words = ["下次再说", "暂不加入", "坚持退出", "继续退出", "立即开始", "同意", "知道了", "以后再说", "我知道了", "直接无视", "直接无视", "点击重播", "我在想想", "稍候再说", "以后", "以后更新", "回头再说", "回头在说", "先去看看", "先去逛逛", "以后再说", "忽略该版本", "游客逛逛", "暂不更新", "好的", "不再提醒"];
        for (let i = 0; i < words.length; i++) {
            bounds = bluetoothTools.umiocrPerfectMatchWord(newRes, words[i]);
            if (bounds.length > 0) {
                bluetoothTools.click(bounds[0], bounds[1]);
            }
        }
    }
    return d.length > 0;
}
function 回到首屏() {
    sleep(1000);
    log("滑屏到首页....");
    if (imgCloseSwitch) {
        bluetoothTools.clickAreaForFindImage(ad_image_array);
    } else {
        log("请手动关闭弹窗");
        sleep(2500);
    }
    for (var i = 1; i < 7; i++) {
        log("正在奋力回到首屏,目前第" + i + "页");
        bluetoothTools.swipe(w / 2, h / 8, w / 2, (h / 8) * 6, 70, 2000, 1000);
    }

    log("已经回到首屏");
}
function 去看视频广告(words) {
    if (!words) {
        words = '看视频最高再领';
    }
    sleep(3000);
    var res = bluetoothTools.umiocrFindData();
    let bounds = bluetoothTools.umiocrClickWordBounds(res, words);//这里可能会出现多种情况
    if (bounds.length == 0) {
        log("没有[看视频最高再领]按钮直接退出");
        if (imgCloseSwitch) {
            bluetoothTools.clickAreaForFindImage(ad_image_array);
        } else {
            log("请手动关闭弹窗");
            sleep(2500);
        }
        return false;
    }
    if (bounds.length > 0) {
        bluetoothTools.click(bounds[0], bounds[1]);
        //播放90~100秒
        adenTools.sleepRandom5();
        sleep(60 * 1000);
        for (var i = 1; i < 5; i++) {
            res = bluetoothTools.umiocrFindData();
            bounds = bluetoothTools.umiocrClickWordBounds(res, "领取成功");
            if (bounds.length == 0) {
                sleep(2000);
                //有时没有坚持退出页，直接就退出了弹窗
                let bounds1 = bluetoothTools.umiocrPerfectMatchWord(res, "书城");
                let bounds2 = bluetoothTools.umiocrPerfectMatchWord(res, "福利");
                if (bounds1.length > 0 || bounds2.length > 0) {
                    return true;
                }
            } else {
                break;
            }
            let bounds1 = bluetoothTools.umiocrClickWordBounds(res, "以后再说");//"下次再说", "以后再说"
            if (bounds1.length > 0) {
                bluetoothTools.click(bounds1[0], bounds1[1]);
            }
            bluetoothTools.back();
        }
        // res = bluetoothTools.umiocrFindData();
        // bounds = bluetoothTools.umiocrClickWordBounds(res, "领取成功");
        // if (bounds.length == 0) {
        //     sleep(2000);
        //     //有时没有坚持退出页，直接就退出了弹窗
        //     let bounds1 = bluetoothTools.umiocrPerfectMatchWord(res, "书城");
        //     let bounds2 = bluetoothTools.umiocrPerfectMatchWord(res, "福利");
        //     if (bounds1.length > 0 || bounds2.length > 0) {
        //         return true;
        //     }
        //     bluetoothTools.back();
        //     sleep(3000);
        //     res = bluetoothTools.umiocrFindData();
        //     bounds = bluetoothTools.umiocrClickWordBounds(res, "领取成功");
        //     if (bounds.length == 0) {
        //         bluetoothTools.back();
        //         sleep(3000);
        //         res = bluetoothTools.umiocrFindData();
        //         bounds = bluetoothTools.umiocrClickWordBounds(res, "领取成功");
        //     }
        // }

        if (bounds.length == 0) {
            bluetoothTools.clickAreaForFindImage(ad_image_array);
            return true;
        }
        sleep(2000);
        if (bounds[0] < 855) {//坐标x: 861.5 y: 139.5,有后面有文字识别不准确
            bluetoothTools.click(861.5 + 100, 139.5);//点击'领取成功后面的X'两个字
        } else {
            bluetoothTools.click(bounds[0] + 100, bounds[1]);//点击'领取成功后面的X'两个字
        }

        adenTools.sleepRandom1();
        //找坚持退出
        res = bluetoothTools.umiocrFindData();
        bounds = bluetoothTools.umiocrClickWordBounds(res, "坚持退出");
        if (bounds.length > 0) {
            bluetoothTools.click(bounds[0], bounds[1]);//点击'坚持退出'
            return true;
        }
        //有时没有坚持退出页，直接就退出了弹窗
        let bounds1 = bluetoothTools.umiocrPerfectMatchWord(res, "书城");
        let bounds2 = bluetoothTools.umiocrPerfectMatchWord(res, "福利");
        if (bounds1.length > 0 || bounds2.length > 0) {
            return true;
        }
    }

    bluetoothTools.clickAreaForFindImage(ad_image_array);

    return true;
}

function areaForFindImage(img_path_array, area_region, threshold, is_continue) {
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
                    log(img_path + "文件不存在因此跳过")
                    continue
                }
                var little_image = images.read(img_path) //小图
                var find_result_bounds = images.findImage(
                    captureScreen(), little_image, {
                    region: area_region,
                    threshold: threshold
                });
                if (find_result_bounds) {
                    log(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                    // bluetoothTools.click(find_result_bounds.x, find_result_bounds.y)
                    return find_result_bounds;
                } else {
                    log(img_path + "小图存在但是在大图中未找到图片进入下一次循环...");
                }
            }
            return null;
        }
        if (typeof (img_path_array) == "string") {
            img_path = img_path_array//小图地址可判断是否存在
            if (!files.exists(img_path)) {
                toastLog(img_path + "文件不存在因此跳过")
                return null;
            }
            var little_image = images.read(img_path) //小图
            var find_result_bounds = images.findImage(
                captureScreen(), little_image, {
                region: area_region,
                threshold: threshold
            });
            if (find_result_bounds) {
                toastLog(img_path + "图找到，准备点击坐标：" + find_result_bounds)
                // bluetoothTools.click(find_result_bounds.x, find_result_bounds.y)
                return find_result_bounds
            } else {
                toastLog(img_path + "小图存在但是在大图中未找到图片")
                return null;
            }
        }
    } catch (error) {
        toastLog("areaForFindImage方法出现错误：" + error)
        return null;
    }
}
module.exports = fqxsapp;