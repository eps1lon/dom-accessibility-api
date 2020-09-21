declare global {
	class Set<T> {
		// es2015.collection.d.ts
		constructor(items?: T[]);
		add(value: T): this;
		clear(): void;
		delete(value: T): boolean;
		forEach(
			callbackfn: (value: T, value2: T, set: Set<T>) => void,
			thisArg?: unknown
		): void;
		has(value: T): boolean;
		readonly size: number;

		// es2015.iterable.d.ts
		// no  implemennted
	}
}

// for environments without Set we fallback to arrays with unique members
class SetLike<T> implements Set<T> {
	private items: T[];

	constructor(items: T[] = []) {
		this.items = items;
	}

	add(value: T): this {
		if (this.has(value) === false) {
			this.items.push(value);
		}
		return this;
	}
	clear(): void {
		this.items = [];
	}
	delete(value: T): boolean {
		const previousLength = this.items.length;
		this.items = this.items.filter((item) => item !== value);

		return previousLength !== this.items.length;
	}
	forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void): void {
		this.items.forEach((item) => {
			callbackfn(item, item, this);
		});
	}
	has(value: T): boolean {
		return this.items.indexOf(value) !== -1;
	}

	get size(): number {
		return this.items.length;
	}
}

export default typeof Set === "undefined" ? Set : SetLike;
