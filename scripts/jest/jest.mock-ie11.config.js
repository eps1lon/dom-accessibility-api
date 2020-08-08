const base = require("./jest.base.config");

module.exports = {
	...base,
	displayName: "mock-ie11",
	testEnvironment: require.resolve("./jest-environment-jsdom-mock-ie11"),
};
