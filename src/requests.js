import React from 'react';
import { ScreenSpinner, Snackbar, Avatar, Spinner } from '@vkontakte/vkui';

import axios from 'axios';

import { Addr, BASE_AD, BASE_DEAL, BASE_USER, BASE } from './store/addr';

import { User } from './store/user';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import { AD_LOADING, STATUS_OFFER, STATUS_CHOSEN } from './const/ads';
import { SNACKBAR_DURATION_DEFAULT } from './store/const';
import { store } from '.';
import { openPopout, closePopout, openSnackbar, closeSnackbar } from './store/router/actions';
import { setCost, setDealer, setDeal, setStatus } from './store/detailed_ad/actions';
import { updateDealInfo } from './store/detailed_ad/update';

export function success(text, cancelMe, end) {
	const close = () => {
		store.dispatch(closeSnackbar());
		if (end) {
			end();
		}
	};

	const snack = (
		<Snackbar
			duration={SNACKBAR_DURATION_DEFAULT}
			onClose={close}
			action={cancelMe ? 'Отменить' : null}
			onActionClick={cancelMe}
			before={
				<Avatar size={24} style={{ background: 'green' }}>
					<Icon24DoneOutline fill="#fff" width={14} height={14} />
				</Avatar>
			}
		>
			{text}
		</Snackbar>
	);

	store.dispatch(openSnackbar(snack));
}

export function sendSnack(text) {
	store.dispatch(
		openSnackbar(
			<Snackbar
				style={{ zIndex: '120' }}
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={() => {
					store.dispatch(closeSnackbar());
				}}
				before={
					<Avatar size={24} style={{ background: 'green' }}>
						<Icon24DoneOutline fill="#fff" width={14} height={14} />
					</Avatar>
				}
			>
				{text}
			</Snackbar>
		)
	);
}

export function getToken(successCallback, failCallBack) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE + 'ws_token',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getToken:', response);

			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			if (failCallBack) {
				failCallBack(error);
			}
		});
}

//
// export function sendNotificationToBot(successCallback, failCallBack, notification, user_id) {

// 	let cancel;
// 	axios({
// 		method: 'get',
// 		withCredentials: true,
// 		url: AddrBot.getState() + '/',
// 		data: JSON.stringify({
// 			notification,
// 			user_id,
// 		}),
// 		cancelToken: new axios.CancelToken((c) => (cancel = c)),
// 	})
// 		.then(function (response) {
// 			console.log('response from getNotificationCounter:', response);

// 			return response.data;
// 		})
// 		.then(function (response) {
// 			if (successCallback) {
// 				successCallback(response);
// 			}
// 			return response;
// 		})
// 		.catch(function (error) {
// 			if (failCallBack) {
// 				failCallBack(error);
// 			}
// 		});
// 	return;
// }
//

export async function getNotificationCounter(successCallback, failCallBack) {
	let err = false;
	let cancel;
	const deal = await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE + 'notifications_count',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getNotificationCounter:', response);

			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			if (failCallBack) {
				failCallBack(error);
			}
			err = true;
		});
	return { deal, err };
}

export async function adHide(ad_id, callback) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let err = false;
	let cancel;

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/set_hidden',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from adHide:', response);
			return response.data;
		})
		.then(function (response) {
			store.dispatch(closePopout());
			success('Объявление скрыто');
			callback(response);
			return response;
		})
		.catch(function (error) {
			store.dispatch(closePopout());
			err = true;
			fail('Нет соединения с сервером', () => adHide(ad_id, callback));
		});
	return err;
}

export async function adVisible(ad_id, callback) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let err = false;
	let cancel;

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/set_visible',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from adVisible:', response);
			return response.data;
		})
		.then(function (response) {
			store.dispatch(closePopout());
			success('Объявление открыто для просмотра');
			callback(response);
			return response;
		})
		.catch(function (error) {
			store.dispatch(closePopout());
			err = true;
			fail('Нет соединения с сервером', () => adVisible(ad_id, callback));
		});
	return err;
}

export async function getDeal(ad_id, successCallback, failCallback) {
	let err = false;
	let cancel;
	const deal = await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getDeal:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			err = true;
			if (failCallback) {
				failCallback(error);
			}
		});
	return { deal, err };
}

