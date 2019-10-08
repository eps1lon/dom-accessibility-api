import { prettyDOM } from "@testing-library/dom";

/**
 * implements https://w3c.github.io/accname/
 */

/**
 *  A string of characters where all carriage returns, newlines, tabs, and form-feeds are replaced with a single space, and multiple spaces are reduced to a single space. The string contains only character data; it does not contain any markup.
 */
type FlatString = string & {
	__flat: true;
};

type MaybeFlat = string | FlatString;

/**
 *
 * @param {string} string -
 * @returns {FlatString} -
 */
function asFlatString(s: string): FlatString {
	return s.trim().replace(/\s\s+/g, " ") as FlatString;
}

function isEmpty(s: string | null | undefined): s is string {
	return s == null || s.length === 0;
}

function appendResultWithoutSpace<T extends MaybeFlat, U extends MaybeFlat>(
	result: T,
	x: U
): T | U {
	return `${x}${result}` as T | U;
}
function appendResultWithSpace<T extends MaybeFlat, U extends MaybeFlat>(
	result: T,
	x: U
): T | U {
	return `${x} ${result}` as T | U;
}
function prependResultWithoutSpace(result: string, x: string = ""): string {
	return `${result}${x}`;
}
function prepenResultWithSpace(result: string, x: string = ""): string {
	return `${result} ${x}`;
}

/**
 * TODO
 */
function prohibitsNaming(node: Node): boolean {
	return false;
}

function isElement(node: Node | null): node is Element {
	return (
		// @ts-ignore
		node !== null && node instanceof node.ownerDocument.defaultView.Element
	);
}

function isHTMLInputElement(node: Node | null): node is HTMLInputElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLInputElement
	);
}

function safeWindow(node: Node): Window {
	if (node.isConnected === false) {
		throw new TypeError(`Can't reach window from disconnected node`);
	}

	return node.ownerDocument!.defaultView!;
}

/**
 *
 * @param {Node} node -
 * @returns {boolean} -
 */
function isHidden(node: Node): node is Element {
	if (!isElement(node)) {
		return false;
	}
	return (
		node.hasAttribute("hidden") || node.getAttribute("aria-hidden") === "true"
	);
}

/**
 *
 * @param {Node} node -
 * @param {string} attributeName -
 * @returns {Element[]} -
 */

function idRefs(node: Node, attributeName: string): (Element)[] {
	if (isElement(node) && node.hasAttribute(attributeName)) {
		const ids = node.getAttribute(attributeName)!.split(" ");

		return ids
			.map(id => node.ownerDocument!.getElementById(id))
			.filter(
				(element: Element | null): element is Element => element !== null
				// TODO: why does this not narrow?
			) as Element[];
	}

	return [];
}

/**
 *
 * @param {Node} node -
 * @returns {boolean} -
 */
function isEmbeddedControl(node: Node): boolean {
	return false;
}

function hasRole(node: Node, roles: string[]): node is Element {
	if (isElement(node) && node.hasAttribute("role")) {
		return node
			.getAttribute("role")!
			.split(" ")
			.some(role => roles.indexOf(role) !== -1);
	}
	return false;
}

function isMarkedPresentational(node: Node): node is Element {
	return hasRole(node, ["none", "presentation"]);
}

/**
 * TODO
 */
function isNativeHostLanguageTextAlternativeElement(
	node: Node
): node is Element {
	return false;
}

/**
 * TODO
 */
function allowsNameFromContent(node: Node): boolean {
	return hasRole(node, ["option"]);
}

/**
 * TODO
 */
function isDescendantOfNativeHostLanguageTextAlternativeElement(
	node: Node
): boolean {
	return false;
}

/**
 * TODO
 */
function computeTooltipAttributeValue(node: Node): string | null {
	return null;
}

