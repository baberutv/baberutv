const BabiliPlugin = require('babili-webpack-plugin');
const HtmlPluign = require('html-webpack-plugin');
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const pkg = require('./package.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
  entry: path.join(__dirname, 'src', 'client.jsx'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.jsx?$/,
      },
      {
        loaders: [
          'isomorphic-style',
          'css',
        ],
        test: /\.css$/,
      },
    ],
  },
  output: {
    filename: '[name].js?[chunkhash]',
    path: path.join(__dirname, 'build', 'public'),
    publicPath: '/',
  },
  plugins: [
    new HtmlPluign({
      title: process.env.BABERU_TV_SITE_NAME || `${pkg.name} (v${pkg.version})`,
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    }),
    ...(process.env.NODE_ENV !== 'development' ? [
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
