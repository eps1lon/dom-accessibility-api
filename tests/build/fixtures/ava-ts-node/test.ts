import test from "ava";
import { JSDOM } from "jsdom";
import { findByRole } from "@testing-library/react";
import * as React from "react";
import * as ReactDOMClient from "react-dom/client";

test("fn() returns foo", async (t) => {
	const { window } = new JSDOM();
	// @ts-ignore
	global.window = window;
	// @ts-ignore
	global.document = window.document;

	const container = document.createElement("div");
	ReactDOMClient.createRoot(container).render(
		React.createElement("div", { children: "Hello, Dave!", role: "button" }),
	);
	// findByRole depends on `dom-accessibility-api`
	await t.notThrowsAsync(() =>
		findByRole(container, "button", { name: "Hello, Dave!" }),
	);
});
