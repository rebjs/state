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
        purge: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, persistor.purge()];
            }); });
        },
    };
    return strategy;
}
exports.createReduxPersistStorage = createReduxPersistStorage;
