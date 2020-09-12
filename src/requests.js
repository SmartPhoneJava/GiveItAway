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
import { openPopout, closePopout, openSnackbar, closeSnackbar, updateContext } from './store/router/actions';
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
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, null, failCallBack));
}

export function getNotificationCounter(successCallback, failCallBack) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE + 'notifications_count',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) =>
			handleNetworkError(error, null, (error) => {
				err = true;
				failCallBack(error);
			})
		);
}

export function adHide(ad_id, successCallbackR, failCallBackR) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let cancel;
	const successCallback = (response) => {
		success('Объявление скрыто');
		successCallbackR(response);
		return response;
	};

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/set_hidden',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) =>
			handleNetworkError(
				error,
				(error) => StandardError(error, () => adVisible(ad_id, successCallbackR, failCallBackR)),
				failCallBackR
			)
		)
		.finally(() => {
			store.dispatch(closePopout());
		});
}

export function adVisible(ad_id, successCallbackR, failCallBackR) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));

	let cancel;
	const successCallback = (response) => {
		success('Объявление открыто для просмотра');
		successCallbackR(response);
		return response;
	};

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/set_visible',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) =>
			handleNetworkError(
				error,
				(error) => StandardError(error, () => adVisible(ad_id, successCallbackR, failCallBackR)),
				failCallBackR
			)
		)
		.finally(() => {
			store.dispatch(closePopout());
		});
}

export function getDeal(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, null, failCallback));
}

export function getCost(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/bid_for_user',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, null, failCallback));
}

export function getAuctionMaxUser(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/max_bid_user',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, null, failCallback));
}

export function increaseAuctionRate(ad_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'put',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/increase_bid',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, null, failCallback));
}

export function getCashback(ad_id, successCallback, failCallback) {
	let cancel;
	const rsuccessCallback = (response) => {
		if (successCallback) {
			successCallback(response);
		}
		store.dispatch(setCost(response.bid));
		return response;
	};
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/return_bid_size',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, rsuccessCallback))
		.catch((error) => handleNetworkError(error, null, failCallback));
}

export function denyDeal(deal_id, successCallback, failCallback, end, text) {
	let dtext = text || 'Ваш отказ принят!';
	let cancel;
	store.dispatch(openPopout(<ScreenSpinner size="large" />));

	const rsuccessCallback = (response) => {
		if (successCallback) {
			successCallback(response);
		}
		success(dtext, null, end);
		return response;
	};

	const anotherErr = (error) =>
		StandardError(error, () => denyDeal(deal_id, successCallback, failCallback, end, text));

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_DEAL + deal_id + '/cancel',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, rsuccessCallback))
		.catch((error) => handleNetworkError(error, anotherErr, failCallback))
		.finally(() => {
			store.dispatch(closePopout());
		});
	return err;
}

export function acceptDeal(deal_id, successCallback, failCallback, end) {
	let cancel;
	store.dispatch(openPopout(<ScreenSpinner size="large" />));

	const rsuccessCallback = (response) => {
		if (successCallback) {
			successCallback(response);
		}
		success('Автор благодарит вас за подтверждение!', null, end);
		return response;
	};

	const anotherErr = (error) => StandardError(error, () => acceptDeal(deal_id, successCallback, failCallback, end));

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_DEAL + deal_id + '/fulfill',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, rsuccessCallback))
		.catch((error) => handleNetworkError(error, anotherErr, failCallback))
		.finally(() => {
			store.dispatch(closePopout());
		});
}

export function CancelClose(ad_id, s, f, blockSnackbar) {
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
					store.dispatch(updateContext({ dealer: null, deal: null, status: STATUS_OFFER }));
					successCallback(v);
				},
				(e) => failCallback(e),
				null,
				'Предложение о передаче вещи отменено'
			);
		},
		(err) => {}
	);
}

