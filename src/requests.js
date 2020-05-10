import React from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr, BASE_AD, BASE_DEAL, BASE_USER, BASE } from './store/addr';
import { User } from './store/user';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import { AD_LOADING } from './const/ads';
import { SNACKBAR_DURATION_DEFAULT } from './store/const';
import { store } from '.';
import { openPopout, closePopout, openSnackbar, closeSnackbar } from './store/router/actions';

let request_id = 0;

export function success(text, cancelMe, setSnackbar, end) {
	setSnackbar(
		cancelMe ? (
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={() => {
					setSnackbar(null);
					if (end) {
						end();
					}
				}}
				action="Отменить"
				onActionClick={cancelMe}
				before={
					<Avatar size={24} style={{ background: 'green' }}>
						<Icon24DoneOutline fill="#fff" width={14} height={14} />
					</Avatar>
				}
			>
				{text}
			</Snackbar>
		) : (
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={() => {
					setSnackbar(null);
					if (end) {
						end();
					}
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

export function sendSnack(text, setSnackbar) {
	setSnackbar(
		<Snackbar
			style={{ zIndex: '120' }}
			duration={SNACKBAR_DURATION_DEFAULT}
			onClose={() => {
				setSnackbar(null);
			}}
			before={
				<Avatar size={24} style={{ background: 'green' }}>
					<Icon24DoneOutline fill="#fff" width={14} height={14} />
				</Avatar>
			}
		>
			{text}
		</Snackbar>
	);
}

export async function getToken(setSnackbar, successCallback, failCallBack) {
	let err = false;
	let cancel;
	const deal = await axios({
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
			successCallback(response);
			return response;
		})
		.catch(function (error) {
			failCallBack(error);
			err = true;
		});
	return { deal, err };
}

export async function adHide(setPopout, setSnackbar, ad_id, callback) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />))
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
			store.dispatch(closePopout())
			success('Объявление скрыто', null, setSnackbar);
			callback(response);
			return response;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', adHide(setPopout, setSnackbar, ad_id, callback), setSnackbar);

			store.dispatch(closePopout())
		});
	return err;
}

export async function adVisible(setPopout, setSnackbar, ad_id, callback) {
	setPopout(<ScreenSpinner size="large" />);
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
			setPopout(null);
			success('Объявление открыто для просмотра', null, setSnackbar);
			callback(response);
			return response;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', adVisible(setPopout, setSnackbar, ad_id, callback), setSnackbar);
			setPopout(null);
		});
	return err;
}

export async function getDeal(setSnackbar, ad_id, successCallback, failCallback) {
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
	let err = false;
	let cancel;
	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/bid_for_user',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getCost:', response);
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
}

export async function denyDeal(setPopout, setSnackbar, deal_id, successCallback, failCallback, end, text) {
	console.log('denyDeall', deal_id);
	let dtext = text || 'Ваш отказ принят!';
	let err = false;
	let cancel;
	setPopout(<ScreenSpinner size="large" />);

	console.log('denyDeal', deal_id);

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_DEAL + deal_id + '/cancel',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from denyDeal:', response);
			success(dtext, null, setSnackbar, end);
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			setPopout(null);
			return response;
		})
		.catch(function (error) {
			err = true;
			fail(
				'Нет соединения с сервером',
				() => {
					denyDeal(setPopout, setSnackbar, deal_id, successCallback, failCallback, end, text);
				},
				setSnackbar,
				end
			);
			failCallback(error);
			setPopout(null);
		});
	return err;
}

export async function acceptDeal(setPopout, setSnackbar, deal_id, successCallback, failCallback, end) {
	let err = false;
	let cancel;
	setPopout(<ScreenSpinner size="large" />);

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_DEAL + deal_id + '/fulfill',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from acceptDeal:', response);
			success('Автор благодарит вас за подтверждение!', null, setSnackbar, end);
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			setPopout(null);
			return response;
		})
		.catch(function (error) {
			err = true;
			fail(
				'Нет соединения с сервером',
				() => {
					acceptDeal(setPopout, setSnackbar, deal_id, successCallback, failCallback, end);
				},
				setSnackbar,
				end
			);
			failCallback(error);
			setPopout(null);
		});
	return err;
}

