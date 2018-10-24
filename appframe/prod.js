const common = require('./common');
const { moduleName, ...config } = common;

module.exports = {
  ...config,
	mode: 'production',
	targets: [
		{ source: `./dist/${moduleName}.umd.min.js`, target: `modules/umd/${moduleName}.min.js`, type: 'component-global' },
		{ source: `./dist/${moduleName}.esm.min.js`, target: `modules/esm/${moduleName}.min.js`, type: 'component-global' },
	],
}
