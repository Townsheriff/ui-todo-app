const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const graphqlUrl = process.env.GRAPHQL_URL || "http://localhost:5000/graphql";
const graphqlWs = process.env.GRAPHQL_WS || "wss://ws.todo-app.avtspace.com";

module.exports = {
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "@swc-node/loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    port: 5001,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.GRAPHQL_URL": JSON.stringify(graphqlUrl),
      "process.env.GRAPHQL_WS": JSON.stringify(graphqlWs),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".mjs"],
  },
  output: {
    filename: "bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
  },
};
