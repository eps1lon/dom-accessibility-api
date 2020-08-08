const base = require("./jest.base.config");

module.exports = {
	...base,
	displayName: "mock-edge14",
	testEnvironment: require.resolve("./jest-environment-jsdom-mock-edge14"),
};
