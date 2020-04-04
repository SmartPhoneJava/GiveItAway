import React, { useState, useEffect } from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr } from './store/addr';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

let request_id = 0;

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
			fail('Нет соединения с сервером', () => {}, setSnackbar);
		});
	return {deal, err};
}

export async function denyDeal(setSnackbar, deal_id) {
	let err = false;
	let cancel;
	console.log("deal info", deal_id)
	await axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/deal/' + deal_id + '/cancel',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from denyDeal:', response);
			return response.data;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', () => {}, setSnackbar);
		});
	return err;
}

export async function CancelClose(setPopout, setSnackbar, ad_id) {
	setPopout(<ScreenSpinner size="large" />);
	
	let {deal, err} =  await getDeal(setSnackbar, ad_id)
	console.log("we get deal", deal.deal_id, err)
	if (!err) {
		err = await denyDeal(setSnackbar, deal.deal_id)
		
	}
	if (!err) {
		sucessNoCancel("Запрос успешно отменен!", setSnackbar)
	} else {
		fail('Ошибка на стороне сервера', () => {}, setSnackbar);
	}
	setPopout(null);
	return err;
}

export function Close(setPopout, setSnackbar, ad_id, subscriber_id) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	console.log("close info", ad_id, subscriber_id)
	axios({
		method: 'put',
		withCredentials: true,
		params:{subscriber_id: subscriber_id},
		url: Addr.getState() + '/api/ad/' + ad_id + '/make_deal',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			setPopout(null);
			console.log('response from Close:', response);
			sucess('Спасибо, что делаете других людей счастливыми :) Ждем подтверждения от второй стороны!', ()=>{}, setSnackbar);
			return response.data;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', () => {}, setSnackbar);
			setPopout(null);
		});
	return err;
}

export function subscribe(setPopout, setSnackbar, ad_id, clCancel) {
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
			setPopout(null);
			console.log('response from subscribe:', response);
			sucess('Теперь вы будете получать уведомления, связанные с этим постом', clCancel, setSnackbar);
			return response.data;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', () => {}, setSnackbar);
			setPopout(null);
		});
	return err;
}

export function unsubscribe(setPopout, setSnackbar, ad_id, clCancel) {
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
			setPopout(null);
			console.log('response from unsubscribe:', response);
			sucess('Больше вы не будете получать связанные с этим постом уведомления', clCancel, setSnackbar);
			return response.data;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', () => {}, setSnackbar);
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
	apiVersion = "5.00"
	console.log('before userdata', id, appID, apiVersion);
	const el = await bridge.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' });

	const userdata = await bridge
		.send('VKWebAppCallAPIMethod', {
			method: 'users.get',
			request_id: 'canWritePrivateMessage' + request_id,
			params: { v: apiVersion, user_ids: id, fields: 'can_write_private_message', access_token: '5e8cd08d5e8cd08d5e8cd08d8b5efc9eac55e8c5e8cd08d00e2599e1626b258c28f29dd' },
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

function fail(err, repeat, setSnackbar) {
	setSnackbar(
		<Snackbar
			onClose={() => setSnackbar(null)}
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
	);
}

function sucess(text, cancelMe, setSnackbar) {
	setSnackbar(
		<Snackbar
			onClose={() => {
				setSnackbar(null);
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

function sucessNoCancel(text, setSnackbar) {
	setSnackbar(
		<Snackbar
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
