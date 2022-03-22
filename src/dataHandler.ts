import { isRequestError } from "./isRequestError.js";

import {
  DataHandler,
  DataObject,
  FieldDefinition,
  Filter,
} from "@olenbetong/data-object";

export class SimpleDataHandler<T> {
  dataHandler: DataHandler<T>;
  dataObject: DataObject<T>;
  fields: FieldDefinition[];

  constructor(dataObject: DataObject<T>) {
    const { data } = window.af;
    this.dataObject = dataObject;
    this.fields = dataObject.getFields() as FieldDefinition[];
    this.dataHandler = new data.DataProviderHandler({
      dataSourceId: dataObject.getDataSourceId(),
      timeout: 30000,
    });
  }

  arrayRecordToObject(record: T[keyof T][]) {
    const obj: Partial<T> = {};
    for (let i = 0; i < record.length; i++) {
      obj[this.fields[i].name as keyof T] = record[i];
    }

    return obj as T;
  }

  async createRecord(record: Partial<T>) {
    let result = await this.dataHandler.create(record);
    if (isRequestError(result)) {
      throw Error(result.error);
    }

    if (Array.isArray(result)) {
      // Legacy data handler
      return this.arrayRecordToObject(result as unknown as T[keyof T][]);
    }

    return result;
  }

  async deleteRecord(filter: Partial<T>) {
    let result = await this.dataHandler.destroy(filter);

    if (isRequestError(result)) {
      throw Error(result.error);
    }

    return result;
  }

  async getData(filter: Filter | string) {
    const filterData = {
      filterString: "",
      whereClause: typeof filter === "string" ? filter : "",
      whereObject: typeof filter === "object" ? filter : null,
    };

    let result = await this.dataHandler.retrieve(filterData);

    if (isRequestError(result)) {
      throw Error(result.error);
    }

    let data = Array.isArray(result) ? result : result.data;
    if (data.length && Array.isArray(data[0])) {
      // Legacy data handler that returns array of values instead of objects
      for (let i = 0; i < data.length; i++) {
        let record = data[i] as unknown as T[keyof T][];
        data[i] = this.arrayRecordToObject(record);
      }
    }

    return data;
  }

  async updateRecord(record: Partial<T>) {
    let result = await this.dataHandler.update(record);
    if (isRequestError(result)) {
      throw Error(result.error);
    }

    if (Array.isArray(result)) {
      // Legacy data handler
      return this.arrayRecordToObject(result as unknown as T[keyof T][]);
    }

    return result;
  }
}
