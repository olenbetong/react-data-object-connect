import { DataObject } from "@olenbetong/data-object";
import { RetrieveParameters } from "@olenbetong/data-object/types";
import { useEffect, useState } from "react";

export default function useParameter(dataObject: DataObject<any>, parameter: keyof RetrieveParameters<any>) {
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
