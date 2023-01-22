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
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js"],
};
