import { DataObject, Filter } from "@olenbetong/data-object";
import { useFetchData } from "./useFetchData.js";

type FetchRecordStatus<T> = {
  record: Partial<T>;
  refresh: () => void;
  isLoading: boolean;
};

/**
 * Uses the same logic as useFetchData, but returns only the first record of the data.
 * If no records are found, an empty object is returned.
 *
 * @param dataObject Data object to get a record from
 * @param filter Filter to use when fetching data
 * @returns The first record mathing the filter, or an empty object if no record matches
 */
export function useFetchRecord<T>(
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
