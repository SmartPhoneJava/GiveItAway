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

export async function getDeal(setSnackbar, ad_id) {
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
		.catch(function (error) {
			err = true;
		});
	return { deal, err };
}

export async function denyDeal(setSnackbar, deal_id) {
	let err = false;
	let cancel;

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/deal/' + deal_id + '/cancel',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from denyDeal:', response);
			sucessNoCancel('Ваш отказ принят!', setSnackbar);
			return response.data;
		})
		.catch(function (error) {
			err = true;
			fail(
				'Нет соединения с сервером',
				() => {
					denyDeal(setSnackbar, deal_id);
				},
				setSnackbar
			);
		});
	return err;
}

export async function acceptDeal(setSnackbar, deal_id) {
	let err = false;
	let cancel;

	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/deal/' + deal_id + '/fulfill',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from acceptDeal:', response);
			sucessNoCancel('Автор благодарит вас за подтверждение!', setSnackbar);
			return response.data;
		})
		.catch(function (error) {
			err = true;
			fail(
				'Нет соединения с сервером',
				() => {
					acceptDeal(setSnackbar, deal_id);
				},
				setSnackbar
			);
		});
	return err;
}

export async function CancelClose(setPopout, setSnackbar, ad_id) {
	setPopout(<ScreenSpinner size="large" />);

	let { deal, err } = await getDeal(setSnackbar, ad_id);
	console.log('we get deal', deal, err);
	if (!err) {
		err = await denyDeal(setSnackbar, deal.deal_id);
	}
	if (!err) {
		sucessNoCancel('Запрос успешно отменен!', setSnackbar);
	} else {
		fail(
			'Ошибка на стороне сервера',
			() => {
				CancelClose(setPopout, setSnackbar, ad_id);
			},
			setSnackbar
		);
	}
	setPopout(null);
	return err;
}

export function Close(setPopout, setSnackbar, ad_id, subscriber_id) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	console.log('close info', ad_id, subscriber_id);
	axios({
		method: 'put',
		withCredentials: true,
		params: { subscriber_id: subscriber_id },
		url: Addr.getState() + '/api/ad/' + ad_id + '/make_deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			setPopout(null);
			console.log('response from Close:', response);
			sucess(
				'Спасибо, что делаете других людей счастливыми :) Ждем подтверждения от второй стороны!',
				() => {
					CancelClose(setPopout, setSnackbar, ad_id);
				},
				setSnackbar
			);
			return response.data;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', () => {}, setSnackbar);
			setPopout(null);
		});
	return err;
}

export function subscribe(setPopout, setSnackbar, ad_id, clCancel, successCallback, failCallback, end) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/ad/' + ad_id + '/subscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			setPopout(null);
			successCallback(response);
			sucess('Теперь вы будете получать уведомления, связанные с этим постом', clCancel, setSnackbar, end);
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Нет соединения с сервером',
				() => {
					subscribe(setPopout, setSnackbar, ad_id, clCancel);
				},
				setSnackbar,
				end
			);
			setPopout(null);
		});
	return err;
}

export function unsubscribe(setPopout, setSnackbar, ad_id, clCancel, successCallback, failCallback, end) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/ad/' + ad_id + '/unsubscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			setPopout(null);
			successCallback(response);
			sucess('Больше вы не будете получать связанные с этим постом уведомления', clCancel, setSnackbar, end);
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Нет соединения с сервером',
				() => {
					unsubscribe(setPopout, setSnackbar, ad_id, clCancel);
				},
				setSnackbar,
				end
			);
			setPopout(null);
		});
	return err;
}

export async function getDetails(setPopout, setSnackbar, ad_id) {
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
		.catch(function (error) {
			err = true;
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

export async function getSubscribers(setPopout, setSnackbar, ad_id) {
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
			setPopout(null);
			console.log('response from getSubscribes:', response);
			if (response.status != 404 && response.status != 200) {
				err = true;
			}
			return response.data;
		})
		.catch(function (error) {
			if (err) {
				fail('Нет соединения с сервером', () => {}, setSnackbar);
			}
			setPopout(null);
		});
	return { subscribers, err };
}

export async function canWritePrivateMessage(id, appID, apiVersion) {
	apiVersion = '5.00';
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

export async function CreateAd(obj, items, goToAds, setSnackbar, setPopout) {
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
			if (response.status != 201) {
				throw new Error('Не тот код!');
			}
			await CreateImages(items, response.data.ad_id, goToAds, setSnackbar);
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
				console.log('i set', ad_id);
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
						duration="1500"
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
						duration="1500"
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

export function sucess(text, cancelMe, setSnackbar, end) {
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
}

export function sucessNoCancel(text, setSnackbar) {
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
			{text}
		</Snackbar>
	);
}
