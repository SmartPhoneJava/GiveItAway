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

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUser } from './../../panels/story/profile/requests';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';
import Icon36Done from '@vkontakte/icons/dist/36/done';

import { GetCategoryText, GetCategoryImageSmall } from './Categories';

import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Globe from '@vkontakte/icons/dist/24/globe';

import Icon24VideoFill from '@vkontakte/icons/dist/24/video_fill';

import Icon24Delete from '@vkontakte/icons/dist/24/delete';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import Icon24Write from '@vkontakte/icons/dist/24/write';
import Icon24ShareExternal from '@vkontakte/icons/dist/24/share_external';
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
	acceptDeal,
	denyDeal,
	getCost,
} from './../../requests';

import './addsTab.css';

import './styles.css';

import Comments from './../story/adds/tabs/comments/comments';

import { time } from './../../utils/time';
import { setDummy, openModal, setPage, setAd, openSnackbar, openPopout, setStory } from '../../store/router/actions';
import { PANEL_IMAGE, PANEL_COMMENTS, PANEL_SUBS } from './../../store/router/panelTypes';
import { MODAL_ADS_COST, MODAL_ADS_FROZEN } from '../../store/router/modalTypes';
import {
	setCost,
	setIsSub,
	setSubs,
	setIsDealer,
	setDeal,
	setDetailedAd,
	setPhotos,
	setIsHidden,
	setExtraInfo,
	setIsAuthor,
} from '../../store/detailed_ad/actions';
import {
	AdDefault,
	AD_LOADING,
	COLOR_DEFAULT,
	COLOR_DONE,
	COLOR_CANCEL,
	STATUS_OFFER,
	STATUS_CHOSEN,
	STATUS_CLOSED,
	STATUS_ABORTED,
} from '../../const/ads';
import { shareInVK } from '../../services/VK';
import { STORY_CREATE } from '../../store/router/storyTypes';
import { EDIT_MODE, CREATE_AD_MAIN, CREATE_AD_ITEM } from '../../store/create_post/types';
import { setFormData } from '../../store/create_post/actions';
import { defaultInputData } from '../../const/create';
import { FORM_CREATE } from '../../components/categories/redux';
import { FORM_LOCATION_CREATE } from '../../components/location/redux';
import { smoothScrollToTop } from '../../services/_functions';
import { updateDealInfo } from '../../store/detailed_ad/update';

