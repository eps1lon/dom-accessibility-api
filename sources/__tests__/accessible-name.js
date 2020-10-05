import { computeAccessibleName } from "../accessible-name";
import { cleanup, renderIntoDocument } from "./helpers/test-utils";
import { prettyDOM } from "@testing-library/dom";
import diff from "jest-diff";

expect.extend({
	toHaveAccessibleName(received, expected) {
		if (received == null) {
			return {
				message: () =>
					`The element was not an Element but '${String(received)}'`,
				pass: false,
			};
		}

		const actual = computeAccessibleName(received);
		if (actual !== expected) {
			return {
				message: () =>
					`expected ${prettyDOM(
						received
					)} to have accessible name '${expected}' but got '${actual}'\n${diff(
						expected,
						actual
					)}`,
				pass: false,
			};
		}

		return {
			message: () =>
				`expected ${prettyDOM(
					received
				)} not to have accessible name '${expected}'\n${diff(
					expected,
					actual
				)}`,
			pass: true,
		};
	},
});

function testMarkup(markup, accessibleName) {
	const container = renderIntoDocument(markup);

	const testNode = container.querySelector("[data-test]");
	expect(testNode).toHaveAccessibleName(accessibleName);
}

function testShadowDomMarkup(markup, accessibleName) {
	const container = renderIntoDocument(markup);

	const testNode = container
		.querySelector("[data-root]")
		.shadowRoot.querySelector("[data-test]");
	expect(testNode).toHaveAccessibleName(accessibleName);
}

afterEach(cleanup);

describe("to upstream", () => {
	// name from content
	test.each([
		[
			"cell",
			`<div data-test role="cell"><em>greek</em> alpha</div>`,
			"greek alpha",
		],
		[
			"checkbox",
			`<div data-test role="checkbox"><em>greek</em> beta</div>`,
			"greek beta",
		],
		[
			"columnheader",
			`<div data-test role="columnheader"><em>greek</em> gamma</div>`,
			"greek gamma",
		],
		[
			"gridcell",
			`<div data-test role="gridcell"><em>greek</em> delta</div>`,
			"greek delta",
		],
		[
			"legend",
			`<fieldset><legend data-test><em>greek</em> zeta</legend></fieldset>`,
			"greek zeta",
		],
		[
			"menuitem",
			`<li data-test role="menuitem"><em>greek</em> eta</li>`,
			"greek eta",
		],
		[
			"menuitemradio",
			`<li data-test role="menuitemradio"><em>greek</em> theta</li>`,
			"greek theta",
		],
		[
			"menuitemcheckbox",
			`<li data-test role="menuitemcheckbox"><em>greek</em> iota</li>`,
			"greek iota",
		],
		[
			"radio",
			`<div data-test role="radio"><em>greek</em> kappa</div>`,
			"greek kappa",
		],
		[
			"row",
			`<table><tbody><tr data-test><td>greek</td><td>lambda</td></tr></tbody></table>`,
			"greek lambda",
		],
		[
			"rowheader",
			`<table><tbody><tr data-test><td data-test role="rowheader"><em>greek</em> mu</td></tr></tbody></table>`,
			"greek mu",
		],
		[
			"switch",
			`<div data-test role="switch"><em>greek</em> nu</div>`,
			"greek nu",
		],
		["tab", `<div data-test role="tab"><em>greek</em> xi</div>`, "greek xi"],
		[
			"tooltip",
			`<div data-test role="tooltip"><em>greek</em> omicron</div>`,
			"greek omicron",
		],
		[
			"treeitem",
			`<li data-test role="treeitem"><em>greek</em> pi</li>`,
			"greek pi",
		],
	])(`role %s has name from content`, (_, markup, expectedAccessibleName) =>
		testMarkup(markup, expectedAccessibleName)
	);

	test.each([
		[
			// TODO
			// weird edge case that results in an empty accessible name
			// Intuitevly the fist input has "foo baz" while the second one has "foo David"
			"two inputs, one label",
			`
<label>
	foo
	<input type="text" value="David">
	<input data-test type="text" value="baz">
</label>

`,
			"",
		],
		[
			"textarea value",
			`
<label for="test">
	foo
	<input type="text" value="David" />
</label>
<input data-test id="test" type="text" value="baz">			
`,
			"foo David",
		],
		[
			"textarea value",
			`
<label for="test">
	foo
	<textarea>David</textarea>
</label>
<input data-test id="test" type="text" value="baz">			
`,
			"foo David",
		],
		[
			"select value",
			`
<select id="role"><option selected>contributor</option></select>
<button data-test id="trigger" aria-labelledby="trigger role">Pick</button>
`,
			"Pick contributor",
		],
		// It seems like this is what wpt `name_heading-combobox-focusable-alternative`
		// should actually test. I could not find specification for combobox falling
		// back to the "value" attribute when computing the text alternative for the selected option
		[
			"embedded textbox",
			`
<h2 data-test>
	Country of origin:
	<input type="text" title="Choose your country." value="United States">
</h2>
`,
			"Country of origin: United States",
		],
	])(`coverage for %s`, (_, markup, expectedAccessibleName) => {
		return testMarkup(markup, expectedAccessibleName);
	});
});

