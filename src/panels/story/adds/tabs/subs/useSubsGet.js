import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { store } from './../../../../../index';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr, BASE_AD } from '../../../../../store/addr';
import { setSubs, addSub } from '../../../../../store/detailed_ad/actions';
import { openPopout, closePopout } from '../../../../../store/router/actions';

export default function useSubsGet(
	ignorePopout,
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

	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		store.dispatch(setSubs([]));
		pageNumber = 1;
	}, []);

	useEffect(() => {
		let cancelFunc = false
		if (maxAmount && maxAmount > 0 && maxAmount <= (pageNumber - 1) * rowsPerPage) {
			setHasMore(false);
			return;
		}
		if (!ignorePopout) {
			console.log("lock lock lock4")
			store.dispatch(openPopout(<ScreenSpinner size="large" />));
		}
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
			url: Addr.getState() + BASE_AD + ad_id + '/subscribers',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				console.log('sucess subs', res);
				const newNots = res.data;

				newNots.forEach((sub) => {
					store.dispatch(addSub(sub));
				});

				setHasMore(newNots.length > 0);
				setLoading(false);

				if (!ignorePopout) {
					store.dispatch(closePopout());
				}
				setInited(true);
				successCallback(newNots);
			})
			.catch((e) => {
				console.log('ERROR useSubsGet:', e);
				if (axios.isCancel(e)) return;

				if (!ignorePopout) {
					store.dispatch(closePopout());
				}
				failCallback(e);
				setInited(true);
			});
		return () => cancel();
	}, [pageNumber]);

	return {
		inited,
		newPage: pageNumber,
		loading,
		error,
		hasMore,
	};
}
