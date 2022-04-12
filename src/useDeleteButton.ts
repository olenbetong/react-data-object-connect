import { useDataObject } from "./context.js";
import { useStatus } from "./useStatus.js";

export type useDeleteButtonReturnValue = {
  /**
   * A boolean value indicating if the data object is currently deleting the current row
   */
  isDeleting: boolean;
  /**
   * The click function used to delete the current row. If a number is passed, the row
   * with that index will be deleted. Otherwise, the current row will be deleted.
   * @deprecated Use `deleteRow` instead
   */
  onClick: (index?: number) => Promise<void>;
  /**
   * Deletes a row on the data object found in the context. If an index is given,
   * deletes the row at the given index. Otherwise, deletes the current row.
   */
  deleteRow: (index?: number) => Promise<void>;
};

/**
 * A simple hooks that returns the properties needed to connect a button to the
 * delete methods of the data object. Uses the data object in the DataObjectContext
 */
export function useDeleteButton(prompt?: string): useDeleteButtonReturnValue {
  let dataObject = useDataObject();
  let { isDeleting } = useStatus(dataObject);

  async function handleDelete(index?: number) {
    try {
      if (
        window.confirm(prompt ?? "Are you sure you wish to delete this record?")
      ) {
        if (index !== undefined) {
          await dataObject.deleteRow(index);
        } else {
          await dataObject.deleteCurrentRow();
        }
      }
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return {
    isDeleting,
    onClick: handleDelete,
    deleteRow: handleDelete,
  };
}
