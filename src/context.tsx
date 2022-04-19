import { DataObject } from "@olenbetong/data-object";
import React, { createContext, useCallback, useContext, useMemo } from "react";

export type DataObjectContextValue<T> = DataObject<T>;

export const DataObjectContext = createContext<DataObjectContextValue<any>>(
  {} as DataObject<unknown>
);

export function useDataObject<T = { PrimKey: string }>(): DataObject<T> {
  return useContext(DataObjectContext) as DataObject<T>;
}

export type DataObjectProviderProps<T> = {
  children: React.ReactNode | React.ReactNode[];
  dataObject: DataObject<T>;
  /**
   * If true, children will be rendered inside a div element.
   * This element will catch keydown events for save (Ctrl+S) and cancel (Escape)
   */
  enableKeyboard?: boolean;
};

export function DataObjectProvider<T>({
  children,
  dataObject,
  enableKeyboard = false,
}: DataObjectProviderProps<T>) {
  let handleKeyDown = useCallback(
    async (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Escape" && dataObject.isDirty()) {
        evt.stopPropagation();
        dataObject.cancelEdit();
      } else if (evt.ctrlKey && evt.key === "s") {
        try {
          evt.stopPropagation();
          evt.preventDefault();
          await dataObject.endEdit();
        } catch (error) {
          if (error && "message" in (error as any)) {
            alert((error as any).message);
          } else {
            alert(String(error));
          }
        }
      }
    },
    [dataObject]
  );

  if (enableKeyboard) {
    return (
      <DataObjectContext.Provider value={dataObject}>
        <div tabIndex={0} role="none" onKeyDown={handleKeyDown}>
          {children}
        </div>
      </DataObjectContext.Provider>
    );
  }

  return (
    <DataObjectContext.Provider value={dataObject}>
      {children}
    </DataObjectContext.Provider>
  );
}
