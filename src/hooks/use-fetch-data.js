import { useEffect, useState } from "react";
import getData from "../get-data";

export default function useFetchData(dataObject, filter) {
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

  return { data, refresh, isLoading };
}
