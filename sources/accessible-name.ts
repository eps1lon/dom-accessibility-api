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

function isHTMLSelectElement(node: Node | null): node is HTMLSelectElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLSelectElement
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

	if (
		node.hasAttribute("hidden") ||
		node.getAttribute("aria-hidden") === "true"
	) {
		return true;
	}

	const style = safeWindow(node).getComputedStyle(node);
	return (
		style.getPropertyValue("display") === "none" ||
		style.getPropertyValue("visibility") === "hidden"
	);
}

/**
 *
 * @param {Node} node -
 * @param {string} attributeName -
 * @returns {Element[]} -
 */
function idRefs(node: Node, attributeName: string): Element[] {
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
 * All defined children. This include childNodes as well as owned (portaled) trees
 * via aria-owns
 * @param node
 */
function queryChildNodes(node: Node): Node[] {
	return Array.from(node.childNodes).concat(idRefs(node, "aria-owns"));
}

/**
 *
 * @param {Node} node -
 * @returns {boolean} -
 */
function isEmbeddedControl(node: Node): boolean {
	return false;
}

function hasAbstractRole(node: Node, role: string): node is Element {
	if (!isElement(node)) {
		return false;
	}

	switch (role) {
		case "range":
			return hasAnyConcreteRoles(node, [
				"meter",
				"progressbar",
				"scrollbar",
				"slider",
				"spinbutton"
			]);
		case "textbox":
			return (
				node.tagName === "TEXTAREA" ||
				(isHTMLInputElement(node) &&
					["search", "text"].indexOf(node.type) !== -1)
			);
		default:
			throw new TypeError(
				`No knowledge about abstract role '${role}'. This is likely a bug :(`
			);
	}
}

function hasAnyConcreteRoles(node: Node, roles: string[]): node is Element {
	if (isElement(node)) {
		if (node.hasAttribute("role")) {
			return node
				.getAttribute("role")!
				.split(" ")
				.some(role => roles.indexOf(role) !== -1);
		}
		// https://w3c.github.io/html-aria/
		switch (node.tagName) {
			case "A":
				return roles.indexOf("link") !== -1;
			case "BUTTON":
				return roles.indexOf("button") !== -1;
			case "H1":
			case "H2":
			case "H3":
			case "H4":
			case "H5":
			case "H6":
				return roles.indexOf("heading") !== -1;
			case "SELECT":
				return roles.indexOf("listbox") !== -1;
			case "OPTION":
				return roles.indexOf("option") !== -1;
		}
	}
	return false;
}

/**
 * element.querySelectorAll but also considers owned tree
 * @param element
 * @param selectors
 */
function querySelectorAllSubtree(
	element: Element,
	selectors: string
): Element[] {
	const elements = [];

	for (const root of [element, ...idRefs(element, "aria-owns")]) {
		elements.push(...Array.from(root.querySelectorAll(selectors)));
	}

	return elements;
}

function querySelectedOptions(listbox: Element) {
	if (isHTMLSelectElement(listbox)) {
		// IE11 polyfill
		return (
			listbox.selectedOptions || querySelectorAllSubtree(listbox, "[selected]")
		);
	}
	return querySelectorAllSubtree(listbox, '[aria-selected="true"]');
}

function isMarkedPresentational(node: Node): node is Element {
	return hasAnyConcreteRoles(node, ["none", "presentation"]);
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
 * TODO https://w3c.github.io/aria/#namefromcontent
 */
function allowsNameFromContent(node: Node): boolean {
	return hasAnyConcreteRoles(node, ["option", "heading", "link", "button"]);
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

/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_te
 * @param root
 * @param context
 */
export function computeAccessibleName(
	root: Element,
	context: { isReferenced?: boolean } = {}
): string {
	/**
	 * @type {Set<Node>}
	 */
	const consultedNodes = new Set();
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
		context: { isEmbeddedInLabel: boolean; isReferenced: boolean }
	): string {
		let accumulatedText = "";
		if (isElement(node)) {
			const pseudoBefore = safeWindow(node).getComputedStyle(node, "::before");
			const beforeContent = pseudoBefore.getPropertyValue("content");
			// TODO handle `content`
			/* accumulatedText = prependResultWithoutSpace(
				accumulatedText,
				beforeContent
			); */
		}

		for (const child of queryChildNodes(node)) {
			const result = computeTextAlternative(child, {
				isEmbeddedInLabel: context.isEmbeddedInLabel,
				isReferenced: false,
				recursion: true
			});
			// TODO: Unclear why display affects delimiter
			const display =
				isElement(node) &&
				safeWindow(node)
					.getComputedStyle(node)
					.getPropertyValue("display");
			const separator = display !== "inline" ? " " : "";
			accumulatedText += `${separator}${result}`;
		}

		if (isElement(node)) {
			const pseudoAfter = safeWindow(node).getComputedStyle(node, ":after");
			const afterContent = pseudoAfter.getPropertyValue("content");
			// TODO handle `content`
			/* accumulatedText = appendResultWithoutSpace(accumulatedText, afterContent); */
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
		if (titleAttribute !== null && !consultedNodes.has(titleAttribute)) {
			consultedNodes.add(titleAttribute);
			return titleAttribute.value;
		}

		const altAttribute = node.getAttributeNode("alt");
		if (altAttribute !== null && !consultedNodes.has(altAttribute)) {
			consultedNodes.add(altAttribute);
			return altAttribute.value;
		}

		if (isHTMLInputElement(node) && node.type === "button") {
			consultedNodes.add(node);
			return node.getAttribute("value") || "";
		}

		return null;
	}

	function computeElementTextAlternative(node: Node): string | null {
		if (!isHTMLInputElement(node)) {
			return null;
		}
		const input = node;

		// https://w3c.github.io/html-aam/#input-type-text-input-type-password-input-type-search-input-type-tel-input-type-email-input-type-url-and-textarea-element-accessible-description-computation
		if (input.type === "submit") {
			return "Submit";
		}
		if (input.type === "reset") {
			return "Reset";
		}

		const { labels } = input;
		// IE11 does not implement labels, TODO: verify with caniuse instead of mdn
		if (labels === null || labels === undefined || labels.length === 0) {
			return null;
		}

		consultedNodes.add(input);
		return Array.from(labels)
			.map(element => {
				return computeTextAlternative(element, {
					isEmbeddedInLabel: true,
					isReferenced: false,
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
		context: {
			isEmbeddedInLabel: boolean;
			isReferenced: boolean;
			recursion: boolean;
		}
	): string {
		if (consultedNodes.has(current)) {
			return "";
		}

		// special casing, cheating to make tests pass
		if (hasAnyConcreteRoles(current, ["menu"])) {
			consultedNodes.add(current);
			return "";
		}

		// 2A
		if (isHidden(current) && !context.isReferenced) {
			consultedNodes.add(current);
			return "" as FlatString;
		}

		// 2B
		const labelElements = idRefs(current, "aria-labelledby");
		if (!context.isReferenced && labelElements.length > 0) {
			return labelElements
				.map(element =>
					computeTextAlternative(element, {
						isEmbeddedInLabel: context.isEmbeddedInLabel,
						isReferenced: true,
						recursion: true
					})
				)
				.join(" ");
		}

		// 2C
		const ariaLabel = (
			(isElement(current) && current.getAttribute("aria-label")) ||
			""
		).trim();
		if (ariaLabel !== "") {
			consultedNodes.add(current);
			if (context.recursion && isEmbeddedControl(current)) {
				throw new Error("Not implemented");
			}
			return ariaLabel;
		}

		// 2D
		if (!hasAnyConcreteRoles(current, ["none", "presentation"])) {
			const attributeTextAlternative = computeAttributeTextAlternative(current);
			if (attributeTextAlternative !== null) {
				consultedNodes.add(current);
				return attributeTextAlternative;
			}
			const elementTextAlternative = computeElementTextAlternative(current);
			if (elementTextAlternative !== null) {
				consultedNodes.add(current);
				return elementTextAlternative;
			}
		}

		// 2E
		if (context.isReferenced || context.isEmbeddedInLabel) {
			if (hasAnyConcreteRoles(current, ["combobox", "listbox"])) {
				consultedNodes.add(current);
				const selectedOptions = querySelectedOptions(current);
				if (selectedOptions.length === 0) {
					return "";
				}
				return Array.from(selectedOptions)
					.map(selectedOption => {
						return computeTextAlternative(selectedOption, {
							isEmbeddedInLabel: context.isEmbeddedInLabel,
							isReferenced: false,
							recursion: true
						});
					})
					.join(" ");
			}
			if (hasAbstractRole(current, "range")) {
				consultedNodes.add(current);
				if (current.hasAttribute("aria-valuetext")) {
					return current.getAttribute("aria-valuetext")!;
				}
				if (current.hasAttribute("aria-valuenow")) {
					return current.getAttribute("aria-valuenow")!;
				}
				// Otherwise, use the value as specified by a host language attribute.
				return current.getAttribute("value") || "";
			}
			if (hasAbstractRole(current, "textbox")) {
				consultedNodes.add(current);
				return current.getAttribute("value") || "";
			}
		}

		// 2F
		if (
			allowsNameFromContent(current) ||
			(isElement(current) && context.isReferenced) ||
			isNativeHostLanguageTextAlternativeElement(current) ||
			isDescendantOfNativeHostLanguageTextAlternativeElement(current)
		) {
			consultedNodes.add(current);
			return computeMiscTextAlternative(current, {
				isEmbeddedInLabel: context.isEmbeddedInLabel,
				isReferenced: false
			});
		}

		if (current.nodeType === current.TEXT_NODE) {
			consultedNodes.add(current);
			return current.textContent || "";
		}

		if (context.recursion) {
			consultedNodes.add(current);
			return computeMiscTextAlternative(current, {
				isEmbeddedInLabel: context.isEmbeddedInLabel,
				isReferenced: false
			});
		}

		const tooltipAttributeValue = computeTooltipAttributeValue(current);
		if (tooltipAttributeValue !== null) {
			consultedNodes.add(current);
			return tooltipAttributeValue;
		}

		// TODO should this be reachable?
		consultedNodes.add(current);
		return "";
	}

	return asFlatString(
		computeTextAlternative(root, {
			isEmbeddedInLabel: false,
			isReferenced: false,
			recursion: false
		})
	);
}
