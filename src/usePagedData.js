import { useCallback, useEffect, useState } from "react";
import dataUpdateEvents from "./dataUpdateEvents";

export default function usePagedData(dataObject) {
  const [data, setData] = useState(() => dataObject.getPagingComponent().getCurrentData() || []);

  const updateData = useCallback(() => {
    const data = dataObject.getPagingComponent().getCurrentData();

    // If current row is dirty, getData will still return the saved record
    const idx = dataObject.getCurrentIndex();
    if (idx >= 0) {
      data[idx] = dataObject.currentRow();
    }

    setData(data || []);
  }, [dataObject]);

  useEffect(() => {
    dataUpdateEvents.forEach(event => dataObject.attachEvent(event, updateData));

    const pagingComponent = dataObject.getPagingComponent();
    pagingComponent.attach("after", "pageCountChange", updateData);
    pagingComponent.attach("after", "pageChange", updateData);
    pagingComponent.attach("after", "pageRefresh", updateData);

    updateData();

    return () => {
      dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));
      pagingComponent.detach("after", "pageCountChange", updateData);
      pagingComponent.detach("after", "pageChange", updateData);
      pagingComponent.detach("after", "pageRefresh", updateData);
    };
  }, [dataObject, updateData]);

  return data;
}
