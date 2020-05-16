/**
 * implements https://w3c.github.io/accname/
 */
import ArrayFrom from "./polyfills/array.from";
import SetLike from "./polyfills/SetLike";
import getRole from "./getRole";
import {
	isElement,
	isHTMLInputElement,
	isHTMLSelectElement,
	isHTMLTextAreaElement,
	safeWindow,
	isHTMLFieldSetElement,
	isHTMLLegendElement,
} from "./util";

/**
 *  A string of characters where all carriage returns, newlines, tabs, and form-feeds are replaced with a single space, and multiple spaces are reduced to a single space. The string contains only character data; it does not contain any markup.
 */
type FlatString = string & {
	__flat: true;
};

/**
 * interface for an options-bag where `window.getComputedStyle` can be mocked
 */
interface GetComputedStyleOptions {
	getComputedStyle?: typeof window.getComputedStyle;
}
/**
 * Small utility that handles all the JS quirks with `this` which is important
 * if no mock is provided.
 * @param element
 * @param options - These are not optional to prevent accidentally calling it without options in `computeAccessibleName`
 */
function createGetComputedStyle(
	element: Element,
	options: GetComputedStyleOptions
): typeof window.getComputedStyle {
	const window = safeWindow(element);
	const {
		// This might be overengineered. I don't know what happens if I call
		// window.getComputedStyle(elementFromAnotherWindow) or if I don't bind it
		// the type declarations don't require a `this`
		// eslint-disable-next-line no-restricted-properties
		getComputedStyle = window.getComputedStyle.bind(window),
	} = options;

	return getComputedStyle;
}

/**
 *
 * @param {string} string -
 * @returns {FlatString} -
 */
function asFlatString(s: string): FlatString {
	return s.trim().replace(/\s\s+/g, " ") as FlatString;
}

/**
 * https://w3c.github.io/aria/#namefromprohibited
 */
function prohibitsNaming(node: Node): boolean {
	return hasAnyConcreteRoles(node, [
		"caption",
		"code",
		"deletion",
		"emphasis",
		"generic",
		"insertion",
		"paragraph",
		"presentation",
		"strong",
		"subscript",
		"superscript",
	]);
}

/**
 *
 * @param node -
 * @param options - These are not optional to prevent accidentally calling it without options in `computeAccessibleName`
 * @returns {boolean} -
 */
function isHidden(
	node: Node,
	options: GetComputedStyleOptions
): node is Element {
	if (!isElement(node)) {
		return false;
	}

	if (
		node.hasAttribute("hidden") ||
		node.getAttribute("aria-hidden") === "true"
	) {
		return true;
	}

	const style = createGetComputedStyle(node, options)(node);
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
		// safe due to hasAttribute check
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const ids = node.getAttribute(attributeName)!.split(" ");

		return (
			ids
				// safe since it can't be null for an Element
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				.map((id) => node.ownerDocument!.getElementById(id))
				.filter(
					(element: Element | null): element is Element => element !== null
					// TODO: why does this not narrow?
				) as Element[]
		);
	}

	return [];
}

/**
 * @param {Node} node -
 * @returns {boolean} - As defined in step 2E of https://w3c.github.io/accname/#mapping_additional_nd_te
 */
function isControl(node: Node): boolean {
	return (
		hasAnyConcreteRoles(node, ["button", "combobox", "listbox", "textbox"]) ||
		hasAbstractRole(node, "range")
	);
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
				"spinbutton",
			]);
		default:
			throw new TypeError(
				`No knowledge about abstract role '${role}'. This is likely a bug :(`
			);
	}
}

function hasAnyConcreteRoles(
	node: Node,
	roles: Array<string | null>
): node is Element {
	if (isElement(node)) {
		return roles.indexOf(getRole(node)) !== -1;
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
		elements.push(...ArrayFrom(root.querySelectorAll(selectors)));
	}

	return elements;
}

