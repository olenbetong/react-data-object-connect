import { useEffect, useState } from "react";

export default function useError(dataObject) {
  const [loadError, setError] = useState(null);

  useEffect(() => {
    dataObject.attachEvent("onDataLoadFailed", setError);

    return () => {
      dataObject.detachEvent("onDataLoadFailed", setError);
    };
  }, [dataObject]);

  return loadError;
}
