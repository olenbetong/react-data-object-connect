import { DataObject, Filter } from "@olenbetong/data-object";
import { useCallback, useEffect, useState } from "react";
import { getData } from "./getData.js";

/**
 * Hook that uses the data handler of a data object to fetch data from the server,
 * without saving the data to the data object.
 *
 * @param dataObject Data object to fetch data from
 * @param filter Filter to use when fetching data
 * @returns An object containing the loaded data, a function to reload the data,
 * a function to refresh only rows that match a given filter, and the loading
 * status of the data.
 */
export function useFetchData<T>(
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
      getData(dataObject, filter).then((records: any) => {
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
    /**
     * Forces a refresh of the data, even if the filter has not changed.
     */
    refresh,
    /**
     * Fetches data mathing the given filter. Instead of replacing the data in the
     * state of the hook, it will attempt to match the fetched records with the existing
     * records, and only update the updated records. Any other records will remain
     * unchanged, and will still be returned from the hook.
     *
     * This can be used to update rows that have been edited with a filter like
     * `[PrimKey] = 'primkey of an updated record'`.
     *
     * @param filter Filter to use when fetching data
     * @param idField Field that should be used to match records with the existing data
     */
    refreshRows,
    /**
     * A boolean indicating if the data is currently being loaded.
     */
    isLoading,
  };
}
