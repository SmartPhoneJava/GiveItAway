import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr } from '../../../../../store/addr';

export default function useAdReceived(setPopout, pageNumber, rowsPerPage, user_id) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [ads, setAds] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setAds([]);
		pageNumber = 1;
	}, [user_id]);

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
			url: Addr.getState() + '/api/user/' + user_id + '/received',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				console.log('useAdReceived', res);
				const newAds = res.data;
				setAds((prev) => {
					return [...new Set([...prev, ...newAds])];
				});
				setHasMore(newAds.length > 0);
				setLoading(false);
				setPopout(null);
				setInited(true);
			})
			.catch((e) => {
				console.log('fail', e);
				if (axios.isCancel(e)) return;
				if (('' + e).indexOf('404') == -1) {
					setError(true);
				}
				setPopout(null);
				setInited(true);
			});
		return () => cancel();
	}, [pageNumber, user_id]);

	return { received_loading: loading, received: ads, received_hasMore: hasMore, received_newPage: pageNumber };
}
