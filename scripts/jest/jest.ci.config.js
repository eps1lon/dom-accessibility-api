const base = require("./jest.config");

module.exports = {
	...base,
	collectCoverage: true,
	coverageReporters: ["cobertura"],
	reporters: ["default", "jest-junit"],
};
