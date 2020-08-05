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
	usePlatform,
	IOS,
	Avatar,
	Link,
	Card,
	FixedLayout,
	Div,
	FormStatus,
} from '@vkontakte/vkui';

import { AnimateGroup, AnimateOnChange } from 'react-animation';

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
import { scrollWindow } from '../../../../App';
import { Collapse } from 'react-collapse';

const NO_ID = -1;

const MAX_COMMENT_LENGTH = 500;

const CommentsI = (props) => {
	const osname = usePlatform();
	const { AD, deleteCommentByID, myID, openPopout, openSnackbar, closeSnackbar, closePopout } = props;

	const [nots, setNots] = useState([]);

	const [commentValid, setCommentValid] = useState(false);
	const [tooBigComment, setTooBigComment] = useState(false);
	const [text, setText] = useState('');
	const [hide, setHide] = useState(false);

	const [editableID, setEditableID] = useState(NO_ID);

	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, error, hasMore, newPage } = useCommentsGet(
		props.mini,
		pageNumber,
		AD.comments_count,
		AD.ad_id,
		props.maxAmount
	);

	useEffect(() => {
		console.log('AD is', AD.comments, pageNumber);
		setNots(AD.comments);
	}, [AD.comments]);

	function trySetText(text) {
		setCommentValid(text.length != 0 && text.length <= MAX_COMMENT_LENGTH);
		setTooBigComment(text.length > MAX_COMMENT_LENGTH);
		setText(text);
	}

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

	useEffect(() => {
		console.log('hashashas', hasMore);
	}, [hasMore]);

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
			openPopout(
				<ActionSheet onClose={closePopout}>
					<ActionSheetItem autoclose onClick={() => props.openUser(v.author.vk_id)}>
						Открыть профиль
					</ActionSheetItem>
					<ActionSheetItem
						autoclose
						mode="destructive"
						onClick={() => window.open('https://vk.com/im?media=&sel=-194671970')}
					>
						Пожаловаться
					</ActionSheetItem>
					{osname === IOS && (
						<ActionSheetItem autoclose mode="cancel">
							Отменить
						</ActionSheetItem>
					)}
				</ActionSheet>
			);
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
		return props.mini ? (
			<Group header={<Header aside={<Link onClick={openCommentaries}>Показать все</Link>}>Комментарии</Header>}>
				<Comment onClick={openCommentaries} v={nots[0]} />
			</Group>
		) : (
			<AnimateGroup className="comments-element-outter">
				{nots.map((v, index) => (
					<div
						className="comments-element-inner"
						key={v.comment_id + index}
						ref={nots.length === index + 1 ? lastAdElementRef : null}
					>
						<Card mode="outline">
							<Comment onClick={() => onUserClick(v)} v={v} />
						</Card>
					</div>
				))}
			</AnimateGroup>
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
					scrollWindow(document.body.scrollHeight);
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

	console.log('loading is', loading);

	return (
		<div>
			{nots.length == 0 && !loading ? (
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
				<FixedLayout vertical="bottom">
					<Div>
						<Collapse isOpened={tooBigComment}>
							<FormStatus
								mode="error"
								header={'Слишком много текста'}
							>{`Максимально допустимая длина комментария: ${MAX_COMMENT_LENGTH} символов`}</FormStatus>
						</Collapse>
					</Div>
					<div className="write-comment-panel">
						<div className="write-comment-input">
							<Input
								style={{ transition: '0.3s' }}
								placeholder="Комментарий"
								value={text}
								onChange={(e) => {
									trySetText(e.currentTarget.value);
								}}
							/>
						</div>
						<div className="write-comment-button">
							<PanelHeaderButton disabled={!commentValid} onClick={sendComment}>
								<Avatar size="20">
									<Icon24Send className="write-comment-button-color" size="24" />
								</Avatar>
							</PanelHeaderButton>
						</div>
					</div>
				</FixedLayout>
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

// 279
