const dotenv = require('dotenv');

dotenv.load();

const {
	APPFRAME_LOGIN: user,
	APPFRAME_PWD: password
} = process.env;

module.exports = {
	hostname: 'synergi.olenbetong.no',
	mode: 'test',
	user,
	password,
	targets: [
		{ source: './dist/data-object-connect.umd.js', target: 'modules/data-object-connect.umd.min.js', type: 'component-global' },
		{ source: './dist/data-object-connect.esm.js', target: 'modules/data-object-connect.esm.min.js', type: 'component-global' },
	],
}
