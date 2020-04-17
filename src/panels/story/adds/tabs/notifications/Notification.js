import React, { useState } from 'react';
import { Snackbar, Avatar, Cell, Separator } from '@vkontakte/vkui';

import './notification.css';

import { timeShort } from './../../../../../utils/time';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Question50 from './../../../../../img/50/question.png';

function getImage(props) {
	let photoURL = Question50;
	if (
		props &&
		props.notification &&
		props.notification.payload &&
		props.notification.payload.ad &&
		props.notification.payload.ad.pathes_to_photo
	) {
		photoURL = props.notification.payload.ad.pathes_to_photo[0].PhotoUrl;
	} else if (
		props &&
		props.notification &&
		props.notification.payload &&
		props.notification.payload.author &&
		props.notification.payload.author.photo_url
	) {
		photoURL = props.notification.payload.author.photo_url;
	}
	return <Avatar size={48} src={photoURL} />;
}

const Notification = (props) => {
	return (
		<>
			<Cell
				onClick={() => {
					if (props.ad) {
						props.openAd(props.ad);
					} else {
						props.setSnackbar(
							<Snackbar
								duration="2000"
								onClose={() => {
									props.setSnackbar(null);
								}}
								before={
									<Avatar size={24} style={{ background: 'red' }}>
										<Icon24Cancel fill="#fff" width={14} height={14} />
									</Avatar>
								}
							>
								Данное объявление недоступно!
							</Snackbar>
						);
					}
				}}
				size="l"
				asideContent={
					<span style={{ fontSize: '12', fontWeight: 400, color: 'var(--text_subhead)' }}>
						{timeShort(props.date)}
					</span>
				}
				multiline="true"
				description={
					<span style={{ fontSize: '12', fontWeight: 400, color: 'var(--text_subhead)' }}>
						{props.author + ' '}{' '}
						{props.system ? (
							props.text
						) : (
							<span style={{ color: 'var(--text_secondary)' }}>{props.text}</span>
						)}
					</span>
				}
				before={getImage(props)}
			>
				<span style={{ fontSize: '14' }}>{props.header}</span>
			</Cell>
			<Separator />
		</>
	);
};

export default Notification;

// 260 -> 241 -> 207 -> 87
