import React from 'react';
import { ScreenSpinner } from '@vkontakte/vkui';

import axios from 'axios';

import { Addr, BASE_AD, BASE_COMMENT } from './../../../../../store/addr';

import { fail, success } from './../../../../../requests';
import { store } from '../../../../..';
import { openPopout, closePopout } from '../../../../../store/router/actions';
import { addComment } from '../../../../../store/detailed_ad/actions';

let request_id = 0;

export async function postComment(ad_id, comment, comment_text, successCallback, failCallback, end) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));

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
			store.dispatch(closePopout());
			var comment = {};
			console.log('comment is1', store.getState().ad.comments_count);
			console.log('comment is2', store.getState().vkui.myUser);
			console.log('comment is2', store.getState().vkui.myUser);
			comment.comment_id = store.getState().ad.comments_count;
			const vkUser = store.getState().vkui.myUser;
			comment.author = {
				vk_id: vkUser.id,
				name: vkUser.first_name,
				surname: vkUser.last_name,
				photo_url: vkUser.photo_100,
			};
			comment.creation_date_time = new Date();
			comment.text = comment_text;
			
			store.dispatch(addComment(comment));
			successCallback(response);
			end();
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Комментарий не отправлен',
				() => {
					postComment(ad_id, comment, text, successCallback, failCallback, end);
				},
				end
			);
			store.dispatch(closePopout());
		});
	return err;
}

export async function deleteComment(comment, successCallback, failCallback, end) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
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
			success('Комментарий удален', null, end);
			successCallback(response);
			store.dispatch(closePopout());
			return response;
		})
		.catch(function (error) {
			err = true;
			fail(
				'Комментарий не удален',
				() => {
					deleteComment(comment, successCallback, failCallback, end);
				},
				end
			);
			failCallback(error);
			store.dispatch(closePopout());
		});
	return err;
}

export async function editComment(id, comment, successCallback, failCallback, end) {
	store.dispatch(openPopout(<ScreenSpinner size="large" />));
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
			success('Комментарий отредактирован', null, end);
			store.dispatch(closePopout());
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Комментарий не отредактирован',
				() => {
					editComment(id, comment, successCallback, failCallback, end);
				},
				end
			);
			store.dispatch(closePopout());
		});
	return err;
}
