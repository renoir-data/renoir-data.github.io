const path = require('path');

module.exports = {
  entry: [path.resolve('assets', 'js', 'animations.js')],
  output: {
    path: path.resolve('static', 'assets'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};