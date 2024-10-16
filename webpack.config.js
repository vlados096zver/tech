const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Импортируем CopyWebpackPlugin

const devServer = (isDev) => !isDev ? {} : {
    devServer: {
        open: true,
        hot: true,
        port: 8080,
    }
};

module.exports = ({ develop }) => ({
    mode: develop ? 'development' : 'production',
    entry: {
        index: './src/index.js',
        i18n: './src/assets/js/i18n.js',
        main: './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',  // Ensure scripts are injected into the body
        }),
        new MiniCssExtractPlugin({
            filename: './styles/main.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/assets/i18n', to: './assets/i18n' }, // Копируем папку с файлами локализации
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(?:ico|png|jpg|jpeg|svg)$/i,
                type: 'asset/inline',
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i, // This rule will handle regular CSS files
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader',
                ],
            },
            {
                test: /\.scss$/i, // This rule will handle SCSS files
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
                ],
            },
        ],
    },
    ...devServer(develop),
});
