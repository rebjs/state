import {
  Middleware,
  Reducer,
} from "redux";

export * from "./storage/local";
export * from "./storage/strategy";
export * from "./reducers";
export * from "./store";

export interface LocalStorageAreaConfig extends StorageAreaConfig {
  /** Key for this area in the local storage. */
  key: string;
}
export type ReducerCreator = (
  store: import('./store').StateStore,
  reducers: ReducerMap
) => Reducer;
export type ReducerMap = { [key: string]: Reducer };
export interface StorageArea {
  /** Removes all items from storage. */
  clear(): Promise<void>;
  /** Configuration for the storage area. */
  config: StorageAreaConfig;
  /** Gets one or more items from storage. */
  get(keyOrKeys: StorageKeyOrKeys | StorageKeyMap | null): Promise<any>;
  /** Removes one or more items from storage. */
  remove(keyOrKeys: StorageKeyOrKeys): Promise<void>;
  /** Sets multiple items. */
  set(items: StorageKeyMap): Promise<void>;
}
export interface StorageAreaConfig {
  /** Time in milliseconds to throttle writes to the storage area. */
  throttle?: number;
}
export type StorageAreaMap = { [key: string]: StorageArea };
export type StorageAreaMapConfig = StorageAreaMap | string;
export interface StorageConfig {
  /** Name of the default storage area. Default: **local** */
  defaultArea?: string;
  /** Storage strategy class or factory. */
  strategy?: StorageStrategyType;
  /** Default time in milliseconds to throttle writes to a given storage area.
   * May be overridden by individual storage area config. */
  throttle?: number;
}
export type StorageKeyMap = { [key: string]: any };
export type StorageKeyOrKeys = string | string[];
export interface StorageStrategy {
  /** Map of storage areas by name. */
  areas: StorageAreaMap;
  /** Clears all storage areas. **Does NOT clear the in-memory state.**
   * @returns An array of storage area keys cleared. */
  clear: () => Promise<string[]>;
  /** Creates a reducer that persists to storage. */
  createReducer?: (store: import('./store').StateStore, reducers: ReducerMap) => any;
  /** Loads storage and starts any configured persistence or syncing. */
  load: () => Promise<void>;
}
export interface StorageStrategyClass {
  new(store: import('./store').StateStore): StorageStrategy;
}
export type StorageStrategyType =
  StorageStrategy | StorageStrategyClass | StorageStrategyFactory;
export interface StorageStrategyFactory {
  create: (store: import('./store').StateStore) => StorageStrategy;
}
export interface StoreConfig {
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
  /** Map of storage areas. */
  storageAreas?: StorageAreaMapConfig;
  /** Store-wide storage configuration. */
  storageConfig?: StorageConfig;
  /** Middleware for thunking. (e.g. redux-thunk) */
  thunk?: Middleware;
}