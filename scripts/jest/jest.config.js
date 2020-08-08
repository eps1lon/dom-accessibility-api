const path = require("path");

module.exports = {
	projects: [
		path.resolve(__dirname, "./jest.mock-edge14.config.js"),
		path.resolve(__dirname, "./jest.mock-ie11.config.js"),
		path.resolve(__dirname, "./jest.jsdom.config.js"),
	],
};
