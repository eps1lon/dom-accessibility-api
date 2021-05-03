---
"dom-accessibility-api": patch
---

Use label attribute for naming of `<optgroup>` elements.

Given

```jsx
<select>
	<optgroup label="foo">
		<option value="1">bar</option>
	</optgroup>
</select>
```

Previously the `<optgroup />` would not have an accessible name.
Though [2D in `accname` 1.2](https://www.w3.org/TR/accname-1.2/) could be interpreted to use the `label` attribute:

> Otherwise, if the current node's native markup provides an attribute (e.g. title) or element (e.g. HTML label) that defines a text alternative, return that alternative [...]

This was confirmed in NVDA + FireFox.
