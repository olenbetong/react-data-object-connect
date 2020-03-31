import { useEffect, useState } from "react";

export default function usePaging(dataObject) {
  const [page, setPage] = useState(() => dataObject.getPagingComponent().getCurrentPage());
  const [pageCount, setPageCount] = useState(() => dataObject.getPagingComponent().getPageCount());

  useEffect(() => {
    let [major, minor] = (dataObject.version ?? "0.6.0").split(".");
    let paging = dataObject.getPagingComponent();

    let updateCurrentPage = () => setPage(paging.getCurrentPage());
    let updatePageCount = () => setPageCount(paging.getPageCount());

    if (major === "0" && Number(minor) <= 6) {
      paging.attach("on", "pageChange", updateCurrentPage);
      paging.attach("on", "pageCountChange", updatePageCount);
    } else {
      paging.attach("pageChange", updateCurrentPage);
      paging.attach("pageCountChange", updatePageCount);
    }

    return () => {
      if (major === "0" && Number(minor) <= 6) {
        paging.detach("on", "pageChange", updateCurrentPage);
        paging.detach("on", "pageCountChange", updatePageCount);
      } else {
        paging.detach("pageChange", updateCurrentPage);
        paging.detach("pageCountChange", updatePageCount);
      }
    };
  }, [dataObject]);

  return {
    page,
    pageCount,
    changePage: dataObject.getPagingComponent().changePage,
  };
}
