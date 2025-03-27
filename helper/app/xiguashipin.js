let adenTools = require('../common/Tools11');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
let bluetoothTools = require('../common/ToolsBluetooth');
let ad_image_array = buildADArray("Image/AD", 18);

var config = {
    h: 0,
    w: 0,
    appPlan: null,
}
var xiguashipin = {
    appId: null,
    me: null,
    day: null,
    keyPrefix: null,
    fun: null,
    curStep: 0,
    lastGetCoinTime: 0,
    init: function (appPlan, f) {
        this.appId = appPlan.id;
        this.me = appPlan.memberId;
        this.day = appPlan.planKey;
        this.keyPrefix = this.appId + "_" + this.me + "_" + this.day + "_";
        this.fun = f;
        this.curStep = 0;
        this.lastGetCoinTime = 0;
        adenTools.startApp(appPlan.appName); //启动App
        adenTools.sleepRandom1();//启动App时候等待时间
        // 验证进入首页
        let bounds = bluetoothTools.isFindOCRArray("首页");
        let count = 0;
        while (bounds.length == 0 && count < 10) {
            console.log("等待进入首页...", count);
            bluetoothTools.click(109.5, 2146);
            adenTools.sleepRandom3();//启动App时候等待时间
            count += 1;
            // 关闭默认提示窗
            closeDefaultWindows();
            bounds = bluetoothTools.isFindOCRArray("首页");
        }
        adenTools.toastLog("进入首页");
    },
    start: function (appPlan, callback) {
        console.log("西瓜视频, appPlan:" + JSON.stringify(appPlan));
        adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
        // 重新设置分辨率
        resetScreenMetrics();
        adenTools.sleepRandom3();
        // 初始化
        this.init(appPlan, callback);

        // 关闭默认提示窗
        // closeDefaultWindows();
        bluetoothTools.clickAreaForFindImage(ad_image_array);
        adenTools.sleepRandom1();

        let rs = this.进入活动页(appPlan, callback);
        if (!rs) {
            adenTools.toastLog("当前app脚本未进入活动页，退出");
            return false;
        }

        let currentCoin = this.获取金币();
        let coins = currentCoin;
        // 单位为：秒
        let costTime = 0;
        let staDate = new Date()
        let key = "xiguasign_" + appPlan.appId + "_" + appPlan.memberId + "_" + appPlan.planKey;
        let result = false;
        let subStartDate;
        // 签到
        let isSign = localStorage.get(key);
        if (!isSign) {
            subStartDate = new Date();
            result = this.签到(appPlan, callback);
            let costTime = adenTools.getTimeDifference(subStartDate, new Date());
            if (result) {
                let newCoin = this.获取金币();
                let getCoins = (newCoin - coins) > 0 ? (newCoin - coins) : 0;
                coins = newCoin;
                saveStorage.storageInfoData(callback, "info", "200", getCoins, null, costTime, "签到", 1, appPlan.id, "完成", "成功")
            } else {
                saveStorage.storageInfoData(callback, "info", "201", null, null, costTime, "签到", 1, appPlan.id, "失败", "失败")
            }
            localStorage.put(key, true);
            adenTools.sleepRandom1();
        } else {
            log("本地存储 签到状态 为 true 跳过执行");
        }
       
        // let totalTimes = 120 * 60
        let totalTimes = 900;
        while (costTime < totalTimes) {
            // 看视频
            subStartDate = new Date();
            // 测试使用60s, 实际11~12分钟
            // let times = (Math.floor(Math.random() * 3) + 9) * 60;
            let times = 30;
            result = this.看视频(appPlan, callback, times);
            costTime = adenTools.getTimeDifference(subStartDate, new Date());
            bluetoothTools.back();
            adenTools.sleepRandom1();
            // 重新进入获取页
            let rs = this.进入活动页(appPlan, callback);
            if (!rs) {
                adenTools.toastLog("当前app脚本未进入获取页，退出");
                break;
            }
            if (result) {
                let newCoin = this.获取金币();
                let getCoins = (newCoin - coins) > 0 ? (newCoin - coins) : 0;
                coins = newCoin;
                saveStorage.storageInfoData(callback, "info", "200", getCoins, null, costTime, "看视频", 1, appPlan.id, "完成", "成功")
            } else {
                saveStorage.storageInfoData(callback, "info", "201", null, null, costTime, "看视频", 1, appPlan.id, "失败", "失败")
            }

            // 开宝箱
            subStartDate = new Date();
            result = this.开宝箱(appPlan, callback);
            costTime = adenTools.getTimeDifference(subStartDate, new Date());
            if (result) {
                let newCoin = this.获取金币();
                let getCoins = (newCoin - coins) > 0 ? (newCoin - coins) : 0;
                coins = newCoin;
                saveStorage.storageInfoData(callback, "info", "200", getCoins, null, costTime, "开宝箱", 1, appPlan.id, "完成", "成功")
            } else {
                saveStorage.storageInfoData(callback, "info", "201", null, null, costTime, "开宝箱", 1, appPlan.id, "失败", "失败")
            }

            // 看广告赚金币
            subStartDate = new Date();
            result = this.看广告(appPlan, callback);
            costTime = adenTools.getTimeDifference(subStartDate, new Date());
            if (result) {
                let newCoin = this.获取金币();
                let getCoins = (newCoin - coins) > 0 ? (newCoin - coins) : 0;
                coins = newCoin;
                saveStorage.storageInfoData(callback, "info", "200", getCoins, null, costTime, "看广告赚金币", 1, appPlan.id, "完成", "成功")
            } else {
                saveStorage.storageInfoData(callback, "info", "201", null, null, costTime, "看广告赚金币", 1, appPlan.id, "失败", "失败")
            }

            // 领取看视频的金币
            subStartDate = new Date();
            result = this.领取看视频的金币(appPlan, callback);
            // 再领取一次
            result = this.领取看视频的金币(appPlan, callback);
            costTime = adenTools.getTimeDifference(subStartDate, new Date());
            if (result) {
                let newCoin = this.获取金币();
                let getCoins = (newCoin - coins) > 0 ? (newCoin - coins) : 0;
                coins = newCoin;
                saveStorage.storageInfoData(callback, "info", "200", getCoins, null, costTime, "领取看视频的金币", 1, appPlan.id, "完成", "成功")
            } else {
                saveStorage.storageInfoData(callback, "info", "201", null, null, costTime, "领取看视频的金币", 1, appPlan.id, "失败", "失败")
            }

            let endDate = new Date()
            costTime = adenTools.getTimeDifference(staDate, endDate);
        }
        // 删除签到缓存
        localStorage.remove(key);
        // 重新获取金币
        let newCoin = this.获取金币();
        let getCoins = (newCoin - currentCoin) > 0 ? (newCoin - currentCoin) : 0;
        costTime = adenTools.getTimeDifference(staDate, new Date());
        saveStorage.storageInfoData(callback, "info", "200", getCoins, null, costTime, "获取金币", 10, appPlan.id, "完成", "成功");
        adenTools.sleepRandom1();
        return true;
    },
    进入活动页: function (appPlan, callback) {
        // 进入活动页
        adenTools.toastLog("开始进入活动页");
        // let bounds = bluetoothTools.isFindOCRArray("我的");
        // adenTools.toastLog("我的，x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        // if (bounds.length == 0) {
        //     adenTools.toastLog("未找到【我的】控件");
        //     return false;
        // }
        // 点击
        bluetoothTools.click(972, 2143);
        adenTools.toastLog("进入我的页面");
        adenTools.sleepRandom1();
        bounds = bluetoothTools.isFindOCRArray("去赚现金");
        adenTools.toastLog("去赚现金，x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【去赚现金】控件");
            return false;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();
        adenTools.toastLog("进入活动页");
        // 关闭默认提示窗
        // closeDefaultWindows();
        bluetoothTools.clickAreaForFindImage(ad_image_array);
        adenTools.sleepRandom1();
        return true;
    },
    获取金币: function () {
        adenTools.toastLog("开始【获取金币】任务");
        let 金币 = 0;
        // 获取截图数据
        let objData = bluetoothTools.umiocrFindData();
        for (var i = 0; i < objData.data.length; i++) {
            console.log(objData.data[i].text);
            if (objData.data[i].text.indexOf("我的金币：") >= 0) {
                金币 = objData.data[i].text.replace("我的金币：", "");
                break;
            }
        }
        for (var i = 0; i < objData.data.length; i++) {
            if (objData.data[i].text == "点击领取") {
                var 坐标数组 = objData.data[i].box;
                var 左上 = 坐标数组[0];
                var 右上 = 坐标数组[1];
                var 右下 = 坐标数组[2];
                var 左下 = 坐标数组[3];
                x = 左上[0] + (右上[0] - 左上[0]) / 2;
                y = 左下[1] + (右上[1] - 左下[1]) / 2;
                adenTools.toastLog("点击领取-" + i + ", x:" + x + ",y:" + y + ",画布w:" + config.w + ",h:" + config.h);
                bluetoothTools.click(x, y);
                break;
            }
        }
        adenTools.toastLog("当前金币：" + 金币);
        adenTools.toastLog("完成【获取金币】任务");
        return 金币;
    },
    签到: function (appPlan, callback) {
        adenTools.toastLog("开始【签到】任务");
        let bounds = bluetoothTools.isFindOCRArray("签到领金币");
        adenTools.toastLog("签到领金币, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【签到领金币】控件, 滑动屏幕再找一次");
            customSwipeUp();
            sleep(1000);
            bounds = bluetoothTools.isFindOCRArray("签到领金币");
            adenTools.toastLog("签到领金币, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        }
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【签到领金币】控件");
            return false;
        }
        // 点击
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();

        // 立即签到
        bounds = bluetoothTools.isFindOCRArray("立即签到");
        adenTools.toastLog("立即签到, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【立即签到】控件");
            return false;
        }
        // 点击
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();
        let objData = bluetoothTools.umiocrFindData();
        bounds = bluetoothTools.umiocrPerfectMatchWord(objData, "打开签到提醒");
        if (bounds.length != 0) {
            adenTools.toastLog("点击【打开签到提醒】控件");
            // 点击
            bluetoothTools.click(bounds[0], bounds[1]);
        } else {
            this.看广告视频();
        }
        
        resetActivePage();
        return true;
    },
    开宝箱: function (appPlan, callback) {
        adenTools.toastLog("开始 【开宝箱】任务");
        let bounds = bluetoothTools.isFindOCRArray("点击领金币");
        adenTools.toastLog("点击领金币, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【点击领金币】控件");
            bounds = bluetoothTools.isFindOCRArray("点我必得现金");
            adenTools.toastLog("点我必得现金, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
            if (bounds.length == 0) {
                adenTools.toastLog("未找到【点我必得现金】控件");
                return false;
            }
        }
        // 点击
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();

        this.看广告视频();
        adenTools.toastLog("完成 【开宝箱】任务");
        return true;
    },
    看视频: function (appPlan, callback, times) {
        adenTools.toastLog("开始【看视频】任务");

        let objData = bluetoothTools.umiocrFindData();
        var x;
        var y;
        // 获取看视频赚金币的坐标
        let baseY = -1;
        // 获取看视频赚金币
        for (var i = 0; i < objData.data.length; i++) {
            if (objData.data[i].text.indexOf("看视频赚金币") > -1) {
                var 坐标数组 = objData.data[i].box;
                baseY = 坐标数组[0][1];
                adenTools.toastLog("可领取基准Y:" + baseY);
                break;
            }
        }

        if (baseY == -1) {
            customSwipeUp();
            sleep(1000);
            objData = bluetoothTools.umiocrFindData();
            for (var i = 0; i < objData.data.length; i++) {
                if (objData.data[i].text.indexOf("看视频赚金币") > -1) {
                    var 坐标数组 = objData.data[i].box;
                    baseY = 坐标数组[0][1];
                    adenTools.toastLog("可领取基准Y:" + baseY);
                    break;
                }
            }
        }
        if (baseY == -1) {
            adenTools.toastLog("未找到【看视频赚金币】控件");
            return false;
        }

        let bounds = [];
        for (var i = 0; i < objData.data.length; i++) {
            if (objData.data[i].text.indexOf("点击翻倍") > -1) {
                var 坐标数组 = objData.data[i].box;
                var 左上 = 坐标数组[0];
                var 右上 = 坐标数组[1];
                var 右下 = 坐标数组[2];
                var 左下 = 坐标数组[3];
                x = 左上[0] + (右上[0] - 左上[0]) / 2;
                y = 左下[1] + (右上[1] - 左下[1]) / 2;
                bounds = [x, y];
                break;
            }
        }
        adenTools.toastLog("点击翻倍, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【点击翻倍】控件");
        } else {
            // 点击
            bluetoothTools.click(bounds[0], bounds[1]);
            adenTools.sleepRandom1();
            bounds = bluetoothTools.isFindOCRArray("我知道了");
            adenTools.toastLog("我知道了, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
            if (bounds.length == 0) {
                adenTools.toastLog("未找到【我知道了】控件");
            } else {
                // 点击
                bluetoothTools.click(bounds[0], bounds[1]);
                adenTools.sleepRandom1();
            }
        }

        // 看视频
        bounds = bluetoothTools.findPerfectMatchOCRAndClick("看视频");
        for (var i = 0; i < objData.data.length; i++) {
            if (objData.data[i].text == "看视频") {
                var 坐标数组 = objData.data[i].box;
                var 左上 = 坐标数组[0];
                var 右上 = 坐标数组[1];
                var 右下 = 坐标数组[2];
                var 左下 = 坐标数组[3];
                x = 左上[0] + (右上[0] - 左上[0]) / 2;
                y = 左下[1] + (右上[1] - 左下[1]) / 2;
                if (y < baseY) {
                    continue;
                }
                bounds = [x, y];
                break;
            }
        }
        adenTools.toastLog("看视频, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【看视频】控件");
            return false;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();

        // 看短剧
        objData = bluetoothTools.umiocrFindData();
        bounds = bluetoothTools.umiocrPerfectMatchWord(objData, "短剧");
        adenTools.toastLog("短剧, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到【短剧】控件");
            bounds = bluetoothTools.umiocrPerfectMatchWord(objData, "免费短剧");
            adenTools.toastLog("免费短剧, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
            if (bounds.length == 0) {
                adenTools.toastLog("未找到【免费短剧】控件");
                return false;
            }
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();
        let staDate = new Date();
        let costTime = 0;
        while (costTime < times) {
            adenTools.toastLog("看短剧中" + costTime);
            // todo
            // adenTools.sleepRandom9();
            adenTools.sleepRandom60();
            let endDate = new Date()
            costTime = adenTools.getTimeDifference(staDate, endDate);
        }
        adenTools.toastLog("完成 【看视频】任务");
        return true;
    },
    领取看视频的金币: function (appPlan, callback) {
        adenTools.toastLog("开始 【领取看视频红包】任务");
        // 关闭默认提示窗
        // closeDefaultWindows();
        bluetoothTools.clickAreaForFindImage(ad_image_array);
        adenTools.sleepRandom1();
        let objData = bluetoothTools.umiocrFindData();
        let word = "可领取";
        var x;
        var y;
        // 获取看视频赚金币的坐标
        let baseY = -1;
        // 获取看视频赚金币
        for (var i = 0; i < objData.data.length; i++) {
            if (objData.data[i].text.indexOf("看视频赚金币") > -1) {
                var 坐标数组 = objData.data[i].box;
                baseY = 坐标数组[0][1];
                adenTools.toastLog("可领取基准Y:" + baseY);
                break;
            }
        }

        if (baseY > 1900 || baseY == -1) {
            customSwipeUp();
            sleep(1000);
            objData = bluetoothTools.umiocrFindData();
            for (var i = 0; i < objData.data.length; i++) {
                if (objData.data[i].text.indexOf("看视频赚金币") > -1) {
                    var 坐标数组 = objData.data[i].box;
                    baseY = 坐标数组[0][1];
                    adenTools.toastLog("可领取基准Y:" + baseY);
                    break;
                }
            }
        }
        if (baseY > 1900 || baseY == -1) {
            adenTools.toastLog("未找到【看视频赚金币】控件");
            return false;
        }

        for (var i = 0; i < objData.data.length; i++) {
            if (objData.data[i].text == word) {
                var 坐标数组 = objData.data[i].box;
                var 左上 = 坐标数组[0];
                var 右上 = 坐标数组[1];
                var 右下 = 坐标数组[2];
                var 左下 = 坐标数组[3];
                if (左上[1] < baseY) {
                    continue;
                }
                x = 左上[0] + (右上[0] - 左上[0]) / 2;
                y = 左下[1] + (右上[1] - 左下[1]) / 2;
                adenTools.toastLog("可领取" + i + ", x:" + x + ",y:" + y + ",画布w:" + config.w + ",h:" + config.h);
                bluetoothTools.click(x, y);
                adenTools.sleepRandom1();
                this.看广告视频();
            }
        }        
        adenTools.toastLog("完成 【领取看视频红包】任务");
        resetActivePage();
        return true;
    },
    逛街得金币: function (appPlan, callback) {
        adenTools.toastLog("未找到逛街得金币");
        return false;
    },
    看广告: function (appPlan, callback) {
        adenTools.toastLog("开始 【看广告赚金币】任务");
        let bounds = bluetoothTools.isFindOCRArray("看广告赚金币");
        adenTools.toastLog("看广告赚金币, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        
        if (bounds.length == 0) {
            customSwipeUp();
            sleep(1000);
            bounds = bluetoothTools.isFindOCRArray("看广告赚金币");
            adenTools.toastLog("看广告赚金币, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
            return false;
        }

        if (bounds.length == 0) {
            adenTools.toastLog("未找到看广告赚金币控件");
            return false;
        }
        // 点击
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom30();

        // 领取成功
        bounds = bluetoothTools.isFindOCRArray("领取成功");
        let retryTimes = 10;
        let count = 0;
        // 等待广告播放完成
        while (bounds.length == 0 && count < retryTimes) {
            adenTools.toastLog("获取控件:领取成功..., 次数：" + count);
            adenTools.sleepRandom5();
            count = count + 1;
            let objData = bluetoothTools.umiocrFindData();
            for (var i = 0; i < objData.data.length; i++) {
                if (objData.data[i].text.indexOf("广告") > -1 || objData.data[i].text.indexOf("反馈") > -1) {
                    var 坐标数组 = objData.data[i].box;
                    var 左上 = 坐标数组[0];
                    var 右上 = 坐标数组[1];
                    var 右下 = 坐标数组[2];
                    var 左下 = 坐标数组[3];
                    x = 左上[0] + (右上[0] - 左上[0]) / 2;
                    y = 左下[1] + (右上[1] - 左下[1]) / 2;
                    adenTools.toastLog("广告||反馈" + i + ", x:" + x + ",y:" + y + ",画布w:" + config.w + ",h:" + config.h);
                    bounds = [x, y];
                    break;
                }
            } 
            if (bounds.length == 0) {
                adenTools.toastLog("未获取【广告】控件，后退");
                bluetoothTools.back();
                sleep(1000);
                // 后退后，需要重新识别
                objData = bluetoothTools.umiocrFindData();
            }
            for (var i = 0; i < objData.data.length; i++) {
                if (objData.data[i].text.indexOf("领取成功") > -1) {
                    var 坐标数组 = objData.data[i].box;
                    var 左上 = 坐标数组[0];
                    var 右上 = 坐标数组[1];
                    var 右下 = 坐标数组[2];
                    var 左下 = 坐标数组[3];
                    x = 左上[0] + (右上[0] - 左上[0]) / 2;
                    y = 左下[1] + (右上[1] - 左下[1]) / 2;
                    adenTools.toastLog("领取成功" + i + ", x:" + x + ",y:" + y + ",画布w:" + config.w + ",h:" + config.h);
                    bounds = [x, y];
                    break;
                }
            } 
        }
        if (bounds.length == 0) {
            adenTools.toastLog("未找到领取成功控件");
            return false;
        }
        // 点击
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();

        // 坚持退出
        bounds = bluetoothTools.isFindOCRArray("坚持退出");
        if (bounds.length == 0) {
            adenTools.toastLog("未找到坚持退出控件");
            return false;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();
        // 开心收下
        bounds = bluetoothTools.isFindOCRArray("开心收下");
        if (bounds.length == 0) {
            adenTools.toastLog("未找到开心收下控件");
            return false;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();
        // closeDefaultWindows();
        bluetoothTools.clickAreaForFindImage(ad_image_array);
        adenTools.sleepRandom1();
        adenTools.toastLog("完成 【看广告赚金币】任务");
        resetActivePage();
        return true;
    },
    看广告视频: function (appPlan, callback) {
        adenTools.toastLog("开始 看广告视频");
        // 看广告视频
        let bounds = bluetoothTools.isFindOCRArray("看广告视频");
        adenTools.toastLog("看广告视频, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
        if (bounds.length == 0) {
            adenTools.toastLog("未找到看广告视频控件");
            return false;
        }
        // 点击
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom30();

        // 领取成功
        bounds = bluetoothTools.isFindOCRArray("领取成功");
        let retryTimes = 10;
        let count = 0;
        // 等待广告播放完成
        while (bounds.length == 0 && count < retryTimes) {
            adenTools.toastLog("获取控件:领取成功..., 次数：" + count);
            adenTools.sleepRandom5();
            count = count + 1;
            let objData = bluetoothTools.umiocrFindData();
            for (var i = 0; i < objData.data.length; i++) {
                if (objData.data[i].text.indexOf("广告") > -1 || objData.data[i].text.indexOf("反馈") > -1) {
                    var 坐标数组 = objData.data[i].box;
                    var 左上 = 坐标数组[0];
                    var 右上 = 坐标数组[1];
                    var 右下 = 坐标数组[2];
                    var 左下 = 坐标数组[3];
                    x = 左上[0] + (右上[0] - 左上[0]) / 2;
                    y = 左下[1] + (右上[1] - 左下[1]) / 2;
                    adenTools.toastLog("广告||反馈" + i + ", x:" + x + ",y:" + y + ",画布w:" + config.w + ",h:" + config.h);
                    bounds = [x, y];
                    break;
                }
            } 
            if (bounds.length == 0) {
                adenTools.toastLog("未获取【广告】控件，后退");
                bluetoothTools.back();
                sleep(1000);
                // 后退后，需要重新识别
                objData = bluetoothTools.umiocrFindData();
                bounds = [];
            }
            for (var i = 0; i < objData.data.length; i++) {
                if (objData.data[i].text.indexOf("领取成功") > -1) {
                    var 坐标数组 = objData.data[i].box;
                    var 左上 = 坐标数组[0];
                    var 右上 = 坐标数组[1];
                    var 右下 = 坐标数组[2];
                    var 左下 = 坐标数组[3];
                    x = 左上[0] + (右上[0] - 左上[0]) / 2;
                    y = 左下[1] + (右上[1] - 左下[1]) / 2;
                    adenTools.toastLog("领取成功" + i + ", x:" + x + ",y:" + y + ",画布w:" + config.w + ",h:" + config.h);
                    bounds = [x, y];
                    break;
                }
            } 
        }
        if (bounds.length == 0) {
            adenTools.toastLog("未找到领取成功控件");
            return false;
        }
        // 点击
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();

        // 坚持退出
        bounds = bluetoothTools.isFindOCRArray("坚持退出");
        if (bounds.length == 0) {
            adenTools.toastLog("未找到坚持退出控件");
            return false;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();

        // 开心收下
        bounds = bluetoothTools.isFindOCRArray("开心收下");
        if (bounds.length == 0) {
            adenTools.toastLog("未找到开心收下控件");
            return false;
        }
        bluetoothTools.click(bounds[0], bounds[1]);
        adenTools.sleepRandom1();
        adenTools.toastLog("完成 看广告视频");
        return true;
    }
}


/**
 * 设置分辨率
 */
function resetScreenMetrics() {
    let h = device.height || 2400, w = device.width || 1280;
    config.h = h;
    config.w = w;
    console.log(`当前分辨率,  w:${w}, h:${h}`);
    setScreenMetrics(w, h);
}

/**
 * 关闭默认提示窗
 */
function closeDefaultWindows() {
    var array = ["同意", "以后再说", "我知道了", "暂不更新", "好的", "不再提醒", "开心收下"];
    bluetoothTools.isOCRCZArray(array);
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
 * 向上滑动
 */
function customSwipeUp() {
    let x1 = Math.floor((Math.random() * 1 + 5) * 100);
    let y1 = Math.floor((Math.random() * 1 + 10) * 100);
    let x2 = Math.floor((Math.random() * 1 + 5) * 100);
    let y2 = Math.floor((Math.random() * 1 + 4) * 100);
    console.log("开始向上滑动, start x:" + x1 + ", start y:" + y1 + ", end x:" + x2 + ", end y:" + y2);
    bluetoothTools.swipeSpeed(x1, y1, x2, y2, 80, 1000, 500, 10);
}

/**
 * 向下滑动
 */
function customSwipeDown() {
    let x1 = Math.floor((Math.random() * 1 + 5) * 100);
    let y1 = Math.floor((Math.random() * 1 + 4) * 100);
    let x2 = Math.floor((Math.random() * 1 + 5) * 100);
    let y2 = Math.floor((Math.random() * 1 + 10) * 100);
    console.log("开始向上滑动, start x:" + x1 + ", start y:" + y1 + ", end x:" + x2 + ", end y:" + y2);
    bluetoothTools.swipeSpeed(x1, y1, x2, y2, 80, 1000, 500, 10);
}

/**
 * 还原活动页面
 */
function resetActivePage() {
    adenTools.toastLog("开始 还原活动页面");
    let bounds = bluetoothTools.isFindOCRArray("详情");
    adenTools.toastLog("详情, x:" + bounds[0] + ",y:" + bounds[1] + ",画布w:" + config.w + ",h:" + config.h);
    if (bounds.length == 0) {
        adenTools.toastLog("未找到【详情】控件");
        return false;
    }
    // 点击
    bluetoothTools.click(bounds[0], bounds[1]);
    adenTools.toastLog("完成 还原活动页面");
}

module.exports = xiguashipin;