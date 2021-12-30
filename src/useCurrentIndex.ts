import { DataObject } from "@olenbetong/data-object";
import { useEffect, useState } from "react";

/**
 * Hook to return the current index of the data object.
 *
 * @param dataObject Data object to get current index from
 * @returns The current index of the data object
 */
export function useCurrentIndex(dataObject: DataObject<any>) {
  const [index, setIndex] = useState(dataObject.getCurrentIndex());

  useEffect(() => {
    /**
     * Handles the onCurrentIndexChanged event. The event parameter changed
     * so to maintain backwards compatability we need to check if the event
     * parameter is a number. If it is we assume it is the new index.
     * Otherwise it should be a CustomEvent with a detail property that is
     * the new index.
     *
     * @param evtOrIndex Either a CustomEvent or an index number
     */
    function handleCurrentIndexChanged(
      evtOrIndex?: number | CustomEvent<number>
    ) {
      if (typeof evtOrIndex === "number") {
        setIndex(evtOrIndex);
      } else if (
        typeof evtOrIndex === "object" &&
        typeof evtOrIndex.detail === "number"
      ) {
        setIndex(evtOrIndex.detail);
      }
    }
    dataObject.attachEvent("onCurrentIndexChanged", handleCurrentIndexChanged);

    setIndex(dataObject.getCurrentIndex());

    return () =>
      dataObject.detachEvent(
        "onCurrentIndexChanged",
        handleCurrentIndexChanged
      );
  }, [dataObject]);

  return index;
}
