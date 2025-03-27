var dyapp = {};
let adenTools = require('../common/Tools11');
var ws = require('../common/ws');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
var bjNum = 0; // 获取上一个任务结束的金币数量
let ad_image_array = buildADArray("Image/AD", 15);//关闭按钮定义

const h = device.height ,
    w = device.width ;
setScreenMetrics(w, h);


dyapp.init = function (appPlan, f) {
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


dyapp.start = function (appPlan,f) {
    dyapp.init(appPlan, f)
    adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
    toastLog("打开抖音极速版APP")
    let staDate = new Date()
    adenTools.sleepRandom9();
    adenTools.closeUpgradetWindows()
    adenTools.adolescentWindows();//关闭青少年窗口
    toastLog("w：  " + w  + "  h: "+h);
    // dyapp.设置金币(appPlan,dyapp.获取金币());
    adenTools.sleepRandom9();
    back();

    let count = 0 ;
    while(count <= 10*2){
        dyapp.搜索刷视频(appPlan,f);
        let mTime = new Date();
        let isSign = localStorage.get("sign_"+appPlan.appId+"_"+appPlan.memberId+"_"+mTime);
        if(!isSign){
            dyapp.签到(app,f);
        }else{
            log("本地存储 签到状态 为 true 跳过执行"); 
        }
        adenTools.sleepRandom5();
        dyapp.开宝箱(appPlan,f);
        dyapp.预约领金币(appPlan,f);
        dyapp.逛街领金币(appPlan,f);
        dyapp.看广告得金币(appPlan,f);
        back();//返回首页
        let endDate = new Date()
        count = adenTools.getTimeDifference(staDate ,endDate);
     }
};


//去首页    已经处理
dyapp.跳转首页 = function () {
    sleep(3000);
    toastLog("抖音极速版点击首页");
    var exitCondition = text("首页");
    let num = 0;
    while (true) {
        // 定义需要点击的元素
        if (exitCondition.exists()) {
            adenTools.clickControlBounds( exitCondition )
            adenTools.sleepRandom9();
            break;
        }
        num ++;
        adenTools.sleepRandom1();
        console.log("为找到去首页，无法进入首页 第" + num  +"次！！！！！！！") ;
    }
     console.log("循环退出条件满足，退出循环");
}


//跳转任务中心    已经处理
dyapp.跳转任务中心 = function () {
    sleep(3000);
    toastLog("抖音极速版已经进入任务中心");
    var exitConditionHome = text("首页");
    var exitCondition =  id("jcp");
    let num = 0;
    while (true) {
        // 定义需要点击的元素
        if (exitConditionHome.exists()) {
            toastLog("抖音极速版已经进入-----首页");
            // 定义需要点击的元素
            if (exitCondition.exists()) {
                adenTools.clickControlBounds( exitCondition )
                toastLog("抖音极速版已经进入-----任务中心");
                adenTools.sleepRandom3();
                swipe(w / 2, h/9 , w / 2, 5*h, 500); //进入任务中心页面顶部
                adenTools.sleepRandom1();
                break;
            }
        }else{
            adenTools.sleepRandom9();
            num ++;
            back();//直到返回首页
            toastLog("back后退"+num+"次");
        }


    }

    adenTools.sleepRandom9();
    clickAreaForFindImage(ad_image_array)
    adenTools.sleepRandom9()
    dyapp.log("第"+ num + "次，找到抖音极速版去赚钱");
}

// 签到 已经处理
dyapp.签到 = function (app, f) {
    toastLog("进入抖音极速版进入签到");
    dyapp.跳转任务中心();
    var result = false;
    while(true){
        let quQiaoDaoAnNiu = textStartsWith("签到")
        dyapp.log("点击签到按钮 h = " + h );
        let c = quQiaoDaoAnNiu.findOnce();
        if(c!=null){
            let b = c.bounds();
            if( b.centerY() > h/3*2){
                swipe(w / 2, h - 500, w / 2, 0, 500);
            }else{
                let clickResult = adenTools.clickControlBounds(quQiaoDaoAnNiu)
                if(clickResult){
                    result = true;
                    adenTools.sleepRandom3();
                    dyapp.log("抖音极速版，签到-->点击立即签到");
                    let qiaoDaoTanchuang = textStartsWith("立即签到")
                    let today = qiaoDaoTanchuang.findOnce();
                    if(today!=null){
                        dyapp.log("抖音极速版，签到-->弹框立即签到按钮");
                        let newToday = today.bounds();
                        let qdtcClick = adenTools.clickControlBounds(qiaoDaoTanchuang)
                        adenTools.sleepRandom3();
                        if(qdtcClick){
                            adenTools.sleepRandom3();
                            back()
                        }  
                    }else{
                        dyapp.log("抖音极速版，签到-->在任务中心签到或已经签到");
                        back()
                    }
                   
                }
                break;
            }
        }else{
            dyapp.log("签到按钮不存在")
            break;
        }
    }
    
    if(result){
        localStorage.put("kuaishoujisubanSign",true);
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",num,null,111,"签到",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"签到",6,app.id,"失败","失败")
    }

}


// 首页刷视频  已经处理搜索
dyapp.搜索刷视频 = function(app, f){
   // dyapp.跳转首页();
    let minu =  adenTools.getCurrentTimeMinu()
    var counstArr = new Array("新能源汽车", "种牙");
    for(var i =  0 ; i < counstArr.length ;i++){
        search(counstArr[i])
    }
    let end =  adenTools.getCurrentTimeMinu()
    let num = 10
    saveStorage.storageInfoData(f,"info","200",num,null,end-minu,"首页刷视频",1,app.id,"完成","成功")
}

// 搜索刷视频  已经处理搜索
function search(textDoc){
    let minu =  adenTools.getCurrentTimeMinu() + 5*60*1000;
    adenTools.sleepRandom9();
    toastLog("视频收索：  " + textDoc  + "开始");
    let fangdajing = className("android.widget.Button").desc("搜索");
    adenTools.sleepRandom5();
    if (!fangdajing) {
        log("暂无点击放大镜")
        return;
    }
    toastLog("找到放大镜")
    adenTools.clickControlBounds(fangdajing);
    log('点击放大镜')
    adenTools.sleepRandom5() 
    let srk = className("android.widget.EditText").findOne(2000);
    if (!srk) {
        log('未找到输入框')
        return;
    }
    log('找到输入框')
    var aa = srk.getText();
    log('设置文字成功' + aa)
    srk.setText("");
    srk.setText(textDoc);
    adenTools.sleepRandom3()
    // 点击收索
    // var ss = className("android.widget.TextView")//.findOne(2000)
    var ss = text("搜索");
    if (!ss) {
        log('未找到收索按钮')
        return;
    }
    adenTools.clickControlBounds(ss);
    adenTools.sleepRandom3()
    // todo 点击视频 需要重新定位  
    click(0.2*h ,w);
    adenTools.sleepRandom3()
    // 关注
    guanZhu();
    adenTools.sleepRandom3()
    // 点赞
    dianZan()
    adenTools.sleepRandom3()
    // 评论
    pingLun()
    adenTools.sleepRandom3()
    // 收藏
    shouCang()
    adenTools.sleepRandom3()
    zhuanFa()
    adenTools.sleepRandom3()
    // 转发到日常
    let newMinu =  adenTools.getCurrentTimeMinu()
    while (minu >= newMinu) {
        newMinu =  adenTools.getCurrentTimeMinu()
        adenTools.randomSwipe(w, h, "上", 3000, 5000)
       sleep(30000);
        
    }
}

//已处理
function shouCang() {
    log("收藏")
    adenTools.sleepRandom3();
    let shoucang = className("android.widget.ImageView").id("com.ss.android.ugc.aweme.lite:id/bln");//.findOne(2000)
    if (!shoucang) {
        log("暂无收藏")
        return;
    }
    adenTools.clickControlBounds(shoucang);
    
}
//已处理
function zhuanFa() {
    log("转发")
    let fengxiang =  className("android.widget.ImageView").id("com.ss.android.ugc.aweme.lite:id/lea");//.findOne(2000)
    if(!fengxiang){
        log("暂无分享按钮")
        return;
    }
    adenTools.clickControlBounds(fengxiang);
    adenTools.sleepRandom3();
    let faBuZuoPing = className("android.widget.ImageView").id("com.ss.android.ugc.aweme.lite:id/m+n");//.findOne(2000)
    if(!faBuZuoPing){
        log("暂无转转发日常按钮")
        return;
    }
    adenTools.clickControlBounds(faBuZuoPing);
    adenTools.sleepRandom9();
    
     let fasong  =  text("转发到朋友日常")//.findOne(2000) 
     sleep(3000)
    if(!fasong){
        log("暂无转发到朋友日常按钮")
        return;
    }
    adenTools.clickControlBounds(fasong);
    //click(fasong.bounds().centerX(), fasong.bounds().centerY());
    
}
//已处理
function guanZhu() {
    log("关注")
    let guanzhu = className("android.widget.ImageView").id("com.ss.android.ugc.aweme.lite:id/d2_");//.findOne(2000) || className("android.view.ViewGroup").findOne(2000) ;
    if (!guanzhu) {
        log("暂无关注")
        return
    }
    adenTools.clickControlBounds(guanzhu)
    adenTools.sleepRandom3();
}
//已处理
function dianZan() {
    log("点赞")
    //最多敲击三次
    click(200, 200)
    sleep(100)
    click(202, 210)
}
//已处理
function pingLun() {
    log("评论")
    // desc("评论703，按钮")
    let pinglunButton = className("android.widget.ImageView").id("com.ss.android.ugc.aweme.lite:id/bx+");//.findOne(2000)
    if(!pinglunButton){
        log("暂无评论按钮")
        return;
    }
    // 点击评论
    log("找到评论按钮，点击 pinglunButton =  " + pinglunButton)
    adenTools.clickControlBounds(pinglunButton)
    adenTools.sleepRandom3();

    let pinglunKuang = id("com.ss.android.ugc.aweme.lite:id/box");//.findOne(2000) ;
    if(!pinglunKuang){
        log("暂无评论框")
        return;
    }
    // 点击评论框
    log("找到评论框，点击")
    adenTools.clickControlBounds(pinglunKuang)
    adenTools.sleepRandom3();

    let shuRuKuang = className("android.widget.EditText").findOne(2000) || id("	com.ss.android.ugc.aweme.lite:id/box").findOne(2000)
    adenTools.sleepRandom3();
    if(!shuRuKuang){
        log("暂无评论输入框")
        return;
    }
    log("找到评论输入框，点击")
     var aa = shuRuKuang.getText();
    log('评论输入框原有文字：：' + aa)
    shuRuKuang.setText("感谢主播分享");
    adenTools.sleepRandom3()
    // 点击收索
    var fs = text("发送");//.findOne(2000)
    if(!fs){
        log("暂无发送按钮")
        return;
    }
    adenTools.clickControlBounds(fs);
    // 关闭
    var guanBi = text("关闭");//.findOne(2000)
    if(!guanBi){
        log("暂无关闭按钮")
        return;
    }
    log("关闭")
    adenTools.clickControlBounds(guanBi);

}

//预约领金币
dyapp.gold = function (app, f) {
    let lodNum = localStorage.get("bjNum");
    toastLog("进入抖音极速版预约领金币");
    var goldTime = 1;
   


    if (textStartsWith("预约领金币").exists()) {
        textStartsWith("预约领金币").findOnce().click();
        adenTools.sleepRandom9();
        toastLog("进入抖音极速版预约预约领金币");
        if (textStartsWith("立即预约").exists()) {
            textStartsWith("立即预约").findOne().parent().longClick()
            toastLog("进入抖音极速版预约预约立即预约");  
            adenTools.sleepRandom3();
            var fs = text("一键领取");//.findOne(2000)
            if(!fs){
                log("暂无一键领取按钮")
                return;
            }
            adenTools.clickControlBounds(fs);
            adenTools.sleepRandom3();
            localStorage.put("gold",true);
            let num = getNum(lodNum)
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","200",num,null,goldTime,"预约领金币",7,app.id,"完成","成功")
            back();
            return;
        }
        if (textStartsWith("去预约").exists()) {
            textStartsWith("去预约").findOne().parent().longClick()
            toastLog("进入抖音极速版预约预约立即预约");
            adenTools.sleepRandom3();
            var fs = text("一键领取");//.findOne(2000)
            if(!fs){
                log("暂无一键领取按钮")
                return;
            }
            adenTools.clickControlBounds(fs);
            adenTools.sleepRandom3();
            localstorages.put("gold",true);
            let num = getNum(lodNum)
            //将每次任务存储到本地记录
            saveStorage.storageInfoData(f,"info","200",num,null,goldTime,"预约领金币",7,app.id,"完成","成功")
            back();
            return;
        }
    } else {
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,goldTime,"预约领金币",7,app.id,"失败","未找到预约领金币按钮")
        back();
        return;
        
    }
}

