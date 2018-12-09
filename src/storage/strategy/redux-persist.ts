import { Reducer } from "redux";
import {
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

export function createReduxPersistStorage(options: PersistConfig) {
  /** Received in `init`. */
  let mapping: { defaultPurgeKeys: any[], noPersist: any[] };
  /** Created in `load`. */
  let persistor: Persistor;
  /** Received in `init`. */
  let store: StateStore;
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
    async purge() { return persistor.purge(); },
  } as StorageStrategy;
  return strategy;
}
