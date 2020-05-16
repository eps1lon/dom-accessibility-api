---
"dom-accessibility-api": patch
---

Don't consider elements referenced via `aria-owns` as child nodes.

`accname` does not mentioned "owned elements" in the algorithm. 
If you relied on this behavior please open an issue.
