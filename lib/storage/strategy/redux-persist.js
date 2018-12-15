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
    var _a = options.preload, preload = _a === void 0 ? preloadNothing : _a, sync = options.sync;
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
                            if (sync) {
                                if (sync === true) {
                                    syncReduxPersist(store, options);
                                }
                                else if (typeof sync === 'function') {
                                    sync(store, options);
                                }
                                else if (typeof sync === 'object') {
                                    syncReduxPersist(store, options, sync);
                                }
                            }
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
/** Initializes cross-tab syncing of redux state stored in `localeStorage`.
 * @param store
 * @param persistConfig
 * @param config
 */
function syncReduxPersist(store, persistConfig, config) {
    if (config === void 0) { config = {}; }
    var key = persistConfig.key, _a = persistConfig.keyPrefix, keyPrefix = _a === void 0 ? redux_persist_1.KEY_PREFIX : _a;
    var blacklist = config.blacklist, _b = config.storageArea, storageArea = _b === void 0 ? window.localStorage : _b, whitelist = config.whitelist;
    window.addEventListener('storage', handleStorageEvent, false);
    function handleStorageEvent(e) {
        if (e.storageArea !== storageArea) {
            return;
        }
        if (e.key && e.key.indexOf(keyPrefix) === 0) {
            if (e.oldValue === e.newValue || e.newValue === null) {
                return;
            }
            var changes_1 = false;
            var statePartial_1 = JSON.parse(e.newValue);
            var state = Object.keys(statePartial_1).reduce(function (state, reducerKey) {
                if (whitelist && whitelist.indexOf(reducerKey) === -1) {
                    return state;
                }
                if (blacklist && blacklist.indexOf(reducerKey) !== -1) {
                    return state;
                }
                state[reducerKey] = JSON.parse(statePartial_1[reducerKey]);
                changes_1 = true;
                return state;
            }, {});
            if (!changes_1) {
                return;
            }
            store.dispatch({
                key: key,
                payload: state,
                type: redux_persist_1.REHYDRATE,
            });
        }
    }
}
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
