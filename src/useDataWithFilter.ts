import { DataObject, Filter } from "@olenbetong/data-object";
import { FilterOrOptions, FilterType, isOptions } from "./filter.js";
import { useData } from "./useData.js";
import { useFilter } from "./useFilter.js";

export function useDataWithFilter<T>(
  dataObject: DataObject<T>,
  filterOrOptions: string | FilterOrOptions = "",
  typeParam: FilterType = "filterString"
) {
  let filter: Filter | string | false;
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
