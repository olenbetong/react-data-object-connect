/* eslint-env node */
const minimist = require('minimist');
const { appframe } = require('./package.json');

/* Rollup & plugins */
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const minify = require('rollup-plugin-babel-minify');

const args = minimist(process.argv.slice(2));

function babelPlugin(format) {
	if (format === 'esm') {
		return babel({
			presets: [
				['@babel/preset-env', {
					'targets': {
						'browsers': [
							'last 5 Chrome versions',
							'last 5 Firefox versions',
							'last 3 Safari versions',
							'last 3 Edge versions'
						]
					},
					'useBuiltIns': false
				}]
			]
		});
	}

	return babel();
}

async function build(fileName, libraryName, format) {
	const fileExt = args.prod ? `${format}.min.js` : `${format}.js`;
	const plugins = [
		babelPlugin(format)
	];

	if (args.prod) {
		plugins.push(minify());
	}

	const inputOptions = {
		input: `src/${fileName}.js`,
		plugins
	};

	const outputOptions = {
		file: `dist/${fileName}.${fileExt}`,
		format,
		name: libraryName
	};

	const bundle = await rollup.rollup(inputOptions);

	await bundle.write(outputOptions);
}

async function buildVersions(config) {
	console.log('Building ESM build...');
	await build(config.fileName, config.libraryName, 'esm');
	console.log('Building UMD build...');
	await build(config.fileName, config.libraryName,'umd');
}

async function buildAll() {
	if (appframe instanceof Array) {
		for (let config of appframe) {
			await buildVersions(config);
		}
	} else {
		buildVersions(appframe);
	}
}

buildAll();
