var sysConfig = require("../common/sysConfig");
var executePlanManager = require("../common/executePlanManager");
var localStorage = require("../common/localStorage");
var reportLogManager = require("../common/reportLogManager");
var tools = require("../common/tools");
const { toastLog, clearCach } = require("../common/Tools11");

var logThread = null;//日志线程
var autoExecTaskView = {
    data: {
        plans: [],
        isShowConsole: false,
    },
    init: function () {
        // 获取执行计划
        console.log("autoExecTaskView init");
        try {
            // todo 清除本地缓存
            executePlanManager.removeCurrentDayPlans();
            // 获取当前日期的执行计划
            let plans = executePlanManager.getCurrentDayPlans();
            autoExecTaskView.data.plans = plans;
        } catch (e) {
            console.log("init: " + e);
            toast("初始化数据失败");
        }
    },
    initPage: function () {
        autoExecTaskView.data.softName = sysConfig.softName;
        autoExecTaskView.data.softVersion = sysConfig.softVersion;
        ui.layout(
            <drawer id="drawer">
                <relative id="mainWindows">
                    <viewpager id="viewpager">
                        {/* 首页 */}
                        <vertical id="startpage" >
                            <vertical>
                                {/* 头部 */}
                                <appbar>
                                    <toolbar bg="#FB6403" id="toolbar" title="{{autoExecTaskView.data.softName}}" paddingTop="2dp" h="auto" >
                                    </toolbar>
                                    <tabs id="drawerTabs" />
                                </appbar>
                                <viewpager id="woolView" background="#EADCCE">
                                    {/* 自动刷页面 */}
                                    <frame id="frameFirstTab" background="#F6F4F0">
                                        <scroll>
                                            <vertical gravity="center">
                                                <list id="appList" hasFixedSize="true">
                                                    <card w="*" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" foreground="?selectableItemBackground">
                                                        <horizontal gravity="center_vertical" background="#F6EFE5">
                                                            <horizontal h="auto" w="auto">
                                                                <input id="appId" text="{{this.id}}" inputType="none" padding="8 8 8 8" w="40" gravity="center" visibility="gone" />
                                                                <text id="orderNum" text="{{this.orderNum}}" padding="8 8 8 8" textStyle="bold" size="16" />
                                                            </horizontal>
                                                            <horizontal h="auto" w="0" layout_weight="5">
                                                                <text id="appName" text="{{this.appName}}" textColor="#222222" textSize="16sp" maxLines="1" />
                                                            </horizontal>
                                                            <horizontal h="auto" w="auto" layout_weight="1">
                                                                <text id="taskTime" color="#228B22" size="16" text="{{this.taskTime}}" />
                                                                <text color="#228B22" size="16" text="分钟" />
                                                            </horizontal>
                                                            <horizontal h="auto" w="auto" layout_weight="1">
                                                                <text id="stateDesc" color="#228B22" size="16" text="{{this.stateDesc}}" />
                                                                <input id="state" color="#228B22" size="16" text="{{this.state}}" visibility="gone"/>
                                                            </horizontal>
                                                        </horizontal>
                                                    </card>
                                                </list>
                                                {/* 占位符 */}
                                                <card h="40" w="*" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" foreground="?selectableItemBackground">
                                                <horizontal gravity="center_vertical" background="#F6EFE5"></horizontal>
                                                </card>
                                            </vertical>
                                        </scroll>
                                        <horizontal gravity="right|bottom">
                                            <button style="Widget.AppCompat.Button.Colored" id="btnExecute" text="开始" padding="12dp" w="auto" />
                                            <button style="Widget.AppCompat.Button.Colored" id="btnGetMoney" text="一键提现" padding="12dp" w="auto" />
                                        </horizontal>
                                    </frame>

                                    {/* 系统配置页面 */}
                                    <frame id="frameFourTab " background="#F6F4F0">
                                        <scroll>
                                            <vertical>
                                                {/* 是否开启控制台 */}
                                                <vertical>
                                                    <horizontal >
                                                        <img w="45" h="45" padding="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAZklEQVRYR+2WQQrAMAgEJy9v+vKWQAmhN0VIKePZXWUQ1gZ04CBW56NbVSmfBlyx2bN7aNdK+biABCQgAQl8gkAqRCrDKJlFNbJ3otW4BlxcYBDYfoSpTwbwI5KABCQggf8Q2BpGNzebPgmO8w3jAAAAAElFTkSuQmCC"></img>
                                                        <Switch id="autoService" paddingTop="12" marginLeft="5" text="开启无障碍服务" textColor="red" textSize="15sp" />
                                                    </horizontal>
                                                </vertical>
                                                <vertical>
                                                    <horizontal >
                                                        <img w="50" h="50" padding="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAKAklEQVR4Xu2djbUmQxCGeyNABIgAESACRIAIEAEiQASIABEgAkSACBAB59mdvubOzkxVddX0N/N1zTn37O65PdX18051dVV175OSz9AaeDK09Cl8SQAMDoIEQAJgcA0MLn56gATA4BoYXPz0AAmAwTUwuPjpARIAg2tgcPHTAyQABtfA4OKnB0gADK6BwcVPD5AAGFwDg4ufHiABMLgGBhc/PUACYHANDC5+eoAEwOAaGFz89AAJgME1MLj46QESAINrYHDx0wPcFgAvllI+KqW8tWDj71LKV6WUn45mLwFwtIb36X9WSvl0YwggeLWUwp+HPQmAw1SrIswX/ubOyLeP9gIJAJWdDhuUADhMtdcgnAC4hp3UXL4+jfxV+cbvpZRXdsZ+WEr5RkGLYPK1Uspv1pghlwCFdpVDPiilfD2N/bKU8onw3hellI+FMQSAxAF7gML4P5ZSAB/jGK8OHBMASusKw+bGr0P5cvmC5w/GeqeUQvS/9+Uvp4MW28IlEObGr++YQJAA8ANgzfiV6velFLwBD+PeLaVgtNYH40LvjwlA/H2NnhoECYBWU/xv1Or2fZTi31aBIAHgU7wUxfuo+98W8wgJAJ+S9zJ5Psr+t/+ZlondgDAB4Fc0Adr7fjKhFDA+9QVxO5oAiNH7mUCgNj6iJwBiAAAVXO0LceSaKX0+bTNVBBIAKjWpBp0lIBQDv7k0CQCVbVWD/mrY45O6Zflgra61fxJEZPXIGfBj9SpkIGvuQWQ8ASCqSDUAQ32nGvls0J9TYkhq+CDJQ7p4q2dgbUqSRPQRqJ4EgEpN4iBy8cuunq2Xfp6+bHW+fhqPp9B6A/UykAAQbSsOwGVT1dM8uHyAYjF+pWvxMt9OHkbkKQEgqkgcoN0CqhIzwmyWxNMbmQcQbecaQKDG2syXqXlM27MNgsQErPGapQAvQ/zww57HObsH2OuX44sSM10ayyjHEORpjb1G8qVG17+kRYRPJ3HLAygoUVOlfPqcFQBrde41gamRS00VLYpavsPX/ouDEGt/7RZykHn6KjEEQWfrQxD6ELCeFQAYlY4ZzcOWB7d45ONVejRQ/3UIewkAWIId9ZbHoTQvACLW/zn7CYCZNhIANmSnB7DpK2TdJRL3BJBzli15hzVREwANAPAq3ZSeFfjb60HUiPYoSXTWINBSWdP2zmuUszeGL3i549jbpi5pRS1VbOHoLNY81BzmATJ/R4aHTOQRAGCPirKYhODHule3brlavy54hNdWPjEAvAJWTWKGcYDA81iCUb70R8ZemzgaAHTI4qLqoznYMOcLhbLHtbZOk46lDKrNsS/dqJXPOc8Wl+z1VuQiNPkEvnzVuYNIACyNbwEBLq32zbd+IRixHqDYywtsGawVBNb0rHTSZ0v+Lf2ujVdvO6MAIDH3XApy+spppsRNqdBqQAbulpQp0Xd96mUM5Bi2nlYQWNKzzIG30pz5g0/4Rr+WXYQ6ORYBAMn4c2UTD/CDwbX1c4PdnxuKJ6gxCK5TA7QWELTsEgApQNiLkfhAtk7/bOlFXQqGgBcAlpStx5C93wUElFMtKWYMyQld68McRPbz+KW2hFlpMf69ebFHIuAFgGW7JvFytt+r19GJcW2AdrScXQFg2ZMeLXg0fUvEbt26RvM6p4dNAIHq8XoAyz5YxdBJBlnKt9rSdU/R1o6mr87vBQBE7w0Elr69Mxq/GlpVgo4AwD2BwGJ85D77Eij2BUYBAGVYulZ7ukPtXC1NmwmAhXZbt0JaIx05zhr1az0faVm2eC1bxDV5ay+kVIhS5QMiPQDMXnlb2Fqt24qBMBResZ7+YRx5k5bjXuiW5YmkUM0ZEH/w77Wj6SrjQ/TsAEDo2sFKwgSh+amZxJcDXYJl27ecdgmCvSPa9bgXYNBUEWngIH29dYxseS5BbfxoACAYByS9D8oD2QgmZeLqVxVxQYO3XAsvtc7An1IZXJM70HYSMR+pdWTYq3U8Z5tID2Bp5NwCCeswxteWdSsdPAKAkdZFCZzqIopESPl7aclsXZaU08cuAdKtl3tM8dVTpn04sKCW4PFAS1VubQrV3rmRt7XX7gYAni2g6UoThfI9BSo8Dyd4ej13AwDPfthUvFBaRntgc42cJxhUsvcwTNKbmMixTrgcHxEDWPrUlvO37L21MhNAtuwSWnsMtXzNx+15Tks9omXup+94AdDaw8fcLZk3i6AeYFp7DC18LccSwK41qrCLsAbDZj40AGB7xzZr2aiJgj1dPaa7bMySPXtBWmP3yKJ83l9u5/AQ7LXv4tEA4KhGhx5bLk9AuGfgI5eursCSAOBxo3uCdFnfJteqvb7FovjeuwULb6axtwJAzy+oNRiUFCnpTnr/FL+XhDjKA/QEgCcO2DOSpLtTGFhiQhLiKAAcsfffkjUBsIOCWwGgZ7IlAXBCAOQSIPnmTr+/lQfoWXTxXKcyfAygqVm3YLVXuvUo/tWnb1uU0/MdyQPAi6ewsifL4YWOqbeg9U69Ld6jStc97bw5lwYAvMyXtEwF126cloILNE2tS43a8vQo0Iq11pXUJUffKK/5NS0A9gh7PMSR6WBPh1LPXYrZaJEvRADAckHCknfTOTaD4FTXqGFYbxphike3aBnmvOTQCAB444ToHYH3uNbhfXhnQkoUALzRdpTLxfhcMTu/p8ii77uJ7rVCRwGA+bwZN/WJ1g3hcPvc6K25RGlLPz16FLS26TIuEgCW27K2hCPCxgjS/6WzfJ97+6n9t6z5ldbRHUpdDGqdJBIAzB31f+cBADwCAdnW4RC+dDqV6KvT3P0j6abHtlTiofvvowHgXQbWFAAAliBYy0t4ldezQunlNez9KwAgTFiBUAIgQNMt/3liwLQhJKK3oyFMHU0k0gN4Mm9Hy6ml36M+oeWly7goAETsALoILEzScknkGfhu5iECAPdi/KrEoUDgBcC9GX8OAgpVh5/Maf50g170AuCIbV+QaG4yPdvW3My2EkgAbGtuiLSwFwD3dklkhYP1vsDWD/Dm73kBgABaEJBrJ73LskHqlvgh6uq0LUWS3qXngBoBZxw0dwkNY3yUFgEADQi2lOq9Om3N8JR06yVTyyAOEACIrdu5hjJ+JAD2QKBRKl8oRR2SSa09htJ1ahUsWx5Lw+fNXXY0A1EeYEu5LUqVrk1Z04G1oWQJghY+o21xE3rRAECIur7jfnHF1sfaY6i9S2/Jx5xPYpO73/OvGeIIAFgNvjbe4gWGrOJFKDk6BojiCTqWwtJQTZyRSk4ARGvzgvTOugSkB+gEpgRAJ0WfdZqzAkBbZRyykzcSTGcFADKyhQQIW1k7Mn60gnsvmI7U5+VonRkAl1PmFRlOAFzRaoE8JwAClXlFUgmAK1otkOcEQKAyr0gqAXBFqwXynAAIVOYVSSUArmi1QJ7/A/Ab75CB6LdKAAAAAElFTkSuQmCC"></img>
                                                        <Switch id="switchEnbleFloating" paddingTop="16" text="开启悬浮窗权限" textSize="15sp" textColor="red" />
                                                    </horizontal>
                                                </vertical>

                                                <vertical>
                                                    <horizontal >
                                                        <img w="50" h="50" padding="16" src="data:image/png;base64,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"></img>
                                                        <Switch id='switchIsShowConsole' text="是否开启控制台(不建议开启偶尔会遮挡点击事件" paddingTop="16" textColor="black" />
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
        let plans = autoExecTaskView.data.plans;
        console.log("计划数据:" + JSON.stringify(plans));
        for (i in plans) {
            plans[i].stateDesc = executePlanManager.getStateDesc(plans[i].state);
        }
        console.log("计划数据 -2 :" + JSON.stringify(plans));
        ui.appList.setDataSource(plans);

        let open = tools.isAccessibilityEnabled();
        ui.autoService.checked = open;
    },
    registerEvent: function () {
        // 开始执行
        ui.btnExecute.click(function () {
            autoExecTaskView.autoExecPlan();
        });

        // 一键提现
        ui.btnGetMoney.click(function () {
            if (ui.btnGetMoney.text() === "一键提现") {
                const executePlanEvent = events.emitter();
                executePlanEvent.on("stopGetMoney", function (appRunResult) {
                    console.log("事件同步： 结束提现");
                });
                let thead = threads.start(function () {
                    // 获取所有的plan
                   let plans = executePlanManager.getCurrentDayPlans();
                   console.log("=====开始提现=====");
                   for (i in plans) {
                       console.log(" 开始提现--:" + i);
                       let appPlan = plans[i];
                       console.log(" 开始提现，app:" + appPlan.appName);
                       try {
                           let appjs = require(appPlan.appJsPath);
                           appjs.init(appPlan, function(a) {
                               console.log("回调-提现金额，app:" + a.appName + ", 金额:" + a.money);
                               toastLog("回调提现金额，app:" + a.appName + ", 金额:" + a.money);
                           });
                           let money = appjs.提现();
                           appPlan.money = money;
                           console.log("=================，app:" + appPlan.appName + ", 金额:" + appPlan.money);
                           console.log("提现完成，app:" + appPlan.appName);
                           toastLog("提现完成，app:" + appPlan.appName);
                           reportLogManager.reportImmediatelyResult303(appPlan);
                       } catch (error) {
                           console.log("提现失败，app:" + appPlan.appName + ", 原因:" + error);
                           toastLog("提现失败，app:" + appPlan.appName + ", 原因:" + error);
                           appPlan.appRunResult = "提现失败原因:" + error;
                           reportLogManager.reportImmediatelyResult304(appPlan);
                       }
                   }
                   console.log("=====结束提现=====");
                   executePlanEvent.emit("stopGetMoney", {});
               });
            }       
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

        ui.switchIsShowConsole.on("check", (checked) => {
            var isShowConsole = checked ? 1 : -1
            localStorage.put(localStorage.keys.isShowConsole, isShowConsole);
            if(checked)
            {
                ui.switchEnbleFloating.setChecked(true);
                logThread = threads.start(function () { 
                    console.show();
                    console.setPosition(0, device.height / 3);
                });
            }else{
                ui.switchEnbleFloating.setChecked(false);
                if (logThread != null) {
                    logThread.interrupt()//停止线程
                }
            }
        });

        ui.autoService.on("check", function (checked) {
            // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
            let open = tools.isAccessibilityEnabled();
            if (checked) {
                if (!open) {
                    app.startActivity({
                        action: "android.settings.ACCESSIBILITY_SETTINGS"
                    });
                }
            }
            if (!checked) {
                if (open) {
                    auto.service.disableSelf()
                }
            }
        });
        // 当用户回到本界面时，resume事件会被触发
        ui.emitter.on("resume", function () {
            let open = tools.isAccessibilityEnabled();
            console.log("resume:" + open);
            // 此时根据无障碍服务的开启情况，同步开关的状态
            ui.autoService.checked = open;
            // 重新设置数据源
            console.log("autoExecTaskView 重新设置数据源 开始...");
            try {
                let plans = executePlanManager.getCurrentDayPlans();
                console.log("当前计划" + plans.length + "条" + ", 历史计划" + autoExecTaskView.data.plans.length + "条");
                console.log("设置数据源");
                autoExecTaskView.data.plans = plans;
                for (i in plans) {
                    let plan = plans[i];
                    plan.stateDesc = executePlanManager.getStateDesc(plan.state);
                }
                ui.appList.setDataSource(plans);
            } catch (error) {
                console.error("重新设置数据源失败:" + error);
            }
           
            console.log("autoExecTaskView 重新设置数据源 结束...");
        });
    },
    autoExecPlan: function () {
        console.log("autoExecTaskView autoExecPlan....");
        try {
            if (ui.btnExecute.text() === "开始") {
                ui.btnExecute.text("停止");
                let plans = executePlanManager.getCurrentDayPlans();
                console.log("设置数据源");
                autoExecTaskView.data.plans = plans;
                for (i in plans) {
                    let plan = plans[i];
                    plan.stateDesc = executePlanManager.getStateDesc(plan.state);
                }
                ui.appList.setDataSource(plans);
                let rs = executePlanManager.execPlans(autoExecTaskView.data.plans);
                if (rs === 1) {
                    toast("无可执行的任务");
                    ui.btnExecute.text("开始");
                }
            } else {
                confirm("确定停止吗？").then(value=>{
                    if(value){
                        ui.btnExecute.text("开始");
                        executePlanManager.stopExecPlans();
                    }
                });
            }
        } catch (error) {
            toastLog("执行计划失败");
            console.error("执行计划失败:" + error);
        }
        console.log("autoExecTaskView autoExecPlan end");
    },
    draw: function () {
        // 初始化数据
        this.init();
         // 初始化页面
        this.initPage();
        this.registerEvent();
        this.autoExecPlan();
    }
}

module.exports = autoExecTaskView;