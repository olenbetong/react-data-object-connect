import { useEffect, useState } from "react";

const dataUpdateEvents = [
  "onFieldChanged",
  "onRecordCreated",
  "onRecordDeleted",
  "onRecordRefreshed",
  "onAfterSave",
  "onCancelEdit",
  "onDataLoaded"
];

export function useCurrentRow(dataObject) {
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

export function useData(dataObject) {
  const [data, setData] = useState([]);

  function updateData() {
    setData(dataObject.getData());
  }

  useEffect(() => {
    dataUpdateEvents.forEach(event =>
      dataObject.attachEvent(event, updateData)
    );

    updateData();

    return () =>
      dataUpdateEvents.forEach(event =>
        dataObject.detachEvent(event, updateData)
      );
  }, [dataObject]);

  return data;
}
