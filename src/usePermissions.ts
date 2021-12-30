import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

/**
 * Returns whether the user is currently allowed to delete, insert or update
 * records in the data object.
 *
 * @param dataObject Data object to get permission status from
 * @returns Delete, insert and update permission of the data object
 */
export function usePermissions(dataObject: DataObject<any>) {
  const [allowDelete, setAllowDelete] = useState(dataObject.isDeleteAllowed());
  const [allowInsert, setAllowInsert] = useState(dataObject.isInsertAllowed());
  const [allowUpdate, setAllowUpdate] = useState(dataObject.isUpdateAllowed());

  useEffect(() => {
    const updateAllowDelete = () =>
      setAllowDelete(dataObject.isDeleteAllowed());
    const updateAllowInsert = () =>
      setAllowInsert(dataObject.isInsertAllowed());
    const updateAllowUpdate = () =>
      setAllowUpdate(dataObject.isUpdateAllowed());

    dataObject.attachEvent("onAllowDeleteChanged", updateAllowDelete);
    dataObject.attachEvent("onAllowInsertChanged", updateAllowInsert);
    dataObject.attachEvent("onAllowUpdateChanged", updateAllowUpdate);

    updateAllowDelete();
    updateAllowInsert();
    updateAllowUpdate();

    return () => {
      dataObject.detachEvent("onAllowDeleteChanged", updateAllowDelete);
      dataObject.detachEvent("onAllowInsertChanged", updateAllowInsert);
      dataObject.detachEvent("onAllowUpdateChanged", updateAllowUpdate);
    };
  }, [dataObject]);

  return {
    allowDelete,
    allowInsert,
    allowUpdate,
  };
}
