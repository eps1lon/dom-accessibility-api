---
"dom-accessibility-api": patch
---

Prefer input value when type is reset or submit.

Previously `<input type="submit" value="Submit values" />` would have a computed accessible name `"Submit"`.
But the `value` has priority for `reset` and `submit`.
`computeAccessibleName` now correctly returns `"Submit values"` for these elements.
