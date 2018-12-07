"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var developmentOnly_1 = require("redux-devtools-extension/developmentOnly");
var reducers_1 = require("./reducers");
var strategy_1 = require("./storage/strategy");
/** Creates a reducer that does not persist to storage.
 * @param {StateStore} store
 * @param {ReducerMap} reducers
 * @returns {Reducer}
 */
function createNonStorageReducer(store, reducers) {
    return redux_1.combineReducers(reducers);
}
/** @param {StateStore} store */
function createReduxStore(store) {
    var _a = store.config, createReducer = _a.createReducer, states = _a.states;
    var reducerMap = reducers_1.mapReducersOf(states);
    var rootReducer = createReducer(store, reducerMap.reducers);
    var storeEnhancer = createStoreEnhancer(store);
    return redux_1.createStore(rootReducer, reducerMap.preloadedState, storeEnhancer);
}
/** @param {StateStore} store */
function createStoreEnhancer(_a) {
    var _b = _a.config, middleware = _b.middleware, thunk = _b.thunk, logger = _b.logger;
    var toApply = [];
    if (middleware) {
        toApply = toApply.concat(middleware);
    }
    // Thunk should probably be last, but before logger.
    // See https://github.com/reduxjs/redux-thunk/issues/134
    if (thunk) {
        toApply.push(thunk);
    }
    // Logger must be LAST.
    // See https://github.com/evgenyrodionov/redux-logger#usage
    if (logger) {
        toApply.push(logger);
    }
    var middlewareEnhancer = redux_1.applyMiddleware.apply(void 0, toApply);
    // Compose enhancers into one store enhancer using Redux compose [1] or 
    // composeWithDevTools [2].
    // [1] https://redux.js.org/api-reference/compose
    // [2] https://github.com/zalmoxisus/redux-devtools-extension
    return developmentOnly_1.composeWithDevTools(
    // ORDER: RIGHT-TO-LEFT - The RIGHT-most/BOTTOM enhancer is executed FIRST.
    middlewareEnhancer);
}
/** Redux state store with persistence and syncing. */
var StateStore = /** @class */ (function () {
    /** Creates a new `StateStore`.
     * @param config */
    function StateStore(config) {
        // #region Normalize storageConfig and storageAreas.
        var storageAreas = config.storageAreas, _a = config.storageConfig, storageConfig = _a === void 0 ? {} : _a;
        var StorageStrat = storageConfig.strategy;
        if (typeof storageAreas === "string" && storageAreas === "default") {
            storageAreas = undefined;
            StorageStrat = StorageStrat || strategy_1.DefaultStorageStrategy;
        }
        else if (storageAreas && !StorageStrat) {
            StorageStrat = strategy_1.DefaultStorageStrategy;
        }
        // #endregion
        // #region Normalize config as much as possible.
        var _b = config.logLevel, logLevel = _b === void 0 ? 1 : _b;
        config = tslib_1.__assign({}, config, { logLevel: logLevel,
            storageAreas: storageAreas, storageConfig: tslib_1.__assign({}, storageConfig, { strategy: StorageStrat }) });
        this.config = config;
        // #endregion
        // #region Create storage strategy and configure createReducer.
        /** A storage strategy class or object with factory methods.
         * @type {StorageStrategy}
         */
        this.storage = StorageStrat
            ? StorageStrat.create
                ? StorageStrat.create(this)
                : new StorageStrat(this)
            : undefined;
        var _c = config.createReducer, createReducer = _c === void 0 ? StorageStrat
            ? StorageStrat.createReducer
                ? StorageStrat.createReducer
                : this.storage.createReducer || createNonStorageReducer
            : createNonStorageReducer : _c;
        config.createReducer = createReducer;
        // #endregion
        // #region Create the store.
        var redux = createReduxStore(this);
        this.dispatch = redux.dispatch;
        this.getState = redux.getState;
        this.replaceReducer = redux.replaceReducer;
        this.subscribe = redux.subscribe;
        // #endregion
    }
    return StateStore;
}());
exports.StateStore = StateStore;
