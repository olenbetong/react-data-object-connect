
const common = require('./common');
const { moduleName, ...config } = common;

module.exports = {
  ...config,
	mode: 'test',
	targets: [
		{ source: `./dist/${moduleName}.umd.js`, target: `modules/umd/${moduleName}.min.js`, type: 'component-global' },
		{ source: `./dist/${moduleName}.esm.js`, target: `modules/esm/${moduleName}.min.js`, type: 'component-global' },
	],
}
