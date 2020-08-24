import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr, BASE_USER } from './../../../store/addr';

import { fail, success } from './../../../requests';
import { store } from '../../..';

let request_id = 0;

export async function getUser(user_id, successCallback, failCallback, inVisible) {
	let err = false;
	let cancel;

	await axios({
		method: 'get',
		withCredentials: true,
		url: Addr.getState() + BASE_USER + user_id + '/profile',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			console.log('response from getUser:', response);
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			return response;
		})
		.catch(function (error) {
			console.log('ERROR getUser:', error);
			err = true;
			failCallback(error);
			if (!inVisible) {
				fail('Нет соединения с сервером');
			}
		});
	return err;
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
