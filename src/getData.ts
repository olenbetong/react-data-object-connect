import { isRequestError } from "./isRequestError.js";

import {
  DataHandler,
  DataObject,
  FieldDefinition,
} from "@olenbetong/data-object";

const isodate =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?Z?$/;
function dateReviver(value: any) {
  // New method of parsing dates - much faster
  if (typeof value === "string") {
    if (value.includes("/Date(")) {
      value = new Date(Number(value.substring(6, value.length - 2)));
    } else if (isodate.test(value)) {
      value = new Date(value);
    }
  }
  return value;
}

export async function getData<T>(
  dataObject: DataObject<T>,
  filter: any
): Promise<Array<T>> {
  const dataHandler: DataHandler<T> = new af.data.DataProviderHandler({
    dataSourceId: dataObject.getDataSourceId(),
    fields: dataObject.getFields(),
    timeout: 30000,
  });
  const fields = dataObject.getFields() as FieldDefinition[];

  const filterData = {
    filterString: "",
    whereClause: typeof filter === "string" ? filter : "",
    whereObject: typeof filter === "object" ? filter : null,
  };

  let result = await dataHandler.retrieve(filterData);
  if (isRequestError(result)) {
    throw Error(result.error);
  }

  let data = Array.isArray(result) ? result : result.data;
  if (data.length && Array.isArray(data[0])) {
    // Legacy data handler that returns array of values instead of objects
    for (let i = 0; i < data.length; i++) {
      let record = data[i] as unknown as T[keyof T][];
      let objRecord: Partial<T> = {};
      for (let j = 0; j < record.length; j++) {
        objRecord[fields[j].name as keyof T] = dateReviver(record[j]);
      }

      data[i] = objRecord as T;
    }
  }

  return data;
}
