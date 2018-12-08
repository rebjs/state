import {
  AnyAction,
  Reducer,
} from "redux";


/** Optionally compose 2 reducers so that the `reducerToInject` (if any) is
 * called before the given `reducer`.
 * @param reducer
 * @param [reducerToInject]
 */
export function maybeInjectReducer(
  reducer: Reducer,
  reducerToInject?: Reducer
): Reducer {
  if (typeof reducerToInject !== "function") {
    return reducer;
  }
  return function injectedReducer(state: any, action: AnyAction) {
    state = reducerToInject(state, action);
    return reducer(state, action);
  }
}
/**
 * Load persisted reducer state data from localStorage.
 * @param reducerName Name of the reducer to load data for.
 */
export function preloadReducerState(reducerName: string): any {
  const json = localStorage.getItem("persist:reduxPersist");
  if (!json) {
    return undefined;
  }
  const loadedData = JSON.parse(json);
  return loadedData[reducerName];
}
/** Returns the `reducer` of the given `reducerSpec` or creates one from its
 * `handlers` and `defaults` properties.
 * @param reducerSpec */
export function reducerOf(reducerSpec: any): Reducer {
  const {
    defaults = {},
    handlers = {},
    reducer,
  } = reducerSpec;
  if (reducer)
    return reducer;
  function autoReducer(state: any, action: AnyAction) {
    const actionType = action.type;
    const handler = handlers[actionType];
    if (typeof handler !== "function")
      return state || defaults;
    const newState = handler(state, action);
    return newState || state || defaults;
  }
  return autoReducer;
}
/** Returns a map of reducers created from and meta-data gathered from the given
 * `reducerSpecs`.
 * @param reducerSpecs
 * @param preload
 */
export function mapReducersOf(reducerSpecs: any[], preload = preloadReducerState) {
  const defaultPurgeKeys: any[] = [];
  const noPersist: any[] = [];
  const reducers = {};
  let preloadedState: any;

  reducerSpecs.forEach(function prepareReducer(reducerSpec) {
    const {
      name,
      persist: shouldPersist,
      preload: shouldPreload,
      purge: shouldPurge,
    } = reducerSpec;
    let loadedData;
    if (!shouldPersist) {
      noPersist.push(name);
    } else if (shouldPreload || shouldPreload === undefined) {
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
    defaultPurgeKeys,
    noPersist,
    reducers,
    preloadedState,
  };
}
