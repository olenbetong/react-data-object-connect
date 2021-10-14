import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

export function useStatus(dataObject: DataObject<any>) {
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
    isSaving,
  };
}
