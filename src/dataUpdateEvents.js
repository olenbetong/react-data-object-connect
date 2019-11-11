// A resusable array containing all data object events that should trigger an update
export const dataUpdateEvents = [
  "onRecordCreated",
  "onRecordDeleted",
  "onRecordRefreshed",
  "onAfterSave",
  "onDataLoaded",
  "onPartialDataLoaded",
];

export const recordUpdateEvents = ["onFieldChanged", "onCancelEdit"];
