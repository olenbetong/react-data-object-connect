import { useEffect, useState } from "react";

export default function useCurrentIndex(dataObject) {
  const [index, setIndex] = useState(dataObject.getCurrentIndex());

  useEffect(() => {
    dataObject.attachEvent("onCurrentIndexChanged", setIndex);

    setIndex(dataObject.getCurrentIndex());

    return () => dataObject.detachEvent("onCurrentIndexChanged", setIndex);
  }, [dataObject]);

  return index;
}
