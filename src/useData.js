import { useEffect, useState } from "react";
import dataUpdateEvents from "./dataUpdateEvents";

function getCurrentData(dataObject) {
  if (dataObject.isDynamicLoading()) {
    return dataObject.getPagingComponent().getCurrentData() || [];
  } else {
    const data = dataObject.getData();

    // If current row is dirty, getData will still return the saved record
    const idx = dataObject.getCurrentIndex();
    if (idx >= 0) {
      data[idx] = dataObject.currentRow();
    }

    return data;
  }
}

export default function useData(dataObject) {
  const [data, setData] = useState(getCurrentData());

  useEffect(() => {
    const pagingComponent = dataObject.isDynamicLoading() && dataObject.getPagingComponent();

    function updateData() {
      if (pagingComponent) {
        const page = pagingComponent.getCurrentPage();
        if (pagingComponent.loadedPages()[page]) {
          setData([...getCurrentData(dataObject)]);
        }
      } else {
        setData([...getCurrentData(dataObject)]);
      }
    }

    dataUpdateEvents.forEach(event => dataObject.attachEvent(event, updateData));

    if (dataObject.isDynamicLoading()) {
      pagingComponent.attach("on", "pageChange", updateData);
      pagingComponent.attach("on", "pageRefresh", updateData);
    }

    updateData();

    return () => {
      dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));

      if (dataObject.isDynamicLoading()) {
        const pagingComponent = dataObject.getPagingComponent();
        pagingComponent.detach("on", "pageChange", updateData);
        pagingComponent.detach("on", "pageRefresh", updateData);
      }
    };
  }, [dataObject]);

  return data;
}
