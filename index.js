/* eslint-env node */
const connect = require("./dist/data-object-connect.esm.node");
const {
  useCurrentIndex,
  useCurrentRow,
  useSingleRecord,
  useData,
  useDataWithoutState,
  useDirty,
  useError,
  useLoading,
  useStatus,
  usePermissions
} = require("./dist/data-object-hooks.esm.node");

module.exports = {
  dataObjectConnect: connect.dataObjectConnect,
  useCurrentIndex,
  useCurrentRow,
  useSingleRecord,
  useData,
  useDataWithoutState,
  useDirty,
  useError,
  useLoading,
  useStatus,
  usePermissions,
  connectedProperties: connect.properties
};
