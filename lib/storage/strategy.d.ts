import { Reducer } from "redux";
import { ReducerMap, StorageAreaMap, StorageStrategy } from "../";
/** The default storage strategy and base class.
 * NOTE: A storage strategy does not have to be a `class`. It can be an object
 * that has a functional `create` property.
 */
export declare class DefaultStorageStrategy implements StorageStrategy {
    /** Creates a reducer that persists to storage.
     * @param store
     * @param reducers
     */
    static createReducer(store: any, reducers: ReducerMap): Reducer;
    areas: StorageAreaMap;
    /** @param {import("../").StateStore} store */
    constructor(store: any);
    /** Clears all storage areas. **Does NOT clear the in-memory state.**
     * @returns Array of storage area keys cleared.
     */
    clear: () => Promise<string[]>;
    /** Loads storage and starts any configured persistence or syncing. */
    load: () => Promise<void>;
}
