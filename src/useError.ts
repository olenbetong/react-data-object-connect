import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

export function useError(dataObject: DataObject<any>) {
  const [loadError, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleError(event?: CustomEvent<string | null>) {
      if (event && event.detail) {
        setError(event.detail);
      }
    }

    dataObject.attachEvent("onDataLoadFailed", handleError);

    return () => {
      dataObject.detachEvent("onDataLoadFailed", handleError);
    };
  }, [dataObject]);

  return loadError;
}
