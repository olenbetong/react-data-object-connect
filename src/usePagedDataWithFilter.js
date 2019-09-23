import usePagedData from "./usePagedData";
import useFilter from "./useFilter";

export default function usePagedDataWithFilter(dataObject, filter, type = "filterString") {
  const data = usePagedData(dataObject);
  useFilter(dataObject, filter, type);

  return data;
}
