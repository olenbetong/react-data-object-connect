import { dataObjectConnect, properties } from "./data-object-connect";

export const connect = dataObjectConnect;
export function connecRow(dataObject) {
  return connect.dataObjectConnect(dataObject, true);
}

export const connectedProperties = properties;

export function dataObjectConnectfunction() {
  // eslint-disable-next-line no-console
  console.warn(
    "DEPRECATED: dataObjectConnect has been renamed to connect. The dataObjectConnect will be remove in the future."
  );
  return connect.dataObjectConnect.apply(this, arguments);
}

export {
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
} from "./data-object-hooks";

export { SimpleDataHandler } from "./data-handler";