export async function getCost(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/bid_for_user',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('getCost response:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			console.log('ERROR getCost:', error);
			if (failCallback) {
				failCallback(error);
			}
		});
}

export async function getAuctionMaxUser(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/max_bid_user',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('getAuctionMaxUser response:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			console.log('getAuctionMaxUser getCashback:', error);
			if (failCallback) {
				failCallback(error);
			}
		});
}

export async function increaseAuctionRate(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'put',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/increase_bid',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('increaseAuctionRate response:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			console.log('increaseAuctionRate fail:', error);
			if (failCallback) {
				failCallback(error);
			}
		});
}

export async function getCashback(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/return_bid_size',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('getCashback response:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			store.dispatch(setCost(response.bid));
			return response;
		})
		.catch(function (error) {
			console.log('ERROR getCashback:', error);
			if (failCallback) {
				failCallback(error);
			}
		});
}

export async function denyDeal(deal_id, successCallback, failCallback, end, text) {
	console.log('denyDeall', deal_id);
	let dtext = text || 'Ваш отказ принят!';
	let err = false;
	let cancel;
	store.dispatch(openPopout(<ScreenSpinner size="large" />));

	console.log('denyDeal', deal_id);

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_DEAL + deal_id + '/cancel',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from denyDeal:', response);
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			success(dtext, null, end);
			store.dispatch(closePopout());
			return response;
		})
		.catch(function (error) {
			err = true;
			fail(
				'Нет соединения с сервером',
				() => {
					denyDeal(deal_id, successCallback, failCallback, end, text);
				},
				end
			);
			failCallback(error);
			store.dispatch(closePopout());
		});
	return err;
}

export function acceptDeal(deal_id, successCallback, failCallback, end) {
	let cancel;
	store.dispatch(openPopout(<ScreenSpinner size="large" />));

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_DEAL + deal_id + '/fulfill',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from acceptDeal:', response);

			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			store.dispatch(closePopout());
			success('Автор благодарит вас за подтверждение!', null, end);
			return response;
		})
		.catch(function (error) {
			fail(
				'Нет соединения с сервером',
				() => {
					acceptDeal(deal_id, successCallback, failCallback, end);
				},
				end
			);
			failCallback(error);
			store.dispatch(closePopout());
		});
}

export async function CancelClose(ad_id, s, f, blockSnackbar) {
	const successCallback = s || ((v) => {});
	const failCallback = f || ((v) => {});
	getDeal(
		ad_id,
		(deal) => {
			denyDeal(
				deal.deal_id,
				(v) => {
					if (!blockSnackbar) {
						success('Запрос успешно отменен!');
					}
					store.dispatch(setDealer(null));
					store.dispatch(setDeal(null));
					store.dispatch(setStatus(STATUS_OFFER));
					successCallback(v);
				},
				(e) => failCallback(e),
				null,
				'Предложение о передаче вещи отменено'
			);
		},
		(err) => {
			console.log('CancelClose 3', err);
		}
	);
}

export function Close(ad_id, ad_type, subscriber_id, s, f) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	const successCallback = s || ((v) => {});
	const failCallback = f || ((e) => {});
	let err = false;
	let cancel;
	let params = { type: ad_type };
	if (subscriber_id > 0) {
		params.subscriber_id = subscriber_id;
	}
	console.log('loooook at ad_type', ad_type);
	axios({
		method: 'put',
		withCredentials: true,
		params,
		url: Addr.getState() + BASE_AD + ad_id + '/make_deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			store.dispatch(closePopout());
			store.dispatch(setStatus(STATUS_CHOSEN));
			updateDealInfo();
			console.log('response from Close:', response);
			success('Спасибо, что делаете других людей счастливыми :) Ждем подтверждения от второй стороны!', () => {
				CancelClose(ad_id);
			});
			return response.data;
		})
		.then(function (data) {
			successCallback(data);
			return data;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail('Нет соединения с сервером');
			store.dispatch(closePopout());
		});
	return err;
}

