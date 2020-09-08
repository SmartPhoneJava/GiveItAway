import React from 'react';
import { ScreenSpinner } from '@vkontakte/vkui';

import axios from 'axios';

import { Addr, BASE_AD, BASE_COMMENT } from './../../../../../store/addr';

import { fail, failEasy, success } from './../../../../../requests';
import { store } from '../../../../..';
import { openPopout, closePopout, updateContext } from '../../../../../store/router/actions';
import { addComment } from '../../../../../store/detailed_ad/actions';
import { now } from 'moment';

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

			const comment = response;

			const router = store.getState().router;
			let newComments = router.activeContext[router.activeStory].comments || [];
			newComments = [...newComments.filter((v) => v.comment_id != comment.comment_id), comment];
			store.dispatch(updateContext({ comments: newComments }));

			successCallback(comment);
			end();
			return response;
		})
		.catch(function (error) {
			if (error.response.status === 429) {
				failEasy('Воу, слишком много комментариев. Нельзя отправить более 50 комментариев за 15 минут');
			} else {
				fail(
					'Комментарий не отправлен',
					() => {
						postComment(ad_id, comment, text, successCallback, failCallback, end);
					},
					end
				);
			}
			err = true;
			failCallback(error);

			console.log('err is ', error);

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
			const router = store.getState().router;
			let newComments = router.activeContext[router.activeStory].comments || [];
			newComments = [...newComments.filter((v) => v.comment_id != comment.comment_id)];
			store.dispatch(updateContext({ comments: newComments }));

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

export async function editComment(real_comment, id, comment, successCallback, failCallback, end) {
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
			const router = store.getState().router;
			let newComments = router.activeContext[router.activeStory].comments || [];
			newComments = newComments.map((v) => {
				if (v.comment_id == real_comment.comment_id) {
					v.text = real_comment.text;
				}
				return v;
			});

			store.dispatch(updateContext({ comments: newComments, comments_update: now() }));

			store.dispatch(closePopout());
			return response;
		})
		.catch(function (error) {
			err = true;
			failCallback(error);
			fail(
				'Комментарий не отредактирован',
				() => {
					editComment(real_comment, id, comment, successCallback, failCallback, end);
				},
				end
			);
			store.dispatch(closePopout());
		});
	return err;
}
