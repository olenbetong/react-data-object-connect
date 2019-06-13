import { useCallback, useEffect, useState } from "react";
import dataUpdateEvents from "./dataUpdateEvents";

export default function useData(dataObject) {
  const [data, setData] = useState([]);
  const updateData = useCallback(() => {
    setData(dataObject.getData());
  }, [dataObject]);

  useEffect(() => {
    dataUpdateEvents.forEach(event =>
      dataObject.attachEvent(event, updateData)
    );

    updateData();

    return () =>
      dataUpdateEvents.forEach(event =>
        dataObject.detachEvent(event, updateData)
      );
  }, [dataObject, updateData]);

  return data;
}
