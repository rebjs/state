import {
  LocalStorageAreaConfig,
  StorageArea,
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

/** Creates a local storage area.
 * @param [type] Type of local storage. (local, session)
 * @param [config] Storage area configuration.
 */
export function createStorageLocal(
  type: "local" | "session" = "local",
  config: LocalStorageAreaConfig = { key: "state" }
): StorageArea {
  // const {
  //   key: rootKey,
  //   keyPrefix = "persist:",
  // } = config;
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
    /** Storage area configuration. */
    config,
    /** @param keyOrKeys */
    get(keyOrKeys: string | string[] | { [s: string]: boolean } | null): Promise<any> {
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
    /** @param keyOrKeys */
    remove(keyOrKeys: string | string[]): Promise<void> {
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
    set(items: { [key: string]: any }): Promise<void> {
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
