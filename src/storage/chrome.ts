import "chrome";

import {
  StorageArea,
  StorageKeyMap,
  StorageKeyOrKeys,
} from "../";

/** Creates a Chrome storage area interface for use inside a Chrome extension
 * or a Chrome app.
 * @param [type] Type of Chrome storage. (local, sync, etc)
 * @param [config] Storage area configuration.
 */
export function createStorageChrome(
  type = "local"
): StorageArea {

  const driver: chrome.storage.StorageArea = chrome.storage[type];

  const storage = {
    /** Clears all storage in the area. */
    clear(): Promise<void> {
      return new Promise((resolve) => {
        driver.clear(resolve);
      });
    },
    /** @param keyOrKeys */
    get(keyOrKeys: StorageKeyOrKeys | StorageKeyMap | null): Promise<any> {
      return new Promise((resolve) => {
        driver.get(keyOrKeys, resolve);
      });
    },
    /** @param keyOrKeys */
    remove(keyOrKeys: StorageKeyOrKeys): Promise<void> {
      return new Promise((resolve) => {
        driver.remove(keyOrKeys, resolve);
      });
    },
    /** @param items */
    set(items: StorageKeyMap): Promise<void> {
      return new Promise((resolve) => {
        driver.set(items, resolve);
      });
    },

  };
  return storage;
}
