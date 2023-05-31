export { getLocalName } from "./getRole";
import getRole, { getLocalName } from "./getRole";

export const presentationRoles = ["presentation", "none"];

export function isElement(node: Node | null): node is Element {
	return node !== null && node.nodeType === node.ELEMENT_NODE;
}

export function isHTMLTableCaptionElement(
	node: Node | null
): node is HTMLTableCaptionElement {
	return isElement(node) && getLocalName(node) === "caption";
}

export function isHTMLInputElement(
	node: Node | null
): node is HTMLInputElement {
	return isElement(node) && getLocalName(node) === "input";
}

export function isHTMLOptGroupElement(
	node: Node | null
): node is HTMLOptGroupElement {
	return isElement(node) && getLocalName(node) === "optgroup";
}

export function isHTMLSelectElement(
	node: Node | null
): node is HTMLSelectElement {
	return isElement(node) && getLocalName(node) === "select";
}

export function isHTMLTableElement(
	node: Node | null
): node is HTMLTableElement {
	return isElement(node) && getLocalName(node) === "table";
}

export function isHTMLTextAreaElement(
	node: Node | null
): node is HTMLTextAreaElement {
	return isElement(node) && getLocalName(node) === "textarea";
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
	return isElement(node) && getLocalName(node) === "fieldset";
}

export function isHTMLLabelElement(
	node: Node | null
): node is HTMLLabelElement {
	return isElement(node) && getLocalName(node) === "label";
}

export function isHTMLLegendElement(
	node: Node | null
): node is HTMLLegendElement {
	return isElement(node) && getLocalName(node) === "legend";
}

export function isHTMLSlotElement(node: Node | null): node is HTMLSlotElement {
	return isElement(node) && getLocalName(node) === "slot";
}

export function isSVGElement(node: Node | null): node is SVGElement {
	return isElement(node) && (node as SVGElement).ownerSVGElement !== undefined;
}

export function isSVGSVGElement(node: Node | null): node is SVGSVGElement {
	return isElement(node) && getLocalName(node) === "svg";
}

export function isSVGTitleElement(node: Node | null): node is SVGTitleElement {
	return isSVGElement(node) && getLocalName(node) === "title";
}

/**
 *
 * @param {Node} node -
 * @param {string} attributeName -
 * @returns {Element[]} -
 */
export function queryIdRefs(node: Node, attributeName: string): Element[] {
	if (isElement(node) && node.hasAttribute(attributeName)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute check
		const ids = node.getAttribute(attributeName)!.split(" ");

		// Browsers that don't support shadow DOM won't have getRootNode
		const root = node.getRootNode
			? (node.getRootNode() as Document | ShadowRoot)
			: node.ownerDocument;

		return ids
			.map((id) => root.getElementById(id))
			.filter(
				(element: Element | null): element is Element => element !== null
				// TODO: why does this not narrow?
			) as Element[];
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
