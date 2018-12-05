"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getStorageDriver(type) {
    var driver;
    switch (type) {
        case "local":
            driver = window.localStorage;
            break;
        case "session":
            driver = window.sessionStorage;
            break;
        default:
            throw new Error("Unknown web storage type: " + type);
    }
    if (!driver) {
        throw new Error("Storage driver not found for type: " + type);
    }
    return driver;
}
function createStorageLocal(type, config) {
    if (type === void 0) { type = "local"; }
    if (config === void 0) { config = { key: "state" }; }
    var driver = getStorageDriver(type);
    function getDataForKey(key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        var value = driver.getItem(key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
    function getDataWithDefaults(defaults) {
        if (!defaults) {
            return undefined;
        }
        var keys = Object.keys(defaults);
        var len = keys.length;
        var collection = {};
        for (var i = 0; i < len; i++) {
            var key = keys[i];
            collection[key] = getDataForKey(key, defaults[key]);
        }
        return collection;
    }
    function mapDataForKey(mapping, key) {
        mapping[key] = getDataForKey(key, undefined);
        return mapping;
    }
    function removeDataForKey(key) {
        driver.removeItem(key);
    }
    var storage = {
        clear: function () {
            driver.clear();
            return Promise.resolve();
        },
        config: config,
        get: function (keyOrKeys) {
            var data;
            if (typeof keyOrKeys === "string") {
                data = getDataForKey(keyOrKeys);
            }
            if (Array.isArray(keyOrKeys)) {
                data = keyOrKeys.reduce(mapDataForKey, {});
            }
            if (keyOrKeys === null) {
                keyOrKeys = Object.keys(driver);
                data = keyOrKeys.reduce(mapDataForKey, {});
            }
            data = getDataWithDefaults(keyOrKeys);
            return Promise.resolve(data);
        },
        remove: function (keyOrKeys) {
            if (keyOrKeys) {
                if (typeof keyOrKeys === "string") {
                    driver.removeItem(keyOrKeys);
                }
                else if (Array.isArray(keyOrKeys)) {
                    keyOrKeys.forEach(removeDataForKey);
                }
            }
            return Promise.resolve();
        },
        set: function (items) {
            var keys = Object.keys(items);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var key = keys[i];
                var data = items[key];
                var value = JSON.stringify(data);
                driver.setItem(key, value);
            }
            return Promise.resolve();
        },
    };
    return storage;
}
exports.createStorageLocal = createStorageLocal;
