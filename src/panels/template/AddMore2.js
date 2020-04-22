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
	Counter,
	CellButton,
	Placeholder,
} from '@vkontakte/vkui';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import { GetCategoryText, GetCategoryImageSmall } from './Categories';

import Icon24VideoFill from '@vkontakte/icons/dist/24/video_fill';

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

import PANEL_ONE from './../../panels/Main';

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

let saveInstance = null;

const AddMore2 = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState({});

	const handleClose = () => {
		setIsOpen(false);
	};

	const getThumbnailContent = (item) => {
		return <img src={item.thumbnail} height={90} />;
	};

	const [ad, setAd] = useState(null);

	const [photoIndex, setPhotoIndex] = useState(0);
	const [image, setImage] = useState('');

	const openPhotoSwipe = (i) => {
		setOptions({
			closeOnScroll: false,
			index: i,
		});
		setIsOpen(true);
	};

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
		if (ad == null || ad == saveInstance || ad == AdDefault) {
			return;
		}
		setImage(ad && ad.pathes_to_photo ? ad.pathes_to_photo[photoIndex].PhotoUrl : '');
	}, [photoIndex, ad]);

	useEffect(() => {
		console.log('cheeeeck', ad, saveInstance, AdDefault);
		// if (ad != null && props.ad.ad_id != AdDefault.ad_id) {
		// 	setAd(saveInstance)
		// 	return;
		// }
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
					// saveInstance = details;
				}
			}
		}
		init();
	}, [props.ad, request]);

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
						Автор решил отдать вещь вам. Подтвердите получение вещи после получения:
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

	const [imgs, setImgs] = useState([]);
	// const [photoSwipeImgs, setPhotoSwipeImgs] = useState([]);

	useEffect(() => {
		if (!ad || ad.id == -1) {
			return;
		}
		setImgs(ad.pathes_to_photo.map((v) => v.PhotoUrl));
		// setPhotoSwipeImgs(
		// 	ad.pathes_to_photo.map((v) => {
		// 		let img = new Image();
		// 		img.src = v.PhotoUrl;
		// 		let width = img.width;
		// 		let hight = img.height;
		// 		return {
		// 			src: v.PhotoUrl,
		// 			msrc: v.PhotoUrl,
		// 			w: width,
		// 			h: hight,
		// 			title: ad.header,
		// 			thumbnail: v.PhotoUrl,
		// 		};
		// 	})
		// );
	}, [ad]);

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
		const photoSwipeImgs = ad.pathes_to_photo.map((v) => {
			let img = new Image();
			img.src = v.PhotoUrl;
			let width = img.width;
			let hight = img.height;
			return {
				src: v.PhotoUrl,
				msrc: v.PhotoUrl,
				w: width,
				h: hight,
				title: ad.header,
				thumbnail: v.PhotoUrl,
			};
		});
		return (
			<div>
				<PhotoSwipe
					style={{ marginTop: '50px' }}
					isOpen={isOpen}
					items={photoSwipeImgs}
					options={options}
					onClose={handleClose}
				/>

				<div style={{ position: 'relative' }}>
					<div style={{ right: '10px', position: 'absolute', top: '6px' }}>
						<PanelHeaderButton
							onClick={() => {
								bridge
									.send('VKWebAppShowImages', {
										images: imgs,
									})
									.catch(function (error) {
										console.log('photoIndex', photoIndex);
										openPhotoSwipe(photoIndex);
									});
							}}
							mode="secondary"
							style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
							size="m"
						>
							<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
								<Icon24VideoFill fill="var(--white)" />
							</Avatar>
						</PanelHeaderButton>
					</div>
					{showStatus()}
					<img
						onClick={() => {
							bridge
								.send('VKWebAppShowImages', {
									images: imgs,
								})
								.catch(function (error) {
									console.log('photoIndex', photoIndex);
									openPhotoSwipe(photoIndex);
								});
						}}
						srcSet={image}
						style={{
							width: '100%',
							objectFit: 'cover',
							maxHeight: '250px',
							margin: 'auto',
						}}
					/>
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
													<img
														style={{
															filter:
																i == photoIndex ? 'brightness(40%)' : 'brightness(90%)',
														}}
														src={img.PhotoUrl}
														className="small_img"
													/>
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
					<div style={{ margin: '12px' }}>
						<Button stretched size="xl" mode="destructive" onClick={unsub} before={<Icon24Cancel />}>
							Отказаться
						</Button>
					</div>
				) : (
					<div style={{ margin: '12px' }}>
						<Button
							stretched
							size="xl"
							mode="primary"
							onClick={sub}
							before={getFeedback(ad.feedback_type == 'ls', ad.feedback_type == 'comments')}
						>
							Хочу забрать!
						</Button>
					</div>
				)}
				<div style={{ marginTop: '10px', paddingLeft: '16px', paddingRight: '16px' }}>
					<div className="CellLeft__block">{ad.text}</div>
				</div>

				<table>
					<tbody>
						<tr>
							<td className="first">Категория</td>
							<td>{GetCategoryImageSmall(ad.category)}</td>
						</tr>
						<tr>
							<td className="first">Просмотров</td>
							<td>{ad.views_count}</td>
						</tr>
						{status != 'closed' && status != 'aborted' ? (
							<tr>
								<td className="first">Отклинулось</td>
								<td>{subs && subs.length > 0 ? subs.length : '0'}</td>
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
					<>
						<Comments
							hide={true}
							ad={ad}
							amount={1}
							maxAmount={1}
							setPopout={props.setPopout}
							setSnackbar={props.setSnackbar}
							myID={props.VkUser.getState().id}
							openUser={props.openUser}
						/>
						<CellButton
							onClick={() => {
								props.openComments(ad);
							}}
						>
							Посмотреть все
						</CellButton>
					</>
				) : (
					<Cell>
						{' '}
						<div style={{ color: 'var(--text_primary)' }}>Комментарии закрыты </div>
					</Cell>
				)}
			</div>
		);
	}
	return <Placeholder></Placeholder>;
};

// 857

export default AddMore2;
