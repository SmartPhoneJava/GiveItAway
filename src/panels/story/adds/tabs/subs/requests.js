import React, { useState, useEffect } from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import axios from 'axios';

import { Addr, BASE_AD } from '../../../../../store/addr';

import { fail, success } from '../../../../../requests';
import { store } from '../../../../..';
import { deleteSub, addSub } from '../../../../../store/detailed_ad/actions';

export function getMyUser() {
	const vkUser = store.getState().vkui.myUser;
	return {
		vk_id: vkUser.id,
		name: vkUser.first_name,
		surname: vkUser.last_name,
		photo_url: vkUser.photo_100,
	};
}

export function subscribe(ad_id, clCancel, s, f, e) {
	// setPopout(<ScreenSpinner size="large" />);
	const end = e || (() => {});
	const successCallback = s || ((v) => {});
	const failCallback = f || ((v) => {});
	let err = false;
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/subscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			// setPopout(null);
			successCallback(response);

			store.dispatch(addSub(getMyUser()));
			success('Теперь вы будете получать уведомления, связанные с этим постом', clCancel, end);
			return response;
		})
		.catch(function (error) {
			err = true;
			console.log('loook, error', error, status);
			failCallback(error);
			if (error == 'Error: Request failed with status code 409') {
				fail('недостаточно кармы. Откажитесь от другой вещи, чтобы получить эту!', null, end);
			} else {
				fail(
					'Нет соединения с сервером',
					() => {
						subscribe(ad_id, clCancel, successCallback, failCallback, end);
					},
					end
				);
			}
			// setPopout(null);
		});
	return err;
}

export function unsubscribe(ad_id, clCancel, s, f, e) {
	// setPopout(<ScreenSpinner size="large" />);
	const end = e || (() => {});
	const successCallback = s || ((v) => {});
	const failCallback = f || ((v) => {});
	let err = false;
	let cancel;
	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + BASE_AD + ad_id + '/unsubscribe',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			// setPopout(null);
			successCallback(response);
			store.dispatch(deleteSub(getMyUser().vk_id));
			success('Больше вы не будете получать связанные с этим постом уведомления', clCancel, end);
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Нет соединения с сервером',
				() => {
					unsubscribe(ad_id, clCancel);
				},
				end
			);
			// setPopout(null);
		});
	return err;
}
