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
/** Creates a local storage area.
 * @param [type] Type of local storage. (local, session)
 * @param [config] Storage area configuration.
 */
function createStorageLocal(type, options) {
    if (type === void 0) { type = "local"; }
    if (options === void 0) { options = { key: "state" }; }
    var rootKey = options.key;
    var driver = getStorageDriver(type);
    /** @param key
     * @param defaultValue
     */
    function getDataForKey(key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        var value = driver.getItem(key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
    /** @param defaults */
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
    /** @param mapping
     * @param key
     */
    function mapDataForKey(mapping, key) {
        mapping[key] = getDataForKey(key, undefined);
        return mapping;
    }
    function removeDataForKey(key) {
        driver.removeItem(key);
    }
    var storage = {
        /** Clears all storage in the area. */
        clear: function () {
            driver.clear();
            return Promise.resolve();
        },
        /** @param keyOrKeys */
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
        /** Key in `localStorage` to store state for this area. */
        key: rootKey,
        /** @param keyOrKeys */
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
        /** @param items */
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
