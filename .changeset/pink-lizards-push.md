---
"dom-accessibility-api": patch
---

Consider <legend> for the name of its <fieldset> element.

```html
<fieldset>
	<legend><em>my</em> fieldset</legend>
</fieldset>
```

Computing the name for this fieldset would've returned an emptry string previously. It now correctly computes `my fieldset` following the [accessible name computation for `fieldset` elements](https://w3c.github.io/html-aam/#fieldset-and-legend-elements)
