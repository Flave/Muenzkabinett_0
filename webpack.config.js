var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname + "/app",
  entry: {
    app: "./main.js",
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ["src/components", "node_modules"]
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        loader: "babel-loader",
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.eot$|\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.txt$/,
        // assets for production need to be in bms-01/assets folder. This could be part of config.js but
        // works fine if it is always like that
        loader: "file?name=bms-01/assets/[hash]-[name].[ext]"
      },
      {
        test: /\.txt$/,
        // works fine if it is always like that
        loader: "file?emitFile=false&name=[name].[ext]"
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  // context: path.join(__dirname, 'build'),
  plugins: [
    new webpack.EnvironmentPlugin('NODE_ENV')
  ]
};