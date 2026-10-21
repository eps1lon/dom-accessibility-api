---
"dom-accessibility-api": patch
---

Separate inline text alternatives, such as `aria-label`, from adjacent text when computing the accessible name.

For example, `foo<span aria-label="bar"></span>` now has the accessible name "foo bar".
