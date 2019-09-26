import { useEffect, useState } from "react";

export default function useDataLength(dataObject) {
  const [length, setLength] = useState(() => dataObject.getDataLength());

  useEffect(() => {
    function update() {
      setLength(dataObject.getDataLength());
    }

    dataObject.attachEvent("onRecordCreated", update);
    dataObject.attachEvent("onRecordDeleted", update);
    dataObject.attachEvent("onDataLoaded", update);
    dataObject.attachEvent("onPartialDataLoaded", update);

    update();

    return () => {
      dataObject.detachEvent("onRecordCreated", update);
      dataObject.detachEvent("onRecordDeleted", update);
      dataObject.detachEvent("onDataLoaded", update);
      dataObject.detachEvent("onPartialDataLoaded", update);
    };
  }, [dataObject]);

  return length;
}
