import React, { useState, useEffect } from 'react';
import {
	Avatar,
	PanelHeaderButton,
	Counter,
	Button,
	ActionSheet,
	ActionSheetItem,
	InfoRow,
	HorizontalScroll,
	osname,
	IOS,
} from '@vkontakte/vkui';

import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Chats from '@vkontakte/icons/dist/24/chats';
import Icon16Place from '@vkontakte/icons/dist/16/place';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';

import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';

import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';

import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import './addsTab.css';

import Cat from './../../img/cat.jpg';
import Man from './../../img/man.jpeg';
import Kitten from './../../img/kitten.jpeg';
import Jins from './../../img/jins.jpg';
import Tea from './../../img/tea.jpg';
import Playstein from './../../img/playstein.jpg';
import Bb from './../../img/bb.jpg';

export const AdDefault = {
	ad_id: -1,
	status: 'offer',
	header: 'Тест',
	anonymous: false,
	text: 'Описание',
	creation_date: '13.12.2012',
	feedback_type: 'ls',
	category: 'animals',
	extra_field: '',
	location: 'Барнаул, Яблочная улица',
	photos: [Kitten, Jins, Tea],
	author: {
		vk_id: 2,
		name: 'Алёна',
		surname: 'Чернышева',
		ava: Man,
	},
};

const AddMore = props => {
	const [ad, setAd] = useState(props.ad);

	const [photoIndex, setPhotoIndex] = useState(0);

	useEffect(() => {
		setAd(props.ad);
	}, [props.ad]);

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
		if (!str) {
			return 'error';
		}
		if (str.length > newLength) {
			const s = str.slice(0, newLength);
			return s + '...';
		}
		return str;
	}

	function getContacts(contacts) {
		if (contacts != '') {
			return (
				<Button mode="overlay_primary" size="m" before={getContactsImage(detectContactsType(contacts))}>
					{shortText(contacts, 20)}
				</Button>
			);
		}
		return <div></div>;
	}

	function getPM(pm) {
		if (pm) {
			return (
				<Button mode="overlay_primary" size="m" before={<Icon24Message />}>
					Личные сообщения
				</Button>
			);
		}
		return <div></div>;
	}

	function getComments(comments, comments_counter) {
		if (!comments_counter) {
			comments_counter = 0;
		}
		if (comments) {
			return (
				<div
					style={{
						display: 'flex',
						marginLeft: 'auto',
					}}
				>
					<Button
						size="m"
						after={<Counter mode="secondary">{comments_counter}</Counter>}
						mode="overlay_primary"
						before={<Icon24CommentOutline />}
					>
						Комментарии
					</Button>
				</div>
			);
		}
		return <div></div>;
	}

	function getFeedback(pm, comments, comments_counter, contacts, status) {
		if (status === 'offer') {
			return (
				<div style={{ float: 'right', marginLeft: 'auto' }}>
					{getPM(pm)}

					{getComments(comments, comments_counter)}

					{getContacts(contacts)}
				</div>
			);
		}
		return <div>Обсуждение закрыто</div>;
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

	const image = ad.photos ? ad.photos[photoIndex] : '';

	return (
		<div
			style={{
				padding: '10px',
				borderTopLeftRadius: '10px',
				borderTopRightRadius: '10px',
				paddingLeft: '5%',
				paddingRight: '5%',
			}}
		>
			<div
				style={{
					borderTopLeftRadius: '10px',
					borderTopRightRadius: '10px',
					backgroundImage: 'url(' + image + ')',
					backgroundSize: 'cover',
				}}
			>
				<div
					style={{
						borderTopLeftRadius: '10px',
						borderTopRightRadius: '10px',
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
						{!ad.anonymous ? (
							<Avatar
								style={{
									padding: '4px',
								}}
								size={36}
								src={ad.author.ava}
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
								{!ad.anonymous && ad.author ? ad.author.name : ''}
							</div>
							<div
								style={{
									color: 'rgb(200,200,200)',
								}}
							>
								{ad.creation_date}
							</div>
						</div>
						<div style={{ display: 'flex', padding: '10px' }}>
							{/*getFeedback(props.pm, props.comments, props.comments_counter, props.contacts, props.status)*/}
						</div>
						<div style={{ float: 'right', marginLeft: 'auto', alignItems: 'center' }}>
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
									<Icon24Notification fill="var(--white)" />
								</Avatar>
							</PanelHeaderButton>
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
								disabled={ad.status !== 'offer'}
							>
								<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
									<Icon28SettingsOutline fill="var(--white)" />
								</Avatar>
							</PanelHeaderButton>
						</div>
					</div>
					<InfoRow style={{ color: 'white' }}> {shortText(ad.header, 300)} </InfoRow>
					<InfoRow style={{ color: 'white' }}> {shortText(ad.text, 300)} </InfoRow>

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
							<Icon16Place /> {ad.location}
						</div>
					</div>
				</div>
				<div
					style={{
						borderBottomLeftRadius: '10px',
						borderBottomRightRadius: '10px',
					}}
				>
					<div
						style={{
							backgroundColor: 'rgba(0,0,0,.5)',
							borderBottomLeftRadius: '10px',
							borderBottomRightRadius: '10px',
						}}
					>
						<HorizontalScroll>
							<div style={{ display: 'flex' }}>
								{ad.photos.map((img, i) => {
									return (
										<div
											key={i}
											style={{
												alignItems: 'center',
												justifyContent: 'center',
												padding: '10px',
											}}
										>
											<Button
												mode="tertiary"
												onClick={() => {
													setPhotoIndex(i);
												}}
											>
												<img
													src={img}
													style={{
														height: '50px',
													}}
												/>
											</Button>
										</div>
									);
								})}
							</div>
						</HorizontalScroll>
					</div>
				</div>
			</div>

			{getFeedback(
				ad.feedback_type == 'ls',
				ad.feedback_type == 'comments',
				ad.comments_counter,
				ad.extra_field,
				ad.status
			)}
		</div>
	);
};

export default AddMore;
