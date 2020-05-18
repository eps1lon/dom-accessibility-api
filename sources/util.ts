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