export async function getSubscribers(ad_id, successCallback, failCallback, count) {
	let err = false;
	let cancel;
	const subscribers = await axios({
		method: 'get',
		withCredentials: true,
		params: { page: 1, rows_per_page: count },
		url: Addr.getState() + BASE_AD + ad_id + '/subscribers',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getSubscribes:', response);
			if (response.status != 404 && response.status != 200) {
				err = true;
			}
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			return response;
		})
		.catch(function (error) {
			if (err) {
				fail('Нет соединения с сервером');
			}
			if (failCallback) {
				failCallback(error);
			}
		});
	return { subscribers, err };
}

export async function getDetails(ad_id, successCallback, failCallback) {
	let err = false;
	let cancel;
	const data = await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/details',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getDetails:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			err = true;
			if (failCallback) {
				failCallback(error);
			}
		});

	return { details: data, err };
}

// export async function canWritePrivateMessage(id, appID, apiVersion, successCallback, failCallback) {
// 	bridge
// 		.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' })
// 		.then((data) => {
// 			bridge
// 				.send('VKWebAppCallAPIMethod', {
// 					method: 'users.get',
// 					request_id: 'canWritePrivateMessage' + request_id,
// 					params: {
// 						v: apiVersion,
// 						user_ids: id,
// 						fields: 'is_closed',
// 						access_token: data.access_token,
// 					},
// 				})
// 				.then(function (response) {
// 					console.log('success canWritePrivateMessage:', response);
// 					return response.response[0].is_closed;
// 				})
// 				.then((data) => {
// 					if (successCallback) {
// 						successCallback(data);
// 					}
// 					return data;
// 				})
// 				.catch(function (error) {
// 					if (failCallback) {
// 						failCallback(error);
// 					}
// 					console.log('fail canWritePrivateMessage:', error);
// 				});
// 			return data;
// 		})
// 		.catch(function (error) {
// 			if (failCallback) {
// 				failCallback(error);
// 			}
// 			console.log('fail VKWebAppGetAuthToken:', error);
// 		});
// 	request_id++;
// }

export async function Auth(user, successCallback, failCallback) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	// console.log('secret:', window.location.href);
	// console.log('user:', user);
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		data: JSON.stringify({
			vk_id: user.id,
			Url: window.location.href,
			name: user.first_name,
			surname: user.last_name,
			photo_url: user.photo_100,
		}),
		url: Addr.getState() + BASE_USER + 'auth',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (data) {
			store.dispatch(closePopout());
			successCallback(data);
			User.dispatch({ type: 'set', new_state: data });
			return data;
		})
		.catch(function (error) {
			store.dispatch(closePopout());
			failCallback(error);
			fail('Не удалось авторизоваться');
		});
}

