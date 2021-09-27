import { CompatDataObject, DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";
import { dataUpdateEvents, recordUpdateEvents } from "./dataUpdateEvents";

function getCurrentData<T>(
  dataObject: DataObject<T>,
  includeDirty: boolean
): T[] {
  if (dataObject.isDynamicLoading()) {
    return dataObject.getPagingComponent().getCurrentData() || [];
  } else {
    return includeDirty
      ? (dataObject as CompatDataObject<T>).getDirtyData()
      : dataObject.getData();
  }
}

type UseDataOptions = {
  includeDirty?: boolean;
};

export default function useData<T>(
  dataObject: DataObject<T>,
  options: UseDataOptions = {}
) {
  let { includeDirty = false } = options;
  let [data, setData] = useState(getCurrentData(dataObject, includeDirty));

  useEffect(() => {
    let [major, minor] = (dataObject.version ?? "0.6.0").split(".");
    let pagingComponent = dataObject.isDynamicLoading()
      ? dataObject.getPagingComponent()
      : null;

    function updateData() {
      if (pagingComponent) {
        let page = pagingComponent.getCurrentPage();
        if (pagingComponent.loadedPages()[page]) {
          setData([...getCurrentData(dataObject, includeDirty)]);
        }
      } else {
        setData([...getCurrentData(dataObject, includeDirty)]);
      }
    }

    let events = includeDirty
      ? dataUpdateEvents.concat(recordUpdateEvents)
      : dataUpdateEvents;
    events.forEach((event) => dataObject.attachEvent(event, updateData));

    if (pagingComponent) {
      if (major === "0" && Number(minor) <= 6) {
        (pagingComponent as any).attach("on", "pageChange", updateData);
        (pagingComponent as any).attach("on", "pageRefresh", updateData);
      } else {
        pagingComponent.attach("pageChange", updateData);
        pagingComponent.attach("pageRefresh", updateData);
      }
    }

    updateData();

    return () => {
      dataUpdateEvents.forEach((event) =>
        dataObject.detachEvent(event, updateData)
      );

      if (pagingComponent) {
        let pagingComponent = dataObject.getPagingComponent();
        if (major === "0" && Number(minor) <= 6) {
          (pagingComponent as any).detach("on", "pageChange", updateData);
          (pagingComponent as any).detach("on", "pageRefresh", updateData);
        } else {
          pagingComponent.detach("pageChange", updateData);
          pagingComponent.detach("pageRefresh", updateData);
        }
      }
    };
  }, [dataObject, includeDirty]);

  return data;
}
