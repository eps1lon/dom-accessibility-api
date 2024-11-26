import { computeAccessibleDescription } from "../accessible-description";
import { cleanup, render, renderIntoDocument } from "./helpers/test-utils";
import { prettyDOM } from "@testing-library/dom";
import { diff } from "jest-diff";

function toHaveAccessibleDescription(received, expected) {
	if (received == null) {
		return {
			message: () => `The element was not an Element but '${String(received)}'`,
			pass: false,
		};
	}

	const actual = computeAccessibleDescription(received);
	if (actual !== expected) {
		return {
			message: () =>
				`expected ${prettyDOM(
					received,
				)} to have accessible description '${expected}' but got '${actual}'\n${diff(
					expected,
					actual,
				)}`,
			pass: false,
		};
	}

	return {
		message: () =>
			`expected ${prettyDOM(
				received,
			)} not to have accessible description '${expected}'\n${diff(
				expected,
				actual,
			)}`,
		pass: true,
	};
}

expect.extend({
	toHaveAccessibleDescription,
	toRenderIntoDocumentAccessibleDescription(received, expected) {
		const container = renderIntoDocument(received);

		const testNode = container.querySelector("[data-test]");
		return toHaveAccessibleDescription(testNode, expected);
	},
	toRenderDetachedFromDocumentAccessibleDescription(received, expected) {
		const container = render(received);

		const testNode = container.querySelector("[data-test]");
		return toHaveAccessibleDescription(testNode, expected);
	},
});

afterEach(cleanup);

describe("wpt copies", () => {
	test.each([
		[
			`<img src="foo.jpg" data-test alt="test" aria-describedby="t1"><span id="t1" role="presentation">foo</span>`,
			"foo",
		],
		[
			`<img src="foo.jpg" data-test alt="test" aria-describedby="t1"><span id="t1" role="none">foo</span>`,
			"foo",
		],
		[
			`<a data-test href="#" aria-label="California" title="San Francisco" >United States</a>`,
			"San Francisco",
		],
		[
			`<button data-test href="#" aria-description="Paid feature">Deploy</button>`,
			"Paid feature",
		],
		[
			`<img src="foo.jpg" data-test alt="test" aria-description="bar" aria-describedby="t1"><span id="t1" role="presentation">foo</span>`,
			"foo",
		],
	])(`#%#`, (markup, expectedAccessibleDescription) => {
		expect(markup).toRenderIntoDocumentAccessibleDescription(
			expectedAccessibleDescription,
		);
		expect(markup).toRenderDetachedFromDocumentAccessibleDescription(
			expectedAccessibleDescription,
		);
	});
});

describe("content in shadow DOM", () => {
	it("works for aria-labelledby on elements in same shadow root", () => {
		const container = renderIntoDocument("<div></div>");
		const div = container.querySelector("div");
		div.attachShadow({ mode: "open" }).innerHTML = `
			<div id="theDescription">This is a button</div>
			<button aria-describedby="theDescription">Click me</button>
		`;

		const button = div.shadowRoot.querySelector("button");
		expect(computeAccessibleDescription(button)).toEqual("This is a button");
	});
});
