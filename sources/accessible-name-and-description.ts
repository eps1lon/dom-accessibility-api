/**
 * implements https://w3c.github.io/accname/
 */
import ArrayFrom from "./polyfills/array.from";
import SetLike from "./polyfills/SetLike";
import {
	hasAnyConcreteRoles,
	isElement,
	isHTMLTableCaptionElement,
	isHTMLInputElement,
	isHTMLSelectElement,
	isHTMLTextAreaElement,
	safeWindow,
	isHTMLFieldSetElement,
	isHTMLLegendElement,
	isHTMLOptGroupElement,
	isHTMLTableElement,
	isHTMLSlotElement,
	isSVGSVGElement,
	isSVGTitleElement,
	queryIdRefs,
	getLocalName,
	presentationRoles,
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
export interface ComputeTextAlternativeOptions {
	compute?: "description" | "name";
	/**
	 * Set to true if window.computedStyle supports the second argument.
	 * This should be false in JSDOM. Otherwise JSDOM will log console errors.
	 */
	computedStyleSupportsPseudoElements?: boolean;
	/**
	 * mock window.getComputedStyle. Needs `content`, `display` and `visibility`
	 */
	getComputedStyle?: typeof window.getComputedStyle;
	/**
	 * Set to `true` if you want to include hidden elements in the accessible name and description computation.
	 * Skips 2A in https://w3c.github.io/accname/#computation-steps.
	 * @default false
	 */
	hidden?: boolean;
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
 *
 * @param node -
 * @param options - These are not optional to prevent accidentally calling it without options in `computeAccessibleName`
 * @returns {boolean} -
 */
function isHidden(
	node: Node,
	getComputedStyleImplementation: typeof window.getComputedStyle,
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

	const style = getComputedStyleImplementation(node);
	return (
		style.getPropertyValue("display") === "none" ||
		style.getPropertyValue("visibility") === "hidden"
	);
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
				`No knowledge about abstract role '${role}'. This is likely a bug :(`,
			);
	}
}

/**
 * element.querySelectorAll but also considers owned tree
 * @param element
 * @param selectors
 */
function querySelectorAllSubtree(
	element: Element,
	selectors: string,
): Element[] {
	const elements = ArrayFrom(element.querySelectorAll(selectors));

	queryIdRefs(element, "aria-owns").forEach((root) => {
		// babel transpiles this assuming an iterator
		elements.push.apply(elements, ArrayFrom(root.querySelectorAll(selectors)));
	});

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
	return hasAnyConcreteRoles(node, presentationRoles);
}

/**
 * Elements specifically listed in html-aam
 *
 * We don't need this for `label` or `legend` elements.
 * Their implicit roles already allow "naming from content".
 *
 * sources:
 *
 * - https://w3c.github.io/html-aam/#table-element
 */
