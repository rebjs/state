import {
  persistCombineReducers,
  persistStore,
  // Types
  Persistor
} from "redux-persist";
import reduxPersistStorage from "redux-persist/lib/storage"

import {
  StorageStrategy,
  StorageStrategyFactory,
} from "../../";

export const ReduxPersistStorageStrategy = {
  create(store) {
    let persistor: Persistor;
    const strategy = {
      areas: {},
      clear() {
        persistor.purge();
        return Promise.resolve([] as string[]);
      },
      createReducer(store, reducers) {
        const {
          config: {
            logLevel = 0,
            storageConfig = {},
          },
        } = store;
        return persistCombineReducers({
          blacklist: storageConfig['persistBlacklist'] || [],
          debug: logLevel > 0,
          key: storageConfig['persistKey'] || 'reduxPersist',
          storage: storageConfig['persistStorage'] || reduxPersistStorage,
        }, reducers);
      },
      async load(): Promise<void> {
        // const { storageSync } = store.config;
        return new Promise<void>(function activatingStorage(resolve, _reject) {
          function persistStoreCompleted() {
            resolve();
          }
          persistor = persistStore(
            store,
            undefined,
            persistStoreCompleted
          );
          // if (storageSync === true) {
          //   crossTabSync(store, persistConfig);
          // } else if (typeof storageSync === 'function') {
          //   storageSync(store, persistConfig);
          // }
        });
      }
    } as StorageStrategy;
    return strategy;
  },
} as StorageStrategyFactory;
