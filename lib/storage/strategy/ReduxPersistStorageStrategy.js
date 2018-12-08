"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_persist_1 = require("redux-persist");
var storage_1 = tslib_1.__importDefault(require("redux-persist/lib/storage"));
exports.ReduxPersistStorageStrategy = {
    create: function (store) {
        var persistor;
        var strategy = {
            areas: {},
            clear: function () {
                persistor.purge();
                return Promise.resolve([]);
            },
            createReducer: function (store, reducers) {
                var _a = store.config, _b = _a.logLevel, logLevel = _b === void 0 ? 0 : _b, _c = _a.storageConfig, storageConfig = _c === void 0 ? {} : _c;
                return redux_persist_1.persistCombineReducers({
                    blacklist: storageConfig['persistBlacklist'] || [],
                    debug: logLevel > 0,
                    key: storageConfig['persistKey'] || 'reduxPersist',
                    storage: storageConfig['persistStorage'] || storage_1.default,
                }, reducers);
            },
            load: function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        // const { storageSync } = store.config;
                        return [2 /*return*/, new Promise(function activatingStorage(resolve, _reject) {
                                function persistStoreCompleted() {
                                    resolve();
                                }
                                persistor = redux_persist_1.persistStore(store, undefined, persistStoreCompleted);
                                // if (storageSync === true) {
                                //   crossTabSync(store, persistConfig);
                                // } else if (typeof storageSync === 'function') {
                                //   storageSync(store, persistConfig);
                                // }
                            })];
                    });
                });
            }
        };
        return strategy;
    },
};
