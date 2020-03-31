import React from 'react';
import { Avatar, PanelHeaderButton, ActionSheet, ActionSheetItem, InfoRow, osname, IOS } from '@vkontakte/vkui';

import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Chats from '@vkontakte/icons/dist/24/chats';
import Icon16Place from '@vkontakte/icons/dist/16/place';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';

import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';

import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';

import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import './addsTab.css';

const Add5 = props => {
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
					fill="var(--white)"
				/>
			);
		}
		if (comments) {
			return (
				<Icon24CommentOutline
					onClick={() => {
						props.openAd();
					}}
					fill="var(--white)"
				/>
			);
		}
		return (
			<Icon24Info
				onClick={() => {
					props.openAd();
				}}
				fill="var(--white)"
			/>
		);
	}

	// function Animals(str) {
	//   if (str.search("animals") > 0) {
	//     return <img src={Animal} className="category" />;
	//   }
	// }

	// function Books(str) {
	//   if (str.search("books") > 0) {
	//     return <img src={Book} className="category" />;
	//   }
	// }

	// function getCategory(category) {
	//   return (
	//     <Div style={{ paddingTop: 0, paddingBottom: 0, color: "black" }}>
	//       {Animals(category)} {Books(category)}
	//     </Div>
	//   );
	// }

	function getName(anonymous) {
		if (anonymous) {
			return;
		}
		return;
	}

	const image = props.photos ? props.photos[0] : '';

	return (
		<div
			style={{
				padding: '10px',
				borderRadius: '10px',
				paddingLeft: '5%',
				paddingRight: '5%',
				verticalAlign: 'bottom',
			}}
		>
			<div
				style={{
					borderRadius: '10px',
					backgroundImage: 'url(' + image + ')',
					backgroundSize: 'cover',
				}}
			>
				<div
					style={{
						borderRadius: '10px',
						padding: '10px',
						backgroundColor: 'rgba(0,0,0,.5)',
					}}
				>
					<div
						style={{
							display: 'flex',
							paddingBottom: '10px',
							alignItems: 'center',
							color: 'color: rgb(180, 180,180)',
						}}
					>
						{!props.anonymous ? (
							<Avatar
								style={{
									padding: '4px',
								}}
								size={36}
								src={props.ava}
							/>
						) : (
							<div />
						)}
						<div
							style={{
								display: 'block',
							}}
						>
							<div
								style={{
									color: 'white',
								}}
							>
								{!props.anonymous ? props.username : ''}
							</div>
							<div
								style={{
									color: 'rgb(200,200,200)',
								}}
							>
								{props.date}
							</div>
						</div>
						<PanelHeaderButton
							mode="primary"
							style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
							size="m"
							onClick={() => {
								props.setPopout(
									<ActionSheet onClose={() => props.setPopout(null)}>
										<ActionSheetItem autoclose>Объявить завершенным</ActionSheetItem>
										<ActionSheetItem autoclose mode="destructive">
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
							disabled={props.status !== 'offer'}
						>
							<Icon28SettingsOutline fill="white" />
						</PanelHeaderButton>
					</div>
					<InfoRow style={{ color: 'white' }}> {shortText(props.name, 300)} </InfoRow>

					<div
						style={{
							display: 'flex',
							paddingTop: '20px',
							color: 'rgb(200, 200,200)',
						}}
					>
						<div
							style={{
								display: 'flex',
								fontStyle: 'italic',
							}}
						>
							<Icon16Place /> {props.location}
						</div>
					</div>
				</div>
				<div style={{ display: 'flex', padding: '10px' }}>
					{/*getFeedback(props.pm, props.comments, props.comments_counter, props.contacts, props.status)*/}

					<div style={{ float: 'right', marginLeft: 'auto', alignItems: 'center' }}>
						<PanelHeaderButton
							mode="secondary"
							style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
							size="m"
							disabled={props.status !== 'offer'}
						>
							<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
								{getFeedback(props.pm, props.comments)}
							</Avatar>
						</PanelHeaderButton>
						<PanelHeaderButton
							mode="secondary"
							style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
							size="m"
						>
							<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
								<Icon24ShareOutline fill="var(--white)" />
							</Avatar>
						</PanelHeaderButton>
						<PanelHeaderButton
							mode="secondary"
							style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
							size="m"
						>
							<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
								<Icon24LikeOutline fill="var(--white)" />
							</Avatar>
						</PanelHeaderButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Add5;