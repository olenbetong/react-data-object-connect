import { CompatDataObject, DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";
import { dataUpdateEvents, recordUpdateEvents } from "./dataUpdateEvents.js";

/**
 * Helper function to get the current data from the data object.
 * If the data object is dynamic loading, it will return the data
 * from the current page in the paging component. Otherwise it will
 * return all the data currently loaded.
 *
 * @param dataObject Data object to get data from
 * @param includeDirty Whether dirty date should be included in the data
 * @returns An array of records in the data object
 */
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

/**
 * Hooks to return the data currently loaded in the data object. If the data
 * object is dynamic loading, the data is the current data in the paging
 * component. If the data object is not dynamic loading, the data is the
 * current data in the data object.
 *
 * @param dataObject The data object to get the data from
 * @param options Options to modify the behavior of the hook
 * @returns An array of records in the data object
 */
export function useData<T>(
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
      // If the data object is dynamic loading, we need to check if the
      // current page is actually loaded. Otherwise we will get an array
      // of records with all fields null.
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
      // The event handler changed to the same as the data object in version 0.7.0.
      // Handle both versions for backwards compatibility.
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
