// jest.config.js
module.exports = {
	rootDir: "sources",
	testEnvironment: "jest-environment-jsdom-thirteen",
	testPathIgnorePatterns: [
		"/node_modules/",
		"/fixtures/",
		"/__tests__/helpers/",
		"__mocks__"
	],
	testURL: "http://localhost",
	verbose: true
};
