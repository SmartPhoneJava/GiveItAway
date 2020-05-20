import React, { useState, useRef, useCallback } from 'react';
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
	usePlatform,
	IOS,
	Avatar,
	Link,
} from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { setPage, openPopout, openSnackbar, closeSnackbar, closePopout } from './../../../../../store/router/actions';

import useCommentsGet from './useCommentsGet';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { postComment, deleteComment, editComment } from './requests';

import './comment.css';
import Comment from './comment';
import { SNACKBAR_DURATION_DEFAULT } from '../../../../../store/const';
import { PANEL_COMMENTS } from '../../../../../store/router/panelTypes';
import { deleteCommentByID } from '../../../../../store/detailed_ad/actions';

const NO_ID = -1;

const CommentsI = (props) => {
	const osname = usePlatform();
	const { AD, deleteCommentByID, myID, openPopout, openSnackbar, closeSnackbar, closePopout } = props;

	const nots = AD.comments || [];

	const [text, setText] = useState('');
	const [hide, setHide] = useState(false);

	const [editableID, setEditableID] = useState(NO_ID);

	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, error, hasMore, newPage } = useCommentsGet(
		props.mini,
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

	function onEditClick(v) {
		setText(v.text);
		setEditableID(v.comment_id);
	}

	function onDeleteClick(v) {
		setHide(true);
		deleteComment(
			v,
			(vv) => {
				deleteCommentByID(v.comment_id);
			},
			(e) => {},
			() => {
				setHide(false);
			}
		);
	}

	function onUserClick(v) {
		if (v.author.vk_id != myID) {
			props.openUser(v.author.vk_id);
			return;
		}

		openPopout(
			<ActionSheet onClose={closePopout}>
				<ActionSheetItem autoclose onClick={() => onEditClick(v)}>
					Редактировать
				</ActionSheetItem>
				<ActionSheetItem autoclose mode="destructive" onClick={() => onDeleteClick(v)}>
					Удалить
				</ActionSheetItem>
				{osname === IOS && (
					<ActionSheetItem autoclose mode="cancel">
						Отменить
					</ActionSheetItem>
				)}
			</ActionSheet>
		);
	}

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
						let inner = <Comment onClick={() => onUserClick(v)} v={v} />;

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
	closePopout,
};

const Comments = connect(mapStateToProps, mapDispatchToProps)(CommentsI);

export default Comments;
