import { DataObject } from "@olenbetong/data-object";
import useFetchData from "./useFetchData";

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

export default function useFetchRecord<T>(dataObject: DataObject<T>, filter: false | string | FilterObjectGroup) {
  const { isLoading, data, refresh } = useFetchData(dataObject, filter);
  const record = data.length > 0 ? data[0] : {};

  return {
    record,
    refresh,
    isLoading,
  };
}
