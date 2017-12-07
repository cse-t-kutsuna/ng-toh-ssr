const {join} = require('path');
const {ContextReplacementPlugin} = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  externals: [/(node_modules|main\..*\.js)/],
  output: {
    libraryTarget: "commonjs",
    path: join(__dirname, '..', 'dist', 'lambda'),
    filename: '[name].js'
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'awesome-typescript-loader' }]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: "dist/browserApp/**/*"},
      {from: "dist/serverApp/**/*"},
    ]),

    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for 'WARNING Critical dependency: the request of a dependency is an expression'
    new ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      join(__dirname, '..', 'src'), // location of your src
      {} // a map of your routes
    ),
    new ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      join(__dirname, '..', 'src'),
      {}
    )
  ]
};
