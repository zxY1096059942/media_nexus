var BaseConfig = {}

BaseConfig.storageSign = function () {
    var storageSign = "YingHuo163.com";
    return storageSign;
}
BaseConfig.adenStorage = function () {
    return storages.create(BaseConfig.storageSign);//创建本地存储
}
BaseConfig.defaultDeviceModel = function () {
    return "OPPO OPPO R9SK" //默认机型
}

BaseConfig.soft_Version = function () {
    return "0.0.22"
}
module.exports = BaseConfig;
