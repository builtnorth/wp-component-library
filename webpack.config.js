/**
 * Build configuration for wp-component-library
 *
 * Transpiles source code to production-ready JavaScript
 * that doesn't require consumer transpilation.
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const { filesystemCache, sharedWatchOptions } = require('../../webpack.shared.config');

module.exports = {
	...defaultConfig,
	cache: filesystemCache(__dirname),
	watchOptions: sharedWatchOptions(defaultConfig.watchOptions),
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

			// Emotion is provided by the consuming plugin as a single shared
			// instance on window.builtnorthEmotion, so map to that global rather
			// than a bare package name — nothing registers window['@emotion/react'].
			const emotionGlobals = {
				'@emotion/react': ['builtnorthEmotion', 'react'],
				'@emotion/styled': ['builtnorthEmotion', 'styled'],
			};

			if (emotionGlobals[request]) {
				return callback(null, {
					commonjs: request,
					commonjs2: request,
					amd: request,
					root: emotionGlobals[request],
				});
			}

			// @dnd-kit was externalized to bare global names that nothing ever
			// registers, so the UMD build threw on load in a browser and could
			// only ever be consumed by another bundler. Bundle it instead: it is
			// used by five components and tree-shakes to what they need.
			callback();
		},
	],
};
