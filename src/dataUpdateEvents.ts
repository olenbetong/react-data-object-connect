import { DataObjectEvent } from "@olenbetong/data-object";

/**
 * A list of events that modifies the list of records in the data object.
 */
export const dataUpdateEvents: DataObjectEvent[] = [
  "onRecordCreated",
  "onRecordDeleted",
  "onRecordRefreshed",
  "onAfterSave",
  "onSaveFailed", // if saving a new record fails, it will still get a new index in the data object
  "onDataLoaded",
  "onPartialDataLoaded",
];

/**
 * A list of events that modifies the current record in the data object.
 */
export const recordUpdateEvents: DataObjectEvent[] = [
  "onFieldChanged",
  "onCancelEdit",
];
