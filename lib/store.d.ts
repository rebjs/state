import { AnyAction, Dispatch, Reducer, Unsubscribe } from "redux";
import { StorageStrategy, StoreConfig } from "./";
/** Redux state store with persistence and syncing. */
export declare class StateStore {
    config: StoreConfig;
    storage?: StorageStrategy;
    /** Creates a new `StateStore`.
     * @param config */
    constructor(config: StoreConfig);
    dispatch: Dispatch<AnyAction>;
    getState: () => any;
    replaceReducer: (nextReducer: Reducer<any, AnyAction>) => void;
    subscribe: (listener: () => void) => Unsubscribe;
}
