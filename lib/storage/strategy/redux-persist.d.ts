import { PersistConfig } from "redux-persist";
import { StateStore, StorageStrategy } from "../..";
export declare type PersistConfigEx = PersistConfig & {
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
export declare type PersistSyncStarter = (store: StateStore, persistConfig: PersistConfigEx) => void;
export declare function createReduxPersistStorage(options: PersistConfigEx): StorageStrategy;
/** Loads persisted reducer state data from localStorage, synchronously.
 * @param options The redux-persist config options.
 * @param slice State slice name to load data for.
 */
export declare function preloadReduxPersistLocalStorage(options: PersistConfig, slice: string): any;
