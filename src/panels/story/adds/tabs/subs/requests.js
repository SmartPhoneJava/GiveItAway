import axios from 'axios';

import { Addr, BASE_AD } from '../../../../../store/addr';

import { fail, success, Headers, handleNetworkError, StandardError, handleSpamError } from '../../../../../requests';
import { store } from '../../../../..';
import { deleteSub, addSub } from '../../../../../store/detailed_ad/actions';
import { updateContext } from '../../../../../store/router/actions';

export function getMyUser() {
	const vkUser = store.getState().vkui.myUser;
	return {
		vk_id: vkUser.id,
		name: vkUser.first_name,
		surname: vkUser.last_name,
		photo_url: vkUser.photo_100,
	};
}

const handleCarmaError = (error, another) => {
	if (error.response.status === 409) {
		fail('Недостаточно кармы. Откажитесь от другой вещи, чтобы получить эту!', null, end);
	} else {
		another(error);
	}
};

export function subscribe(ad_id, clCancel, s, f, e) {
	const end = e || (() => {});
	const successCallback = s || ((v) => {});
	const failCallback = f || ((v) => {});

	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/subscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			successCallback(response);

			const router = store.getState().router;
			const myUser = getMyUser();
			store.dispatch(addSub(myUser));
			store.dispatch(
				updateContext({
					isSub: true,
					// subs: [...router.activeContext[router.activeStory].subs.filter((v) => v.vk_id != myUser.vk_id), myUser],
				})
			);
			success('Теперь вы будете получать уведомления, связанные с этим постом', clCancel, end);
			return response;
		})
		.catch(
			(error) =>
				handleNetworkError(
					error,
					(error) =>
						handleSpamError(error, (error) =>
							handleCarmaError(error, (error) =>
								StandardError(
									error,
									() => {
										subscribe(ad_id, clCancel, successCallback, failCallback, end);
									},
									null,
									end
								)
							)
						),
					'Вы не можете откликнуться на это объявление, поскольку отписались от него несколько раз',
					null,
					end
				),
			end
		);
}

export function unsubscribe(ad_id, clCancel, s, f, e) {
	const end = e || (() => {});
	const successCallback = s || ((v) => {});
	const failCallback = f || ((v) => {});
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/unsubscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			const myID = getMyUser().vk_id;
			store.dispatch(deleteSub(myID));
			store.dispatch(
				updateContext({
					isSub: false,
				})
			);
			success('Больше вы не будете получать связанные с этим постом уведомления', clCancel, end);
			return response;
		})
		.catch((error) =>
			handleNetworkError(
				error,
				(error) =>
					StandardError(
						error,
						() => {
							unsubscribe(ad_id, clCancel);
						},
						null,
						end
					),
				failCallback
			)
		);
}
