import { useEffect, useState } from "react";
import axios from "axios";

import { Addr } from "./../../../../../store/addr";

export default function useAdSearch(query, pageNumber, rowsPerPage) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ads, setAds] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setAds([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: Addr.getState() + "/api/ad/find",
      params: { rows_per_page: rowsPerPage, page: pageNumber },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(res => {
          console.log("sucess", res)
          const newAds = res.data
        setAds(prev => {
          return [
            ...new Set([...prev, ...newAds])
          ];
        });
        setHasMore(newAds.length > 0);
        setLoading(false);
      })
      .catch(e => {
        console.log("fail", e)
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);

  console.log("our ads:", loading, error, ads, hasMore)
  return { loading, error, ads, hasMore };
}
