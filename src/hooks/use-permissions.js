import { useEffect, useState } from "react";

export default function usePermissions(dataObject) {
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
