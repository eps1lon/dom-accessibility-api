import { computeAccessibleName } from "../accessible-name";
import { renderIntoDocument } from "./helpers/test-utils";
import { prettyDOM } from "@testing-library/dom";
import diff from "jest-diff";

expect.extend({
	toHaveAccessibleName(received, expected) {
		if (received == null) {
			return {
				message: () =>
					`The element was not an Element but '${String(received)}'`,
				pass: false
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
				pass: false
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
			pass: true
		};
	}
});

test.each([
	[
		`
<div data-test aria-labelledby="label">I reference my name</div>
<div id="label" role="presentation">I'm prohibited a name</div>
`,
		"I'm prohibited a name"
	],
	[
		`
<element1 data-test id="el1" aria-labelledby="el3" />
<element2 id="el2" aria-labelledby="el1" />
<element3 id="el3"> hello </element3>
`,
		"hello"
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
		"Flash the screen 1 times."
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
		"foo 5 baz"
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
		"fancy"
	],
	[
		`
<input data-test id="test" type="text" aria-label="bar" aria-labelledby="ID1 test">
<div id="ID1">foo</label>
	`,
		"foo bar"
	],
	[
		`
<label>This <input type="checkbox" id="test" data-test /> is</label>
<label for="test">a test</label>
		`,
		"This is a test"
	],
	// byAltText('an image') = byRole('image', {name: 'an image'})
	[`<img data-test alt="an image" />`, "an image"],
	// this would require a custom matcher
	[
		`<div id="label"><em>the</em> logo</div><img data-test aria-labelledby="label" />`,
		"the logo"
	],
	// byDisplayValue isn't solvable by accessibleName
	[`<label>Age <input data-test type="text" value="10" /></label>`, "Age"],
	// byLabelText('Age') =>  byRole('textbox', {name: 'Age'})
	// byText('Arizona') => byRole('option', {name: 'Arizona'})
	[`<option data-test >Arizona</option>`, "Arizona"],
	// this would require a custom matcher
	[`<button data-test>Click <em>me</em></option>`, "Click me"],
	// byTitle('Hello, Dave!') => byRole('textbox', {name: 'Hello, Dave!'})
	[`<input data-test title="Hello, Dave!" />`, "Hello, Dave!"]
])(`case %#`, (markup, accessibleName) => {
	const container = renderIntoDocument(markup);

	const testNode = container.querySelector("[data-test]");
	expect(testNode).toHaveAccessibleName(accessibleName);
});
