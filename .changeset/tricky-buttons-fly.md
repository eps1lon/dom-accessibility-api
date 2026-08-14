---
"dom-accessibility-api": patch
---

Fix name-from-content computation for `treeitem` and `menuitem` roles to exclude descendant `group` (for `treeitem`) and `menu` (for `menuitem`) content, per https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#naming_with_child_content. Previously, an expanded `treeitem`'s accessible name incorrectly included the labels of its nested children.
