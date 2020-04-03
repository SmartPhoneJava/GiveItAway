import React, { useState, useEffect } from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr } from './store/addr';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

export async function getDetails(setPopout, setSnackbar, ad_id) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	const data = await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + '/api/ad/' + ad_id + '/details',
		cancelToken: new axios.CancelToken(c => (cancel = c)),
	})
		.then(function(response) {
			setPopout(null);
			console.log('response from subscribe:', response);
			return response.data;
		})
		.catch(function(error) {
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

export function subscribe(setPopout, setSnackbar, ad_id) {
	setPopout(<ScreenSpinner size="large" />);
	[err, setErr] = useState(false);
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/ad/' + ad_id + '/subscribe',
		cancelToken: new axios.CancelToken(c => (cancel = c)),
	})
		.then(function(response) {
			setPopout(null);
			console.log('response from subscribe:', response);
			return response.data;
		})
		.catch(function(error) {
			setErr(true);
			fail('Нет соединения с сервером', () => {}, setSnackbar);
			setPopout(null);
		});
	return err;
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

function sucess(etSnackbar) {
	setSnackbar(
		<Snackbar
			onClose={() => {
				props.setSnackbar(null);
			}}
			action="Отменить"
			onActionClick={() => {
				// отписаться
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
