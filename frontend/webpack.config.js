const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const localIP = require('my-local-ip');
const manifest = require('./public/manifest');

// Find the polyfill chunk
const polyfillRegex = /(\w|\W)*polyfill\.(\w|\W)*\.js/;

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isProd = argv.mode === 'production';
  const localBuild = process.env.LOCAL_BUILD;
  let hostname;
  let port;
  switch (localBuild) {
    case 'prod':
      hostname = 'bepartoftheshow.de';
      port = null;
      break;
    case 'build':
      hostname = localIP();
      port = '3000';
      break;
    case 'dev-server':
    default:
      hostname = 'localhost';
      port = '3000';
      break;
  }

  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      // Legacy polyfills are packaged in a seperate bundle because they are
      // only needed by legacy browsers. They will be loaded with a script tag
      // with the 'nomodule' attribute, so modern browsers won't download
      // the bundle
      polyfill: './polyfill/index.js',
      // Main bundle
      main: './src/index.js',
    },
    devtool: 'source-map',
    devServer: {
      contentBase: './dist',
      port: 8080,
      quiet: true,
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
      }, {
        test: /\.sass$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      }],
    },
    plugins: [
      new FriendlyErrorsPlugin(),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        minify: isProd
          ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          }
          : false,
      }),
      // Set 'nomodule' attribute on plyfill script tag,
      // so newer browsers, which do not need the legacy polyfills,
      // won't download the script
      new ScriptExtHtmlPlugin({
        custom: {
          test: polyfillRegex,
          attribute: 'nomodule',
        },
      }),
      // Generate manifest file
      new WebpackPwaManifest(manifest),
      // new FaviconsWebpackPlugin(path.resolve(__dirname, '/../logo.png'),
      new webpack.DefinePlugin({
        HOSTNAME: JSON.stringify(hostname),
        PORT: JSON.stringify(port),
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),
      new BrotliPlugin({
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
      }),
      new CompressionPlugin({
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
      }),
      ...(isDev ? [new webpack.HotModuleReplacementPlugin()] : []),
      new BundleAnalyzerPlugin({
        analyzerMode: isDev ? 'server' : 'static',
        analyzerPort: 8081,
        openAnalyzer: false,
        reportFilename: '../../reports/frontend.html',
      }),
    ],
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: true,
          },
        }),
      ],
    },
    output: {
      filename: isDev
        ? '[name].bundle.js'
        : '[name].[chunkhash].bundle.js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : '[name].[chunkhash].chunk.js',
      path: path.resolve(__dirname, '../dist/static/frontend'),
    },
  };
};
