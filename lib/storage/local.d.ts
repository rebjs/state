import { StorageArea } from "../";
export interface LocalStorageArea extends StorageArea {
    key: string;
}
export interface LocalStorageAreaOptions {
    /** Key in `localStorage` to store state for this area. */
    key: string;
}
/** Creates a local storage area.
 * @param [type] Type of local storage. (local, session)
 * @param [config] Storage area configuration.
 */
export declare function createStorageLocal(type?: "local" | "session", options?: LocalStorageAreaOptions): LocalStorageArea;
