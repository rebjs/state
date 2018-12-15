/** @file `StorageStrategy` for package 'redux-persist'.
 * 
 * syncReduxPersist copied from
 * https://github.com/rt2zz/redux-persist-crosstab/pull/17 via
 * https://raw.githubusercontent.com/rt2zz/redux-persist-crosstab/178816cbabbfe2babfeb3a8ae1486ac0b9cc6984/index.js
 *
 * - Changed Flow to Typescript.
 * - Use ES6 export.
 * - Changed formatting.
 * - Renamed some params.
 * - Added storageArea guard.
 * - Added changes guard.
 */
import { Reducer } from "redux";
import {
  KEY_PREFIX,
  persistCombineReducers,
  PersistConfig,
  persistStore,
  Persistor,
  REHYDRATE,
} from "redux-persist";

import {
  ReducerMap,
  StateStore,
  StorageStrategy,
} from "../..";

export type PersistConfigEx = PersistConfig & {
  preload?: (options: PersistConfigEx, slice: string) => any;
  sync?: boolean | PersistSyncConfig | PersistSyncStarter;
};

export interface PersistSyncConfig {
  /** Keys to exclude from synchronization. */
  blacklist?: string[];
  /** The storage area to handle synchronization for.
   * Default **localStorage**. */
  storageArea?: Storage;
  /** Keys to include in sychronization. */
  whitelist?: string[];
}

export type PersistSyncStarter = (
  store: StateStore,
  persistConfig: PersistConfigEx) => void;

export function createReduxPersistStorage(options: PersistConfigEx) {
  /** Received in `init`. */
  let mapping: { defaultPurgeKeys: any[], noPersist: any[] };
  /** Created in `load`. */
  let persistor: Persistor;
  /** Received in `init`. */
  let store: StateStore;
  let {
    preload = preloadNothing,
    sync,
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
        if (sync) {
          if (sync === true) {
            syncReduxPersist(store, options);
          } else if (typeof sync === 'function') {
            sync(store, options);
          } else if (typeof sync === 'object') {
            syncReduxPersist(store, options, sync);
          }
        }
      });
    },
    pause() { return persistor.pause(); },
    persist() { return persistor.persist(); },
    preload(slice: string) { return preload(options, slice); },
    async purge() { return persistor.purge(); },
  } as StorageStrategy;
  return strategy;
}
/** Initializes cross-tab syncing of redux state stored in `localeStorage`.
 * @param store
 * @param persistConfig
 * @param config
 */
function syncReduxPersist(
  store: StateStore,
  persistConfig: PersistConfig,
  config: PersistSyncConfig = {}
): void {
  const {
    key,
    keyPrefix = KEY_PREFIX,
  } = persistConfig;
  const {
    blacklist,
    storageArea = window.localStorage,
    whitelist,
  } = config;
  window.addEventListener('storage', handleStorageEvent, false);

  function handleStorageEvent(e: StorageEvent) {
    if (e.storageArea !== storageArea) {
      return;
    }
    if (e.key && e.key.indexOf(keyPrefix) === 0) {
      if (e.oldValue === e.newValue || e.newValue === null) {
        return;
      }
      let changes = false;
      const statePartial = JSON.parse(e.newValue);
      const state = Object.keys(statePartial).reduce((state, reducerKey) => {
        if (whitelist && whitelist.indexOf(reducerKey) === -1) {
          return state;
        }
        if (blacklist && blacklist.indexOf(reducerKey) !== -1) {
          return state;
        }
        state[reducerKey] = JSON.parse(statePartial[reducerKey]);
        changes = true;
        return state;
      }, {});
      if (!changes) {
        return;
      }
      store.dispatch({
        key,
        payload: state,
        type: REHYDRATE,
      });
    }
  }
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
