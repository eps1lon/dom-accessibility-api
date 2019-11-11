export function isElement(node: Node | null): node is Element {
	return (
		// @ts-ignore
		node !== null && node instanceof node.ownerDocument.defaultView.Element
	);
}

export function isHTMLInputElement(
	node: Node | null
): node is HTMLInputElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLInputElement
	);
}

export function isHTMLSelectElement(
	node: Node | null
): node is HTMLSelectElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLSelectElement
	);
}

export function isHTMLTextAreaElement(
	node: Node | null
): node is HTMLTextAreaElement {
	return (
		isElement(node) &&
		// @ts-ignore
		node instanceof node.ownerDocument.defaultView.HTMLTextAreaElement
	);
}

export function safeWindow(node: Node): Window {
	const { defaultView } =
		node.ownerDocument === null ? (node as Document) : node.ownerDocument;

	if (defaultView === null) {
		throw new TypeError("no window available");
	}
	return defaultView;
}
