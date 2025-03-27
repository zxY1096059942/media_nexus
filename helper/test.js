var tools = require("./common/tools");
var loginManager = require("./common/loginManager");
// console.log('无障碍服务', tools.isAccessibilityEnabled())
// toast('无障碍服务:' + tools.isAccessibilityEnabled());
// var nodeList = node1.find(packageName("com.tencent.mm"));
// nodeList.forEach((child, index) => {
//     if (child) {
//         log(child.text());
//     }
// })

// var fq = require("app/fanqiechangting");
// fq.start({ id: 111, memberId: 222, planKey: '20241019',appName:'番茄畅听' }, function () {
//     log.info("结束");
// });

var fq = require("app/fanqiexiaoshuo");

fq.start({ id: 111, memberId: 222, planKey: '20241109',appName:'番茄免费小说' }, function () {
    log.info("结束");
});