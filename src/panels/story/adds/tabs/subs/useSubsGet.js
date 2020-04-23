import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr } from '../../../../../store/addr';

import { User } from '../../../../../store/user';

import { CategoryNo } from '../../../../template/Categories';

export default function useSubsGet(
	setPopout,
	pageNumber,
	rowsPerPage,
	ad_id,
	maxAmount,
	successCallback,
	failCallback
) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [subs, setSubs] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setSubs([]);
		pageNumber = 1;
	}, []);

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
			url: Addr.getState() + '/api/ad/' + ad_id + '/subscribers',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				console.log('sucess subs', res);
				const newNots = res.data;

				setSubs((prev) => {
					const v = [...new Set([...prev, ...newNots])];
					return v;
				});
				setHasMore(newNots.length > 0);
				setLoading(false);
				setPopout(null);
				setInited(true);
				successCallback(newNots)
			})
			.catch((e) => {
				console.log('fail subs', e);
				if (axios.isCancel(e)) return;

				setPopout(null);
				failCallback(e)
				setInited(true);
			});
		return () => cancel();
	}, [pageNumber]);

	return {
		inited,
		newPage: pageNumber,
		tsubs: subs,
		loading,
		error,
		hasMore,
	};
}
