import rollup from 'rollup';
import babel from 'rollup-plugin-babel';

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
			babel()
		]
	};
	const umdOutput = {
		file: `dist/${baseName}.umd.js`,
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
			})
		]
	};
	const esmOutput = {
		file: `dist/${baseName}.esm.js`,
		format: 'esm',
		name: 'dataObjectConnect'
	};

	await build(esmInput, esmOutput);

	console.log('Done!');
}

buildAll();
