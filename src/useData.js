import { useEffect, useState } from "react";
import { dataUpdateEvents, recordUpdateEvents } from "./dataUpdateEvents";

function getCurrentData(dataObject, includeDirty) {
  if (dataObject.isDynamicLoading()) {
    return dataObject.getPagingComponent().getCurrentData() || [];
  } else {
    return includeDirty ? dataObject.getDirtyData() : dataObject.getData();
  }
}

export default function useData(dataObject, options = {}) {
  let { includeDirty = true } = options;
  let [data, setData] = useState(getCurrentData(dataObject));

  useEffect(() => {
    let [major, minor] = (dataObject.version ?? "0.6.0").split(".");
    let pagingComponent = dataObject.isDynamicLoading() && dataObject.getPagingComponent();

    function updateData() {
      if (pagingComponent) {
        let page = pagingComponent.getCurrentPage();
        if (pagingComponent.loadedPages()[page]) {
          setData([...getCurrentData(dataObject)]);
        }
      } else {
        setData([...getCurrentData(dataObject)]);
      }
    }

    let events = includeDirty ? dataUpdateEvents.concat(recordUpdateEvents) : dataUpdateEvents;
    events.forEach(event => dataObject.attachEvent(event, updateData));

    if (dataObject.isDynamicLoading()) {
      if (major === "0" && Number(minor) <= 6) {
        pagingComponent.attach("on", "pageChange", updateData);
        pagingComponent.attach("on", "pageRefresh", updateData);
      } else {
        pagingComponent.attach("pageChange", updateData);
        pagingComponent.attach("pageRefresh", updateData);
      }
    }

    updateData();

    return () => {
      dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));

      if (dataObject.isDynamicLoading()) {
        let pagingComponent = dataObject.getPagingComponent();
        if (major === "0" && Number(minor) <= 6) {
          pagingComponent.detach("on", "pageChange", updateData);
          pagingComponent.detach("on", "pageRefresh", updateData);
        } else {
          pagingComponent.detach("pageChange", updateData);
          pagingComponent.detach("pageRefresh", updateData);
        }
      }
    };
  }, [dataObject, includeDirty]);

  return data;
}
