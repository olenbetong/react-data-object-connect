import { DataObject, FilterObject } from "@olenbetong/data-object";
import { FilterOrOptions, FilterType, isOptions } from "./filter";
import useData from "./useData";
import useFilter from "./useFilter";

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
