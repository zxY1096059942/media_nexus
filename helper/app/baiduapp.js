var bdapp = {};

let adenTools = require('../common/Tools11');
var ws = require('../common/ws');
var localStorage = require("../common/localStorage");
var saveStorage = require("../common/saveStorage");
const { clickAreaForFindImage } = require('../common/Tools11');
let ad_image_array = adenTools.buildADArray("../Image/AD", 16);//关闭按钮定义

const h = device.height ,
    w = device.width ;
setScreenMetrics(w, h);

//统一入口
bdapp.start = function (appPlan,f) {

};

bdapp.翻卡 = function(app,f){
    bdapp.log("百度极速版,翻卡赢金币");
    bdapp.直到任务中心点击();
    let kaPianS 
    while(true){
        let array = textContains("翻卡赢9999金币").findOne().parent().children();
        let fk = array[2];
        if(fk){
            let b = fk.bounds();
            bdapp.log("百度极速版,翻卡赢金币 h = " + h  + "b.centerY() = " + b.centerY());
            if( b.centerY() > h/3*2){
                swipe(w / 2, h - 500, w / 2, 0, 500);
                adenTools.sleepRandom0();
            }else{
                kaPianS = fk.children();
                break;
            }
        }else{
            break; 
        }
    }
    if(kaPianS.length !=4){
        bdapp.log("百度极速版,翻卡赢金币,未找到卡片");
        return;
    }
    for (let index = 0; index < kaPianS.length; index++) {
        let element = kaPianS[kaPianS.length-1-index].bounds()      
        bdapp.log("百度极速版,翻卡赢金币,点击卡片" + index + 1);
        click(element.centerX(), element.centerY());
    }

}
//开宝箱得金币
bdapp.开宝箱 = function (app, f) {
    bdapp.log("百度极速版,开宝箱");
    bdapp.直到任务中心点击();
    adenTools.clickAreaForFindImage(ad_image_array)
    var result = false;
    adenTools.sleepRandom3();
    let kaiBaoXiang = textContains("开宝箱")
    let clickResult = adenTools.clickControlBounds(kaiBaoXiang)
    if(clickResult){
        result = true;
        adenTools.sleepRandom3(); 
        bdapp.log("百度极速版，开宝箱得金币,点击开宝箱");
        // TODO 处理百度极速版 开宝箱后续
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",111,null,null,"百度极速版,开宝箱",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"百度极速版,开宝箱",6,app.id,"失败","失败")
    }
}
// 看广告
bdapp.看广告 = function (app, f) {
    bdapp.log("百度极速版，看广告");
    bdapp.直到任务中心点击();
    var result = false;
    while(true){
        let array = textContains("看文章视频").findOne().parent().children();
        toastLog("子组件个数 ==== " +  array.length)
        let kggIndex = 0;
        for (let index = 0; index < array.length; index++) {
            let element = array[index];
            let doc = element.text();
            // toastLog("text =======>> " + doc + ", index = " + index)   
            if(doc.includes("看广告每天最高可得")){
                kggIndex = index + 1
            }     
        }
        toastLog("index1 =  " + kggIndex + "arrar = " + array);
        let kgg = array[kggIndex];

        if(kgg){
            bdapp.log("百度极速版，看广告,点击去完成 h = " + h );
            let b = kgg.bounds();
            bdapp.log("百度极速版，看广告,点击去完成 b.centerY() = " + b.centerY() );
            if( b.centerY() > h*9/10){
                bdapp.log("百度极速版，看广告,点击去完成 b.centerY()=" +b.centerY()  + "h*9/10 = " + h*9/10 );
                swipe(w / 2, h - 200, w / 2, 0, 500);
                adenTools.sleepRandom0();
            }else{
                click(b.centerX(), b.centerY());
                result = true;
                // TODO 处理看广告
                break;
            }
        }else{
            break; 
        }
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",num,null,111,"百度极速版，看广告",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"百度极速版,看广告",6,app.id,"失败","失败")
    }
}
// 看文章
bdapp.看文章 = function (kwz,app, f) {
    bdapp.log("百度极速版，看文章");
    var result = false;
    while(true){
        let array = textContains("看文章视频").findOne().parent().children();
        toastLog("子组件个数 ==== " +  array.length)
        let kwzndex = 0;
        for (let index = 0; index < array.length; index++) {
            let element = array[index];
            let doc = element.text();
            // toastLog("text =======>> " + doc + ", index = " + index)   
            if(doc==("看越多 赚越多")){
                kwzndex = index + 1
            }     
        }
        toastLog("index1 =  " + kwzndex + "arrar = " + array);
        let kwz = array[kwzndex];
        if(kwz){
            bdapp.log("百度极速版，看文章,点击去完成 h = " + h );
            let b = kwz.bounds();
            if( b.centerY() > h){
                bdapp.log("百度极速版，看文章,点击去完成 b.centerY()=" +b.centerY()  + "h/3*2 = " + h/3*2 );
                swipe(w / 2, h - 200, w / 2, 0, 500);
                adenTools.sleepRandom0();
            }else{
                click(b.centerX(), b.centerY());
                result = true;
                // TODO 处理看文章
                break;
            }
        }else{
            break; 
        }
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",num,null,111,"百度极速版，看文章",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"百度极速版,看文章",6,app.id,"失败","失败")
    }
}
// 签到
bdapp.sign = function (app, f) {
    bdapp.log("百度极速版，签到");
    bdapp.直到任务中心点击();
    adenTools.clickAreaForFindImage(ad_image_array)
    var result = false;
    while(true){
        let quQiaoDaoAnNiu = textStartsWith("去签到")
        bdapp.log("点击去签到按钮 h = " + h );
        let b = quQiaoDaoAnNiu.findOnce().bounds();
        if( b.centerY() > h/3*2){
            swipe(w / 2, h - 500, w / 2, 0, 500);
            adenTools.sleepRandom0();
        }else{
            let clickResult = adenTools.clickControlBounds(quQiaoDaoAnNiu)
            if(clickResult){
                result = true;
                bdapp.log("点击去签到按钮");
            }
            break;
        }
    }
    if(result){
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","200",num,null,111,"百度极速版，签到",6,app.id,"完成","成功")
    }else{
        //将每次任务存储到本地记录
        saveStorage.storageInfoData(f,"info","201",null,null,null,"百度极速版，签到",6,app.id,"失败","失败")
    }
}
// 首页刷视频
bdapp.homePage =  function(app, f){
    bdapp.log("百度极速版，首页刷视频")
    let staDate = new Date();
    var counstArr = new Array("新能源汽车", "种牙");
    for(var i =  0 ; i < counstArr.length ;i++){
        search(counstArr[i])
    }
    let endDate = new Date();
    saveStorage.storageInfoData(f,"info","200",0,null,adenTools.getTimeDifference(staDate,endDate),"百度极速版，首页刷视频",1,app.id,"完成","成功")
};
// 搜索刷视频
function search(doc){
    bdapp.log("视频搜索：  " + doc  + "开始"); 
    let srkan = id("com.baidu.searchbox.lite:id/eqt");//.findOne(2000) || className("android.widget.ImageView").findOne(2000) ;
    adenTools.sleepRandom5();
    
    let srkanResult = adenTools.clickControlBounds(srkan);
    if(!srkanResult){
        return;
    }
    bdapp.log("点击输入框按钮")
    adenTools.sleepRandom3();

    let srk = id("com.baidu.searchbox.lite:id/cdo").findOne(2000);//desc("请输入搜索关键词").findOne(2000);
    if (!srk) {
        bdapp.log('未找到输入框')
        return;
    }
    bdapp.log('找到输入框')
    var aa = srk.getText();
    bdapp.log('设置文字成功' + aa)
    srk.setText("");
    srk.setText(doc);
    adenTools.sleepRandom3()
    // 点击收索
    var ss = text("搜索");
    if (!ss) {
        bdapp.log('未找到收索按钮')
        return;
    }
    
    let ssResult = adenTools.clickControlBounds(ss);
    if(ssResult){
        adenTools.sleepRandom3()
        // 随机点击一个内容
        click(w*2/ 3, h/2);
        for (let index = 0; index < 3; index++) {
            adenTools.randomSwipe(w, h, "上", 3000, 5000)
            adenTools.sleepRandom3()
        }
        back()
        adenTools.sleepRandom1()
        back()
    }
    return;
    
}

bdapp.直到任务中心点击 = function () {
    adenTools.sleepRandom3();
    toastLog("百度极速版，准备进入任务中心");
    var exitCondition = id("com.baidu.searchbox.lite:id/f4t")
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
        console.log("为找到百度极速版<<任务中心>>，无法进入任务中心 第" + num  +"次！！！！！！！") ;
    }
     console.log("第"+ num + "次，百度极速版<<任务中心>>");
}
bdapp.log = function (text){
    toastLog(text);
}
function main() {

    //adenTools.startApp("百度极速版") //启动App
    // adenTools.sleepRandom5();
    function f(){};
    // 首页刷视频
    // bdapp.homePage(app,f)
    //bdapp.sign(app,f)  // 签到
    // let isSign = localStorage.get("hongguoSign");
    // if(!isSign){
        
    // }else{
    //     log("本地存储 签到状态 为 true 跳过执行"); 
    // }

    // 开宝箱
    // bdapp.开宝箱(app,f);

    // bdapp.看文章(kwz,app,f)
    // bdapp.看广告(app,f)
    bdapp.翻卡(app,f)

}

main();
