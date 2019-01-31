/* eslint-env node */
const connect = require("./dist/data-object-connect.esm.node");
const {
  getData,
  useCurrentIndex,
  useCurrentRow,
  useData,
  useDataWithoutState,
  useDirty,
  useError,
  useFetchData,
  useFetchRecord,
  useLoading,
  usePermissions,
  useSingleRecord,
  useStatus
} = require("./dist/data-object-hooks.esm.node");

module.exports = {
  connect: connect.dataObjectConnect,
  connectRow: function(dataObject) {
    return connect.dataObjectConnect(dataObject, true);
  },
  dataObjectConnect: function() {
    // eslint-disable-next-line no-console
    console.warn(
      "DEPRECATED: dataObjectConnect has been renamed to connect. The dataObjectConnect will be remove in the future."
    );
    return connect.dataObjectConnect.apply(this, arguments);
  },
  getData,
  useCurrentIndex,
  useCurrentRow,
  useData,
  useDataWithoutState,
  useDirty,
  useFetchData,
  useFetchRecord,
  useError,
  useLoading,
  usePermissions,
  useSingleRecord,
  useStatus,
  connectedProperties: connect.properties
};
