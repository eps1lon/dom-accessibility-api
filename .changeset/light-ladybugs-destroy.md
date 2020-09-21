---
"dom-accessibility-api": patch
---

Maintain `img` role for `img` with missing `alt` attribute.

Previously `<img />` would be treated the same as `<img alt />`.
`<img />` is now treated as `role="img"` [as specified](https://w3c.github.io/html-aam/#el-img-empty-alt).
