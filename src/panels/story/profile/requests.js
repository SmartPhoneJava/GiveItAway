import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr, BASE_USER } from './../../../store/addr';

import { fail, success, Headers, handleNetworkError } from './../../../requests';
import { store } from '../../..';

let request_id = 0;

export function getUser(user_id, successCallback, failCallback, inVisible) {
	let cancel;

	axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_USER + user_id + '/profile',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: Headers(),
	})
		.then(function (response) {
			successCallback(response.data);
			return response.data;
		})
		.catch((error) =>
			handleNetworkError(
				error,
				(e) => {
					if (!inVisible) {
						fail('Нет соединения с сервером');
					}
				},
				failCallback
			)
		);
}

export async function getUserVK(id, successCallback, failCallback) {
	const access_token = store.getState().vkui.accessToken;
	const apiVersion = store.getState().vkui.apiVersion;

	bridge
		.send('VKWebAppCallAPIMethod', {
			method: 'users.get',
			request_id: 'getUserVK' + request_id,
			params: {
				v: apiVersion,
				user_ids: id,
				fields: 'online,city,bdate,contacts,last_seen,can_write_private_message',
				access_token: access_token,
			},
		})
		.then(function (response) {
			successCallback(response.response[0]);
			return response.response[0];
		})
		.catch(function (error) {
			failCallback(error);
			console.log('cant do VKWebAppCallAPIMethod cause ', error);
		});
}

/*
export async function setOnline(appID, apiVersion, successCallback, failCallback) {
	
	const el = await bridge.send('VKWebAppGetAuthToken', { app_id: appID, scope: 'offline' });

	const userdata = await bridge
		.send('VKWebAppCallAPIMethod', {
			method: 'account.setOnline',
			request_id: 'setOnline' + request_id,
			params: {
				v: apiVersion,
				access_token: el.access_token,
			},
		})
		.then(function (response) {
			console.log("setOnline success", response)
			successCallback(response.response);
			return response.response;
		})
		.catch(function (error) {
			console.log("setOnline failed", error)
			failCallback(error);
		});
	request_id++;

	return userdata;
}*/
