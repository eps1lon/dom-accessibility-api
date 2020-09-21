---
"dom-accessibility-api": patch
---

Treat presentational images with role="presentation".

`<img alt="" />` and `<img />` used to have no role.
[By spec](https://w3c.github.io/html-aam/#el-img-empty-alt) they should have `role="presentation"` instead.
