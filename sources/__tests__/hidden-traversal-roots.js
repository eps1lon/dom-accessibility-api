import { computeAccessibleName } from "../accessible-name";
import { computeAccessibleDescription } from "../accessible-description";
import { cleanup, renderIntoDocument } from "./helpers/test-utils";

afterEach(cleanup);

// Accname 1.2 step 2A scopes hidden inclusion to the root of each ARIA or
// native-label traversal. Effective hiddenness includes inaccessible ancestors,
// while a visibility override can make a descendant independently visible.
// https://www.w3.org/TR/accname-1.2/#computation-steps
const cases = [
	[
		"visible external native label",
		'<input id="label" type="checkbox" hidden><label for="label">Shown <span hidden>Omit</span></label>',
		"Shown",
	],
	[
		"hidden external native label",
		'<input id="label" type="checkbox" hidden><label for="label" hidden>Hidden <span hidden>detail</span></label>',
		"Hidden detail",
	],
	[
		"collapsed target",
		'<span id="label" style="visibility: collapse"><span hidden>Export</span></span>',
		"Export",
	],
	[
		"aria-hidden ancestor",
		'<div aria-hidden="true"><span id="label"><span hidden>Export</span></span></div>',
		"Export",
	],
	[
		"aria-hidden false cannot override a hidden ancestor",
		'<div aria-hidden="true"><span id="label" aria-hidden="false"><span hidden>Export</span></span></div>',
		"Export",
	],
	[
		"display block cannot override display none on an ancestor",
		'<div style="display: none"><span id="label" style="display: block"><span hidden>Export</span></span></div>',
		"Export",
	],
	[
		"hidden ancestor",
		'<div hidden><span id="label"><span hidden>Export</span></span></div>',
		"Export",
	],
	[
		"inherited hidden visibility",
		'<div style="visibility: hidden"><span id="label"><span hidden>Export</span></span></div>',
		"Export",
	],
	[
		"inherited collapsed visibility",
		'<div style="visibility: collapse"><span id="label"><span hidden>Export</span></span></div>',
		"Export",
	],
	[
		"visible override of inherited hidden visibility",
		'<div style="visibility: hidden"><span id="label" style="visibility: visible">Shown <span hidden>Omit</span></span></div>',
		"Shown",
	],
	[
		"visible override of inherited collapsed visibility",
		'<div style="visibility: collapse"><span id="label" style="visibility: visible">Shown <span hidden>Omit</span></span></div>',
		"Shown",
	],
	[
		"external native label with a hidden ancestor",
		'<input id="label" type="checkbox" hidden><div aria-hidden="true"><label for="label">Hidden <span hidden>detail</span></label></div>',
		"Hidden detail",
	],
];

describe.each([
	["name", "aria-labelledby", computeAccessibleName],
	["description", "aria-describedby", computeAccessibleDescription],
])("hidden traversal roots for %s", (_kind, attribute, compute) => {
	test.each(cases)("%s", (_label, markup, expected) => {
		const container = renderIntoDocument(
			`<button data-test ${attribute}="label">Button</button>${markup}`,
		);
		expect(compute(container.querySelector("[data-test]"))).toBe(expected);
	});
});
