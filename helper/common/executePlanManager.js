var localStorage = require("./localStorage");
var httpClient = require("./httpClient");
var reportLogManager = require("./reportLogManager");
var loginManager = require("./loginManager");
let adenTools = require('./Tools11');
let toolsBluetooth = require('./ToolsBluetooth');

const EXEC_STATUS_WAIT_RUN = "WAIT_RUNNING";// 等待执行
const EXEC_STATUS_RUNNING = "RUNNING";// 执行中
const EXEC_STATUS_ERROR = "ERROR";// 执行失败
const EXEC_STATUS_SUCCESS = "SUCCESS";// 执行成功

const DISPLAY_FLAG_TRUE = 0;// 展示
const DISPLAY_FLAG_FALSE = 1;// 不展示

var executePlanManager = {
    data: {
        singlePlanKeyPrefix: "execPlan-",
        planKeys: "allPlanKeys",
        execPlanResultKeyPrefix: "execPlanResult-",
        undisplayAppsKey: "undisplayApps",
        intervalId: null,
        dayExecThread: null,
        singleExecAppThread: null
    },
    getPlans: function (key) {
        var plans = localStorage.get(this.data.singlePlanKeyPrefix + key);
        if (!plans) {
            console.log("executePlanManager getPlans:构造执行计划");

            let user = loginManager.getUser();
            if (!user) {
                throw new Error("用户信息不存在");
            }
            console.log("用户", user);
            let nofify = threads.disposable();
            threads.start(function () {
                // start 2025-03-26 zxy 根据用户Id, 更新 app 配置
                // 更新 app 配置
                let response = httpClient.postJson("/h5/appInfo/updateUserHelperAppStatus", {}, {"memberId": user.id});
                if (response.code) {
                    let body = rs.body;
                    console.log(body);
                } else {
                    console.log("更新 app 配置失败，没有查到，用户下 app 的配置信息");
                }
                // end

                let result = httpClient.postJson("/h5/appInfo/findMemberAndAppList", {}, { "memberId": user.id });
                console.log("app_plan result1" + result.length);
                nofify.setAndNotify(result);
            });
            let appList = nofify.blockedGet();
            console.log("app_plan result" + appList.length);
            if (appList.code) {
                throw new Error("获取app列表失败");
            }
            let undisplayApps = new Array();
            plans = new Array();
            for (i in appList) {
                console.log("appListJson:" + JSON.stringify(appList[i]));
                if (appList[i].displayFlag == DISPLAY_FLAG_FALSE) {
                    undisplayApps.push(appList[i]);
                } else if (appList[i].displayFlag == DISPLAY_FLAG_TRUE) {
                    let app = appList[i];
                    let plan = this.buildPlan(key, app);
                    console.log("plan:" + JSON.stringify(plan));
                    plans.push(plan);
                }
            }
            // 生成执行计划
            plans = this.sortPlans(plans);
            // 缓存执行计划
            localStorage.put(this.data.singlePlanKeyPrefix + key, plans);
            // 缓存不展示的app
            localStorage.put(this.data.undisplayAppsKey + key, undisplayApps);

            // 设置结果缓存
            let result = {
                state: EXEC_STATUS_WAIT_RUN,
                date: key,
                msg: ""
            };
            localStorage.put(this.data.execPlanResultKeyPrefix + key, result);

            let keys = localStorage.get(this.data.planKeys);
            if (keys) {
                keys.push(key);
                // 缓存执行计划的key
                localStorage.put(this.data.planKeys, keys);
            } else {
                localStorage.put(this.data.planKeys, [key]);
            }
        } else {
            console.log("executePlanManager getPlans:从缓存获取执行计划");
        }
        console.log("executePlanManager getPlans:结束");
        console.log("执行计划 ========================", plans);
        return plans;
    },
    buildPlan: function (key, app) {
        let user = loginManager.getUser();
        let plan = {};
        // 接口返回数据
        plan.id = app.id;
        plan.orderNum = app.orderNum;
        plan.memberId = user.id;
        plan.appName = app.appName;
        plan.appPageName = app.appPageName;
        plan.appJsPath = app.appJsPath;
        plan.appApkUrl = app.appApkUrl;
        plan.taskTime = app.taskTime;

        // 自定义数据
        plan.planKey = key;
        plan.state = EXEC_STATUS_WAIT_RUN;
        plan.appRunTime = 0;
        plan.appStartTime = null;
        plan.appEndTime = null;
        plan.appRunResult = null;
        plan.step = null;
        plan.gold = 0;
        plan.money = 0;
        return plan;
    },
    getStateDesc: function (state) {
        switch (state) {
            case EXEC_STATUS_WAIT_RUN:
                return "等待执行";
            case EXEC_STATUS_RUNNING:
                return "执行中";
            case EXEC_STATUS_ERROR:
                return "执行失败";
            case EXEC_STATUS_SUCCESS:
                return "执行成功";
            default:
                return "未知状态";
        }
    },
    getCurrentDayPlans: function () {
        let today = new Date();
        return this.getPlans(executePlanManager.getDateStr(today));
    },
    removeCurrentDayPlans: function () {
        let today = new Date();
        let todayKey = executePlanManager.getDateStr(today);
        // 前一天执行完成，清除缓存
        localStorage.remove(executePlanManager.data.singlePlanKeyPrefix + todayKey);
        localStorage.remove(executePlanManager.data.execPlanResultKeyPrefix + todayKey);
        // 缓存执行计划的key
        let keys = localStorage.get(executePlanManager.data.planKeys);
        if (keys) {
            let index = keys.indexOf(todayKey);
            if (index > -1) {
                keys.splice(index, 1);
                localStorage.put(executePlanManager.data.planKeys, keys);
            }
        }
    },
    getDateStr: function (date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    },
    sortPlans: function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 随机索引
            [array[i], array[j]] = [array[j], array[i]]; // 交换元素
        }
        return array;
    },
    execPlans: function (plans) {
        console.log("executePlanManager execPlans: 执行计划");
        let result = localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + executePlanManager.getDateStr(new Date()));
        if (result && result.state !== EXEC_STATUS_WAIT_RUN) {
            console.log("autoExecPlan 无需触发执行计划....");
            adenTools.toastLog("autoExecPlan 无需触发执行计划....");
            return 1;
        }
        if (!plans || plans.length == 0) {
            console.log("没有执行计划");
            adenTools.toastLog("没有执行计划");
            return 1;
        }
        if (executePlanManager.data.dayExecThread && executePlanManager.data.dayExecThread.isAlive()) {
            console.log("线程正在执行中，请等待");
            adenTools.toastLog("线程正在执行中，请等待");
            return 1;
        }

        // 启动新线程执行
        executePlanManager.data.dayExecThread = threads.start(function () {
            // 判断是否开启蓝牙
            try {
                let bluetooth = toolsBluetooth.ison();
                if (!bluetooth) {
                    console.log("蓝牙未开启，请开启蓝牙");
                    adenTools.toastLog("蓝牙未开启，请开启蓝牙");
                    return;
                }
            } catch (e) {
                console.log("检测蓝牙失败", e);
                adenTools.toastLog("检测蓝牙失败");
                return;
            }
            const executePlanEvent = events.emitter();
            executePlanEvent.on("report", function (appRunResult) {
                console.log("执行结果", appRunResult);
                let cachePlans = localStorage.get(executePlanManager.data.singlePlanKeyPrefix + key);
                for (pIndex in cachePlans) {
                    if (cachePlans[pIndex].id == appRunResult.id) {
                        cachePlans[pIndex].appRunTime = appRunResult.taskTime;
                        cachePlans[pIndex].step = appRunResult.step;
                        cachePlans[pIndex].gold = appRunResult.gold;
                        if (appRunResult.money !== undefined && appRunResult.money !== null) {
                            cachePlans[pIndex].money = appRunResult.money;
                        }
                        break;
                    }
                }
                localStorage.put(executePlanManager.data.singlePlanKeyPrefix + key, cachePlans);
            });
            let key = executePlanManager.getDateStr(new Date());
            let result = localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + key);
            result.state = EXEC_STATUS_RUNNING;
            localStorage.put(executePlanManager.data.execPlanResultKeyPrefix + key, result);
            console.log("dayExecThread 开始执行计划, date:" + key + " result.state:" + localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + key).state);
            adenTools.toastLog("dayExecThread 开始执行计划, date:" + key + " result.state:" + localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + key).state);
            let execApps = new Array();
            while(true){
                for (i in plans) {
                    let appPlan = plans[i];
                    console.log("dayExecThread 开始执行app:" + appPlan.appName + " 开始执行");
                    adenTools.toastLog("dayExecThread 开始执行app:" + appPlan.appName + " 开始执行");
                    // 执行
                    var appjs = require(appPlan.appJsPath);
                    executePlanManager.data.singleExecAppThread = threads.start(function () {
                        try {
                            console.log("singleExecAppThread appJsPath:" + appPlan.appJsPath);
                            let cachePlans = localStorage.get(executePlanManager.data.singlePlanKeyPrefix + key);
                            for (pIndex in cachePlans) {
                                if (cachePlans[pIndex].id == appPlan.id) {
                                    cachePlans[pIndex].state = EXEC_STATUS_RUNNING;
                                    cachePlans[pIndex].appStartTime = new Date().getTime();
                                    break;
                                }
                            }
                            localStorage.put(executePlanManager.data.singlePlanKeyPrefix + key, cachePlans);
                           
                            console.log("singleExecAppThread 准备执行");
                            adenTools.toastLog("singleExecAppThread 准备执行");
                            appjs.start(appPlan, function (appPlan) {
                                executePlanEvent.emit("report", appPlan);
                            });
                            sleep(1000);
                            // 上报
                            cachePlans = localStorage.get(executePlanManager.data.singlePlanKeyPrefix + key);
                            for (pIndex in cachePlans) {
                                if (cachePlans[pIndex].id == appPlan.id) {
                                    cachePlans[pIndex].state = EXEC_STATUS_SUCCESS;
                                    cachePlans[pIndex].appEndTime = new Date().getTime();
                                    reportLogManager.reportImmediatelyResult300(cachePlans[pIndex]);
                                    break;
                                }
                            }
                            localStorage.put(executePlanManager.data.singlePlanKeyPrefix + key, cachePlans);
                            toolsBluetooth.closeApp2(appPlan);
                            console.log("singleExecAppThread app:" + appPlan.appName + " 执行完成");
                            adenTools.toastLog("singleExecAppThread app:" + appPlan.appName + " 执行完成");
                        } catch (e) {
                            console.error("singleExecAppThread app:" + appPlan.appName + " execute error:" + e);
                            adenTools.toastLog("singleExecAppThread app:" + appPlan.appName + " execute error:" + e);
                            let cachePlans = localStorage.get(executePlanManager.data.singlePlanKeyPrefix + key);
                            for (pIndex in cachePlans) {
                                if (cachePlans[pIndex].id == appPlan.id) {
                                    cachePlans[pIndex].state = EXEC_STATUS_ERROR;
                                    cachePlans[pIndex].appEndTime = new Date().getTime();
                                    reportLogManager.reportImmediatelyResult301(cachePlans[pIndex]);
                                    break;
                                }
                            }
                            // 异常关闭app
                            toolsBluetooth.closeApp2(appPlan);
                            localStorage.put(executePlanManager.data.singlePlanKeyPrefix + key, cachePlans);
                        }
                    });
                    executePlanManager.data.singleExecAppThread.waitFor();
                    let appRunTime = appPlan.taskTime * 60;
                    let interrupt = true;
                    for (let i = 0; i <= appRunTime / 10; i++) {
                        //总共等待appRunTime分钟，每次循环等待10s
                        sleep(10000)
                        if (!executePlanManager.data.singleExecAppThread.isAlive()) {
                            console.log("dayExecThread app:" + appPlan.appName + "线程已死");
                            adenTools.toastLog("dayExecThread app:" + appPlan.appName + "线程已死");
                            interrupt = false;
                            break;
                        }
                        // log("dayExecThread app:" + appPlan.appName + " 线程等待" + (i + 1) + "0秒")
                    }
                    if (interrupt) {
                        // executePlanManager.data.singleExecAppThread.interrupt();
                        appjs.setStopFlag();
                        // let cachePlans = localStorage.get(executePlanManager.data.singlePlanKeyPrefix + key);
                        // for (pIndex in cachePlans) {
                        //     if (cachePlans[pIndex].id == appPlan.id) {
                        //         cachePlans[pIndex].state = EXEC_STATUS_ERROR;
                        //         reportLogManager.reportImmediatelyResult302(cachePlans[pIndex]);
                        //         break;
                        //     }
                        // }
                        // 等待脚本停止，设置标识后为正常停止，等待关闭即可
                        for (let i = 0; i < 5; i++) {
                            if (!executePlanManager.data.singleExecAppThread.isAlive()) {
                                break;
                            }
                            adenTools.sleepRandom30();
                        }
                        adenTools.toastLog("dayExecThread app:" + appPlan.appName + " 超时关闭");

                        // localStorage.put(executePlanManager.data.singlePlanKeyPrefix + key, cachePlans);
                    }
                    console.log("dayExecThread app:" + appPlan.appName + " 执行完成");
                    execApps.push(appPlan.appName);
                    let staDate = new Date();
                    // 等待9~11分钟
                    let waitTime = (Math.floor(Math.random() * 3) + 9) * 60;
                    let costTime = 0;
                    while (costTime < waitTime) {
                        console.log("等待下个app运行中..." + costTime);
                        adenTools.sleepRandom100();
                        costTime = adenTools.getTimeDifference(staDate, new Date());
                    }
                }

                console.log("dayExecThread 执行结束， 已经执行的app:" + execApps);

                // 获取所有的plan的结果
                let cachePlans = localStorage.get(executePlanManager.data.singlePlanKeyPrefix + key);
                let state = EXEC_STATUS_SUCCESS;
                for (pIndex in cachePlans) {
                    if (cachePlans[pIndex].state !== EXEC_STATUS_SUCCESS) {
                        state = EXEC_STATUS_ERROR;
                        break;
                    }
                }
                result = localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + key);
                result.state = state;
                localStorage.put(executePlanManager.data.execPlanResultKeyPrefix + key, result);
                console.log("dayExecThread 结束执行计划, date:" + key + " result:" + JSON.stringify(localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + key)));

            }

        });
        executePlanManager.data.dayExecThread.waitFor();
        console.log("executePlanManager execPlans: 线程已启动");
        return 0;
    },
    stopExecPlans: function () {
        console.log("executePlanManager stopExecPlans: 停止执行计划");
        if (executePlanManager.data.dayExecThread && executePlanManager.data.dayExecThread.isAlive()) {
            try {
                executePlanManager.data.dayExecThread.interrupt();
                let key = executePlanManager.getDateStr(new Date());
                let result = localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + key);
                result.state = EXEC_STATUS_WAIT_RUN;
                localStorage.put(executePlanManager.data.execPlanResultKeyPrefix + key, result);
                console.log("stopExecPlans 结束执行计划, date:" + key + " result:" + JSON.stringify(localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + key)));
            } catch (e) {
                console.error("executePlanManager dayExecThread.interrupt error:" + e);
            }
        }
        if (executePlanManager.data.singleExecAppThread && executePlanManager.data.singleExecAppThread.isAlive()) {
            try {
                executePlanManager.data.singleExecAppThread.interrupt();
            } catch (e) {
                console.error("executePlanManager singleExecAppThread.interrupt error:" + e);
            }
        }
        console.log("executePlanManager stopExecPlans: 完成停止执行计划");

    },
    startBuildPlansTask: function () {
        console.log("executePlanManager startBuildPlansTask....");
        this.data.intervalId = setInterval(() => {
            try {
                let currentday = new Date();
                let dateTime = currentday.getFullYear() + "-" + (currentday.getMonth() + 1) + "-" + currentday.getDate() + " " + currentday.getHours() + ":" + currentday.getMinutes() + ":" + currentday.getSeconds();
                console.log("executePlanManager startBuildPlansTask setInterval date:" + dateTime);
                let currentDate = executePlanManager.getDateStr(currentday);
                console.log("executePlanManager startBuildPlansTask: 构造(" + currentDate + ")执行计划....");
                executePlanManager.getCurrentDayPlans();
                console.log("executePlanManager startBuildPlansTask: 构造(" + currentDate + ")执行计划结束....");

                // 清除前一天的执行计划
                currentday.setDate(currentday.getDate() - 1);
                let yesterday = new Date(currentday);
                let yesterdayKey = executePlanManager.getDateStr(yesterday);
                console.log("executePlanManager startBuildPlansTask: 清除(" + yesterdayKey + ")执行计划....");
                // 获取前一天的执行结果
                let yesterdayResult = localStorage.get(executePlanManager.data.singlePlanKeyPrefix + yesterdayKey);
                if (yesterdayResult) {
                    // 前一天执行完成，清除缓存
                    localStorage.remove(executePlanManager.data.singlePlanKeyPrefix + yesterdayKey);
                    localStorage.remove(executePlanManager.data.execPlanResultKeyPrefix + yesterdayKey);
                    // 缓存执行计划的key
                    let keys = localStorage.get(executePlanManager.data.planKeys);
                    if (keys) {
                        let index = keys.indexOf(yesterdayKey);
                        if (index > -1) {
                            keys.splice(index, 1);
                            localStorage.put(executePlanManager.data.planKeys, keys);
                        }
                    }
                }
                console.log("executePlanManager startBuildPlansTask:清除(" + yesterdayKey + ")执行计划结束....");
                // 查看当天执行计划是否正在执行中，或者已经执行完成
                let result = localStorage.get(executePlanManager.data.execPlanResultKeyPrefix + executePlanManager.getDateStr(new Date()));
                if (!result || result.state === EXEC_STATUS_WAIT_RUN) {
                    console.log("executePlanManager startBuildPlansTask:触发执行计划....");
                    // 开始执行
                    executePlanManager.execPlans(executePlanManager.getCurrentDayPlans());
                }
                console.log("executePlanManager startBuildPlansTask setInterval end");
            } catch (e) {
                console.error("executePlanManager startBuildPlansTask error:" + e);
            }
        }, 600000); // 每10分钟执行一次
    }
}

// 自动执行创建执行计划
executePlanManager.startBuildPlansTask();

module.exports = executePlanManager;