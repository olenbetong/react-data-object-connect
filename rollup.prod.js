import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify-es';

let baseName = 'data-object-connect';

export default {
	input: 'src/index.js',
	output: [
		{
			file: `dist/${baseName}.umd.min.js`,
			format: 'umd',
			name: 'dataObjectConnect'
		},
		{
			file: `dist/${baseName}.esm.min.js`,
			format: 'esm'
		}
	],
	plugins: [
		babel(),
		uglify()
	]
}
