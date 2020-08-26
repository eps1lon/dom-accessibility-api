---
"dom-accessibility-api": patch
---

Fix various issues for input types `submit`, `reset` and `image`

Prefer input `value` when `type` is `reset` or `submit`:

```diff
<input type="submit" value="Submit values">
-// accessible name: "Submit"
+// accessible name: "Submit values"
<input type="reset" value="Reset form">
-// accessible name: "Reset"
+// accessible name: "Reset form"
```

For input `type` `image` consider `alt` attribute or fall back to `"Submit query"`.
