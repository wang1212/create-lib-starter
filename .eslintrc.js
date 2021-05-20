// see docs: https://eslint.org/docs/user-guide/configuring

module.exports = {
	ignorePatterns: ['src/vendors/**/*'],
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
	plugins: ['@babel', 'prettier'],
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	rules: {
		'no-console': [
			'error',
			{
				allow: ['warn', 'error'],
			},
		],
		'padding-line-between-statements': [
			'error',
			{ blankLine: 'always', prev: '*', next: 'return' },
			{ blankLine: 'always', prev: 'return', next: '*' },
			//
			{ blankLine: 'always', prev: '*', next: 'directive' },
			{ blankLine: 'always', prev: 'directive', next: '*' },
			{ blankLine: 'any', prev: 'directive', next: 'directive' },
			//
			{ blankLine: 'always', prev: 'import', next: '*' },
			{ blankLine: 'never', prev: 'import', next: 'import' },
			//
			{ blankLine: 'always', prev: '*', next: 'export' },
			{ blankLine: 'always', prev: 'export', next: '*' },
			{ blankLine: 'any', prev: 'export', next: 'export' },
			//
			{ blankLine: 'always', prev: '*', next: 'function' },
			{ blankLine: 'always', prev: 'function', next: '*' },
			//
			{ blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
			{ blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
			{ blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
			//
			{ blankLine: 'always', prev: ['case', 'default'], next: '*' },
			//
			{ blankLine: 'always', prev: '*', next: ['block', 'block-like'] },
			{ blankLine: 'always', prev: ['block', 'block-like'], next: '*' },
		],
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'windows'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
	},
	globals: {},
}
