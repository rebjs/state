"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var local_1 = require("../local");
var DEFAULT_AREA = "local";
/** Creates the default storage strategy */
function createDefaultStorage(options) {
    if (!options) {
        options = {};
    }
    var _a = options.areas, areas = _a === void 0 ? {
        local: local_1.createStorageLocal(),
    } : _a, _b = options.defaultArea, defaultArea = _b === void 0 ? DEFAULT_AREA : _b;
    /** Creates a reducer that persists to storage. */
    function createReducer(reducers) {
        var baseReducer = redux_1.combineReducers(reducers);
        return function storageReducer(state, action) {
            var oldState = state;
            var newState = baseReducer(oldState, action);
            if (newState === oldState) {
                return state;
            }
            areas[defaultArea].set(state);
            return newState;
        };
    }
    var strategy = {
        flush: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw new Error("Not implemented.");
                });
            });
        },
        init: function (store) {
            return {
                createReducer: createReducer,
            };
        },
        load: function () {
            return Promise.resolve();
        },
        pause: function () {
            throw new Error("Not implemented.");
        },
        persist: function () {
            throw new Error("Not implemented.");
        },
        purge: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var keys;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            keys = Object.keys(areas);
                            return [4 /*yield*/, Promise.all(keys.map(function (key) { return areas[key].clear(); }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, keys];
                    }
                });
            });
        },
    };
    return strategy;
}
exports.createDefaultStorage = createDefaultStorage;
