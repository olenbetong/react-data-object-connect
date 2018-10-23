import babel from 'rollup-plugin-babel';

let baseName = 'data-object-connect';

export default {
	input: 'src/index.js',
	output: [
		{
			file: `dist/${baseName}.umd.js`,
			format: 'umd',
			name: 'dataObjectConnect'
		},
		{
			file: `dist/${baseName}.esm.js`,
			format: 'esm'
		}
	],
	plugins: [
		babel()
	]
}
