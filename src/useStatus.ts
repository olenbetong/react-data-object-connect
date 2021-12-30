import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

/**
 * Returns whether the data object is currently saving changes to a record,
 * or deleting a record. The states are returned in separate booleans isSaving
 * and isDeleting.
 *
 * @param dataObject Data object to get saving and deleting status from
 * @returns Whether the data object is currently saving or deleting a record
 */
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
