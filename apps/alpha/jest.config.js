module.exports = {
  ...require('../../jest.config'),
  rootDir: '.',
  moduleNameMapper: {
    '@src(.*)$': '<rootDir>/src/$1',
    '@types(.*)$': '<rootDir>/src/types/$1',
  },
};
