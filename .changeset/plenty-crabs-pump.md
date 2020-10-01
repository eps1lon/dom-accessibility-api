---
"dom-accessibility-api": patch
---

Correctly determine accessible name when element contains a slot.

Previously, computing the accessible name would only examine child nodes. However, content placed in a slot is is an assigned node, not a child node. 

If you have a custom element `custom-button` with a slot:

```html
<button><slot></slot></button>

<!-- accname of inner <button> is 'Custom name' (previously '') -->
<custom-button>Custom name</custom-button>
```

If you have a custom element `custom-button-default` with default content in the slot:

```html
<button><slot>Default name</slot></button>

<!-- accname of inner <button> is 'Custom name' (previously 'Default name') -->
<custom-button-default>Custom name</custom-button-default>

<!-- accname of inner <button> is 'Default name' (previously 'Default name') -->
<custom-button-default></custom-button-default>
```

This is not currently defined in the accname spec but reflects current browser behavior. 
