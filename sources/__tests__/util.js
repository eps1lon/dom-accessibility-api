import { queryIdRefs } from "../util";

describe("queryIdRefs in detached trees", () => {
	test.each(["", " ", " description  "])(
		"does not resolve empty IDs in %j to an idless root",
		(value) => {
			const root = document.createElement("div");
			root.innerHTML = `<button></button><span id="description">Description</span>`;
			root.firstChild.setAttribute("aria-describedby", value);
			expect(queryIdRefs(root.firstChild, "aria-describedby")).toEqual(
				value.trim() ? [root.lastChild] : [],
			);
		},
	);
	it("finds descendants without interpreting IDs as CSS selectors", () => {
		const root = document.createElement("div");
		root.innerHTML = `<button aria-describedby="a:b missing a:b"></button><span id="a:b">Description</span>`;
		const description = root.querySelector("span");
		expect(
			queryIdRefs(root.querySelector("button"), "aria-describedby"),
		).toEqual([description, description]);
	});

	it("finds the detached root itself", () => {
		const root = document.createElement("div");
		root.id = "root";
		root.innerHTML = `<button aria-labelledby="root"></button>`;
		expect(queryIdRefs(root.firstChild, "aria-labelledby")).toEqual([root]);
	});

	it("does not resolve references from another tree", () => {
		const root = document.createElement("button");
		root.setAttribute("aria-describedby", "outside");
		const outside = document.createElement("span");
		outside.id = "outside";
		document.body.appendChild(outside);
		try {
			expect(queryIdRefs(root, "aria-describedby")).toEqual([]);
		} finally {
			outside.remove();
		}
	});
});
