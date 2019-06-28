const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const Fiber = require('fibers');
const dartSass = require('sass');
const localIP = require('my-local-ip');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isProd = argv.mode === 'production';
  const localBuild = process.env.LOCAL_BUILD;
  let hostname;
  let port;
  switch (localBuild) {
    case 'prod':
      hostname = process.env.SERVER_HOSTNAME || 'bepartoftheshow.de';
      port = process.env.SERVER_PORT || '';
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
    entry: ['./src/index.js'],
    devtool: isDev ? 'source-map' : false,
    devServer: {
      contentBase: './dist',
      port: 8082,
      quiet: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
        {
          test: /\.sass$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'resolve-url-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: dartSass,
                fiber: Fiber,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'resolve-url-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          exclude: /node_modules/,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [
      new FriendlyErrorsPlugin(),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
      }),
      new FaviconsWebpackPlugin(`${__dirname}/public/favicon.png`),
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
      new webpack.DefinePlugin({
        HOSTNAME: JSON.stringify(hostname),
        PORT: JSON.stringify(port),
      }),
      ...(isDev ? [new webpack.HotModuleReplacementPlugin()] : []),
      new BundleAnalyzerPlugin({
        analyzerMode: isDev ? 'server' : 'static',
        analyzerPort: 8083,
        openAnalyzer: false,
        reportFilename: '../../reports/master.html',
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
          sourceMap: false,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: false,
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
      path: path.resolve(__dirname, '../dist/static/master'),
    },
  };
};
