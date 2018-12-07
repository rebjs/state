import {
  combineReducers,
  Reducer,
} from "redux";

import {
  ReducerMap,
  StorageAreaMap,
  StorageStrategy,
} from "../";
import { createStorageLocal } from "./local";

/** The default storage strategy and base class.
 * NOTE: A storage strategy does not have to be a `class`. It can be an object
 * that has a functional `create` property.
 */
export class DefaultStorageStrategy implements StorageStrategy {
  /** Creates a reducer that persists to storage.
   * @param store
   * @param reducers
   */
  static createReducer(store: any, reducers: ReducerMap): Reducer {
    const {
      storageAreas,
      storageConfig: {
        defaultArea = "local",
      } = {},
    } = store.config;
    const baseReducer = combineReducers(reducers);

    return function storageReducer(state, action) {
      const oldState = state;
      const newState = baseReducer(oldState, action);
      if (newState === oldState) {
        return state;
      }
      storageAreas[defaultArea].set(state);
      return newState;
    };
  }

  areas: StorageAreaMap;

  /** @param {import("../").StateStore} store */
  constructor(store: any) {
    const {
      storageAreas = { local: createStorageLocal() },
    } = store.config;
    this.areas = storageAreas;
  }
  /** Clears all storage areas. **Does NOT clear the in-memory state.**
   * @returns Array of storage area keys cleared.
   */
  clear = async (): Promise<string[]> => {
    const {
      areas,
    } = this;
    const keys = Object.keys(areas);
    await Promise.all(
      keys.map(key => areas[key].clear()),
    );
    return keys;
  };
  /** Loads storage and starts any configured persistence or syncing. */
  load = (): Promise<void> => {
    // TODO: Load storage and start any configured persistence or syncing.
    return Promise.resolve();
  };
}
