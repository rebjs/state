"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var local_1 = require("./local");
/** The default storage strategy and base class.
 * NOTE: A storage strategy does not have to be a `class`. It can be an object
 * that has a functional `create` property.
 */
var DefaultStorageStrategy = /** @class */ (function () {
    /** @param store */
    function DefaultStorageStrategy(store) {
        var _this = this;
        /** Clears all storage areas. **Does NOT clear the in-memory state.**
         * @returns Array of storage area keys cleared.
         */
        this.clear = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var areas, keys;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        areas = this.areas;
                        keys = Object.keys(areas);
                        return [4 /*yield*/, Promise.all(keys.map(function (key) { return areas[key].clear(); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, keys];
                }
            });
        }); };
        /** Loads storage and starts any configured persistence or syncing. */
        this.load = function () {
            // TODO: Load storage and start any configured persistence or syncing.
            return Promise.resolve();
        };
        var _a = store.config.storageAreas, storageAreas = _a === void 0 ? { local: local_1.createStorageLocal() } : _a;
        this.areas = storageAreas;
    }
    /** Creates a reducer that persists to storage.
     * @param store
     * @param reducers
     */
    DefaultStorageStrategy.createReducer = function (store, reducers) {
        var _a = store.config, storageAreas = _a.storageAreas, _b = _a.storageConfig, _c = (_b === void 0 ? {} : _b).defaultArea, defaultArea = _c === void 0 ? "local" : _c;
        var baseReducer = redux_1.combineReducers(reducers);
        return function storageReducer(state, action) {
            var oldState = state;
            var newState = baseReducer(oldState, action);
            if (newState === oldState) {
                return state;
            }
            storageAreas[defaultArea].set(state);
            return newState;
        };
    };
    return DefaultStorageStrategy;
}());
exports.DefaultStorageStrategy = DefaultStorageStrategy;
