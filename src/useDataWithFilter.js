import { useEffect } from "react";
import equals from "fast-deep-equal";
import useData from "./useData";

export default function useDataWithFilter(dataObject, filter, type = "filterString") {
  const data = useData(dataObject);

  useEffect(() => {
    const current = dataObject.getParameter(type);

    if (filter !== false) {
      if (!equals(current, filter) || !dataObject.isDataLoaded()) {
        dataObject.setParameter(type, filter);
        dataObject.refreshDataSource();
      }
    }
  }, [dataObject, filter, type]);

  return data;
}
