import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	Avatar,
	PanelHeaderButton,
	Button,
	Group,
	Header,
	HorizontalScroll,
	Cell,
	Separator,
	ScreenSpinner,
	CellButton,
	Placeholder,
	Spinner,
	Tabbar,
	TabbarItem,
	Caption,
	Div,
	CardScroll,
	Card,
	Gradient,
	Link,
	Tooltip,
	RichCell,
	Subhead,
} from '@vkontakte/vkui';

import { AnimateOnChange, AnimateGroup } from 'react-animation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DIRECTION_FORWARD } from './../../store/router/directionTypes';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

import { randomColor } from 'randomcolor';

import { GetCategoryText } from '../../components/categories/Categories';

import Icon24Report from '@vkontakte/icons/dist/24/report';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Globe from '@vkontakte/icons/dist/24/globe';
import Icon24Fullscreen from '@vkontakte/icons/dist/24/fullscreen';

import Icon24VideoFill from '@vkontakte/icons/dist/24/video_fill';

import Icon24Delete from '@vkontakte/icons/dist/24/delete';

import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import Icon24ShareExternal from '@vkontakte/icons/dist/24/share_external';
import Icon24Place from '@vkontakte/icons/dist/24/place';

import Subs, { Given } from './../story/adds/tabs/subs/subs';
import { subscribe, unsubscribe } from './../story/adds/tabs/subs/requests';

import { K } from './../story/profile/const';

import Icon24Coins from '@vkontakte/icons/dist/24/coins';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24MarketOutline from '@vkontakte/icons/dist/24/market_outline';

import {
	adVisible,
	adHide,
	deleteAd,
	getSubscribers,
	getDetails,
	acceptDeal,
	denyDeal,
	Close,
	fail,
} from './../../requests';

import './addsTab.css';
import './styles.css';

import Comments from './../story/adds/tabs/comments/comments';

import { time } from './../../utils/time';
import { setDummy, openModal, setPage, openSnackbar, openPopout, setStory, setAdIn } from '../../store/router/actions';
import { PANEL_SUBS, PANEL_MAP } from './../../store/router/panelTypes';
import { MODAL_ADS_COST, MODAL_ADS_FROZEN } from '../../store/router/modalTypes';
import {
	setIsSub,
	setPhotos,
	setIsHidden,
	setExtraInfo,
	setIsAuthor,
	backToPrevAd,
} from '../../store/detailed_ad/actions';
import {
	AdDefault,
	AD_LOADING,
	STATUS_OFFER,
	STATUS_CHOSEN,
	STATUS_CLOSED,
	STATUS_ABORTED,
	TYPE_CHOICE,
	TYPE_AUCTION,
} from '../../const/ads';
import { shareInVK } from '../../services/VK';
import { STORY_CREATE, STORY_ADS } from '../../store/router/storyTypes';
import { EDIT_MODE, CREATE_AD_MAIN, CREATE_AD_ITEM } from '../../store/create_post/types';
import { setFormData } from '../../store/create_post/actions';
import { FORM_CREATE } from '../../components/categories/redux';
import { FORM_LOCATION_CREATE } from '../../components/location/redux';
import { updateDealInfo, updateCost, updateSubs } from '../../store/detailed_ad/update';
import { showStatus } from '../../components/detailed_ad/status';
import { withLoading, withLoadingIf, animatedDiv, ImageCache } from '../../components/image/image_cache';
import { TagsLabel, tag } from '../../components/categories/label';

let current_i = 0;

const col = '#00a550';
// const col = randomColor({
// 	luminosity: 'dark',
// });

