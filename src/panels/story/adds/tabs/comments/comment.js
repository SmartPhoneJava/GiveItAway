import React, { useState } from 'react';
import { PanelHeaderSimple, Link, Avatar, Button, Cell } from '@vkontakte/vkui';

import './comment.css';

import {time} from "./../../../../../utils/time"

function shortText(str, newLength) {
	if (str.length > newLength) {
		const s = str.slice(0, newLength);
		return s + '...';
	}
	return str;
}

function getHeader(props) {
	if (
		!props ||
		!props.notification ||
		!props.notification.payload ||
		!props.notification.payload.ad ||
		!props.notification.payload.ad.header
	) {
		return '';
	}
	const header = props.notification.payload.ad.header;
	return <Link style={{ marginRight: '3px' }}>{shortText(header, 30)}</Link>;
}

function getImage(props) {
	if (!props || !props.v || !props.v.author || !props.v.author.photo_url) {
		return '';
	}
	const photoURL = props.v.author.photo_url;
	return <Avatar size={32} src={photoURL} />;
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
	return (
		<Cell
			onClick={props.onClick}
			className="block_in"
			size="l"
			multiline="true"
			description={
				<div style={{ display: 'flex', marginTop: '2px' }}>
					<div style={{ marginRight: '4px', color:"var(--text_secondary)" }}>{time(props.v.creation_date_time)} </div>
				</div>
			}
			before={getImage(props)}
		>
			<div className="block">
				<div style={{ display: 'block' }}>
					{getAuthorHref(props)}
					<div style={{color:"var(--text_subhead)"}}>{props.v.text} </div>
				</div>
			</div>
		</Cell>
	);
};

export default Comment;

// 260 -> 241
