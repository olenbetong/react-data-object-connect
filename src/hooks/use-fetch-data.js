import { useEffect, useState } from "react";
import getData from "../get-data";

export default function useFetchData(dataObject, filter) {
  const [data, setData] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    getData(dataObject, filter).then(data => {
      if (data.length > 0) {
        setData(data);
      } else {
        setData([]);
      }

      setIsLoading(false);
    });
  }, [dataObject, filter, shouldUpdate]);

  return {
    data,
    refresh: () => setShouldUpdate(shouldUpdate => !shouldUpdate),
    isLoading
  };
}
