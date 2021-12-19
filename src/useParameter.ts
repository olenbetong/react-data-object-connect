import {
  DataObject,
  ParameterUpdatedValue,
  RetrieveParameters,
} from "@olenbetong/data-object";
import equal from "./fastDeepEqual.js";
import { useRef } from "react";
import { useEffect, useState } from "react";

export default function useParameter<T, P extends keyof RetrieveParameters<T>>(
  dataObject: DataObject<T>,
  parameter: P
): RetrieveParameters<T>[P] {
  const [value, setValue] = useState(() => dataObject.getParameter(parameter));
  let lastValue = useRef<RetrieveParameters<T>[P]>(value);

  useEffect(() => {
    function update<K extends keyof RetrieveParameters<T>>(
      event?: CustomEvent<ParameterUpdatedValue<T, K>>
    ) {
      if (
        event?.detail?.name !== undefined &&
        event?.detail?.name !== (parameter as string)
      ) {
        return;
      }

      let currentValue = dataObject.getParameter(parameter);
      if (!equal(currentValue, lastValue.current)) {
        lastValue.current = currentValue;
        setValue(currentValue);
      }
    }

    dataObject.attachEvent("onParameterUpdated", update);
    update();

    return () => {
      dataObject.detachEvent("onParameterUpdated", update);
    };
  }, [dataObject, parameter]);

  return value;
}
