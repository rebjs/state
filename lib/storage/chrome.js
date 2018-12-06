"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chrome");
/** Creates a Chrome storage area interface for use inside a Chrome extension
 * or a Chrome app.
 * @param [type] Type of Chrome storage. (local, sync, etc)
 * @param [config] Storage area configuration.
 */
function createStorageChrome(type, config) {
    if (type === void 0) { type = "local"; }
    if (config === void 0) { config = {}; }
    var driver = chrome.storage[type];
    var storage = {
        /** Clears all storage in the area. */
        clear: function () {
            return new Promise(function (resolve, reject) {
                driver.clear(resolve);
            });
        },
        /** Storage area configuration. */
        config: config,
        /** @param keyOrKeys */
        get: function (keyOrKeys) {
            return new Promise(function (resolve, _reject) {
                driver.get(keyOrKeys, resolve);
            });
        },
        /** @param keyOrKeys */
        remove: function (keyOrKeys) {
            return new Promise(function (resolve, _reject) {
                driver.remove(keyOrKeys, resolve);
            });
        },
        /** @param items */
        set: function (items) {
            return new Promise(function (resolve, _reject) {
                driver.set(items, resolve);
            });
        },
    };
    return storage;
}
exports.createStorageChrome = createStorageChrome;
