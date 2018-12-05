import rollup from 'rollup';
import minimist from 'minimist';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

const args = minimist(process.argv.slice(2));
const baseName = 'data-object-connect';

function babelPlugin(format) {
	if (format === 'esm') {
		return babel({
			presets: [
				['@babel/preset-env', {
					'targets': {
						'browsers': [
							'Chrome >= 67',
							'Firefox >= 60',
							'Safari >= 11',
							'Edge >= 16'
						]
					},
					'useBuiltIns': false
				}]
			]
		});
	}

	return babel();
}

async function build(format) {
	const fileExt = args.prod ? `${format}.min.js` : `${format}.js`;
	const plugins = [
		babelPlugin(format)
	];

	if (args.prod) {
		plugins.push(minify());
	}

	const inputOptions = {
		input: 'src/index.js',
		plugins
	}

	const outputOptions = {
		file: `dist/${baseName}.${fileExt}`,
		format,
		name: 'dataObjectConnect'
	}

	const bundle = await rollup.rollup(inputOptions);

	await bundle.write(outputOptions);
}

async function buildAll() {
	console.log('Building ESM build...');
	await build('esm');
	console.log('Building UMD build...');
	await build('umd');
}

buildAll();
