---
"dom-accessibility-api": patch
---

Ignore `title` attribute if it is empty.

Previously `<button title="">Hello, Dave!</button>` would wrongly compute an empty name.
