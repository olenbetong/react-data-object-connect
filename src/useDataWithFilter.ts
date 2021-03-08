import { DataObject } from "@olenbetong/data-object";
import useData from "./useData";
import useFilter from "./useFilter";

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

type UseDataWithFilterOptions = {
  filter: string | FilterObjectGroup;
  type: "filterString" | "whereClause" | "filterObject" | "whereObject";
};

type FilterType = "filterString" | "whereClause" | "filterObject" | "whereObject";

type FilterOrOptions = string | FilterObjectGroup | UseDataWithFilterOptions;

function isOptions(filterOrOptions: FilterOrOptions): filterOrOptions is UseDataWithFilterOptions {
  return typeof filterOrOptions !== "string" && !["group", "expression"].includes(filterOrOptions.type);
}

export default function useDataWithFilter<T>(
  dataObject: DataObject<T>,
  filterOrOptions: string | FilterOrOptions,
  typeParam: FilterType = "filterString",
) {
  let filter: FilterObjectGroup | string | false;
  let type: FilterType;
  let options = {};

  if (isOptions(filterOrOptions)) {
    filter = filterOrOptions.filter;
    type = filterOrOptions.type ?? "filterString";
  } else {
    filter = filterOrOptions;
    type = typeParam;
  }

  const data = useData(dataObject, options);
  useFilter(dataObject, filter, type);

  return data;
}
