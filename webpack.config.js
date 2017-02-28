const path = require('path'),
    fs = require('fs'),
    
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    UglifyJsPlugin = require('webpack-uglify-js-plugin'),
    CleanPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    
    entryFile = path.join(__dirname, './src/app.js'),
    devServerPort = 8080

let config = function (env) {
    let returner = {
        entry: entryFile,
        
        resolve: {
            extensions: ['.js', '.pug', '.sass', '.scss'],
            modules: [path.join(__dirname, ''), path.join(__dirname, './src'), 'node_modules'],
            alias: {
                'src': path.resolve(__dirname, 'src/'),
                'components': path.resolve(__dirname, 'src/components/')
            }
        },
        
        output: {
            pathinfo: true,
            devtoolLineToLine: true,
            filename: '[hash].[name].js',
            sourceMapFilename: "[hash].[name].js.map",
            path: path.join(__dirname, 'dist')
        },
        
        module: {
            rules: [
                {test: /\.pug$/, loader: 'pug-loader'},
                //{test: /\.js$/, loader: 'source-map-loader', enforce: 'pre'},
                {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: {presets: ['es2015']}},
                {test: /\.(png|jpe?g|gif)$/, loader: 'file-loader', options: {name: '[name].[ext]?[hash]'}},
                {test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, loader: 'file-loader', options: {name: '[name].[ext]?[hash]'}},
                {test: /\.svg$/, loader: 'url-loader'},
                {test: /\.s[ca]ss$/, loader: ['style-loader', 'css-loader', 'sass-loader']},
            ]
        },
        
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify((env && typeof env != "undefined" && env.release) ? 'production' : 'development')
                }
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/index.html',
                inject: true,
                minify: {
                    removeComments: true,
                    removeScriptTypeAttributes: true,
                    removeAttributeQuotes: true,
                    useShortDoctype: true,
                    decodeEntities: true,
                    collapseWhitespace: true,
                    minifyCSS: true
                }
            }),
            new HtmlWebpackPlugin({
                title: 'Backbone App',
                template: './src/index.html',
                filename: 'index.html',
                inject: 'body' // Inject all scripts into the body
        }),
            new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether",
            "window.Tether": "tether",
            Backbone: "backbone"
        })
        ]
    }
    
    if (typeof env == "undefined" || typeof env.devserver == "undefined") {
        returner.plugins.push(new ExtractTextPlugin("styles.css"))
        returner.module.rules.push({
            test: /\.css$/, use: ExtractTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader: "css-loader"
            })
        })
    }
    
    if (env) {
        if (typeof env.devserver != 'undefined' && env.devserver) {
            returner.module.rules.push({
                test: /\.css$/, loader: ['style-loader', 'css-loader']
            })
            returner.output.publicPath = "dist"
            returner.devtool = "eval"
            returner.devServer = {
                contentBase: path.join(__dirname, "dist"),
                port: devServerPort,
                stats: {colors: true},
                watchOptions: {
                    aggregateTimeout: 300,
                    poll: 1000
                },
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                host: "0.0.0.0"
            }
            returner.plugins.push(new webpack.NamedModulesPlugin())
        } else if (typeof env.release != 'undefined' && env.release) {
            returner.plugins.push(new CleanPlugin("www", {
                root: path.join(__dirname, "."),
                dry: false,
                exclude: ["index.html"]
            }))
            returner.plugins.push(new UglifyJsPlugin({
                    cacheFolder: path.resolve(__dirname, 'webpack/cached_uglify/'),
                    debug: true,
                    minimize: true,
                    output: {
                        comments: false
                    },
                    compressor: {
                        warnings: false
                    }
                }
            ))
        }
    }
    
    return returner
}

module.exports = config
