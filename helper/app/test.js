//  exit()  当你在Auto.js中调用exit()函数时，脚本会立即停止运行，并返回到调用此函数之前的上下文中。
//  sleep(n)   睡眠
//  exits() 判断控件是否存在
//  waitFor() 等待控件出现
//  children()//返回该控件的所有子控件组成的控件集合。可以用于遍历一个控件的子控件
//  parent()//返回该控件的父控件。如果该控件没有父控件，返回null。
//  back()返回
//  home()Home键
//  recents()显示最近任务。
//  powerDialog()电源键菜单
//  setClip("text")//设置剪贴板内容

const h = device.height ,
    w = device.width ;
    toastLog("text h = " + h +",####### w = " + w);
    //swipe(0, 0, 0, 0, 500);
    // launchApp("头条搜索极速版");//启动App


    let qulingqu = null;
    let res = true;
    while(res){
        qulingqu  = desc("去抽奖").findOnce()
        if(qulingqu!=null){
            break
        }
        res = 展开更多()
    }
    
    while(true){
        qulingqu  = desc("去抽奖").findOnce()
        if(qulingqu==null){
            log("头条搜索极速版 未找到签到按钮");
            break
        }
        log("找到bounds 0");
        let b = qulingqu.bounds();
        log("找到bounds 1");
        if( b.centerY() > h/3*2){
            swipe(w / 2,  h/5*4, w / 2, h/4*3-500, 500);
            sleep(1000)
        }else{
            log("找到bounds 2");
            let qiandaoClick = click(b.centerX(), b.centerY());
            sleep(2000);
            if(qiandaoClick){
                log("找到bounds 3");
                // 点击签到
                //clickAreaForFindImage(dj_image_array)
                sleep(2000)
                //关闭点击
                //clickAreaForFindImage(ad_image_array)
                break
            }else{
                log("头条搜索极速版，签到, 未点击成功签到按钮");
            }
        }
        
        
    }




    function 展开更多 (){
        while(true){
            let 展开更多任务 =  desc("展开更多任务")
            let c = 展开更多任务.findOnce();
            if(c!=null){
                let b = c.bounds();
                log("展开更多任务 h = " + b.centerY() +",####### x = " + h/5*4);
                if( b.centerY() > h/5*4){
                    swipe(w / 2,  h/5*4 , w / 2,  h/5*4-500, 500);
                }else{
                    log("---------------找到任务click h = " + b.centerY() +",####### x = " + h/5*4);
                    click(b.centerX(),b.centerY())
                    sleep(2000)
                    return true;
                }
            }else{
                log("没有更多，展开更多任务");
                return false;
            }
        }
    }






















    // var scrollable = ui.findOne("现金收益");
    // scrollable.scrollTo(0, 0);
    // var topElement = text("现金收益").findOne(2000);
    // if(topElement == null){
    //     toastLog("没有找到");
    // }else{
    //     let aa = topElement.bounds();
    //      // 滑动到该元素
    //     swipe(aa.centerX(), aa.centerY(), aa.centerX(), aa.top, 500);
    // }
 
   



    // let srkang =className("com.lynx.tasm.ui.image.FlattenUIImage").depth(23).drawingOrder(1).find()
    // toastLog("今天 按钮 h = " +srkang.length);
    // let srkang1 =descContains("第").find()
    // toastLog("今天11 按钮 h = " +srkang1.length);
    // for (let index = 0; index < srkang1.length; index++) {
    //     let aa = srkang1[index]
    //     toastLog(" 按钮 h = " +aa.text());
        
    // }
    //let gb = className("com.lynx.tasm.behavior.ui.LynxFlattenUI").depth(11).drawingOrder(1).indexInParent(112);

    // app.launchApp("头条搜索极速版");//启动App
    // toastLog("头条搜索极速版")
    // sleep(9000)
    // let 我的 = text("我的").findOnce();
    // if(我的 != null ){
    //     let b = 我的.bounds();
    //     toastLog("text h = " + b.centerY() +",####### x = " + b.centerX());
    //     click(b.centerX(),b.centerY())
    //     sleep(3000)
    // }

    // let srkang = descContains("搜索框").findOnce();

  

    // let srkang = descContains("去领取").findOnce();
    // if(srkang != null ){
    //     let b = srkang.bounds();
    //     toastLog("今天 按钮 h = " + b.centerY() +",####### x = " + b.centerX());
    //      click(b.centerX(),b.centerY())
    // }

    // let djlq = text("点击领取").findOnce();
    // if(djlq != null ){
    //     let b = djlq.bounds();
    //     toastLog("今天 按钮 h = " + b.centerY() +",####### x = " + b.centerX());
    //      click(b.centerX(),b.centerY())
    // }



//     let srkang = id("com.ss.android.article.lite:id/guq").findOnce();
//     if(srkang != null ){
//         let b = srkang.bounds();
//         toastLog("点击输入框按钮 h = " + b.centerY() +",####### x = " + b.centerX());
//         click(b.centerX(),b.centerY())
//         sleep(3000)
//     }

//     let srk = id("com.ss.android.article.lite:id/da").findOne(2000);
//     if (!srk) {
//         toastLog("头条，视频搜索 "+"种牙" +"，未找到搜索输入框")
//     }
//     var aa = srk.getText();
//     log('设置文字成功' + aa)
//     srk.setText("");
//     srk.setText("种牙");
//     sleep(3000)

//     // 点击收索
//     var ss = text("搜索").findOne(2000);    
//     if(ss != null ){
//         let b = ss.bounds();
//         toastLog("搜索按钮 h = " + b.centerY() +",####### x = " + b.centerX());
//         click(b.centerX(),b.centerY())
//         sleep(3000)
//     }
//     sleep(3000)
