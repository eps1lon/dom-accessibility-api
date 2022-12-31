---
"dom-accessibility-api": patch
---

Don't consider `title` in 2E

Effectively ensures that `title` will not have precedence over name from content.
For example, the `option` in `<option title="Title">Content</option>` will now have `"Content"` has its accessible name.
