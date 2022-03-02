import React, { useEffect, useState } from "react";

import { DataObject } from "@olenbetong/data-object";

import { useDataObject } from "./context.js";
import { useCurrentRow } from "./useCurrentRow.js";

/**
 * Attempts to get a value of a field from a passed value. Can be a value, or
 * an event from a HTML input element.
 *
 * @param passedValue The passed value to get the value from
 */
export function getDataObjectFieldValue(passedValue: any): any {
  let value;

  if (
    passedValue && // because null has type "object"
    typeof passedValue === "object" &&
    passedValue["target"]
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

  return value;
}

/**
 * Attempts to set a value of a field in the data object. The value
 * can be an event from a HTML input, or the value itself.
 * The function will attempt to convert the value to the type of the field.
 *
 * @param dataObject Data object to set the fields value in
 * @param field Field to set the value of
 * @param passedValue The passed value to set the field to
 */
export function setDataObjectField<T, K extends keyof T>(
  dataObject: DataObject<T>,
  field: K,
  passedValue: any
) {
  const fieldDefinition = dataObject.getFields(field);
  let value = getDataObjectFieldValue(passedValue);

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

export type useFieldRetunValue<T, V> = {
  dataObject: DataObject<T>;
  error: string | null;
  value: V | null;
  /**
   * Keydown event handler for the input field. Will cancel
   * the current field value when escape is pressed.
   */
  onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (
    evt:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { value: V | null } },
    newValue?: V
  ) => void;
  /**
   * Reset the value to what is currently stored in the data object
   */
  reset: () => void;
};

/**
 * Returns the needed properties to bind a field to an input element.
 *
 * @param fieldName Field to bind to
 * @param dataObject Data object to bind to. Tries to get a data object from context if not given.
 * @returns value and onChange designed for HTML input fields
 */
export function useField<T = any, K extends keyof T = any>(
  fieldName: K,
  dataObject?: DataObject<T>
): useFieldRetunValue<T, T[K]> {
  let dataSource = useDataObject() as DataObject<T>;
  if (dataObject) {
    dataSource = dataObject;
  }
  let currentRow = useCurrentRow(dataSource);
  let [error, setError] = useState<null | string>(null);
  let [faultyValue, setFaultyValue] = useState<any>(null);

  useEffect(() => {
    function handleReset() {
      setFaultyValue(null);
      setError(null);
    }
    dataSource.attachEvent("onAfterSave", handleReset);
    dataSource.attachEvent("onCancelEdit", handleReset);
    dataSource.attachEvent("onRecordRefreshed", handleReset);
    dataSource.attachEvent("onCurrentIndexChanged", handleReset);

    return () => {
      dataSource.detachEvent("onAfterSave", handleReset);
      dataSource.detachEvent("onCancelEdit", handleReset);
      dataSource.detachEvent("onRecordRefreshed", handleReset);
      dataSource.detachEvent("onCurrentIndexChanged", handleReset);
    };
  }, [dataSource]);

  return {
    dataObject: dataSource,
    error,
    value: faultyValue ?? currentRow[fieldName],
    onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Escape" && dataSource.isDirty(fieldName as string)) {
        evt.stopPropagation();
        dataSource.cancelField(fieldName);
        setFaultyValue(null);
        setError(null);
      }
    },
    onChange: (
      evt:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | {
            target: { value: T[K] | null };
          },
      newValue?: T[K]
    ) => {
      try {
        setDataObjectField(dataSource, fieldName, newValue ?? evt);
        setError(null);
        setFaultyValue(null);
      } catch (error) {
        setFaultyValue(getDataObjectFieldValue(newValue ?? evt));
        if (error && (error as any).message) {
          setError((error as any).message);
        } else {
          setError(error as string);
        }
      }
    },
    reset: () => {
      setFaultyValue(null);
      setError(null);
      dataSource.cancelField(fieldName);
    },
  };
}
