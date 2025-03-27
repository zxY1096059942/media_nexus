var ttjsapp = {};

let adenTools = require('../common/Tools11');
var ws = require('../common/ws');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
// const { clickAreaForFindImage } = require('../common/Tools11');

let ad_image_array = buildADArray("Image/AD", 16);//关闭按钮定义

let dj_image_array = buildDJArray("Image/DJ", 3);//点击领取按钮定义

const h = device.height ,
    w = device.width ;
setScreenMetrics(w, h);

if(!requestScreenCapture()){
    //如果请求失败则终止脚本
    exit();
}


ttjsapp.init = function (appPlan, f) {
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

//统一入口
ttjsapp.start = function (appPlan,f) {
    ttjsapp.init(appPlan, f)
    adenTools.sleepRandom9();
    adenTools.getScreenCapture();//获取手机截屏权限并自动立即开始
    ttjsapp.log("头条极速版app")
    let staDate = new Date()
    adenTools.closeUpgradetWindows()
    adenTools.adolescentWindows();//关闭青少年窗口
    同意隐私保护();
    ttjsapp.关闭弹窗()
    //ttjsapp.homePage(app,f);
    let count = 0 ;
    ttjsapp.sign1(appPlan,f);
    while(count <= 10*6){
        ttjsapp.阅读得金币(appPlan,f);
        ttjsapp.看文章或视频赚金币(appPlan,f);
        ttjsapp.看广告赚金币(appPlan,f);
        ttjsapp.开宝箱(appPlan,f)
        let endDate = new Date()
        count = adenTools.getTimeDifference(staDate ,endDate);
     }
};

ttjsapp.sign = function (app,f){
    ttjsapp.log("头条搜索极速版，签到");
    ttjsapp.直到任务中心点击();
    var result = false;
    while(true){
        let qulingqu = null;
        let res = true;
        while(res){
            qulingqu  = textStartsWith("签到").findOnce()
            if(qulingqu!=null){
                break
            }
            res = 展开更多()
        }

        if(qulingqu==null){
            ttjsapp.log("头条搜索极速版 未找到签到按钮");
            return false;
        }

        ttjsapp.log("找到bounds 0");
        let b = qulingqu.bounds();
        ttjsapp.log("找到bounds 1");
        if( b.centerY() > h/5*4){
            swipe(w / 2, h - 380, w / 2, 0, 500);
            adenTools.sleepRandom1();
            
        }
        ttjsapp.log("找到bounds 2");
        let qiandaoClick = click(b.centerX(), b.centerY());
        adenTools.sleepRandom9();
        if(qiandaoClick){
            ttjsapp.log("找到bounds 3");
            // 点击签到
            clickAreaForFindImage(dj_image_array)
            adenTools.sleepRandom9();
            //关闭点击
            clickAreaForFindImage(ad_image_array)
            break
        }else{
            ttjsapp.log("头条搜索极速版，签到, 未找到去领取按钮");
        }
        
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",0,null,111,"头条搜索极速版,开宝箱赚金币",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"头条搜索极速版,开宝箱赚金币",6,app.id,"失败","失败")
    }
}


ttjsapp.sign1 = function (app,f){
    ttjsapp.log("头条搜索极速版，签到");
    ttjsapp.直到任务中心点击();
    var result = false;

    let qulingqu = null;
    let res = true;
    while(res){
        qulingqu  = textStartsWith("签到").findOnce()
        if(qulingqu!=null){
            break
        }
        res = 展开更多()
    }
    while(true){
        qulingqu  = textStartsWith("签到").findOnce()
        if(qulingqu==null){
            ttjsapp.log("头条搜索极速版 未找到签到按钮");
            return false;
        }
        ttjsapp.log("找到bounds 0");
        let b = qulingqu.bounds();
        ttjsapp.log("找到bounds 1");
        if( b.centerY() > h/5*4){
            swipe(w / 2, h/5*4, w / 2, h/5*4-500, 500);
            adenTools.sleepRandom1();   
        }else{
            ttjsapp.log("找到bounds 2");
            let qiandaoClick = click(b.centerX(), b.centerY());
            adenTools.sleepRandom3();
            if(qiandaoClick){
                ttjsapp.log("找到bounds 3");
                // 点击签到
                clickAreaForFindImage(dj_image_array)
                adenTools.sleepRandom3();
                //关闭点击
                clickAreaForFindImage(ad_image_array)
                break
            }else{
                ttjsapp.log("头条搜索极速版，签到, 未点击领取按钮");
                break
            }
        }       
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",0,null,111,"头条搜索极速版,开宝箱赚金币",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"头条搜索极速版,开宝箱赚金币",6,app.id,"失败","失败")
    }
}
ttjsapp.阅读得金币 = function (app,f){
    ttjsapp.log("头条搜索极速版，阅读得金币");
    ttjsapp.直到任务中心点击();
    //adenTools.clickAreaForFindImage(ad_image_array)
    let result = false;
    var staDate = new Date();
    
    let yud = null;
    let res = true;
    while(res){
        yud = desc("阅读得").findOnce();
        if(yud!=null){
            break
        }
        res = 展开更多()
    }
    while(true){
        let 去阅读 = null;
        yud = desc("阅读得").findOnce();
        if(yud == null){
            toastLog("未找到去阅读得金币按钮");
        }else{
            let children = yud.parent().children();
            if(children==null || children.length ==0 ){
                toastLog("未找到去阅读得金币按钮,同级子节点");
            }else{
                for(let i = 0 ;i<children.length;i++){
                    if(children[i].text() == "阅读得"){
                        toastLog("i===" + i);
                        let j = i + 3;
                        去阅读 = children[j];
                        toastLog("阅读得金币,去阅读===" + 去阅读.text());
                    }
                } 
            }
        }
        if(去阅读==null){
            ttjsapp.log("头条搜索极速版，阅读得金币，去阅读按钮不存在");
            break; 
        }
        let msg = 去阅读.text();
        ttjsapp.log("头条搜索极速版，阅读得金币，点击按钮 text = ===" + msg);
        if(msg!="去阅读"){
            ttjsapp.log("头条搜索极速版，阅读得金币，阅读得金币任务完成");
            break; 
        }
        let b = 去阅读.bounds();
        ttjsapp.log("头条搜索极速版，阅读得金币，去阅读按钮 h = " + h/3*2 + ",b = " + b.centerY());
        if( b.centerY() > h/5*4){
            swipe(w / 2, h/5*4, w / 2, h/5*4-500, 500);
            adenTools.sleepRandom1();
        }else{
            result = true;
            click(b.centerX(),b.centerY())
            adenTools.sleepRandom3();
            ttjsapp.关闭弹窗();
            let count = 0
            while(count >= 60*1){ // 十分钟
                click(w/2,h/5*4)
                adenTools.sleepRandom3();
                let aa = 0
                while(aa < 3){
                    adenTools.randomSwipe(w, h, "上", 0, 500)
                    adenTools.sleepRandom3();
                    aa ++
                }
                back()
                adenTools.sleepRandom3();
                adenTools.randomSwipe(w, h, "上", 0, 500)
                adenTools.sleepRandom3();
                var endDate = new Date();
                count = adenTools.getTimeDifference(staDate,endDate)
            }
        }
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",num,null,111,"头条阅读赚金币",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"头条阅读赚金币",6,app.id,"失败","失败")
    }
}
ttjsapp.看文章或视频赚金币 = function (app,f){
    ttjsapp.log("头条搜索极速版，看文章或视频赚金币");
    ttjsapp.直到任务中心点击();
    //adenTools.clickAreaForFindImage(ad_image_array)
    var staDate = new Date();
    var result = false; 


    let kwzsp =  null;
    let res = true;
    while(res){
        kwzsp = desc("看文章或视频赚金币").findOne(20000);
        if(qulingqu!=null){
            break
        }
        res = 展开更多()
    }
    while(true){
        let 看文章去阅读 = null;
        kwzsp = desc("看文章或视频赚金币").findOne(20000);
        if(kwzsp == null){
            toastLog("头条搜索极速版，未找到看文章或视频赚金币按钮");
        }else{
            let children = kwzsp.parent().children();
            if(children==null || children.length ==0 ){
                toastLog("未找到看文章或视频赚金币按钮,同级子节点");
            }else{
                for(let i = 0 ;i<children.length;i++){
                        if(children[i].text() == "看文章或视频赚金币"){
                            toastLog("i===" + i);
                            let j = i + 4;
                            看文章去阅读 = children[j];
                            toastLog("看文章去阅读===" + 看文章去阅读.text());
                        }
                } 
            }
        }
        if(看文章去阅读==null){
            ttjsapp.log("头条搜索极速版，看文章或视频赚金币,未找到去阅读按钮")
            break;
        }
        let msg = 看文章去阅读.text();
        ttjsapp.log("头条搜索极速版，看文章或视频赚金币，点击按钮 text = ===" + msg);
        if(msg!="去阅读"){
            ttjsapp.log("头条搜索极速版，看文章或视频赚金币，任务完成");
            break; 
        }
        let b = 看文章去阅读.bounds();
        adenTools.sleepRandom3();
        ttjsapp.log("头条搜索极速版，看文章或视频赚金币,去阅读按钮 b.centerX() = " + b.centerX()  + ",,,b.centerY() = " +b.centerY());
        if( b.centerY() > h/5*4){
            swipe(w / 2, h/5*4, w / 2, h/5*4-500, 500);
            adenTools.sleepRandom5();
        }else{
            result = true;
            click(b.centerX(),b.centerY())
            adenTools.sleepRandom3();
            ttjsapp.关闭弹窗();
            ttjsapp.log("头条搜索极速版，看文章或视频赚金币,点击去阅读按钮");
            let count = 0
            while(count <= 60*1){ // 十分钟
                adenTools.sleepRandom9();
                var endDate = new Date();
                count = adenTools.getTimeDifference(staDate,endDate)
                adenTools.randomSwipe(w, h, "上", 3000, 5000)
            }
            adenTools.sleepRandom3();
            break;
        }  
    }
    back();
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",0,null,111,"头条搜索极速版，看文章或视频赚金币",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"头条搜索极速版，看文章或视频赚金币",6,app.id,"失败","失败")
    }
    
}
ttjsapp.看广告赚金币 = function (app,f){
    ttjsapp.log("头条搜索极速版，看广告赚金币");
    let result = false;
    let 我的 = text("我的")
    //adenTools.clickAreaForFindImage(ad_image_array)
    let wdClick = adenTools.clickControlBounds(我的);
    if(!wdClick){
        ttjsapp.log("头条搜索极速版，未找到我的按钮，失败");
    }else{
        adenTools.sleepRandom5();
        let 看广告赚金币 = desc("看广告赚金币")
        let kggClick = adenTools.clickControlBounds(看广告赚金币);
        if(kggClick){
            result = true;
            sleep(40*1000)
            back()
            adenTools.sleepRandom5()
            ttjsapp.关闭弹窗();
        }
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",null,null,111,"头条搜索极速版，看广告赚金币",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"头条搜索极速版，看广告赚金币",6,app.id,"失败","失败")
    }
}
ttjsapp.开宝箱 = function (app,f){
    ttjsapp.log("头条搜索极速版，开宝箱");
    ttjsapp.直到任务中心点击();
    var result = false;

    let kaiBaoXiang =className("com.lynx.tasm.behavior.ui.view.UIView").depth(15).drawingOrder(1).indexInParent(8)
    let kbxResult = adenTools.clickControlBounds(kaiBaoXiang)
    ttjsapp.log("头条搜索极速版，点击开宝箱得金币,result = " + kbxResult);
    if(kbxResult){
        result = true; 
        adenTools.sleepRandom5();
        ttjsapp.关闭弹窗();
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",0,null,111,"头条搜索极速版,开宝箱赚金币",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"头条搜索极速版,开宝箱赚金币",6,app.id,"失败","失败")
    }
}
// 搜索刷视频
function search(doc){
    ttjsapp.log("头条，视频搜索：  " + doc  + "开始"); 
    ttjsapp.关闭弹窗();
    adenTools.sleepRandom3();
    //let srkang = descContains("搜索框").findOnce();
    let srkang = id("com.ss.android.article.lite:id/guq");
    let srkanResult = adenTools.clickControlBounds(srkang);
    ttjsapp.关闭弹窗();
    adenTools.sleepRandom3();
    if(!srkanResult){
        toastLog("头条，视频搜索 "+doc +"，未找到搜索框按钮")
        return;
    }
    adenTools.sleepRandom3();
    ttjsapp.关闭弹窗();
    adenTools.sleepRandom3();
    let srk = id("com.ss.android.article.lite:id/da").findOne(2000);
    if (!srk) {
        ttjsapp.log("头条，视频搜索 "+doc +"，未找到搜索输入框")
        return;
    }
    var aa = srk.getText();
    ttjsapp.log('设置文字成功' + aa)
    srk.setText("");
    srk.setText(doc);
    adenTools.sleepRandom3()
    ttjsapp.关闭弹窗();
    adenTools.sleepRandom3();
    // 点击收索
    var ss = text("搜索");    
    let ssResult = adenTools.clickControlBounds(ss);
    if(!ssResult){
        ttjsapp.log("头条，视频搜索 "+doc +"，未找到收索按钮")
        return;
    }
    adenTools.sleepRandom3()
    for (let index = 0; index < 3 ; index++) {
        ttjsapp.关闭弹窗();
        adenTools.sleepRandom3();
        click(w/2,h/5*3)
        adenTools.sleepRandom3()
        ttjsapp.log("头条，视频 上滑 index==== " + index);
        let aa = 0
        while(aa < 3){
            swipe(w / 2, h/5*4, w /2, h/5, 500)
            adenTools.sleepRandom5()
            aa ++
            ttjsapp.log("头条，视频搜索 上滑 ,,,,index ====" + index + "aa====" + aa );
        }
        back()
        adenTools.sleepRandom3()
        swipe(w / 2, h/5*4, w /2, h/5, 500)
        adenTools.sleepRandom3()
    }
    返回首页();
    adenTools.sleepRandom3()
}
function 同意隐私保护 (){
    let 个人隐私保护 = desc("同意，按钮");
    let clickResult = adenTools.clickControlBounds(个人隐私保护)
    if(clickResult){
        ttjsapp.log("同意隐私保护");
        adenTools.sleepRandom5();
    }
}

