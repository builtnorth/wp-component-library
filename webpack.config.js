/**
 * Build configuration for wp-component-library
 *
 * Transpiles source code to production-ready JavaScript
 * that doesn't require consumer transpilation.
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve(__dirname, 'index.js'),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'build'),
		library: {
			name: '@builtnorth/wp-component-library',
			type: 'umd',
		},
	},
	externals: [
		{
			'react': 'React',
			'react-dom': 'ReactDOM',
		},
		function({ request }, callback) {
			// WordPress dependencies
			if (request.startsWith('@wordpress/')) {
				const lib = request.replace('@wordpress/', '');
				const wp = lib.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
				return callback(null, {
					commonjs: request,
					commonjs2: request,
					amd: request,
					root: ['wp', wp],
				});
			}

			// Other external dependencies
			const externals = {
				'@emotion/styled': '@emotion/styled',
				'@emotion/react': '@emotion/react',
				'@dnd-kit/core': '@dnd-kit/core',
				'@dnd-kit/modifiers': '@dnd-kit/modifiers',
				'@dnd-kit/sortable': '@dnd-kit/sortable',
				'@dnd-kit/utilities': '@dnd-kit/utilities',
				'@dnd-kit/accessibility': '@dnd-kit/accessibility',
			};

			if (externals[request]) {
				return callback(null, {
					commonjs: request,
					commonjs2: request,
					amd: request,
					root: externals[request],
				});
			}

			callback();
		},
	],
};
