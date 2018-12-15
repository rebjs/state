import {
  applyMiddleware,
  combineReducers,
  createStore,
  AnyAction,
  Dispatch,
  Middleware,
  Reducer,
  Unsubscribe,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import {
  ReducerCreator,
  StorageConfig,
  StorageStrategy,
  StoreOptions,
} from "./";
import { createDefaultStorage } from "./storage/strategy/default";

function createReduxStore(
  options: StoreOptions,
  rootReducer: Reducer,
  preloadedState?: any
) {
  const storeEnhancer = createStoreEnhancer(options);
  return createStore(
    rootReducer,
    preloadedState,
    storeEnhancer,
  );
}
function createStoreEnhancer({ middleware = {} }: StoreOptions) {
  let toApply: Middleware[] = [];
  let logging: Middleware | Middleware[] | undefined;
  let thunking: Middleware | Middleware[] | undefined;
  if (Array.isArray(middleware)) {
    toApply = toApply.concat(middleware);
  } else {
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
  const middlewareEnhancer = applyMiddleware(
    // ORDER: LEFT-TO-RIGHT - The FIRST toApply is executed FIRST.
    ...toApply
  );
  // Compose enhancers into one store enhancer using Redux compose [1] or 
  // composeWithDevTools [2].
  // [1] https://redux.js.org/api-reference/compose
  // [2] https://github.com/zalmoxisus/redux-devtools-extension
  return composeWithDevTools(
    // ORDER: RIGHT-TO-LEFT - The RIGHT-most/BOTTOM enhancer is executed FIRST.
    middlewareEnhancer,
  );
}
/** Returns a map of reducers created from and meta-data gathered from the given
 * `options`.
 * @param options
 * @param storage
 */
function mapReducers(
  options: StoreOptions,
  storage?: StorageStrategy
) {
  const {
    states: reducerSpecs,
  } = options;
  const defaultPurgeKeys: any[] = [];
  const noPersist: any[] = [];
  const reducers = {};
  let preloadedState: any;

  reducerSpecs.forEach(function prepareReducer(reducerSpec) {
    const {
      name,
      persist: shouldPersist,
      preload: shouldPreload = storage ? true : false,
      purge: shouldPurge = shouldPersist,
    } = reducerSpec;
    let loadedData;
    if (!shouldPersist) {
      noPersist.push(name);
    } else if (shouldPreload) {
      loadedData = storage!.preload(name);
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
    defaultPurgeKeys,
    noPersist,
    reducers,
    preloadedState,
  };
}
/** Returns the `reducer` of the given `reducerSpec` or creates one from its
 * `handlers` and `defaults` properties.
 * @param reducerSpec */
function reducerOf(reducerSpec: any): Reducer {
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
/** Redux state store with persistence and syncing. */
export class StateStore {

  dispatch: Dispatch<AnyAction>;
  getState: () => any;
  replaceReducer: (nextReducer: Reducer<any, AnyAction>) => void;
  storage?: StorageStrategy;
  subscribe: (listener: () => void) => Unsubscribe;

  /** Creates a new `StateStore`. */
  constructor(options: StoreOptions) {
    const {
      storage: storageOption,
    } = options;
    let storage: StorageStrategy | undefined;
    if (typeof storageOption === 'boolean') {
      storage = storageOption ? createDefaultStorage() : undefined;
    } else {
      storage = storageOption;
    }
    this.storage = storage;
    let storageConfig: StorageConfig | undefined;
    const mapping = mapReducers(options, storage);
    if (storage) {
      storageConfig = storage.init(this, mapping);
    }
    let {
      createReducer = storageConfig
        ? storageConfig.createReducer || <ReducerCreator>combineReducers
        : <ReducerCreator>combineReducers,
    } = options;
    const rootReducer = createReducer(mapping.reducers);
    const redux = createReduxStore(
      options,
      rootReducer,
      mapping.preloadedState
    );
    this.dispatch = redux.dispatch;
    this.getState = redux.getState;
    this.replaceReducer = redux.replaceReducer;
    this.subscribe = redux.subscribe;
  }
}