ttjsapp.homePage =  function(app, f){
    ttjsapp.log("头条搜索极速版，首页刷视频")
    let staDate = new Date();
    var counstArr = new Array("新能源汽车", "种牙");
    let 头条 = text("头条");
    ttjsapp.关闭弹窗();
    adenTools.sleepRandom3();
    let clickResult = adenTools.clickControlBounds(头条);
    if(clickResult){
        adenTools.sleepRandom3();
    }else{
        ttjsapp.log("未找到，头条首页按钮，点击失败")
    }
    ttjsapp.关闭弹窗();
    adenTools.sleepRandom3();
    for(var i =  0 ; i < counstArr.length ;i++){
        search(counstArr[i])
    }
    let endDate = new Date();
    saveStorage.storageInfoData(f,"info","200",0,null,adenTools.getTimeDifference(staDate,endDate),"头条搜索极速版，首页刷视频",1,app.id,"完成","成功")
}
ttjsapp.直到任务中心点击 = function () {
    adenTools.sleepRandom3();
    toastLog("头条搜索极速版，已经进入任务中心");
    ttjsapp.关闭弹窗 ();
    var exitCondition = text("任务");
    let num = 0;
    while (true) {
        // 定义需要点击的元素
        if (exitCondition.exists()) {
            adenTools.clickControlBounds( exitCondition )
            adenTools.sleepRandom9();
            // while(true){
            //     let 展开更多任务 =  desc("展开更多任务")
            //     let c = 展开更多任务.findOnce();
            //     if(c!=null){
            //         let b = c.bounds();
            //         ttjsapp.log("展开更多任务 h = " + b.centerY() +",####### x = " + b.centerX());
            //         if( b.centerY() > h/5*4){
            //             swipe(w / 2, h/5*4, w / 2, h/5*1, 500);
            //         }else{
            //             click(b.centerX(),b.centerY())
            //             adenTools.sleepRandom3();
            //             break;
            //         }
            //     }else{
            //         ttjsapp.log("没有更多，展开更多任务");
            //         break;
            //     }
            // }
            swipe(w / 2, h/9 , w / 2, h*5, 500);
            adenTools.sleepRandom1();
            break;
        }
        num ++;
        adenTools.sleepRandom3();
        console.log("为找到头条搜索极速版<<任务>>，无法进入任务中心 第" + num  +"次！！！！！！！") ;
    }
    adenTools.sleepRandom9();
    clickAreaForFindImage(ad_image_array)
    adenTools.sleepRandom9()
    console.log("第"+ num + "次，找到头条搜索极速版<<任务>>");
}

