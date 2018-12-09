import { StorageAreaMap, StorageStrategy } from "../..";
/** Creates the default storage strategy */
export declare function createDefaultStorage(options?: DefaultStorageOptions): StorageStrategy;
export interface DefaultStorageOptions {
    areas?: StorageAreaMap;
    defaultArea?: string;
}
