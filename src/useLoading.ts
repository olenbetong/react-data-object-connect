import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

export function useLoading(dataObject: DataObject<any>) {
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
    dataObject.attachEvent("onPartialDataLoaded", setIsNotLoading);

    setLoading(dataObject.isDataLoading());

    return () => {
      dataObject.detachEvent("onBeforeLoad", setIsLoading);
      dataObject.detachEvent("onDataLoaded", setIsNotLoading);
      dataObject.detachEvent("onDataLoadFailed", setIsNotLoading);
      dataObject.detachEvent("onPartialDataLoaded", setIsNotLoading);
    };
  }, [dataObject]);

  return isLoading;
}
