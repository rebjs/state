export interface StorageAreaConfig {
    throttle?: number;
}
export interface LocalStorageAreaConfig extends StorageAreaConfig {
    key: string;
}
export declare function createStorageLocal(type?: "local" | "session", config?: LocalStorageAreaConfig): {
    clear(): Promise<void>;
    config: LocalStorageAreaConfig;
    get(keyOrKeys: string | string[] | {
        [s: string]: boolean;
    } | null): Promise<any>;
    remove(keyOrKeys: string | string[]): Promise<void>;
    set(items: {
        [key: string]: any;
    }): Promise<void>;
};
