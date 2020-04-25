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
	ScreenSpinner,
	CellButton,
	Placeholder,
} from '@vkontakte/vkui';

import { getUser } from './../../panels/story/profile/requests';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

import { GetCategoryText, GetCategoryImageSmall } from './Categories';

import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Globe from '@vkontakte/icons/dist/24/globe';

import Icon24VideoFill from '@vkontakte/icons/dist/24/video_fill';

import Icon24Delete from '@vkontakte/icons/dist/24/delete';

import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Chats from '@vkontakte/icons/dist/24/chats';

import Freeze24 from './../../img/24/freeze.png';
import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';
import Icon24Message from '@vkontakte/icons/dist/24/message';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon24Place from '@vkontakte/icons/dist/24/place';

import Subs from './../story/adds/tabs/subs/subs';
import { subscribe, unsubscribe } from './../story/adds/tabs/subs/requests';

import { K } from './../story/profile/Profile';

import Icon24Coins from '@vkontakte/icons/dist/24/coins';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24MarketOutline from '@vkontakte/icons/dist/24/market_outline';
import Icon24Market from '@vkontakte/icons/dist/24/market';

import {
	adVisible,
	adHide,
	deleteAd,
	getSubscribers,
	getDetails,
	getDeal,
	acceptDeal,
	denyDeal,
	getCost,
} from './../../requests';

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

