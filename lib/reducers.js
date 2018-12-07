"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Optionally compose 2 reducers so that the `reducerToInject` (if any) is
 * called before the given `reducer`.
 * @param reducer
 * @param [reducerToInject]
 */
function maybeInjectReducer(reducer, reducerToInject) {
    if (typeof reducerToInject !== "function") {
        return reducer;
    }
    return function injectedReducer(state, action) {
        state = reducerToInject(state, action);
        return reducer(state, action);
    };
}
exports.maybeInjectReducer = maybeInjectReducer;
/**
 * Load persisted reducer state data from localStorage.
 * @param reducerName Name of the reducer to load data for.
 */
function preloadReducerState(reducerName) {
    var json = localStorage.getItem("persist:reduxPersist") || "";
    var loadedData = JSON.parse(json);
    return loadedData[reducerName];
}
exports.preloadReducerState = preloadReducerState;
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
exports.reducerOf = reducerOf;
/** Returns a map of reducers created from and meta-data gathered from the given
 * `reducerSpecs`.
 * @param reducerSpecs
 * @param preload
 */
function mapReducersOf(reducerSpecs, preload) {
    if (preload === void 0) { preload = preloadReducerState; }
    var defaultPurgeKeys = [];
    var noPersist = [];
    var reducers = {};
    var preloadedState;
    reducerSpecs.forEach(function prepareReducer(reducerSpec) {
        var name = reducerSpec.name, shouldPersist = reducerSpec.persist, shouldPreload = reducerSpec.preload, shouldPurge = reducerSpec.purge;
        var loadedData;
        if (!shouldPersist) {
            noPersist.push(name);
        }
        else if (shouldPreload || shouldPreload === undefined) {
            loadedData = preload(name);
            if (loadedData !== undefined) {
                if (preloadedState === undefined)
                    preloadedState = {};
                preloadedState[name] = loadedData;
            }
        }
        if (shouldPurge || (shouldPurge === undefined && shouldPersist)) {
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
exports.mapReducersOf = mapReducersOf;
