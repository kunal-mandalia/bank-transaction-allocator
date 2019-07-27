const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'build'),
    pathinfo: true,
  },
  optimization: {
    minimize: true
  },
  mode: 'production'
};