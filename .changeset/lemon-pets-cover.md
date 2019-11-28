---
"dom-accessibility-api": minor
---

Add option to mock window.getComputedStyle

This option has two use cases in mind:

1. fake the style and assume everything is visible.
   This increases performance (window.getComputedStyle) is expensive) by not distinguishing between various levels of visual impairments. If one can't see the name with a screen reader then neither will a sighted user
2. Wrap a cache provider around `window.getComputedStyle`. We don't implement any because the returned `CSSStyleDeclaration` is only live in a browser. `jsdom` does not implement live declarations.
