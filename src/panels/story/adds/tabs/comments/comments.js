import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
	Header,
	Group,
	Input,
	Snackbar,
	ActionSheet,
	ActionSheetItem,
	PanelHeaderButton,
	osname,
	IOS,
	Avatar,
} from '@vkontakte/vkui';

import useCommentsGet from './useCommentsGet';

import Man from './../../../../../img/man.jpeg';
import Cat from './../../../../../img/cat.jpg';
import Kitten from './../../../../../img/kitten.jpeg';
import Jins from './../../../../../img/jins.jpg';
import Tea from './../../../../../img/tea.jpg';
import Playstein from './../../../../../img/playstein.jpg';
import Bb from './../../../../../img/bb.jpg';

import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { postComment, deleteComment, editComment } from './requests';

import './comment.css';
import Comment from './comment';

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
	openUser
) {
	return (
		<div style={{ marginBottom: '15%' }}>
			<Group header={<Header mode="secondary">{'комментариев ' + nots.length}</Header>}>
				{nots.map((v, index) => {
					let inner = (
						<Comment
							onClick={() => {
								console.log('compare', v.author.vk_id, myID);
								if (v.author.vk_id != myID) {
									openUser(v.author.vk_id)
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
				})}
			</Group>
		</div>
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
		5,
		props.ad.ad_id
	);
	const [nots, setNots] = useState([]);
	useEffect(()=>{
		if (tnots && tnots.length != 0) {
			setNots(tnots)
		} 
	})

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

	return (
		<div>
			{/* <div style={{ background: '#F7F7F7', paddingBottom: '200px' }}></div> */}
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
				props.openUser
			)}

			{hide || props.hide ? (
				''
			) : (
				<Input
					className="write"
					placeholder="Комментарий"
					value={text}
					onChange={(e) => {
						const { _, value } = e.currentTarget;
						setText(value);
					}}
				/>
			)}

			{hide || props.hide ? (
				''
			) : (
				<PanelHeaderButton
					className="write-button"
					onClick={() => {
						setHide(true);
						console.log('editableIDeditableID', editableID);
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
										duration="2000"
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
					}}
				>
					<Avatar size="20">
						<Icon24Send style={{ color: '#0071B8' }} size="24" />
					</Avatar>
				</PanelHeaderButton>
			)}
		</div>
	);
};

export default Comments;
