var ws = require('./ws');
var saveStorage = {};
//发送数据到服务器
saveStorage.sendData = function(info1, type, code) {
    let jsonData = {};
    jsonData.execDay = new Date()
    jsonData.appId = info1.appId
    jsonData.taskId = info1.step
    jsonData.taskName = info1.taskName
    jsonData.taskStatus = info1.status
    jsonData.result = info1.messages
    jsonData.gold = info1.gold
    jsonData.updateTime = Date.now()
    let success = ws.reportData(type, code, JSON.stringify(jsonData))
    if (!success) {
        console.log("发送失败")
    }
}


//存储子任务数据
saveStorage.saveSubTskStorage = function(f,info) {
    let user = localStorage.get(localStorage.keys.user);
    if (!user) {
        throw new Error("用户信息不存在");
    }
    info.memberId = user.id;
    info.createTime = mTime;
    let mTime = new Date();
    // 定义要更新的数据的键 定义规则 业务key_appId_用户id_当前时间
    let key = "subTaskDataKey_"+info.appId+"_"+info.memberId+"_"+mTime+"_"+random(100000000); 
    let subTaskStorage = storages.create(key);
    // 获取当前存储的数据
    console.log(" 保存子任务数据");
    // 存储数据
    subTaskStorage.put(key, JSON.stringify(info));//存储的必须是字符串
    // 打印保存后的数据以验证
    console.log(" 打印子任务保存后的数据:" + subTaskStorage.get(key));
     //更新主任务数据
     f(info);
}

//存储信息数据
//step=100的时候给总控传对象要包括金币数
saveStorage.storageInfoData = function(f,type,code,gold,money,taskTime,taskName,step,appId,status,messages){
     let info1 = {
            gold: gold,//金币
            money: money,//提现
            taskTime: taskTime,
            taskName: taskName,
            step: step,
            id: appId,
            status: status,
            messages: messages,
        };
    //     saveStorage.saveSubTskStorage(f,info1);
        saveStorage.sendData(info1, type, code)
        if(step==100){//注意step=100的时候给总控传对象要包括金币数
            f(info1);
        }
       
    //     log("上报数据:",info1);
}

module.exports = saveStorage;