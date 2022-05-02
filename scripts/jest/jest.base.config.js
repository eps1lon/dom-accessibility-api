const path = require("path");

module.exports = {
	coverageDirectory: path.resolve(__dirname, "../../coverage"),
	rootDir: path.resolve(__dirname, "../../sources"),
	setupFilesAfterEnv: [require.resolve("./jest.setup")],
	testEnvironment: "jsdom",
	testEnvironmentOptions: {
		url: "http://localhost",
	},
	testPathIgnorePatterns: [
		"/node_modules/",
		"/fixtures/",
		"/__tests__/helpers/",
		"__mocks__",
	],
};
