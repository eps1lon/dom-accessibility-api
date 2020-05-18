---
"dom-accessibility-api": patch
---

Consider `<caption>` for the name of its `<table>` element.

```html
<table>
	<caption>
		<em>my</em>
		table
	</caption>
</table>
```

Computing the name for this table would've returned an empty string previously. It now correctly computes `my table` following the [accessible name computation for `table` elements](https://w3c.github.io/html-aam/#table-element)
