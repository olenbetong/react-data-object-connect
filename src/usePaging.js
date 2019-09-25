import { useEffect, useState } from "react";

export default function usePaging(dataObject) {
  const [page, setPage] = useState(() => dataObject.getPagingComponent().getCurrentPage());
  const [pageCount, setPageCount] = useState(() => dataObject.getPagingComponent().getPageCount());

  useEffect(() => {
    const paging = dataObject.getPagingComponent();

    const updateCurrentPage = () => setPage(paging.getCurrentPage());
    const updatePageCount = () => setPageCount(paging.getPageCount());

    paging.attach("on", "pageChange", updateCurrentPage);
    paging.attach("on", "pageCountChange", updatePageCount);

    return () => {
      paging.detach("on", "pageChange", updateCurrentPage);
      paging.detach("on", "pageCountChange", updatePageCount);
    };
  }, [dataObject]);

  return {
    page,
    pageCount,
    changePage: dataObject.getPagingComponent().changePage,
  };
}