function 返回首页 (){
    while(true){
        let 我的 = text("我的").findOnce();
        if(我的 == null){
            back()
            adenTools.sleepRandom3()
        }else{
            break;
        }
    }
}
function 同意隐私保护 (){
    let 个人隐私保护 = desc("同意，按钮");
    let clickResult = adenTools.clickControlBounds(个人隐私保护)
    if(clickResult){
        ttjsapp.log("同意隐私保护");
        adenTools.sleepRandom5();
    }
}

function 展开更多 (){
    while(true){
        let 展开更多任务 =  desc("展开更多任务")
        let c = 展开更多任务.findOnce();
        if(c!=null){
            let b = c.bounds();
            ttjsapp.log("展开更多任务 h = " + b.centerY() +",####### x = " + h/5*4);
            if( b.centerY() > h/5*4){
                adenTools.sleepRandom3()
                swipe(w / 2, h/5*4, w / 2, h/5*4-500, 500);
            }else{
                ttjsapp.log("---------------找到任务click h = " + b.centerY() +",####### x = " + h/5*4);
                click(b.centerX(),b.centerY())
                adenTools.sleepRandom3();
                return true;
            }
        }else{
            ttjsapp.log("没有更多，展开更多任务");
            return false;
        }
    }
}


ttjsapp.关闭弹窗 = function(){
    关闭添加桌面();
    取消();
    关闭1()
    关闭2()
    关闭3()
    关闭4()
    关闭5()
}

