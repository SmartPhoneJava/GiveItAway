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
} from '@vkontakte/vkui';

import { AnimateOnChange, AnimateGroup } from 'react-animation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DIRECTION_FORWARD } from './../../store/router/directionTypes';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

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
	setPhotoIndex,
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

let current_i = 0;

let uid = 1;

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
		setPhotoIndex,
		setAdIn,
		backToPrevAd,
	} = props;
	const { setPage, openModal, setDummy, direction, AD } = props;
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
		subscribers_num,
		district,
		text,
		views_count,
		creation_date,
		author,
		ad_type,
		comments_enabled,
		extra_field,
		cost,
		hidden,
		image,
		photoIndex,
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
	}, [status, isDealer, isAuthor, dealer]);

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

	const [componentItemTable, setComponentItemTable] = useState();
	useEffect(() => {
		const { category, subcat_list, subcat, views_count, subscribers_num, creation_date } = rAd;

		setComponentItemTable(
			<div style={{ display: 'block' }}>
				<div className="CellLeft__head">{header}</div>
				<div className="CellLeft__block">{text}</div>
				<Separator />
				<table>
					<tbody>
						{tr('Категория', category)}
						{tr('Раздел', subcat_list)}
						{tr('Подраздел', subcat)}
						{tr('Просмотров', views_count)}
						{!isFinished() ? tr('Откликнулось', subscribers_num) : null}
						{tr('Размещено', time(creation_date))}
					</tbody>
				</table>
			</div>
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

	const [componentImages, setComponentImages] = useState();
	useEffect(() => {
		const { image, photoIndex } = rAd;
		const pathes_to_photo = rAd.pathes_to_photo || [];

		setComponentImages(
			<div style={{ display: 'block' }}>
				<>
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
									<Icon24Fullscreen fill="var(--white)" />
								</Avatar>
							</PanelHeaderButton>
						</div>
						{componentStatus}
						<ImageCache
							url={image}
							className="details-main-image"
							onClick={() => {
								console.log('we work!!');
								openImage(imgs);
							}}
						/>
					</div>
					{pathes_to_photo.length <= 1 ? null : (
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
				</>
			</div>
		);
	}, [rAd]);

	const handleClose = () => {
		setIsOpen(false);
	};

	const openImage = (imgs) => {
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
	const paddingActions = width < 500 ? 0 : width / 8;

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
					setDetailsRequestSuccess(true);
					setrAd(details);
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

	const isFinished = () => {
		return status !== STATUS_OFFER && status !== STATUS_CHOSEN;
	};

	const [imgs, setImgs] = useState([]);
	const [imgsSpinner, setImgSpinner] = useState(false);

	const [localPhotos, setLocalPhotos] = useState([]);

	useEffect(() => {
		let cancelFunc = false;
		// setImgSpinner(true);
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
					// setTimeout(() => setImgSpinner(false), 250);
				}
			};
		});

		setLocalPhotos(photoSwipeImgs);
		setImgs(pathes_to_photo.map((v) => v.PhotoUrl));
		return () => {
			cancelFunc = true;
		};
	}, [pathes_to_photo]);

	// useEffect(() => {
	// 	console.log('i loooook at pathes_to_photo', pathes_to_photo);
	// 	if (isNotValid(AD)) {
	// 		return;
	// 	}
	// 	setImgSpinner(true);
	// 	setInterval(() => setImgSpinner(false), 50);
	// 	setImgs(pathes_to_photo.map((v) => v.PhotoUrl));
	// }, [pathes_to_photo]);

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

			console.log('costRequestSuccess', costRequestSuccess);

			const color = isSub ? 'var(--destructive)' : 'var(--header_tint)';
			setSubButton(
				<div className="subscribe-withLoadingIf">
					{!(isDealer || status == STATUS_CLOSED || status == STATUS_ABORTED) ? (
						<AnimateOnChange animation="bounce">
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<div className="subscribe-button">{mainButton}</div>
								<div className="subscribe-num">
									<Avatar style={{ background: 'rgba(255,255,255,0.8)' }} size={32}>
										<PanelHeaderButton onClick={onCarmaClick}>
											{withLoadingIf(
												costRequestSuccess,
												<div style={{ fontSize: '20px', color: color }}>
													{cost}
													{K}
												</div>,
												'small'
											)}
										</PanelHeaderButton>
									</Avatar>
								</div>

								{/* <div className="subscribe-question">
						<Avatar style={{ background: 'rgba(255,255,255,0.8)' }} size={21}>
							<PanelHeaderButton onClick={onFreezeClick}>
								<Icon24Help fill={color} />
							</PanelHeaderButton>
						</Avatar>
					</div> */}
							</div>
						</AnimateOnChange>
					) : null}
				</div>
			);
		}
	}, [isDealer, status, isAuthor, isSub, cost, costRequestSuccess, detailsRequestSuccess]);

	function actionGroup(els) {
		console.log('looook at my uid', uid);
		uid++;
		return (
			<div
				key={uid}
				style={{
					display: 'flex',
				}}
			>
				{els}
			</div>
		);
	}

	function actionDiv(onClick, before, text, mode) {
		uid++;
		return (
			<div key={uid} style={{ flex: 1, paddingLeft: paddingActions }}>
				<CellButton mode={mode} disabled={isFinished()} before={before} onClick={onClick}>
					{text}
				</CellButton>
			</div>
		);
	}

	const [allActions, setAllActions] = useState();

	useState(() => {
		setAllActions(
			<Group separator="show" header={null}>
				<div style={{ display: 'block', alignItems: 'center' }}>
					{isAuthor ? (
						<div style={{ display: 'block' }}>
							{actionGroup([
								actionDiv(onEditClick, <Icon24Write />, 'Редактировать'),
								actionDiv(() => deleteAd(ad_id, props.refresh), <Icon24Delete />, 'Удалить', 'danger'),
							])}
							{actionGroup([
								actionDiv(
									() => {
										hidden
											? adVisible(ad_id, () => setIsHidden(false))
											: adHide(ad_id, () => setIsHidden(true));
									},
									hidden ? <Icon24Globe /> : <Icon24Hide />,
									hidden ? 'Сделать видимым' : 'Сделать невидимым'
								),
								actionDiv(shareInVK, <Icon24ShareExternal />, 'Поделиться'),
							])}
						</div>
					) : (
						actionGroup([
							actionDiv(shareInVK, <Icon24ShareExternal />, 'Поделиться'),
							actionDiv(
								() => {
									window.open('https://vk.com/im?media=&sel=-194671970');
								},
								<Icon24Report />,
								'Пожаловаться'
							),
						])
					)}
				</div>
			</Group>
		);
	}, [isAuthor]);

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
					{componentPhotoSwipe}
					{componentImages}
				</div>
				{subButton}
				{componentItemTable}
			</div>

			<Separator />
			<table>
				{width < 500 ? (
					<tbody>
						<tr>
							<td className="first">Вид объявления</td>
							<td>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div>
										{ad_type == TYPE_CHOICE
											? 'Сделка'
											: ad_type == TYPE_AUCTION
											? 'Аукцион'
											: 'Лотерея'}
									</div>
									<div>
										<PanelHeaderButton onClick={() => {}}>
											<Icon24Help fill="var(--text_subhead)" />
										</PanelHeaderButton>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td className="first">Где забрать</td>
							<td>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div onClick={openMap}>{getGeoPosition()}</div>
									<div>
										<PanelHeaderButton onClick={() => {}}>
											<Icon24Chevron />
										</PanelHeaderButton>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				) : (
					<tbody>
						{' '}
						<tr>
							<td className="first">Вид объявления</td>
							<td>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<Cell
										asideContent={
											<PanelHeaderButton onClick={() => {}}>
												<Icon24Help fill="var(--text_subhead)" />
											</PanelHeaderButton>
										}
									>
										{ad_type == TYPE_CHOICE
											? 'Сделка'
											: ad_type == TYPE_AUCTION
											? 'Аукцион'
											: 'Лотерея'}
									</Cell>
								</div>
							</td>
							<td className="first">Где забрать</td>
							<td>
								<div onClick={openMap}>
									<Cell asideContent={<Icon24Chevron />}>{getGeoPosition()}</Cell>
								</div>
							</td>
						</tr>
					</tbody>
				)}
			</table>
			<Separator />
			<div style={{ display: width < 500 ? 'block' : 'flex' }}>
				<div style={{ flex: 1 }}>
					<Group header={<Header>Автор</Header>}>
						<Cell
							asideContent={<Icon24Chevron />}
							onClick={() => props.openUser(author.vk_id)}
							before={<Avatar size={36} src={author.photo_url} />}
							description={extra_field ? extra_field : ''}
						>
							<div style={{ display: 'flex' }}>
								{author.name + ' ' + author.surname}{' '}
								{/* {ls_enabled ? (
							<Link
								style={{ marginLeft: '15px' }}
								href={'https://vk.com/im?sel=' + author.vk_id}
								target="_blank"
							>
								Написать
							</Link>
						) : (
							''
						)} */}
							</div>
						</Cell>
					</Group>
				</div>
				<div style={{ flex: 1 }}>
					<Given openSubs={openSubs} isAuthor={isAuthor} openUser={props.openUser} dealer={dealer} />
				</div>
				<Separator />
			</div>
			<Separator />
			<div style={{ display: width < 500 ? 'block' : 'flex' }}>
				{isAuthor && isFinished ? (
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
			{allActions}
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

				setPhotoIndex,

				setAdIn,
				backToPrevAd,
			},
			dispatch
		),
	};
};

const AddMore2 = connect(mapStateToProps, mapDispatchToProps)(AddMore2r);

export default AddMore2;

// 857 -> 936 -> 838 -> 923 -> 1016 -> 935
