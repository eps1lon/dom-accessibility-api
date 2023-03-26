import { isDisabled } from "../is-disabled";
import { cleanup, renderIntoDocument } from "./helpers/test-utils";

describe("isInaccessible", () => {
	afterEach(cleanup);
	test.each([
		["<div data-test />", false],
		['<div data-test aria-disabled="true" />', true],
		['<div data-test disabled="true" />', true],
		["<div data-test disabled />", true],
		['<div data-test disabled="false" />', false],
		['<div data-test aria-disabled="false" />', false],
	])("markup #%#", (markup, expectedIsDisabled) => {
		const container = renderIntoDocument(markup);
		expect(container).not.toBe(null);

		const testNode = container.querySelector("[data-test]");
		expect(isDisabled(testNode)).toBe(expectedIsDisabled);
	});
});
