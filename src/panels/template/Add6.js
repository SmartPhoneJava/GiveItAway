import React, { useState } from 'react';
import { Avatar, PanelHeaderButton, Button, InfoRow, CellButton, Separator } from '@vkontakte/vkui';

import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Chats from '@vkontakte/icons/dist/24/chats';
import Icon16Place from '@vkontakte/icons/dist/16/place';

import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';

import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';

import Icon24Hide from '@vkontakte/icons/dist/24/hide';

import Icon12Lock from '@vkontakte/icons/dist/12/lock';

import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import OpenActions from './components/actions';

import './addsTab.css';
import './Add6.css';

const Add6 = (props) => {
	const [isClosing, setIsClosing] = useState(false);
	const [request, setRequest] = useState('no');

	function detectContactsType(contacts) {
		const ematlRG = '/.+@.+..+/i';
		if (contacts.match(ematlRG)) {
			return 'email';
		}
		if (contacts.indexOf('http')) {
			return 'web';
		}
		// const phoneRG = "/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$"
		// if (contacts.match(phoneRG)) {
		// 	return 'phone';
		// }
		return 'no';
		/**  */
	}

	function getContactsImage(type) {
		switch (type) {
			case 'email':
				return <Icon24Mention />;
			case 'phone':
				return <Icon24Phone />;
		}
		return <Icon24Info />;
	}

	function shortText(str, newLength) {
		if (str.length > newLength) {
			const s = str.slice(0, newLength);
			return s + '...';
		}
		return str;
	}

	function getFeedback(pm, comments) {
		if (pm) {
			return (
				<Icon24Chats
					onClick={() => {
						props.openAd();
					}}
					fill="var(--grey)"
				/>
			);
		}
		if (comments) {
			return (
				<Icon24CommentOutline
					onClick={() => {
						props.openAd();
					}}
					fill="var(--grey)"
				/>
			);
		}
		return (
			<Icon24Info
				onClick={() => {
					props.openAd();
				}}
				fill="var(--grey)"
			/>
		);
	}

	const image = props.ad.pathes_to_photo ? props.ad.pathes_to_photo[0].PhotoUrl : '';

	function openSettings() {
		props.chooseAdd(props.ad);
		OpenActions(
			props.setPopout,
			props.setSnackbar,
			props.refresh,
			props.ad.ad_id,
			() => {
				props.onCloseClick();
				setRequest('CLOSE');
			},
			() => {
				setRequest('CANCEL_CLOSE');
			},
			isClosing,
			props.ad.hidden
		);
	}

	function controllButton() {
		return props.myID == props.ad.author.vk_id ? (
			<PanelHeaderButton
				mode="primary"
				size="m"
				onClick={openSettings}
				disabled={props.ad.status !== 'offer' && props.ad.status !== 'chosen'}
			>
				<Icon28SettingsOutline fill="#305ADF" />
			</PanelHeaderButton>
		) : (
			''
		);
	}

	function authorPanel() {
		return (
			<div
				style={{
					display: 'flex',
					paddingBottom: '10px',
					alignItems: 'center',
				}}
			>
				{!props.ad.anonymous ? (
					<Avatar
						style={{
							marginRight: '5px',
						}}
						size={36}
						src={props.ad.author.photo_url}
					/>
				) : (
					''
				)}
				<div
					style={{
						display: 'block',
					}}
				>
					<div>{!props.ad.anonymous ? props.ad.author.name + ' ' + props.ad.author.surname : ''}</div>
					<div
						style={{
							color: 'grey',
						}}
					>
						{props.ad.creation_date}
					</div>
				</div>
			</div>
		);
	}

	function commonActions() {
		return (
			<div style={{ float: 'right', marginLeft: 'auto', alignItems: 'center' }}>
				<PanelHeaderButton mode="secondary" className="button" size="m" disabled={props.ad.status !== 'offer'}>
					{getFeedback(props.ad.feedback_type == 'ls', props.ad.feedback_type == 'comments')}
				</PanelHeaderButton>
				<PanelHeaderButton mode="secondary" className="button" size="m">
					<Icon24ShareOutline fill="var(--grey)" />
				</PanelHeaderButton>
				<PanelHeaderButton mode="secondary" className="button" size="m">
					<Icon24LikeOutline fill="var(--grey)" />
				</PanelHeaderButton>
			</div>
		);
	}

	return (
		<div
			style={{
				padding: '5px',
				paddingLeft: '2%',
				paddingRight: '2%',
				verticalAlign: 'bottom',
			}}
		>
			<div className="tile">
				{/* <div style={{ width: '50%' }}>
					<div
						style={{
							borderRadius: '10px',
							backgroundImage: 'url(' + encodeURI(image) + ')',
							backgroundSize: 'contain',
							backgroundRepeat: 'no-repeat',
						}}
					>
						<div style={{ height: '150px', width: '150px' }}> </div>
					</div>
				</div> */}
				<div className="main">
					<div
						style={{
							position: 'relative',
							display: 'inline-block',
							marginRight: '120px',
							marginBottom: '120px',
						}}
					>
						<img src={image} className="tiled" />
						<div className="city">
							<div
								style={{ display: 'flex', color: 'rgb(200,200,200)', fontSize: '12px', padding: '2px' }}
							>
								<Icon16Place /> {props.ad.district}
							</div>
						</div>
						{props.ad.hidden ? (
							<div className="hidden">
								<div style={{ display: 'flex', color: 'white', fontSize: '12px', padding: '2px' }}>
									<Icon12Lock />
									Видно только вам
								</div>
							</div>
						) : (
							''
						)}
					</div>
					<div>
						<div style={{ padding: '10px' }}>
							{authorPanel()}
							<InfoRow> {shortText(props.ad.header, 300)} </InfoRow>
						</div>
					</div>
				</div>
				<Separator />
				<div style={{ display: 'flex' }}>
					{controllButton()}
					{commonActions()}
				</div>
			</div>
		</div>
	);
};

export default Add6;

// 329
