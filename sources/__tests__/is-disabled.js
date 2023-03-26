import { isDisabled } from "../is-disabled";
import { cleanup, renderIntoDocument } from "./helpers/test-utils";

describe("isInaccessible", () => {
	afterEach(cleanup);
	test.each([
		["<button data-test />", false],
		['<button data-test aria-disabled="true" />', true],
		['<button data-test disabled="true" />', true],
		["<button data-test disabled />", true],
		['<button data-test aria-disabled="false" />', false],
		["<div data-test disabled />", false],
	])("markup #%#", (markup, expectedIsDisabled) => {
		const container = renderIntoDocument(markup);
		expect(container).not.toBe(null);

		const testNode = container.querySelector("[data-test]");
		expect(isDisabled(testNode)).toBe(expectedIsDisabled);
	});
});
