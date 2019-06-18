import { useEffect, useState } from "react";

export default function useDirty(dataObject) {
  const [isDirty, setDirty] = useState(dataObject.isDirty() || false);

  useEffect(() => {
    dataObject.attachEvent("onDirtyChanged", setDirty);

    setDirty(dataObject.isDirty());

    return () => {
      dataObject.detachEvent("onDirtyChanged", setDirty);
    };
  }, [dataObject]);

  return isDirty;
}
