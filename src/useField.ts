import React from "react";

import { DataObject } from "@olenbetong/data-object";

import { useDataObject } from "./context.js";
import { useCurrentRow } from "./useCurrentRow.js";

export function setDataObjectField<T, K extends keyof T>(
  dataObject: DataObject<T>,
  field: K,
  passedValue: any
) {
  const fieldDefinition = dataObject.getFields(field);

  let value;

  if (
    passedValue && // because null has type "object"
    typeof passedValue === "object" &&
    "target" in passedValue &&
    passedValue.target
  ) {
    let elem = passedValue.target;
    if (elem.type === "checkbox") {
      value = elem.checked;
    } else if ("value" in elem) {
      value = elem.value;
    } else {
      value = passedValue;
    }
  } else {
    value = passedValue;
  }

  if (
    fieldDefinition != null &&
    fieldDefinition.nullable &&
    fieldDefinition.type === "string" &&
    !value
  ) {
    value = null;
  }

  if (fieldDefinition !== null && value !== null) {
    if (fieldDefinition.type === "number") {
      if ((value === "" || value === null) && fieldDefinition.nullable) {
        value = null;
      } else {
        value = Number(value);
      }
    } else if (
      ["date", "datetime"].includes(fieldDefinition.type ?? "string") &&
      !(value instanceof Date)
    ) {
      value = new Date(value);
    }
  }

  dataObject.currentRow(field, value);
}

export type useFieldRetunValue<T> = {
  value: T | null;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>, newValue?: T) => void;
};

export function useField<T, K extends keyof T>(
  fieldName: K,
  dataObject?: DataObject<T>
): useFieldRetunValue<T[K]> {
  let dataSource = useDataObject() as DataObject<T>;
  if (dataObject) {
    dataSource = dataObject;
  }
  let currentRow = useCurrentRow(dataSource);

  return {
    value: currentRow[fieldName],
    onChange: (evt: React.ChangeEvent<HTMLInputElement>, newValue?: T[K]) => {
      let value = newValue ?? evt.target.value;
      setDataObjectField(dataSource, fieldName, value);
    },
  };
}
