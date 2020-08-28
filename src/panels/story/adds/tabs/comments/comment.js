import React, { useState } from 'react';
import { Link, Avatar, Cell, RichCell } from '@vkontakte/vkui';
import { connect } from 'react-redux';

import './comment.css';

import { time } from './../../../../../utils/time';
import { setProfile } from '../../../../../store/router/actions';

function getAuthorHref(props) {
	if (!props || !props.v || !props.v.author || !props.v.author.name) {
		return '';
	}
	const id = props.v.author.vk_id;
	const name = props.v.author.name + ' ' + props.v.author.surname;
	return <div style={{ fontWeight: '600' }}>{name}</div>;
}

const Comment = (props) => {
	const author = props.v ? props.v.author : null;
	if (!author) {
		return <>?</>;
	}
	const photoURL = author.photo_url;
	return (
		<RichCell
			style={{ cursor: 'pointer' }}
			onClick={props.onClick}
			text={props.v.text}
			caption={time(props.v.creation_date_time)}
			multiline
			before={<Avatar size={44} src={photoURL} />}
		>
			{getAuthorHref(props)}
		</RichCell>
	);
};

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);

// 260 -> 241 -> 41
