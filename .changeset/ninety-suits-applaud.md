---
"dom-accessibility-api": patch
---

Ensure certain babel helpers aren't required

Source:

```diff
-const [item] = list;
+const item = list[0];
```

Transpiled:

```diff
-var _trim$split = list.trim().split(" "),
-_trim$split2 = _slicedToArray(_trim$split, 1),
-item = _trim$split2[0]
+var item = list[0];
```
