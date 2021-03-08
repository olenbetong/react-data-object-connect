import { DataObjectEvent } from "@olenbetong/data-object/types/DataObject";

// A resusable array containing all data object events that should trigger an update
export const dataUpdateEvents: DataObjectEvent[] = [
  "onRecordCreated",
  "onRecordDeleted",
  "onRecordRefreshed",
  "onAfterSave",
  "onSaveFailed", // if saving a new record fails, it will still get a new index in the data object
  "onDataLoaded",
  "onPartialDataLoaded",
];

export const recordUpdateEvents: DataObjectEvent[] = ["onFieldChanged", "onCancelEdit"];
