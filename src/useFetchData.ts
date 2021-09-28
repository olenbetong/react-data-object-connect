import { DataObject, Filter } from "@olenbetong/data-object";
import { useCallback, useEffect, useState } from "react";
import getData from "./getData";

export default function useFetchData<T>(
  dataObject: DataObject<T>,
  filter: false | Filter | string
) {
  const [data, setData] = useState<T[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(filter !== false);
  const refresh = useCallback(() => {
    setShouldUpdate((shouldUpdate) => !shouldUpdate);
  }, []);

  const refreshRows = useCallback(
    (filter: any, idField: keyof T = "PrimKey" as keyof T) => {
      getData(dataObject, filter).then((records) => {
        let newData = [...data];
        for (let record of records) {
          for (let i = 0; i < newData.length; i++) {
            const current = newData[i];
            if (current[idField] === record[idField]) {
              newData[i] = record;
            }
          }
        }

        setData(newData);
      });
    },
    [dataObject, data]
  );

  useEffect(() => {
    let isCancelled = false;

    if (filter !== false) {
      setIsLoading(true);

      getData(dataObject, filter).then((data) => {
        if (!isCancelled) {
          if (data.length > 0) {
            setData(data);
          } else {
            setData([]);
          }

          setIsLoading(false);
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [dataObject, filter, shouldUpdate]);

  return {
    data,
    refresh,
    refreshRows,
    isLoading,
  };
}
