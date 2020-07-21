---
"dom-accessibility-api": patch
---

Add `isInaccessible` and `isSubtreeInaccessible`.

`isInaccessible` implements https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion.
`isSubtreeInaccessible` can be used to inject a memoized version of that function into `isInaccessible`.
