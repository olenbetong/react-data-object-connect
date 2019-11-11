import { useEffect, useState } from "react";
import { dataUpdateEvents, recordUpdateEvents } from "./dataUpdateEvents";

function getCurrentData(dataObject, includeDirty) {
  if (dataObject.isDynamicLoading()) {
    return dataObject.getPagingComponent().getCurrentData() || [];
  } else {
    return includeDirty ? dataObject.getDirtyData() : dataObject.getData();
  }
}

export default function useData(dataObject, { includeDirty = true }) {
  const [data, setData] = useState(getCurrentData(dataObject));

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

    const events = includeDirty ? dataUpdateEvents.concat(recordUpdateEvents) : dataUpdateEvents;
    events.forEach(event => dataObject.attachEvent(event, updateData));

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
  }, [dataObject, includeDirty]);

  return data;
}
