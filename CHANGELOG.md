# dom-accessibility-api changelog

## 0.4.3

### Patch Changes

- [`b421d9e`](https://github.com/eps1lon/dom-accessibility-api/commit/b421d9e9709adf0f72e09cb5d7ea2a32ceefd8eb) [#168](https://github.com/eps1lon/dom-accessibility-api/pull/168) Thanks [@eps1lon](https://github.com/eps1lon)! - fix: Use relative paths in exports field

  Fixes a crash when using ES modules in Node.

## 0.4.2

### Minor Changes

- [`0897630`](https://github.com/eps1lon/dom-accessibility-api/commit/0897630862d608a9ca22e9799bb30b37e1032afa) [#155](https://github.com/eps1lon/dom-accessibility-api/pull/155) - Publish version using ES6 modules allongside current CommonJS modules

## 0.4.1

### Patch Changes

- [`63c119f`](https://github.com/eps1lon/dom-accessibility-api/commit/63c119f388d4e0f121320d75c4ec6fe334d8f370) [#147](https://github.com/eps1lon/dom-accessibility-api/pull/147) Thanks [@eps1lon](https://github.com/eps1lon)! - Deploy all 0.4.0 changes

## 0.4.0

### Minor Changes

- [`e80a1fb`](https://github.com/eps1lon/dom-accessibility-api/commit/e80a1fb32c136539a46007a64ef8c998855080a1) [#141](https://github.com/eps1lon/dom-accessibility-api/pull/141) Thanks [@eps1lon](https://github.com/eps1lon)! - Support ES5 environments

### Patch Changes

- [`bd41c2d`](https://github.com/eps1lon/dom-accessibility-api/commit/bd41c2d3dec9c27e178b65bbe226d3c7adef0678) [#143](https://github.com/eps1lon/dom-accessibility-api/pull/143) Thanks [@eps1lon](https://github.com/eps1lon)! - fix: support `<label for>` for `<select>` and `<textarea>`

## 0.3.0

### Minor Changes

- 7f1ada0: Internal polish

## 0.2.0

### Minor Changes

- eb86842: Add option to mock window.getComputedStyle

  This option has two use cases in mind:

  1. fake the style and assume everything is visible.
     This increases performance (window.getComputedStyle) is expensive) by not distinguishing between various levels of visual impairments. If one can't see the name with a screen reader then neither will a sighted user
  2. Wrap a cache provider around `window.getComputedStyle`. We don't implement any because the returned `CSSStyleDeclaration` is only live in a browser. `jsdom` does not implement live declarations.

### Bug Fixes

- Fix test name_heading-combobox ([#16](https://github.com/eps1lon/dom-accessibility-api/issues/16)) ([e969395](https://github.com/eps1lon/dom-accessibility-api/commit/e969395d8da637862993aeee0b86f379342d56f2))

### Features

- **name:** Consider prohibited naming ([#19](https://github.com/eps1lon/dom-accessibility-api/issues/19)) ([6692d6b](https://github.com/eps1lon/dom-accessibility-api/commit/6692d6bd86030da9b340b0895f623394b21e2656))
- Consider all cases of "name from content" ([#13](https://github.com/eps1lon/dom-accessibility-api/issues/13)) ([835cb76](https://github.com/eps1lon/dom-accessibility-api/commit/835cb76e7c1dd577af1fa891ad849385e58fcd56))
- Consider content from before and after pseudo elements ([#5](https://github.com/eps1lon/dom-accessibility-api/issues/5)) ([0987426](https://github.com/eps1lon/dom-accessibility-api/commit/0987426734cc7b980a8edf39435820a24ea2a162))
- Fork elementToRole from aria-query ([#7](https://github.com/eps1lon/dom-accessibility-api/issues/7)) ([fe4fab5](https://github.com/eps1lon/dom-accessibility-api/commit/fe4fab57786324705c4ac4434de8aabd3e7bbc09))
