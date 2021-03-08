import { DataHandler, DataObject, FieldDefinition } from "@olenbetong/data-object";

export default class SimpleDataHandler<T> {
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

  createRecord(record: Partial<T>) {
    return new Promise((resolve, reject) => {
      this.dataHandler.create(record, (error: any, data: T[keyof T][]) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(this.arrayRecordToObject(data));
        }
      });
    });
  }

  deleteRecord(filter: Partial<T>) {
    return new Promise((resolve, reject) => {
      this.dataHandler.destroy(filter, (error: any, data: boolean) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  getData(filter: any) {
    return new Promise((resolve, reject) => {
      const filterData = {
        filterString: "",
        whereClause: typeof filter === "string" ? filter : "",
        whereObject: typeof filter === "object" ? filter : null,
      };

      this.dataHandler.retrieve(filterData, (error: any, data: T[keyof T][][]) => {
        if (error !== null) {
          reject(error);
        } else {
          const records = [];

          for (let item of data) {
            records.push(this.arrayRecordToObject(item));
          }

          resolve(records);
        }
      });
    });
  }

  updateRecord(record: Partial<T>) {
    return new Promise((resolve, reject) => {
      this.dataHandler.update(record, (error: any, data: T[keyof T][]) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(this.arrayRecordToObject(data));
        }
      });
    });
  }
}
