import {
  applyMiddleware,
  combineReducers,
  createStore,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { mapReducersOf } from "./reducers";
import { StorageStrategy } from "./storage/storage";

/** Creates a reducer that does not persist to storage.
 * @param {StateStore} store
 * @param {{[x:string]:Reducer}} reducers
 * @returns {Reducer}
 */
function createNonStorageReducer(store, reducers) {
  return combineReducers(reducers);
}
/** @param {StateStore} store */
function createReduxStore(store) {
  const {
    createReducer,
    states,
  } = store.config;
  const reducerMap = mapReducersOf(states);
  const rootReducer = createReducer(store, reducerMap.reducers);
  const storeEnhancer = createStoreEnhancer(store);
  return createStore(
    rootReducer,
    reducerMap.preloadedState,
    storeEnhancer,
  );
}
/** @param {StateStore} store */
function createStoreEnhancer({ config: { middleware, thunk, logger } }) {
  let toApply = [];
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
  /** Creates a new `StateStore`.
   * @param {StoreConfig} config */
  constructor(config) {
    // #region Normalize storageConfig and storageAreas.
    let {
      storageAreas,
      storageConfig = {},
    } = config;
    /** @type {typeof StorageStrategy} */
    let StorageStrat = storageConfig.stategy;
    if (typeof storageAreas === "string" && storageAreas === "default") {
      storageAreas = undefined;
      StorageStrat = StorageStrat || StorageStrategy;
    } else if (storageAreas && !StorageStrat) {
      StorageStrat = StorageStrategy;
    }
    if (!storageAreas && StorageStrat && StorageStrat.createDefaultAreas) {
      storageAreas = StorageStrat.createDefaultAreas();
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
        stategy: StorageStrat,
      },
    };
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
    let {
      createReducer = StorageStrat
        ? StorageStrat.createReducer
          ? StorageStrat.createReducer
          : this.storage.createReducer || createNonStorageReducer
        : createNonStorageReducer,
    } = config;
    config.createReducer = createReducer;
    // #endregion
    // #region Create the store.
    const redux = createReduxStore(this);
    this.dispatch = redux.dispatch;
    this.getState = redux.getState;
    this.replaceReducer = redux.replaceReducer;
    this.subscribe = redux.subscribe;
    // #endregion
  }
}
