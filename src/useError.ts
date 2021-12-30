import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

/**
 * If the previous attempt to load data failed, this hook will return the
 * error.
 *
 * @param dataObject Data object to get the loading error from
 * @returns The error if the previous attempt to load data failed, otherwise
 * null
 */
export function useError(dataObject: DataObject<any>) {
  const [loadError, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleError(event?: CustomEvent<string | null>) {
      if (event && event.detail) {
        setError(event.detail);
      }
    }

    function clearError() {
      setError(null);
    }

    dataObject.attachEvent("onDataLoadFailed", handleError);
    dataObject.attachEvent("onDataLoaded", clearError);
    dataObject.attachEvent("onPartialDataLoaded", clearError);

    return () => {
      dataObject.detachEvent("onDataLoadFailed", handleError);
      dataObject.detachEvent("onDataLoaded", clearError);
      dataObject.detachEvent("onPartialDataLoaded", clearError);
    };
  }, [dataObject]);

  return loadError;
}
