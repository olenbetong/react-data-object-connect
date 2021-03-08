import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

export default function useError(dataObject: DataObject<any>) {
  const [loadError, setError] = useState(null);

  useEffect(() => {
    dataObject.attachEvent("onDataLoadFailed", setError);

    return () => {
      dataObject.detachEvent("onDataLoadFailed", setError);
    };
  }, [dataObject]);

  return loadError;
}
