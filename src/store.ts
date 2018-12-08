import {
  applyMiddleware,
  combineReducers,
  createStore,
  // Types
  AnyAction,
  Dispatch,
  Middleware,
  Reducer,
  Unsubscribe,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import {
  ReducerMap,
  StorageStrategy,
  StorageStrategyClass,
  StorageStrategyFactory,
  StoreConfig,
} from "./";
import { mapReducersOf } from "./reducers";
import { DefaultStorageStrategy } from "./storage/strategy/DefaultStorageStrategy";

/** Creates a reducer that does not persist to storage.
 * @param store
 * @param reducers
 */
function createNonStorageReducer(
  store: StateStore,
  reducers: ReducerMap
): Reducer {
  return combineReducers(reducers);
}
/** @param store */
function createReduxStore(
  store: StateStore,
  reducers: ReducerMap,
  preloadedState?: any
) {
  const {
    createReducer,
    states,
  } = store.config;
  const rootReducer = createReducer!(store, reducers);
  const storeEnhancer = createStoreEnhancer(store);
  return createStore(
    rootReducer,
    preloadedState,
    storeEnhancer,
  );
}
/** @param store */
function createStoreEnhancer({ config: { middleware, thunk, logger } }: StateStore) {
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

  config: StoreConfig;
  dispatch: Dispatch<AnyAction>
  getState: () => any;
  replaceReducer: (nextReducer: Reducer<any, AnyAction>) => void;
  storage?: StorageStrategy;
  subscribe: (listener: () => void) => Unsubscribe;

  /** Creates a new `StateStore`.
   * @param config */
  constructor(config: StoreConfig) {
    // #region Normalize storageConfig and storageAreas.
    let {
      storageAreas,
      storageConfig = {},
    } = config;
    let StorageStrat = storageConfig.strategy;
    if (typeof storageAreas === "string" && storageAreas === "default") {
      storageAreas = undefined;
      if (!StorageStrat) {
        StorageStrat = DefaultStorageStrategy;
      }
    } else if (storageAreas && !StorageStrat) {
      StorageStrat = DefaultStorageStrategy;
    }
    // #endregion
    // #region Normalize config as much as possible.
    const {
      logLevel = 1,
    } = config;
    config = {
      ...config,
      logLevel,
      storageAreas,
      storageConfig: {
        ...storageConfig,
        strategy: StorageStrat,
      },
    };
    storageConfig = config.storageConfig!;
    this.config = config;
    // #endregion
    // #region Create storage strategy and configure createReducer.
    this.storage = StorageStrat
      ? (<StorageStrategyFactory>StorageStrat).create
        ? (<StorageStrategyFactory>StorageStrat).create(this)
        : new (<StorageStrategyClass>StorageStrat)(this)
      : undefined;
    let {
      createReducer = StorageStrat
        ? (<StorageStrategy>StorageStrat).createReducer
          ? (<StorageStrategy>StorageStrat).createReducer
          : this.storage!.createReducer || createNonStorageReducer
        : createNonStorageReducer,
    } = config;
    config.createReducer = createReducer;
    // #endregion
    // #region Create the store.
    const { states } = config;
    const mapped = mapReducersOf(states);
    storageConfig['persistBlacklist'] = mapped.noPersist;
    storageConfig['persistPurgeKeys'] = mapped.defaultPurgeKeys;
    const redux = createReduxStore(
      this,
      mapped.reducers,
      mapped.preloadedState
    );
    this.dispatch = redux.dispatch;
    this.getState = redux.getState;
    this.replaceReducer = redux.replaceReducer;
    this.subscribe = redux.subscribe;
    // #endregion
  }
}
