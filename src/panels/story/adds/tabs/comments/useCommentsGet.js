import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { store } from './../../../../../index';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr, BASE_AD } from '../../../../../store/addr';
import { openPopout, closePopout, updateContext } from '../../../../../store/router/actions';
import { Headers, handleNetworkError } from '../../../../../requests';

export default function useCommentsGet(ignorePopout, pageNumber, rowsPerPage, ad_id, maxAmount) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		store.dispatch(updateContext({ comments: [] }));

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

		const router = store.getState().router;

		axios({
			method: 'GET',
			url: Addr.getState() + BASE_AD + ad_id + '/comments',
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
			headers: Headers(),
		})
			.then((res) => {
				const newNots = res.data;

				let newComments = router.activeContext[router.activeStory].comments || [];
				newNots.forEach((comment) => {
					//store.dispatch(addComment(comment));
					//store.dispatch(updateContext([...store.getState().comments, ...newNots]));
					newComments = [...newComments.filter((v) => v.comment_id != comment.comment_id), comment];
				});
				//const oldComments = router.activeContext[router.activeStory].comments || [];

				// newComments.filter((v, i) => i == newComments.indexOf(v));
				// console.log(
				// 	'new and old',
				// 	newComments,
				// 	[...oldComments, ...newNots],
				// 	removeDuplicates([...oldComments, ...newNots])
				// );
				store.dispatch(updateContext({ comments: newComments }));

				setHasMore(newNots.length > 0);
				setLoading(false);
				setInited(true);
			})
			.catch((error) =>
				handleNetworkError(error, null, (e) => {
					if (axios.isCancel(e)) return;

					setLoading(false);
					setInited(true);
					setHasMore(false);
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
