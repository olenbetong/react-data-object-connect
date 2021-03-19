import { DataObject, FilterObject } from "@olenbetong/data-object";
import { useEffect } from "react";
import equals from "./fastDeepEqual";

type FilterType = "filterString" | "whereClause" | "filterObject" | "whereObject";

type UseFilterOptions = {
  filter: false | string | FilterObject;
  type: "filterString" | "whereClause" | "filterObject" | "whereObject";
};

type FilterOrOptions = false | string | FilterObject | UseFilterOptions;

export default function useFilter(
  dataObject: DataObject<any>,
  filter: FilterOrOptions,
  type: FilterType = "filterString",
) {
  useEffect(() => {
    const current = dataObject.getParameter(type);

    if (filter !== false) {
      if (!equals(current, filter) || (!dataObject.isDataLoaded() && !dataObject.isDataLoading())) {
        dataObject.setParameter(type, filter);
        dataObject.refreshDataSource();
      }
    }
  }, [dataObject, filter, type]);
}
