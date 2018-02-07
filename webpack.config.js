// webpack.config.js
var webpack = require("webpack"),
	path = require("path");

module.exports = {
    // 入口文件
    /* 开发
    entry: ["webpack-dev-server/client?http://localhost:8080/", './src/index.jsx'],
     */
    entry: './src/index.jsx',
    //devtool: 'source-map',　　// 调试时定位到编译前的代码位置，推荐安装react插件
    output: {
        path: path.resolve(__dirname, "./build"),
        /* 静态目录，可以直接从这里取文件 */
        /* 打包时注释掉
        publicPath: '/build/',
         */
        filename: 'bundle.js' // 打包输出的文件
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // test 去判断是否为.js或.jsx,是的话就是进行es6和jsx的编译
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader?outputStyle=expanded'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                use: [
                    'json-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|woff|woff2|eot|ttf)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    resolve: {
        // 现在你import文件的时候可以直接使用import Func from './file'，不用再使用import Func from './file.js'
        extensions: ['.js', '.jsx', '.json']
    }
};