const fs = require("fs").promises;
const path = require("path");

/**
 * prints all by cypress testable wpt testfiles which (used to be) are used
 * in integration/test.js
 */

async function main() {
	const accnamePath = path.resolve(__dirname, "../wpt/accname");
	const files = await fs.readdir(accnamePath);
	const testnames = files
		.filter(filename => {
			return filename.endsWith(".html");
		})
		.map(filename => {
			return path.basename(filename, ".html");
		});

	console.log(JSON.stringify(testnames, null, 2));
}

main().catch(error => {
	console.error(error);
	process.exit();
});
