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
    pagingComponent.attach("after", "pageChange", updateData);
    pagingComponent.attach("after", "pageRefresh", updateData);

    updateData();

    return () => {
      dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));
      pagingComponent.detach("after", "pageChange", updateData);
      pagingComponent.detach("after", "pageRefresh", updateData);
    };
  }, [dataObject]);

  return currentData;
}
