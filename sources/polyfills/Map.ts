declare global {
	class Map<K, V> {
		// es2015.collection.d.ts
		clear(): void;
		delete(key: K): boolean;
		forEach(
			callbackfn: (value: V, key: K, map: Map<K, V>) => void,
			thisArg?: unknown,
		): void;
		get(key: K): V | undefined;
		has(key: K): boolean;
		set(key: K, value: V): this;
		readonly size: number;
	}
}

// we need to export something here to make this file a module, but don't want to
// actually include a polyfill because it's potentially significantly slower than
// the native implementation
export {};
