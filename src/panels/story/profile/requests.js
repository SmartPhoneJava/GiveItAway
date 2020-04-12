import React, { useState, useEffect } from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr } from './../../../store/addr';

import { fail, success } from './../../../requests';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

let request_id = 0;

export async function getUser(setPopout, setSnackbar, user_id, successCallback, failCallback) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;

	console.log('user_iduser_id', user_id);

	await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + '/api/user/' + user_id,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getUser:', response);
			return response.data;
		})
		.then(function (response) {
			setPopout(null);
			successCallback(response)
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error)
			fail('Нет соединения с сервером', null, setSnackbar);
			setPopout(null);
		});
	return err;
}

export async function getUserVK(id, appID, apiVersion, successCallback, failCallback) {
	apiVersion = '5.00';
	console.log('before userdata', id, appID, apiVersion);
	const el = await bridge.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' });

	console.log('elelelel', el)
	const userdata = await bridge
		.send('VKWebAppCallAPIMethod', {
			method: 'users.get',
			request_id: 'canWritePrivateMessage' + request_id,
			params: {
				v: apiVersion,
				user_ids: id,
				fields: 'status, online',
				access_token: el.access_token,
			},
		})
		.then(function (response) {
			console.log('success canWritePrivateMessage:', response);
			successCallback(response.response[0].online, response.response[0].status)
			return response.response[0];
		})
		.catch(function (error) {
			failCallback(error)
			console.log('fail canWritePrivateMessage:', error);
		});
	request_id++;

	return userdata;
}