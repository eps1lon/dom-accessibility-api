import test from "ava";
import { JSDOM } from "jsdom";
import { act, getByRole } from "@testing-library/react";
import * as React from "react";
import * as ReactDOMClient from "react-dom/client";

test("fn() returns foo", (t) => {
	const { window } = new JSDOM();
	// @ts-ignore
	global.window = window;
	// @ts-ignore
	global.document = window.document;

	const container = document.createElement("div");
	act(() => {
		ReactDOMClient.createRoot(container).render(
			React.createElement("div", { children: "Hello, Dave!", role: "button" })
		);
	});
	// getByRole depends on `dom-accessibility-api`
	t.truthy(getByRole(container, "button", { name: "Hello, Dave!" }));
});