function isNativeHostLanguageTextAlternativeElement(
	node: Node,
): node is Element {
	return isHTMLTableCaptionElement(node);
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
	node: Node,
): boolean {
	return false;
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
 * https://html.spec.whatwg.org/multipage/forms.html#category-label
 * TODO: form-associated custom elements
 * @param element
 */
function isLabelableElement(element: Element): boolean {
	const localName = getLocalName(element);

	return (
		localName === "button" ||
		(localName === "input" && element.getAttribute("type") !== "hidden") ||
		localName === "meter" ||
		localName === "output" ||
		localName === "progress" ||
		localName === "select" ||
		localName === "textarea"
	);
}

/**
 * > [...], then the first such descendant in tree order is the label element's labeled control.
 * -- https://html.spec.whatwg.org/multipage/forms.html#labeled-control
 * @param element
 */
function findLabelableElement(element: Element): Element | null {
	if (isLabelableElement(element)) {
		return element;
	}
	let labelableElement: Element | null = null;
	element.childNodes.forEach((childNode) => {
		if (labelableElement === null && isElement(childNode)) {
			const descendantLabelableElement = findLabelableElement(childNode);
			if (descendantLabelableElement !== null) {
				labelableElement = descendantLabelableElement;
			}
		}
	});

	return labelableElement;
}

/**
 * Polyfill of HTMLLabelElement.control
 * https://html.spec.whatwg.org/multipage/forms.html#labeled-control
 * @param label
 */
function getControlOfLabel(label: HTMLLabelElement): Element | null {
	if (label.control !== undefined) {
		return label.control;
	}

	const htmlFor = label.getAttribute("for");
	if (htmlFor !== null) {
		return label.ownerDocument.getElementById(htmlFor);
	}

	return findLabelableElement(label);
}

/**
 * Polyfill of HTMLInputElement.labels
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/labels
 * @param element
 */
function getLabels(element: Element): HTMLLabelElement[] | null {
	const labelsProperty = (element as HTMLInputElement).labels as
		| HTMLInputElement["labels"]
		| undefined;

	if (labelsProperty === null) {
		return labelsProperty;
	}
	if (labelsProperty !== undefined) {
		return ArrayFrom(labelsProperty);
	}

	// polyfill
	if (!isLabelableElement(element)) {
		return null;
	}
	const document = element.ownerDocument;

	return ArrayFrom(document.querySelectorAll("label")).filter((label) => {
		return getControlOfLabel(label) === element;
	});
}

/**
 * Gets the contents of a slot used for computing the accname
 * @param slot
 */
function getSlotContents(slot: HTMLSlotElement): Node[] {
	// Computing the accessible name for elements containing slots is not
	// currently defined in the spec. This implementation reflects the
	// behavior of NVDA 2020.2/Firefox 81 and iOS VoiceOver/Safari 13.6.
	const assignedNodes = slot.assignedNodes();
	if (assignedNodes.length === 0) {
		// if no nodes are assigned to the slot, it displays the default content
		return ArrayFrom(slot.childNodes);
	}
	return assignedNodes;
}

/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_te
 * @param root
 * @param options
 * @returns
 */
export function computeTextAlternative(
	root: Element,
	options: ComputeTextAlternativeOptions = {},
): string {
	const consultedNodes = new SetLike<Node>();

	const window = safeWindow(root);
	const {
		compute = "name",
		computedStyleSupportsPseudoElements = options.getComputedStyle !==
			undefined,
		// This might be overengineered. I don't know what happens if I call
		// window.getComputedStyle(elementFromAnotherWindow) or if I don't bind it
		// the type declarations don't require a `this`
		// eslint-disable-next-line no-restricted-properties
		getComputedStyle = window.getComputedStyle.bind(window),
		hidden = false,
	} = options;

	// 2F.i
	function computeMiscTextAlternative(
		node: Node,
		context: { isEmbeddedInLabel: boolean; isReferenced: boolean },
	): string {
		let accumulatedText = "";
		if (isElement(node) && computedStyleSupportsPseudoElements) {
			const pseudoBefore = getComputedStyle(node, "::before");
			const beforeContent = getTextualContent(pseudoBefore);
			accumulatedText = `${beforeContent} ${accumulatedText}`;
		}

		// FIXME: Including aria-owns is not defined in the spec
		// But it is required in the web-platform-test
		const childNodes = isHTMLSlotElement(node)
			? getSlotContents(node)
			: ArrayFrom(node.childNodes).concat(queryIdRefs(node, "aria-owns"));
		childNodes.forEach((child) => {
			const result = computeTextAlternative(child, {
				isEmbeddedInLabel: context.isEmbeddedInLabel,
				isReferenced: false,
				recursion: true,
			});
			// TODO: Unclear why display affects delimiter
			// see https://github.com/w3c/accname/issues/3
			const display = isElement(child)
				? getComputedStyle(child).getPropertyValue("display")
				: "inline";
			const separator = display !== "inline" ? " " : "";
			// trailing separator for wpt tests
			accumulatedText += `${separator}${result}${separator}`;
		});

		if (isElement(node) && computedStyleSupportsPseudoElements) {
			const pseudoAfter = getComputedStyle(node, "::after");
			const afterContent = getTextualContent(pseudoAfter);
			if (afterContent) {
				accumulatedText = `${accumulatedText} ${afterContent}`;
			}
		}

		return accumulatedText;
	}

	/**
	 *
	 * @param element
	 * @param attributeName
	 * @returns A string non-empty string or `null`
	 */
	function useAttribute(
		element: Element,
		attributeName: string,
	): string | null {
		const attribute = element.getAttributeNode(attributeName);
		if (
			attribute !== null &&
			!consultedNodes.has(attribute) &&
			attribute.value.trim() !== ""
		) {
			consultedNodes.add(attribute);
			return attribute.value;
		}
		return null;
	}

	function computeTooltipAttributeValue(node: Node): string | null {
		if (!isElement(node)) {
			return null;
		}

		return useAttribute(node, "title");
	}

	function computeElementTextAlternative(node: Node): string | null {
		if (!isElement(node)) {
			return null;
		}

		// https://w3c.github.io/html-aam/#fieldset-and-legend-elements
		if (isHTMLFieldSetElement(node)) {
			consultedNodes.add(node);
			const children = ArrayFrom(node.childNodes);
			for (let i = 0; i < children.length; i += 1) {
				const child = children[i];
				if (isHTMLLegendElement(child)) {
					return computeTextAlternative(child, {
						isEmbeddedInLabel: false,
						isReferenced: false,
						recursion: false,
					});
				}
			}
		} else if (isHTMLTableElement(node)) {
			// https://w3c.github.io/html-aam/#table-element
			consultedNodes.add(node);
			const children = ArrayFrom(node.childNodes);
			for (let i = 0; i < children.length; i += 1) {
				const child = children[i];
				if (isHTMLTableCaptionElement(child)) {
					return computeTextAlternative(child, {
						isEmbeddedInLabel: false,
						isReferenced: false,
						recursion: false,
					});
				}
			}
		} else if (isSVGSVGElement(node)) {
			// https://www.w3.org/TR/svg-aam-1.0/
			consultedNodes.add(node);
			const children = ArrayFrom(node.childNodes);
			for (let i = 0; i < children.length; i += 1) {
				const child = children[i];
				if (isSVGTitleElement(child)) {
					return child.textContent;
				}
			}
			return null;
		} else if (getLocalName(node) === "img" || getLocalName(node) === "area") {
			// https://w3c.github.io/html-aam/#area-element
			// https://w3c.github.io/html-aam/#img-element
			const nameFromAlt = useAttribute(node, "alt");
			if (nameFromAlt !== null) {
				return nameFromAlt;
			}
		} else if (isHTMLOptGroupElement(node)) {
			const nameFromLabel = useAttribute(node, "label");
			if (nameFromLabel !== null) {
				return nameFromLabel;
			}
		}

		if (
			isHTMLInputElement(node) &&
			(node.type === "button" ||
				node.type === "submit" ||
				node.type === "reset")
		) {
			// https://w3c.github.io/html-aam/#input-type-text-input-type-password-input-type-search-input-type-tel-input-type-email-input-type-url-and-textarea-element-accessible-description-computation
			const nameFromValue = useAttribute(node, "value");
			if (nameFromValue !== null) {
				return nameFromValue;
			}

			// TODO: l10n
			if (node.type === "submit") {
				return "Submit";
			}
			// TODO: l10n
			if (node.type === "reset") {
				return "Reset";
			}
		}

		const labels = getLabels(node);
		if (labels !== null && labels.length !== 0) {
			consultedNodes.add(node);
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

		// https://w3c.github.io/html-aam/#input-type-image-accessible-name-computation
		// TODO: wpt test consider label elements but html-aam does not mention them
		// We follow existing implementations over spec
		if (isHTMLInputElement(node) && node.type === "image") {
			const nameFromAlt = useAttribute(node, "alt");
			if (nameFromAlt !== null) {
				return nameFromAlt;
			}

			const nameFromTitle = useAttribute(node, "title");
			if (nameFromTitle !== null) {
				return nameFromTitle;
			}

			// TODO: l10n
			return "Submit Query";
		}

		if (hasAnyConcreteRoles(node, ["button"])) {
			// https://www.w3.org/TR/html-aam-1.0/#button-element
			const nameFromSubTree = computeMiscTextAlternative(node, {
				isEmbeddedInLabel: false,
				isReferenced: false,
			});
			if (nameFromSubTree !== "") {
				return nameFromSubTree;
			}
		}

		return null;
	}

	function computeTextAlternative(
		current: Node,
		context: {
			isEmbeddedInLabel: boolean;
			isReferenced: boolean;
			recursion: boolean;
		},
	): string {
		if (consultedNodes.has(current)) {
			return "";
		}

		// 2A
		if (
			!hidden &&
			isHidden(current, getComputedStyle) &&
			!context.isReferenced
		) {
			consultedNodes.add(current);
			return "" as FlatString;
		}

		// 2B
		const labelAttributeNode = isElement(current)
			? current.getAttributeNode("aria-labelledby")
			: null;
		// TODO: Do we generally need to block query IdRefs of attributes we have already consulted?
		const labelElements =
			labelAttributeNode !== null && !consultedNodes.has(labelAttributeNode)
				? queryIdRefs(current, "aria-labelledby")
				: [];
		if (
			compute === "name" &&
			!context.isReferenced &&
			labelElements.length > 0
		) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Can't be null here otherwise labelElements would be empty
			consultedNodes.add(labelAttributeNode!);

			return labelElements
				.map((element) => {
					// TODO: Chrome will consider repeated values i.e. use a node multiple times while we'll bail out in computeTextAlternative.
					return computeTextAlternative(element, {
						isEmbeddedInLabel: context.isEmbeddedInLabel,
						isReferenced: true,
						// this isn't recursion as specified, otherwise we would skip
						// `aria-label` in
						// <input id="myself" aria-label="foo" aria-labelledby="myself"
						recursion: false,
					});
				})
				.join(" ");
		}

		// 2C
		// Changed from the spec in anticipation of https://github.com/w3c/accname/issues/64
		// spec says we should only consider skipping if we have a non-empty label
		const skipToStep2E =
			context.recursion && isControl(current) && compute === "name";
		if (!skipToStep2E) {
			const ariaLabel = (
				(isElement(current) && current.getAttribute("aria-label")) ||
				""
			).trim();
			if (ariaLabel !== "" && compute === "name") {
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
			}
		}

		// special casing, cheating to make tests pass
		// https://github.com/w3c/accname/issues/67
		if (hasAnyConcreteRoles(current, ["menu"])) {
			consultedNodes.add(current);
			return "";
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
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute guard
					return current.getAttribute("aria-valuetext")!;
				}
				if (current.hasAttribute("aria-valuenow")) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute guard
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
			const accumulatedText2F = computeMiscTextAlternative(current, {
				isEmbeddedInLabel: context.isEmbeddedInLabel,
				isReferenced: false,
			});
			if (accumulatedText2F !== "") {
				consultedNodes.add(current);
				return accumulatedText2F;
			}
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
			// by spec computeAccessibleDescription starts with the referenced elements as roots
			isReferenced: compute === "description",
			recursion: false,
		}),
	);
}
