import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

/**
 * Hook to return the dirty status of the current record in the data object.
 *
 * @param dataObject Data object to get dirty status from
 * @returns A boolean indicating whether the data in the current record is dirty
 */
export function useDirty(dataObject: DataObject<any>) {
  const [isDirty, setDirty] = useState(dataObject.isDirty() || false);

  useEffect(() => {
    dataObject.attachEvent("onDirtyChanged", handleDirtyChanged);

    setDirty(dataObject.isDirty());

    function handleDirtyChanged(dirtyOrEvent?: boolean | CustomEvent<boolean>) {
      // Previous versions of data object passed only the boolean
      // value to the event handler, but newer versions pass a CustomEvent
      // with the value in detail property.
      if (typeof dirtyOrEvent === "boolean") {
        setDirty(dirtyOrEvent);
      } else if (dirtyOrEvent && typeof dirtyOrEvent.detail === "boolean") {
        setDirty(dirtyOrEvent.detail);
      } else {
        setDirty(dataObject.isDirty());
      }
    }

    return () => {
      dataObject.detachEvent("onDirtyChanged", handleDirtyChanged);
    };
  }, [dataObject]);

  return isDirty;
}
