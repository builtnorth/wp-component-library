const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        index: path.resolve(process.cwd(), 'src', 'index.js'),
        style: path.resolve(process.cwd(), 'src', 'styles', 'index.scss'),
    },
    output: {
        ...defaultConfig.output,
        library: {
            name: '@builtnorth/wp-component-library',
            type: 'umd',
        },
    },
    module: {
        ...defaultConfig.module,
        rules: defaultConfig.module.rules.map((rule) => {
            // Modify CSS/SCSS rules to extract styles
            if (rule.test && (rule.test.toString().includes('css') || rule.test.toString().includes('scss'))) {
                return {
                    ...rule,
                    use: [
                        MiniCssExtractPlugin.loader,
                        ...rule.use.slice(1), // Remove style-loader, keep the rest
                    ],
                };
            }
            return rule;
        }),
    },
    plugins: [
        ...defaultConfig.plugins.filter(
            (plugin) => !(plugin instanceof MiniCssExtractPlugin)
        ),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    optimization: {
        ...defaultConfig.optimization,
        splitChunks: false, // Disable splitChunks for library builds
    },
    externals: {
        ...defaultConfig.externals,
        react: 'React',
        'react-dom': 'ReactDOM',
        '@wordpress/components': 'wp.components',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/data': 'wp.data',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/icons': 'wp.icons',
        '@wordpress/element': 'wp.element',
    },
};