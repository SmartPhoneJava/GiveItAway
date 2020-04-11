import React, { useState, useEffect } from 'react';
import {
	Avatar,
	PanelHeaderButton,
	Counter,
	Button,
	CellButton,
	Group,
	Header,
	InfoRow,
	HorizontalScroll,
	Cell,
	Link,
	Separator,
} from '@vkontakte/vkui';

import { GetCategoryText } from './Categories';

import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Chats from '@vkontakte/icons/dist/24/chats';
import Icon16Place from '@vkontakte/icons/dist/16/place';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';

import Icon24VideoFill from '@vkontakte/icons/dist/24/video_fill';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';

import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';
import Icon24Message from '@vkontakte/icons/dist/24/message';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Icon28ArrowLeftOutline from '@vkontakte/icons/dist/28/arrow_left_outline';
import Icon28ArrowRightOutline from '@vkontakte/icons/dist/28/arrow_right_outline';

import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon24Place from '@vkontakte/icons/dist/24/place';

import { subscribe, unsubscribe, getDetails, getSubscribers, getDeal, acceptDeal, denyDeal } from './../../requests';

import './addsTab.css';

import './styles.css';

import Cat from './../../img/cat.jpg';
import Man from './../../img/man.jpeg';
import Kitten from './../../img/kitten.jpeg';
import Jins from './../../img/jins.jpg';
import Tea from './../../img/tea.jpg';
import Playstein from './../../img/playstein.jpg';
import Bb from './../../img/bb.jpg';

import Comments from './../story/adds/tabs/comments/comments';

import OpenActions from './components/actions';

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
	views_count: '87',
	location: 'Барнаул, Яблочная улица',
	pathes_to_photo: [
		{ AdPhotoId: 1, PhotoUrl: Kitten },
		{ AdPhotoId: 2, PhotoUrl: Jins },
		{ AdPhotoId: 3, PhotoUrl: Tea },
	],
	author: {
		vk_id: 2,
		name: 'Алёна',
		surname: 'Чернышева',
		photo_url: Man,
	},
};

