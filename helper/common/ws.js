importPackage(Packages["okhttp3"]); //导入包
var ws = {
    session: null,
    client: null,
    deviceId: "",
    memberId: "",
    wsurl: "",
    request: null,
    myListener: {
        onOpen: function (session, response) {
            console.log("连接成功");
            print("连接成功了");
            ws.session = session
        },
        onMessage: function (session, msg) { //msg可能是字符串，也可能是byte数组，取决于服务器送的内容
            print("接收消息：", msg);
            ws.handleMessage(msg);
        },
        onClosing: function (session, code, response) {
            print("正在关闭");
        },
        onClosed: function (session, code, response) {
            print("已关闭");
            ws.session = null;
        },
        onFailure: function (session, t, response) {
            print(t);
            print("错误");
            ws.session = null; // 这里需要考虑 断网重连
        }
    },
    handleMessage: function (msg) {

        if (msg) {
            let v = JSON.parse(msg);
            switch (v.type) {
                case 'info':
                    print("handleData: ", v.code);
                    break;
                case 'ping':
                    print("handlePing: ", v.code);
                    break;
                case 'error':
                    print("handleMsg: ", v.code);
                    break;
                default:
                    print(v.deviceId, v.memberId, v.message);
                    break;
            }
        }
    },
    reportData: function (type, code, jsonData) {

        if (this.session == null) {
            this.connect();
            sleep(500)
            return false
        } else {
            if (jsonData && type && code) {
                let json = {};
                json.type = type
                json.code = code
                json.message = jsonData
                json.deviceId = this.deviceId
                json.memberId = this.memberId
                return this.session.send(JSON.stringify(json))
            } else {
                console.log("无效数据")
            }
        }
    },

    init: function (memberId, deviceId, wsurl) {
        this.client = new OkHttpClient.Builder().retryOnConnectionFailure(true).build();
        // 需要根据自己改IP
        this.deviceId = deviceId;
        this.memberId = memberId;
        this.wsurl = wsurl;
        this.request = new Request.Builder().url(wsurl + memberId + "/" + deviceId).build(),//vscode  插件的ip地址，
        this.client.dispatcher().cancelAll();//清理一次    
            
    },

    connect: function () {
        webSocket = this.client.newWebSocket(this.request, new WebSocketListener(this.myListener)); //创建链接
    },

    run: function () {
        try {
            let jsonData = {};
            jsonData.execDay = new Date()
            jsonData.appId = 1
            jsonData.taskId = 8
            jsonData.taskName = "签到"
            jsonData.taskStatus = "完成"
            jsonData.result = "成功成功"
            jsonData.gold = 2
            jsonData.updateTime = Date.now()
            let success = this.reportData("info", "300", JSON.stringify(jsonData))
            if (!success) {
                console.log("发送失败")
            }

        } catch (e) {
            console.log(e)
        }
    }
};

module.exports = ws;
// 发送心跳
// threads.start(function () {
//     ws.init("6", "100010001", "ws://192.168.3.221:8080/h5/ws/")
//     setInterval(() => {
//         ws.run()
//     }, 60 * 1000);
// })


// 
