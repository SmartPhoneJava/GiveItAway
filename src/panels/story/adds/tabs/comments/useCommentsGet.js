import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr, BASE_AD } from '../../../../../store/addr';

export default function useCommentsGet(setPopout, query, pageNumber, rowsPerPage, ad_id, maxAmount) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [nots, setNots] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setNots([]);
		pageNumber = 1;
	}, [query]);

	useEffect(() => {
		if (maxAmount && maxAmount > 0 && maxAmount <= (pageNumber - 1) * rowsPerPage) {
			setHasMore(false);
			return;
		}
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
			url: Addr.getState() + BASE_AD + ad_id + '/comments',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				console.log('sucess comments', res);
				const newNots = res.data;

				setNots((prev) => {
					const v = [...new Set([...prev, ...newNots])];
					return v;
				});
				setHasMore(newNots.length > 0);
				setLoading(false);
				setPopout(null);
				setInited(true);
			})
			.catch((e) => {
				console.log('fail comments', e);
				if (axios.isCancel(e)) return;

				setPopout(null);
				setInited(true);
			});
		return () => cancel();
	}, [query, pageNumber]);

	return {
		inited,
		newPage: pageNumber,
		tnots: nots,
		loading,
		error,
		hasMore,
	};
}
