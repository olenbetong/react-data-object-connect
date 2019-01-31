import { useEffect, useState } from "react";
import { getData } from "../get-data";

export function useSingleRecord(dataObject, filter) {
  // eslint-disable-next-line no-console
  console.warn("DEPRECATED: useSingleRecord has been renamed to useRecord");
  return useFetchRecord(dataObject, filter);
}

export function useDataWithoutState(dataObject, filter) {
  // eslint-disable-next-line no-console
  console.warn("DEPRECATED: useDataWithoutState has been renamed to useRecord");
  return useFetchData(dataObject, filter);
}

export function useFetchRecord(dataObject, filter) {
  const { isLoading, data, refresh } = useFetchData(dataObject, filter);
  const record = data.length > 0 ? data[0] : {};

  return {
    record,
    refresh,
    isLoading
  };
}

export function useFetchData(dataObject, filter) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function refresh() {
    setIsLoading(true);

    getData(dataObject, filter).then(data => {
      if (data.length > 0) {
        setData(data);
      } else {
        setData([]);
      }

      setIsLoading(false);
    });
  }

  useEffect(() => {
    refresh();
  }, [dataObject, filter]);

  return {
    data,
    refresh,
    isLoading
  };
}