const AddMore2r = (props) => {
	const { myID, dispatch } = props;
	const {
		setCost,
		setIsSub,
		setSubs,
		setIsDealer,
		setDeal,
		setIsAuthor,
		setPhotos,
		setIsHidden,
		setExtraInfo,
		openSnackbar,
		openPopout,
		setStory,
		setFormData,
	} = props;
	const { setPage, openModal, setDummy, AD } = props;
	const {
		isDealer,
		isAuthor,
		isSub,
		status,
		deal,
		dealer,
		pathes_to_photo,
		photos,
		header,
		ad_id,
		subs,
		district,
		region,
		text,
		category,
		views_count,
		creation_date,
		author,
		feedback_type,
		extra_field,
		cost,
		hidden,
	} = AD;

	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState({});

	const handleClose = () => {
		setIsOpen(false);
	};

	console.log('ADADADADAD', AD);

	const [photoIndex, setPhotoIndex] = useState(0);
	const [image, setImage] = useState('');

	const openImage = (imgs) => {
		bridge
			.send('VKWebAppShowImages', {
				images: imgs,
			})
			.catch(function (error) {
				setDummy('imager');
				openPhotoSwipe(photoIndex);
			});
	};

	const openPhotoSwipe = (i) => {
		setOptions({
			closeOnScroll: false,
			index: i,
		});
		setIsOpen(true);
	};

	console.log('props.myID', myID);

	const [backUser, setBackUser] = useState();

	function isNotValid() {
		return AD == null || AD.ad_id == AD_LOADING.ad_id || AD.ad_id == AdDefault.ad_id;
	}

	function getImage() {
		return AD.pathes_to_photo && AD.pathes_to_photo.length > 0 ? AD.pathes_to_photo[photoIndex].PhotoUrl : '';
	}

	useEffect(() => {
		if (isNotValid()) {
			return;
		}
		const photoSwipeImgs = pathes_to_photo.map((v) => {
			let img = new Image();
			img.src = v.PhotoUrl;
			let width = img.width;
			let hight = img.height;
			return {
				src: v.PhotoUrl,
				msrc: v.PhotoUrl,
				w: width,
				h: hight,
				title: header,
				thumbnail: v.PhotoUrl,
			};
		});
		setPhotos(photoSwipeImgs);
		setImage(getImage());
	}, [photoIndex, pathes_to_photo]);

	function changeIsSub(isSubs, c) {
		if (isNotValid()) {
			return;
		}
		if (isSubs) {
			if (backUser) {
				let b = backUser;
				b.frozen_carma += c;
				setBackUser(b);
				props.setbackUser(b);
			}
			setCost(c + 1);
		} else {
			if (backUser) {
				let b = backUser;
				b.frozen_carma -= c - 1;
				setBackUser(b);
				props.setbackUser(b);
			}
			setCost(c - 1);
		}
		setIsSub(isSubs);
	}

	useEffect(() => {
		// if (isNotValid(props.ad)) {
		// 	setImage('');
		// 	return;
		// }
		const init = () => (dispatch) => {
			const id = AD.ad_id;
			updateDealInfo()
			getCost(
				ad_id,
				(data) => {
					setCost(data.bid);
					getSubscribers(
						(e) => {},
						openSnackbar,
						id,
						(s) => {
							console.log('suuubs', s);
							updateSubsInfo(s);
							
						},
						(e) => {
							// props.setCost(-data.bid);
						}
					);
				},
				(e) => {
					console.log('some err', e);
				}
			);

			getUser(
				openPopout,
				openSnackbar,
				myID,
				(v) => {
					props.setbackUser(v);
					setBackUser(v);
				},
				(e) => {}
			);
			getDetails(
				(s) => {},
				openSnackbar,
				id,
				(details) => {
					setExtraInfo(details);
					setIsAuthor(details.author.vk_id == myID);
				},
				(e) => {}
			);
		};
		dispatch(init());
	}, []);

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

	function showClosed() {
		if (isAuthor) {
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
		if (isAuthor) {
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
		console.log('showOffer', isDealer, !isAuthor);
		if (isDealer && !isAuthor) {
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
								acceptDeal(
									openPopout,
									openSnackbar,
									deal.deal_id,
									(v) => {
										props.back();
									},
									(e) => {},
									() => {}
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
									openPopout,
									openSnackbar,
									deal.deal_id,
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
		if (!isAuthor) {
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
						<div style={{ display: 'flex' }} onClick={() => props.openUser(dealer.vk_id)}>
							<Avatar
								style={{
									marginLeft: '15px',
									marginRight: '4px',
								}}
								size={16}
								src={dealer ? dealer.photo_url : ''}
							/>
							{dealer ? dealer.name + ' ' + dealer.surname + '  ' : ''}
						</div>
					</div>
				</div>,
				COLOR_DEFAULT
			);
		}
	}

	function showStatus() {
		switch (status) {
			case STATUS_CHOSEN:
				return showChosen();
			case STATUS_CLOSED:
				return showClosed();
			case STATUS_ABORTED:
				return showAborted();
		}
		return '';
	}

	const openSubs = () => {
		setPage(PANEL_SUBS);
	};

	const openComments = () => {
		console.log('open comments!');
		setPage(PANEL_COMMENTS);
	};

	const onCarmaClick = () => {
		openModal(MODAL_ADS_COST);
	};

	const onFreezeClick = () => {
		openModal(MODAL_ADS_FROZEN);
	};

	const isFinished = () => {
		return status !== STATUS_OFFER && status !== STATUS_CHOSEN;
	};

	const [imgs, setImgs] = useState([]);
	// const [photoSwipeImgs, setPhotoSwipeImgs] = useState([]);

	useEffect(() => {
		if (isNotValid(AD)) {
			return;
		}
		setImgs(pathes_to_photo.map((v) => v.PhotoUrl));
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
	}, [AD]);

	function updateSubsInfo(s) {
		setSubs(s);
		setIsSub(s.filter((v) => v.vk_id == myID).length > 0);
	}

	function unsub(c) {
		unsubscribe(
			openPopout,
			openSnackbar,
			ad_id,
			() => sub(c - 1),
			(v) => {
				changeIsSub(false, c);
			},
			(e) => {},
			() => {}
		);
	}

	function sub(c) {
		subscribe(
			openPopout,
			openSnackbar,
			ad_id,
			() => unsub(c + 1),
			(v) => {
				changeIsSub(true, c);
			},
			(e) => {},
			() => {}
		);
	}
	if (isNotValid(AD)) {
		return (
			<Placeholder stretched header="Загрузка объявления">
				<ScreenSpinner size="large" />
			</Placeholder>
		);
	}

	function onEditClick() {
	
		setFormData(EDIT_MODE, {
			mode: true,
		});

		setFormData(FORM_LOCATION_CREATE, {
			country: { id: 1, title: AD.region },
			city: { id: 1, title: AD.district },
		});
		setFormData(CREATE_AD_ITEM, {
			name: AD.header,
			description: AD.text,
			photosUrl: AD.pathes_to_photo,
		});
		setFormData(FORM_CREATE, {
			category: AD.category,
		});

		setStory(STORY_CREATE, null, true);
	}

	// console.log("details info", isDealer, status, status == 'aborted' || isAuthor() ? (
	// 	''
	// ) : isSub )

	return (
		<div>
			<div onClick={() => {}}>
				<PhotoSwipe
					style={{ marginTop: '50px' }}
					isOpen={isOpen}
					items={photos}
					options={options}
					onClose={handleClose}
				/>
			</div>

			<div style={{ position: 'relative' }}>
				<div style={{ right: '10px', position: 'absolute', top: '6px' }}>
					<PanelHeaderButton
						onClick={() => {
							openImage(imgs);
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
						openImage(imgs);
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

			{pathes_to_photo.length <= 1 ? (
				''
			) : (
				<HorizontalScroll>
					<div style={{ display: 'flex' }}>
						{pathes_to_photo.map((img, i) => {
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
						})}
					</div>
				</HorizontalScroll>
			)}

			<div style={{ padding: '16px' }}>
				<div style={{ display: 'block', alignItems: 'center' }}>
					{isAuthor ? (
						<div style={{ display: 'block' }}>
							<Button disabled={isFinished()} mode="commerce" size="xl" onClick={openSubs}>
								{status == STATUS_OFFER ? 'Отдать' : 'Изменить получателя'}
							</Button>
						</div>
					) : (
						''
					)}
				</div>
			</div>

			{isDealer || status == STATUS_CLOSED || status == STATUS_ABORTED || isAuthor ? (
				''
			) : isSub ? (
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ margin: '12px' }}>
						<Button
							stretched
							size="m"
							mode="destructive"
							onClick={() => unsub(cost)}
							before={<Icon24MarketOutline />}
						>
							Отказаться
						</Button>
					</div>
					<PanelHeaderButton onClick={onCarmaClick}>
						<div style={{ fontSize: '20px', color: 'var(--destructive)' }}>
							{cost - 1}
							{K}
						</div>
					</PanelHeaderButton>
					<PanelHeaderButton onClick={onFreezeClick}>
						<Icon24Help fill="var(--destructive)" />
					</PanelHeaderButton>
				</div>
			) : (
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ margin: '12px' }}>
						<Button
							stretched
							size="m"
							mode="primary"
							onClick={() => sub(cost)}
							before={<Icon24MarketOutline />}
						>
							Хочу забрать!
						</Button>
					</div>
					<PanelHeaderButton onClick={onCarmaClick}>
						<div style={{ fontSize: '20px', color: 'var(--header_tint)' }}>
							{cost}
							{K}
						</div>
					</PanelHeaderButton>
					<PanelHeaderButton onClick={onFreezeClick}>
						<Icon24Help fill="var(--header_tint)" />
					</PanelHeaderButton>
				</div>
			)}
			<div className="CellLeft__head">{header}</div>
			<div className="CellLeft__block">{text}</div>
			<Separator />
			<table>
				<tbody>
					<tr>
						<td className="first">Категория</td>
						<td>{GetCategoryText(category)}</td>
					</tr>
					<tr>
						<td className="first">Просмотров</td>
						<td>{views_count}</td>
					</tr>
					{!isFinished() ? (
						<tr>
							<td className="first">Отклинулось</td>
							<td>{subs.length > 0 ? subs.length : '0'}</td>
						</tr>
					) : (
						''
					)}

					<tr>
						<td className="first">Размещено</td>
						<td>{time(creation_date)}</td>
					</tr>
				</tbody>
			</table>
			<Separator />
			<div
				style={{
					display: 'flex',
					paddingLeft: '16px',
					margin: '0px',
				}}
			>
				<Cell before={<Icon24Place />}>{region + ', ' + district}</Cell>
			</div>
			<Separator />
			<Group header={<Header>Автор</Header>}>
				<Cell
					onClick={() => props.openUser(author.vk_id)}
					before={<Avatar size={36} src={author.photo_url} />}
					description={extra_field ? extra_field : ''}
				>
					<div style={{ display: 'flex' }}>
						{author.name + ' ' + author.surname}{' '}
						{feedback_type == 'ls' ? (
							<Link
								style={{ marginLeft: '15px' }}
								href={'https://vk.com/im?sel=' + author.vk_id}
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
			{isAuthor && isFinished ? <Subs openUser={props.openUser} amount={2} maxAmount={2} mini={true} /> : null}

			{feedback_type == 'comments' ? (
				<>
					<Comments mini={true} amount={1} maxAmount={1} openUser={props.openUser} />
				</>
			) : (
				<Placeholder icon={<Icon56WriteOutline />} header="Комментарии закрыты"></Placeholder>
			)}
			<Group separator="show" header={<Header mode="secondary">Действия</Header>}>
				<div style={{ display: 'block', alignItems: 'center' }}>
					{isAuthor ? (
						<div style={{ display: 'block' }}>
							<div style={{ display: 'flex' }}>
								<CellButton disabled={isFinished()} before={<Icon24Write />} onClick={onEditClick}>
									Редактировать
								</CellButton>
								<CellButton
									mode="danger"
									disabled={isFinished()}
									before={<Icon24Delete />}
									onClick={() => {
										deleteAd(openPopout, ad_id, openSnackbar, props.refresh);
									}}
								>
									Удалить
								</CellButton>
							</div>
							<div style={{ display: 'flex' }}>
								<CellButton
									onClick={() => {
										hidden
											? adVisible(openPopout, openSnackbar, ad_id, () => {
													setIsHidden(false);
											  })
											: adHide(openPopout, openSnackbar, ad_id, () => {
													setIsHidden(true);
											  });
									}}
									disabled={isFinished()}
									before={hidden ? <Icon24Globe /> : <Icon24Hide />}
								>
									{hidden ? 'Сделать видимым' : 'Сделать невидимым'}
								</CellButton>
								<CellButton
									onClick={() => {
										shareInVK(openSnackbar);
									}}
									before={<Icon24ShareExternal />}
								>
									Поделиться
								</CellButton>
							</div>
						</div>
					) : (
						<CellButton
							onClick={() => {
								shareInVK(openSnackbar);
							}}
							before={<Icon24ShareExternal />}
						>
							Поделиться
						</CellButton>
					)}
				</div>
			</Group>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		AD: state.ad,
		myID: state.vkui.myID,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		...bindActionCreators(
			{
				setDummy,
				openModal,
				setPage,
				adVisible,
				adHide,
				deleteAd,
				getSubscribers,
				getDetails,
				acceptDeal,
				denyDeal,
				getCost,

				setCost,
				setIsSub,
				setSubs,
				setIsDealer,
				setDeal,

				setPhotos,
				setIsHidden,
				setIsAuthor,
				setExtraInfo,

				setStory,
				setFormData,

				openPopout,
				openSnackbar,
			},
			dispatch
		),
	};
};

const AddMore2 = connect(mapStateToProps, mapDispatchToProps)(AddMore2r);

export default AddMore2;

// 857 -> 936
