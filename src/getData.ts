import { DataHandler, DataObject } from "@olenbetong/data-object";
import { FieldDefinition } from "@olenbetong/data-object/types";

interface DataProviderHandlerConstructor {
  new <T>(options: any): DataHandler<T>;
}

declare global {
  interface Window {
    af: {
      data: {
        DataProviderHandler: DataProviderHandlerConstructor;
      };
    };
  }
}

export default function getData<T>(dataObject: DataObject<T>, filter: any): Promise<Array<T>> {
  const { data } = window.af;
  const dataHandler: DataHandler<T> = new data.DataProviderHandler({
    dataSourceId: dataObject.getDataSourceId(),
    timeout: 30000,
  });
  const fields = dataObject.getFields() as FieldDefinition[];

  return new Promise((resolve, reject) => {
    const filterData = {
      filterString: "",
      whereClause: typeof filter === "string" ? filter : "",
      whereObject: typeof filter === "object" ? filter : null,
    };

    dataHandler.retrieve(filterData, function (error: any, data: T[keyof T][][]) {
      if (error !== null) {
        reject(error);
      } else {
        const records: Array<T> = [];

        for (let item of data) {
          const record: Partial<T> = {};
          for (let i = 0; i < item.length; i++) {
            record[fields[i].name as keyof T] = item[i];
          }
          records.push(record as Required<T>);
        }

        resolve(records);
      }
    });
  });
}
