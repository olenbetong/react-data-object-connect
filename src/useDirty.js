import { useEffect, useState } from "react";

export default function useDirty(dataObject) {
  const [isDirty, setDirty] = useState(dataObject.isDirty() || false);

  useEffect(() => {
    dataObject.attachEvent("onDirtyChanged", handleDirtyChanged);

    setDirty(dataObject.isDirty());

    function handleDirtyChanged(dirtyOrEvent) {
      // Previous versions of data object passed only the boolean
      // value to the event handler, but newer versions pass a CustomEvent
      // with the value in detail property.
      if (typeof dirtyOrEvent === "boolean") {
        setDirty(dirtyOrEvent);
      } else if (dirtyOrEvent && dirtyOrEvent.detail) {
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
