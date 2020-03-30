import React from 'react';
import { Cell, Avatar, Button, Div, Card, PanelHeaderButton, CardGrid, Counter, InfoRow } from '@vkontakte/vkui';
import validator from 'validator';

import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Chats from '@vkontakte/icons/dist/24/chats';
import Icon24Live from '@vkontakte/icons/dist/24/live';
import Icon24Message from '@vkontakte/icons/dist/24/message';
import Icon16Place from '@vkontakte/icons/dist/16/place';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';

import Icon24Share from '@vkontakte/icons/dist/24/share';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';

import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';

import { GetCategoryImage, GetCategoryImageSmall } from './Categories';

import Cat from './../../img/cat.jpg';
import './addsTab.css';

const Add2 = props => {
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

	const image = props.photos ? props.photos[0] : '';

	return (
		<div
			style={{
				padding: '10px',
				borderRadius: '10px',
				paddingLeft: '6%',
				paddingRight: '6%',
				verticalAlign: 'bottom',
			}}
		>
			<div
				style={{
					backgroundColor: 'rgba(0,0,0,.8)',
					borderRadius: '10px',
				}}
			>
				<div
					style={{
						borderRadius: '10px',
						padding: '10px',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{!props.anonymous ? (
							<Avatar
								style={{
									padding: '4px',
								}}
								size={16}
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
									color: 'rgb(200,200,200)',
								}}
							>
								{!props.anonymous ? props.username : ''}
							</div>
						</div>
					</div>
					<InfoRow style={{ paddingLeft: "5px", color: 'white' }}> {shortText(props.name, 300)} </InfoRow>

					<div
						style={{
							display: 'flex',
							paddingTop: '4px',
							color: 'rgb(170, 170,170)',
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
				<div
					style={{
						paddingRight: "8px",
						paddingLeft: "8px"
					}}
				>
					<div style={{
						borderRadius: '10px',
						height: '200px',
						backgroundImage: 'url(' + image + ')',
						backgroundSize: 'cover',
					}}></div>
				</div>
				<div style={{ display: 'flex', padding: '10px' }}>
					<div style={{ display: 'flex' }}>
						{/*getFeedback(props.pm, props.comments, props.comments_counter, props.contacts, props.status)*/}
						<PanelHeaderButton mode="secondary" style={{ margin: '5px', color: 'red' }} size="m">
							<Avatar style={{ background: 'rgba(230,0,0,0.7)' }} size={32}>
								<Icon24Delete fill="white" />
							</Avatar>
						</PanelHeaderButton>
						<PanelHeaderButton mode="secondary" style={{ margin: '5px', color: 'red' }} size="m">
							<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
								<Icon24Hide fill="white" />
							</Avatar>
						</PanelHeaderButton>
					</div>
					<div style={{ display: 'flex', float: 'right', marginLeft: 'auto', alignItems: 'flex-start' }}>
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

export default Add2;
