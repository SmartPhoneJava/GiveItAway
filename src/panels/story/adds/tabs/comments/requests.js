import React, { useState, useEffect } from 'react';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

import { Addr } from './../../../../../store/addr';

import { fail, success } from './../../../../../requests';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

let request_id = 0;

export async function postComment(setPopout, setSnackbar, ad_id, comment, successCallback, failCallback, end) {
	setPopout(<ScreenSpinner size="large" />);
	let err = false;
	let cancel;

	console.log('data:::', comment);

	await axios({
		method: 'post',
		withCredentials: true,
		data: comment,
		url: Addr.getState() + '/api/ad/' + ad_id + '/comments',
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
	})
		.then(function (response) {
			return response.data;
		})
		.then(function (response) {
			setPopout(null);
			successCallback(response);
			// success('Комментарий отправлен', null, setSnackbar, end);
			end()
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
		url: Addr.getState() + '/api/comment/' + comment.comment_id,
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
		url: Addr.getState() + '/api/comment/' + id,
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
