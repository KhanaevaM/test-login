const config = {
  cacheDirectory: "cache",
  collectCoverageFrom: [
    "**/*.js",
    "!**/eslint-plugin-control/**",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!webpack.config.js",
  ],
  moduleNameMapper: {
    "^.+\\.(scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  setupFiles: ["<rootDir>/src/test-utils.js"],
  modulePaths: ["<rootDir>/src"],
  testEnvironment: "jsdom",
};

module.exports = config;
