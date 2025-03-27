const MESSAGE_TYPE_INFO = "info";// 普通业务信息
const MESSAGE_TYPE_ERROR = "error";// 错误信息

const MESSAGE_CODE_100 = "100";// 系统未知错误
const MESSAGE_CODE_110 = "110";// 系统配置异常(未开启无障碍)
const MESSAGE_CODE_119 = "119";// 系统异常(系统运行异常)
const MESSAGE_CODE_120 = "120";// 系统资源不具备异常
const MESSAGE_CODE_123 = "123";// 系统错误
const MESSAGE_CODE_200 = "200";// 子任务执行结果
const MESSAGE_CODE_201 = "201";// 子任务执行失败
const MESSAGE_CODE_202 = "202";// 子任务执行中止
const MESSAGE_CODE_210 = "210";// 子任务策略配置更新成功
const MESSAGE_CODE_211 = "211";// 子任务策略配置更新失败

const MESSAGE_CODE_300 = "300";//任务执行结果
const MESSAGE_CODE_301 = "301";//任务执行失败
const MESSAGE_CODE_302 = "302";//任务执行终止
const MESSAGE_CODE_303 = "303";//提现任务执行结果
const MESSAGE_CODE_304 = "304";//提现任务执行失败
const MESSAGE_CODE_305 = "305";//提现任务执行中止
const MESSAGE_CODE_310 = "310";//策略配置更新成功
const MESSAGE_CODE_311 = "311";//策略配置更新失败
const MESSAGE_CODE_312 = "312";//账户状态更新成功
const MESSAGE_CODE_313 = "313";//账户状态更新失败

var localStorage = require("./localStorage");
var ws = require("./ws");

var reportLogManager = {
    errorLogKey: "errorLog",
    infoLogKey: "infoLog",
    reportImmediatelyResult300: function (result) {
        let log = {
            type: MESSAGE_TYPE_INFO,
            code: MESSAGE_CODE_300,
            result: result,
        }
        try {
            // 上报
            ws.reportData(log.type, log.code, log.result);
        } catch (e) {
            console.log("reportImmediatelyResult report 1 error:", e);
            // 重新上报
            reportLogManager.reportResult(log.code, log.result);
        }
    },
    reportImmediatelyResult301: function (result) {
        let log = {
            type: MESSAGE_TYPE_INFO,
            code: MESSAGE_CODE_301,
            result: result,
        }
        try {
            // 上报
            ws.reportData(log.type, log.code, log.result);
        } catch (e) {
            console.log("reportImmediatelyResult report 1 error:", e);
            // 重新上报
            reportLogManager.reportResult(log.code, log.result);
        }
    },
    reportImmediatelyResult302: function (result) {
        let log = {
            type: MESSAGE_TYPE_INFO,
            code: MESSAGE_CODE_302,
            result: result,
        }
        try {
            // 上报
            ws.reportData(log.type, log.code, log.result);
        } catch (e) {
            console.log("reportImmediatelyResult report 1 error:", e);
            // 重新上报
            reportLogManager.reportResult(log.code, log.result);
        }
    },
    reportImmediatelyResult303: function (result) {
        let log = {
            type: MESSAGE_TYPE_INFO,
            code: MESSAGE_CODE_303,
            result: result,
        }
        try {
            console.log("reportImmediatelyResult report 303 log:", log);
            // 上报
            ws.reportData(log.type, log.code, log.result);
        } catch (e) {
            console.log("reportImmediatelyResult report 1 error:", e);
            // 重新上报
            reportLogManager.reportResult(log.code, log.result);
        }
    },
    reportImmediatelyResult304: function (result) {
        let log = {
            type: MESSAGE_TYPE_INFO,
            code: MESSAGE_CODE_304,
            result: result,
        }
        try {
            // 上报
            console.log("reportImmediatelyResult report 304 log:", log);
            ws.reportData(log.type, log.code, log.result);
        } catch (e) {
            console.log("reportImmediatelyResult report 1 error:", e);
            // 重新上报
            reportLogManager.reportResult(log.code, log.result);
        }
    },
    reportImmediatelyResult305: function (result) {
        let log = {
            type: MESSAGE_TYPE_INFO,
            code: MESSAGE_CODE_305,
            result: result,
        }
        try {
            // 上报
            ws.reportData(log.type, log.code, log.result);
        } catch (e) {
            console.log("reportImmediatelyResult report 1 error:", e);
            // 重新上报
            reportLogManager.reportResult(log.code, log.result);
        }
    },
    reportResult: function (code, result) {
        let log = {
            type: MESSAGE_TYPE_INFO,
            code: code,
            result: result,
        }

        let a = localStorage.get(reportLogManager.infoLogKey);
        if (a == "" || a == null) {
            a = [[]]; 
        }
        console.log("reportImmediatelyResult a:", a );
        // if (!a) {
        //     a = [[]];
        // }
        // 获取最后一个元素
        let lastLog = a[a.length - 1];
        if (lastLog.length >= 10) {
            a.push([]);
            lastLog = a[a.length - 1];
        }
        lastLog.push(log);
        a[a.length - 1] = lastLog;
        localStorage.put(reportLogManager.infoLogKey, a);
    },
    reportErrorResult: function (code, result) {
        let log = {
            type: MESSAGE_TYPE_ERROR,
            code: code,
            result: result,
        }
        let a = localStorage.get(reportLogManager.errorLogKey);
        if (!a) {
            a = [[]];
        }
        // 获取最后一个元素
        let lastLog = a[a.length - 1];
        if (lastLog.length >= 10) {
            a.push([]);
            lastLog = a[a.length - 1];
        }
        lastLog.push(log);
        a[a.length - 1] = lastLog;
        localStorage.put(reportLogManager.errorLogKey, a);
    },
    init: function () {
        console.log("reportLogManager init ...");
        setInterval(function () {
            console.log("reportLogManager report ...");
            let a = localStorage.get(reportLogManager.infoLogKey);
            if (a && a !== "undefined" && a.length > 0) {
                let count = a.length;
                for (i = 0; i < count; i++) {
                    let logs = a.shift();
                    localStorage.put(reportLogManager.infoLogKey, a);
                    for (j in logs) {
                        let log = logs[j];
                        try {
                            // 上报
                            ws.reportData(log.type, log.code, log.result);
                        } catch (e) {
                            console.log("reportLogManager report 1 error:", e);
                            // 重新上报
                            reportLogManager.reportResult(log.code, log.result);
                        }
                    }
                    a = localStorage.get(reportLogManager.infoLogKey);
                }
            } else {
                console.log("reportLogManager report 1 无上报数据");
            }
            a = localStorage.get(reportLogManager.errorLogKey);
            if (a && a !== "undefined" && a.length > 0) {
                let count = a.length;
                for (i = 0; i < count; i++) {
                    let logs = a.shift();
                    localStorage.put(reportLogManager.errorLogKey, a);
                    for (j in logs) {
                        let log = logs[j];
                        try {
                            ws.reportData(log.type, log.code, log.result);
                        } catch (e) {
                            console.log("reportLogManager report 2 error:", e);
                            // 重新上报
                            reportLogManager.reportErrorResult(log.code, log.result);
                        }
                    }
                    a = localStorage.get(reportLogManager.errorLogKey);
                }
            } else {
                console.log("reportLogManager report 2 无上报数据");
            }
            console.log("reportLogManager end ...");
        }, 10000);
    }
}

// todo
// reportLogManager.init();

module.exports = reportLogManager;
