import React, { useState, useRef, useCallback } from 'react';
import { Header, Group, Input } from '@vkontakte/vkui';

import useCommentsGet from './useCommentsGet';

import Man from './../../../../../img/man.jpeg';
import Cat from './../../../../../img/cat.jpg';
import Kitten from './../../../../../img/kitten.jpeg';
import Jins from './../../../../../img/jins.jpg';
import Tea from './../../../../../img/tea.jpg';
import Playstein from './../../../../../img/playstein.jpg';
import Bb from './../../../../../img/bb.jpg';

import './comment.css';
import Comment from './comment';

const arr = [
	{
		comment_id: 1,
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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
		creation_date: '01.02.2006 15:04',
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

const Comments = (props) => {
	const [search, setSearch] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, nots, error, hasMore, newPage } = useCommentsGet(props.setPopout, search, pageNumber, 5);

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
			<div style={{ background: '#F7F7F7', paddingBottom: '200px' }}>
				<Group header={<Header mode="secondary">{'комментариев ' + arr.length}</Header>}>
					{arr.map((v, index) => {
						let inner = <Comment key={v.id} v={v} />;

						if (arr.length === index + 1) {
							return (
								<div key={v.id} ref={lastAdElementRef}>
									{inner}
								</div>
							);
						} else {
							return <div key={v.id}>{inner}</div>;
						}
					})}
				</Group>
			</div>
			<div style={{ margin: '4px', position: 'fixed', marginBottom: '15%', bottom: '0', width: '100%' }}>
				<Input top="Имя" placeholder="Комментарий" />
			</div>
		</div>
	);
};

export default Comments;
