import { useEffect, useState } from "react";
import dataUpdateEvents from "./data-update-events";

export default function useData(dataObject) {
  const [data, setData] = useState([]);

  function updateData() {
    setData(dataObject.getData());
  }

  useEffect(() => {
    dataUpdateEvents.forEach(event =>
      dataObject.attachEvent(event, updateData)
    );

    updateData();

    return () =>
      dataUpdateEvents.forEach(event =>
        dataObject.detachEvent(event, updateData)
      );
  }, [dataObject]);

  return data;
}
