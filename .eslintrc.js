// see docs: https://eslint.org/docs/user-guide/configuring

module.exports = {
  ignorePatterns: ['node_modules'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: false,
  },
  plugins: ['@babel'],
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:sonarjs/recommended', 'plugin:prettier/recommended', 'plugin:jsdoc/recommended'],
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
  },
  globals: {},
};
