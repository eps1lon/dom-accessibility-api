---
"dom-accessibility-api": patch
---

Prefer button subtree over `title` attribute.

```diff
 const name = computeAccessibleName(<button title="from-title">from-content</button>);
-'from-title' === name
+'from-content' === name
```

`<button title="from-title">from-content</button>` would previously compute the accessible name "from-title".
This is correct in ACCNAME 1.2 but is changed in the latest editors draft.
The latest editors draft specifically refers to HTML-AAM which says that the subtree should take precedent over the `title` attribute.
`computeAccessibleName` now calculates "from-content" as the accessible name.