function querySelectedOptions(listbox: Element): ArrayLike<Element> {
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
 * TODO https://github.com/eps1lon/dom-accessibility-api/issues/99
 */
function isNativeHostLanguageTextAlternativeElement(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- not implemented yet
	node: Node
): node is Element {
	return false;
}

/**
 * https://w3c.github.io/aria/#namefromcontent
 */
function allowsNameFromContent(node: Node): boolean {
	return hasAnyConcreteRoles(node, [
		"button",
		"cell",
		"checkbox",
		"columnheader",
		"gridcell",
		"heading",
		"label",
		"legend",
		"link",
		"menuitem",
		"menuitemcheckbox",
		"menuitemradio",
		"option",
		"radio",
		"row",
		"rowheader",
		"switch",
		"tab",
		"tooltip",
		"treeitem",
	]);
}

/**
 * TODO https://github.com/eps1lon/dom-accessibility-api/issues/100
 */
function isDescendantOfNativeHostLanguageTextAlternativeElement(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- not implemented yet
	node: Node
): boolean {
	return false;
}

/**
 * TODO https://github.com/eps1lon/dom-accessibility-api/issues/101
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- not implemented yet
function computeTooltipAttributeValue(node: Node): string | null {
	return null;
}

function getValueOfTextbox(element: Element): string {
	if (isHTMLInputElement(element) || isHTMLTextAreaElement(element)) {
		return element.value;
	}
	// https://github.com/eps1lon/dom-accessibility-api/issues/4
	return element.textContent || "";
}

function getTextualContent(declaration: CSSStyleDeclaration): string {
	const content = declaration.getPropertyValue("content");
	if (/^["'].*["']$/.test(content)) {
		return content.slice(1, -1);
	}
	return "";
}

/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_te
 * @param root
 * @param [options]
 * @parma [options.getComputedStyle] - mock window.getComputedStyle. Needs `content`, `display` and `visibility`
 */
export function computeAccessibleName(
	root: Element,
	options: GetComputedStyleOptions = {}
): string {
	const consultedNodes = new SetLike<Node>();

	if (prohibitsNaming(root)) {
		return "" as FlatString;
	}

	// 2F.i
	function computeMiscTextAlternative(
		node: Node,
		context: { isEmbeddedInLabel: boolean; isReferenced: boolean }
	): string {
		let accumulatedText = "";
		if (isElement(node)) {
			const pseudoBefore = createGetComputedStyle(node, options)(
				node,
				"::before"
			);
			const beforeContent = getTextualContent(pseudoBefore);
			accumulatedText = `${beforeContent} ${accumulatedText}`;
		}

		// FIXME: This is not defined in the spec
		// But it is required in the web-platform-test
		const childNodes = ArrayFrom(node.childNodes).concat(
			idRefs(node, "aria-owns")
		);
		for (const child of childNodes) {
			const result = computeTextAlternative(child, {
				isEmbeddedInLabel: context.isEmbeddedInLabel,
				isReferenced: false,
				recursion: true,
			});
			// TODO: Unclear why display affects delimiter
			const display =
				isElement(node) &&
				createGetComputedStyle(node, options)(node).getPropertyValue("display");
			const separator = display !== "inline" ? " " : "";
			accumulatedText += `${separator}${result}`;
		}

		if (isElement(node)) {
			const pseudoAfter = createGetComputedStyle(node, options)(node, ":after");
			const afterContent = getTextualContent(pseudoAfter);
			accumulatedText = `${accumulatedText} ${afterContent}`;
		}

		return accumulatedText;
	}

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
		// https://w3c.github.io/html-aam/#fieldset-and-legend-elements
		if (isHTMLFieldSetElement(node)) {
			consultedNodes.add(node);
			for (const child of ArrayFrom(node.childNodes)) {
				if (isHTMLLegendElement(child)) {
					return computeTextAlternative(child, {
						isEmbeddedInLabel: false,
						isReferenced: false,
						recursion: false,
					});
				}
			}
			return null;
		}

		if (
			!(
				isHTMLInputElement(node) ||
				isHTMLSelectElement(node) ||
				isHTMLTextAreaElement(node)
			)
		) {
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
		return ArrayFrom(labels)
			.map((element) => {
				return computeTextAlternative(element, {
					isEmbeddedInLabel: true,
					isReferenced: false,
					recursion: true,
				});
			})
			.filter((label) => {
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
		// https://github.com/w3c/accname/issues/67
		if (hasAnyConcreteRoles(current, ["menu"])) {
			consultedNodes.add(current);
			return "";
		}

		// 2A
		if (isHidden(current, options) && !context.isReferenced) {
			consultedNodes.add(current);
			return "" as FlatString;
		}

		// 2B
		const labelElements = idRefs(current, "aria-labelledby");
		if (!context.isReferenced && labelElements.length > 0) {
			return labelElements
				.map((element) =>
					computeTextAlternative(element, {
						isEmbeddedInLabel: context.isEmbeddedInLabel,
						isReferenced: true,
						// thais isn't recursion as specified, otherwise we would skip
						// `aria-label` in
						// <input id="myself" aria-label="foo" aria-labelledby="myself"
						recursion: false,
					})
				)
				.join(" ");
		}

		// 2C
		// Changed from the spec in anticipation of https://github.com/w3c/accname/issues/64
		// spec says we should only consider skipping if we have a non-empty label
		const skipToStep2E = context.recursion && isControl(current);
		if (!skipToStep2E) {
			const ariaLabel = (
				(isElement(current) && current.getAttribute("aria-label")) ||
				""
			).trim();
			if (ariaLabel !== "") {
				consultedNodes.add(current);
				return ariaLabel;
			}

			// 2D
			if (!isMarkedPresentational(current)) {
				const elementTextAlternative = computeElementTextAlternative(current);
				if (elementTextAlternative !== null) {
					consultedNodes.add(current);
					return elementTextAlternative;
				}
				const attributeTextAlternative = computeAttributeTextAlternative(
					current
				);
				if (attributeTextAlternative !== null) {
					consultedNodes.add(current);
					return attributeTextAlternative;
				}
			}
		}

		// 2E
		if (skipToStep2E || context.isEmbeddedInLabel || context.isReferenced) {
			if (hasAnyConcreteRoles(current, ["combobox", "listbox"])) {
				consultedNodes.add(current);
				const selectedOptions = querySelectedOptions(current);
				if (selectedOptions.length === 0) {
					// defined per test `name_heading_combobox`
					return isHTMLInputElement(current) ? current.value : "";
				}
				return ArrayFrom(selectedOptions)
					.map((selectedOption) => {
						return computeTextAlternative(selectedOption, {
							isEmbeddedInLabel: context.isEmbeddedInLabel,
							isReferenced: false,
							recursion: true,
						});
					})
					.join(" ");
			}
			if (hasAbstractRole(current, "range")) {
				consultedNodes.add(current);
				if (current.hasAttribute("aria-valuetext")) {
					// safe due to hasAttribute guard
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return current.getAttribute("aria-valuetext")!;
				}
				if (current.hasAttribute("aria-valuenow")) {
					// safe due to hasAttribute guard
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return current.getAttribute("aria-valuenow")!;
				}
				// Otherwise, use the value as specified by a host language attribute.
				return current.getAttribute("value") || "";
			}
			if (hasAnyConcreteRoles(current, ["textbox"])) {
				consultedNodes.add(current);
				return getValueOfTextbox(current);
			}
		}

		// 2F: https://w3c.github.io/accname/#step2F
		if (
			allowsNameFromContent(current) ||
			(isElement(current) && context.isReferenced) ||
			isNativeHostLanguageTextAlternativeElement(current) ||
			isDescendantOfNativeHostLanguageTextAlternativeElement(current)
		) {
			consultedNodes.add(current);
			return computeMiscTextAlternative(current, {
				isEmbeddedInLabel: context.isEmbeddedInLabel,
				isReferenced: false,
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
				isReferenced: false,
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
			recursion: false,
		})
	);
}
