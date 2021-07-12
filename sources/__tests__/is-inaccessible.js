import { isInaccessible, isSubtreeInaccessible } from "../is-inaccessible";
import { cleanup, renderIntoDocument } from "./helpers/test-utils";

afterEach(() => {
	jest.restoreAllMocks();
});

describe("isInaccessible", () => {
	test.each([
		["<div data-test />", false],
		['<div data-test aria-hidden="false" />', false],
		['<div data-test style="visibility: visible" />', false],
		[
			'<div style="visibility: hidden;"><div data-test style="visibility: visible;"/></div>',
			false,
		],
		["<div data-test hidden />", true],
		['<div data-test style="display: none;"/>', true],
		['<div data-test style="visibility: hidden;"/>', true],
		['<div data-test aria-hidden="true" />', true],
	])("markup #%#", (markup, expectedIsInaccessible) => {
		const container = renderIntoDocument(markup);
		expect(container).not.toBe(null);

		const testNode = container.querySelector("[data-test]");
		expect(isInaccessible(testNode)).toBe(expectedIsInaccessible);
	});

	test("isSubtreeInaccessible implementation can be injected", () => {
		const container = renderIntoDocument(
			`<div style="display: none;"><button data-test /></div>`
		);
		const testNode = container.querySelector("[data-test]");

		// accessible since we ignored styles
		expect(
			isInaccessible(testNode, {
				// ignore subtree accessibility
				// A more useful usecase would be caching these results for repeated calls of `isInaccessible`
				isSubtreeInaccessible: () => false,
			})
		).toBe(false);
	});

	test("window.getComputedStyle implementation can be injected", () => {
		jest.spyOn(window, "getComputedStyle");
		const container = renderIntoDocument(
			`<button data-test style="display: none;" />`
		);
		const testNode = container.querySelector("[data-test]");

		// accessible since we ignored styles
		expect(
			isInaccessible(testNode, {
				// mock `getComputedStyle` with an empty CSSDeclaration
				getComputedStyle: () => {
					const styles = document.createElement("div").style;

					return styles;
				},
			})
		).toBe(false);
		expect(window.getComputedStyle).toHaveBeenCalledTimes(0);
	});

	test("throws if ownerDocument is not associated to a window", () => {
		expect(() =>
			isInaccessible(document.createElement("div"), {
				// mocking no available window
				// https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView
				getComputedStyle: null,
			})
		).toThrowErrorMatchingInlineSnapshot(
			`"Owner document of the element needs to have an associated window."`
		);
	});
});

describe("isSubtreeInaccessible", () => {
	test.each([
		["<div data-test />", false],
		['<div data-test aria-hidden="false" />', false],
		['<div data-test style="visibility: hidden" />', false],
		[
			'<div style="visibility: hidden;"><div data-test style="visibility: visible;"/></div>',
			false,
		],
		["<div data-test hidden />", true],
		['<div data-test style="display: none;"/>', true],
		['<div data-test aria-hidden="true" />', true],
	])("markup #%#", (markup, expectedIsInaccessible) => {
		const container = renderIntoDocument(markup);
		expect(container).not.toBe(null);

		const testNode = container.querySelector("[data-test]");
		expect(isSubtreeInaccessible(testNode)).toBe(expectedIsInaccessible);
	});

	test("window.getComputedStyle implementation can be injected", () => {
		jest.spyOn(window, "getComputedStyle");
		const container = renderIntoDocument(
			`<button data-test style="display: none;" />`
		);
		const testNode = container.querySelector("[data-test]");

		// accessible since we ignored styles
		expect(
			isSubtreeInaccessible(testNode, {
				// mock `getComputedStyle` with an empty CSSDeclaration
				getComputedStyle: () => {
					const styles = document.createElement("div").style;

					return styles;
				},
			})
		).toBe(false);
		expect(window.getComputedStyle).toHaveBeenCalledTimes(0);
	});

	test("throws if ownerDocument is not associated to a window", () => {
		expect(() =>
			isSubtreeInaccessible(document.createElement("div"), {
				// mocking no available window
				// https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView
				getComputedStyle: null,
			})
		).toThrowErrorMatchingInlineSnapshot(
			`"Owner document of the element needs to have an associated window."`
		);
	});
});

afterEach(cleanup);
