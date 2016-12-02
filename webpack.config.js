const BabiliPlugin = require('babili-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPluign = require('html-webpack-plugin');
const path = require('path');
const EnvironmentPlugin = require('webpack/lib/EnvironmentPlugin');
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
const pkg = require('./package.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: +(process.env.PORT || 8080),
  },
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
  entry: path.join(__dirname, 'src', 'client.jsx'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.jsx?$/,
      },
      {
        loaders: [
          'isomorphic-style-loader',
          'css-loader',
        ],
        test: /\.css$/,
      },
      {
        loader: 'handlebars-loader',
        test: /\.hbs$/,
      },
    ],
  },
  output: {
    filename: process.env.NODE_ENV === 'development' ? '[name].js?[chunkhash]' : '[name].[chunkhash].js',
    path: path.join(__dirname, 'build', 'public'),
    publicPath: '/',
  },
  plugins: [
    new HtmlPluign({
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
      template: path.join(__dirname, 'src', 'templates', 'index.hbs'),
      title: process.env.BABERU_TV_SITE_NAME || `${pkg.name} (v${pkg.version})`,
    }),
    new EnvironmentPlugin([
      'NODE_ENV',
    ]),
    new CopyPlugin([
      {
        from: path.join(__dirname, 'src', 'assets', 'favicon.ico'),
        to: path.join(__dirname, 'build', 'public', 'favicon.ico'),
      },
      {
        from: path.join(__dirname, 'src', 'assets', '404.html'),
        to: path.join(__dirname, 'build', 'public', '404.html'),
      },
    ]),
    ...(process.env.NODE_ENV !== 'development' ? [
      new OccurrenceOrderPlugin(),
      new BabiliPlugin(),
    ] : []),
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
};
