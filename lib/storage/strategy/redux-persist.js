"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_persist_1 = require("redux-persist");
function createReduxPersistStorage(options) {
    /** Received in `init`. */
    var mapping;
    /** Created in `load`. */
    var persistor;
    /** Received in `init`. */
    var store;
    var _a = options.preload, preload = _a === void 0 ? preloadNothing : _a;
    function createReducer(reducers) {
        var blacklist = options.blacklist;
        if (blacklist) {
            blacklist = blacklist.concat(mapping.noPersist);
        }
        else {
            blacklist = mapping.noPersist;
        }
        options.blacklist = blacklist;
        return redux_persist_1.persistCombineReducers(options, reducers);
    }
    var strategy = {
        flush: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, persistor.flush()];
            }); });
        },
        init: function (stateStore, stateMapping) {
            store = stateStore;
            mapping = stateMapping;
            return {
                createReducer: createReducer,
            };
        },
        load: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function loadingStorage(resolve) {
                            persistor = redux_persist_1.persistStore(store, undefined, function () { resolve(); });
                            // if (storageSync === true) {
                            //   crossTabSync(store, options);
                            // } else if (typeof storageSync === 'function') {
                            //   storageSync(store, options);
                            // }
                        })];
                });
            });
        },
        pause: function () { return persistor.pause(); },
        persist: function () { return persistor.persist(); },
        preload: function (slice) { return preload(options, slice); },
        purge: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, persistor.purge()];
            }); });
        },
    };
    return strategy;
}
exports.createReduxPersistStorage = createReduxPersistStorage;
/** Loads persisted reducer state data from localStorage, synchronously.
 * @param options The redux-persist config options.
 * @param slice State slice name to load data for.
 */
function preloadReduxPersistLocalStorage(options, slice) {
    var key = options.key, _a = options.keyPrefix, keyPrefix = _a === void 0 ? redux_persist_1.KEY_PREFIX : _a;
    var json = localStorage.getItem("" + keyPrefix + key);
    if (!json) {
        return undefined;
    }
    var root = JSON.parse(json) || {};
    json = root[slice];
    if (!json) {
        return undefined;
    }
    var loadedData = JSON.parse(json);
    return loadedData;
}
exports.preloadReduxPersistLocalStorage = preloadReduxPersistLocalStorage;
function preloadNothing(options, slice) {
    return undefined;
}
