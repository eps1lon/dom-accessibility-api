/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires -- this is a CommonJS module */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
	numTestsKeptInMemory: 300,
	e2e: {
		specPattern: "cypress/integration/**/*.cy.js",
	},
});
