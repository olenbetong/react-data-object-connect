import { useDataObject } from "context";
import { useDirty } from "useDirty";
import { useStatus } from "useStatus";

export type useSaveButtonReturnValue = {
  /**
   * Whether the current record is dirty. Can be used to display an
   * indicator on the save button.
   */
  dirty: boolean;
  /**
   * Whether the current record is already saving. Can be used to display
   * a loading indicator.
   */
  isSaving: boolean;
  /**
   * An onClick method to pass to the button. Triggers endEdit, and displays
   * any error in an alert dialog.
   */
  onClick: () => Promise<void>;
};

/**
 * Simple hook that returns everything needed to connect a button to
 * the endEdit method of the data object.
 */
export function useSaveButton(): useSaveButtonReturnValue {
  let dataObject = useDataObject();
  let dirty = useDirty(dataObject);
  let { isSaving } = useStatus(dataObject);

  async function handleSave() {
    try {
      await dataObject.endEdit();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return {
    dirty,
    isSaving,
    onClick: handleSave,
  };
}
