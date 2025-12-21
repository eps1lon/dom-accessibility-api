// https://w3c.github.io/html-aria/#document-conformance-requirements-for-use-of-aria-attributes-in-html

import { presentationRoles } from "./util";

/**
 * Safe Element.localName for all supported environments
 * @param element
 */
export function getLocalName(element: Element): string {
	return (
		// eslint-disable-next-line no-restricted-properties -- actual guard for environments without localName
		element.localName ??
		// eslint-disable-next-line no-restricted-properties -- required for the fallback
		element.tagName.toLowerCase()
	);
}

const localNameToRoleMappings: Record<string, string | undefined> = {
	article: "article",
	aside: "complementary",
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
	html: "document",
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
	thead: "rowgroup",
	tr: "row",
	ul: "list",
};

const prohibitedAttributes: Record<string, Set<string>> = {
	caption: new Set(["aria-label", "aria-labelledby"]),
	code: new Set(["aria-label", "aria-labelledby"]),
	deletion: new Set(["aria-label", "aria-labelledby"]),
	emphasis: new Set(["aria-label", "aria-labelledby"]),
	generic: new Set(["aria-label", "aria-labelledby", "aria-roledescription"]),
	insertion: new Set(["aria-label", "aria-labelledby"]),
	none: new Set(["aria-label", "aria-labelledby"]),
	paragraph: new Set(["aria-label", "aria-labelledby"]),
	presentation: new Set(["aria-label", "aria-labelledby"]),
	strong: new Set(["aria-label", "aria-labelledby"]),
	subscript: new Set(["aria-label", "aria-labelledby"]),
	superscript: new Set(["aria-label", "aria-labelledby"]),
};

/**
 *
 * @param element
 * @param role The role used for this element. This is specified to control whether you want to use the implicit or explicit role.
 */
function hasGlobalAriaAttributes(element: Element, role: string): boolean {
	// https://rawgit.com/w3c/aria/stable/#global_states
	// commented attributes are deprecated
	return [
		"aria-atomic",
		"aria-busy",
		"aria-controls",
		"aria-current",
		"aria-description",
		"aria-describedby",
		"aria-details",
		// "disabled",
		"aria-dropeffect",
		// "errormessage",
		"aria-flowto",
		"aria-grabbed",
		// "haspopup",
		"aria-hidden",
		// "invalid",
		"aria-keyshortcuts",
		"aria-label",
		"aria-labelledby",
		"aria-live",
		"aria-owns",
		"aria-relevant",
		"aria-roledescription",
	].some((attributeName) => {
		return (
			element.hasAttribute(attributeName) &&
			!prohibitedAttributes[role]?.has(attributeName)
		);
	});
}

function ignorePresentationalRole(
	element: Element,
	implicitRole: string,
): boolean {
	// https://rawgit.com/w3c/aria/stable/#conflict_resolution_presentation_none
	return hasGlobalAriaAttributes(element, implicitRole);
}

export default function getRole(element: Element): string | null {
	const explicitRole = getExplicitRole(element);
	if (explicitRole === null || presentationRoles.indexOf(explicitRole) !== -1) {
		const implicitRole = getImplicitRole(element);
		if (
			presentationRoles.indexOf(explicitRole || "") === -1 ||
			ignorePresentationalRole(element, implicitRole || "")
		) {
			return implicitRole;
		}
	}

	return explicitRole;
}

function getImplicitRole(element: Element): string | null {
	const elName = getLocalName(element);
	const mappedByTag = localNameToRoleMappings[elName];
	if (mappedByTag !== undefined) {
		return mappedByTag;
	}

	switch (elName) {
		case "a":
		case "area":
		case "link":
			if (element.hasAttribute("href")) {
				return "link";
			}
			break;
		case "img":
			if (
				element.getAttribute("alt") === "" &&
				!ignorePresentationalRole(element, "img")
			) {
				return "presentation";
			}
			return "img";
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
				case "number":
					return "spinbutton";
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
		case "th":
			switch (element.getAttribute("scope")) {
				case "row":
				case "rowgroup":
					return "rowheader";
				case "col":
				case "colgroup":
				case "auto":
				default:
					return "columnheader";
			}
	}
	return null;
}

function getExplicitRole(element: Element): string | null {
	const role = element.getAttribute("role");
	if (role !== null) {
		const explicitRole = role.trim().split(" ")[0];
		// String.prototype.split(sep, limit) will always return an array with at least one member
		// as long as limit is either undefined or > 0
		if (explicitRole.length > 0) {
			return explicitRole;
		}
	}

	return null;
}
