export interface IsInaccessibleOptions {
	getComputedStyle?: typeof window.getComputedStyle;
	/**
	 * Can be used to return cached results from previous isSubtreeInaccessible calls.
	 */
	isSubtreeInaccessible?: (element: Element) => boolean;
}

/**
 * Partial implementation https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
 * which should only be used for elements with a non-presentational role i.e.
 * `role="none"` and `role="presentation"` will not be excluded.
 *
 * Implements aria-hidden semantics (i.e. parent overrides child)
 * Ignores "Child Presentational: True" characteristics
 *
 * @param element
 * @param options
 * @returns {boolean} true if excluded, otherwise false
 */
export function isInaccessible(
	element: Element,
	options: IsInaccessibleOptions = {}
): boolean {
	const {
		getComputedStyle = element.ownerDocument.defaultView?.getComputedStyle,
		isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible,
	} = options;
	if (typeof getComputedStyle !== "function") {
		throw new TypeError(
			"Owner document of the element needs to have an associated window."
		);
	}
	// since visibility is inherited we can exit early
	if (getComputedStyle(element).visibility === "hidden") {
		return true;
	}

	let currentElement: Element | null = element;
	while (currentElement) {
		if (isSubtreeInaccessibleImpl(currentElement, { getComputedStyle })) {
			return true;
		}

		currentElement = currentElement.parentElement;
	}

	return false;
}

export interface IsSubtreeInaccessibleOptions {
	getComputedStyle?: typeof window.getComputedStyle;
}

/**
 *
 * @param element
 * @param options
 * @returns {boolean} - `true` if every child of the element is inaccessible
 */
export function isSubtreeInaccessible(
	element: Element,
	options: IsSubtreeInaccessibleOptions = {}
): boolean {
	const {
		getComputedStyle = element.ownerDocument.defaultView?.getComputedStyle,
	} = options;
	if (typeof getComputedStyle !== "function") {
		throw new TypeError(
			"Owner document of the element needs to have an associated window."
		);
	}

	if ((element as HTMLElement).hidden === true) {
		return true;
	}

	if (element.getAttribute("aria-hidden") === "true") {
		return true;
	}

	if (getComputedStyle(element).display === "none") {
		return true;
	}

	return false;
}
