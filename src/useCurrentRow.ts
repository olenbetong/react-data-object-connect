import { DataObject, DataObjectEvent } from "@olenbetong/data-object";
import { useCallback, useEffect, useState } from "react";
import { dataUpdateEvents, recordUpdateEvents } from "./dataUpdateEvents.js";

export function useCurrentRow<T>(dataObject: DataObject<T>) {
  const [record, setRecord] = useState(dataObject.currentRow() || {});
  const updateRecord = useCallback(
    () => setRecord(dataObject.currentRow()),
    [dataObject]
  );

  useEffect(() => {
    const events: DataObjectEvent[] = [
      "onCurrentIndexChanged",
      ...dataUpdateEvents,
      ...recordUpdateEvents,
    ];

    events.forEach((event) => dataObject.attachEvent(event, updateRecord));

    updateRecord();

    return () =>
      events.forEach((event) => dataObject.detachEvent(event, updateRecord));
  }, [dataObject, updateRecord]);

  return record;
}
