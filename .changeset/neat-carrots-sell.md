---
"dom-accessibility-api": patch
---

fix: Concatenate text nodes without space

Fixes `<h1>Hello {name}!</h1>` in `react` computing `"Hello name !"` instead of `Hello name!`.
