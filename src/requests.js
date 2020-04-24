import React, { useState, useEffect } from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr } from './store/addr';
import { User } from './store/user';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import { AD_LOADING } from './panels/template/AddMore2';

let request_id = 0;

export async function getToken(setSnackbar, successCallback, failCallBack) {
	let err = false;
	let cancel;
	const deal = await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + '/api/ws_token',
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
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/ad/' + ad_id + '/set_hidden',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from adHide:', response);
			return response.data;
		})
		.then(function (response) {
			setPopout(null);
			sucessNoCancel('Объявление скрыто', setSnackbar);
			callback(response);
			return response;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', adHide(setPopout, setSnackbar, ad_id, callback), setSnackbar);

			setPopout(null);
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
		url: Addr.getState() + '/api/ad/' + ad_id + '/set_visible',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from adVisible:', response);
			return response.data;
		})
		.then(function (response) {
			setPopout(null);
			sucessNoCancel('Объявление открыто для просмотра', setSnackbar);
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
		url: Addr.getState() + '/api/ad/' + ad_id + '/deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getDeal:', response);
			return response.data;
		})
		.then(function (response) {
			if (successCallback) {
				console.log('action');
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

export async function denyDeal(setPopout, setSnackbar, deal_id, successCallback, failCallback, end) {
	console.log('denyDeall', deal_id);
	let err = false;
	let cancel;
	setPopout(<ScreenSpinner size="large" />);

	console.log('denyDeal', deal_id);

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/deal/' + deal_id + '/cancel',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from denyDeal:', response);
			sucessNoCancel('Ваш отказ принят!', setSnackbar, end);
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
					denyDeal(setPopout, setSnackbar, deal_id, successCallback, failCallback, end);
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
		url: Addr.getState() + '/api/deal/' + deal_id + '/fulfill',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from acceptDeal:', response);
			sucessNoCancel('Автор благодарит вас за подтверждение!', setSnackbar, end);
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
	getDeal(setSnackbar, ad_id, async (deal) => {
		console.log('success', JSON.stringify(deal));
		await denyDeal(
			setPopout,
			setSnackbar,
			deal.deal_id,
			(v) => {
				console.log('success double');
				if (!blockSnackbar) {
					sucessNoCancel('Запрос успешно отменен!', setSnackbar);
				}
				if (successCallback) {
					successCallback(v);
				}
			},
			(e) => {
				console.log('fail double');
				if (failCallback) {
					failCallback(e);
				}
			}
		);
		console.log('after success');
	});
}

export function Close(setPopout, setSnackbar, ad_id, subscriber_id, successCallback, failCallback) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	console.log('close info', ad_id, subscriber_id);
	axios({
		method: 'put',
		withCredentials: true,
		params: { subscriber_id: subscriber_id, type: 'choice' },
		url: Addr.getState() + '/api/ad/' + ad_id + '/make_deal',
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
		url: Addr.getState() + '/api/ad/' + ad_id + '/subscribers',
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
		url: Addr.getState() + '/api/ad/' + ad_id + '/details',
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

export async function canWritePrivateMessage(id, appID, apiVersion) {
	console.log('before userdata', id, appID, apiVersion);
	const el = await bridge.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' });

	const userdata = await bridge
		.send('VKWebAppCallAPIMethod', {
			method: 'users.get',
			request_id: 'canWritePrivateMessage' + request_id,
			params: {
				v: apiVersion,
				user_ids: id,
				fields: 'can_write_private_message',
				access_token: '5e8cd08d5e8cd08d5e8cd08d8b5efc9eac55e8c5e8cd08d00e2599e1626b258c28f29dd',
			},
		})
		.then(function (response) {
			console.log('success canWritePrivateMessage:', response);
			return response.response[0].can_write_private_message;
		})
		.catch(function (error) {
			console.log('fail canWritePrivateMessage:', error);
		});

	console.log('after userdata', userdata);
	request_id++;

	return userdata;
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
		url: Addr.getState() + '/api/user/auth',
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

export async function CreateImages(items, id, goToAds, setSnackbar) {
	let err = false;
	items.forEach((item, l) => {
		item.photos.forEach(async (photo, i) => {
			const data = new FormData();
			data.append('file', photo);
			let cancel;

			await axios({
				method: 'post',
				url: Addr.getState() + '/api/ad/' + id + '/upload_image',
				withCredentials: true,
				data: data,
				cancelToken: new axios.CancelToken((c) => (cancel = c)),
			})
				.then(function (response) {
					console.log('success uploaded', response);
					if (i == item.photos.length - 1 && l == items.length - 1) {
						goToAds(
							<Snackbar
								duration="1500"
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
	});
}

export async function CreateAd(obj, items, openAd, setSnackbar, setPopout) {
	setPopout(<ScreenSpinner size="large" />);
	let cancel;
	await axios({
		method: 'post',
		url: Addr.getState() + '/api/ad/create',
		withCredentials: true,
		data: obj,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(async function (response) {
			setPopout(null);
			console.log('createAddddd', response.data);
			if (response.status != 201) {
				throw new Error('Не тот код!');
			}
			openAd(AD_LOADING);
			await CreateImages(
				items,
				response.data.ad_id,
				() => {
					openAd({ ad_id: response.data.ad_id });
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

export const deleteAd = (setPopout, ad_id, setSnackbar, refresh) => {
	setPopout(<ScreenSpinner size="large" />);
	let cancel;

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/ad/' + ad_id + '/delete',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			setPopout(null);
			if (response.status != 200) {
				saveFail(
					response.status + ' - ' + response.statusText,
					() => deleteAd(setPopout, ad_id, setSnackbar, refresh),
					setSnackbar
				);
			} else {
				refresh(ad_id);
				setSnackbar(
					<Snackbar
						duration="1500"
						onClose={() => {
							setSnackbar(null);
						}}
						before={
							<Avatar size={24} style={{ background: 'green' }}>
								<Icon24DoneOutline fill="#fff" width={14} height={14} />
							</Avatar>
						}
					>
						Объявление удалено!
					</Snackbar>
				);
			}
			return response.data;
		})
		.catch(function (error) {
			console.log('Request failed', error);
			setPopout(null);
			saveFail('Нет соединения с сервером', () => deleteAd(setPopout, ad_id, setSnackbar, refresh), setSnackbar);
		});
};

export function fail(err, repeat, setSnackbar, end) {
	{
		repeat
			? setSnackbar(
					<Snackbar
						duration="2000"
						onClose={() => {
							setSnackbar(null);
							if (end) {
								end();
							}
						}}
						action="Повторить"
						onActionClick={() => {
							setSnackbar(null);
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
			: setSnackbar(
					<Snackbar
						duration="2000"
						onClose={() => setSnackbar(null)}
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
}

export function success(text, cancelMe, setSnackbar, end) {
	setSnackbar(
		<Snackbar
			duration="1500"
			onClose={() => {
				setSnackbar(null);
				if (end) {
					end();
				}
			}}
			action="Отменить"
			onActionClick={() => {
				if (cancelMe) {
					cancelMe();
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
	);
}

export function sucessNoCancel(text, setSnackbar, end) {
	setSnackbar(
		<Snackbar
			duration="1500"
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
	);
}

export function sendSnack(text, setSnackbar) {
	setSnackbar(
		<Snackbar
			style={{ zIndex: '120' }}
			duration="1500"
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