//逛街赚钱 //已处理
dyapp.lookProduct = function (app, f) {
    log('\n【逛街赚钱】')
    let lodNum = localStorage.get("bjNum");
    var lookProductTime = 15;
    dyapp.直到任务中心点击();
    let lookProtask = textStartsWith("逛街赚钱").findOne(2000)

    if (lookProtask) {
        if (textStartsWith("今日福利已领取").exists()) {
            log("逛街赚钱已完成")
            //将每次任务存储到本地记录
            let num = getNum(lodNum)
            saveStorage.storageInfoData(f,"info","200",num,null,lookProductTime,"逛街赚钱",5,app.id,"完成","成功")
            return;
        }
        log('【找到[${lookProtask.text()}]并点击】:${tools.superClick(lookProtask)}')
        adenTools.sleepRandom3();
        // todo 逛街领福利  需要不停的刷屏  100  暂时的需要根据实际情况调整
        adenTools.waitforUi(text("赚钱任务"), 100, () => {
            adenTools.randomSwipe(w, h, "上", 2000, 3200);
            adenTools.randomSwipe(w, h, "上", 2000, 3200)
            adenTools.randomSwipe(w, h, "下", 2000, 3200)
        })
    }else{
        log("逛街赚钱未找到")
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,lookProductTime,"逛街赚钱未找到",5,app.id,"失败","逛街赚钱未找到")
    }
     
    
}


