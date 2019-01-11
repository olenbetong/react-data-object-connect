module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': ['eslint:recommended', 'plugin:react/recommended'],
	'parser': 'babel-eslint',
	'parserOptions': {
		'ecmaVersion': 2018,
		'ecmaFeatures': {
			'jsx': true
		},
		'sourceType': 'module'
	},
	'plugins': [
		'react'
	],
	'rules': {
		'react/prop-types': 'off',
		'no-console': 'off',
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': 'off',
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};