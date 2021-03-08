import { DataObject } from "@olenbetong/data-object";
import useFetchData from "./useFetchData";

export default function useFetchRecord<T>(dataObject: DataObject<T>, filter) {
  const { isLoading, data, refresh } = useFetchData(dataObject, filter);
  const record = data.length > 0 ? data[0] : {};

  return {
    record,
    refresh,
    isLoading,
  };
}
