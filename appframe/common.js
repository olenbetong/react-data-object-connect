const dotenv = require('dotenv');
const moduleName = 'data-object-connect';

dotenv.load();

const {
	APPFRAME_LOGIN: user,
	APPFRAME_PWD: password,
	APPFRAME_HOSTNAME: hostname
} = process.env;

module.exports = {
  hostname,
  moduleName,
	user,
	password
}
