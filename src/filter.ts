import { FilterObject } from "@olenbetong/data-object";

export type FilterParameter = {
  filter: false | string | FilterObject;
  type: "filterString" | "whereClause" | "filterObject" | "whereObject";
};

export type FilterType = "filterString" | "whereClause" | "filterObject" | "whereObject";

export type FilterOrOptions = false | string | FilterObject | FilterParameter;

export function isOptions(filterOrOptions: FilterOrOptions): filterOrOptions is FilterParameter {
  return (
    filterOrOptions !== false &&
    filterOrOptions !== null &&
    typeof filterOrOptions !== "string" &&
    !["group", "expression"].includes(filterOrOptions.type)
  );
}
