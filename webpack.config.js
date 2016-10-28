const HtmlWebpackPluign = require('html-webpack-plugin');
const path = require('path');
const pkg = require('./package.json');

module.exports = {
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
    new HtmlWebpackPluign({
      title: `${pkg.name} (v${pkg.version})`,
    }),
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
};
