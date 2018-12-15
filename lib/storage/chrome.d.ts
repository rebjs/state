import "chrome";
import { StorageArea } from "../";
/** Creates a Chrome storage area interface for use inside a Chrome extension
 * or a Chrome app.
 * @param [type] Type of Chrome storage. (local, sync, etc)
 * @param [config] Storage area configuration.
 */
export declare function createStorageChrome(type?: string): StorageArea;
