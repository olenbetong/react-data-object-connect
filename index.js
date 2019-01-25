/* eslint-env node */
const connect = require("./dist/data-object-connect.esm.node");

module.exports = {
  dataObjectConnect: connect.dataObjectConnect,
  dataObjectHooks: require("./dist/data-object-hooks.esm.node"),
  connectedProperties: connect.properties
};