// 看广告赚金币 已处理 每20分钟1次
dyapp.lookAD = function (app, f) {
    log('\n【看广告任务】')
    let lodNum = localStorage.get("bjNum");
    var lookADTime = 1;
    dyapp.直到任务中心点击();

    while (true) {
        var rwzx = text("看广告赚金币").find()
        if (rwzx[0]) {
            putLog("已经进入任务中心")
            let num = getNum(lodNum)
            saveStorage.storageInfoData(f,"info","200",num,null,lookADTime,"看广告任务",3,app.id,"完成","成功")
            sleep(30000);
            控件坐标点击(zq[返回(zq)], "中心")
            break
        } else {
            var zq = text("去领取").find()
            if (筛选(zq)) {
                putLog("赚钱")
                控件坐标点击(zq[返回(zq)], "中心")
                sleep(30000);
            } else {
                var zq = desc("赚钱，按钮").find()
            }
        }
    }

}


//开宝箱 已处理
dyapp.开宝箱 = function (app,f) {
    dyapp.log("抖音极速版,开宝箱得金币");
    dyapp.跳转任务中心();
    var result = false;
    let kaiBaoXiang = textStartsWith("开宝箱得金币")
    let kbxResult = adenTools.clickControlBounds(kaiBaoXiang)
    dyapp.log("点击开宝箱得金币,result = " + kbxResult);
    if(kbxResult){
        result = true; 
        adenTools.sleepRandom3();
        控件坐标点击(bx[返回(bx)], "中心")
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",num,null,openBoxTime,"开宝箱任务",2,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,openBoxTime,"开宝箱任务",2,app.id,"失败","暂无宝箱")
    }
}

