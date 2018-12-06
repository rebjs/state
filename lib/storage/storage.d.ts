export interface LocalStorageAreaConfig extends StorageAreaConfig {
  /** Key for this area in the local storage. */
  key: string;
}

type ReducerMap = { [key: string]: import('redux').Reducer };

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

export interface StorageConfig {
  /** Name of the default storage area. Default: **local** */
  defaultArea?: string;
  /** Storage strategy class or factory. */
  strategy?: any;
  /** Default time in milliseconds to throttle writes to a given storage area.
   * May be overridden by individual storage area config. */
  throttle?: number;
}

export type StorageKeyMap = { [key: string]: any };
export type StorageKeyOrKeys = string | string[];

export interface StorageStrategy {
  /** Map of storage areas by name. */
  areas: { [key: string]: StorageArea };
  /** Clears all storage areas. **Does NOT clear the in-memory state.**
   * @returns An array of storage area keys cleared. */
  clear: () => Promise<string[]>;
  /** Creates a reducer that persists to storage. */
  createReducer?: (store: any, reducers: ReducerMap) => any;
  /** Loads storage and starts any configured persistence or syncing. */
  load: () => Promise<void>;
}

export interface StorageStrategyClass {
  new(store: any): StorageStrategy;
}

export type StorageStrategyType =
  StorageStrategy | StorageStrategyClass | StorageStrategyFactory;

export interface StorageStrategyFactory {
  create: (store: any) => void;
}
