import {
  DataHandler,
  DataObject,
  DataHandlerFactory,
  FieldDefinition,
  Procedure,
  DataProviderHandler,
} from "@olenbetong/data-object";

declare global {
  interface Window {
    af: {
      article: {
        dataObjects: Record<string, DataObject<any>>;
        procedures: Record<string, Procedure<any, any>>;
        hostName: string;
        i18n: Record<string, string>;
        id: string;
      };
      common?: {
        getLocalizedString?: (string: string) => string;
      };
      controls?: {
        alert?: (message: string, callback?: () => void) => void;
        confirm?: (options: {
          title: string;
          message: string;
          buttons: string[];
          callback: (button: number) => void;
        }) => void;
      };
      data: {
        [index: string]: DataHandlerFactory;
        DataProviderHandler: { new <T>(options: any): DataProviderHandler<T> };
      } & { version?: string };
      DataObject?: { new <T>(options: any): DataObject<T> };
      Procedure?: { new <T, V>(options: any): Procedure<T, V> };
      userSession?: {
        culture: string;
        domain: string;
        expired: (callback: () => void) => void;
        isDeveloper: boolean;
        login: string;
        uiculture: string;
      };
    };
  }
}

const isodate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?Z?$/;
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
            record[fields[i].name as keyof T] = dateReviver(item[i]);
          }
          records.push(record as Required<T>);
        }

        resolve(records);
      }
    });
  });
}
