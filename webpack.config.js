const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
    entry: {
        app: './src/client/index/index.js',
        chat: './src/client/chat/index.js'
    },
    output: {
        filename: '[name].bundle.[hash].js',
        path: path.resolve(__dirname, 'dist/public')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src/client/page/index.html'),
            chunks: ['app']
        }),
        new HtmlWebpackPlugin({
            filename: 'chat.html',
            template: path.resolve(__dirname, 'src/client/page/chat.html'),
            chunks: ['chat']
        }),
        new CleanWebpackPlugin()
    ]
};
