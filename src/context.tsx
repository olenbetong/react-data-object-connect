import { DataObject } from "@olenbetong/data-object";
import { createContext, useContext } from "react";

export type DataObjectContextValue<T> = DataObject<T>;

export const DataObjectContext = createContext<DataObjectContextValue<any>>(
  {} as DataObject<unknown>
);

export function useDataObject<T = { PrimKey: string }>(): DataObject<T> {
  return useContext(DataObjectContext) as DataObject<T>;
}

export type DataObjectProviderProps<T> = {
  children:
    | React.ReactChild
    | React.ReactChildren
    | React.ReactNode
    | React.ReactNodeArray;
  dataObject: DataObject<T>;
};

export function DataObjectProvider<T>({
  children,
  dataObject,
}: DataObjectProviderProps<T>) {
  return (
    <DataObjectContext.Provider value={dataObject}>
      {children}
    </DataObjectContext.Provider>
  );
}
