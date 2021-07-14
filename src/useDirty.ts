import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

export default function useDirty(dataObject: DataObject<any>) {
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