export function computeAccessibleName(
	root: Element,
	context: { isReferenced?: boolean } = {}
): string {
	/**
	 * @type {Set<Node>}
	 */
	const visitedNodes = new Set();
	/**
	 * @type {FlatString}
	 */
	let totalAccumulatedText = "";

	if (prohibitsNaming(root) && !context.isReferenced) {
		return "" as FlatString;
	}

	// 2F.i
	function computeMiscTextAlternative(
		node: Node,
		context: { isReferenced?: boolean }
	): string {
		let accumulatedText = "";
		if (isElement(node)) {
			const pseudoBefore = safeWindow(node).getComputedStyle(node, ":before");
			const beforeContent = pseudoBefore.getPropertyValue("content");
			accumulatedText = prependResultWithoutSpace(
				accumulatedText,
				beforeContent
			);
		}

		for (const child of Array.from(node.childNodes)) {
			const result = computeTextAlternative(child, {
				isReferenced: context.isReferenced,
				recursion: true
			});
			accumulatedText += result;
		}

		if (isElement(node)) {
			const pseudoAfter = safeWindow(node).getComputedStyle(node, ":after");
			const afterContent = pseudoAfter.getPropertyValue("content");
			accumulatedText = appendResultWithoutSpace(accumulatedText, afterContent);
		}

		return accumulatedText;
	}

	/**
	 * TODO: placeholder
	 */
	function computeAttributeTextAlternative(node: Node): string | null {
		if (!isElement(node)) {
			return null;
		}

		const titleAttribute = node.getAttributeNode("title");
		if (titleAttribute !== null && !visitedNodes.has(titleAttribute)) {
			visitedNodes.add(titleAttribute);
			return titleAttribute.value;
		}

		return null;
	}

	function computeElementTextAlternative(node: Node): string | null {
		if (!isHTMLInputElement(node)) {
			return null;
		}

		const { labels } = node;
		// IE11 does not implement labels, TODO: verify with caniuse instead of mdn
		if (labels === null || labels === undefined) {
			return null;
		}

		// isMarkedPresentational
		return Array.from(labels)
			.map(element => {
				return computeTextAlternative(element, {
					isReferenced: true,
					recursion: true
				});
			})
			.filter(label => {
				return label.length > 0;
			})
			.join(" ");
	}

	function computeTextAlternative(
		current: Node,
		context: { isReferenced?: boolean; recursion?: boolean }
	): string {
		if (visitedNodes.has(current)) {
			return "";
		}
		visitedNodes.add(current);

		const { isReferenced = false, recursion = isReferenced } = context;
		// 2A
		if (isHidden(current) && !isReferenced) {
			return "" as FlatString;
		}

		// 2B
		const labelElements = idRefs(current, "aria-labelledby");
		if (!isReferenced && labelElements.length > 0) {
			return labelElements
				.map(element => computeTextAlternative(element, { isReferenced: true }))
				.join(" ");
		}

		// 2C
		const ariaLabel = (
			(isElement(current) && current.getAttribute("aria-label")) ||
			""
		).trim();
		if (ariaLabel !== "") {
			if (recursion && isEmbeddedControl(current)) {
				throw new Error("Not implemented");
			}
			return ariaLabel;
		}

		// 2D
		const attributeTextAlternative = computeAttributeTextAlternative(current);
		if (attributeTextAlternative !== null) {
			return attributeTextAlternative;
		}
		const elementTextAlternative = computeElementTextAlternative(current);
		if (elementTextAlternative !== null) {
			return elementTextAlternative;
		}

		// 2E
		if (isReferenced) {
			if (hasRole(current, ["combobox"])) {
				const chosenOption = current.querySelector('[aria-selected="true"]');
				if (chosenOption === null) {
					return "";
				}
				return computeTextAlternative(chosenOption, {
					isReferenced: true,
					recursion: true
				});
			}
		}

		// 2F
		if (
			allowsNameFromContent(current) ||
			(isElement(current) && isReferenced) ||
			isNativeHostLanguageTextAlternativeElement(current) ||
			isDescendantOfNativeHostLanguageTextAlternativeElement(current)
		) {
			return computeMiscTextAlternative(current, { isReferenced });
		}

		if (current.nodeType === current.TEXT_NODE) {
			return current.textContent || "";
		}

		if (recursion) {
			return computeMiscTextAlternative(current, { isReferenced });
		}

		const tooltipAttributeValue = computeTooltipAttributeValue(current);
		if (tooltipAttributeValue !== null) {
			return tooltipAttributeValue;
		}

		// TODO should this be reachable?
		return "";
	}

	return asFlatString(computeTextAlternative(root, {}));
}