const AddMore2r = (props) => {
	const { myID, dispatch } = props;
	const {
		setIsSub,
		setIsAuthor,
		setPhotos,
		setIsHidden,
		setExtraInfo,
		openSnackbar,
		openPopout,
		setStory,
		setFormData,
		setAdIn,
		backToPrevAd,
	} = props;
	const { setPage, openModal, setDummy, direction, AD } = props;
	const {
		isAuthor,
		status,
		deal,
		dealer,
		pathes_to_photo,
		header,
		ad_id,
		subscribers_num,
		district,
		author,
		ad_type,
		comments_enabled,
		extra_field,
		region,
	} = AD;

	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState({});
	const [rAd, setrAd] = useState(AD);

	const [costRequestSuccess, setCostRequestSuccess] = useState(false);
	const [dealRequestSuccess, setDealRequestSuccess] = useState(false);
	const [subsRequestSuccess, setSubsRequestSuccess] = useState(false);
	const [detailsRequestSuccess, setDetailsRequestSuccess] = useState(false);

	useEffect(() => {
		setrAd(AD);
	}, [AD]);

	const [componentStatus, setComponentStatus] = useState();
	useEffect(() => {
		const { isAuthor, isDealer, dealer, status } = rAd;
		setComponentStatus(
			showStatus(
				status,
				isDealer,
				isAuthor,
				dealer,
				() => {
					acceptDeal(
						deal.deal_id,
						(v) => {
							setStory(STORY_ADS);
						},
						(e) => {
							console.log('acceptDeal err', e);
						}
					);
				},
				() => {
					denyDeal(
						deal.deal_id,
						(v) => {
							setStory(STORY_ADS);
						},
						(e) => {
							console.log('denyDeal error', e);
						}
					);
				},
				props.openUser
			)
		);
	}, [rAd]);

	// const [componentItemHeader, setComponentItemHeader] = useState();
	// useEffect(() => {
	// 	const { header, text } = rAd;
	// 	setComponentItemHeader(
	// 		<div style={{ display: 'block' }}>
	// 			<div className="details-ad-header">{header}</div>
	// 			<div className="details-ad-description">{text}</div>
	// 		</div>
	// 	);
	// }, [rAd]);

	function tr(name, value) {
		if (!value) {
			return null;
		}
		return (
			<tr>
				<td className="first">{name}</td>
				<td>{value}</td>
			</tr>
		);
	}

	const [componentCategories, setComponentCategories] = useState();
	useEffect(() => {
		const { category, subcat_list, subcat } = rAd;

		setComponentCategories(
			<TagsLabel
				tags={[tag(category, col, null, col), tag(subcat_list, col, null, col), tag(subcat, col, null, col)]}
			/>
		);
	}, [rAd]);

	const [componentItemTable, setComponentItemTable] = useState();
	useEffect(() => {
		const { ad_type, views_count, status } = rAd;
		let subscribers_num = rAd.subscribers_num || '0';

		console.log('statusstatus', status, isFinished(status), subscribers_num);

		setComponentItemTable(
			<table>
				<tbody>
					{tr('Просмотров', views_count)}
					{!isFinished(status) ? tr('Откликнулось', subscribers_num) : null}
					{tr(
						'Вид объявления',
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div>
								{ad_type == TYPE_CHOICE ? 'Сделка' : ad_type == TYPE_AUCTION ? 'Аукцион' : 'Лотерея'}
							</div>
							<div>
								<PanelHeaderButton
									style={{ margin: '0px', padding: '0px' }}
									onClick={() => {}}
								>
									<Icon24Help fill="var(--text_subhead)" />
								</PanelHeaderButton>
								
							</div>
						</div>
					)}
					{tr(
						'Где забрать',
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div onClick={openMap}>{getGeoPosition()}</div>
							<div>
								<PanelHeaderButton style={{ margin: '0px', padding: '0px' }} onClick={() => {}}>
									<Icon24Chevron />
								</PanelHeaderButton>
							</div>
						</div>
					)}
				</tbody>
			</table>
		);
	}, [rAd]);

	const [componentPhotoSwipe, setComponentPhotoSwipe] = useState();
	useEffect(() => {
		setComponentPhotoSwipe(
			<PhotoSwipe
				style={{ marginTop: '50px' }}
				isOpen={isOpen}
				items={localPhotos}
				options={options}
				onClose={handleClose}
			/>
		);
	}, [localPhotos, isOpen, options]);

	// const [componentMainImage, setComponentMainImage] = useState();
	// useEffect(() => {
	// 	const { image } = rAd;
	// 	setComponentMainImage(
	// 		<div style={{ position: 'relative' }}>
	// 			<div style={{ right: '10px', position: 'absolute', top: '6px' }}>
	// 				<PanelHeaderButton
	// 					onClick={() => {
	// 						openImage(imgs);
	// 					}}
	// 					mode="secondary"
	// 					style={{ margin: '5px', float: 'right', marginLeft: 'auto' }}
	// 					size="m"
	// 				>
	// 					<Avatar style={{ background: 'rgba(0,0,0,0.7)' }} size={32}>
	// 						<Icon24Fullscreen fill="var(--white)" />
	// 					</Avatar>
	// 				</PanelHeaderButton>
	// 			</div>
	// 			{componentStatus}
	// 			<ImageCache
	// 				url={image}
	// 				className="details-main-image"
	// 				onClick={() => {
	// 					openImage(imgs);
	// 				}}
	// 			/>
	// 		</div>
	// 	);
	// }, [rAd]);

	const [tooltip, setTooltip] = useState(false);

	const [componentImages, setComponentImages] = useState();
	useEffect(() => {
		const { header, text } = rAd;
		const pathes_to_photo = rAd.pathes_to_photo || [];

		const imgDivs = (
			<Group
				header={
					<>
						<RichCell multiline={true} text={text} style={{ marginTop: '0px', paddingTop: '0px' }}>
							<Subhead weight="bold">{header}</Subhead>
						</RichCell>
					</>
				}
				style={{ margin: '0px', padding: '0px' }}
			>
				<CardScroll>
					<AnimateGroup animationIn="fadeInUp" animationOut="fadeOutDown" durationOut={500}>
						<div style={{ display: 'flex' }}>
							{pathes_to_photo.map((img, i) => (
								<Card
									size="s"
									onClick={() => {
										openImage(imgs, i);
									}}
								>
									<ImageCache className="light-tiled" url={img.PhotoUrl} />
									<div style={{ right: '7px', position: 'absolute', top: '3px' }}>
										<Avatar
											style={{
												margin: '3px',
												float: 'right',
												marginLeft: 'auto',
												top: '-3px',
												background: 'rgba(0,0,0,0.8)',
											}}
											size={26}
										>
											<Icon24Fullscreen fill="var(--white)" />
										</Avatar>
									</div>
								</Card>
							))}
						</div>
					</AnimateGroup>
				</CardScroll>
			</Group>
		);

		setComponentImages(imgDivs);
	}, [rAd]);

	const handleClose = () => {
		setIsOpen(false);
	};

	const openImage = (imgs, photoIndex) => {
		bridge
			.send('VKWebAppShowImages', {
				images: imgs,
				start_index: photoIndex,
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

	function isNotValid() {
		return AD == null || AD.ad_id == AD_LOADING.ad_id || AD.ad_id == AdDefault.ad_id;
	}

	const width = document.body.clientWidth;

	// useEffect(() => {
	// 	if (isNotValid() || (photos && photos.length != 0)) {
	// 		return;
	// 	}
	// 	const photoSwipeImgs = pathes_to_photo.map((v) => {
	// 		let img = new Image();
	// 		img.src = v.PhotoUrl;
	// 		let width = img.width;
	// 		let hight = img.height;
	// 		return {
	// 			src: v.PhotoUrl,
	// 			msrc: v.PhotoUrl,
	// 			w: width,
	// 			h: hight,
	// 			title: header,
	// 			thumbnail: v.PhotoUrl,
	// 		};
	// 	});
	// 	setPhotos(photoSwipeImgs);
	// }, [photos]);

	function changeIsSub(isSubs, c) {
		if (isNotValid()) {
			return;
		}
		updateCost(
			isSubs,
			() => {
				setCostRequestSuccess(true);
			},
			() => {
				setCostRequestSuccess(false);
			}
		);
		setIsSub(isSubs);
	}

	useEffect(() => {
		let cancelFunc = false;
		const init = () => () => {
			const id = AD.ad_id;

			setDealRequestSuccess(false);
			updateDealInfo(
				() => {
					if (cancelFunc) {
						return;
					}
					setDealRequestSuccess(true);
				},
				() => {
					if (cancelFunc) {
						return;
					}
					setDealRequestSuccess(false);
				}
			);

			setSubsRequestSuccess(false);
			updateSubs(
				() => {
					if (cancelFunc) {
						return;
					}
					setSubsRequestSuccess(true);
				},
				() => {
					if (cancelFunc) {
						return;
					}
					setSubsRequestSuccess(false);
				}
			);

			setDetailsRequestSuccess(false);
			getDetails(
				id,
				(details) => {
					if (cancelFunc) {
						return;
					}
					setExtraInfo(details, myID, true);
					setCostRequestSuccess(false);
					updateCost(
						details.is_subscriber,
						() => {
							if (cancelFunc) {
								return;
							}
							setCostRequestSuccess(true);
						},
						() => {
							if (cancelFunc) {
								return;
							}
							setCostRequestSuccess(false);
						}
					);
					console.log('set details', details.author.vk_id == myID);
					setDetailsRequestSuccess(true);
					setrAd(details);
					setIsAuthor(details.author.vk_id == myID);
				},
				(e) => {
					if (cancelFunc) {
						return;
					}
					setIsAuthor(false);
					setDetailsRequestSuccess(false);
				}
			);
		};
		if (direction == DIRECTION_FORWARD) {
			dispatch(init());
		} else if (props.adOut) {
			backToPrevAd();
		} else {
			setCostRequestSuccess(true);
			setDealRequestSuccess(true);
			setSubsRequestSuccess(true);
			setDetailsRequestSuccess(true);
		}
		setAdIn();
		return () => {
			cancelFunc = true;
		};
	}, []);

	const openSubs = () => {
		if (ad_type == TYPE_CHOICE) {
			setPage(PANEL_SUBS);
		} else {
			if (subscribers_num == 0) {
				fail('Никто еще не откликнулся на ваше объявление');
			} else {
				Close(
					ad_id,
					ad_type,
					0,
					(e) => {
						console.log('success close ad');
					},
					(e) => {
						console.log('failed close ad', e);
					}
				);
			}
		}
	};

	const onCarmaClick = () => {
		openModal(MODAL_ADS_COST);
	};

	const onFreezeClick = () => {
		openModal(MODAL_ADS_FROZEN);
	};

	const isFinished = (st) => {
		const ST = st || status;
		return ST !== STATUS_OFFER && ST !== STATUS_CHOSEN;
	};

	const [imgs, setImgs] = useState([]);

	const [localPhotos, setLocalPhotos] = useState([]);

	useEffect(() => {
		let cancelFunc = false;
		current_i++;
		let this_i = current_i;

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
		let photos_num = photoSwipeImgs.length;
		photoSwipeImgs.forEach((r) => {
			let img = new Image();
			img.src = r.src;
			img.onload = function () {
				photos_num--;
				r.w = img.width;
				r.h = img.height;

				if (photos_num == 0 && this_i == current_i) {
					if (cancelFunc) {
						return;
					}
					setLocalPhotos(photoSwipeImgs);
				}
			};
		});

		setLocalPhotos(photoSwipeImgs);
		setImgs(pathes_to_photo.map((v) => v.PhotoUrl));
		return () => {
			cancelFunc = true;
		};
	}, [pathes_to_photo]);

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

	const [subButton, setSubButton] = useState(<></>);
	useEffect(() => {
		const { isDealer, status, isAuthor, isSub, cost } = rAd;
		if (isAuthor || !detailsRequestSuccess || !costRequestSuccess) {
			setSubButton(null);
			// setSubButton(
			// 	<div className="subscribe-button">
			// 		<div style={{ display: 'block', alignItems: 'center' }}>
			// 			<Button
			// 				disabled={isFinished() || (ad_type != TYPE_CHOICE && status != STATUS_OFFER)}
			// 				mode="commerce"
			// 				size="xl"
			// 				onClick={openSubs}
			// 			>
			// 				{status == STATUS_OFFER ? 'Выбрать получателя' : 'Изменить получателя'}
			// 			</Button>
			// 		</div>
			// 	</div>
			// );
		} else {
			const mainButton = isSub ? (
				<Button
					stretched
					size="m"
					mode="destructive"
					onClick={() => unsub(cost)}
					before={<Icon24MarketOutline />}
				>
					Отказаться
				</Button>
			) : (
				<Button stretched size="m" mode="primary" onClick={() => sub(cost)} before={<Icon24MarketOutline />}>
					Хочу забрать!
				</Button>
			);

			const color = isSub ? 'var(--destructive)' : 'var(--header_tint)';
			console.log('biiiig', !(isDealer || status == STATUS_CLOSED || status == STATUS_ABORTED));
			setSubButton(
				!(isDealer || status == STATUS_CLOSED || status == STATUS_ABORTED) ? (
					<>
						<AnimateOnChange animation="bounce">
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<div>
									<Avatar style={{ background: 'rgba(255,255,255,0.8)' }} size={32}>
										{withLoadingIf(
											costRequestSuccess,
											<div style={{ fontSize: '20px', color: color }}>
												{cost}
												{K}
											</div>,
											'small'
										)}
									</Avatar>
								</div>
							</div>
						</AnimateOnChange>
					</>
				) : null

				// setSubButton(
				// 	<div className="subscribe-withLoadingIf">
				// 		{!(isDealer || status == STATUS_CLOSED || status == STATUS_ABORTED) ? (
				// 			<AnimateOnChange animation="bounce">
				// 				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				// 					<div className="subscribe-button">{mainButton}</div>
				// 					<div className="subscribe-num">
				// 						<Avatar style={{ background: 'rgba(255,255,255,0.8)' }} size={32}>
				// 							<PanelHeaderButton onClick={onCarmaClick}>
				// 								{withLoadingIf(
				// 									costRequestSuccess,
				// 									<div style={{ fontSize: '20px', color: color }}>
				// 										{cost}
				// 										{K}
				// 									</div>,
				// 									'small'
				// 								)}
				// 							</PanelHeaderButton>
				// 						</Avatar>
				// 					</div>
				// 				</div>
				// 			</AnimateOnChange>
				// 		) : null}
				// 	</div>
			);
		}
	}, [rAd, costRequestSuccess, detailsRequestSuccess]);

	function buttonAction(icon, text, onClick, destructive) {
		const color = destructive ? 'var(--destructive)' : 'var(--accent)';
		return (
			<Button mode="tertiary" onClick={onClick} style={{ padding: '5px', margin: '0px', flex: 1 }}>
				<div
					style={{
						alignItems: 'center',
						color: color,
						textAlign: 'center',
					}}
				>
					<Button mode="tertiary">{icon}</Button>
					<Caption level="1" weight="semibold">
						{text}
					</Caption>
				</div>
			</Button>
		);
	}

	const [componentAuthor, setComponentAuthor] = useState();
	useEffect(() => {
		const { author, creation_date } = rAd;
		setComponentAuthor(
			<Cell
				onClick={() => props.openUser(author.vk_id)}
				before={<Avatar style={{ margin: '0px', padding: '0px' }} size={40} src={author.photo_url} />}
				description={time(creation_date)}
				style={{ marginBottom: '0px', paddingBottom: '0px' }}
			>
				<div style={{ display: 'flex', margin: '0px', padding: '0px' }}>
					{author.name + ' ' + author.surname}{' '}
				</div>
			</Cell>
		);
	}, [rAd]);

	const [allActions, setAllActions] = useState();
	useEffect(() => {
		const { isAuthor, isDealer, isSub, status, cost, hidden } = rAd;
		let buttons = [
			buttonAction(<Icon24Write />, 'Изменить', onEditClick),
			buttonAction(hidden ? <Icon24Globe /> : <Icon24Hide />, hidden ? 'Открыть' : 'Скрыть', () => {
				hidden ? adVisible(ad_id, () => setIsHidden(false)) : adHide(ad_id, () => setIsHidden(true));
			}),
			buttonAction(<Icon24ShareExternal />, 'Поделиться', shareInVK),
			buttonAction(
				<Icon24Delete style={{ color: 'var(--destructive)' }} />,
				'Удалить',
				() => deleteAd(ad_id, props.refresh),
				true
			),
		];
		if (!isAuthor) {
			const color = isSub ? 'var(--destructive)' : 'var(--header_tint)';
			const subBtn = buttonAction(
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Icon24MarketOutline style={{ color }} />
					{subButton}
				</div>,
				isSub ? 'Перестать отслеживать' : 'Откликнуться',
				() => (isSub ? unsub(cost) : sub(cost)),
				isSub
			);

			const helpBtn = !(isDealer || status == STATUS_CLOSED || status == STATUS_ABORTED)
				? buttonAction(<Icon24Help />, 'Как это работает?', onFreezeClick)
				: null;

			buttons = [
				subBtn,
				helpBtn,
				buttonAction(<Icon24ShareExternal />, 'Поделиться', shareInVK),

				buttonAction(<Icon24Report />, 'Пожаловаться', () => {
					window.open('https://vk.com/im?media=&sel=-194671970');
				}),
			];
		}
		buttons = (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{buttons}
			</div>
		);
		setAllActions(
			<Div style={{ paddingTop: '0px', marginTop: '0px', paddingBottom: '0px', marginBottom: '0px' }}>
				{buttons}
			</Div>
		);
	}, [rAd, subButton, costRequestSuccess]);

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
			subcategory: AD.subcat_list,
			incategory: AD.subcat,
		});

		setFormData(CREATE_AD_MAIN, {
			type: AD.ad_type,
			ls_enabled: AD.ls_enabled,
			comments_enabled: AD.comments_enabled,
		});

		setStory(STORY_CREATE, null, true);
	}

	function openMap() {
		setPage(PANEL_MAP);
	}

	function getGeoPosition() {
		let r = region || '';
		let d = district || '';
		if (r == undefined) {
			r = '';
		}
		if (d == undefined) {
			d = '';
		}
		return r && d ? r + ', ' + d : r + d;
	}

	if (isNotValid(AD)) {
		return (
			<Placeholder stretched header="Загрузка объявления">
				<ScreenSpinner size="large" />
			</Placeholder>
		);
	}

	// слишком много вызовов надо все переносить в UseState
	return (
		<div>
			<div style={{ display: width < 500 ? 'block' : 'flex' }}>
				<div style={{ display: 'block' }}>
					<Card mode="outline">
						{componentStatus}
						{componentAuthor}
						{/* {componentItemHeader} */}
						<div style={{ display: 'block' }}>
							{componentPhotoSwipe}
							{/* {componentMainImage} */}
							{componentImages}
						</div>
						{/* {subButton} */}
					</Card>
					{width < 500 ? allActions : null}
				</div>
				{componentCategories}
				{componentItemTable}
			</div>
			{width < 500 ? null : allActions}
			<Separator />
			<div style={{ flex: 1 }}>
				<Given openSubs={openSubs} isAuthor={isAuthor} openUser={props.openUser} dealer={dealer} />
			</div>
			<Separator />
			<div style={{ display: width < 500 ? 'block' : 'flex' }}>
				{isAuthor && isFinished() ? (
					<div style={{ flex: 1 }}>
						<Subs openUser={props.openUser} amount={2} maxAmount={2} mini={true} />
					</div>
				) : null}
				<div style={{ flex: 1 }}>
					{comments_enabled ? (
						<Comments mini={true} amount={1} maxAmount={1} openUser={props.openUser} />
					) : (
						<Placeholder icon={<Icon56WriteOutline />} header="Комментарии закрыты"></Placeholder>
					)}
				</div>
			</div>
			<Separator />
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		AD: state.ad,
		direction: state.router.direction,
		adOut: state.router.adOut,
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

				setIsSub,

				setPhotos,
				setIsHidden,
				setIsAuthor,
				setExtraInfo,

				setStory,
				setFormData,

				openPopout,
				openSnackbar,

				setAdIn,
				backToPrevAd,
			},
			dispatch
		),
	};
};

const AddMore2 = connect(mapStateToProps, mapDispatchToProps)(AddMore2r);

export default AddMore2;

// 857 -> 936 -> 838 -> 923 -> 1016 -> 935 -> 987
