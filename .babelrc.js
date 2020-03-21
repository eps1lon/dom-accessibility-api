module.exports = {
	presets: [
		[require.resolve("@babel/preset-env"), { modules: false }],
		require.resolve("@babel/preset-typescript")
	],
	env: {
		cjs: {
			plugins: [
				[
					require.resolve("@babel/plugin-transform-modules-commonjs"),
					// helps rollup identify exports
					{ loose: true, strict: true }
				]
			]
		}
	}
};
