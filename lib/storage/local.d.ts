import { LocalStorageAreaConfig, StorageArea } from "../";
/** Creates a local storage area.
 * @param [type] Type of local storage. (local, session)
 * @param [config] Storage area configuration.
 */
export declare function createStorageLocal(type?: "local" | "session", config?: LocalStorageAreaConfig): StorageArea;
