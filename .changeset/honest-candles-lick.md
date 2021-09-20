---
"dom-accessibility-api": patch
---

Previously, the accessible name of `<th>` is columnheader regardless to the scope value.
It now treat as `rowheader` or `columnheader` by the scope value of `<th>`.
