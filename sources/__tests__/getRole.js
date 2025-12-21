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

it("ignores empty roles", () => {
	const element = document.createElement("div");
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
	["a element without a href", null, createElementFactory("a", {})],
	["abbr", null, createElementFactory("abbr", {})],
	["address", null, createElementFactory("address", {})],
	["area with a href", "link", createElementFactory("area", { href: "any" })],
	["area without a href", null, createElementFactory("area", {})],
	["article", "article", createElementFactory("article", {})],
	["aside", "complementary", createElementFactory("aside", {})],
	["audio", null, createElementFactory("audio", {})],
	["base", null, createElementFactory("base", {})],
	["blockquote", null, createElementFactory("blockquote", {})],
	["body", null, createElementFactory("body", {})],
	["button", "button", createElementFactory("button", {})],
	["canvas", null, createElementFactory("canvas", {})],
	["caption", null, createElementFactory("caption", {})],
	["col", null, createElementFactory("col", {})],
	["colgroup", null, createElementFactory("colgroup", {})],
	["datalist", "listbox", createElementFactory("datalist", {})],
	["dd", "definition", createElementFactory("dd", {})],
	["del", null, createElementFactory("del", {})],
	["details", "group", createElementFactory("details", {})],
	["dialog", "dialog", createElementFactory("dialog", {})],
	["div", null, createElementFactory("div", {})],
	["dl", null, createElementFactory("dl", {})],
	["dt", "term", createElementFactory("dt", {})],
	["em", null, createElementFactory("em", {})],
	["embed", null, createElementFactory("embed", {})],
	["figcaption", null, createElementFactory("figcaption", {})],
	["fieldset", "group", createElementFactory("fieldset", {})],
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
	["hgroup", null, createElementFactory("hgroup", {})],
	["hr", "separator", createElementFactory("hr", {})],
	["html", "document", createElementFactory("html", {})],
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
	["ins", null, createElementFactory("ins", {})],
	["label", null, createElementFactory("label", {})],
  ["legend", 'legend', createElementFactory("legend", {})],
  // WARNING: Only in certain context
	["li", "listitem", createElementFactory("li", {})],
	["link element with a href", "link", createElementFactory("link", {href: "some"})],
	["main", "main", createElementFactory("main", {})],
	["map", null, createElementFactory("map", {})],
	["math", "math", createElementFactory("math", {})],
	["menu", "list", createElementFactory("menu", {})],
	["meta", null, createElementFactory("meta", {})],
	["meter", null, createElementFactory("meter", {})],
	["nav", "navigation", createElementFactory("nav", {})],
	["noscript", null, createElementFactory("noscript", {})],
	["object", null, createElementFactory("object", {})],
	["ol", "list", createElementFactory("ol", {})],
  ["optgroup", "group", createElementFactory("optgroup", {})],
  // Warning: Only in certain context
	["option", "option", createElementFactory("option", {})],
	["output", "status", createElementFactory("output", {})],
	["p", null, createElementFactory("p", {})],
	["param", null, createElementFactory("param", {})],
	["picture", null, createElementFactory("picture", {})],
	["pre", null, createElementFactory("pre", {})],
	["progress", "progressbar", createElementFactory("progress", {})],
  ["script", null, createElementFactory("script", {})],
  // WARNING: Only with a name
	["section", "region", createElementFactory("section", {})],
	["select, no multiple, no size", "combobox", createElementFactory("select", {})],
	["select, no multiple, no size greater 1", "combobox", createElementFactory("select", {size: 1})],
	["select, size greater 1", "listbox", createElementFactory("select", {size: 2})],
	["select, multiple", "listbox", createElementFactory("select", {multiple: true})],
	["slot", null, createElementFactory("slot", {})],
	["source", null, createElementFactory("source", {})],
	["span", null, createElementFactory("span", {})],
	["strong", null, createElementFactory("strong", {})],
	["style", null, createElementFactory("style", {})],
	["svg", null, createElementFactory("svg", {})],
	["sub", null, createElementFactory("sub", {})],
	["summary", "button", createElementFactory("summary", {})],
	["sup", null, createElementFactory("sup", {})],
	["table", "table", createElementFactory("table", {})],
	["tbody", "rowgroup", createElementFactory("tbody", {})],
	["template", null, createElementFactory("template", {})],
	["textarea", "textbox", createElementFactory("textarea", {})],
	["tfoot", "rowgroup", createElementFactory("tfoot", {})],
	["thead", "rowgroup", createElementFactory("thead", {})],
	["time", null, createElementFactory("time", {})],
  ["title", null, createElementFactory("title", {})],
  // WARNING: Only in certain contexts
	["td", "cell", createElementFactory("td", {})],
	// default scope=auto
	["th missing scope", "columnheader", createElementFactory("th", {})],
	["th scope explicitly set to `auto`", "columnheader", createElementFactory("th", {scope:"auto"})],
	["th scope=col", "columnheader", createElementFactory("th", {scope:"col"})],
	["th scope=colgroup", "columnheader", createElementFactory("th", {scope:"colgroup"})],
	["th scope=row", "rowheader", createElementFactory("th", {scope:"row"})],
	["th scope=rowgroup", "rowheader", createElementFactory("th", {scope:"rowgroup"})],
	["tr", "row", createElementFactory("tr", {})],
	["track", null, createElementFactory("track", {})],
	["ul", "list", createElementFactory("ul", {})],
	["video", null, createElementFactory("video", {})],
	// https://rawgit.com/w3c/aria/stable/#conflict_resolution_presentation_none
	["presentational <img /> with accessible name", "img", createElementFactory("img", {alt: "", 'aria-label': "foo"})],
	["presentational <h1 /> global aria attributes", "heading", createElementFactory("h1", {'aria-describedby': "comment-1", role: "presentation"})],
	["presentational <h1 /> global aria attributes", "heading", createElementFactory("h1", {'aria-describedby': "comment-1", role: "none"})],
	// <div /> isn't mapped to `"generic"` yet so implicit semantics are `No role`
	["presentational <div /> with prohibited aria attributes", null, createElementFactory("div", {'aria-label': "hello", role: "presentation"})],
	["presentational <div /> with prohibited aria attributes", null, createElementFactory("div", {'aria-label': "hello", role: "none"})],
];

it.each(cases)("%s has the role %s", (_name, role, elementFactory) => {
	const element = elementFactory();

	expect(getRole(element)).toEqual(role);
});
