import { PersistConfig } from "redux-persist";
import { StorageStrategy } from "../..";
export declare type PersistConfigEx = PersistConfig & {
    preload: (options: PersistConfigEx, slice: string) => any;
};
export declare function createReduxPersistStorage(options: PersistConfigEx): StorageStrategy;
/** Loads persisted reducer state data from localStorage, synchronously.
 * @param options The redux-persist config options.
 * @param slice State slice name to load data for.
 */
export declare function preloadReduxPersistLocalStorage(options: PersistConfig, slice: string): any;
