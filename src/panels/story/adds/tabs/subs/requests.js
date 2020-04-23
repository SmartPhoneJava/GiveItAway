import React, { useState, useEffect } from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import axios from 'axios';

import { Addr } from '../../../../../store/addr';

import { fail, success } from '../../../../../requests';

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
			success('Теперь вы будете получать уведомления, связанные с этим постом', clCancel, setSnackbar, end);
			return response;
		})
		.catch(function (error) {
			err = true;
			console.log('loook, error', error, status);
			failCallback(error);
			if (error == 'Error: Request failed with status code 409') {
				fail('недостаточно кармы. Откажитесь от другой вещи, чтобы получить эту!', null, setSnackbar, end);
			} else {
				fail(
					'Нет соединения с сервером',
					() => {
						subscribe(setPopout, setSnackbar, ad_id, clCancel, successCallback, failCallback, end);
					},
					setSnackbar,
					end
				);
			}
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
			success('Больше вы не будете получать связанные с этим постом уведомления', clCancel, setSnackbar, end);
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
