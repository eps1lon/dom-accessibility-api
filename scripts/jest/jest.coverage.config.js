const base = require("./jest.config");

module.exports = {
	...base,
	collectCoverage: true,
	// Needs to be defined or coverage from different projects won't be added
	// See https://github.com/facebook/jest/issues/4255#issuecomment-321939025
	collectCoverageFrom: ["**/*.ts"],
	coverageReporters: ["lcov", "text"],
};