function 控件坐标点击(控件, 点击范围) {
    if (控件) {
        if (点击范围 == "中心") { //点击控件中心
            var x1 = 控件.bounds().left + 控件.bounds().right
            var y1 = 控件.bounds().top + 控件.bounds().bottom
            click(x1 / 2, y1 / 2)
            putLog("点击控件坐标(" + x1 / 2 + "," + y1 / 2 + ")")
        } else if (点击范围 == "随机") { //点击随机范围
            var x2 = random(控件.bounds().left, 控件.bounds().right)
            var y2 = random(控件.bounds().top, 控件.bounds().bottom)
            click(x2, y2)
            putLog("点击控件坐标(" + x2 + "," + y2 + ")")
        } else { //未知范围
            putLog("请明确范围类型")
        }
    } else {
        putLog("控件点击出错,联系作者反馈")
    }
}

function 筛选(控件集合) {
    if (控件集合.length != 0) {
        let x = device.width
        let y = device.height
        for (i = 0; i <= 控件集合.length - 1; i++) {
            let x1 = 控件集合[i].bounds().left
            let x2 = 控件集合[i].bounds().right
            let y1 = 控件集合[i].bounds().top
            let y2 = 控件集合[i].bounds().bottom
            if (x1 >= 0 && x1 <= x && x2 >= 0 && x2 <= x && y1 >= 0 && y1 <= y && y2 >= 0 && y2 <= y) {
                return true;
            } else {
                if (i == 控件集合.length - 1) {
                    return false;
                }
            }
        }
    } else {
        return false;
    }
}

