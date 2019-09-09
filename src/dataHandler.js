export default class SimpleDataHandler {
  constructor(dataObject) {
    const { data } = window.af;
    this.dataObject = dataObject;
    this.fields = dataObject.getFields();
    this.dataHandler = new data.DataProviderHandler({
      dataSourceId: dataObject.getDataSourceId(),
      timeout: 30000,
    });
  }

  arrayRecordToObject(record) {
    const obj = {};
    for (let i = 0; i < record.length; i++) {
      obj[this.fields[i].name] = record[i];
    }

    return obj;
  }

  createRecord(record) {
    return new Promise((resolve, reject) => {
      this.dataHandler.create(record, (error, data) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(this.arrayRecordToObject(data));
        }
      });
    });
  }

  deleteRecord(filter) {
    return new Promise((resolve, reject) => {
      this.dataHandler.destroy(filter, (error, data) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(this.arrayRecordToObject(data));
        }
      });
    });
  }

  getData(filter) {
    return new Promise((resolve, reject) => {
      const filterData = {
        filterString: "",
        whereClause: typeof filter === "string" ? filter : "",
        whereObject: typeof filter === "object" ? filter : null,
      };

      this.dataHandler.retrieve(filterData, (error, data) => {
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

  updateRecord(record) {
    return new Promise((resolve, reject) => {
      this.dataHandler.update(record, (error, data) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(this.arrayRecordToObject(data));
        }
      });
    });
  }
}
