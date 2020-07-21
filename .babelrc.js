module.exports = {
	presets: [
		[
			require.resolve("@babel/preset-env"),
			// for jest we need to transpile esmodules
			// otherwise transform-commonjs takes care of the correct module syntax
			{ modules: process.env.NODE_ENV === "test" ? "auto" : false },
		],
		require.resolve("@babel/preset-typescript"),
	],
	plugins: [require.resolve("@babel/plugin-proposal-class-properties")],
	env: {
		cjs: {
			plugins: [
				[
					require.resolve("@babel/plugin-transform-modules-commonjs"),
					// helps rollup identify exports but also means __esmodule is enumerated
					// not aware of a use case for enumerating imports though
					{ loose: true },
				],
			],
		},
		esm: {
			plugins: [
				function rewriteRelativeImportsToMjs() {
					const extension = "mjs";
					/**
					 *
					 * @param {ImportDeclaration | ExportNamedDeclaration} declaration
					 */
					function rewriteRelativeImports(declaration) {
						if (declaration.source === null) {
							return;
						}

						const specifier = declaration.source.value;
						const isRelativeSpecifier = specifier.startsWith(".");
						if (isRelativeSpecifier) {
							declaration.source.value = `${specifier}.${extension}`;
						}
					}

					return {
						visitor: {
							ExportAllDeclaration(path, state) {
								rewriteRelativeImports(path.node);
							},
							ExportNamedDeclaration(path, state) {
								rewriteRelativeImports(path.node);
							},
							ImportDeclaration(path, state) {
								rewriteRelativeImports(path.node);
							},
						},
					};
				},
			],
		},
	},
};
