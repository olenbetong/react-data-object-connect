import { useEffect, useState } from "react";

export function useCurrentIndex(dataObject) {
  const [index, setIndex] = useState(dataObject.getCurrentIndex());

  useEffect(() => {
    dataObject.attachEvent("onCurrentIndexChanged", setIndex);

    setIndex(dataObject.getCurrentIndex());

    return () => dataObject.detachEvent("onCurrentIndexChanged", setIndex);
  }, [dataObject]);

  return index;
}

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

    recordUpdateEvents.forEach(event => dataObject.attachEvent(event, updateRecord));

    updateRecord();

    return () => recordUpdateEvents.forEach(event => dataObject.detachEvent(event, updateRecord));
  }, [dataObject]);

  return record;
}

export function useData(dataObject) {
  const [data, setData] = useState([]);

  function updateData() {
    setData(dataObject.getData());
  }

  useEffect(() => {
    dataUpdateEvents.forEach(event => dataObject.attachEvent(event, updateData));

    updateData();

    return () => dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));
  }, [dataObject]);

  return data;
}

export function useDirty(dataObject) {
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    dataObject.attachEvent("onDirtyChanged", setDirty);

    setDirty(dataObject.isDirty());

    return () => {
      dataObject.detachEvent("onDirtyChanged", setDirty);
    };
  }, [dataObject]);

  return isDirty;
}

export function useError(dataObject) {
  const [loadError, setError] = useState(null);

  useEffect(() => {
    dataObject.attachEvent("onDataLoadFailed", setError);

    return () => {
      dataObject.detachEvent("onDataLoadFailed", setError);
    };
  }, [dataObject]);

  return loadError;
}

export function useLoading(dataObject) {
  const [isLoading, setLoading] = useState(dataObject.isDataLoading());

  function setIsLoading() {
    setLoading(true);
  }

  function setIsNotLoading() {
    setLoading(false);
  }

  useEffect(() => {
    dataObject.attachEvent("onBeforeLoad", setIsLoading);
    dataObject.attachEvent("onDataLoaded", setIsNotLoading);
    dataObject.attachEvent("onDataLoadFailed", setIsNotLoading);

    setLoading(dataObject.isDataLoading);

    return () => {
      dataObject.detachEvent("onBeforeLoad", setIsLoading);
      dataObject.detachEvent("onDataLoaded", setIsNotLoading);
      dataObject.detachEvent("onDataLoadFailed", setIsNotLoading);
    };
  }, [dataObject]);

  return isLoading;
}

export function useStatus(dataObject) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function setSaving() {
    setIsSaving(true);
  }
  function setNotSaving() {
    setIsSaving(false);
  }
  function setDeleting() {
    setIsDeleting(true);
  }
  function setNotDeleting() {
    setIsDeleting(false);
  }

  useEffect(() => {
    dataObject.attachEvent("onBeforeSave", setSaving);
    dataObject.attachEvent("onAfterSave", setNotSaving);
    dataObject.attachEvent("onSaveFailed", setNotSaving);

    dataObject.attachEvent("onRecordDeleting", setDeleting);
    dataObject.attachEvent("onRecordDeleted", setNotDeleting);

    return () => {
      dataObject.detachEvent("onBeforeSave", setSaving);
      dataObject.detachEvent("onAfterSave", setNotSaving);
      dataObject.detachEvent("onSaveFailed", setNotSaving);

      dataObject.detachEvent("onRecordDeleting", setDeleting);
      dataObject.detachEvent("onRecordDeleted", setNotDeleting);
    };
  }, [dataObject]);

  return {
    isDeleting,
    isSaving
  };
}

export function usePermissions(dataObject) {
  const [allowDelete, setAllowDelete] = useState(dataObject.isDeleteAllowed());
  const [allowInsert, setAllowInsert] = useState(dataObject.isInsertAllowed());
  const [allowUpdate, setAllowUpdate] = useState(dataObject.isUpdateAllowed());

  useEffect(() => {
    dataObject.attachEvent("onAllowDeleteChanged", setAllowDelete);
    dataObject.attachEvent("onAllowInsertChanged", setAllowInsert);
    dataObject.attachEvent("onAllowUpdateChanged", setAllowUpdate);

    return () => {
      dataObject.detachEvent("onAllowDeleteChanged", setAllowDelete);
      dataObject.detachEvent("onAllowInsertChanged", setAllowInsert);
      dataObject.detachEvent("onAllowUpdateChanged", setAllowUpdate);
    };
  }, [dataObject]);

  return {
    allowDelete,
    allowInsert,
    allowUpdate
  };
}