describe("slots", () => {
	beforeAll(() => {
		customElements.define(
			"custom-button",
			class extends HTMLElement {
				constructor() {
					super();
					const shadowRoot = this.attachShadow({ mode: "open" });
					shadowRoot.innerHTML = `<button data-test><slot></slot></button>`;
				}
			}
		);

		customElements.define(
			"custom-button-with-default",
			class extends HTMLElement {
				constructor() {
					super();
					const shadowRoot = this.attachShadow({ mode: "open" });
					shadowRoot.innerHTML = `<button data-test><slot>Default name</slot></button>`;
				}
			}
		);
	});

	test.each([
		[
			"no default content",
			`<custom-button data-root>Custom name</custom-button>`,
			"Custom name",
		],
		[
			"default content",
			`<custom-button-with-default data-root></custom-button>`,
			"Default name",
		],
		[
			"overridden default content",
			`<custom-button-with-default data-root>Custom name</custom-button>`,
			"Custom name",
		],
	])("slot with %s has name", (_, markup, expectedAccessibleName) =>
		testShadowDomMarkup(markup, expectedAccessibleName)
	);
});

// misc tests
test.each([
	[
		`
<div data-test aria-labelledby="label">I reference my name</div>
<div id="label" role="presentation">I'm prohibited a name</div>
`,
		"I'm prohibited a name",
	],
	[
		`
<element1 data-test id="el1" aria-labelledby="el3" />
<element2 id="el2" aria-labelledby="el1" />
<element3 id="el3"> hello </element3>
`,
		"hello",
	],
	[
		`
<input type="checkbox" id="test" data-test />
<label for="test">Flash the screen
	<div role="combobox">
		<div role="textbox"></div>
		<ul role="listbox" style="list-style-type: none;">
			<li role="option" aria-selected="true">1</li>
			<li role="option">2</li>
			<li role="option">3</li>
		</ul>
	</div>
	times.
</label>
`,
		"Flash the screen 1 times.",
	],
	[
		`
<input type="text" id="test" data-test />
<label for="test">
	foo
	<input role="spinbutton" type="number" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10">
	baz
</label>
`,
		"foo 5 baz",
	],
	[
		// :after getcomputed not implemented
		`
<style>
	label:after { content:" fruit"; }
</style>
<label for="test">fancy</label>
<input type="image" src="foo.jpg" id="test" data-test />	
`,
		"fancy",
	],
	[
		`
<input data-test id="test" type="text" aria-label="bar" aria-labelledby="ID1 test">
<div id="ID1">foo</label>
	`,
		"foo bar",
	],
	[
		`
<label>This <input type="checkbox" id="test" data-test /> is</label>
<label for="test">a test</label>
		`,
		"This is a test",
	], // byAltText('an image') = byRole('image', {name: 'an image'})
	[`<img data-test alt="an image" />`, "an image"],
	// this would require a custom matcher
	[
		`<div id="label"><em>the</em> logo</div><img data-test aria-labelledby="label" />`,
		"the logo",
	],
	// byDisplayValue isn't solvable by accessibleName
	[`<label>Age <input data-test type="text" value="10" /></label>`, "Age"],
	// byLabelText('Age') =>  byRole('textbox', {name: 'Age'})
	// byText('Arizona') => byRole('option', {name: 'Arizona'})
	[`<option data-test >Arizona</option>`, "Arizona"],
	// this would require a custom matcher
	[`<button data-test>Click <em>me</em></option>`, "Click me"],
	// byTitle('Hello, Dave!') => byRole('textbox', {name: 'Hello, Dave!'})
	[`<input data-test title="Hello, Dave!" />`, "Hello, Dave!"],
	[
		`<label for="select">A Select</label><select data-test id="select" />`,
		"A Select",
	],
	[
		`<label for="textarea">A TextArea</label><textarea data-test id="textarea" />`,
		"A TextArea",
	],
	// https://w3c.github.io/html-aam/#fieldset-and-legend-elements
	[
		`<fieldset data-test><legend><em>greek</em> rho</legend></fieldset>`,
		"greek rho",
	],
	[
		`<fieldset data-test aria-owns="legend"></fieldset><legend id="legend"><em>greek</em> rho</legend>`,
		"",
	],
	// https://w3c.github.io/html-aam/#table-element
	[
		`<table data-test><caption><em>greek</em> rho</caption></caption>`,
		"greek rho",
	],
	[
		`<table data-test aria-owns="caption"></table><caption id="caption"><em>greek</em> rho</caption>`,
		"",
	],
	// https://www.w3.org/TR/svg-aam-1.0/
	[`<svg data-test><title><em>greek</em> rho</title></svg>`, "greek rho"],
	[`<button title="" data-test>click me</button>`, "click me"],
	// https://w3c.github.io/html-aam/#input-type-button-input-type-submit-and-input-type-reset-accessible-name-computation
	[`<input data-test value="Submit form" type="submit" />`, "Submit form"],
	// https://w3c.github.io/html-aam/#input-type-image
	[`<input data-test alt="Select an image" type="image" />`, "Select an image"],
	[`<input data-test alt="" type="image" />`, "Submit Query"],
	[
		`<img data-test alt="" aria-label="a logo" role="presentation" /> />`,
		"a logo",
	],
])(`test #%#`, testMarkup);