export async function CreateImages(photos, id, goToAds) {
	let err = false;
	let s = 0;
	const snackbar = (
		<Snackbar
			duration={SNACKBAR_DURATION_DEFAULT}
			onClose={() => {
				store.dispatch(closeSnackbar());
			}}
			action="Отменить"
			onActionClick={() => deleteAd(id, refresh)}
			before={
				<Avatar size={24} style={{ background: 'green' }}>
					<Icon24DoneOutline fill="#fff" width={14} height={14} />
				</Avatar>
			}
		>
			Объявление создано! Спасибо, что делаете мир лучше :)
		</Snackbar>
	);
	if (!photos) {
		goToAds(snackbar);
		return;
	}
	photos.forEach((photo, i) => {
		const data = new FormData();
		data.append('file', photo.origin);
		let cancel;

		axios({
			method: 'post',
			url: Addr.getState() + BASE_AD + id + '/upload_image',
			withCredentials: true,
			data: data,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then(function (response) {
				console.log('success uploaded', s, photos.length - 1);
				s++;
				if (s == photos.length) {
					goToAds(snackbar);
				}
			})
			.catch(function (error) {
				console.log('failed uploaded', error);
				err = true;
			});
		if (err) {
			throw new Error('Ошибка у изображения!');
		}
	});
	if (err) {
		throw new Error('Ошибка у изображения!');
	}
}

export function CreateAd(ad, obj, photos, openAd, loadAd, successcallback) {
	store.dispatch(openPopout(<Spinner size="large" />));
	let cancel;
	axios({
		method: 'post',
		url: Addr.getState() + BASE_AD + 'create',
		withCredentials: true,
		data: obj,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(async function (response) {
			store.dispatch(closePopout());

			if (response.status != 201) {
				throw new Error('Не тот код!');
			}
			ad.ad_id = response.data.ad_id;
			openAd(ad);
			await CreateImages(photos, response.data.ad_id, (snackbar) => {
				if (successcallback) {
					successcallback();
				}
				store.dispatch(openSnackbar(snackbar));
				getDetails(response.data.ad_id, loadAd);
			});
			return response;
		})
		.then(function (response) {
			return response;
		})
		.catch(function (error) {
			store.dispatch(closePopout());
			console.log('Request failed', error);

			fail('Нет соединения с сервером', () => createAd(ad, obj, photos, openAd, loadAd, successcallback));
		});
	return;
}

export async function EditAd(ad, obj, openAd, successcallback) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let cancel;

	await axios({
		method: 'put',
		url: Addr.getState() + BASE_AD + ad.ad_id + '/edit',
		withCredentials: true,
		data: obj,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(async function (response) {
			store.dispatch(closePopout());

			openAd(ad);
			if (successcallback) {
				successcallback();
			}
			success('Изменения сохранены');
			return response;
		})
		.catch(function (error) {
			store.dispatch(closePopout());
			console.log('Request failed', error);
			fail('Нет соединения с сервером', () => EditAd(ad, obj, openAd, successcallback));
		});
	return;
}

export const deleteAd = (ad_id, refresh) => {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let cancel;

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/delete',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			store.dispatch(closePopout());
			if (response.status != 200) {
				fail(response.status + ' - ' + response.statusText, () => deleteAd(ad_id, refresh));
			} else {
				refresh(ad_id);
				success('Объявление удалено!');
			}
			return response.data;
		})
		.catch(function (error) {
			store.dispatch(closePopout());
			console.log('Request failed', error);
			fail('Нет соединения с сервером', () => deleteAd(ad_id, refresh));
		});
};

export function fail(err, repeat, end) {
	{
		let open;
		console.log('we wanna set snackbar', err);
		if (repeat) {
			open = () =>
				store.dispatch(
					openSnackbar(
						<Snackbar
							duration={SNACKBAR_DURATION_DEFAULT}
							onClose={() => {
								store.dispatch(closeSnackbar());
								if (end) {
									end();
								}
							}}
							action="Повторить"
							onActionClick={() => {
								store.dispatch(closeSnackbar());
								repeat();
							}}
							before={
								<Avatar size={24} style={{ background: 'red' }}>
									<Icon24Cancel fill="#fff" width={14} height={14} />
								</Avatar>
							}
						>
							Произошла ошибка: {err}
						</Snackbar>
					)
				);
		} else {
			open = () =>
				store.dispatch(
					openSnackbar(
						<Snackbar
							duration={SNACKBAR_DURATION_DEFAULT}
							onClose={() => store.dispatch(closeSnackbar())}
							before={
								<Avatar size={24} style={{ background: 'red' }}>
									<Icon24Cancel fill="#fff" width={14} height={14} />
								</Avatar>
							}
						>
							Произошла ошибка: {err}
						</Snackbar>
					)
				);
		}
		store.dispatch(open);
	}
}

export async function getPermissionPM(user_id, successCallback, failCallback) {
	let err = false;
	let cancel;
	const deal = await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_USER + user_id + '/nots_pm',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getPermissionPM:', response);
			return response.data;
		})
		.then(function (response) {
			const canSend = response.can_send;
			if (successCallback) {
				successCallback(canSend);
			}
			return canSend;
		})
		.catch(function (error) {
			err = true;
			if (failCallback) {
				failCallback(error);
			}
		});
	return { deal, err };
}

export async function setPermissionPM(user_id, can_send, successCallback, failCallback) {
	let err = false;
	let cancel;
	const deal = await axios({
		method: 'post',
		withCredentials: true,
		data: JSON.stringify({
			can_send,
		}),
		url: Addr.getState() + BASE_USER + user_id + '/nots_pm',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from setPermissionPM:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			err = true;
			if (failCallback) {
				failCallback(error);
			}
		});
	return { deal, err };
}

// 745 -> 600 -> 806
