const { resolve } = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = (_, options) => {
  return options.mode === "development" ? devConfig : buildConfig;
};

const devConfig = {
  target: "node",
  watch: resolve(__dirname, "src"),
  mode: "development",
  entry: "./src/server/standalone-server.ts",
  output: {
    libraryTarget: "commonjs",
    path: resolve(__dirname, "dist"),
    filename: "standalone-server.js",
    devtoolModuleFilenameTemplate: "[resource-path]?[loaders]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "@swc-node/loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new NodemonPlugin()],
  resolve: {
    extensions: [".ts", ".js"],
  },
};

const buildConfig = {
  target: "node",
  mode: "production",
  entry: {
    apolloHandler: "./src/lambdas/apollo-server-handler/handler.ts",
    messageHandler: "./src/lambdas/message-handler/handler.ts",
    streamHandler: "./src/lambdas/stream-handler/handler.ts",
  },
  output: {
    libraryTarget: "commonjs",
    path: resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "@swc-node/loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
