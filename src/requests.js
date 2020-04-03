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

export async function getSubscribers(setPopout, setSnackbar, ad_id) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;
	const subscribers = await axios({
		method: 'get',
		withCredentials: true,
		params: { page: 1, rows_per_page: 1000 }, // todo поправить
		url: Addr.getState() + '/api/ad/' + ad_id + '/subscribers',
		cancelToken: new axios.CancelToken(c => (cancel = c)),
	})
		.then(function(response) {
			setPopout(null);
			console.log('response from getSubscribes:', response);
			if (response.status != 404 && response.status != 200) {
				err = true;
			}
			return response.data;
		})
		.catch(function(error) {
			if (err) {
				fail('Нет соединения с сервером', () => {}, setSnackbar);
			}
			setPopout(null);
		});
	return { subscribers, err };
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

function sucess(setSnackbar, cancelMe, text) {
	setSnackbar(
		<Snackbar
			onClose={() => {
				props.setSnackbar(null);
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
