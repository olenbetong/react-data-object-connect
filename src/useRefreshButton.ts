import { useDataObject } from "./context.js";
import { useLoading } from "./useLoading.js";

export type useRefreshButtonReturnValue = {
  /**
   * A boolean indicating if the data object is currently loading data.
   */
  loading: boolean;
  /**
   * A function that refreshes the data object from the data provider context.
   * @deprecated Use `refresh` instead.
   */
  onClick: () => Promise<void>;
  /**
   * Refreshes the data object found in the data provider context.
   */
  refresh: () => Promise<void>;
};

/**
 * Simple hook that returns everything needed to make a button refresh the data object
 * in the data provider context, and show a loading indicator.
 */
export function useRefreshButton(): useRefreshButtonReturnValue {
  let dataObject = useDataObject();
  let loading = useLoading(dataObject);

  return {
    loading,
    onClick: () => dataObject.refreshDataSource(),
    refresh: () => dataObject.refreshDataSource(),
  };
}
