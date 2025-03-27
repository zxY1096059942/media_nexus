var sysConfig = require("../common/sysConfig");
var localStorage = require("../common/localStorage");
var executePlanManager = require("../common/executePlanManager");

var indexView = {
    data: {
        dayExecThread: null,
        singleExecAppThread: null,
        plans: [],
    },
    init: function () {
        // 获取执行计划
        let plans = executePlanManager.getCurrentDayPlans();
        indexView.data.plans = plans;
    },
    initPage: function () {
        indexView.data.softName = sysConfig.softName;
        indexView.data.softVersion = sysConfig.softVersion;
        ui.layout(
            <drawer id="drawer">
                <relative id="mainWindows">
                    <viewpager id="viewpager">
                        {/* 首页 */}
                        <vertical id="startpage" >
                            <vertical>
                                {/* 头部 */}
                                <appbar>
                                    <toolbar bg="#FF5c50e6" id="toolbar" title="{{indexView.data.softName}}" paddingTop="2dp" h="auto" >
                                    </toolbar>
                                    <tabs id="drawerTabs" />
                                </appbar>
                                <viewpager id="woolView" >
                                    {/* 自动刷页面 */}
                                    <frame id="frameFirstTab">
                                        <scroll>
                                            <vertical gravity="center">
                                                <list id="appList" hasFixedSize="true">
                                                    <card w="*" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" foreground="?selectableItemBackground">
                                                        <horizontal gravity="center_vertical">
                                                            <horizontal h="auto" w="auto">
                                                                <input id="appId" text="{{this.id}}" inputType="none" padding="8 8 8 8" w="40" gravity="center" visibility="gone" />
                                                                <text id="orderNum" text="{{this.orderNum}}" padding="8 8 8 8" textStyle="bold" size="16" />
                                                            </horizontal>
                                                            <horizontal h="auto" w="0" layout_weight="5">
                                                                <text id="appName" text="{{this.appName}}" textColor="#222222" textSize="16sp" maxLines="1" />
                                                            </horizontal>
                                                            <horizontal h="auto" w="auto">
                                                                <text id="taskTime" color="#228B22" size="16" text="{{this.taskTime}}" />
                                                                <text color="#228B22" size="16" text="分钟" />
                                                            </horizontal>
                                                            <horizontal h="auto" w="auto">
                                                                <checkbox id="done" marginLeft="4" checked="{{this.selected}}" marginRight="6" />
                                                            </horizontal>
                                                        </horizontal>
                                                    </card>
                                                </list>
                                                {/* 占位符 */}
                                                <card h="40" w="*" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" foreground="?selectableItemBackground">
                                                </card>
                                            </vertical>
                                        </scroll>
                                        <horizontal gravity="right|bottom">
                                            <button style="Widget.AppCompat.Button.Colored" id="btnAllCheck" text="全选" padding="12dp" w="auto" />
                                            <button style="Widget.AppCompat.Button.Colored" id="btnExecute" text="开始" padding="12dp" w="auto" />
                                            <button style="Widget.AppCompat.Button.Colored" id="btnSaveConfig" text="保存" />
                                        </horizontal>
                                    </frame>

                                    {/* 系统配置页面 */}
                                    <frame id="frameFourTab ">
                                        <scroll>
                                            <vertical>
                                                {/* 是否开启控制台 */}
                                                <vertical>
                                                    <horizontal >
                                                        <img w="45" h="45" padding="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAZklEQVRYR+2WQQrAMAgEJy9v+vKWQAmhN0VIKePZXWUQ1gZ04CBW56NbVSmfBlyx2bN7aNdK+biABCQgAQl8gkAqRCrDKJlFNbJ3otW4BlxcYBDYfoSpTwbwI5KABCQggf8Q2BpGNzebPgmO8w3jAAAAAElFTkSuQmCC"></img>
                                                        <Switch id="autoService" paddingTop="12" text="开启无障碍服务" textColor="red" textSize="15sp" />
                                                    </horizontal>
                                                </vertical>
                                                <vertical>
                                                    <horizontal >
                                                        <img w="50" h="50" padding="16" src="data:image/png;base64,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"></img>
                                                        <Switch id="switchEnbleFloating" paddingTop="16" text="开启悬浮窗权限" textSize="15sp" textColor="red" />
                                                    </horizontal>
                                                </vertical>
                                                <horizontal>
                                                    <button style="Widget.AppCompat.Button.Colored" id="btnSaveWoolConfig" text="保存配置" padding="12dp" w="*" />
                                                </horizontal>
                                            </vertical>
                                        </scroll>
                                    </frame>
                                </viewpager>
                            </vertical>
                        </vertical>
                    </viewpager>
                </relative>
            </drawer>
        );

        // 设置页面信息
        ui.woolView.setTitles(["自动刷", "系统配置"]);//设置滑动页面的标题
        ui.drawerTabs.setupWithViewPager(ui.woolView);//让滑动页面和标签栏联动
        activity.setSupportActionBar(ui.toolbar);
        activity.window.addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);//设置全屏
        ui.viewpager.overScrollMode = android.view.View.OVER_SCROLL_NEVER;//删除滑动到底时的边缘阴影
        ui.viewpager.currentItem = ui.viewpager.childCount;//点击跳过则跳转到最后一页
        // 设置列表数据
        ui.appList.setDataSource(indexView.data.plans);
    },
    registerEvent: function () {
        // 绑定card与checkbox状态
        ui.appList.on("item_bind", function (itemView, itemHolder) {
            //绑定勾选框事件
            itemView.done.on("check", function (checked) {
                let item = itemHolder.item;
                item.selected = checked;
                console.log("勾选状态：" + checked);
                console.log("item：" + JSON.stringify(item));
            });
        });
        ui.appList.on("item_click", function (item, i, itemView, listView) {
            itemView.done.checked = !itemView.done.checked;
            console.log("item：" + JSON.stringify(item));
        });

        // 开始执行
        ui.btnExecute.click(function () {
            if (ui.btnExecute.text() === "开始") {
                indexView.draw(); // start 初始化数据
                ui.btnExecute.text("停止");
                console.log("开始执行：" + JSON.stringify(indexView.data.plans));
                toastLog("开始执行...");
                // 启动新线程执行
                indexView.data.dayExecThread = threads.start(function () {
                    let apps = indexView.data.plans;
                    let execApps = new Array();
                    for (i in apps) {
                        let app = apps[i];
                        if (!app.selected) {
                            continue;
                        }
                        console.log("app:" + app.appName + " 开始执行");
                        indexView.data.singleExecAppThread = threads.start(function () {
                            try {
                                console.log("appJsPath:" + app.appJsPath);
                                var appjs = require(app.appJsPath);
                                appjs.start(app);
                            } catch (e) {
                                console.error("douyinspeed.start error:" + e);
                            }
                        });
                        indexView.data.singleExecAppThread.waitFor();
                        let appRunTime = app.taskTime * 60;
                        for (let i = 0; i <= appRunTime / 10; i++) {
                            //总共等待appRunTime分钟，每次循环等待10s
                            sleep(10000)
                            if (!indexView.data.singleExecAppThread.isAlive()) {
                                console.log(app.appName + "线程已死")
                                break;
                            }
                            log("总线程等待" + (i + 1) + "0秒")
                        }
                        indexView.data.singleExecAppThread.interrupt()
                        console.log("app:" + app.appName + " 执行完成");
                        execApps.push(app.appName);
                    }
                    console.log("执行结束， 已经执行的app:" + execApps);
                });
            } else {
                ui.btnExecute.text("开始");
                if (indexView.data.dayExecThread && indexView.data.dayExecThread.isAlive()) {
                    try {
                        indexView.data.dayExecThread.interrupt();
                    } catch (e) {
                        console.error("dayExecThread.interrupt error:" + e);
                    }
                }
                if (indexView.data.singleExecAppThread && indexView.data.singleExecAppThread.isAlive()) {
                    try {
                        indexView.data.singleExecAppThread.interrupt();
                    } catch (e) {
                        console.error("singleExecAppThread.interrupt error:" + e);
                    }
                }
            }
        });
        // 保存配置
        ui.btnSaveConfig.click(function () {
            // 同步下缓存
            localStorage.put(localStorage.keys.apps, indexView.data.plans);
            // 打印下选中的app
            let apps = localStorage.get(localStorage.keys.apps);
            let selectedApps = new Array();
            for (i in apps) {
                if (apps[i].selected) {
                    selectedApps.push(apps[i].appName);
                }
            }
            console.log("保存app配置，选中的app：" + JSON.stringify(selectedApps));
        });

        // 全选 反选
        ui.btnAllCheck.click(function () {
            let apps = indexView.data.plans;
            if (ui.btnAllCheck.text() === "全选") {
                for (i in apps) {
                    apps[i].selected = true;
                }
                ui.btnAllCheck.text("反选")
            } else {
                for (i in apps) {
                    apps[i].selected = false;
                }
                ui.btnAllCheck.text("全选")
            }
            indexView.data.plans = apps;
            ui.appList.setDataSource(indexView.data.plans);
        });
        // 保存系统配置
        ui.btnSaveWoolConfig.click(function () {
            // todo
            toastLog("系统配置保存成功！");
        });
        ui.switchEnbleFloating.on("check", (checked) => {
            app.startActivity({
                packageName: "com.android.settings",
                className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
                data: "package:" + context.getPackageName(),
            });
        });

        ui.autoService.on("check", function (checked) {
            // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
            if (checked && auto.service == null) {
                app.startActivity({
                    action: "android.settings.ACCESSIBILITY_SETTINGS"
                });
            }
            if (!checked && auto.service != null) {
                auto.service.disableSelf();
            }
        });
        // 当用户回到本界面时，resume事件会被触发
        ui.emitter.on("resume", function () {
            console.log("resume" + (auto.service));
            // 此时根据无障碍服务的开启情况，同步开关的状态
            ui.autoService.checked = auto.service != null;
        });
    },
    draw: function () {
        // 初始化数据
        this.init();
         // 初始化页面
         this.initPage();
         this.registerEvent();
    }
}

module.exports = indexView;