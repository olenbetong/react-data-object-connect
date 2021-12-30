import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

/**
 * Hooks to return the number of records in the data object.
 *
 * @param dataObject Data object to get record count from
 * @returns Number of records in the data object
 */
export function useDataLength(dataObject: DataObject<any>) {
  const [length, setLength] = useState(() => dataObject.getDataLength());

  useEffect(() => {
    function update() {
      setLength(dataObject.getDataLength());
    }

    dataObject.attachEvent("onRecordCreated", update);
    dataObject.attachEvent("onRecordDeleted", update);
    dataObject.attachEvent("onDataLoaded", update);
    dataObject.attachEvent("onPartialDataLoaded", update);
    dataObject.attachEvent("onRowCountLoaded", update);

    update();

    return () => {
      dataObject.detachEvent("onRecordCreated", update);
      dataObject.detachEvent("onRecordDeleted", update);
      dataObject.detachEvent("onDataLoaded", update);
      dataObject.detachEvent("onPartialDataLoaded", update);
      dataObject.detachEvent("onRowCountLoaded", update);
    };
  }, [dataObject]);

  return length;
}
