import { FilterObject } from "@olenbetong/data-object";

export type FilterParameter = {
  filter: false | string | FilterObject;
  type: "filterString" | "whereClause" | "filterObject" | "whereObject";
};

export type FilterType =
  | "filterString"
  | "whereClause"
  | "filterObject"
  | "whereObject";

export type FilterOrOptions = false | string | FilterObject | FilterParameter;

/**
 * Checks if the given object is a filter parameter object or a filter expression.
 *
 * @param filterOrOptions Object with a filter expression, or an options object for the useFilter hook
 * @returns True if the filterOrOptions parameter is an options object
 */
export function isOptions(
  filterOrOptions: FilterOrOptions
): filterOrOptions is FilterParameter {
  return (
    filterOrOptions !== false &&
    filterOrOptions !== null &&
    typeof filterOrOptions !== "string" &&
    !["group", "expression"].includes(filterOrOptions.type)
  );
}
