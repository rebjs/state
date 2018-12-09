"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chrome");
/** Creates a Chrome storage area interface for use inside a Chrome extension
 * or a Chrome app.
 * @param [type] Type of Chrome storage. (local, sync, etc)
 * @param [config] Storage area configuration.
 */
function createStorageChrome(type) {
    if (type === void 0) { type = "local"; }
    var driver = chrome.storage[type];
    var storage = {
        /** Clears all storage in the area. */
        clear: function () {
            return new Promise(function (resolve) {
                driver.clear(resolve);
            });
        },
        /** @param keyOrKeys */
        get: function (keyOrKeys) {
            return new Promise(function (resolve) {
                driver.get(keyOrKeys, resolve);
            });
        },
        /** @param keyOrKeys */
        remove: function (keyOrKeys) {
            return new Promise(function (resolve) {
                driver.remove(keyOrKeys, resolve);
            });
        },
        /** @param items */
        set: function (items) {
            return new Promise(function (resolve) {
                driver.set(items, resolve);
            });
        },
    };
    return storage;
}
exports.createStorageChrome = createStorageChrome;
