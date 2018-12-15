import { Reducer } from "redux";
import {
  KEY_PREFIX,
  persistCombineReducers,
  PersistConfig,
  persistStore,
  Persistor,
} from "redux-persist";

import {
  ReducerMap,
  StateStore,
  StorageStrategy,
} from "../..";

export type PersistConfigEx = PersistConfig & {
  preload: (options: PersistConfigEx, slice: string) => any;
};

export function createReduxPersistStorage(options: PersistConfigEx) {
  /** Received in `init`. */
  let mapping: { defaultPurgeKeys: any[], noPersist: any[] };
  /** Created in `load`. */
  let persistor: Persistor;
  /** Received in `init`. */
  let store: StateStore;
  let {
    preload = preloadNothing,
  } = options;
  function createReducer(reducers: ReducerMap): Reducer {
    let { blacklist } = options;
    if (blacklist) {
      blacklist = blacklist.concat(mapping.noPersist);
    } else {
      blacklist = mapping.noPersist;
    }
    options.blacklist = blacklist;
    return persistCombineReducers(options, reducers);
  }
  const strategy = {
    async flush() { return persistor.flush(); },
    init(stateStore, stateMapping) {
      store = stateStore;
      mapping = stateMapping;
      return {
        createReducer,
      };
    },
    async load() {
      return new Promise<void>(function loadingStorage(resolve) {
        persistor = persistStore(
          store,
          undefined,
          () => { resolve(); },
        );
        // if (storageSync === true) {
        //   crossTabSync(store, options);
        // } else if (typeof storageSync === 'function') {
        //   storageSync(store, options);
        // }
      });
    },
    pause() { return persistor.pause(); },
    persist() { return persistor.persist(); },
    preload(slice: string) { return preload(options, slice); },
    async purge() { return persistor.purge(); },
  } as StorageStrategy;
  return strategy;
}
/** Loads persisted reducer state data from localStorage, synchronously.
 * @param options The redux-persist config options.
 * @param slice State slice name to load data for.
 */
export function preloadReduxPersistLocalStorage(
  options: PersistConfig,
  slice: string
): any {
  const {
    key,
    keyPrefix = KEY_PREFIX,
  } = options;
  let json = localStorage.getItem(`${keyPrefix}${key}`);
  if (!json) {
    return undefined;
  }
  const root = JSON.parse(json) || {};
  json = root[slice];
  if (!json) {
    return undefined;
  }
  const loadedData = JSON.parse(json);
  return loadedData;
}

function preloadNothing(options: PersistConfig, slice: string) {
  return undefined;
}