export async function CancelClose(setPopout, setSnackbar, ad_id, successCallback, failCallback, blockSnackbar) {
	console.log('CancelClose 1', ad_id);
	getDeal(
		setSnackbar,
		ad_id,
		(deal) => {
			console.log('CancelClose 2', deal);
			denyDeal(
				setPopout,
				setSnackbar,
				deal.deal_id,
				(v) => {
					console.log('stoooop 2', deal);
					if (!blockSnackbar) {
						success('Запрос успешно отменен!', null, setSnackbar);
					}
					if (successCallback) {
						successCallback(v);
					}
				},
				(e) => {
					console.log('stoooop 3', e);
					if (failCallback) {
						failCallback(e);
					}
				},
				null,
				'Предложение о передаче вещи отменено'
			);
		},
		(err) => {
			console.log('CancelClose 3', err);
		}
	);
}

export function Close(setPopout, setSnackbar, ad_id, subscriber_id, successCallback, failCallback) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	axios({
		method: 'put',
		withCredentials: true,
		params: { subscriber_id: subscriber_id, type: 'choice' },
		url: Addr.getState() + BASE_AD + ad_id + '/make_deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			setPopout(null);
			console.log('response from Close:', response);
			success(
				'Спасибо, что делаете других людей счастливыми :) Ждем подтверждения от второй стороны!',
				() => {
					CancelClose(setPopout, setSnackbar, ad_id);
				},
				setSnackbar
			);
			return response.data;
		})
		.then(function (data) {
			if (successCallback) {
				successCallback(data);
			}
			return data;
		})
		.catch(function (error) {
			err = true;
			if (error) {
				failCallback(error);
			}
			fail('Нет соединения с сервером', () => {}, setSnackbar);
			setPopout(null);
		});
	return err;
}

export async function getSubscribers(setPopout, setSnackbar, ad_id, successCallback, failCallback) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	const subscribers = await axios({
		method: 'get',
		withCredentials: true,
		params: { page: 1, rows_per_page: 1000 }, // todo поправить
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
			setPopout(null);
			return response;
		})
		.catch(function (error) {
			if (err) {
				fail('Нет соединения с сервером', () => {}, setSnackbar);
			}
			failCallback(error);
			setPopout(null);
		});
	return { subscribers, err };
}

export async function getDetails(setPopout, setSnackbar, ad_id, successCallback, failCallback, end) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	const data = await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/details',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			setPopout(null);
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
			fail(
				'Нет соединения с сервером',
				() => {
					getDetails(setPopout, setSnackbar, ad_id);
				},
				setSnackbar
			);
			setPopout(null);
		});

	return { details: data, err };
}

export async function canWritePrivateMessage(id, appID, apiVersion, successCallback, failCallback) {
	console.log('before userdata', id, appID, apiVersion);
	bridge
		.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' })
		.then((data) => {
			bridge
				.send('VKWebAppCallAPIMethod', {
					method: 'users.get',
					request_id: 'canWritePrivateMessage' + request_id,
					params: {
						v: apiVersion,
						user_ids: id,
						fields: 'is_closed',
						access_token: data.access_token,
					},
				})
				.then(function (response) {
					console.log('success canWritePrivateMessage:', response);
					return response.response[0].is_closed;
				})
				.then((data) => {
					if (successCallback) {
						successCallback(data);
					}
					return data;
				})
				.catch(function (error) {
					if (failCallback) {
						failCallback(error);
					}
					console.log('fail canWritePrivateMessage:', error);
				});
			return data;
		})
		.catch(function (error) {
			if (failCallback) {
				failCallback(error);
			}
			console.log('fail VKWebAppGetAuthToken:', error);
		});
	request_id++;
}

export async function Auth(user, setSnackbar, setPopout, successCallback, failCallback) {
	setPopout(<ScreenSpinner size="large" />);
	console.log('secret:', window.location.href);
	console.log('user:', user);
	let cancel;
	const getUser = await axios({
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
			successCallback(data);
			setPopout(null);
			User.dispatch({ type: 'set', new_state: data });
			return data;
		})
		.catch(function (error) {
			setPopout(null);
			failCallback(error);
			fail('Не удалось авторизоваться', null, setSnackbar);
		});
	return getUser;
}

