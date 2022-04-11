import { useState } from "react";

import { useDataObject } from "./context.js";

export type useRefreshRowButtonReturnValue = {
  /**
   * A boolean indicating if the record is currently being refreshed.
   */
  loading: boolean;
  /**
   * A function that can be passed to the button which refreshes the current
   * row, or if an index is passed, refreshes the row at that index.
   */
  onClick: (index?: number) => Promise<void>;
};

/**
 * Simple hook to connect a button to the refreshRow/refreshCurrentRow methods
 * of the data object. If and index is passed to the onClick handler, it will
 * refresh the row at that index. Otherwise, it will refresh the current row.
 */
export function useRefreshRowButton(): useRefreshRowButtonReturnValue {
  let dataObject = useDataObject();
  let [loading, setLoading] = useState(false);

  async function handleRefresh(index?: number) {
    try {
      setLoading(true);
      if (index !== undefined) {
        await dataObject.refreshRow(index);
      } else {
        await dataObject.refreshCurrentRow();
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    onClick: handleRefresh,
  };
}
