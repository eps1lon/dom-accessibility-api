declare global {
	class Map<K, V> {
		// es2015.collection.d.ts
		clear(): void;
		delete(key: K): boolean;
		forEach(
			callbackfn: (value: V, key: K, map: Map<K, V>) => void,
			thisArg?: any,
		): void;
		get(key: K): V | undefined;
		has(key: K): boolean;
		set(key: K, value: V): this;
		readonly size: number;
	}
}

class MapLike<K, V> {
	private keys: K[];
	private values: V[];

	constructor() {
		this.keys = [];
		this.values = [];
	}
	clear() {
		this.keys = [];
		this.values = [];
	}
	delete(key: K): boolean {
		const index = this.keys.indexOf(key);
		if (index === -1) {
			return false;
		}
		this.keys.splice(index, 1);
		this.values.splice(index, 1);
		return true;
	}
	get(key: K): V | undefined {
		const index = this.keys.indexOf(key);
		if (index === -1) {
			return undefined;
		}
		return this.values[index];
	}
	has(key: K): boolean {
		return this.keys.indexOf(key) !== -1;
	}
	set(key: K, value: V): this {
		const index = this.keys.indexOf(key);
		if (index === -1) {
			this.keys.push(key);
			this.values.push(value);
		} else {
			this.values[index] = value;
		}
		return this;
	}
	forEach(
		callbackfn: (value: V, key: K, map: MapLike<K, V>) => void,
		thisArg?: any,
	): void {}
}

export default typeof Map === "undefined" ? Map : MapLike;