function 关闭添加桌面 (){
    let 关闭添加桌面 = descContains("关闭")
    let clickResult = adenTools.clickControlBounds(关闭添加桌面)
    if(clickResult){
        ttjsapp.log("关闭添加桌面");
        adenTools.sleepRandom3();
    }
}
function 关闭1 (){
    let 关闭1 =  className("android.view.ViewGroup").depth(8).drawingOrder(2).indexInParent(1)
    let clickResult = adenTools.clickControlBounds(关闭1)
    if(clickResult){
        ttjsapp.log("关闭1");
        adenTools.sleepRandom3();
    }
}
function 关闭2 (){
    let 关闭2 = className("com.lynx.tasm.ui.image.FlattenUIImage").depth(10).drawingOrder(1).indexInParent(13)
    let clickResult = adenTools.clickControlBounds(关闭2)
    if(clickResult){
        ttjsapp.log("关闭2");
        adenTools.sleepRandom3();
    }
}
function 关闭3 (){
    let 关闭3 = className("com.lynx.tasm.ui.image.FlattenUIImage").depth(10).drawingOrder(1).indexInParent(5);
    let clickResult = adenTools.clickControlBounds(关闭3)
    if(clickResult){
        ttjsapp.log("关闭3");
        adenTools.sleepRandom3();
    }
}
function 关闭4 (){
    let 关闭4 = className("android.view.View").depth(18).drawingOrder(0).indexInParent(1).findOnce();
    let clickResult = adenTools.clickControlBounds(关闭4)
    if(clickResult){
        ttjsapp.log("关闭4");
        adenTools.sleepRandom3();
    }
}
function 关闭5(){
    let 关闭5 =  className("android.view.ViewGroup").depth(8).drawingOrder(2).indexInParent(1).findOnce();
    if(关闭5 != null ){
        let b = 关闭5.bounds();
        toastLog("点击输入框按钮 h = " + b.centerY() +",####### x = " + b.centerX());
        click(b.centerX(),b.centerY())
    }
}
function 取消 (){
    let 取消 = descContains("取消")
    let clickResult = adenTools.clickControlBounds(取消)
    if(clickResult){
        ttjsapp.log("取消");
        adenTools.sleepRandom3();
    }
}

