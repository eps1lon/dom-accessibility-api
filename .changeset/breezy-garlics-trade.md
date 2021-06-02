---
"dom-accessibility-api": patch
---

Consider `<label />` when computing the accessible name of `<output />`

Given

```html
<label for="outputid">Output Label</label> <output id="outputid"></output>
```

Previously the accessible name of the `<output />` would ignore the `<label />`.
However, an `<output />` is labelable and therefore the accessible name is now computed using `<label />` elements if they exists.
In this example the accessible name is `"Output Label"`.
