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
import { mapReducersOf } from "./reducers";
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

function createStoreEnhancer({ middleware, thunk, logger }: StoreOptions) {
  let toApply: Middleware[] = [];
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
      states,
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
    const mapping = mapReducersOf(states);
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