ttjsapp.log = function (text){
    toastLog(text);
}


function buildADArray (ad_path, ad_number) {
    let ad_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = ad_path + "/ad" + (i) + ".png"
        ad_array.push(ad_full_path)
    }
    return ad_array;
}

function buildDJArray (ad_path, ad_number) {
    let ad_array = []
    for (let i = 1; i <= ad_number; i++) {
        let ad_full_path = ad_path + "/dj" + (i) + ".png"
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
                //toastLog("正在进行第" + (i + 1) + "次找图...")
                img_path = img_path_array[i] //小图地址可判断是否存在
                if (!files.exists(img_path)) {
                    toastLog(img_path + "文件不存在因此跳过")
                    continue
                }
                var little_image = images.read(img_path) //小图
                toastLog("分辨率："+w+"*"+h+"，巡查领取按钮")
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





function main (){
    function f (){}
    ttjsapp.log("头条极速版app")
    app.launchApp("头条搜索极速版");//启动App
    adenTools.sleepRandom9();
    // ttjsapp.homePage(app,f);
    // ttjsapp.阅读得金币(app,f);
    // ttjsapp.看文章或视频赚金币(app,f);
    // ttjsapp.看广告赚金币(app,f);
    // ttjsapp.开宝箱(app,f)
    ttjsapp.sign(app,f);
}
//main();
module.exports = ttjsapp;