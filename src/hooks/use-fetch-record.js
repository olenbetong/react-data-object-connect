import useFetchData from "./use-fetch-data";

export default function useFetchRecord(dataObject, filter) {
  const { isLoading, data, refresh } = useFetchData(dataObject, filter);
  const record = data.length > 0 ? data[0] : {};

  return {
    record,
    refresh,
    isLoading
  };
}
