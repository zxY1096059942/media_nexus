var sysConfig = require('./sysConfig');
var localStorage = require("./localStorage");

var httpClient = {
    loginUrl: "/h5/account/login",
    headerAuthKey: "Authorization",
    get: function(uri, header, callback) {
        let newUrl = sysConfig.serverUrl + uri;
        header = header || {};
        let token = this.getToken();
        if (!token) {
            throw new Error("请先登录");
        }
        header[this.headerAuthKey] = token;
        console.log("get", newUrl, header);
        if (callback === undefined) {
            let r = http.get(newUrl, { headers: header }, callback);
            let body = r.body.string();
            console.log("get finish", r.statusCode, body);
            if (r.statusCode !== 200) {
                console.log("请求失败，状态码：" + r.statusCode + "，uri:" + uri);
                throw new Error("系统错误，请稍后再试");
            }
            return JSON.parse(body);
        }
        return null;
    },
    post: function(uri, header, data, callback) {
        let newUrl = sysConfig.serverUrl + uri;
        header = header || {};
        if (uri !== this.loginUrl) {
            let token = this.getToken();
            if (!token) {
                throw new Error("请先登录");
            }
            header[this.headerAuthKey] = token;
        }
        console.log("post", newUrl, header, data);
        if (callback === undefined) {
            let r = http.post(newUrl, data, { headers: header }, callback);
            let body = r.body.string();
            console.log("get finish", r.statusCode, body);
            if (r.statusCode !== 200) {
                console.log("请求失败，状态码：" + r.statusCode + "，uri:" + uri);
                throw new Error("系统错误，请稍后再试");
            }
            return JSON.parse(body);
        }
        return null;
    },
    postJson: function(uri, header, data, callback) {
        let newUrl = sysConfig.serverUrl + uri;
        header = header || {};
        console.log("uri:" + uri);
        if (uri !== this.loginUrl) {
            let token = this.getToken();
            console.log("postJson token:" + token);
            if (!token) {
                throw new Error("请先登录");
            }
            header[this.headerAuthKey] = token;
        }

        if (callback === undefined) {
            console.log("postJson", newUrl, { headers: header}, JSON.stringify(data));
            let r = http.postJson(newUrl, data, { headers: header} , callback);
            let body = r.body.string();
            console.log("postJons finish", r.statusCode, body);
            if (r.statusCode !== 200) {
                console.log("请求失败，状态码：" + r.statusCode + "，uri:" + uri);
                throw new Error("系统错误，请稍后再试");
            }
            return JSON.parse(body);
        }
        return null;
    },
    getToken: function () {
        if (!localStorage.exists(localStorage.keys.token)) {
            return null;
        }
        let tokenInfo = localStorage.get(localStorage.keys.token);
        let now = new Date().getTime();
        // 过期了
        if (now > tokenInfo.expire) {
            localStorage.remove(localStorage.keys.token);
            localStorage.remove(localStorage.keys.user);
            return null;
        }
        return tokenInfo.token;
    }
}

module.exports = httpClient