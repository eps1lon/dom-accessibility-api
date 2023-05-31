import getRole from "../getRole";

it("prioritizes explicit roles", () => {
	const element = document.createElement("div");
	element.setAttribute("role", "textbox");

	expect(getRole(element)).toBe("textbox");
});

it("ignores whitespace", () => {
	const element = document.createElement("div");
	element.setAttribute("role", "  textbox  ");

	expect(getRole(element)).toBe("textbox");
});

it("uses the first role", () => {
	const element = document.createElement("div");
	element.setAttribute("role", "textbox input");

	expect(getRole(element)).toBe("textbox");
});

it("ignores empty roles when have implicit role", () => {
	const element = document.createElement("div");
	element.setAttribute("role", "  ");

	expect(getRole(element)).toBe("generic");
});

it("ignores empty roles when have no implicit role", () => {
	const element = document.createElement("abbr");
	element.setAttribute("role", "  ");

	expect(getRole(element)).toBeNull();
});

function createElementFactory(tagName, attributes) {
	return () => {
		const element = document.createElement(tagName);

		for (const [name, value] of Object.entries(attributes)) {
			element.setAttribute(name, value);
		}

		return element;
	};
}

// prettier-ignore
const cases = [
	["a element with a href", "link", createElementFactory("a", { href: "any" })],
	["a element without a href", "generic", createElementFactory("a", {})],
	["abbr", null, createElementFactory("abbr", {})],
	["address", "group", createElementFactory("address", {})],
	["area with a href", "link", createElementFactory("area", { href: "any" })],
	["area without a href", "generic", createElementFactory("area", {})],
	["article", "article", createElementFactory("article", {})],
	// WARNING: Only in certain context
	["aside", "complementary", createElementFactory("aside", {})],
	["audio", null, createElementFactory("audio", {})],
	["b", "generic", createElementFactory("b", {})],
	["base", null, createElementFactory("base", {})],
	["bdi", "generic", createElementFactory("bdi", {})],
	["bdo", "generic", createElementFactory("bdo", {})],
	["blockquote", "blockquote", createElementFactory("blockquote", {})],
	["body", "generic", createElementFactory("body", {})],
	["br", null, createElementFactory("br", {})],
	["button", "button", createElementFactory("button", {})],
	["canvas", null, createElementFactory("canvas", {})],
	["caption", "caption", createElementFactory("caption", {})],
	["cite", null, createElementFactory("cite", {})],
	["code", "code", createElementFactory("code", {})],
	["col", null, createElementFactory("col", {})],
	["colgroup", null, createElementFactory("colgroup", {})],
	["data", "generic", createElementFactory("data", {})],
	["datalist", "listbox", createElementFactory("datalist", {})],
	// WARNING: html-aria and html-aam conflict on this role assignment
	// REF: https://github.com/w3c/html-aam/pull/376
	["dd", null, createElementFactory("dd", {})],
	["del", "deletion", createElementFactory("del", {})],
	["details", "group", createElementFactory("details", {})],
	["dfn", "term", createElementFactory("dfn", {})],
	["dialog", "dialog", createElementFactory("dialog", {})],
	["div", "generic", createElementFactory("div", {})],
	["dl", null, createElementFactory("dl", {})],
	// WARNING: html-aria and html-aam conflict on this role assignment
	// REF: https://github.com/w3c/html-aam/pull/376
	["dt", null, createElementFactory("dt", {})],
	["em", "emphasis", createElementFactory("em", {})],
	["embed", null, createElementFactory("embed", {})],
	["fieldset", "group", createElementFactory("fieldset", {})],
	["figcaption", null, createElementFactory("figcaption", {})],
  ["figure", "figure", createElementFactory("figure", {})],
  // WARNING: Only in certain context
  ["footer", "contentinfo", createElementFactory("footer", {})],
  // WARNING: only with a name
	["form", "form", createElementFactory("form", {})],
	["h1", "heading", createElementFactory("h1", {})],
	["h2", "heading", createElementFactory("h2", {})],
	["h3", "heading", createElementFactory("h3", {})],
	["h4", "heading", createElementFactory("h4", {})],
	["h5", "heading", createElementFactory("h5", {})],
  ["h6", "heading", createElementFactory("h6", {})],
  // WARNING: Only in certain context
	["header", "banner", createElementFactory("header", {})],
	// WARNING: html-aria and html-aam conflict on this role assignment
	// REF: https://github.com/w3c/html-aria/issues/451
	["hgroup", "group", createElementFactory("hgroup", {})],
	["hr", "separator", createElementFactory("hr", {})],
	["html", "document", createElementFactory("html", {})],
	["i", "generic", createElementFactory("i", {})],
	["iframe", null, createElementFactory("iframe", {})],
	["img with alt=\"some text\"", "img", createElementFactory("img", {alt: "text"})],
	["img with missing alt", "img", createElementFactory("img", {})],
	["img with alt=\"\"", "presentation", createElementFactory("img", {alt: ""})],
	["input type=button", "button", createElementFactory("input", {type: "button"})],
	["input type=checkbox", "checkbox", createElementFactory("input", {type: "checkbox"})],
	["input type=color", null, createElementFactory("input", {type: "color"})],
	["input type=date", null, createElementFactory("input", {type: "date"})],
	["input type=datetime-local", null, createElementFactory("input", {type: "datetime-local"})],
	["input type=email", "textbox", createElementFactory("input", {type: "email"})],
	["input type=file", null, createElementFactory("input", {type: "file"})],
	["input type=hidden", null, createElementFactory("input", {type: "hidden"})],
	["input type=image", "button", createElementFactory("input", {type: "image"})],
	["input type=month", null, createElementFactory("input", {type: "month"})],
	["input type=number", "spinbutton", createElementFactory("input", {type: "number"})],
	["input type=radio", "radio", createElementFactory("input", {type: "radio"})],
	["input type=range", "slider", createElementFactory("input", {type: "range"})],
	["input type=reset", "button", createElementFactory("input", {type: "reset"})],
	["input type=search", "searchbox", createElementFactory("input", {type: "search"})],
	["input type=submit", "button", createElementFactory("input", {type: "submit"})],
	["input type=tel", "textbox", createElementFactory("input", {type: "tel"})],
	["input type=text, with no list attribute", "textbox", createElementFactory("input", {type: "text"})],
	["input type=text with a list attribute", "combobox", createElementFactory("input", {list: "",type: "text"})],
	["input type=search with a list attribute", "combobox", createElementFactory("input", {list: "",type: "search"})],
	["input type=tel with a list attribute", "combobox", createElementFactory("input", {list: "",type: "tel"})],
	["input type=url with a list attribute", "combobox", createElementFactory("input", {list: "",type: "url"})],
	["input type=email with a list attribute", "combobox", createElementFactory("input", {list: "",type: "email"})],
	["input type=time", null, createElementFactory("input", {type: "time"})],
	["input type=url", "textbox", createElementFactory("input", {type: "url"})],
	["input type=week", null, createElementFactory("input", {type: "week"})],
	["ins", "insertion", createElementFactory("ins", {})],
	["kbd", null, createElementFactory("kbd", {})],
	["label", null, createElementFactory("label", {})],
  ["legend", 'legend', createElementFactory("legend", {})],
  // WARNING: Only in certain context
	["li", "listitem", createElementFactory("li", {})],
	// WARNING: html-aria and html-aam conflict with wai-aria on this role assignment
	// REF: https://github.com/w3c/html-aria/issues/467
	["link", null, createElementFactory("link", {})],
	["link element with a href", "link", createElementFactory("link", {href: "some"})],
	["main", "main", createElementFactory("main", {})],
	["map", null, createElementFactory("map", {})],
	["mark", null, createElementFactory("mark", {})],
	["math", "math", createElementFactory("math", {})],
	["menu", "list", createElementFactory("menu", {})],
	["meta", null, createElementFactory("meta", {})],
	["meter", "meter", createElementFactory("meter", {})],
	["nav", "navigation", createElementFactory("nav", {})],
	["noscript", null, createElementFactory("noscript", {})],
	["object", null, createElementFactory("object", {})],
	["ol", "list", createElementFactory("ol", {})],
  ["optgroup", "group", createElementFactory("optgroup", {})],
  // Warning: Only in certain context
	["option", "option", createElementFactory("option", {})],
	["output", "status", createElementFactory("output", {})],
	["p", "paragraph", createElementFactory("p", {})],
	["param", null, createElementFactory("param", {})],
	["picture", null, createElementFactory("picture", {})],
	["pre", "generic", createElementFactory("pre", {})],
	["progress", "progressbar", createElementFactory("progress", {})],
	["q", "generic", createElementFactory("q", {})],
	["rp", null, createElementFactory("rp", {})],
	["rt", null, createElementFactory("rt", {})],
	["ruby", null, createElementFactory("ruby", {})],
	// WARNING: html-aria and html-aam conflict on this role assignment
	// REF: https://github.com/w3c/html-aria/issues/466
	["s", "deletion", createElementFactory("s", {})],
	["samp", "generic", createElementFactory("samp", {})],
  ["script", null, createElementFactory("script", {})],
  ["search", "search", createElementFactory("search", {})],
  // WARNING: Only with a name
	["section", "region", createElementFactory("section", {})],
	["select, no multiple, no size", "combobox", createElementFactory("select", {})],
	["select, no multiple, no size greater 1", "combobox", createElementFactory("select", {size: 1})],
	["select, size greater 1", "listbox", createElementFactory("select", {size: 2})],
	["select, multiple", "listbox", createElementFactory("select", {multiple: true})],
	["slot", null, createElementFactory("slot", {})],
	["small", "generic", createElementFactory("small", {})],
	["source", null, createElementFactory("source", {})],
	["span", "generic", createElementFactory("span", {})],
	["strong", "strong", createElementFactory("strong", {})],
	["style", null, createElementFactory("style", {})],
	["sub", "subscript", createElementFactory("sub", {})],
	["summary", "button", createElementFactory("summary", {})],
	["sup", "superscript", createElementFactory("sup", {})],
	["svg", "graphics-document", createElementFactory("svg", {})],
	["table", "table", createElementFactory("table", {})],
	["tbody", "rowgroup", createElementFactory("tbody", {})],
  // WARNING: Only in certain contexts
	["td", "cell", createElementFactory("td", {})],
	["template", null, createElementFactory("template", {})],
	["textarea", "textbox", createElementFactory("textarea", {})],
	["tfoot", "rowgroup", createElementFactory("tfoot", {})],
	// WARNING: Only in certain context
	["th", "columnheader", createElementFactory("th", {})],
	["thead", "rowgroup", createElementFactory("thead", {})],
	["time", "time", createElementFactory("time", {})],
  ["title", null, createElementFactory("title", {})],
	["tr", "row", createElementFactory("tr", {})],
	["track", null, createElementFactory("track", {})],
	["u", "generic", createElementFactory("u", {})],
	["ul", "list", createElementFactory("ul", {})],
	["var", null, createElementFactory("var", {})],
	["video", null, createElementFactory("video", {})],
	["wbr", null, createElementFactory("wbr", {})],
	// https://rawgit.com/w3c/aria/stable/#conflict_resolution_presentation_none
	["presentational <img /> with accessible name", "img", createElementFactory("img", {alt: "", 'aria-label': "foo"})],
	["presentational <h1 /> global aria attributes", "heading", createElementFactory("h1", {'aria-describedby': "comment-1", role: "presentation"})],
	["presentational <h1 /> global aria attributes", "heading", createElementFactory("h1", {'aria-describedby': "comment-1", role: "none"})],
	// <abbr /> isn't mapped to `"generic"` yet so implicit semantics are `No role`
	["presentational <abbr /> with prohibited aria attributes", null, createElementFactory("abbr", {'aria-label': "hello", role: "presentation"})],
	["presentational <abbr /> with prohibited aria attributes", null, createElementFactory("abbr", {'aria-label': "hello", role: "none"})],
];

it.each(cases)("%s has the role %s", (name, role, elementFactory) => {
	const element = elementFactory();

	expect(getRole(element)).toEqual(role);
});
