import getRole from "./getRole";

export function isElement(node: Node | null): node is Element {
	return node !== null && node.nodeType === node.ELEMENT_NODE;
}

export function isHTMLTableCaptionElement(
	node: Node | null
): node is HTMLTableCaptionElement {
	return isElement(node) && node.tagName === "CAPTION";
}

export function isHTMLInputElement(
	node: Node | null
): node is HTMLInputElement {
	return isElement(node) && node.tagName === "INPUT";
}

export function isHTMLSelectElement(
	node: Node | null
): node is HTMLSelectElement {
	return isElement(node) && node.tagName === "SELECT";
}

export function isHTMLTableElement(
	node: Node | null
): node is HTMLTableElement {
	return isElement(node) && node.tagName === "TABLE";
}

export function isHTMLTextAreaElement(
	node: Node | null
): node is HTMLTextAreaElement {
	return isElement(node) && node.tagName === "TEXTAREA";
}

export function safeWindow(node: Node): Window {
	const { defaultView } =
		node.ownerDocument === null ? (node as Document) : node.ownerDocument;

	if (defaultView === null) {
		throw new TypeError("no window available");
	}
	return defaultView;
}

export function isHTMLFieldSetElement(
	node: Node | null
): node is HTMLFieldSetElement {
	return isElement(node) && node.tagName === "FIELDSET";
}

export function isHTMLLegendElement(
	node: Node | null
): node is HTMLLegendElement {
	return isElement(node) && node.tagName === "LEGEND";
}

export function isHTMLSvgElement(node: Node | null): node is SVGElement {
	return isElement(node) && node.tagName === "svg";
}

export function isHTMLSvgTitleElement(
	node: Node | null
): node is SVGTitleElement {
	return isElement(node) && node.tagName === "title";
}

/**
 *
 * @param {Node} node -
 * @param {string} attributeName -
 * @returns {Element[]} -
 */
export function queryIdRefs(node: Node, attributeName: string): Element[] {
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

export function hasAnyConcreteRoles(
	node: Node,
	roles: Array<string | null>
): node is Element {
	if (isElement(node)) {
		return roles.indexOf(getRole(node)) !== -1;
	}
	return false;
}
