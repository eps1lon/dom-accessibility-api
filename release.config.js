const path = require("path");

const changelogPath = path.resolve("./CHANGELOG.md");

module.exports = {
	plugins: [
		require.resolve("@semantic-release/commit-analyzer"),
		require.resolve("@semantic-release/release-notes-generator"),
		[
			require.resolve("@semantic-release/changelog"),
			{
				changelogFile: changelogPath
			}
		],
		require.resolve("@semantic-release/npm"),
		[
			require.resolve("@semantic-release/git"),
			{
				assets: [changelogPath]
			}
		]
	]
};
