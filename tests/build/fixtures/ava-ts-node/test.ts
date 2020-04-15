import test from "ava";
import { JSDOM } from "jsdom";
import { getByRole } from "@testing-library/react";
import * as React from "react";
import * as ReactDOM from "react-dom";

test("fn() returns foo", (t) => {
	const { window } = new JSDOM();
	// @ts-ignore
	global.window = window;
	// @ts-ignore
	global.document = window.document;

	const container = document.createElement("div");
	ReactDOM.render(
		React.createElement("div", { children: "Hello, Dave!", role: "button" }),
		container
	);
	// getByRole depends on `dom-accessibility-api`
	t.truthy(getByRole(container, "button", { name: "Hello, Dave!" }));
});
