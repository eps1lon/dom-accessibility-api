---
"dom-accessibility-api": patch
---

Reduce over-transpilation

Switched from

- `for-of` to `.forEach` or a basic `for` loop
- `array.push(...otherArray)` to `push.apply(array, otherArray)`

This removed a bunch of babel junk that wasn't needed.
