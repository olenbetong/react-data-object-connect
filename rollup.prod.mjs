import rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

let baseName = 'data-object-connect';

async function build(input, output) {
	const bundle = await rollup.rollup(input);
	await bundle.write(output);
}

async function buildAll() {
	console.log('Building UMD...');
	const umdInput = {
		input: 'src/index.js',
		plugins: [
			babel(),
			minify()
		]
	};
	const umdOutput = {
		file: `dist/${baseName}.umd.min.js`,
		format: 'umd',
		name: 'dataObjectConnect'
	};

	await build(umdInput, umdOutput);

	console.log('Building ESM...');
	const esmInput = {
		input: 'src/index.js',
		plugins: [
			babel({
				presets: [
					["@babel/preset-env", {
						"targets": {
							"browsers": [
								"last 5 chrome versions",
								"last 5 firefox versions",
								"last 3 safari versions"
							]
						},
						"useBuiltIns": false
					}]
				]
			}),
			minify()
		]
	};
	const esmOutput = {
		file: `dist/${baseName}.esm.min.js`,
		format: 'esm',
		name: 'dataObjectConnect'
	};

	await build(esmInput, esmOutput);

	console.log('Done!');
}

buildAll();
