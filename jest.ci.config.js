const path = require("path");
const base = require("./jest.config");

module.exports = {
	...base,
	collectCoverage: true,
	coverageDirectory: path.resolve(__dirname, "./coverage"),
	coverageReporters: ["cobertura", "lcov", "text"],
	reporters: ["default", "jest-junit"]
};
