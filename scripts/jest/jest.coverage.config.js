const path = require("path");
const base = require("./jest.config");

module.exports = {
	...base,
	collectCoverage: true,
	coverageReporters: ["lcov", "text"],
};
