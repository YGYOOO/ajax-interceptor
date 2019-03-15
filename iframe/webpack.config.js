const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname)
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.tsx?$/,
      include: [
        path.resolve(__dirname, 'source'),
      ],
      use: [{
        loader: 'babel-loader'
      },{
        loader: 'ts-loader'
      }]
    }, {
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }]
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader?'
      }]
    }, {
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader?'
      }, {
        loader: 'less-loader?'
      }]
    }, {
      test: /\.svg?$/,
      use: [{
        loader: 'svg-loader',
      }]
    }]
  },
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 9001,
    host: 'localhost',
    hot: true,
  }
};