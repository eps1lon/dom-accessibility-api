// copied from https://github.com/microsoft/TypeScript/blob/eaeee9cc31bdc3a16f982a2e7b784573c977fdfa/lib/
// but with `unknown` instead of `any`
interface IteratorYieldResult<TYield> {
	done?: false;
	value: TYield;
}

interface IteratorReturnResult<TReturn> {
	done: true;
	value: TReturn;
}

type IteratorResult<T, TReturn = unknown> =
	| IteratorYieldResult<T>
	| IteratorReturnResult<TReturn>;

interface Iterator<T, TReturn = unknown, TNext = undefined> {
	// NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
	next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
	return?(value?: TReturn): IteratorResult<T, TReturn>;
	throw?(e?: unknown): IteratorResult<T, TReturn>;
}

interface Iterable<T> {
	[Symbol.iterator](): Iterator<T>;
}

interface IterableIterator<T> extends Iterator<T> {
	[Symbol.iterator](): IterableIterator<T>;
}
interface SymbolConstructor {
	/**
	 * A method that returns the default iterator for an object. Called by the semantics of the
	 * for-of statement.
	 */
	readonly iterator: symbol;
}

declare const Symbol: SymbolConstructor;

declare module "core-js-pure/stable/set" {
	interface Set<T> {
		add(value: T): this;
		clear(): void;
		delete(value: T): boolean;
		forEach(
			callbackfn: (value: T, value2: T, set: Set<T>) => void,
			thisArg?: unknown
		): void;
		has(value: T): boolean;
		readonly size: number;
	}

	interface Set<T> {
		/** Iterates over values in the set. */
		[Symbol.iterator](): IterableIterator<T>;
		/**
		 * Returns an iterable of [v,v] pairs for every value `v` in the set.
		 */
		entries(): IterableIterator<[T, T]>;
		/**
		 * Despite its name, returns an iterable of the values in the set,
		 */
		keys(): IterableIterator<T>;

		/**
		 * Returns an iterable of values in the set.
		 */
		values(): IterableIterator<T>;
	}

	interface SetConstructor {
		new <T = unknown>(values?: readonly T[] | null): Set<T>;
		readonly prototype: Set<unknown>;
	}

	const Set: SetConstructor;
	export default Set;
}

declare module "core-js-pure/features/array/from" {
	/**
	 * Creates an array from an iterable object.
	 * @param iterable An iterable object to convert to an array.
	 */
	export default function from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];

	/**
	 * Creates an array from an iterable object.
	 * @param iterable An iterable object to convert to an array.
	 * @param mapfn A mapping function to call on every element of the array.
	 * @param thisArg Value of 'this' used to invoke the mapfn.
	 */
	export default function from<T, U>(
		iterable: Iterable<T> | ArrayLike<T>,
		mapfn: (v: T, k: number) => U,
		thisArg?: unknown
	): U[];
}
