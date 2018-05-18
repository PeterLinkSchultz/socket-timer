var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var uglify = new UglifyJsPlugin();
//var autoprefixer = new require('autoprefixer');
var extractLess = new ExtractTextPlugin({
    filename: "../style/[name].css",
    allChunks: true
    //disable: process.env.NODE_ENV === "development"
});
var extractCSS = new ExtractTextPlugin({
    filename: "../style/[name].css"
});
module.exports = {
    context: __dirname,
    devtool: "source-map",
    entry: "./src/admin.js",
    mode: "development",
    watch: false,
    output: {
        path: __dirname + "/dist/js",
        filename: "admin.js"
    },
    node: {
        fs: "empty"
    },
    module: {
        rules:[
            {
                test: /\.node$/,
                use: 'node-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ["es2015"]
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        "css-loader",
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: (loader) => [
                                    require('postcss-import'),
                                    require('autoprefixer')({
                                        //browsers: ['ie >= 8', 'last 4 version']
                                    })
                                ]
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        extractCSS
        //uglify
    ],
    devServer: {
        contentBase: __dirname + '/dist/',
        inline: false,
        port: 10000
    }
};