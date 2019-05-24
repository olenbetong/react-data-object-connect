import { useEffect, useState } from "react";
import dataUpdateEvents from "./data-update-events";

export default function useCurrentRow(dataObject) {
  const [record, setRecord] = useState({});

  useEffect(() => {
    function updateRecord() {
      setRecord(dataObject.currentRow());
    }

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
