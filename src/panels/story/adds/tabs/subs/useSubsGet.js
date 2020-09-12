import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { store } from './../../../../../index';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr, BASE_AD } from '../../../../../store/addr';
import { setSubs, addSub } from '../../../../../store/detailed_ad/actions';
import { openPopout, closePopout } from '../../../../../store/router/actions';
import { Headers, handleNetworkError } from '../../../../../requests';

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
		let cancelFunc = false;
		if (maxAmount && maxAmount > 0 && maxAmount <= (pageNumber - 1) * rowsPerPage) {
			setHasMore(false);
			return;
		}
		if (!ignorePopout) {
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
			headers: Headers(),
		})
			.then((res) => {
				const newNots = res.data;

				newNots.forEach((sub) => {
					store.dispatch(addSub(sub));
				});

				setHasMore(newNots.length > 0);
				setLoading(false);

				setInited(true);
				successCallback(newNots);
			})
			.catch((error) =>
				handleNetworkError(error, null, (e) => {
					failCallback(e);
					setInited(true);
				})
			)
			.finally(() => {
				if (!ignorePopout) {
					store.dispatch(closePopout());
				}
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
