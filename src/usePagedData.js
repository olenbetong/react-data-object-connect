import { useEffect, useState } from "react";
import dataUpdateEvents from "./dataUpdateEvents";

function getCurrentData(dataObject) {
  return dataObject.getPagingComponent().getCurrentData() || [];
}

export default function usePagedData(dataObject) {
  const [currentData, setCurrentData] = useState(() => getCurrentData(dataObject));

  useEffect(() => {
    function updateData() {
      setCurrentData([...getCurrentData(dataObject)]);
    }

    dataUpdateEvents.forEach(event => dataObject.attachEvent(event, updateData));

    const pagingComponent = dataObject.getPagingComponent();
    pagingComponent.attach("on", "pageChange", updateData);
    pagingComponent.attach("on", "pageRefresh", updateData);

    updateData();

    return () => {
      dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));
      pagingComponent.detach("on", "pageChange", updateData);
      pagingComponent.detach("on", "pageRefresh", updateData);
    };
  }, [dataObject]);

  return currentData;
}
