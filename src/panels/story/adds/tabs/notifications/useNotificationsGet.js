import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr, BASE } from '../../../../../store/addr';

export default function useNotificationsGet(setPopout, query, pageNumber, rowsPerPage) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [nots, setNots] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setPopout(<ScreenSpinner size="large" />);
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
			url: Addr.getState() + BASE + '/api/notifications',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				const newNots = res.data;
				setNots((prev) => {
					return [...new Set([...prev, ...newNots])];
				});
				setHasMore(newNots.length > 0);
				setLoading(false);
				setPopout(null);
				setInited(true);
			})
			.catch((e) => {
				console.log('fail', e);
				setError(true);
				if (axios.isCancel(e)) return;

				setPopout(null);
				setInited(true);
			});
		return () => cancel();
	}, [query, pageNumber]);

	return { inited, newPage: pageNumber, nots, loading, error, hasMore };
}
