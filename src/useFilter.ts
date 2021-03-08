import { useEffect } from "react";
import equals from "fast-deep-equal";
import { DataObject } from "@olenbetong/data-object";

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

type FilterType = "filterString" | "whereClause" | "filterObject" | "whereObject";

export default function useFilter(
  dataObject: DataObject<any>,
  filter: false | string | FilterObjectGroup,
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
