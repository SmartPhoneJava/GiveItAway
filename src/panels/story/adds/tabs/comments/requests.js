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

export async function postComment(setPopout, setSnackbar, ad_id, comment) {
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
			console.log('response from postComment:', response);
			return response.data;
		})
		.then(function (response) {
			setPopout(null);

			return response;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', postComment(setPopout, setSnackbar, ad_id, comment));

			setPopout(null);
		});
	return err;
}

export async function deleteComment(setPopout, setSnackbar, comment) {
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
			console.log('response from postComment:', response);
			return response.data;
		})
		.then(function (response) {
			setPopout(null);

			return response;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', postComment(setPopout, setSnackbar, ad_id, comment));

			setPopout(null);
		});
	return err;
}

export async function editComment(setPopout, setSnackbar, id, comment) {
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
			console.log('response from editComment:', response);
			return response.data;
		})
		.then(function (response) {
			setPopout(null);

			return response;
		})
		.catch(function (error) {
			err = true;
			fail('Нет соединения с сервером', postComment(setPopout, setSnackbar, ad_id, comment));

			setPopout(null);
		});
	return err;
}
