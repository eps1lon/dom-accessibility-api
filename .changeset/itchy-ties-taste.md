---
"dom-accessibility-api": patch
---

Allow computing name for inaccessible elements

This is mainly targetted at integration with `@testing-library/dom`.
But it can also be used as a general performance boost when used in a JSDOM environment.
The rationale is that most elements are part of the a11y tree.
In those cases computing a11y tree exclusion is wasted.
Since it's expensive, we can disable it.
The recommendation is to only ignore a11y tree inclusion locally and specifically
enable it for the tests where you do know that a11y tree inclusion will play a role.
