/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["<rootDir>/test/**/*.(spec|test).ts"],
  testEnvironment: "node",
  reporters: ["default"],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/coverage/",
    "<rootDir>/test/",
  ],
  collectCoverage: true,
  coverageThreshold: {},
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js"],
};
