// see docs: https://eslint.org/docs/user-guide/configuring

// eslint-disable-next-line no-undef
module.exports = {
  ignorePatterns: ['node_modules'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  env: {
    node: true,
    jest: false,
  },
  plugins: [],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:node/recommended-module',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended',
  ],
  rules: {
    'import/extensions': ['error', 'ignorePackages'],
  },
  globals: {},
};
