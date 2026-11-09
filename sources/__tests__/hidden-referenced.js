import { computeAccessibleName } from "../accessible-name";
import { computeAccessibleDescription } from "../accessible-description";
import { cleanup, renderIntoDocument } from "./helpers/test-utils";

afterEach(cleanup);

const hidingAttributes = [
	["hidden attribute", "hidden"],
	["aria-hidden", 'aria-hidden="true"'],
	["display none", 'style="display: none"'],
	["visibility hidden", 'style="visibility: hidden"'],
];

// Accname 1.2, Hidden Not Referenced: the exception depends on the
// directly referenced node being hidden, not just on a descendant being hidden.
// https://www.w3.org/TR/accname-1.2/#computation-steps
describe.each([
	["name", "aria-labelledby", computeAccessibleName],
	["description", "aria-describedby", computeAccessibleDescription],
])("hidden referenced %s", (_kind, attribute, compute) => {
	function evaluate(labels, references = "label", options) {
		const container = renderIntoDocument(
			`<button data-test ${attribute}="${references}">Button</button>${labels}`,
		);
		return compute(container.querySelector("[data-test]"), options);
	}

	test.each(hidingAttributes)(
		"includes hidden descendants of a target hidden with %s",
		(_label, hidden) => {
			expect(
				evaluate(
					`<span id="label" ${hidden}><span hidden><em>Export</em></span></span>`,
				),
			).toBe("Export");
		},
	);

	test.each(hidingAttributes)(
		"excludes descendants hidden with %s when the target is visible",
		(_label, hidden) => {
			expect(
				evaluate(`<span id="label">Shown <span ${hidden}>Hidden</span></span>`),
			).toBe("Shown");
		},
	);

	it("retains mixed text and markup throughout a hidden target", () => {
		expect(
			evaluate(
				'<div id="label" hidden>Save <span style="display: none">all</span> <b>files</b></div>',
			),
		).toBe("Save all files");
	});

	test.each([
		["hidden visible", "Hidden detail Shown"],
		["visible hidden", "Shown Hidden detail"],
	])(
		"keeps hidden inclusion scoped to each reference in %s",
		(ids, expected) => {
			expect(
				evaluate(
					'<span id="hidden" hidden>Hidden <span hidden>detail</span></span>' +
						'<span id="visible">Shown <span hidden>omitted</span></span>',
					ids,
				),
			).toBe(expected);
		},
	);

	it("preserves explicit inclusion of hidden content", () => {
		expect(
			evaluate(
				'<span id="label">Shown <span hidden>Hidden</span></span>',
				"label",
				{ hidden: true },
			),
		).toBe("Shown Hidden");
	});

	it("preserves a directly referenced hidden target's own text", () => {
		expect(evaluate('<span id="label" hidden>Plain</span>')).toBe("Plain");
	});
});
