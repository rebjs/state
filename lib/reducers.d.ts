import { Reducer } from "redux";
/** Optionally compose 2 reducers so that the `reducerToInject` (if any) is
 * called before the given `reducer`.
 * @param reducer
 * @param [reducerToInject]
 */
export declare function maybeInjectReducer(reducer: Reducer, reducerToInject?: Reducer): Reducer;
/**
 * Load persisted reducer state data from localStorage.
 * @param reducerName Name of the reducer to load data for.
 */
export declare function preloadReducerState(reducerName: string): any;
/** Returns the `reducer` of the given `reducerSpec` or creates one from its
 * `handlers` and `defaults` properties.
 * @param reducerSpec */
export declare function reducerOf(reducerSpec: any): Reducer;
/** Returns a map of reducers created from and meta-data gathered from the given
 * `reducerSpecs`.
 * @param reducerSpecs
 * @param preload
 */
export declare function mapReducersOf(reducerSpecs: any[], preload?: typeof preloadReducerState): {
    defaultPurgeKeys: any[];
    noPersist: any[];
    reducers: {};
    preloadedState: any;
};
