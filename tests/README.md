There are three different test suites

## jest

Tests are extracted from the WPT tests. They help debugging the function under test.
Their failure or passing is not necessarily an indication of the state of the package.

## wpt + jsdom

Runs the web-platform-tests of `accname` in `jsdom`.

## wpt + cypress

Runs the web-platform-tests of `accname` in `cypress`. This is an actual browser
test that should be considered first when talking about the state of this package

## wpt + karma

No idea how I would make this run. Ideally I can run the wpt test in every browser.