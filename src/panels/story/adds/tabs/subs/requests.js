import axios from 'axios';

import { Addr, BASE_AD } from '../../../../../store/addr';

import { fail, success } from '../../../../../requests';
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

export function subscribe(ad_id, clCancel, s, f, e) {
	const end = e || (() => {});
	const successCallback = s || ((v) => {});
	const failCallback = f || ((v) => {});
	let err = false;
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/subscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: { ...axios.defaults.headers, Authorization: 'Bearer' + window.sessionStorage.getItem('jwtToken') },
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
		.catch(function (error) {
			err = true;
			failCallback(error);

			if (error == 'Error: Request failed with status code 409') {
				fail('Недостаточно кармы. Откажитесь от другой вещи, чтобы получить эту!', null, end);
			} else {
				if (error.response.status === 429) {
					failEasy('Вы не можете откликнуться на это объявление, поскольку отписались от него несколько раз');
				} else {
					fail(
						'Нет соединения с сервером',
						() => {
							subscribe(ad_id, clCancel, successCallback, failCallback, end);
						},
						end
					);
				}
			}
		});
	return err;
}

export function unsubscribe(ad_id, clCancel, s, f, e) {
	const end = e || (() => {});
	const successCallback = s || ((v) => {});
	const failCallback = f || ((v) => {});
	let err = false;
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/unsubscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: { ...axios.defaults.headers, Authorization: 'Bearer' + window.sessionStorage.getItem('jwtToken') },
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			const router = store.getState().router;
			const myID = getMyUser().vk_id;
			store.dispatch(deleteSub(myID));
			store.dispatch(
				updateContext({
					isSub: false,
					//subs: router.activeContext[router.activeStory].subs.filter((v) => v.vk_id != myID),
				})
			);
			success('Больше вы не будете получать связанные с этим постом уведомления', clCancel, end);
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Нет соединения с сервером',
				() => {
					unsubscribe(ad_id, clCancel);
				},
				end
			);
		});
	return err;
}
