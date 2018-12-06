import "chrome";
import { StorageArea, StorageAreaConfig } from "./storage";
/** Creates a Chrome storage area interface for use inside a Chrome extension
 * or a Chrome app.
 * @param [type] Type of Chrome storage. (local, sync, etc)
 * @param [config] Storage area configuration.
 */
export declare function createStorageChrome(type?: string, config?: StorageAreaConfig): StorageArea;
