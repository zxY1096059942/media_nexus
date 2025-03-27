var localStorage = require("./localStorage");
var httpClient = require("./httpClient");

var loginManager = {
    login: function (userName, password) {
        var nofify = threads.disposable();
        threads.start(function () {
            let rs = {
                code: 0,
                msg: ""
            };
            if (!userName || !password) {
                rs.code = 1;
                rs.msg = "账号或密码不能为空";
                nofify.setAndNotify(rs);
                return;
            }
            let v2 = {
                mobile: userName,
                password: password
            };
            try {
                // 请求登录
                let loginResponse = httpClient.postJson("/h5/account/login", {}, v2);
                if (loginResponse.code) {
                    rs.code = 1;
                    rs.msg = loginResponse.msg;
                    nofify.setAndNotify(rs);
                    return;
                } else {
                    loginManager.cacheToken(loginResponse.token);
                }
                console.log("get user info");
                // 获取用户信息 并保存到本地
                let userInfoResponse = httpClient.get("/h5/member/info", {});
                console.log(userInfoResponse);
                if (userInfoResponse.code) {
                    rs.code = 1;
                    rs.msg = userInfoResponse.msg;
                    nofify.setAndNotify(rs);
                    return;
                } else {
                    loginManager.cacheUser(userInfoResponse);
                    ws.init(userInfoResponse.id, userInfoResponse.id, sysConfig.wsurl); //TODO verify
                    ws.connect();
                }
                rs.code = 0;
            } catch (e) {
                console.log("login error:" + e);
                rs.code = 1;
                rs.msg = "登录失败，请稍后再试";
            }
            nofify.setAndNotify(rs);
        });
        //主线程等待通知
        let loginRs = nofify.blockedGet();
        return loginRs;
    },
    cacheToken: function (token) {
        let tokenInfo = {
            token: token,
            expire: new Date().getTime() + 864000000
        };
        localStorage.put(localStorage.keys.token, tokenInfo);
    },
    getToken: function () {
        if (!localStorage.exists(localStorage.keys.token)) {
            return null;
        }
        let tokenInfo = localStorage.get(localStorage.keys.token);
        let now = new Date().getTime();
        console.log("now:" + now + ", expire:" + tokenInfo.expire);
        // 过期了
        if (now > tokenInfo.expire) {
            localStorage.remove(localStorage.keys.token);
            localStorage.remove(localStorage.keys.user);
            return null;
        }
        return tokenInfo.token;
    },
    cacheUser: function (user) {
        localStorage.put(localStorage.keys.user, user);
    },
    getUser: function () {
        return localStorage.get(localStorage.keys.user);
    },
    logout: function () {
        // 清空本地缓存
        localStorage.remove(localStorage.keys.token);
        localStorage.remove(localStorage.keys.user);
    }
};

module.exports = loginManager;