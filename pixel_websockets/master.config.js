const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './master/src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist_master',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  plugins: [
    new CleanWebpackPlugin(['dist_master']),
    new HtmlWebpackPlugin({
      template: 'master/public/index.html',
    }),
  ],
  output: {
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(__dirname, 'dist_master'),
  },
};
