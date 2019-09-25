import { useEffect, useState } from "react";

export default function usePaging(dataObject) {
  const [page, setPage] = useState(() => dataObject.getPagingComponent().getCurrentPage());
  const [pageCount, setPageCount] = useState(() => dataObject.getPagingComponent().getPageCount());

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
