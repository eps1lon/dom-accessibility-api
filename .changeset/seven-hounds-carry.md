---
"dom-accessibility-api": patch
---

Compute name from author for `menu` role.

Previously we wouldn't compute any name for `menu` to pass some web-platform-tests that covered an exotic use case.
Now we correctly respect name from author (e.g. `aria-label` or `aria-labelledby`).
