import { useEffect } from "react";
import equals from "fast-deep-equal";

export default function useFilter(dataObject, filter, type = "filterString") {
  useEffect(() => {
    const current = dataObject.getParameter(type);

    if (filter !== false) {
      if (!equals(current, filter) || !dataObject.isDataLoaded()) {
        dataObject.setParameter(type, filter);
        dataObject.refreshDataSource();
      }
    }
  }, [dataObject, filter, type]);
}
