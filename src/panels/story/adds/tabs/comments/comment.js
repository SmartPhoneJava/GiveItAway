import React, { useState } from 'react';
import { Link, Avatar, Cell, RichCell } from '@vkontakte/vkui';

import './comment.css';

import { time } from './../../../../../utils/time';

function getImage(props) {
	if (!props || !props.v || !props.v.author || !props.v.author.photo_url) {
		return '';
	}
	const photoURL = props.v.author.photo_url;
	return <Avatar size={32} src={photoURL} style={{ padding: '0px' }} />;
}

function getAuthorHref(props) {
	if (!props || !props.v || !props.v.author || !props.v.author.name) {
		return '';
	}
	const id = props.v.author.vk_id;
	const name = props.v.author.name + ' ' + props.v.author.surname;
	return <div style={{ fontWeight: '600' }}>{name}</div>;
}

const Comment = (props) => {
	const author = props.v.author;
	if (!author) {
		return <>?</>;
	}
	const photoURL = author.photo_url;
	return (
		<RichCell
			onClick={props.onClick}
			text={props.v.text}
			caption={time(props.v.creation_date_time)}
			multiline
			before={<Avatar size={44} src={photoURL} style={{ padding: '0px', paddingRight: '0px' }} />}
		>
			{getAuthorHref(props)}
		</RichCell>
	);
};

export default Comment;

// 260 -> 241 -> 41