test("text nodes are not concatenated by space", () => {
	// how React would create `<h1>Hello {name}!</h1>`
	// which transpiles to
	// React.createElement('h1', 'Hello ', name, '!')
	const heading = document.createElement("h1");
	heading.appendChild(document.createTextNode("Hello "));
	heading.appendChild(document.createTextNode("Jill"));
	heading.appendChild(document.createTextNode("!"));
	renderIntoDocument(heading);

	expect(heading).toHaveAccessibleName("Hello Jill!");
});

describe("prohibited naming", () => {
	test.each([
		["caption", "<div data-test role='caption'>table</div>"],
		["code", '<div data-test role="code">named?</div>'],
		["deletion", '<div data-test role="deletion">named?</div>'],
		["emphasis", '<div data-test role="emphasis">named?</div>'],
		["generic", '<div data-test role="generic">named?</div>'],
		["insertion", '<div data-test role="insertion">named?</div>'],
		["paragraph", '<div data-test role="paragraph">named?</div>'],
		["presentation", '<div data-test role="presentation">named?</div>'],
		["strong", '<div data-test role="strong">named?</div>'],
		["subscript", '<div data-test role="subscript">named?</div>'],
		["superscript", "<div data-test role='supscript'>Hello</div>"],
	])("role '%s' prohibites naming", (_, markup) => {
		testMarkup(markup, "");
	});

	test.each([
		[
			"caption",
			`
<table data-test aria-labelledby='caption'></table>
<div id='caption' role='caption'>a table</div>
`,
			"a table",
		],
		[
			"code",
			"<button data-test><span role='code'>html-aam</span></button>",
			"html-aam",
		],
		[
			"deletion",
			"<button data-test>aria <span role='deletion'>1.1</span><span>1.2</span></button>",
			"aria 1.1 1.2",
		],
		[
			"emphasis",
			"<button data-test>aria <span role='emphasis'>1.2</span></button>",
			"aria 1.2",
		],
		[
			"generic",
			"<button data-test><span role='generic'>click</span></button>",
			"click",
		],
		[
			"insertion",
			"<button data-test><span role='insertion'>wai</span>aria</button>",
			"wai aria",
		],
		[
			"paragraph",
			"<button data-test><span role='paragraph'>I'm getting lazy</span></button>",
			"I'm getting lazy",
		],
		[
			"presentation",
			"<button data-test><span role='presentation'>icon</span></button>",
			"icon",
		],
		[
			"strong",
			"<button data-test><span role='strong'>CLICK!</span></button>",
			"CLICK!",
		],
		[
			"subscript",
			"<button data-test>A<span role='subscript'>_x</span></button>",
			"A _x",
		],
		[
			"superscript",
			"<button data-test>2<span role='superscript'>64</span></button>",
			"2 64",
		],
	])(
		"role '%s'can be part of the accessible name of another element",
		(_, markup, name) => {
			testMarkup(markup, name);
		}
	);
});

