import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
	Header,
	Group,
	Input,
	Snackbar,
	ActionSheet,
	ActionSheetItem,
	PanelHeaderButton,
	Placeholder,
	Button,
	osname,
	IOS,
	Avatar,
	Link,
} from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { setPage, openPopout, openSnackbar, closeSnackbar } from './../../../../../store/router/actions';

import useCommentsGet from './useCommentsGet';

import Man from './../../../../../img/man.jpeg';
import Cat from './../../../../../img/cat.jpg';
import Kitten from './../../../../../img/kitten.jpeg';
import Jins from './../../../../../img/jins.jpg';
import Tea from './../../../../../img/tea.jpg';
import Playstein from './../../../../../img/playstein.jpg';
import Bb from './../../../../../img/bb.jpg';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { postComment, deleteComment, editComment } from './requests';

import './comment.css';
import Comment from './comment';
import { SNACKBAR_DURATION_DEFAULT } from '../../../../../store/const';
import { PANEL_COMMENTS } from '../../../../../store/router/panelTypes';
import { deleteCommentByID } from '../../../../../store/detailed_ad/actions';

const arr = [
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
	{
		comment_id: 1,
		creation_date_time: '01.02.2006 15:04',
		author: {
			vk_id: 23232,
			carma: 0,
			name: 'Семен',
			surname: 'Ефимов',
			photo_url: Man,
		},
		text: 'будет ли здесь какой то текст?',
	},
];

const NO_ID = -1;

const CommentsI = (props) => {
	const { AD, deleteCommentByID, myID, openPopout, openSnackbar, closeSnackbar } = props;

	const nots = AD.comments || [];

	const [text, setText] = useState('');
	const [hide, setHide] = useState(false);

	const [editableID, setEditableID] = useState(NO_ID);

	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, error, hasMore, newPage } = useCommentsGet(
		openPopout,
		pageNumber,
		10,
		AD.ad_id,
		props.maxAmount
	);

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => newPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	function showComments() {
		if (nots.length == 0) {
			return;
		}
		return (
			<Group
				style={{ marginBottom: props.mini ? '0px' : '52px' }}
				header={
					props.mini ? (
						<Header aside={props.mini ? <Link onClick={openCommentaries}>Показать все</Link> : ''}>
							{'Комментарии'}
						</Header>
					) : (
						''
					)
				}
			>
				{props.mini ? (
					<Comment onClick={openCommentaries} v={nots[0]} />
				) : (
					nots.map((v, index) => {
						let inner = (
							<Comment
								onClick={() => {
									if (v.author.vk_id != myID) {
										props.openUser(v.author.vk_id);
										return;
									}

									setPopout(
										<ActionSheet onClose={() => setPopout(null)}>
											<ActionSheetItem
												autoclose
												onClick={() => {
													setText(v.text);
													setEditableID(v.comment_id);
												}}
											>
												Редактировать
											</ActionSheetItem>
											<ActionSheetItem
												autoclose
												mode="destructive"
												onClick={() => {
													setHide(true);
													deleteComment(
														openPopout,
														openPopout,
														v,
														(vv) => {
															deleteCommentByID(v.comment_id);
														},
														(e) => {},
														() => {
															setHide(false);
														}
													);
												}}
											>
												Удалить
											</ActionSheetItem>
											{osname === IOS && (
												<ActionSheetItem autoclose mode="cancel">
													Отменить
												</ActionSheetItem>
											)}
										</ActionSheet>
									);
								}}
								v={v}
							/>
						);

						if (nots.length === index + 1) {
							return (
								<div key={v.comment_id} ref={lastAdElementRef}>
									{inner}
								</div>
							);
						} else {
							return <div key={v.comment_id}>{inner}</div>;
						}
					})
				)}
			</Group>
		);
	}

	function sendComment() {
		setHide(true);
		if (editableID != NO_ID) {
			const comment = nots.filter((v) => v.comment_id == editableID)[0];
			comment.text = text;
			const obj = JSON.stringify({
				comment_id: comment.comment_id,
				author_id: myID,
				text: text,
			});
			editComment(
				openPopout,
				openSnackbar,
				comment.comment_id,
				obj,
				(v) => {
					setEditableID(NO_ID);
					setText('');
				},
				(e) => {},
				() => {
					setHide(false);
				}
			);
		} else {
			if (text.length == 0) {
				openSnackbar(
					<Snackbar
						duration={SNACKBAR_DURATION_DEFAULT}
						onClose={() => {
							closeSnackbar();
							setHide(false);
						}}
						before={
							<Avatar size={24} style={{ background: 'red' }}>
								<Icon24Cancel fill="#fff" width={14} height={14} />
							</Avatar>
						}
					>
						Нельзя отправить комментарий без текста
					</Snackbar>
				);

				return;
			}
			const obj = JSON.stringify({
				author_id: props.myID,
				text: text,
			});
			postComment(
				openPopout,
				openSnackbar,
				AD.ad_id,
				obj,
				(v) => {
					setText('');
				},
				(e) => {},
				() => {
					setHide(false);
				}
			);
		}
	}

	const openCommentaries = () => {
		props.setPage(PANEL_COMMENTS);
	};

	return (
		<div>
			{nots.length == 0 ? (
				<Placeholder
					action={
						props.mini ? (
							<Button size="l" onClick={openCommentaries}>
								Написать
							</Button>
						) : null
					}
					icon={<Icon56WriteOutline />}
					header="Комментариев нет"
				></Placeholder>
			) : null}
			{showComments()}

			{props.mini || hide ? null : (
				<div className="write">
					<Input
						style={{ paddingRight: '30px' }}
						placeholder="Комментарий"
						value={text}
						onChange={(e) => {
							setText(e.currentTarget.value);
						}}
					/>

					<div className="comment-button">
						<PanelHeaderButton onClick={sendComment}>
							<Avatar size="20">
								<Icon24Send style={{ color: '#0071B8' }} size="24" />
							</Avatar>
						</PanelHeaderButton>
					</div>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		AD: state.ad,
		myID: state.vkui.myID,
	};
};

const mapDispatchToProps = {
	setPage,
	deleteCommentByID,
	openPopout,
	openSnackbar,
	closeSnackbar,
};

const Comments = connect(mapStateToProps, mapDispatchToProps)(CommentsI);

export default Comments;
