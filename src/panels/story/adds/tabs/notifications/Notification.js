import React, { useState } from 'react';
import { Snackbar, Avatar, Cell, Separator } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import './notification.css';

import { timeShort } from './../../../../../utils/time';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Gift from './../../../../../img/icon278.png';

import { SNACKBAR_DURATION_DEFAULT } from '../../../../../store/const';
import { openSnackbar, closeSnackbar, setAd } from '../../../../../store/router/actions';
import { setExtraInfo } from '../../../../../store/detailed_ad/actions';

function getImage(props) {
	let photoURL = Gift;
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

const NotificationInner = (props) => {
	const { openSnackbar, closeSnackbar, setExtraInfo, setAd } = props;

	return (
		<>
			<Cell
				style={{ cursor: 'pointer' }}
				onClick={() => {
					if (props.ad) {
						setExtraInfo(props.ad);
						setAd(props.ad);
					} else {
						openSnackbar(
							<Snackbar
								duration={SNACKBAR_DURATION_DEFAULT}
								onClose={closeSnackbar}
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

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {
	openSnackbar,
	closeSnackbar,
	setExtraInfo,
	setAd,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationInner);

// 260 -> 241 -> 207 -> 87
