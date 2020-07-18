import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { store } from './../../../../../index';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr, BASE_AD } from '../../../../../store/addr';
import { setComments, addComment } from '../../../../../store/detailed_ad/actions';
import { openPopout, closePopout } from '../../../../../store/router/actions';

export default function useCommentsGet(ignorePopout, pageNumber, rowsPerPage, ad_id, maxAmount) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		store.dispatch(setComments([]));
		pageNumber = 1;
	}, []);

	useEffect(() => {
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
			url: Addr.getState() + BASE_AD + ad_id + '/comments',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				const newNots = res.data;

				newNots.forEach((comment) => {
					store.dispatch(addComment(comment));
				});

				setHasMore(newNots.length > 0);
				setLoading(false);
				if (!ignorePopout) {
					store.dispatch(closePopout());
				}
				setInited(true);
				console.log("success get comments", newNots)
			})
			.catch((e) => {
				console.log('fail comments', e);
				if (axios.isCancel(e)) return;

				if (!ignorePopout) {
					store.dispatch(closePopout());
				}
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