export const AD_LOADING = {
	ad_id: -2,
	status: 'loading',
	header: 'Загрузка',
	anonymous: false,
	text: 'Загрузка',
	creation_date: 'Загрузка',
	feedback_type: 'Загрузка',
	category: 'animals',
	extra_field: '',
	views_count: '0',
	location: 'Загрузка',
	pathes_to_photo: [],
	author: {
		vk_id: -1,
		name: 'Загрузка',
		surname: 'Загрузка',
		photo_url: Man,
	},
};

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

	const [hidden, setHidden] = useState(false);
	const [isSub, setIsSub] = useState(false);
	const [isDealer, setIsDealer] = useState(false);
	const [status, setStatus] = useState('unknown');

	const [Deal, setDeal] = useState({});

	const [request, setRequest] = useState('no');

	const [cost, setCost] = useState(0);
	const [backUser, setBackUser] = useState();

	function isNotValid(a) {
		return a == null || a.ad_id == AD_LOADING.ad_id || a.ad_id == AdDefault.ad_id;
	}

	useEffect(() => {
		if (isNotValid(ad)) {
			return;
		}
		setImage(ad.pathes_to_photo ? ad.pathes_to_photo[photoIndex].PhotoUrl : '');
	}, [photoIndex, ad]);

	function changeIsSub(isSubscriber) {
		if (isSubscriber) {
			props.setCost(cost);
			if (backUser) {
				console.log('backUser valid treu', cost);
				let b = backUser;
				b.frozen_carma += cost;
				setBackUser(b);
				props.setbackUser(b);
			}
			setCost(cost + 1);
		} else {
			props.setCost(-(cost - 1));
			if (backUser) {
				console.log('backUser valid fale', cost);
				let b = backUser;
				b.frozen_carma -= cost - 1;
				setBackUser(b);
				props.setbackUser(b);
			}
			setCost(cost - 1);
		}

		setIsSub(isSubscriber);
	}

	useEffect(() => {
		if (isNotValid(props.ad)) {
			setImage('');
			return;
		}
		async function init() {
			const id = props.ad.ad_id;
			getDetails(
				props.setPopout,
				props.setSnackbar,
				id,
				(details) => {
					setAd(details);
					setHidden(details.hidden);
					setStatus(details.status);

					getCost(
						details.ad_id,
						(data) => {
							setCost(data.bid);
						},
						(e) => {}
					);

					getDeal(
						props.setSnackbar,
						details.ad_id,
						(deal) => {
							setIsDealer(deal.subscriber_id == props.VkUser.getState().id);
							setDeal(deal);
						},
						(e) => {}
					);

					getUser(
						props.setPopout,
						props.setSnackbar,
						props.myID,
						(v) => {
							props.setbackUser(v);
							setBackUser(v);
						},
						(e) => {}
					);

					getSubscribers(
						props.setPopout,
						props.setSnackbar,
						id,
						(s) => {
							setSubs(s);
							setIsSub(isSubscriber(s));
						},
						(e) => {}
					);

					// saveInstance = details;
				},
				(e) => {}
			);
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
				<div style={{ width: '100%', color: 'rgb(220,220,220)', fontSize: '13px', padding: '2px' }}>
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
		if (isNotValid(ad)) {
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
				changeIsSub(false);
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
				changeIsSub(true);
			},
			(e) => {},
			() => {
				setHide(false);
			}
		);
	}
	if (isNotValid(ad) || isNotValid(props.ad)) {
		return (
			<Placeholder stretched header="Загрузка объявления">
				<ScreenSpinner size="large" />
			</Placeholder>
		);
	}

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
														filter: i == photoIndex ? 'brightness(40%)' : 'brightness(90%)',
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
				<div style={{ display: 'block', alignItems: 'center' }}>
					<div className="CellLeft__head">{ad.header}</div>
					{isAuthor() ? (
						<div style={{ display: 'block' }}>
							<div style={{ display: 'flex' }}>
								<CellButton
									onClick={() => {
										hidden
											? adVisible(props.setPopout, props.setSnackbar, ad.ad_id, () => {
													setHidden(false);
											  })
											: adHide(props.setPopout, props.setSnackbar, ad.ad_id, () => {
													setHidden(true);
											  });
									}}
									disabled={ad.status !== 'offer' && ad.status !== 'chosen'}
									before={hidden ? <Icon24Globe /> : <Icon24Hide />}
								>
									{hidden ? 'Сделать видимым' : 'Сделать невидимым'}
								</CellButton>
								<CellButton
									mode="danger"
									disabled={ad.status !== 'offer' && ad.status !== 'chosen'}
									before={<Icon24Delete />}
									onClick={() => {
										deleteAd(props.setPopout, ad.ad_id, props.setSnackbar, props.refresh);
									}}
								>
									Удалить
								</CellButton>
							</div>
							{/* <PanelHeaderButton
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
								</PanelHeaderButton> */}
							<Button
								disabled={ad.status !== 'offer' && ad.status !== 'chosen'}
								mode="commerce"
								size="xl"
								onClick={() => props.openSubs(ad)}
							>
								Отдать
							</Button>
						</div>
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
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ margin: '12px' }}>
						<Button stretched size="m" mode="destructive" onClick={unsub} before={<Icon24MarketOutline />}>
							Отказаться
						</Button>
					</div>
					<PanelHeaderButton
						onClick={() => {
							props.onCarmaClick();
						}}
					>
						<div style={{ fontSize: '20px', color: 'var(--destructive)' }}>
							+{cost - 1}
							{K}
						</div>
					</PanelHeaderButton>
					<PanelHeaderButton
						onClick={() => {
							props.onFreezeClick();
						}}
					>
						<Icon24Help fill="var(--destructive)" />
					</PanelHeaderButton>
				</div>
			) : (
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ margin: '12px' }}>
						<Button stretched size="m" mode="primary" onClick={sub} before={<Icon24MarketOutline />}>
							Хочу забрать!
						</Button>
					</div>
					<PanelHeaderButton
						onClick={() => {
							props.onCarmaClick();
						}}
					>
						<div style={{ fontSize: '20px', color: 'var(--header_tint)' }}>
							-{cost}
							{K}
						</div>
					</PanelHeaderButton>
					<PanelHeaderButton
						onClick={() => {
							props.onFreezeClick();
						}}
					>
						<Icon24Help fill="var(--header_tint)" />
					</PanelHeaderButton>
				</div>
			)}
			<div style={{ marginTop: '10px', paddingLeft: '16px', paddingRight: '16px' }}>
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
			<Group header={<Header>Автор</Header>}>
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
			{isAuthor() ? (
				status != 'closed' && status != 'aborted' ? (
					<Subs
						setPopout={props.setPopout}
						setSnackbar={props.setSnackbar}
						openUser={props.openUser}
						amount={2}
						maxAmount={2}
						openSubs={() => props.openSubs(ad)}
						ad={ad}
						mini={true}
					/>
				) : (
					''
				)
			) : (
				''
			)}

			{ad.feedback_type == 'comments' ? (
				<>
					<Comments
						mini={true}
						openCommentaries={() => {
							props.openComments(ad);
						}}
						hide={true}
						ad={ad}
						amount={1}
						maxAmount={1}
						setPopout={props.setPopout}
						setSnackbar={props.setSnackbar}
						myID={props.myID}
						openUser={props.openUser}
					/>
				</>
			) : (
				<Placeholder icon={<Icon56WriteOutline />} header="Комментарии закрыты"></Placeholder>
			)}
		</div>
	);
};

// 857 -> 818

export default AddMore2;
