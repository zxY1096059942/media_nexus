var adenTools = require('../common/Tools11');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");

const h = device.height || 2400,
    w = device.width || 1280;
setScreenMetrics(w, h);
log("h:=" + h + ",w:=" + w);
let ad_image_array = buildADArray("Image/AD", 16);//关闭按钮定义

/* App V5.5.0  4小时 20分钟 */
var fqctapp = {
    appId: null,
    me: null,
    day: null,
    keyPrefix: null,
    fun: null,
    curStep: 0,
    lastGetCoinTime: 0,
    init: function (appPlan, f) {
        // 安装检测 app 
       // installApp(appPlan);
        this.appId = appPlan.id;
        this.me = appPlan.memberId;
        this.day = appPlan.planKey;
        this.keyPrefix = this.appId + "_" + this.me + "_" + this.day + "_";
        this.fun = f;
        this.curStep = 0;
        this.lastGetCoinTime = 0;
        this.stopFlag = false;
        adenTools.startApp(appPlan.appName); //启动App
        adenTools.sleepRandom7();//启动App时候等待时间        
    },
    setStopFlag: function() {
        this.stopFlag = true;
    },
    //统一入口
    start: function (appPlan, f) {

        this.init(appPlan, f)
        adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
        adenTools.sleepRandom9();
        adenTools.closeUpgradetWindows()
        adenTools.adolescentWindows();//关闭青少年窗口
        let st = adenTools.getCurrentTimeMinu();
        toastLog("打开番茄畅听");
        adenTools.sleepRandom1();
        // this.提现();
        // step 点击领现金进入后
        // step 0首次获取 今日初始金币数量 和 现金金额
        // step 1签到 -1
        // step 2听书赚金币 -1、3阅读赚金币 -1、4每日听歌赚钱-1、5看短剧赚金币-1、6金币红包雨-1、7开宝箱得金币 -1
        this.去跳转页("领现金");
        adenTools.sleepRandom7();
        this.设置金币(获取金币());
        adenTools.sleepRandom1();
        //6 周期性任务(curStep==2时可执行)  、7 周期性任务(curStep==2时可执行)
       let count =2;
        while (count>0) {
            this.签到();    //1        
            this.听书();    //2 可并行执行6、7     
            this.听歌();    //4    
            this.看短剧();  //5    
            this.阅读();    //3    
            //this.领金币任务();
            //this.红包雨任务();
            this.开宝箱任务();
            // this.领金币任务1(); 
            count--;    
        }
      
            log("番茄畅听今日任务完成");
            this.去跳转页("领现金");
            let newCoin = 获取金币();
            let num = newCoin - this.获取最新金币();
            saveStorage.storageInfoData(this.fun, "info", "200", num, null, this.获取执行时间(st), "番茄畅听-获取金币", 10, this.appId, "完成", "番茄畅听获取金币完成");
            sleep(2000);
            adenTools.clearCach(appPlan.appName)
            back();
      
    },
    设置完成标识: function (key) {
        localStorage.put(this.keyPrefix + key, true);
    },
    获取完成标识: function (key) {
        return localStorage.get(this.keyPrefix + key);
    },
    设置金币: function (coin) {
        return localStorage.put(this.keyPrefix + "bjNum", coin);
    },
    获取最新金币: function () {
        return localStorage.get(this.keyPrefix + "bjNum");
    },
    获取执行时间: function (s) {
        let start = s || 0;
        return new Date().getTime() - start;
    },
    是否完成任务: function () {
        let isSign = this.获取完成标识("sign");//1        
        let isTinshu = this.获取完成标识("tinshu");//2
        let isYuedu = this.获取完成标识("yuedu");//3
        let islistenMusic = this.获取完成标识("listenMusic");//4
        let isSeeShortplay = this.获取完成标识("seeShortplay");//5       
        let isRedPacket = true;//this.获取完成标识("redPacket");//6
        let isOpenBox = true;//this.获取完成标识("openBox");//7
        let isFinish = isSign && islistenMusic && isSeeShortplay && isYuedu && isTinshu && isRedPacket && isOpenBox;
        return isFinish;
    },
    设置执行标识: function (key, status) {
        localStorage.put(this.keyPrefix + key, status);
    },
    //跳转到某页
    去跳转页: function (page) {
        adenTools.sleepRandom3();
        clickAreaForFindImage(ad_image_array)
        toastLog("番茄畅听 跳转到" + page + "页");
        //className("android.widget.RadioButton").text("领现金").findOne(2000).parent()
        var exitCondition = className("android.widget.RadioButton").text(page);
        let num = 0;
        while (num < 5) {
            // 定义需要点击的元素
            if (adenTools.clickControlBounds(exitCondition)) {
                swipe(w / 2, h / 9, w / 2, 5 * h, 500);
                adenTools.sleepRandom1();
                return true;
            }
            num++;
            adenTools.sleepRandom9();
            clickAreaForFindImage(ad_image_array)
            log("未找到，无法进入" + page + " 第" + num + "次！！！！！！！");
        }
        toastLog("循环退出条件满足，退出循环-番茄畅听" + page);
        return false;
    },
    // 1
    签到: function () {
        let isSign = this.获取完成标识("sign");
        let step = 1;
        log(step + "、本地存储 签到状态 isSign =====》" + isSign)
        this.curStep = step;
        if (!isSign) {
            let st = adenTools.getCurrentTimeMinu();
            let lodNum = 0;
            toastLog("进入番茄畅听签到");
            var result = false;
            // TODO 先处理 签到弹窗
            adenTools.sleepRandom9();
            clickAreaForFindImage(ad_image_array)          
            while (true) {
                let quQiaoDaoAnNiu = textStartsWith("签到")
                toastLog("点击签到领金币按钮 h = " + h);
                let c = quQiaoDaoAnNiu.findOnce();
                if (c != null) {
                    let b = c.bounds();
                    if (b.centerY() > h / 3 * 2) {
                        swipe(w / 2, h - 500, w / 2, 0, 500);
                    } else {
                        let clickResult = adenTools.clickControlBounds(quQiaoDaoAnNiu)
                        if (clickResult) {
                            toastLog("签到-->点击签到");
                            let qiaoDaoTanchuang = textStartsWith("立即签到")
                            let qdtcClick = adenTools.clickControlBounds(qiaoDaoTanchuang)
                            adenTools.sleepRandom3();
                            if (qdtcClick) {
                                result = true;
                                toastLog("签到-->立即签到成功");
                                this.设置完成标识("sign");                                
                                //将每次任务存储到本地记录
                                saveStorage.storageInfoData(this.fun, "info", "200", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-签到", step, this.appId, "完成", "番茄畅听签到成功");
                                back();
                            }
                        }
                        break;
                    }
                } else {
                    toastLog("签到按钮不存在")
                    break;
                }
            }
            if (!result){
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(this.fun, "info", "201", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-签到", step, this.appId, "失败", "番茄畅听签到失败");
                toastLog("点击签到，失败");
            }
        } else {
            log(step + "、本地存储 签到状态 为 true 跳过执行");
        }

    },
    //2
    听书: function () {
        let isTinshu = this.获取完成标识("tinshu");
        let step = 2;
        this.curStep = step;
        if (!isTinshu) {
            adenTools.sleepRandom5()
            let st = adenTools.getCurrentTimeMinu();
            let lodNum = 0;
            toastLog(step + "、进入番茄畅听进入听书");
            // adenadenTools.backTo(text("听书"), 3);
            let result = false;
            this.去跳转页("首页");
            let ljlq = className("android.widget.TextView").text("小说");
            // let ljlq = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").depth(17).text("听书赚金币").findOne(2000)
            if (adenTools.clickControlBounds(ljlq)) {
                // let aa = ljlq.parent()
                toastLog("点击听书按钮");
                adenTools.sleepRandom9();
                // clickAreaForFindImage(ad_image_array)
                //TODO 进入听书界面
                // TODO 需要选择听书
                let hc = textContains("标签找书").findOne()
                if (hc) {
                    let boud = hc.bounds();
                    if (click(boud.centerX(), boud.centerY() + 300)) {
                        adenTools.sleepRandom1()
                        adenTools.clickControlBounds(className("android.widget.TextView").text("开始播放"))
                        log("可以听书啦")
                        //TODO 可能点击中间启动按钮，需要查找中间的开始按钮
                        let minu = adenTools.getCurrentTimeMinu() + 1 * 60 * 1000;
                        let newMinu = adenTools.getCurrentTimeMinu();
                        while (minu >= newMinu) {
                            // adenTools.randomSwipe(w, h, "上", 3000, 5000);
                            sleep(1 * 1000);//两分钟判断一下
                            newMinu = adenTools.getCurrentTimeMinu();
                        }
                        result = true;
                        this.设置完成标识("tinshu");                        
                        //将每次任务存储到本地记录
                        saveStorage.storageInfoData(this.fun, "info", "200", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-听书", step, this.appId, "完成", "番茄畅听成功");
                        //TODO 是否要关闭听书按钮
                        adenTools.clickControlBounds(id("com.xs.fm:id/hc"))
                        adenTools.clickControlBounds(id("com.xs.fm:id/d1n"))
                        back()
                        adenTools.clickControlBounds(className("android.widget.TextView").text("暂不加入"));
                        adenTools.clickControlBounds(className("android.widget.TextView").text("暂不收藏"));
                        back()
                        adenTools.clickControlBounds(className("android.widget.TextView").text("暂不加入"));
                        adenTools.clickControlBounds(className("android.widget.TextView").text("暂不收藏"));
                        back()
                    }

                }


            } else {
                toastLog("点击听书，失败");
            }
            if (!result) {
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(this.fun, "info", "201", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-听书", step, this.appId, "失败", "番茄畅听听书失败");
            }
        } else {
            log(step + "、本地存储 书架听书状态 为 true 跳过执行");
        }
    },
    //3
    阅读: function () {
        let isYuedu = this.获取完成标识("yuedu");
        let step = 3;
        this.curStep = step;
        if (!isYuedu) {
            adenTools.sleepRandom9()
            let st = adenTools.getCurrentTimeMinu();
            let lodNum = 0;
            toastLog(step + "、进入番茄畅听进入首页阅读");
            this.去跳转页("首页");
            let kanshu = className("android.widget.TextView").text("看书");
            if (kanshu) {
                let kanshuSheet = adenTools.clickControlBounds(kanshu)
                var result = false;
                if (kanshuSheet) {
                    let kk = kanshu.findOne();
                    toastLog("点击其中一本书的内容");//TODO
                    let canread = click(kk.bounds().centerX(), kk.bounds().centerY() + 100);
                    // let canread = id("com.xs.fm:id/hc")
                    adenTools.sleepRandom9();
                   // clickAreaForFindImage(ad_image_array)
                    if (canread) {
                        //TODO 可能点击蒙层 
                        let minu = adenTools.getCurrentTimeMinu() + 1 * 60 * 1000; //90 * 60 * 1000;
                        let newMinu = adenTools.getCurrentTimeMinu();
                        while (minu >= newMinu) {
                            // click(w - 100, h / 2);
                            adenTools.randomSwipe(w, h, "右", 3000, 5000);
                            adenTools.sleepRandom9();
                            newMinu = adenTools.getCurrentTimeMinu();
                            //TODO 这里可能有广告提示，无法往下阅读，需要处理
                        }
                        result = true
                        this.设置完成标识("yuedu");
                        // let num = getNum(lodNum);
                        //退出阅读页
                        click(w / 2, h / 2);
                        adenTools.sleepRandom1();
                        adenTools.clickControlBounds(id("com.dragon.read:id/a31"));
                        adenTools.sleepRandom1();
                        back()
                        //将每次任务存储到本地记录
                        saveStorage.storageInfoData(this.fun, "info", "200", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-阅读", step, this.appId, "完成", "番茄畅听阅读完成");

                    }
                } else {
                    toastLog("点击免费阅读，失败");
                }
                if (!result) {
                    //将每次任务存储到本地记录
                    saveStorage.storageInfoData(this.fun, "info", "201", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-阅读", step, this.appId, "失败", "番茄畅听阅读失败");
                }
            }

        } else {
            toastLog(step + "、本地存储 书架阅读状态 为 true 跳过执行");
        }

    },
    //4
    听歌: function () {
        let islistenMusic = this.获取完成标识("listenMusic");
        let step = 4;
        this.curStep = step;
        log(step + "、本地存储 听歌状态 islistenMusic =====》" + islistenMusic)
        if (!islistenMusic) {
            adenTools.sleepRandom7()
            let st = adenTools.getCurrentTimeMinu();
            let lodNum = 0;//this.获取最新金币();
            toastLog("进入番茄畅听进行听歌");
            var result = false;
            // TODO 先处理 弹窗
            adenTools.sleepRandom9();
           // clickAreaForFindImage(ad_image_array)
            this.去跳转页("首页");
            let ljlq = className("android.widget.TextView").text("音乐");
            // let ljlq = desc("去听歌")
            if (ljlq) {
                // let aa = ljlq.parent()
                toastLog("点击音乐");
                adenTools.clickControlBounds(ljlq);
                // adenTools.clickControlBounds(id("com.xs.fm:id/hc"))
                let tuijian = className("android.widget.Button").text("推荐");
                adenTools.clickControlBounds(tuijian)
                let tj = tuijian.findOne()
                click(tj.bounds().centerX(), tj.bounds().centerY() + 100);
                result = true
                log("点歌成功")
                sleep(60 * 1000 * 1);//15 分钟
                this.设置完成标识("listenMusic");
                // let num = getNum(lodNum);
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(this.fun, "info", "200", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-听歌", step, this.appId, "完成", "番茄畅听听歌成功")
                // click(w / 2, h / 2)
                adenTools.sleepRandom1()
                // if (!clickControlBounds(id("com.xs.fm:id/d0i"))) {
                //     id("com.xs.fm:id/d0i").click()
                // }
                adenTools.sleepRandom1()
                back()
            } else {
                toastLog("听歌，失败");
            }
            if (!result) {
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(this.fun, "info", "201", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-听歌", step, this.appId, "失败", "番茄畅听听歌失败")
            }
        } else {
            log(step + "、本地存储 听歌状态 为 true 跳过执行");
        }

    },
    //5
    看短剧: function () {
        let isSeeShortplay = this.获取完成标识("seeShortplay");
        let step = 5;
        this.curStep = step;
        log(step + "、本地存储 看短剧状态 isSeeShortplay =====》" + isSeeShortplay)
        if (!isSeeShortplay) {
            adenTools.sleepRandom9()
            let st = adenTools.getCurrentTimeMinu();
            let lodNum = 0;// this.获取最新金币();
            toastLog("进入番茄畅听看短剧");
            var result = false;
            // TODO 先处理 弹窗
            adenTools.sleepRandom9();
            clickAreaForFindImage(ad_image_array)
            this.去跳转页("首页");
            let ljlq = className("android.widget.TextView").text("短剧");
            if (ljlq) {
                toastLog("点击看剧");
                let tuijian = ljlq.findOnce();
                adenTools.clickControlBounds(ljlq);
                result = true
               //TODO 注意一下分辨率调整
                click(tuijian.bounds().centerX()-50, tuijian.bounds().centerY() + 600);
                // adenTools.clickControlBounds(id("com.xs.fm:id/hc"))
                //TODO 这里需要选择一个视频
                sleep(60 * 1000 * 1);//30 分钟
                this.设置完成标识("seeShortplay");
                // let num = getNum(lodNum);
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(this.fun, "info", "200", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-看短剧", step, this.appId, "完成", "番茄畅听看短剧成功")
                adenTools.clickControlBounds(id("com.xs.fm:id/d1n"))
                back()
                adenTools.clickControlBounds(className("android.widget.TextView").text("暂不加入"));
                adenTools.clickControlBounds(className("android.widget.TextView").text("暂不收藏"));
            } else {
                toastLog("看短剧，失败");
            }
            if (!result) {
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(this.fun, "info", "201", lodNum, lodNum, this.获取执行时间(st), "番茄畅听-看短剧", step, this.appId, "失败", "番茄畅听看短剧失败")
            }
        } else {
            log(step + "、本地存储 看短剧状态 为 true 跳过执行");
        }
    },
    //
    周期计划: function () {
        let isCirclePlan = this.获取完成标识("circlePlan");
        let step = 11;
        if (!isCirclePlan) {
            //未执行，则需要启动执行
            log(step + "-0、本地存储 周期计划 为 未执行 开始执行");
            let st = adenTools.getCurrentTimeMinu();
            let timeOut = 240 * 60 * 1000;//4小时20分钟
            setFixTimeTask("番茄畅听-周期计划", this.周期任务, 1000, timeOut, () => {
                fqctapp.设置执行标识("circlePlan", "2");
            });
            this.设置执行标识("circlePlan", "1");
        } else if ("1" == isCirclePlan) {
            //执行中，无需处理
            log(step + "-0、本地存储 周期计划 为 执行中 跳过执行");
        } else {
            //执行完成，无需处理
            log(step + "-0、本地存储 周期计划 为 执行完成 跳过执行");
        }
    },
    周期任务: function () {
        fqctapp.领金币任务();
        adenTools.sleepRandom1();
        //fqctapp.红包雨任务();
        adenTools.sleepRandom1();
        fqctapp.开宝箱任务();
        adenTools.sleepRandom1();
    },
    //6
    红包雨任务: function () {
        let isRedPacket = fqctapp.获取完成标识("redPacket1");
        let step = 6;
        log("本地存储 红包雨状态 isRedPacket =====》" + isRedPacket)
        if (true) {
        //if (!isRedPacket && fqctapp.curStep == 2) {
            log(step + '、番茄畅听-红包雨');
            let st = adenTools.getCurrentTimeMinu();
            let lodNum =0;// fqctapp.获取最新金币();
            // adenTools.backTo(text("领现金"), 3);
            fqctapp.去跳转页("领现金");
            //let lookProtask = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("金币红包雨");     
            let lookProtask = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("金币红包雨"); 
            log("番茄畅听，红包雨----"+lookProtask);     
            let jbhbyOne = lookProtask.findOne(20000)   
           log("番茄畅听，红包雨"+jbhbyOne);     
            let b = jbhbyOne.bounds();
            if( b.centerY() > h/4*3){
                swipe(w / 2, h/5*4, w / 2, h/5*4-500, 500);
                adenTools.sleepRandom1();
            }else{
                let jbhbyClick = adenTools.clickControlBounds(lookProtask);
               log("番茄畅听，红包雨，点击金币红包雨");
                if(jbhbyClick){
                    sleep(3000)
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
                                click(xj, yj)
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
                    if (textStartsWith("今日领现金已领取").exists()) {
                        log("红包雨已完成")
                        // let num = getNum(lodNum)
                        saveStorage.storageInfoData(fqctapp.fun, "info", "200", lodNum, lodNum, fqctapp.获取执行时间(st), "番茄畅听-红包雨", step, fqctapp.appId, "完成", "番茄畅听红包雨领取成功");
                        fqctapp.设置完成标识("redPacket");
                        return;
                    } else {
                        log("未结束！")
                    }
                } else {
                    log("红包雨未找到")
                    //将每次任务存储到本地记录
                    saveStorage.storageInfoData(fqctapp.fun, "info", "201", lodNum, lodNum, fqctapp.获取执行时间(), "番茄畅听-红包雨", step, fqctapp.appId, "失败", "番茄畅听红包雨未找到")
                }
                  
            }
        }else{
            log(step + "、本地存储 红包雨状态 为 true 跳过执行");
        }
    },
    //7
    开宝箱任务: function () {
        let isOpenBox = fqctapp.获取完成标识("openBox1");
        let step = 7;
        log("本地存储 宝箱状态 isOpenBox =====》" + isOpenBox)
        if (!isOpenBox) {
        //if (!isOpenBox && fqctapp.curStep == 2) {
            let st = adenTools.getCurrentTimeMinu();
            let lodNum = 0;//fqctapp.获取最新金币();
            // todo 需要定时执行
            log(step + '、开宝箱任务')
            fqctapp.去跳转页("领现金");
            let coinBoxBtn = className("com.lynx.tasm.behavior.ui.LynxFlattenUI").text("开宝箱得金币");
            adenTools.sleepRandom5()
            if (adenTools.clickControlBounds(coinBoxBtn)) {
                log('点击开宝箱')
                // click(coinBoxBtn.bounds().centerX(), coinBoxBtn.bounds().centerY());                
                adenTools.sleepRandom1();
                //clickAreaForFindImage(ad_image_array)
                // let num = getNum(lodNum);
                // fanqieCloseInvitationNotice();
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(fqctapp.fun, "info", "200", lodNum, lodNum, fqctapp.获取执行时间(st), "番茄畅听-开宝箱", step, fqctapp.appId, "完成", "番茄畅听开宝箱成功");
                // back();

            } else {
                log("暂无宝箱")
                //将每次任务存储到本地记录
                saveStorage.storageInfoData(fqctapp.fun, "info", "201", lodNum, lodNum, fqctapp.获取执行时间(), "番茄畅听-开宝箱", step, fqctapp.appId, "失败", "番茄畅听暂无宝箱")
            }
        } else {
            log(step + "、本地存储 宝箱状态 为 true 跳过执行");
        }
    },
    领金币任务: function () {
        //TODO 这里需要控制一下，不能一秒执行一次
        let interval = 1000 * 60 * 5;
        let tt = adenTools.getCurrentTimeMinu() - fqctapp.lastGetCoinTime;
        if (tt > interval ) {
       // if (tt > interval && fqctapp.curStep == 2) {
            // let st = adenTools.getCurrentTimeMinu();
            fqctapp.去跳转页("领现金");
            adenTools.sleepRandom1();
            let sp = 6000;
            while (sp > 300) {
                // swipe(w / 2, sp, w / 2, sp+500, 500);
                adenTools.randomSwipe(w, h, "上", 300, 500);
                if (textStartsWith("连续听书福利")) {
                    if (adenTools.clickControlBounds(className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("连续听书福利"))) {
                        log("每日听歌赚钱-领金币")
                        adenTools.sleepRandom1()
                    }
                }
                //听书领金币
                if (textStartsWith("听1分钟赚金币")) {
                    if (adenTools.clickControlBounds(className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("听1分钟赚金币"))) {
                        log("听书领金币-听1分钟赚金币")
                        adenTools.sleepRandom1()
                    }
                }
                if (textStartsWith("阅读赚金币")) {
                    if (adenTools.clickControlBounds(className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("阅读赚金币"))) {
                        log("阅读赚金币")
                        adenTools.sleepRandom1()
                    }
                }
                if (textStartsWith("看短剧赚钱")) {
                    if (adenTools.clickControlBounds(className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("看短剧赚钱"))) {
                        log("看短剧赚钱-领金币")
                        adenTools.sleepRandom1()
                    }
                }
                if (textStartsWith("每日听歌赚钱")) {
                    if (adenTools.clickControlBounds(className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("每日听歌赚钱"))) {
                        log("每日听歌赚钱-领金币")
                        adenTools.sleepRandom1()
                    }
                }
                sp = sp - 300
            }
            fqctapp.lastGetCoinTime = adenTools.getCurrentTimeMinu();
        }
    },
    领金币任务1: function () {
        //TODO 这里需要控制一下，不能一秒执行一次
        let interval = 1000 * 60 * 5;
        let tt = adenTools.getCurrentTimeMinu() - fqctapp.lastGetCoinTime;
        log("tt:" + tt)
        if (tt > interval) {
            let st = adenTools.getCurrentTimeMinu();
            fqctapp.去跳转页("领现金");
            adenTools.sleepRandom1();
            let sp = 3000;
            while (sp > 300) {
                // swipe(w / 2, h, w / 2, h-500, 500);
                adenTools.randomSwipe(w, h, "上", 300, 500);
                log("sp:" + sp)
                adenTools.sleepRandom3();
                sp = sp - 300
            }

            fqctapp.lastGetCoinTime = adenTools.getCurrentTimeMinu();
        }
    },
    //8
    提现: function () {
        adenTools.sleepRandom3();
        this.去跳转页("领现金");
        let msg = "";
        let txje = 0;
        let coin = 获取现金收益();
        if (!coin || coin < 15.00) {
            toastLog("提现金额不够，请下次再来")
            return 0;
        }
        if (!adenTools.clickControlBounds(desc("金币收益"))) {
            toastLog("没有进入金币收益区");
        } else {
            adenTools.sleepRandom5();
            toastLog("开始提现提现...")
            adenTools.sleepRandom3() //是个网页加载的慢            
            // className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("立即提现").findOne()
            let tx = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").text("立即提现").findOne(2000);
            if (tx) {//TODO 这里是个按钮
                // adenTools.clickControlBounds(textContains("去提现"));
                if (coin >= 30.00) {
                    adenTools.sleepRandom9()
                    adenTools.clickControlBounds(textContains("30.00元"));//选择金额
                    if (textContains("立即兑换").exists()) {
                        adenTools.sleepRandom9()
                        if (adenTools.clickControlBounds(textContains("立即兑换"))) {//立即兑换
                            adenTools.sleepRandom9();
                            if (adenTools.clickControlBounds(textContains("立即提现"))) {
                                adenTools.sleepRandom9()
                                if (adenTools.clickControlBounds(textContains("提取"))) {
                                    adenTools.sleepRandom9()
                                    if (adenTools.clickControlBounds(textContains("提现成功!"))) {
                                        localStorage.put(this.keyPrefix + "xianJinNum", 30)
                                        localStorage.put(this.keyPrefix + "xianJin", true);
                                        saveStorage.storageInfoData(this.fun, "info", "200", null, 30, 1, "番茄畅听-提现", 0, this.appId, "完成", "番茄畅听成功提现")
                                        adenTools.sleepRandom9()
                                        back()
                                        adenTools.sleepRandom1()
                                        back()
                                        txje = 30;
                                    }
                                }
                            }
                        } else {
                            toastLog("提现金额不够，请下次再来")
                            msg = "提现金额不够";
                        }
                    } else {
                        //TODO  这里需要关闭 我知道了的弹窗；否则无法往下进行
                    }
                }
                if (coin >= 15.00) {
                    adenTools.clickControlBounds(textContains("15.00元"));//选择金额
                    if (textContains("立即兑换").exists()) {
                        adenTools.sleepRandom9()
                        if (adenTools.clickControlBounds(textContains("立即兑换"))) {//立即兑换
                            adenTools.sleepRandom9();
                            if (adenTools.clickControlBounds(textContains("立即提现"))) {
                                adenTools.sleepRandom9()
                                if (adenTools.clickControlBounds(textContains("提取"))) {
                                    adenTools.sleepRandom9()
                                    if (adenTools.clickControlBounds(textContains("提现成功!"))) {
                                        saveStorage.storageInfoData(this.fun, "info", "200", null, 15, 1, "番茄畅听-提现", 0, this.appId, "完成", "番茄畅听成功提现")
                                        localStorage.put(this.keyPrefix + "xianJinNum", 15)
                                        localStorage.put(this.keyPrefix + "xianJin", true);
                                        adenTools.sleepRandom9()
                                        back()
                                        adenTools.sleepRandom1()
                                        back()
                                        txje = 15;
                                    }
                                }
                            }
                        } else {
                            toastLog("提现金额不够，请下次再来")
                            msg = "提现金额不够";
                        }
                    } else {
                        //TODO  这里需要关闭 我知道了的弹窗（金额不足）；否则无法往下进行
                    }
                }
                adenTools.clickControlBounds(textContains("0.50元"));//选择金额
                adenTools.sleepRandom9();
                if (textContains("立即兑换").exists()) {
                    if (adenTools.clickControlBounds(textContains("立即兑换"))) {//立即兑换
                        adenTools.sleepRandom9();
                        if (adenTools.clickControlBounds(textContains("立即提现"))) {
                            adenTools.sleepRandom9()
                            if (adenTools.clickControlBounds(textContains("提取"))) {
                                adenTools.sleepRandom9()
                                if (adenTools.clickControlBounds(textContains("提现成功!"))) {
                                    saveStorage.storageInfoData(this.fun, "info", "200", null, 0.5, 1, "番茄畅听-提现", 0, this.appId, "完成", "番茄畅听提现成功")
                                    localStorage.put(this.keyPrefix + "xianJinNum", 0.5)
                                    localStorage.put(this.keyPrefix + "xianJin", true);
                                    adenTools.sleepRandom9()
                                    back()
                                    adenTools.sleepRandom1()
                                    back()
                                    txje = 0.5;
                                }
                            }
                        }
                    } else {
                        toastLog("提现金额不够，请下次再来")
                        localStorage.put(this.keyPrefix + "xianJinNum", 0)
                        localStorage.put(this.keyPrefix + "xianJin", true);
                        msg = "提现金额不够";
                    }
                } else {
                    //TODO  这里需要关闭 我知道了的弹窗（金额不足）；否则无法往下进行
                }
            }
        }

        return txje;
    }

};
function 获取现金收益() {
    toastLog("获取现金收益")
    adenTools.sleepRandom9()
    let mycoin = text("现金收益").findOne();
    if (mycoin) {
        let boundsLeft = mycoin.bounds().left;
        let arry = mycoin.parent().children();
        let coin = 0;
        let i = 0;
        while (i <= 100) {
            if (arry[i].bounds().left == boundsLeft) {
                if (arry[i].text() && isFinite(arry[i].text())) {
                    toastLog("i----=" + i + "----------" + arry[i].text() + "------------" + arry[i].bounds() + "------left-----" + arry[i].bounds().left)
                    coin = arry[i].text();
                    break;
                }
            }
            i++;
        }
        toastLog("找到 -- 我的现金" + coin)
        return coin;
    } else {
        toastLog("未找到 -- 我的现金")
    }
    return 0;
}
// TODO 需要调试
function 获取金币() {
    log("\n【获取金币数量】")
    // fqctapp.直到任务中心点击();
    adenTools.sleepRandom9()
    clickAreaForFindImage(ad_image_array)
    adenTools.sleepRandom9()
    let mycoin = text("金币收益").findOne();
    if (mycoin) {
        let boundsLeft = mycoin.bounds().left;
        let arry = mycoin.parent().children();
        let coin = 0;
        let i = 0;
        while (i <= 200) {
            if (arry[i].bounds().left == boundsLeft) {
                if (arry[i].text() && isFinite(arry[i].text())) {
                    log("i----=" + i + "----------" + arry[i].text() + "------------" + arry[i].bounds() + "------left-----" + arry[i].bounds().left)
                    coin = arry[i].text();
                }
            }
            i++;
        }
        log("找到 -- 我的金币" + coin)
        return coin;
    } else {
        log("未找到 -- 我的金币")
    }
    return 0;
}

function isNumeric(value) {
    return isFinite(value);
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
    let newNum = 100//获取金币()
    let num = 0;
    if (newNum != null) {
        num = newNum - lodNum;
    }
    return num;
}

function setFixTimeTask(taskName, task, time, timeout, callBack) {
    // 设置一个间隔为time的定时器，并连续执行n次(在timeout 内可执行的次数，需要计算)
    let intervalId = setInterval(task, time);
    // timeout 时间后清除定时器
    setTimeout(() => {
        clearInterval(intervalId);
        if (callBack) {
            callBack();
        }
        log(taskName + " 任务执行结束。");
    }, timeout);
}



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
 * @param {可以是数组也可以是字符串，传输数组可以多次找图知道找到为止} img_path_array home
 * @param {找图区域，默认是全屏找图，该参数可以不传输} area_region 
 * @param {相似度，默认是0.8，可以不传输} threshold 
 * @returns true表示执行成功Flase表示失败
 */
function clickAreaForFindImage(img_path_array, area_region, threshold, is_continue) {
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

module.exports = fqctapp;