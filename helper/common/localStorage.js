var localStorage = {
    storage: null,
    keys: {
        token: "token",
        apps: "apps",
        user: "user",
        plans: "plans",
        isShowConsole: "isShowConsole",
    },
    init: (function() {
        var storageName = "helperCache";
        return function() {
            if (!this.storage) {
                this.storage = storages.create(storageName);
            }
        }
    })(),
    clearAll: (function() {
        var storageName = "helperCache";
        return function() {
            return storages.remove(storageName);
        }
    })(),
    get: function(key, defaultValue) {
        if (!key) {
            throw new Error("key is " + key);
        }
        if (defaultValue) {
            return this.storage.get(key, defaultValue);
        } else {
            return this.storage.get(key);
        }
        
    },
    put: function(key, value) {
        if (!key) {
            console.log(key);
            throw new Error("key is " + key);
        }
        if (!value) {
            throw new Error("value is " + value);
        }
        return this.storage.put(key, value);
    },
    exists: function(key) {
        if (!key) {
            throw new Error("key is " + key);
        }
        return this.storage.contains(key);
    },
    remove: function(key) {
        if (!key) {
            throw new Error("key is " + key);
        }
        return this.storage.remove(key);
    },
    clear: function() {
        return this.storage.clear();
    },
}

localStorage.init();

module.exports = localStorage;