export async function CreateImages(photos, id, goToAds, setSnackbar) {
	let err = false;
	let s = 0;
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
				if (s == photos.length - 1) {
					goToAds(
						<Snackbar
							duration={SNACKBAR_DURATION_DEFAULT}
							onClose={() => {
								setSnackbar(null);
							}}
							action="Отменить"
							onActionClick={() => {
								deleteAd(setPopout, id, setSnackbar, refresh);
							}}
							before={
								<Avatar size={24} style={{ background: 'green' }}>
									<Icon24DoneOutline fill="#fff" width={14} height={14} />
								</Avatar>
							}
						>
							Объявление создано! Спасибо, что делаете мир лучше :)
						</Snackbar>
					);
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

export async function CreateAd(ad, obj, photos, openAd, loadAd, setSnackbar, setPopout, successcallback) {
	setPopout(<ScreenSpinner size="large" />);
	let cancel;
	await axios({
		method: 'post',
		url: Addr.getState() + BASE_AD + 'create',
		withCredentials: true,
		data: obj,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(async function (response) {
			setPopout(null);

			if (response.status != 201) {
				throw new Error('Не тот код!');
			}
			ad.ad_id = response.data.ad_id;
			openAd(ad);
			await CreateImages(
				photos,
				response.data.ad_id,
				(snackbar) => {
					if (successcallback) {
						successcallback();
					}
					setSnackbar(snackbar);
					getDetails(setPopout, setSnackbar, response.data.ad_id, (e) => loadAd(e));
				},
				setSnackbar
			);
			return response;
		})
		.then(function (response) {
			return response;
		})
		.catch(function (error) {
			console.log('Request failed', error);
			setPopout(null);
			fail('Нет соединения с сервером', () => createAd(setPopout), setSnackbar);
		});
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
			success('Изменения сохранены', null, (s) => {
				store.dispatch(openSnackbar(s));
			});
			return response;
		})
		.catch(function (error) {
			console.log('Request failed', error);
			store.dispatch(closePopout());
			fail(
				'Нет соединения с сервером',
				() => createAd(setPopout),
				(s) => {
					console.log('errrrrrrrr', s);
					store.dispatch(openSnackbar(s));
				}
			);
		});
	return () => {
		cancel();
	};
}

export const deleteAd = (setPopout, ad_id, setSnackbar, refresh) => {
	setPopout(<ScreenSpinner size="large" />);
	let cancel;

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/delete',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			setPopout(null);
			if (response.status != 200) {
				fail(
					response.status + ' - ' + response.statusText,
					() => deleteAd(setPopout, ad_id, setSnackbar, refresh),
					setSnackbar
				);
			} else {
				refresh(ad_id);
				success('Объявление удалено!', null, setSnackbar);
			}
			return response.data;
		})
		.catch(function (error) {
			console.log('Request failed', error);
			setPopout(null);
			fail('Нет соединения с сервером', () => deleteAd(setPopout, ad_id, setSnackbar, refresh), setSnackbar);
		});
};

export function fail(err, repeat, setSnackbar, end) {
	{
		let open;
		console.log('we wanna set snackbar', err);
		if (repeat) {
			open = () =>
				openSnackbar(
					<Snackbar
						duration={SNACKBAR_DURATION_DEFAULT}
						onClose={() => {
							closeSnackbar();
							if (end) {
								end();
							}
						}}
						action="Повторить"
						onActionClick={() => {
							closeSnackbar();
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
				);
		} else {
			open = () =>
				openSnackbar(
					<Snackbar
						duration={SNACKBAR_DURATION_DEFAULT}
						onClose={closeSnackbar}
						before={
							<Avatar size={24} style={{ background: 'red' }}>
								<Icon24Cancel fill="#fff" width={14} height={14} />
							</Avatar>
						}
					>
						Произошла ошибка: {err}
					</Snackbar>
				);
		}
		store.dispatch(open);
	}
}

// 745
// 600
