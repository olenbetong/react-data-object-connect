import { useEffect, useState } from "react";
import dataUpdateEvents from "./data-update-events";

export default function useCurrentRow(dataObject) {
  const [record, setRecord] = useState({});

  function updateRecord() {
    setRecord(dataObject.currentRow());
  }

  useEffect(() => {
    const recordUpdateEvents = ["onCurrentIndexChanged", ...dataUpdateEvents];

    recordUpdateEvents.forEach(event =>
      dataObject.attachEvent(event, updateRecord)
    );

    updateRecord();

    return () =>
      recordUpdateEvents.forEach(event =>
        dataObject.detachEvent(event, updateRecord)
      );
  }, [dataObject]);

  return record;
}
