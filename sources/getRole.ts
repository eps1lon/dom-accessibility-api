// https://w3c.github.io/html-aria/#document-conformance-requirements-for-use-of-aria-attributes-in-html

import { getLocalName } from "./util";

export default function getRole(element: Element): string | null {
	const explicitRole = getExplicitRole(element);
	if (explicitRole !== null) {
		return explicitRole;
	}

	return getImplicitRole(element);
}

const localNameToRoleMappings: Record<string, string | undefined> = {
	article: "article",
	aside: "complementary",
	body: "document",
	button: "button",
	datalist: "listbox",
	dd: "definition",
	details: "group",
	dialog: "dialog",
	dt: "term",
	fieldset: "group",
	figure: "figure",
	// WARNING: Only with an accessible name
	form: "form",
	footer: "contentinfo",
	h1: "heading",
	h2: "heading",
	h3: "heading",
	h4: "heading",
	h5: "heading",
	h6: "heading",
	header: "banner",
	hr: "separator",
	legend: "legend",
	li: "listitem",
	math: "math",
	main: "main",
	menu: "list",
	nav: "navigation",
	ol: "list",
	optgroup: "group",
	// WARNING: Only in certain context
	option: "option",
	output: "status",
	progress: "progressbar",
	// WARNING: Only with an accessible name
	section: "region",
	summary: "button",
	table: "table",
	tbody: "rowgroup",
	textarea: "textbox",
	tfoot: "rowgroup",
	// WARNING: Only in certain context
	td: "cell",
	th: "columnheader",
	thead: "rowgroup",
	tr: "row",
	ul: "list",
};

function getImplicitRole(element: Element): string | null {
	const mappedByTag = localNameToRoleMappings[getLocalName(element)];
	if (mappedByTag !== undefined) {
		return mappedByTag;
	}

	switch (getLocalName(element)) {
		case "a":
		case "area":
		case "link":
			if (element.hasAttribute("href")) {
				return "link";
			}
			break;
		case "img":
			const alt: string | null = element.getAttribute("alt");
			if (alt === null || alt.length > 0) {
				return "img";
			}
			break;
		case "input": {
			const { type } = element as HTMLInputElement;
			switch (type) {
				case "button":
				case "image":
				case "reset":
				case "submit":
					return "button";
				case "checkbox":
				case "radio":
					return type;
				case "range":
					return "slider";
				case "email":
				case "tel":
				case "text":
				case "url":
					if (element.hasAttribute("list")) {
						return "combobox";
					}
					return "textbox";

				case "search":
					if (element.hasAttribute("list")) {
						return "combobox";
					}
					return "searchbox";
				default:
					return null;
			}
		}
		case "select":
			if (
				element.hasAttribute("multiple") ||
				(element as HTMLSelectElement).size > 1
			) {
				return "listbox";
			}
			return "combobox";
	}
	return null;
}

function getExplicitRole(element: Element): string | null {
	if (element.hasAttribute("role")) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute check
		const [explicitRole] = element.getAttribute("role")!.trim().split(" ");
		if (explicitRole !== undefined && explicitRole.length > 0) {
			return explicitRole;
		}
	}

	return null;
}
