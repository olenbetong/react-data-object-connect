import { useCallback, useEffect, useState } from "react";
import dataUpdateEvents from "./dataUpdateEvents";

export default function useData(dataObject) {
  const [data, setData] = useState(dataObject.getData());
  const updateData = useCallback(() => {
    const data = dataObject.getData();

    // If current row is dirty, getData will still return the saved record
    const idx = dataObject.getCurrentIndex();
    if (idx >= 0) {
      data[idx] = dataObject.currentRow();
    }

    setData(data);
  }, [dataObject]);

  useEffect(() => {
    dataUpdateEvents.forEach(event => dataObject.attachEvent(event, updateData));

    updateData();

    return () => dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));
  }, [dataObject, updateData]);

  return data;
}
