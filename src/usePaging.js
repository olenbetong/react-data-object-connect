import { useEffect, useState } from "react";

export default function usePaging(dataObject) {
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const paging = dataObject.getPagingComponent();

    paging.attach("on", "pageChange", () => setPage(paging.getCurrentPage()));
    paging.attach("on", "pageCountChange", () => setPageCount(paging.getPageCount));
  }, [dataObject]);

  return {
    page,
    pageCount,
    changePage: dataObject.getPagingComponent().changePage,
  };
}
