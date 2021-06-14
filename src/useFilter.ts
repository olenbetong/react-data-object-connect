import { DataObject, FilterObject } from "@olenbetong/data-object";
import { FilterOrOptions, FilterType, isOptions } from "filter";
import { useEffect } from "react";
import equals from "./fastDeepEqual";

export default function useFilter(
  dataObject: DataObject<any>,
  filterOrOptions: FilterOrOptions,
  typeParam: FilterType = "filterString",
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
      if (!equals(current, filter) || (!dataObject.isDataLoaded() && !dataObject.isDataLoading())) {
        dataObject.setParameter(type, filter);
        dataObject.refreshDataSource();
      }
    }
  }, [dataObject, filterOrOptions, typeParam]);
}
