---
"dom-accessibility-api": patch
---

Resolve presentational role conflicts when global WAI-ARIA states or properties (ARIA attributes) are used.

`<img alt="" />` used to have no role.
[By spec](https://w3c.github.io/html-aam/#el-img-empty-alt) it should have `role="presentation"` with no ARIA attributes or `role="img"` [otherwise](https://rawgit.com/w3c/aria/stable/#conflict_resolution_presentation_none).
