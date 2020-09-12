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
	RichCell,
	CellButton,
	SimpleCell,
	Cell,
	Textarea,
} from '@vkontakte/vkui';

import { AnimateGroup, AnimateOnChange } from 'react-animation';

import { connect } from 'react-redux';

import {
	setPage,
	openPopout,
	openSnackbar,
	closeSnackbar,
	closePopout,
	updateContext,
} from './../../../../../store/router/actions';

import useCommentsGet from './useCommentsGet';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';
import Icon24Write from '@vkontakte/icons/dist/24/write';

import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { postComment, deleteComment, editComment } from './requests';

import { WHITE_LIST } from './../../../../template/Add7';

import './comment.css';
import Comment from './comment';
import { PANEL_COMMENTS } from '../../../../../store/router/panelTypes';
import { scrollWindow } from '../../../../../App';
import { Collapse } from 'react-collapse';
import { withLoadingIf } from '../../../../../components/image/image_cache';
import { openTab } from '../../../../../services/_functions';
import { fail } from '../../../../../requests';
import { DIRECTION_BACK } from '../../../../../store/router/directionTypes';

const NO_ID = -1;

const MAX_COMMENT_LENGTH = 500;

const CommentsI = (props) => {
	const osname = usePlatform();
	const { myID, openPopout, openSnackbar, closeSnackbar, closePopout, updateContext } = props;

	const [nots, setNots] = useState([]);

	const [commentValid, setCommentValid] = useState(false);
	const [tooBigComment, setTooBigComment] = useState(false);
	const [isEditting, setIsEditting] = useState(false);
	const [text, setText] = useState('');
	const [hide, setHide] = useState(false);

	const [editableID, setEditableID] = useState(NO_ID);
	const [editableText, setEditableText] = useState('');

	const [pageNumber, setPageNumber] = useState(1);
	const observer = useRef();

	const [saveWriteText, setSaveWriteText] = useState('');
	useEffect(() => {
		if (props.to == PANEL_COMMENTS) {
			const context = props.activeContext[props.activeStory];

			if (context) {
				setCommentValid(context.commentValid);
				setTooBigComment(context.tooBigComment);
				setIsEditting(context.isEditting);
				setText(context.save_text);
				setEditableID(context.editableID || -1);
				setEditableText(context.editableText);
				setSaveWriteText(context.saveWriteText);
			}
		}
	}, [props.to]);

	useEffect(() => {
		updateContext({ saveWriteText });
	}, [saveWriteText]);

	useEffect(() => {
		updateContext({ save_text: text });
	}, [text]);

	useEffect(() => {
		updateContext({ isEditting });
	}, [isEditting]);

	useEffect(() => {
		updateContext({ editableText });
	}, [editableText]);

	useEffect(() => {
		updateContext({ editableID });
	}, [editableID]);
	useEffect(() => {
		updateContext({ commentValid });
	}, [commentValid]);
	useEffect(() => {
		updateContext({ tooBigComment });
	}, [tooBigComment]);

	const { ad_id } = props.activeContext[props.activeStory];

	let { inited, loading, error, hasMore, newPage } = useCommentsGet(
		props.mini,
		pageNumber,
		10,
		ad_id,
		props.maxAmount
	);

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
		if (props.from == PANEL_COMMENTS) {
			return;
		}
		const comments = props.activeContext[props.activeStory].comments || [];
		console.log('comments are', props.activeContext[props.activeStory].comments);
		setNots(comments);
	}, [props.activeContext[props.activeStory].comments, props.activeContext[props.activeStory].comments_update]);

	function trySetText(text, save) {
		let vtext = text;
		if (text) {
			vtext = vtext.trim();
		}
		setCommentValid(vtext.length != 0 && text.length <= MAX_COMMENT_LENGTH);
		setTooBigComment(text.length > MAX_COMMENT_LENGTH);
		setText((prev) => {
			if (save) {
				setSaveWriteText(prev);
				console.log('saaave', prev);
			}
			return text;
		});
	}

	function onEditClick(v) {
		trySetText(v.text, true);
		setEditableID(v.comment_id);
		setIsEditting(true);
		setEditableText(v.text);
	}

	function onDeleteClick(v) {
		trySetText('');
		setEditableText('');
		setEditableID(NO_ID);
		setIsEditting(false);
		setHide(true);
		deleteComment(
			v,
			(vv) => {},
			(e) => {},
			() => {
				setHide(false);
			}
		);
	}

	function onUserClick(v) {
		const isAdmin = WHITE_LIST.indexOf(myID) >= 0;
		if (v.author.vk_id != myID) {
			openPopout(
				<ActionSheet onClose={closePopout}>
					<ActionSheetItem autoclose onClick={() => props.openUser(v.author.vk_id)}>
						Открыть профиль
					</ActionSheetItem>
					<ActionSheetItem
						autoclose
						mode="destructive"
						onClick={() => openTab('https://vk.com/im?media=&sel=-194671970')}
					>
						Пожаловаться
					</ActionSheetItem>
					{isAdmin && (
						<ActionSheetItem autoclose mode="destructive" onClick={() => onDeleteClick(v)}>
							Удалить
						</ActionSheetItem>
					)}
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

	const [commentsComponent, setCommentsComponent] = useState(<></>);
	useEffect(() => {
		const AD = props.activeContext[props.activeStory];
		if (!AD || !AD.comments || AD.comments.length == 0) {
			setCommentsComponent(<></>);
			return;
		}
		console.log('AD.comments', nots.length);
		setCommentsComponent(
			props.mini ? (
				<Group
					header={
						<Header
							aside={
								<Link style={{ cursor: 'pointer' }} onClick={openCommentaries}>
									Показать все
								</Link>
							}
						>
							Комментарии
						</Header>
					}
				>
					<Comment onClick={openCommentaries} v={nots[0]} />
				</Group>
			) : (
				<AnimateGroup className="comments-element-outter">
					{nots.map((v, index) => (
						<div
							className="comments-element-inner"
							key={v.comment_id + index}
							ref={nots.length == index + 1 ? lastAdElementRef : null}
						>
							<Card mode="outline">
								<Comment style={{ cursor: 'pointer' }} onClick={() => onUserClick(v)} v={v} />
							</Card>
						</div>
					))}
				</AnimateGroup>
			)
		);
	}, [nots, props.activeContext[props.activeStory].comments_update, lastAdElementRef, loading, hasMore]);

	function sendComment() {
		setHide(true);
		if (editableID != NO_ID) {
			const comment = nots.filter((v) => v.comment_id == editableID)[0];
			const saveCommentText = comment.text;
			comment.text = text.replace(/\s+/g, ' ').trim();
			const obj = JSON.stringify({
				comment_id: comment.comment_id,
				author_id: myID,
				text: text.replace(/\s+/g, ' ').trim(),
			});
			editComment(
				comment,
				comment.comment_id,
				obj,
				(v) => {
					setEditableID(NO_ID);
					setIsEditting(false);
					trySetText(saveWriteText);
					setEditableText('');
					setSaveWriteText('');
				},
				(e) => {
					comment.text = saveCommentText;
				},
				() => {
					setHide(false);
				}
			);
		} else {
			if (text.length == 0 || text.trim() == 0) {
				openSnackbar(
					<Snackbar
						duration={'1500'}
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
				text: text.replace(/\s+/g, ' ').trim(),
			});
			postComment(
				props.activeContext[props.activeStory].ad_id,
				obj,
				text.replace(/\s+/g, ' ').trim(),
				(v) => {
					trySetText('');

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

	const [placeholder, setPlaceholder] = useState();
	useEffect(() => {
		if (nots.length > 0) {
			setPlaceholder(null);
			return;
		}

		const elem = props.mini ? (
			withLoadingIf(
				!loading,
				nots.length == 0 ? (
					<CellButton style={{ cursor: 'pointer' }} onClick={openCommentaries} before={<Icon24Write />}>
						Написать первый комментарий
					</CellButton>
				) : null,

				'large',
				null,
				{ padding: '10px' }
			)
		) : nots.length == 0 && !loading ? (
			<div className="flex-center" style={{ width: '100%' }}>
				<Placeholder
					action={
						props.mini ? (
							<Button size="l" onClick={openCommentaries} style={{ cursor: 'pointer' }}>
								Написать
							</Button>
						) : null
					}
					icon={<Icon56WriteOutline />}
					header="Комментариев нет"
				/>
			</div>
		) : null;

		setPlaceholder(elem);
	}, [nots, loading]);

	return (
		<div>
			{placeholder}

			{commentsComponent}

			{props.mini || hide ? null : (
				<FixedLayout vertical="bottom">
					<div className="write-comment-input-before">
						<Cell
							style={{ padding: '0px' }}
							multiline
							description={
								<>
									<Collapse isOpened={isEditting}>{editableText}</Collapse>
									<div className="write-comment-panel">
										<div className="write-comment-input">
											<Collapse isOpened={!isEditting}>
												<Input
													onKeyPress={(target) => {
														if (target.charCode == 13) {
															sendComment();
														}
													}}
													style={{ transition: '0.3s' }}
													placeholder="Текст"
													value={text}
													onChange={(e) => {
														trySetText(e.currentTarget.value);
													}}
												/>
											</Collapse>

											<Collapse isOpened={isEditting}>
												<Textarea
													onKeyPress={(target) => {
														if (target.charCode == 13) {
															sendComment();
														}
													}}
													style={{ transition: '0.3s' }}
													placeholder="Текст"
													value={text}
													onChange={(e) => {
														trySetText(e.currentTarget.value);
													}}
												/>
											</Collapse>
										</div>
										<div className="write-comment-button">
											<PanelHeaderButton
												style={{ cursor: commentValid ? 'pointer' : null }}
												disabled={!commentValid}
												onClick={sendComment}
											>
												<Avatar size="20">
													<Icon24Send className="write-comment-button-color" size="24" />
												</Avatar>
											</PanelHeaderButton>
										</div>
									</div>
								</>
							}
						>
							<div>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div className="write-comment-input-left">
										{editableID == NO_ID ? 'Новый комментарий' : 'Редактирование'}
									</div>
									<div className="write-comment-input-right">
										<CellButton
											mode={editableID == NO_ID ? 'primary' : 'danger'}
											disabled={editableID == NO_ID && text == ''}
											style={{
												cursor: 'pointer',
												margin: '0px',
												padding: '0px',
												transition: '0.3s',
											}}
											onClick={() => {
												trySetText('');
												if (editableID == NO_ID) {
													return;
												}
												setEditableID(NO_ID);
												setIsEditting(false);
												setEditableText('');
												trySetText(saveWriteText);
												setSaveWriteText('');
											}}
										>
											{editableID == NO_ID ? 'Очистить' : 'Отменить'}
										</CellButton>
									</div>
								</div>

								<Collapse isOpened={tooBigComment}>
									<FormStatus
										mode="error"
										header={'Слишком много текста'}
									>{`Максимально допустимая длина комментария: ${MAX_COMMENT_LENGTH} символов`}</FormStatus>
								</Collapse>
							</div>
						</Cell>
					</div>
					{/* {helpButton} */}
				</FixedLayout>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		myID: state.vkui.myID,
		activeStory: state.router.activeStory,
		activeContext: state.router.activeContext,

		to: state.router.to,
		from: state.router.from,
	};
};

const mapDispatchToProps = {
	setPage,
	openPopout,
	openSnackbar,
	closeSnackbar,
	closePopout,
	updateContext,
};

const Comments = connect(mapStateToProps, mapDispatchToProps)(CommentsI);

export default Comments;

// 279 -> 445
