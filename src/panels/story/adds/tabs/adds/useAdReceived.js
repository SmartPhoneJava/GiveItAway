import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Spinner } from '@vkontakte/vkui';

import { Addr, BASE_USER } from '../../../../../store/addr';
import { Headers, handleNetworkError } from '../../../../../requests';

export default function useAdReceived(setPopout, pageNumber, rowsPerPage, user_id, cache) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [ads, setAds] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setAds([]);
		pageNumber = 1;
		console.log('fuuuuun');
	}, [user_id]);

	useEffect(() => {
		setPopout(<Spinner size="small" />);
		setLoading(true);
		setError(false);
		setInited(false);

		let cancel;
		let clear = false;

		let params = {
			rows_per_page: rowsPerPage,
			page: pageNumber,
		};

		console.log('access one', pageNumber, cache.restore, cache.from(pageNumber, rowsPerPage).length);
		if (cache.restore && cache.from(pageNumber, rowsPerPage).length != 0) {
			setTimeout(() => {
				if (clear) {
					return;
				}
				console.log('received restore');
				setAds((prev) => [...new Set([...prev, ...cache.from(pageNumber, rowsPerPage)])]);
				setHasMore(true);
				setLoading(false);
				setPopout(null);
				setInited(true);
			}, 20);

			return;
		}

		axios({
			method: 'GET',
			url: Addr.getState() + BASE_USER + user_id + '/received',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
			headers: Headers(),
		})
			.then((res) => {
				if (clear) {
					return;
				}

				const newAds = res.data;
				setAds((prev) => {
					cache.to([...new Set([...prev, ...newAds])]);
					return [...new Set([...prev, ...newAds])];
				});
				setHasMore(newAds.length > 0);

				setLoading(false);
				setPopout(null);
				setInited(true);
			})
			.catch((error) =>
				handleNetworkError(error, null, (e) => {
					if (clear) {
						return;
					}
					console.log('fail', e);
					if (axios.isCancel(e)) return;
					if (('' + e).indexOf('404') == -1) {
						setError(true);
					}
					setPopout(null);
					setInited(true);
				})
			);

		return () => {
			cancel();
			clear = true;
		};
	}, [pageNumber, user_id]);

	return { loading, ads, hasMore, newPage: pageNumber };
}
