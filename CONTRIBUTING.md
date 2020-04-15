## setup

```bash
$ nvm use # or use the node version specified in .nvmrc
$ yarn
$ wpt:init
$ yarn build
```

## tests

To run web-platform-test make sure you've followed https://web-platform-tests.org/running-tests/from-local-system.html#system-setup

```bash
$ yarn test
$ yarn test:wpt:jsdom
$ yarn test:wpt:browser
```

To learn more about the test architecture see [tests/README.md]
