import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

export default function useCurrentIndex(dataObject: DataObject<any>) {
  const [index, setIndex] = useState(dataObject.getCurrentIndex());

  useEffect(() => {
    function handleCurrentIndexChanged(evtOrIndex?: number | CustomEvent<number>) {
      if (typeof evtOrIndex === "number") {
        setIndex(evtOrIndex);
      } else if (typeof evtOrIndex === "object" && typeof evtOrIndex.detail === "number") {
        setIndex(evtOrIndex.detail);
      }
    }
    dataObject.attachEvent("onCurrentIndexChanged", handleCurrentIndexChanged);

    setIndex(dataObject.getCurrentIndex());

    return () => dataObject.detachEvent("onCurrentIndexChanged", handleCurrentIndexChanged);
  }, [dataObject]);

  return index;
}
