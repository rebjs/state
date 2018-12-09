import { AnyAction, Dispatch, Reducer, Unsubscribe } from "redux";
import { StorageStrategy, StoreOptions } from "./";
/** Redux state store with persistence and syncing. */
export declare class StateStore {
    dispatch: Dispatch<AnyAction>;
    getState: () => any;
    replaceReducer: (nextReducer: Reducer<any, AnyAction>) => void;
    storage?: StorageStrategy;
    subscribe: (listener: () => void) => Unsubscribe;
    /** Creates a new `StateStore`. */
    constructor(options: StoreOptions);
}