const AddMore2 = (props) => {
	const [ad, setAd] = useState(props.ad || AdDefault);

	const [photoIndex, setPhotoIndex] = useState(0);

	const [subs, setSubs] = useState(0);

	const [isSub, setIsSub] = useState(false);
	const [isDealer, setIsDealer] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [Deal, setDeal] = useState({});

	const [request, setRequest] = useState('no');

	async function initSubscribers(id) {
		let { subscribers, err } = await getSubscribers(props.setPopout, props.setSnackbar, id);
		subscribers = subscribers || [];
		console.log('subscribers', subscribers);
		if (!err) {
			setSubs(subscribers);
			setIsSub(isSubscriber(subscribers));
		}
		return { subscribers, err };
	}

	useEffect(() => {
		async function init() {
			const id = props.ad ? props.ad.ad_id : -1;
			if (id < 0) {
				setAd(AdDefault);
			} else {
				let { details, err } = await getDetails(props.setPopout, props.setSnackbar, id);
				if (!err) {
					setAd(details);
					initSubscribers(id);
					console.log('detailed look', details);
					setIsClosing(details.status == 'chosen');

					let { deal, err } = await getDeal(props.setSnackbar, details.ad_id);
					if (!err) {
						console.log('isDealer', deal.subscriber_id, props.VkUser.getState().id);
						setIsDealer(deal.subscriber_id == props.VkUser.getState().id);
						setDeal(deal);
					}
				}
			}
		}
		init();
		console.log('need refresh catched');
	}, [props.ad, request]);

	function detectContactsType(contacts) {
		if (!contacts) {
			return 'error';
		}
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

	function getContacts(contacts) {
		if (contacts && contacts != '') {
			return (
				<Button mode="overlay_primary" size="m" before={getContactsImage(detectContactsType(contacts))}>
					{contacts}
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
						onClick={props.commentsOpen}
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

	function isAuthor() {
		return props.VkUser.getState().id == ad.author.vk_id;
	}

	function isSubscriber(subscribers) {
		return (
			!isAuthor() &&
			subscribers &&
			subscribers.length > 0 &&
			subscribers.filter((v) => v.vk_id == props.VkUser.getState().id).length > 0
		);
	}

	function unsub() {
		const err = unsubscribe(props.setPopout, props.setSnackbar, ad.ad_id, sub);
		if (!err) {
			setIsSub(false);
		}
	}

	function sub() {
		const err = subscribe(props.setPopout, props.setSnackbar, ad.ad_id, unsub);
		if (!err) {
			setIsSub(true);
		}
	}

	function feedbackText() {
		if (ad.feedback_type == 'ls') {
			return <CellButton>Личные сообщения</CellButton>;
		} else if (ad.feedback_type == 'comments') {
			return <CellButton>Комментарии</CellButton>;
		}
		return <Cell>{ad.extra_field}</Cell>;
	}

	console.log('adadadad', ad);
	const image = ad.pathes_to_photo ? ad.pathes_to_photo[photoIndex].PhotoUrl : '';

	return (
		<div>
			{/* <div
				style={{
					borderTopLeftRadius: '10px',
					borderTopRightRadius: '10px',
					backgroundImage: 'url(' + encodeURI(image) + ')',
					backgroundSize: 'cover',
					display: 'flex'
				}}
			>
				
			</div> */}
			<div
				style={{
					position: 'relative',
					display: 'inline-block',
				}}
			>
				<img
					srcSet={image}
					style={{
						width: '100%',
						objectFit: 'cover',
					}}
				/>
				<div style={{ right: '10px', position: 'absolute', top: '10px' }}>
					<PanelHeaderButton
						mode="secondary"
						style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
						size="m"
					>
						<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
							<Icon24VideoFill fill="var(--white)" />
						</Avatar>
					</PanelHeaderButton>
				</div>
			</div>
			{!ad.pathes_to_photo || ad.pathes_to_photo.length <= 1 ? (
				''
			) : (
				<HorizontalScroll>
					<div style={{ display: 'flex' }}>
						{ad.pathes_to_photo
							? ad.pathes_to_photo.map((img, i) => {
									return (
										<div
											key={img.AdPhotoId}
											style={{
												borderRadius: '10px',
												alignItems: 'center',
												justifyContent: 'center',
												padding: '1px',
											}}
										>
											<Button
												mode="tertiary"
												style={{
													padding: '0px',
													borderRadius: '10px',
												}}
												onClick={() => {
													setPhotoIndex(i);
												}}
											>
												<img src={img.PhotoUrl} className="small_img" />
											</Button>
										</div>
									);
							  })
							: ''}
					</div>
				</HorizontalScroll>
			)}
			<div style={{ padding: '16px' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div className="CellLeft__head">{ad.header}</div>
					{isAuthor() ? (
						<PanelHeaderButton
							mode="primary"
							size="l"
							onClick={() => {
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
									props.ad.hidden,
									subs.length
								);
							}}
							disabled={ad.status !== 'offer' && ad.status !== 'chosen'}
						>
							<Avatar style={{ background: 'white' }} size={40}>
								<Icon28SettingsOutline fill="var(--black)" />
							</Avatar>
						</PanelHeaderButton>
					) : (
						''
					)}
				</div>
				<div style={{ padding: '8px' }}>
					{isAuthor() ? (
						''
					) : (
						<>
							{isDealer ? (
								<>
									<InfoRow style={{ padding: '10px', color: 'grey', textAlign: 'center' }}>
										Подтвердите получение вещи:
									</InfoRow>
									<div style={{ display: 'flex' }}>
										<Button
											stretched
											size="l"
											mode="commerce"
											onClick={() => {
												acceptDeal(props.setSnackbar, Deal.deal_id);
												props.back();
											}}
											style
											style={{ marginRight: 8 }}
											before={<Icon24Cancel />}
										>
											Подтвердить
										</Button>
										<Button
											stretched
											size="l"
											mode="destructive"
											onClick={() => {
												denyDeal(props.setSnackbar, Deal.deal_id);
												props.back();
											}}
											style={{ marginRight: 8 }}
											before={<Icon24Cancel />}
										>
											Отклонить
										</Button>
									</div>
								</>
							) : isSub ? (
								<Button
									stretched
									size="xl"
									mode="destructive"
									onClick={unsub}
									before={<Icon24Cancel />}
								>
									Отказаться
								</Button>
							) : (
								<>
									<Button
										stretched
										size="xl"
										mode="primary"
										onClick={sub}
										before={getFeedback(ad.feedback_type == 'ls', ad.feedback_type == 'comments')}
									>
										Откликнуться
									</Button>
								</>
							)}
						</>
					)}
				</div>
			</div>
			<Separator />
			<div
				style={{
					display: 'flex',
					paddingLeft: '16px',
				}}
			>
				<Cell before={<Icon24Place />}>{props.ad.region + ', ' + props.ad.district}</Cell>
			</div>
			<Separator style={{ margin: '12px 0' }} />
			<div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
				<div className="CellLeft__block">{ad.text}</div>
			</div>
			<table>
				<tbody>
					<tr>
						<td className="first">Категория</td>
						<td>{GetCategoryText(ad.category)}</td>
					</tr>
					<tr>
						<td className="first">Просмотров</td>
						<td>{ad.views_count}</td>
					</tr>
					<tr>
						<td className="first">Отклинулось</td>
						<td>{subs.length}</td>
					</tr>
					<tr>
						<td className="first">Размещено</td>
						<td>{ad.creation_date}</td>
					</tr>
				</tbody>
			</table>
			{isAuthor() ? (
				<Group header={<Header mode="secondary">Откликнулись</Header>}>
					{subs.length > 0 ? (
						subs.map((v) => (
							<Cell key={v.vk_id} before={<Avatar size={36} src={v.photo_url} />}>
								{v.name + ' ' + v.surname}
							</Cell>
						))
					) : (
						<InfoRow style={{ paddingLeft: '16px' }}> пусто</InfoRow>
					)}
				</Group>
			) : (
				<Group header={<Header mode="secondary">Автор</Header>}>
					<Cell
						before={<Avatar size={36} src={ad.author.photo_url} />}
						description={ad.extra_field ? ad.extra_field : ''}
					>
						<div style={{ display: 'flex' }}>
							{ad.author.name + ' ' + ad.author.surname}{' '}
							{ad.feedback_type == 'ls' ? (
								<Link
									style={{ marginLeft: '15px' }}
									href={'https://vk.com/im?sel=' + ad.author.vk_id}
									target="_blank"
								>
									Написать
								</Link>
							) : (
								''
							)}
						</div>
					</Cell>
				</Group>
			)}

			{ad.feedback_type == 'comments' ? (
				<Comments
					ad={ad}
					setPopout={props.setPopout}
					setSnackbar={props.setSnackbar}
					myID={props.VkUser.getState().id}
				/>
			) : (
				<Cell>
					{' '}
					<div style={{ color: 'grey' }}>Комментарии закрыты </div>
				</Cell>
			)}
		</div>
	);
};

export default AddMore2;
