"use strict";
const fs = require("fs");

const EXPECTED_MANIFEST_VERSION = 6;

exports.getPossibleTestFilePaths = (manifest) => {
	const manualTests = manifest.items.manual;

	const allPaths = [];
	for (const containerPath of Object.keys(manualTests)) {
		const testFilePaths = manualTests[containerPath].map((value) => value[[0]]);
		for (const testFilePath of testFilePaths) {
			// Globally disable worker tests
			if (testFilePath.startsWith("accname")) {
				allPaths.push(testFilePath);
			}
		}
	}

	return allPaths;
};

exports.readManifest = (filename) => {
	const manifestString = fs.readFileSync(filename, { encoding: "utf-8" });
	const manifest = JSON.parse(manifestString);

	if (manifest.version !== EXPECTED_MANIFEST_VERSION) {
		throw new Error(
			`WPT manifest format mismatch; expected ${EXPECTED_MANIFEST_VERSION} but got ${manifest.version}`
		);
	}

	return manifest;
};
