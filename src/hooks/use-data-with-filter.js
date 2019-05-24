import { useEffect } from "react";
import useData from "./use-data";

export default function useDataWithFilter(
  dataObject,
  filter,
  type = "filterString"
) {
  const data = useData(dataObject);

  useEffect(() => {
    if (
      (typeof filter !== "string" && filter !== null) ||
      !["filterString", "whereClause"].includes(type)
    ) {
      throw new Error(
        "Only filterString and whereClause with string filters are supported in useDataWithFilter"
      );
    }

    if (
      dataObject.getParameter(type) !== filter ||
      !dataObject.isDataLoaded()
    ) {
      dataObject.setParameter(type, filter);
      dataObject.refreshDataSource();
    }
  }, [dataObject, filter, type]);

  return data;
}
