import React from 'react';
import { ScreenSpinner } from '@vkontakte/vkui';

import axios from 'axios';

import { Addr, BASE_AD, BASE_COMMENT } from './../../../../../store/addr';

import { fail, success } from './../../../../../requests';

let request_id = 0;

export async function postComment(setPopout, setSnackbar, ad_id, comment, successCallback, failCallback, end) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;

	await axios({
		method: 'post',
		withCredentials: true,
		data: comment,
		url: Addr.getState() + BASE_AD + ad_id + '/comments',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			setPopout(null);
			successCallback(response);
			// success('Комментарий отправлен', null, setSnackbar, end);
			end();
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Комментарий не отправлен',
				() => {
					postComment(setPopout, setSnackbar, ad_id, comment, successCallback, failCallback, end);
				},
				setSnackbar,
				end
			);
			setPopout(null);
		});
	return err;
}

export async function deleteComment(setPopout, setSnackbar, comment, successCallback, failCallback, end) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;

	await axios({
		method: 'delete',
		withCredentials: true,
		data: JSON.stringify({
			comment: comment,
		}),
		url: Addr.getState() + BASE_COMMENT + comment.comment_id,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			success('Комментарий удален', null, setSnackbar, end);
			successCallback(response);
			setPopout(null);
			return response;
		})
		.catch(function (error) {
			err = true;
			fail(
				'Комментарий не удален',
				() => {
					deleteComment(setPopout, setSnackbar, comment, successCallback, failCallback, end);
				},
				setSnackbar,
				end
			);
			failCallback(error);
			setPopout(null);
		});
	return err;
}

export async function editComment(setPopout, setSnackbar, id, comment, successCallback, failCallback, end) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;

	await axios({
		method: 'put',
		withCredentials: true,
		data: comment,
		url: Addr.getState() + BASE_COMMENT + id,
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			successCallback(response);
			success('Комментарий отредактирован', null, setSnackbar, end);
			setPopout(null);
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Комментарий не отредактирован',
				() => {
					editComment(setPopout, setSnackbar, id, comment, successCallback, failCallback, end);
				},
				setSnackbar,
				end
			);
			setPopout(null);
		});
	return err;
}
