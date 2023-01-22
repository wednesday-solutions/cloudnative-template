// @rushstack/eslint-patch/modern-module-resolution
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'turbo',
    'prettier',
    '@ephys/eslint-config-typescript',
    '@ephys/eslint-config-typescript/node',
    '@ephys/eslint-config-typescript/commonjs',
  ],
  plugins: ['jsdoc', 'prettier'],
  rules: {
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'off',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/require-description-complete-sentence': 'off',
    'jsdoc/require-example': 'off',
    'jsdoc/require-hyphen-before-param-description': 'off',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/valid-types': 'error',
    'jsdoc/no-types': 'error',

    // enable this as an error, or keep disabled (not warning)
    'unicorn/no-unsafe-regex': 'off',

    // Enable this one if you want to prevent creating throwaway objects (perf)
    'unicorn/no-object-as-default-parameter': 'off',

    // Object.hasOwn, Array#at, String#replaceAll are available in node >= 16.
    'prefer-object-has-own': 'off',
    'unicorn/prefer-at': 'off',
    'unicorn/prefer-string-replace-all': 'off',
    'consistent-return': 'off',

    // Too opinionated
    'unicorn/prefer-set-has': 'off',
  },
  overrides: [{
    // Disable slow rules that are not important in tests (perf)
    files: ['packages/*/test/**/*'],
    rules: {
      // We will have stuff that can be imported from DevDeps in tests
      'import/no-extraneous-dependencies': 'off',

      // no need to check jsdoc in tests & docs
      'jsdoc/check-types': 'off',
      'jsdoc/valid-types': 'off',
      'jsdoc/newline-after-description': 'off',
      'jsdoc/check-tag-names': 'off',

      // it's fine if we're not very efficient in tests.
      'no-inner-declarations': 'off',
      'unicorn/no-unsafe-regex': 'off',
    },
  }, {
    files: ['**/tsconfig.json'],
    rules: {
      'json/*': ['error', { allowComments: true }],
    },
  }],
  settings: {
    jsdoc: {
      tagNamePreference: {
        augments: 'extends',
      },
      structuredTags: {
        typeParam: {
          type: false,
          required: ['name'],
        },
        category: {
          type: false,
          required: ['name'],
        },
        internal: {
          type: false,
        },
        hidden: {
          type: false,
        },
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: [
    'packages/*/types/**/*',
    '.typedoc-build',
  ],
  env: {
    node: true,
    es6: true,
    es2020: true,
  },
};
