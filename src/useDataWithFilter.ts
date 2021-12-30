import { DataObject, Filter } from "@olenbetong/data-object";
import { FilterOrOptions, FilterType, isOptions } from "./filter.js";
import { useData } from "./useData.js";
import { useFilter } from "./useFilter.js";

/**
 * A convenience hook that combines the useData and useFilter hooks.
 * Returns the data loaded in the data object, and reloads the data with
 * the filter whenever it changes.
 *
 * @param dataObject Data object to get data from and apply filter to
 * @param filterOrOptions Either a filter string, a filter object or an options object
 * @param typeParam Which parameter to apply the filter to
 * @returns The data in the data object filtered by the filter
 */
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
