import useData from "./useData";
import useFilter from "./useFilter";

export default function useDataWithFilter(dataObject, filter, type = "filterString") {
  const data = useData(dataObject);
  useFilter(dataObject, filter, type);

  return data;
}
