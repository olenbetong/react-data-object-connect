import { useCallback, useEffect, useState } from "react";
import dataUpdateEvents from "./dataUpdateEvents";

export default function useCurrentRow(dataObject) {
  const [record, setRecord] = useState(dataObject.currentRow() || {});
  const updateRecord = useCallback(() => setRecord(dataObject.currentRow()), [dataObject]);

  useEffect(() => {
    const recordUpdateEvents = ["onCurrentIndexChanged", ...dataUpdateEvents];

    recordUpdateEvents.forEach(event => dataObject.attachEvent(event, updateRecord));

    updateRecord();

    return () => recordUpdateEvents.forEach(event => dataObject.detachEvent(event, updateRecord));
  }, [dataObject, updateRecord]);

  return record;
}
