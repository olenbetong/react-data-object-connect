import { DataObject, Filter } from "@olenbetong/data-object";
import useFetchData from "./useFetchData";

type FetchRecordStatus<T> = {
  record: Partial<T>;
  refresh: () => void;
  isLoading: boolean;
};

export default function useFetchRecord<T>(
  dataObject: DataObject<T>,
  filter: false | string | Filter
): FetchRecordStatus<T> {
  const { isLoading, data, refresh } = useFetchData(dataObject, filter);
  const record = data.length > 0 ? data[0] : {};

  return {
    record,
    refresh,
    isLoading,
  };
}
