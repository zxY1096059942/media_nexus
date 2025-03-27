"ui";
console.log("当前工作目录:", files.cwd());
var loginView = require('./view/loginView');
var indexView = require('./view/indexView');
var autoExecTaskView = require('./view/autoExecTaskView');
var sysConfig = require("./common/sysConfig");
var loginManager = require("./common/loginManager");
var ws = require('./common/ws');
var localStorage = require("./common/localStorage");
  
// let tip = "如果你只能看到这条日志，那么你没有开启无障碍功能（在【设置→辅助功能→安装的应用】中打开，不同手机可能不一样）。同时还需要悬浮窗权限，请找到这个APP的权限管理并授予。如果无法打开无障碍，请查看是否有悬浮窗或者悬浮球之类的。";
// console.error(tip);
// auto.waitFor();


const m = function main() {
    // 输出一些系统日志
    console.log("app version:" + app.versionCode, "app versionName:" + app.versionName);
    console.log("autojs version:" + app.autojs.versionCode, "autojs versionName:" + app.autojs.versionName)

    let token = loginManager.getToken();
    console.log("token:", token);

    if (!token) {
        console.log("into login");
        // 进入登录页面
        loginView.draw();
    } else {
        console.log("into index");
        try {
            let user = loginManager.getUser();
            ws.init(user.id, user.id, sysConfig.wsurl); //TODO verify
            ws.connect();
            if (sysConfig.autoExecTask) {
                console.log("into autoExecTaskView");
                autoExecTaskView.draw();
            } else {
                console.log("into index");
                indexView.draw();
            }
        } catch (e) {
            console.log(e);
            loginManager.logout();
            loginView.draw();
        }
    }
}
m();



