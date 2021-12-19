import { DataObject } from "@olenbetong/data-object";
import useFetchData from "./useFetchData.js";

type FilterObjectGroup = {
  type: "group";
  mode: "and" | "or";
  items: Array<FilterObjectGroup | FilterObjectExpression>;
};

type FilterObjectExpression = {
  type: "expression";
  column: string;
  operator: string;
  value: string;
  valueType: string;
};

type FetchRecordStatus<T> = {
  record: Partial<T>;
  refresh: () => void;
  isLoading: boolean;
};

export default function useFetchRecord<T>(
  dataObject: DataObject<T>,
  filter: false | string | FilterObjectGroup
): FetchRecordStatus<T> {
  const { isLoading, data, refresh } = useFetchData(dataObject, filter);
  const record = data.length > 0 ? data[0] : {};

  return {
    record,
    refresh,
    isLoading,
  };
}
