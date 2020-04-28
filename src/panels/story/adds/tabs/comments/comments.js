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

import PANEL_ONE from '../../../../App';

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

function showComments(
	setPopout,
	setSnackbar,
	nots,
	lastAdElementRef,
	myID,
	setText,
	setSearch,
	setEditableID,
	setHide,
	openUser,
	mini,
	openCommentaries
) {
	if (nots.length == 0) {
		return;
	}
	return (
		<Group
			header={
				mini ? (
					<Header aside={mini ? <Link onClick={openCommentaries}>Показать все</Link> : ''}>
						{'Комментарии'}
					</Header>
				) : (
					''
				)
			}
		>
			{mini ? (
				<Comment onClick={openCommentaries} v={nots[0]} />
			) : (
				nots.map((v, index) => {
					let inner = (
						<Comment
							onClick={() => {
								if (v.author.vk_id != myID) {
									openUser(v.author.vk_id);
									return;
								}

								setPopout(
									<ActionSheet onClose={() => setPopout(null)}>
										<ActionSheetItem
											autoclose
											onClick={() => {
												setText(v.text);
												setEditableID(v.comment_id);
												setSearch('' + v.comment_id + v.text);
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
													setPopout,
													setSnackbar,
													v,
													(vv) => {
														setSearch('' + v.comment_id + 'deleted');
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

const NO_ID = -1;

const Comments = (props) => {
	const [text, setText] = useState('');
	const [search, setSearch] = useState('');
	const [hide, setHide] = useState(false);

	const [editableID, setEditableID] = useState(NO_ID);

	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, tnots, error, hasMore, newPage } = useCommentsGet(
		props.setPopout,
		search,
		pageNumber,
		props.amount,
		props.ad.ad_id,
		props.maxAmount
	);
	const [nots, setNots] = useState([]);
	useEffect(() => {
		if (tnots && tnots.length != 0) {
			setNots(tnots);
		}
	});

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
		setHide(props.hide);
	}, [props.hide]);

	function sendComment() {
		setHide(true);
		if (editableID != NO_ID) {
			const comment = nots.filter((v) => v.comment_id == editableID)[0];
			comment.text = text;
			const obj = JSON.stringify({
				comment_id: comment.comment_id,
				author_id: props.myID,
				text: text,
			});
			editComment(
				props.setPopout,
				props.setSnackbar,
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
				props.setSnackbar(
					<Snackbar
						duration={SNACKBAR_DURATION_DEFAULT}
						onClose={() => {
							props.setSnackbar(null);
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
				props.setPopout,
				props.setSnackbar,
				props.ad.ad_id,
				obj,
				(v) => {
					setSearch(text);
					setText('');
				},
				(e) => {},
				() => {
					setHide(false);
				}
			);
		}
	}

	return (
		<div>
			{nots.length == 0 ? (
				<Placeholder
					action={
						props.mini ? (
							<Button size="l" onClick={props.openCommentaries}>
								Написать
							</Button>
						) : null
					}
					icon={<Icon56WriteOutline />}
					header="Комментариев нет"
				></Placeholder>
			) : null}
			{showComments(
				props.setPopout,
				props.setSnackbar,
				nots,
				lastAdElementRef,
				props.myID,
				setText,
				setSearch,
				setEditableID,
				setHide,
				props.openUser,
				props.mini,
				props.openCommentaries
			)}

			{hide ? (
				''
			) : (
				<div className="write">
					<Input
						style={{ paddingRight: '30px' }}
						placeholder="Комментарий"
						value={text}
						onChange={(e) => {
							const { _, value } = e.currentTarget;
							setText(value);
						}}
					/>
					<PanelHeaderButton className="write-button" onClick={sendComment}>
						<Avatar size="20">
							<Icon24Send style={{ color: '#0071B8' }} size="24" />
						</Avatar>
					</PanelHeaderButton>
				</div>
			)}
		</div>
	);
};

export default Comments;
