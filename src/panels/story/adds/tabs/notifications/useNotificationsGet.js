import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Addr, BASE } from '../../../../../store/addr';
import { Headers, handleNetworkError } from '../../../../../requests';

export default function useNotificationsGet(pageNumber, rowsPerPage) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [nots, setNots] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setLoading(true);
		setError(false);
		setInited(false);
		let cancel;

		let params = {
			rows_per_page: rowsPerPage,
			page: pageNumber,
		};

		axios({
			method: 'GET',
			url: Addr.getState() + BASE + 'notifications',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
			headers: Headers(),
		})
			.then((res) => {
				const newNots = res.data;
				setNots((prev) => {
					return [...new Set([...prev, ...newNots])];
				});
				setHasMore(newNots.length > 0 && newNots.length == rowsPerPage);
				setLoading(false);
				setInited(true);
			})
			.catch((error) =>
				handleNetworkError(error, null, (e) => {
					setError(true);
					if (axios.isCancel(e)) return;

					setLoading(false);
					setInited(true);
				})
			);

		return () => cancel();
	}, [pageNumber]);

	return { inited, newPage: pageNumber, nots, loading, error, hasMore };
}
