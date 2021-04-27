import { DataObject, FilterObject } from "@olenbetong/data-object";
import useData from "./useData";
import useFilter from "./useFilter";

type UseDataWithFilterOptions = {
  filter: false | string | FilterObject;
  type: "filterString" | "whereClause" | "filterObject" | "whereObject";
};

type FilterType = "filterString" | "whereClause" | "filterObject" | "whereObject";

type FilterOrOptions = false | string | FilterObject | UseDataWithFilterOptions;

function isOptions(filterOrOptions: FilterOrOptions): filterOrOptions is UseDataWithFilterOptions {
  return (
    filterOrOptions !== false &&
    typeof filterOrOptions !== "string" &&
    !["group", "expression"].includes(filterOrOptions.type)
  );
}

export default function useDataWithFilter<T>(
  dataObject: DataObject<T>,
  filterOrOptions: string | FilterOrOptions = "",
  typeParam: FilterType = "filterString",
) {
  let filter: FilterObject | string | false;
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
