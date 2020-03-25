import { useEffect, useState } from "react";
import axios from "axios";

import { Addr } from "./../../../../../store/addr";

let prevCategory = ""

export default function useAdSearch(query, category, pageNumber, rowsPerPage) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ads, setAds] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setAds([]);
  }, [category, query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    if (prevCategory != category) {
        pageNumber = 1
      }
      console.log("prevCategory:", prevCategory, category, pageNumber)
      prevCategory = category

    let params = {
      rows_per_page: rowsPerPage,
      page: pageNumber,
      category: category
    };
    if (category == "" || category == "не указана") {
      params = {
        rows_per_page: rowsPerPage,
        page: pageNumber
      };
    }

    axios({
      method: "GET",
      url: Addr.getState() + "/api/ad/find",
      params,
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(res => {
        console.log("sucess", res);
        const newAds = res.data;
        setAds(prev => {
          return [...new Set([...prev, ...newAds])];
        });
        setHasMore(newAds.length > 0);
        setLoading(false);
      })
      .catch(e => {
        console.log("fail", e);
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [category, query, pageNumber]);

  return { newPage: pageNumber, loading, error, ads, hasMore };
}
