import { useDataObject } from "./context.js";

/**
 * Simple hook to connect a button to the cancelEdit method
 * in the data object.
 */
export function useCancelButton() {
  let dataObject = useDataObject();

  function handleCancel() {
    try {
      dataObject.cancelEdit();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return {
    onClick: handleCancel,
  };
}
