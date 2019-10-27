// https://w3c.github.io/html-aria/#document-conformance-requirements-for-use-of-aria-attributes-in-html

export default function getRole(element: Element): string | null {
	const explicitRole = getExplicitRole(element);
	if (explicitRole !== null) {
		return explicitRole;
	}

	return getImplicitRole(element);
}

const tagToRoleMappings: Record<string, string | undefined> = {
	ARTICLE: "article",
	ASIDE: "complementary",
	BODY: "document",
	BUTTON: "button",
	DATALIST: "listbox",
	DD: "definition",
	DETAILS: "group",
	DIALOG: "dialog",
	DT: "term",
	FIELDSET: "group",
	FIGURE: "figure",
	// WARNING: Only with an accessible name
	FORM: "form",
	FOOTER: "contentinfo",
	H1: "heading",
	H2: "heading",
	H3: "heading",
	H4: "heading",
	H5: "heading",
	H6: "heading",
	HEADER: "banner",
	HR: "separator",
	LEGEND: "legend",
	LI: "listitem",
	MATH: "math",
	MAIN: "main",
	MENU: "list",
	NAV: "navigation",
	OL: "list",
	OPTGROUP: "group",
	// WARNING: Only in certain context
	OPTION: "option",
	OUTPUT: "status",
	PROGRESS: "progressbar",
	// WARNING: Only with an accessible name
	SECTION: "region",
	SUMMARY: "button",
	TABLE: "table",
	TBODY: "rowgroup",
	TEXTAREA: "textbox",
	TFOOT: "rowgroup",
	// WARNING: Only in certain context
	TD: "cell",
	TH: "columnheader",
	THEAD: "rowgroup",
	TR: "row",
	UL: "list"
};

function getImplicitRole(element: Element): string | null {
	const mappedByTag = tagToRoleMappings[element.tagName];
	if (mappedByTag !== undefined) {
		return mappedByTag;
	}

	switch (element.tagName) {
		case "A":
		case "AREA":
		case "LINK":
			if (element.hasAttribute("href")) {
				return "link";
			}
		case "IMG":
			if ((element.getAttribute("alt") || "").length > 0) {
				return "img";
			}
		case "INPUT":
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
		case "SELECT":
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
		const [explicitRole] = element
			.getAttribute("role")!
			.trim()
			.split(" ");
		if (explicitRole !== undefined && explicitRole.length > 0) {
			return explicitRole;
		}
	}

	return null;
}
