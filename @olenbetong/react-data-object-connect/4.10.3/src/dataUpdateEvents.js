// A resusable array containing all data object events that should trigger an update
export const dataUpdateEvents = [
  "onRecordCreated",
  "onRecordDeleted",
  "onRecordRefreshed",
  "onAfterSave",
  "onSaveFailed", // if saving a new record fails, it will still get a new index in the data object
  "onDataLoaded",
  "onPartialDataLoaded",
];

export const recordUpdateEvents = ["onFieldChanged", "onCancelEdit"];
