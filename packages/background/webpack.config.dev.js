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
    filename: 'background.js',
    path: path.resolve(__dirname, 'build'),
    pathinfo: true,
  },
  optimization: {
    minimize: false
  },
  mode: 'development',
  devtool: 'inline-source-map'
};