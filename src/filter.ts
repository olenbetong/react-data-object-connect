import { Filter } from "@olenbetong/data-object";

export type FilterParameter = {
  filter: false | string | Filter;
  type: "filterString" | "whereClause" | "filterObject" | "whereObject";
};

export type FilterType =
  | "filterString"
  | "whereClause"
  | "filterObject"
  | "whereObject";

export type FilterOrOptions = false | string | Filter | FilterParameter;

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
