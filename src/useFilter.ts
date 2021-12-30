import { DataObject, FilterObject } from "@olenbetong/data-object";
import { FilterOrOptions, FilterType, isOptions } from "./filter.js";
import { useEffect } from "react";
import equals from "./fastDeepEqual.js";

/**
 * Hook to keep the data in a data object synchronized with a filter.
 * false may be passed instead of a filter to prevent the hooks from
 * doing anything.
 *
 * For filter objects, a deep equal comparison is used to determine if the filter
 * has changed.
 *
 * NB! Do not use this hook in multiple components that will be rendered
 * at the same time. This will cause an infinite loop where they will
 * overwrite each other's filter.
 *
 * @param dataObject Data object to apply the filter to
 * @param filterOrOptions A filter string, filter object or options object
 * @param typeParam Type of parameter to use when applying the filter
 */
export function useFilter(
  dataObject: DataObject<any>,
  filterOrOptions: FilterOrOptions,
  typeParam: FilterType = "filterString"
) {
  useEffect(() => {
    let type: FilterType;
    let filter: FilterObject | string | false;

    if (isOptions(filterOrOptions)) {
      filter = filterOrOptions.filter;
      type = filterOrOptions.type ?? "filterString";
    } else {
      filter = filterOrOptions;
      type = typeParam;
    }

    const current = dataObject.getParameter(type);

    if (filter !== false) {
      if (
        !equals(current, filter) ||
        (!dataObject.isDataLoaded() && !dataObject.isDataLoading())
      ) {
        dataObject.setParameter(type, filter);
        dataObject.refreshDataSource();
      }
    }
  }, [dataObject, filterOrOptions, typeParam]);
}
