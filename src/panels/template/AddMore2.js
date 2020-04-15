import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	Avatar,
	PanelHeaderButton,
	Button,
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

import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';
import Icon24Message from '@vkontakte/icons/dist/24/message';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

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

import { time } from './../../utils/time';
import { shortText } from './../../utils/short_text';

const COLOR_DEFAULT = 'rgba(0,0,0,0.6)';
const COLOR_DONE = 'rgba(0,75,0,0.8)';
const COLOR_CANCEL = 'rgba(75,0,0,0.8)';

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
	const [ad, setAd] = useState(null);

	const [photoIndex, setPhotoIndex] = useState(0);
	const [image, setImage] = useState('');

	const [subs, setSubs] = useState(0);
	const [hide, setHide] = useState(false);

	const [isSub, setIsSub] = useState(false);
	const [isDealer, setIsDealer] = useState(false);
	const [status, setStatus] = useState('unknown');

	const [Deal, setDeal] = useState({});

	const [request, setRequest] = useState('no');

	async function initSubscribers(id) {
		getSubscribers(
			props.setPopout,
			props.setSnackbar,
			id,
			(s) => {
				console.log('subs are', s);
				console.log('info info', !isAuthor(), s.length > 0);
				console.log('filter', s.filter((v) => v.vk_id == props.VkUser.getState().id).length > 0);
				console.log('isSubscriber1', isSubscriber(s));
				setSubs(s);
				setIsSub(isSubscriber(s));
				console.log('isSubscriber', isSubscriber(s));
			},
			(e) => {}
		);
	}

	useEffect(() => {
		setImage(ad && ad.pathes_to_photo ? ad.pathes_to_photo[photoIndex].PhotoUrl : '');
	}, [photoIndex, ad]);

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
					console.log('i seeet', details.status);
					setStatus(details.status);

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

	function statusWrapper(block, color) {
		color = color || COLOR_DEFAULT;
		return (
			<div
				style={{
					background: color,
					padding: '8px',
					position: 'absolute',
					widht: '100%',
					left: 0,
					right: 0,
					top: '0px',
				}}
			>
				{block}
			</div>
		);
	}

	function getDealer() {
		if (!subs) {
			return {
				vk_id: '',
				photo_url: '',
				name: '',
				surname: '',
			};
		}
		return subs.filter((v) => v.vk_id == Deal.subscriber_id).length > 0
			? subs.filter((v) => v.vk_id == Deal.subscriber_id)[0]
			: '';
	}

	function showClosed() {
		if (isAuthor()) {
			return statusWrapper(
				<InfoRow className="status-text">Спасибо за помощь другим людям!</InfoRow>,
				COLOR_DONE
			);
		}
		if (isDealer) {
			return statusWrapper(<InfoRow className="status-text">Вещь перешла в ваше владение!</InfoRow>, COLOR_DONE);
		}
		return statusWrapper(<InfoRow className="status-text">Отдано!</InfoRow>, COLOR_DONE);
	}

	function showAborted() {
		if (isAuthor()) {
			return statusWrapper(
				<InfoRow className="status-text">Вторая сторона отказалась от сделки</InfoRow>,
				COLOR_CANCEL
			);
		}
		if (isDealer) {
			return statusWrapper(<InfoRow className="status-text">Вы прервали сделку</InfoRow>, COLOR_CANCEL);
		}
		return statusWrapper(<InfoRow className="status-text">Передача не состоялась</InfoRow>, COLOR_CANCEL);
	}

	function showChosen() {
		console.log('showOffer', isDealer, !isAuthor());
		if (isDealer && !isAuthor()) {
			return statusWrapper(
				<>
					<InfoRow style={{ padding: '10px', color: 'rgb(200,200,200)', textAlign: 'center' }}>
						Подтвердите получение вещи:
					</InfoRow>
					<div style={{ display: 'flex' }}>
						<Button
							stretched
							size="l"
							mode="commerce"
							onClick={() => {
								setHide(true);
								acceptDeal(
									props.setPopout,
									props.setSnackbar,
									Deal.deal_id,
									(v) => {
										props.back();
									},
									(e) => {},
									() => {
										setHide(false);
									}
								);
							}}
							style
							style={{ marginRight: 8 }}
							before={<Icon24Done />}
						>
							Подтвердить
						</Button>
						<Button
							stretched
							size="l"
							mode="destructive"
							onClick={() => {
								setHide(true);
								denyDeal(
									props.setPopout,
									props.setSnackbar,
									Deal.deal_id,
									(v) => {
										props.back();
									},
									(e) => {},
									() => {
										setHide(false);
									}
								);
								props.back();
							}}
							style={{ marginRight: 8 }}
							before={<Icon24Cancel />}
						>
							Отклонить
						</Button>
					</div>
				</>,
				COLOR_DEFAULT
			);
		}
		if (!isAuthor()) {
			return statusWrapper(
				<InfoRow
					style={{
						padding: '10px',
						color: 'rgb(200,200,200)',
						textAlign: 'center',
					}}
				>
					Автор назначил человека для передачи вещи
				</InfoRow>,
				COLOR_DEFAULT
			);
		} else {
			return statusWrapper(
				<div style={{ width: '100%', color: 'rgb(220,220,220)', fontSize: '14px', padding: '2px' }}>
					<div style={{ display: 'flex' }}>
						Ожидание подтверждения от
						<div style={{ display: 'flex' }} onClick={() => props.openUser(getDealer().vk_id)}>
							<Avatar
								style={{
									marginLeft: '15px',
									marginRight: '4px',
								}}
								size={16}
								src={getDealer().photo_url}
							/>
							{getDealer().name + ' ' + getDealer().surname + '  '}
						</div>
					</div>
				</div>,
				COLOR_DEFAULT
			);
		}
	}

	function showStatus() {
		console.log('statusstatus', status);
		switch (status) {
			case 'chosen':
				return showChosen();
			case 'closed':
				return showClosed();
			case 'aborted':
				return showAborted();
		}
		return '';
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
		if (!ad) {
			return false;
		}
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
		setHide(true);
		unsubscribe(
			props.setPopout,
			props.setSnackbar,
			ad.ad_id,
			sub,
			(v) => {
				setIsSub(false);
			},
			(e) => {},
			() => {
				setHide(false);
			}
		);
	}

	function sub() {
		setHide(true);
		subscribe(
			props.setPopout,
			props.setSnackbar,
			ad.ad_id,
			unsub,
			(v) => {
				setIsSub(true);
			},
			(e) => {},
			() => {
				setHide(false);
			}
		);
	}

	if (ad) {
		return (
			<div>
				{request}
				<div
					style={{
						position: 'relative',
						display: 'inline-block',
					}}
				>
					{showStatus()}
					<img
						onClick={() => {
							bridge
								.send('VKWebAppShowImages', {
									images: [ad.pathes_to_photo],
								})
								.catch(function (error) {
									console.log('failed open vk image', error);
									const w = window.open('about:blank', image); // открываем окно
									w.document.write("<img src='" + image + "' alt='from old image' />"); //  вставляем картинку
									ad.title=""+error //  вставляем картинку
									setAd(ad)
									setRequest(""+  JSON.stringify(error))
								});
						}}
						srcSet={image}
						style={{
							width: '100%',
							objectFit: 'cover',
							maxHeight: '200px',
						}}
					/>
					{/* <div style={{ right: '10px', position: 'absolute', top: '10px' }}>
					<PanelHeaderButton
						mode="secondary"
						style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
						size="m"
					>
						<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
							<Icon24VideoFill fill="var(--white)" />
						</Avatar>
					</PanelHeaderButton>
				</div> */}
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
									setHide(true);
									OpenActions(
										props.setPopout,
										props.setSnackbar,
										props.refresh,
										ad.ad_id,
										() => {
											props.onCloseClick();
											setRequest('CLOSE');
										},
										status == 'chosen',
										ad.hidden,
										subs.length,
										() => {
											setHide(false);
										}
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
				</div>
				<Separator />
				<div
					style={{
						display: 'flex',
						paddingLeft: '16px',
						margin: '0px',
					}}
				>
					<Cell before={<Icon24Place />}>{ad.region + ', ' + ad.district}</Cell>
				</div>
				<Separator />
				{isDealer || status == 'closed' || status == 'aborted' || isAuthor() ? (
					''
				) : isSub ? (
					<Button
						style={{ margin: '8px', marginLeft: 'auto', marginRight: 'auto' }}
						stretched
						size="xl"
						mode="destructive"
						onClick={unsub}
						before={<Icon24Cancel />}
					>
						Отказаться
					</Button>
				) : (
					<Button
						stretched
						size="xl"
						style={{ margin: '8px', marginLeft: 'auto', marginRight: 'auto' }}
						mode="primary"
						onClick={sub}
						before={getFeedback(ad.feedback_type == 'ls', ad.feedback_type == 'comments')}
					>
						Хочу забрать!
					</Button>
				)}
				<div style={{ marginTop: '10px', paddingLeft: '16px', paddingRight: '16px' }}>
					<div className="CellLeft__block">{ad.text}</div>
				</div>

				<table>
					<tbody>
						<tr>
							<td className="first">Категория</td>
							<td>{shortText(GetCategoryText(ad.category), 20)}</td>
						</tr>
						<tr>
							<td className="first">Просмотров</td>
							<td>{ad.views_count}</td>
						</tr>
						{status != 'closed' && status != 'aborted' ? (
							<tr>
								<td className="first">Отклинулось</td>
								<td>{subs.length}</td>
							</tr>
						) : (
							''
						)}

						<tr>
							<td className="first">Размещено</td>
							<td>{time(ad.creation_date)}</td>
						</tr>
					</tbody>
				</table>
				{isAuthor() ? (
					status != 'closed' && status != 'aborted' ? (
						<Group header={<Header mode="secondary">Откликнулись</Header>}>
							{subs.length > 0 ? (
								subs.map((v) => (
									<Cell
										onClick={() => props.openUser(v.vk_id)}
										key={v.vk_id}
										before={<Avatar size={36} src={v.photo_url} />}
									>
										{v.name + ' ' + v.surname}
									</Cell>
								))
							) : (
								<InfoRow style={{ paddingLeft: '16px' }}> пусто</InfoRow>
							)}
						</Group>
					) : (
						''
					)
				) : (
					''
				)}
				<Group header={<Header mode="secondary">Автор</Header>}>
					<Cell
						onClick={() => props.openUser(ad.author.vk_id)}
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

				{ad.feedback_type == 'comments' ? (
					<Comments
						hide={hide}
						ad={ad}
						setPopout={props.setPopout}
						setSnackbar={props.setSnackbar}
						myID={props.VkUser.getState().id}
						openUser={props.openUser}
					/>
				) : (
					<Cell>
						{' '}
						<div style={{ color: 'grey' }}>Комментарии закрыты </div>
					</Cell>
				)}
			</div>
		);
	}
	return '';
};

export default AddMore2;
