---
"dom-accessibility-api": patch
---

Previously, the role of `<th>` is columnheader regardless to the scope value.
It now treat as `rowheader` or `columnheader` by the scope value of `<th>`.
