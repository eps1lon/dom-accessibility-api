---
"dom-accessibility-api": minor
---

Cache `window.getComputedStyle` results

Should improve performance in environments that don't cache these results natively e.g. JSDOM.
This increases memory usage.
If this results in adverse effects (e.g. resource constrained browser environments), please file an issue.