export function Close(ad_id, ad_type, subscriber_id, s, f) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	const successCallback = s || ((v) => {});
	const failCallback = f || ((e) => {});
	let cancel;
	let params = { type: ad_type };
	if (subscriber_id > 0) {
		params.subscriber_id = subscriber_id;
	}

	const rsuccessCallback = (response) => {
		if (successCallback) {
			successCallback(response);
		}
		store.dispatch(setStatus(STATUS_CHOSEN));
		store.dispatch(updateContext({ status: STATUS_CHOSEN }));
		updateDealInfo();

		success('Спасибо, что делаете других людей счастливыми :) Ждем подтверждения от второй стороны!', () => {
			CancelClose(ad_id);
		});
		return response;
	};

	const anotherErr = (error) => StandardError(error);

	axios({
		method: 'put',
		withCredentials: true,
		params,
		url: Addr.getState() + BASE_AD + ad_id + '/make_deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, rsuccessCallback))
		.catch((error) => handleNetworkError(error, anotherErr, failCallback))
		.finally(() => {
			store.dispatch(closePopout());
		});
}

export function getSubscribers(ad_id, successCallback, failCallback, count) {
	let cancel;

	const anotherErr = (error) => StandardError(error);

	axios({
		method: 'get',
		withCredentials: true,
		params: { page: 1, rows_per_page: count },
		url: Addr.getState() + BASE_AD + ad_id + '/subscribers',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, anotherErr, failCallback));
}

export function getDetails(ad_id, successCallback, failCallback) {
	let cancel;

	const anotherErr = (error) => StandardError(error);

	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/details',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, anotherErr, failCallback));
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

export function Auth(user, successCallback, failCallback) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	// console.log('secret:', window.location.href);
	// console.log('user:', user);
	let cancel;
	const obj = JSON.stringify({
		vk_id: user.id,
		Url: window.location.href,
		name: user.first_name,
		surname: user.last_name,
		photo_url: user.photo_100,
	});

	const anotherErr = (e) => {
		fail('Не удалось авторизоваться');
		return e;
	};

	axios({
		method: 'post',
		withCredentials: true,
		data: obj,
		url: Addr.getState() + BASE_USER + 'auth',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (data) {
			successCallback(data);
			User.dispatch({ type: 'set', new_state: data.user });
			window.sessionStorage.setItem('jwtToken', data.token);
			return data;
		})
		.catch((error) => handleNetworkError(error, anotherErr, failCallback))
		.finally(() => {
			store.dispatch(closePopout());
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
			headers: Headers(),
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
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let cancel;
	const anotherErr = (error) =>
		StandardError(error, () => createAd(ad, obj, photos, openAd, loadAd, successcallback));

	const spamError =
		'Вы создали слишком много объявлений за короткий промежуток времени, поэтому в ближайший час вы не можете создать новое.';
	axios({
		method: 'post',
		url: Addr.getState() + BASE_AD + 'create',
		withCredentials: true,
		data: obj,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(async function (response) {
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

		.catch((error) => handleNetworkError(error, (error) => handleSpamError(error, anotherErr, spamError)))
		.finally(() => {
			store.dispatch(closePopout());
		});
}

export function EditAd(ad, obj, openAd, successcallback, failCallback) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let cancel;

	const anotherErr = () => {
		fail('Нет соединения с сервером', () => EditAd(ad, obj, openAd, successcallback));
	};

	axios({
		method: 'put',
		url: Addr.getState() + BASE_AD + ad.ad_id + '/edit',
		withCredentials: true,
		data: obj,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(async function (response) {
			openAd(ad);
			if (successcallback) {
				successcallback();
			}
			success('Изменения сохранены');
			return response;
		})
		.catch((error) => handleNetworkError(error, anotherErr, failCallback))
		.finally(() => {
			store.dispatch(closePopout());
		});
}

export const deleteAd = (ad_id, refresh) => {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
	let cancel;

	const anotherErr = () => {
		fail('Нет соединения с сервером', () => deleteAd(ad_id, refresh));
	};

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/delete',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(function (response) {
			if (response.status != 200) {
				fail(response.status + ' - ' + response.statusText, () => deleteAd(ad_id, refresh));
			} else {
				refresh(ad_id);
				success('Объявление удалено!');
			}
			return response.data;
		})
		.catch((error) => handleNetworkError(error, anotherErr))
		.finally(() => {
			store.dispatch(closePopout());
		});
};

export function fail(err, repeat, end, dur) {
	{
		const duration = dur || SNACKBAR_DURATION_DEFAULT;
		let open;
		if (repeat) {
			open = () =>
				store.dispatch(
					openSnackbar(
						<Snackbar
							duration={duration}
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
							duration={duration}
							onClose={() => {
								store.dispatch(closeSnackbar());
								if (end) {
									end();
								}
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
		}
		store.dispatch(open);
	}
}

export function failEasy(err, dur, end) {
	{
		const duration = dur || SNACKBAR_DURATION_DEFAULT;

		store.dispatch(
			openSnackbar(
				<Snackbar
					duration={duration}
					onClose={() => {
						store.dispatch(closeSnackbar());
						if (end) {
							end();
						}
					}}
					before={
						<Avatar size={24} style={{ background: 'red' }}>
							<Icon24Cancel fill="#fff" width={14} height={14} />
						</Avatar>
					}
				>
					{err}
				</Snackbar>
			)
		);
	}
}

export function StandardError(error, repeat, dur, end) {
	if (error.response.status === 404) {
		console.log('not found');
	} else if (error.response.status === 500) {
		fail('На сервере ведутся технические работы', repeat, end, dur);
	} else {
		fail('Произошла непредвиденная ошибка', repeat, end, dur);
	}
}

export function handleSpamError(error, another, text, dur, end) {
	if (error.response.status === 429) {
		failEasy(text, dur, end);
	} else {
		if (another) {
			another(error);
		}
	}
}

export function handleNetworkError(error, another, final, end) {
	if (!axios.isCancel(error)) {
		if (error.message == 'Network Error') {
			fail('Нет соединения с интернетом', null, end);
		} else {
			if (another) {
				another(error);
			}
		}
	}
	if (final) {
		final(error);
	}
	return error;
}

export function handleSuccess(response, successCallback) {
	if (successCallback) {
		successCallback(response.data);
	}
	return response.data;
}

export function Headers() {
	return { ...axios.defaults.headers, Authorization: 'Bearer' + window.sessionStorage.getItem('jwtToken') };
}

export function getPermissionPM(user_id, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_USER + user_id + '/nots_pm',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(function (response) {
			const canSend = response.data.can_send;
			if (successCallback) {
				successCallback(canSend);
			}
			return canSend;
		})
		.catch((error) => handleNetworkError(error, null, failCallback));
}

export function setPermissionPM(user_id, can_send, successCallback, failCallback) {
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		data: JSON.stringify({
			can_send,
		}),
		url: Addr.getState() + BASE_USER + user_id + '/nots_pm',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then((response) => handleSuccess(response, successCallback))
		.catch((error) => handleNetworkError(error, null, failCallback));
}

// 745 -> 600 -> 806 -> 963 -> 812 -> 792
