import {
  combineReducers,
  Reducer,
} from "redux";

import {
  ReducerMap,
  StorageAreaMap,
  StorageStrategy,
} from "../..";
import { createStorageLocal } from "../local";

const DEFAULT_AREA = "local";

/** Creates the default storage strategy */
export function createDefaultStorage(options?: DefaultStorageOptions) {
  if (!options) {
    options = {};
  }
  const {
    areas = {
      local: createStorageLocal(),
    },
    defaultArea = DEFAULT_AREA,
  } = options;
  /** Creates a reducer that persists to storage. */
  function createReducer(reducers: ReducerMap): Reducer {
    const baseReducer = combineReducers(reducers);
    return function storageReducer(state, action) {
      const oldState = state;
      const newState = baseReducer(oldState, action);
      if (newState === oldState) {
        return state;
      }
      areas[defaultArea].set(state);
      return newState;
    };
  }
  const strategy = {
    async flush(): Promise<any> {
      throw new Error("Not implemented.");
    },
    init(store) {
      return {
        createReducer,
      };
    },
    load() {
      return Promise.resolve();
    },
    pause() {
      throw new Error("Not implemented.");
    },
    persist() {
      throw new Error("Not implemented.");
    },
    async purge() {
      const keys = Object.keys(areas);
      await Promise.all(
        keys.map(key => areas[key].clear()),
      );
      return keys;
    },
  } as StorageStrategy;
  return strategy;
}

export interface DefaultStorageOptions {
  areas?: StorageAreaMap;
  defaultArea?: string;
}
