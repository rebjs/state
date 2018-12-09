import {
  Middleware,
  Reducer,
} from "redux";

export * from "./storage/local";
export * from "./storage/strategy/default";
export * from "./reducers";
export * from "./store";

export type ReducerCreator = (reducers: ReducerMap) => Reducer;
export type ReducerMap = { [key: string]: Reducer };
export interface StorageArea {
  /** Removes all items from storage. */
  clear(): Promise<void>;
  /** Gets one or more items from storage. */
  get(keyOrKeys: StorageKeyOrKeys | StorageKeyMap | null): Promise<any>;
  /** Removes one or more items from storage. */
  remove(keyOrKeys: StorageKeyOrKeys): Promise<void>;
  /** Sets multiple items. */
  set(items: StorageKeyMap): Promise<void>;
}
export type StorageAreaMap = { [key: string]: StorageArea };
export type StorageKeyMap = { [key: string]: any };
export type StorageKeyOrKeys = string | string[];
/** Exposes state storage functions. */
export interface StorageStrategy {
  /** Immediately writes all pending state to storage. */
  flush: () => Promise<any>;
  /** Called by `StateStore` to initialize the strategy. */
  init: (
    store: import('./store').StateStore,
    mapping: { defaultPurgeKeys: any[], noPersist: any[] }
  ) => StorageConfig;
  /** Loads storage and starts any configured persistence or syncing. */
  load: () => Promise<any>;
  /** Pauses storage persistence. */
  pause: () => any;
  /** Resumes storage persistence. */
  persist: () => any;
  /** Purges state from storage. */
  purge: () => Promise<any>;
}
/** Storage strategy configuration provided for `StateStore`. */
export interface StorageConfig {
  /** Creates a reducer that persists to storage. */
  createReducer?: ReducerCreator;
}
/** Options used to create a `StateStore`. */
export interface StoreOptions {
  /** Function to create the root reducer. If none is passed, the built-in
   * `createStorageReducer` will be used. */
  createReducer?: ReducerCreator;
  /** (0: Off, 1: Debug, 2: Info, 3: Warn, 4: Error) */
  logLevel?: number;
  /** Middleware for logging. (e.g. redux-logger) */
  logger?: Middleware;
  /** All other middleware. */
  middleware?: Middleware[];
  /** State reducer configurations. */
  states: any[];
  /** Storage strategy object. */
  storage?: StorageStrategy | boolean;
  /** Middleware for thunking. (e.g. redux-thunk) */
  thunk?: Middleware;
}