//提现
function autoCashOut(app,f) {
    let lodNum = localStorage.get("bjNum");
    var openBoxTime=1;
    // todo 需要定时执行
    log('\n【去提现】')
    dyapp.直到任务中心点击();
    let lookProtask = textStartsWith("逛街赚钱").findOne(2000)
    if (className("android.view.View").text("元").exists()) {
        toastLog("现金收益");
        let b = className("android.view.View").text("元").findOne().parent().bounds();
        let clickResult = click(b.centerX(), b.centerY());
        sleep(3000);
        if (clickResult) {
            if (className("android.view.View").text("去提现").exists()) {
                let b = className("android.view.View").text("去提现").findOne().bounds();
                let clickResult = click(b.centerX(), b.centerY());
                sleep(3000);
                if (clickResult) {
                    if (className("android.view.View").text("30元").exists()) {
                        toastLog("提现30元");
                        let b = className("android.view.View").text("30元").findOnce().parent().bounds();
                        let clickResult = click(b.centerX(), b.centerY());
                        if (clickResult) {
                            if (text("立即提现").exists()) {
                                toastLog("立即提现");
                                let clickResult = text("立即提现").findOnce().click();
                                toastLog(clickResult);
                                adenTools.sleepRandom3();
                                let num = getNum(lodNum);
                                //将每次任务存储到本地记录
                                saveStorage.storageInfoData(f,"info","200",num,30,openBoxTime,"提现任务",2,app.id,"完成","成功")
                                back();
                            }
                        }
                    }
                    if (className("android.view.View").text("15元").exists()) {
                        toastLog("提现15元");
                        let b = className("android.view.View").text("15元").findOnce().parent().bounds();
                        let clickResult = click(b.centerX(), b.centerY());
                        if (clickResult) {
                            if (text("立即提现").exists()) {
                                toastLog("立即提现");
                                let clickResult = text("立即提现").findOnce().click();
                                toastLog(clickResult);
                                adenTools.sleepRandom3();
                                let num = getNum(lodNum);
                                //将每次任务存储到本地记录
                                saveStorage.storageInfoData(f,"info","200",num,15,openBoxTime,"提现任务",2,app.id,"完成","成功")
                                back();
                            }
                        }
                    }
                    if (className("android.view.View").text("1元").exists()) {
                        toastLog("提现1元");
                        let b = className("android.view.View").text("1元").findOnce().parent().bounds();
                        let clickResult = click(b.centerX(), b.centerY());
                        if (clickResult) {
                            if (text("立即提现").exists()) {
                                toastLog("立即提现");
                                let clickResult = text("立即提现").findOnce().click();
                                toastLog(clickResult);
                                adenTools.sleepRandom3();
                                let num = getNum(lodNum);
                                //将每次任务存储到本地记录
                                saveStorage.storageInfoData(f,"info","200",num,1,openBoxTime,"提现任务",2,app.id,"完成","成功")
                                back();
                            }
                        }
                    }
                    if (className("android.view.View").text("0.3元").exists()) {
                        toastLog("提现0.3元");
                        let b = className("android.view.View").text("0.3元").findOnce().parent().bounds();
                        let clickResult = click(b.centerX(), b.centerY());
                        if (clickResult) {
                            if (text("立即提现").exists()) {
                                toastLog("立即提现");
                                let clickResult = text("立即提现").findOnce().click();
                                toastLog(clickResult);
                                adenTools.sleepRandom3();
                                let num = getNum(lodNum);
                                //将每次任务存储到本地记录
                                saveStorage.storageInfoData(f,"info","200",num,0.3,openBoxTime,"提现任务",2,app.id,"完成","成功")
                                back();
                            }
                        }
                    }
                }
            }
        }
    }
}




dyapp.log = function (text){
    toastLog(text);
}




dyapp.设置金币 = function (info,coin) {
    toastLog("设置金币" + coin);
    let mTime = new Date();
    // 定义要更新的数据的键 定义规则 业务key_appId_用户id_当前时间
    let key = "dy_bjNum"+info.appId+"_"+info.memberId+"_"+mTime.getDay(); 
    return localStorage.put(key, coin);
},
dyapp.获取首次金币 = function (info) {
    let mTime = new Date();
    // 定义要更新的数据的键 定义规则 业务key_appId_用户id_当前时间
    let key = "dy_bjNum"+info.appId+"_"+info.memberId+"_"+mTime.getDay(); 
    return localStorage.get(key);
},
// TODO 需要调试

dyapp.获取金币 = function () {
    dyapp.log("抖音极速版,获取金币收益");
    dyapp.跳转任务中心();
    toastLog("【获取金币收益数量】")
    adenTools.sleepRandom9()
    let mycoin = text("金币收益")
    let arry = mycoin.findOne().parent();
    if (arry==null) {
        return 0;
    }
    let coin = arry.findOne(textContains("0123456789"));
    let newCoin =coin.text().replace(/0123456789/g, '')
    toastLog("找到 -- 我的金币" + newCoin)
    return newCoin;
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
 * @param {可以是数组也可以是字符串，传输数组可以多次找图知道找到为止} img_path_array 
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


    
module.exports = dyapp;