describe("options.getComputedStyle", () => {
	beforeEach(() => {
		jest.spyOn(window, "getComputedStyle");
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("uses window.getComputedStyle by default", () => {
		const container = renderIntoDocument("<button>test</button>");

		computeAccessibleName(container.querySelector("button"));

		// also mixing in a regression test for the number of calls
		// 2 calls for ::after and ::before are skipped in JSDOM
		expect(window.getComputedStyle).toHaveBeenCalledTimes(1);
	});

	it("can be mocked with a fake", () => {
		const container = renderIntoDocument("<button>test</button>");

		const name = computeAccessibleName(container.querySelector("button"), {
			getComputedStyle: () => {
				const declaration = new CSSStyleDeclaration();
				declaration.content = "'foo'";
				declaration.display = "block";
				declaration.visibility = "visible";

				return declaration;
			},
		});

		expect(name).toEqual("foo test foo");
		expect(window.getComputedStyle).not.toHaveBeenCalled();
	});
});

describe("options.computedStyleSupportsPseudoElements", () => {
	beforeEach(() => {
		jest.spyOn(console, "error").mockImplementation(() => {
			// swallow
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("`false` prevents errors in JSDOM from being logged", () => {
		const container = renderIntoDocument("<button>test</button>");

		computeAccessibleName(container.querySelector("button"), {
			computedStyleSupportsPseudoElements: false,
		});

		expect(console.error).not.toHaveBeenCalled();
	});

	it("`true` will lead JSDOM to log console errors", () => {
		const container = renderIntoDocument("<button>test</button>");

		computeAccessibleName(container.querySelector("button"), {
			computedStyleSupportsPseudoElements: true,
		});

		// one for ::before, one for ::after
		expect(console.error).toHaveBeenCalledTimes(2);
		expect(console.error.mock.calls[0][0]).toMatch(
			"Error: Not implemented: window.computedStyle(elt, pseudoElt)"
		);
		expect(console.error.mock.calls[1][0]).toMatch(
			"Error: Not implemented: window.computedStyle(elt, pseudoElt)"
		);
	});
});
