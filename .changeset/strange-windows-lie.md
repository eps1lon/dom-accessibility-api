---
"dom-accessibility-api": patch
---

Implement accessbile description computation

```ts
import { computeAccessibleDescription } from "dom-accessibility-api";

const description = computeAccessibleDescription(element);
```

Warning: It always considers `title` attributes if the description is empty.
Even if the `title` attribute was already used for the accessible name.
This is fails a web-platform-test.
The other failing test is due to `aria-label` being ignored for the description which is correct by spec.
It's likely an issue with wpt.
The other tests are passing (13/15).
