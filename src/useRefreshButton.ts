import { useDataObject } from "context";
import { useLoading } from "useLoading";

export type useRefreshButtonReturnValue = {
  /**
   * A boolean indicating if the data object is currently loading data.
   */
  loading: boolean;
  /**
   * A function that refreshes the data object from the data provider context.
   */
  onClick: () => Promise<void>;
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
  };
}
