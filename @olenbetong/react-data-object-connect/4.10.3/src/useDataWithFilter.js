import useData from "./useData";
import useFilter from "./useFilter";

export default function useDataWithFilter(dataObject, filterOrOptions, typeParam = "filterString") {
  let filter, type, options;

  if (typeof filterOrOptions === "object") {
    filter = filterOrOptions.filter;
    type = filterOrOptions.type ?? "filterString";
  } else {
    filter = filterOrOptions;
    type = typeParam;
  }

  const data = useData(dataObject, options);
  useFilter(dataObject, filter, type);

  return data;
}
