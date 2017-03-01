const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const PORT_DEV_SERVER = 8080;

module.exports = {
  entry: path.resolve(__dirname, 'src/app.js'),
  resolve: {
    extensions: ['.js', '.pug', '.sass', '.scss'],
    modules: [path.join(__dirname, ''), path.join(__dirname, './src'), 'node_modules'],
    alias: {
      src: path.resolve(__dirname, 'src/'),
      components: path.resolve(__dirname, 'src/components/'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    pathinfo: true,
    publicPath: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[hash].[name].js.map',
    filename: 'bundle.js',
  },
  devtool: 'eval',
  watch: true,
  profile: true,
  devServer: {
    clientLogLevel: 'warning',
    contentBase: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    // hot: true,
    // inline: false,//CLI only option
    // host: '0.0.0.0',
    port: PORT_DEV_SERVER,
    stats: {
      colors: true,
      errors: true,
      reasons: true,
      timings: true,
      warnings: true,
    },
    publicPath: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      //{test: /\.js$/, loader: 'source-map-loader', enforce: 'pre'},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
