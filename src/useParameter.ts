import { DataObject, RetrieveParameters } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

export default function useParameter<T, P extends keyof RetrieveParameters<T>>(
  dataObject: DataObject<T>,
  parameter: P,
): RetrieveParameters<T>[P] {
  const [value, setValue] = useState(() => dataObject.getParameter(parameter));

  useEffect(() => {
    function update() {
      setValue(dataObject.getParameter(parameter));
    }

    dataObject.attachEvent("onParameterUpdated", update);
    update();

    return () => {
      dataObject.detachEvent("onParameterUpdated", update);
    };
  }, [dataObject, parameter]);

  return value;
}
