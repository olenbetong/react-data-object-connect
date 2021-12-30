import { DataObject, DataObjectEvent } from "@olenbetong/data-object";
import { useCallback, useEffect, useState } from "react";
import { dataUpdateEvents, recordUpdateEvents } from "./dataUpdateEvents.js";

/**
 * Hooks to return the record at the current index of the data object.
 *
 * @param dataObject Data object to get the current row from
 * @returns The record at the current index in the data object
 */
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
