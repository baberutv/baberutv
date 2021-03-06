import BabiliPlugin from 'babili-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlPluign from 'html-webpack-plugin';
import path from 'path';
import PreloadPlugin from 'preload-webpack-plugin';
import EnvironmentPlugin from 'webpack/lib/EnvironmentPlugin';
import OccurrenceOrderPlugin from 'webpack/lib/optimize/OccurrenceOrderPlugin';
import merge from 'webpack-merge';
import SubResourceIntegrityPlugin from 'webpack-subresource-integrity';
import pkg from './package.json';

const babelrc = {
  env: {
    development: {
      plugins: [
        'transform-react-jsx-source',
      ],
    },
  },
  plugins: [
    'syntax-dynamic-import',
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-react-jsx',
  ],
  presets: [
    [
      'env',
      {
        debug: true,
        exclude: [
          'transform-regenerator',
        ],
        modules: false,
        targets: {
          browsers: pkg.browserslist,
        },
        useBuiltIns: true,
      },
    ],
  ],
};

const htmlTemplateOptions = {
  minify: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeOptionalTags: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
  },
  template: path.join(__dirname, 'src', 'templates', 'index.hbs'),
};

const clientConfig = {
  devServer: {
    host: '0.0.0.0',
    port: +(process.env.PORT || 8080),
  },
  devtool: 'source-map',
  entry: path.join(__dirname, 'src', 'client.jsx'),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: Object.assign({
            babelrc: false,
          }, babelrc),
        },
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader',
      },
    ],
  },
  output: {
    chunkFilename: 'chunk.[id].js?[chunkhash]',
    crossOriginLoading: 'anonymous',
    filename: '[name].js?[chunkhash]',
    path: path.join(__dirname, 'build', 'public'),
    publicPath: '/',
  },
  plugins: [
    new HtmlPluign({
      ...htmlTemplateOptions,
      title: process.env.BABERU_TV_SITE_NAME || `${pkg.name} (v${pkg.version})`,
    }),
    new HtmlPluign({
      ...htmlTemplateOptions,
      filename: 'player/index.html',
      title: `player - ${process.env.BABERU_TV_SITE_NAME || `${pkg.name} (v${pkg.version})`}`,
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
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
};

export default (env = process.env.NODE_ENV) => {
  process.env.NODE_ENV = env || 'development';
  switch (process.env.NODE_ENV) {
    case 'production':
      return merge(clientConfig, {
        output: {
          chunkFilename: 'chunk.[id].[chunkhash].js',
          crossOriginLoading: false,
          filename: '[name].[chunkhash].js',
        },
        plugins: [
          new PreloadPlugin(),
          new SubResourceIntegrityPlugin({
            enabled: false,
            hashFuncNames: ['sha512'],
          }),
          new OccurrenceOrderPlugin(),
          new BabiliPlugin({
            builtIns: false,
          }),
        ],
      });
    default:
      return clientConfig;
  }
};
