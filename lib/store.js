"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var developmentOnly_1 = require("redux-devtools-extension/developmentOnly");
var reducers_1 = require("./reducers");
var default_1 = require("./storage/strategy/default");
function createReduxStore(options, rootReducer, preloadedState) {
    var storeEnhancer = createStoreEnhancer(options);
    return redux_1.createStore(rootReducer, preloadedState, storeEnhancer);
}
function createStoreEnhancer(_a) {
    var middleware = _a.middleware, thunk = _a.thunk, logger = _a.logger;
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
    /** Creates a new `StateStore`. */
    function StateStore(options) {
        var states = options.states, storageOption = options.storage;
        var storage;
        if (typeof storageOption === 'boolean') {
            storage = storageOption ? default_1.createDefaultStorage() : undefined;
        }
        else {
            storage = storageOption;
        }
        this.storage = storage;
        var storageConfig;
        var mapping = reducers_1.mapReducersOf(states);
        if (storage) {
            storageConfig = storage.init(this, mapping);
        }
        var _a = options.createReducer, createReducer = _a === void 0 ? storageConfig
            ? storageConfig.createReducer || redux_1.combineReducers
            : redux_1.combineReducers : _a;
        var rootReducer = createReducer(mapping.reducers);
        var redux = createReduxStore(options, rootReducer, mapping.preloadedState);
        this.dispatch = redux.dispatch;
        this.getState = redux.getState;
        this.replaceReducer = redux.replaceReducer;
        this.subscribe = redux.subscribe;
    }
    return StateStore;
}());
exports.StateStore = StateStore;
