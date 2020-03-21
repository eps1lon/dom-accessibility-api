module.exports = {
	presets: [
		[
			require.resolve("@babel/preset-env"),
			// for jest we need to transpile esmodules
			// otherwise transform-commonjs takes care of the correct module syntax
			{ modules: process.env.NODE_ENV === "test" ? "auto" : false }
		],
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
