import { useEffect, useState } from "react";
import axios from "axios";

import { Addr } from "./../../../../../store/addr";

import { User } from "./AddsTab/../../../../../../store/user";

import { CategoryNo } from "./../../../../template/Categories";

let prevCategory = "";

export default function useAdSearch(
  query,
  category,
  mode,
  pageNumber,
  rowsPerPage
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ads, setAds] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setAds([]);
  }, [category, mode, query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    if (prevCategory != category) {
      pageNumber = 1;
    }
    console.log("prevCategory:", prevCategory, category, pageNumber);
    prevCategory = category;

    let params = {
      rows_per_page: rowsPerPage,
      page: pageNumber,
      category: category
    };
    if (category == "" || category == CategoryNo) {
      params = {
        rows_per_page: rowsPerPage,
        page: pageNumber
      };
    }
    if (mode != "all") {
      params.author_id = 343; //"User.getState().vk_id"
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
        if ((""+e).indexOf("404") == -1) {
          setError(true);
        }
      });
    return () => cancel();
  }, [category, mode, query, pageNumber]);

  return { newPage: pageNumber, loading, error, ads, hasMore };
}
