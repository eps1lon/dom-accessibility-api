import { computeAccessibleDescription } from "../accessible-description";
import { renderIntoDocument } from "./helpers/test-utils";
import { prettyDOM } from "@testing-library/dom";
import diff from "jest-diff";

expect.extend({
	toHaveAccessibleDescription(received, expected) {
		if (received == null) {
			return {
				message: () =>
					`The element was not an Element but '${String(received)}'`,
				pass: false,
			};
		}

		const actual = computeAccessibleDescription(received);
		if (actual !== expected) {
			return {
				message: () =>
					`expected ${prettyDOM(
						received
					)} to have accessible description '${expected}' but got '${actual}'\n${diff(
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
				)} not to have accessible description '${expected}'\n${diff(
					expected,
					actual
				)}`,
			pass: true,
		};
	},
});

function testMarkup(markup, accessibleDescription) {
	const container = renderIntoDocument(markup);

	const testNode = container.querySelector("[data-test]");
	expect(testNode).toHaveAccessibleDescription(accessibleDescription);
}

describe("wpt copies", () => {
	test.each([
		[
			`<img src="foo.jpg" data-test alt="test" aria-describedby="t1"><span id="t1" role="presentation">foo</span>`,
			"foo",
		],
	])(`%#`, (markup, expectedAccessibleName) =>
		testMarkup(markup, expectedAccessibleName)
	);
});
