module.exports = {
  ...require('../../jest.config'),
  rootDir: '.',
  moduleNameMapper: {
    '@src(.*)$': '<rootDir>/src/$1',
    '@types(.*)$': '<rootDir>/src/types/$1',
  },
  collectCoverageFrom: [
    // Check only in src
    'src/**/*.{js,ts}',

    // Files that do not require testing or cannot be tested
    '!src/index.ts',
  ],
  setupFilesAfterEnv: ['./jest-setup.ts'],
};
