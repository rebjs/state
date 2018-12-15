"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var developmentOnly_1 = require("redux-devtools-extension/developmentOnly");
var default_1 = require("./storage/strategy/default");
function createReduxStore(options, rootReducer, preloadedState) {
    var storeEnhancer = createStoreEnhancer(options);
    return redux_1.createStore(rootReducer, preloadedState, storeEnhancer);
}
function createStoreEnhancer(_a) {
    var _b = _a.middleware, middleware = _b === void 0 ? {} : _b;
    var toApply = [];
    var logging;
    var thunking;
    if (Array.isArray(middleware)) {
        toApply = toApply.concat(middleware);
    }
    else {
        logging = middleware.logging;
        thunking = middleware.thunking;
    }
    // Thunk should probably be last, but before logger.
    // See https://github.com/reduxjs/redux-thunk/issues/134
    if (thunking) {
        toApply = toApply.concat(thunking);
    }
    // Logger must be LAST.
    // See https://github.com/evgenyrodionov/redux-logger#usage
    if (logging) {
        toApply = toApply.concat(logging);
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
/** Returns a map of reducers created from and meta-data gathered from the given
 * `options`.
 * @param options
 * @param storage
 */
function mapReducers(options, storage) {
    var reducerSpecs = options.states;
    var defaultPurgeKeys = [];
    var noPersist = [];
    var reducers = {};
    var preloadedState;
    reducerSpecs.forEach(function prepareReducer(reducerSpec) {
        var name = reducerSpec.name, shouldPersist = reducerSpec.persist, _a = reducerSpec.preload, shouldPreload = _a === void 0 ? storage ? true : false : _a, _b = reducerSpec.purge, shouldPurge = _b === void 0 ? shouldPersist : _b;
        var loadedData;
        if (!shouldPersist) {
            noPersist.push(name);
        }
        else if (shouldPreload) {
            loadedData = storage.preload(name);
            if (loadedData !== undefined) {
                if (preloadedState === undefined)
                    preloadedState = {};
                preloadedState[name] = loadedData;
            }
        }
        if (shouldPurge) {
            defaultPurgeKeys.push(name);
        }
        reducers[name] = reducerOf(reducerSpec);
    });
    return {
        defaultPurgeKeys: defaultPurgeKeys,
        noPersist: noPersist,
        reducers: reducers,
        preloadedState: preloadedState,
    };
}
/** Returns the `reducer` of the given `reducerSpec` or creates one from its
 * `handlers` and `defaults` properties.
 * @param reducerSpec */
function reducerOf(reducerSpec) {
    var _a = reducerSpec.defaults, defaults = _a === void 0 ? {} : _a, _b = reducerSpec.handlers, handlers = _b === void 0 ? {} : _b, reducer = reducerSpec.reducer;
    if (reducer)
        return reducer;
    function autoReducer(state, action) {
        var actionType = action.type;
        var handler = handlers[actionType];
        if (typeof handler !== "function")
            return state || defaults;
        var newState = handler(state, action);
        return newState || state || defaults;
    }
    return autoReducer;
}
/** Redux state store with persistence and syncing. */
var StateStore = /** @class */ (function () {
    /** Creates a new `StateStore`. */
    function StateStore(options) {
        var storageOption = options.storage;
        var storage;
        if (typeof storageOption === 'boolean') {
            storage = storageOption ? default_1.createDefaultStorage() : undefined;
        }
        else {
            storage = storageOption;
        }
        this.storage = storage;
        var storageConfig;
        var mapping = mapReducers(options, storage);
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
