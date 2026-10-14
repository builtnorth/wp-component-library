/**
 * ESLint config: @wordpress/scripts' defaults, minus the rules that only
 * report layout or docblocks. Formatting is the editor's job (the code keeps
 * its own layout); correctness, hooks, a11y and import rules all stay on.
 */
const wpScriptsConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

// Packages WordPress loads as scripts (wp.*), so they aren't package dependencies.
// Bundled ones such as @wordpress/icons are not here and must be declared.
const WORDPRESS_RUNTIME_PACKAGES = [
	'a11y',
	'api-fetch',
	'block-editor',
	'blocks',
	'components',
	'compose',
	'core-data',
	'data',
	'date',
	'dom',
	'dom-ready',
	'edit-post',
	'edit-site',
	'editor',
	'element',
	'escape-html',
	'hooks',
	'html-entities',
	'i18n',
	'interactivity',
	'interactivity-router',
	'keycodes',
	'media-utils',
	'notices',
	'plugins',
	'primitives',
	'rich-text',
	'server-side-render',
	'url',
	'viewport',
].map( ( name ) => `@wordpress/${ name }` );

const ruleNames = new Set(
	wpScriptsConfig.flatMap( ( config ) => Object.keys( config.rules || {} ) )
);
const off = Object.fromEntries(
	[ ...ruleNames ]
		.filter( ( rule ) => rule === 'prettier/prettier' || rule.startsWith( 'jsdoc/' ) )
		.map( ( rule ) => [ rule, 'off' ] )
);

module.exports = [
	...wpScriptsConfig,
	{
		settings: {
			'import/core-modules': WORDPRESS_RUNTIME_PACKAGES,
		},
		rules: {
			...off,
			// `== null` / `!= null` is the code's null-or-undefined check.
			eqeqeq: [ 'error', 'always', { null: 'ignore' } ],
			// Experimental components such as ToolsPanel are used on purpose.
			'@wordpress/no-unsafe-wp-apis': 'off',
		},
	},
];
