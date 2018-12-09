import {
  StorageArea,
  StorageKeyMap,
  StorageKeyOrKeys,
} from "../";

function getStorageDriver(type: string): Storage {
  let driver: Storage;
  switch (type) {
    case "local":
      driver = window.localStorage;
      break;
    case "session":
      driver = window.sessionStorage;
      break;
    default:
      throw new Error(`Unknown web storage type: ${type}`);
  }
  if (!driver) {
    throw new Error(`Storage driver not found for type: ${type}`);
  }
  return driver;
}

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
export function createStorageLocal(
  type: "local" | "session" = "local",
  options: LocalStorageAreaOptions = { key: "state" }
): LocalStorageArea {

  const { key: rootKey } = options;
  const driver = getStorageDriver(type);

  /** @param key
   * @param defaultValue
   */
  function getDataForKey(key: string, defaultValue: any = undefined): any {
    const value = driver.getItem(key);
    if (!value) {
      return defaultValue;
    }
    return JSON.parse(value);
  }
  /** @param defaults */
  function getDataWithDefaults(defaults: object): any {
    if (!defaults) {
      return undefined;
    }
    const keys = Object.keys(defaults);
    const len = keys.length;
    const collection = {};
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      collection[key] = getDataForKey(key, defaults[key]);
    }
    return collection;
  }
  /** @param mapping
   * @param key
   */
  function mapDataForKey(mapping: object, key: string, /* index, keys */): any {
    mapping[key] = getDataForKey(key, undefined);
    return mapping;
  }
  function removeDataForKey(key: string): void {
    driver.removeItem(key);
  }

  const storage = {
    /** Clears all storage in the area. */
    clear(): Promise<void> {
      driver.clear();
      return Promise.resolve();
    },
    /** @param keyOrKeys */
    get(keyOrKeys: StorageKeyOrKeys | StorageKeyMap | null): Promise<any> {
      let data;
      if (typeof keyOrKeys === "string") {
        data = getDataForKey(keyOrKeys);
      }
      if (Array.isArray(keyOrKeys)) {
        data = keyOrKeys.reduce(mapDataForKey, {});
      }
      if (keyOrKeys === null) {
        keyOrKeys = Object.keys(driver);
        data = keyOrKeys.reduce(mapDataForKey, {});
      }
      data = getDataWithDefaults(<object>keyOrKeys);
      return Promise.resolve(data);
    },
    /** Key in `localStorage` to store state for this area. */
    key: rootKey,
    /** @param keyOrKeys */
    remove(keyOrKeys: StorageKeyOrKeys): Promise<void> {
      if (keyOrKeys) {
        if (typeof keyOrKeys === "string") {
          driver.removeItem(keyOrKeys);
        } else if (Array.isArray(keyOrKeys)) {
          keyOrKeys.forEach(removeDataForKey);
        }
      }
      return Promise.resolve();
    },
    /** @param items */
    set(items: StorageKeyMap): Promise<void> {
      const keys = Object.keys(items);
      const len = keys.length;
      for (let i = 0; i < len; i++) {
        const key = keys[i];
        const data = items[key];
        const value = JSON.stringify(data);
        driver.setItem(key, value);
      }
      return Promise.resolve();
    },
  };
  return storage;
}
