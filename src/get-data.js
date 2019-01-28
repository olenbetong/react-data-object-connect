export function getData(dataObject, filter) {
  const { data } = window.af;
  const dataHandler = new data.DataProviderHandler({
    dataSourceId: dataObject.getDataSourceId(),
    timeout: 30000
  });
  const fields = dataObject.getFields();

  return new Promise((resolve, reject) => {
    dataHandler.retrieve({ filterString: "", whereClause: filter }, function(
      error,
      data
    ) {
      if (error !== null) {
        reject(error);
      } else {
        const records = [];

        for (let item of data) {
          const record = {};
          for (let i = 0; i < item.length; i++) {
            record[fields[i].name] = item[i];
          }
          records.push(record);
        }

        resolve(records);
      }
    });
  });
}
