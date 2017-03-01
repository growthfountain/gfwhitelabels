const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('webpack-uglify-js-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const entryFile = path.join(__dirname, './src/app.js');
const PORT_DEV_SERVER = 8080;

let config = function (env) {
  let returner = {
    entry: entryFile,
    resolve: {
      extensions: ['.js', '.pug', '.sass', '.scss'],
      modules: [path.join(__dirname, ''), path.join(__dirname, './src'), 'node_modules'],
      alias: {
        src: path.resolve(__dirname, 'src/'),
        components: path.resolve(__dirname, 'src/components/'),
      },
    },

    output: {
      // pathinfo: true,
      // devtoolLineToLine: true,
      filename: '[hash].[name].js',
      // sourceMapFilename: '[hash].[name].js.map',
      path: path.join(__dirname, 'dist'),
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify((env && env.release) ? 'production' : 'development'),
        },
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
          minifyCSS: true,
        },
      }),
      new HtmlWebpackPlugin({
        title: 'Backbone App',
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body', // Inject all scripts into the body
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Tether: 'tether',
        'window.Tether': 'tether',
        Backbone: 'backbone',
      }),
    ],
  };

  if (!env || !env.devserver) {
    returner.plugins.push(new ExtractTextPlugin('styles.css'));
    returner.module.rules.push({
      test: /\.css$/, use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        loader: 'css-loader',
      }),
    });
  }

  if (env) {
    if (env.devserver) {
      returner.module.rules.push({
        test: /\.css$/, loader: ['style-loader', 'css-loader'],
      });
      returner.output.publicPath = 'dist',
      returner.devtool = 'eval',
      returner.devServer = {
        contentBase: path.join(__dirname, 'dist'),
        port: PORT_DEV_SERVER,
        stats: {
          colors: true,
        },
        watch: true,
        // watchOptions: {
        //   aggregateTimeout: 300,
        //   poll: 1000,
        // },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        host: '0.0.0.0',
        hot: true,
      };
      returner.plugins.push(new webpack.NamedModulesPlugin());
    } else if (env.release) {
      returner.plugins.push(new CleanPlugin('www', {
        root: path.join(__dirname, '.'),
        dry: false,
        exclude: ['index.html'],
      }));
      returner.plugins.push(new UglifyJsPlugin({
          cacheFolder: path.resolve(__dirname, 'webpack/cached_uglify/'),
          debug: true,
          minimize: true,
          output: {
            comments: false,
          },
          compressor: {
            warnings: false,
          },
        }));
    }
  }

  return returner;
};

module.exports = config;
