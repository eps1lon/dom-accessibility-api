---
"dom-accessibility-api": patch
---

Prefer button subtree over `title` attribute.

```diff
 const name = computeAccessibleName(<button title="foo">bar</button>);
-'foo' === name
+'bar' === name
```

`<button title="foo">bar</button>` would previously compute the accessible name "foo".
This is correct in ACCNAME 1.2 but is changed in the latest editors draft.
The latest editors draft specifically refers to HTML-AAM which says that the subtree should take precedent over the `title` attribute.
`computeAccessibleName` now calculates "bar" as the accessible name.
