---
"dom-accessibility-api": minor
---

**BREAKING CHANGE**

Ignore `::before` and `::after` by default.

This was necessary to prevent excessive warnings in `jsdom@^16.3.0`.
If you use this package in a browser that supports the second argument of `window.getComputedStyle` you can set the `computedStyleSupportsPseudoElements` option to true:

```ts
computeAccessibleName(element, {
	computedStyleSupportsPseudoElements: true,
});

computeAccessibleDescription(element, {
	computedStyleSupportsPseudoElements: true,
});
```

If you pass a custom implementation of `getComputedStyle` then this option defaults to `true`.
The following two calls are equivalent:

```ts
computeAccessibleName(element, {
	computedStyleSupportsPseudoElements: true,
});

computeAccessibleName(element, {
	getComputedStyle: (element, pseudoElement) => {
		// custom implementation
	},
});
```
