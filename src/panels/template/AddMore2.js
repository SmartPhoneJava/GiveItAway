import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	Avatar,
	Button,
	Group,
	Cell,
	ScreenSpinner,
	Placeholder,
	Caption,
	CardScroll,
	Card,
	Tooltip,
	RichCell,
	Subhead,
	MiniInfoCell,
	Alert,
} from '@vkontakte/vkui';

import { AnimateOnChange, AnimateGroup } from 'react-animation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DIRECTION_FORWARD } from './../../store/router/directionTypes';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

import Icon24View from '@vkontakte/icons/dist/24/view';
import Icon24Similar from '@vkontakte/icons/dist/24/similar';
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';

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
import {
	setDummy,
	openModal,
	setPage,
	openSnackbar,
	openPopout,
	setStory,
	closePopout,
	setProfile,
} from '../../store/router/actions';
import { PANEL_SUBS, PANEL_MAP } from './../../store/router/panelTypes';
import { MODAL_ADS_COST, MODAL_ADS_FROZEN, MODAL_ADS_TYPES } from '../../store/router/modalTypes';
import { setIsSub, setIsHidden, setExtraInfo, setIsAuthor } from '../../store/detailed_ad/actions';
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
import { AuctionLabel } from '../../components/detailed_ad/auction';

let current_i = 0;

let uid = 0;

const col = '#00a550';
// const col = randomColor({
// 	luminosity: 'dark',
// });

export function getAdTypeDescription(ad_type) {
	return ad_type == TYPE_CHOICE
		? 'Владелец вещи выбирает, кому он хочет передать вещь. После передачи, ' +
				'он получит столько кармы, сколько человек откликнулось на объявление. С получателя ' +
				'спишется столько кармы, сколько было указано рядом с его кнопкой "Откликнуться". ' +
				'Отдающий может изменить получателя в любой момент времени, пока сделка не подтверждена'
		: ad_type == TYPE_AUCTION
		? 'Каждый пользователь, откликаясь на объявление, делает' +
		  ' ставку, большую максимальной на 1 Карму. Владелец вещи ' +
		  'определяет, когда аукцион завершится. Получателем будет ' +
		  ' выбран тот, кто предложит наибольшую ставку на момент окончания аукциона' +
		  ' После передачи вещи с получающего будет списана сумма, ' +
		  'соответствующая его ставке. Она будет зачислена автору объявления. '
		: 'Получатель определяется случайным образом из списка откликнувшихся' +
		  'Запустить лотерею может только владелец вещи. Перезапустить ее невозможно.' +
		  'Получатель, определенный лотереей, сразу получит уведомление о победе';
}

export const getAdType = (ad_type) =>
	ad_type == TYPE_CHOICE ? 'Сделка' : ad_type == TYPE_AUCTION ? 'Аукцион' : 'Лотерея';

const AddMore2r = (props) => {
	const { myID, dispatch } = props;
	const {
		setIsSub,
		setIsAuthor,
		setIsHidden,
		setExtraInfo,
		openSnackbar,
		openPopout,
		setStory,
		setFormData,
		closePopout,
	} = props;
	const { setPage, openModal, setDummy, direction, AD } = props;

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
		const { isAuthor, isDealer, dealer, deal, status } = rAd;
		setComponentStatus(
			showStatus(
				status,
				isDealer,
				isAuthor,
				dealer,
				() =>
					acceptDeal(
						deal.deal_id,
						(v) => setStory(STORY_ADS),
						(e) => {
							console.log('acceptDeal err', e);
						}
					),
				() =>
					denyDeal(
						deal.deal_id,
						(v) => setStory(STORY_ADS),
						(e) => {
							console.log('denyDeal error', e);
						}
					),
				props.setProfile
			)
		);
	}, [rAd]);

	const [componentCategories, setComponentCategories] = useState();
	useEffect(() => {
		const { category, subcat_list, subcat } = rAd;

		setComponentCategories(
			<TagsLabel
				tags={[tag(category, col, null, col), tag(subcat_list, col, null, col), tag(subcat, col, null, col)]}
			/>
		);
	}, [rAd]);

	function tableElement(Icon, text, value, After, onClick) {
		return (
			<MiniInfoCell
				onClick={onClick}
				mode={onClick ? 'more' : null}
				before={<Icon width={20} height={20} />}
				after={
					After ? (
						<After
							width={22}
							height={22}
							className="details-table-element"
							style={{ color: onClick ? 'var(--accent)' : 'var(--text_secondary)' }}
						/>
					) : null
				}
			>
				{text}
				{':'}&nbsp;
				{value}
			</MiniInfoCell>
		);
	}

	const [componentItemTable, setComponentItemTable] = useState();
	useEffect(() => {
		const { views_count, status, region, district } = rAd;
		let subscribers_num = rAd.subscribers_num || '0';

		setComponentItemTable(
			<div className="details-table-outter">
				{tableElement(Icon24View, 'Просмотров', <AnimateOnChange>{views_count}</AnimateOnChange>)}
				{!isFinished(status)
					? tableElement(Icon24Similar, 'Откликнулось', <AnimateOnChange>{subscribers_num}</AnimateOnChange>)
					: null}
				{tableElement(
					Icon24UserOutgoing,
					'Вид объявления',
					getAdType(rAd.ad_type).toLowerCase(),
					Icon24Help,
					onTypesClick
				)}
				{tableElement(Icon24Place, 'Где забрать', getGeoPosition(region, district), Icon24Chevron, openMap)}
			</div>
		);
	}, [rAd]);

	const [componentPhotoSwipe, setComponentPhotoSwipe] = useState();
	useEffect(() => {
		setComponentPhotoSwipe(
			<PhotoSwipe isOpen={isOpen} items={localPhotos} options={options} onClose={handleClose} />
		);
	}, [localPhotos, isOpen, options]);

	const [tooltip, setTooltip] = useState(false);

	const [componentPhotos, setComponentPhotos] = useState(null);
	useEffect(() => {
		const pathes_to_photo = rAd.pathes_to_photo || [];

		setComponentPhotos(
			<CardScroll>
				<div style={{ display: 'flex' }}>
					{pathes_to_photo.map((img, i) => (
						<Card
							key={i}
							size="s"
							key={i}
							onClick={() => {
								openImage(imgs, i);
							}}
						>
							<ImageCache className="details-card-img" url={img.PhotoUrl} />
							<div className="details-card-btn-outter">
								<Avatar className="details-card-btn-inner" size={26}>
									<Icon24Fullscreen fill="var(--white)" />
								</Avatar>
							</div>
						</Card>
					))}
				</div>
			</CardScroll>
		);
		return () => setComponentPhotos(null);
	}, [rAd]);

	const [componentImages, setComponentImages] = useState();
	useEffect(() => {
		const { header, text } = rAd;
		const pathes_to_photo = rAd.pathes_to_photo || [];
		if (pathes_to_photo.length == 0) {
			return;
		}

		const imgDivs = (
			<Group
				header={
					<RichCell
						multiline={true}
						text={<AnimateOnChange>{text}</AnimateOnChange>}
						style={{ marginTop: '0px' }}
					>
						<Subhead weight="bold">{header}</Subhead>
					</RichCell>
				}
			>
				<CardScroll>
					<div style={{ display: 'flex' }}>
						{pathes_to_photo.map((img, i) => (
							<Card
								key={i}
								size="s"
								key={i}
								onClick={() => {
									openImage(imgs, i);
								}}
							>
								<ImageCache className="details-card-img" url={img.PhotoUrl} />
								<div className="details-card-btn-outter">
									<Avatar className="details-card-btn-inner" size={26}>
										<Icon24Fullscreen fill="var(--white)" />
									</Avatar>
								</div>
							</Card>
						))}
					</div>
				</CardScroll>
			</Group>
		);

		setComponentImages(imgDivs);
		// return () => setComponentImages(null);
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

	function changeIsSub(isSubs) {
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
		const myPlace = props.AD.history.length;
		const init = () => () => {
			const id = AD.ad_id;
			setIsAuthor(AD.author.vk_id == myID);
			setDealRequestSuccess(false);
			console.log('setDealRequestSuccess init');
			updateDealInfo(
				() => {
					console.log('setDealRequestSuccess success');
					if (cancelFunc) {
						return;
					}

					setDealRequestSuccess(true);
				},
				() => {
					console.log('setDealRequestSuccess failed');
					if (cancelFunc) {
						return;
					}
					setDealRequestSuccess(true);
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
					setSubsRequestSuccess(true);
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
					details.isAuthor = details.author.vk_id == myID;
					setrAd(details);
				},
				(e) => {
					if (cancelFunc) {
						return;
					}
					setIsAuthor(false);
					setDetailsRequestSuccess(true);
				}
			);
		};
		if (direction == DIRECTION_FORWARD) {
			dispatch(init());
			console.log('need recover register', props.AD.ad_id);
		} else {
			setCostRequestSuccess(true);
			setDealRequestSuccess(true);
			setSubsRequestSuccess(true);
			setDetailsRequestSuccess(true);
		}

		return () => {
			cancelFunc = true;
		};
	}, []);

	const openSubs = (ad_type, subscribers_num, ad_id) => {
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

	const onCarmaClick = () => openModal(MODAL_ADS_COST);

	const onTypesClick = () => openModal(MODAL_ADS_TYPES);

	const onFreezeClick = () => openModal(MODAL_ADS_FROZEN);

	const isFinished = (st) => st !== STATUS_OFFER && st !== STATUS_CHOSEN;

	const [imgs, setImgs] = useState([]);

	const [localPhotos, setLocalPhotos] = useState([]);

	useEffect(() => {
		let cancelFunc = false;
		current_i++;
		let this_i = current_i;

		const { header } = rAd;
		const pathes_to_photo = rAd.pathes_to_photo || [];

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
	}, [rAd]);

	function unsub(ad_id) {
		unsubscribe(
			openPopout,
			openSnackbar,
			ad_id,
			() => sub(ad_id),
			(v) => {
				changeIsSub(false);
			},
			(e) => {},
			() => {}
		);
	}

	function sub(ad_id) {
		subscribe(
			openPopout,
			openSnackbar,
			ad_id,
			() => unsub(ad_id),
			(v) => {
				changeIsSub(true);
			},
			(e) => {},
			() => {}
		);
	}

	const [subButton, setSubButton] = useState(<></>);
	useEffect(() => {
		const { isDealer, status, isAuthor, isSub, cost, ad_id } = rAd;
		if (isAuthor || !detailsRequestSuccess || !costRequestSuccess) {
			setSubButton(null);
		} else {
			const color = isSub ? 'var(--destructive)' : 'var(--header_tint)';
			setSubButton(
				!(isDealer || status == STATUS_CLOSED || status == STATUS_ABORTED) ? (
					<div className="flex-center">
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
				) : null
			);
		}
	}, [rAd, costRequestSuccess, detailsRequestSuccess]);

	function buttonAction(icon, text, onClick, destructive, disabled) {
		const color = destructive ? 'var(--destructive)' : 'var(--accent)';
		uid++;
		return (
			<Button
				disabled={disabled}
				key={uid}
				mode="tertiary"
				onClick={onClick}
				style={{ padding: '5px', margin: '0px', flex: 1 }}
			>
				<div
					style={{
						color: color,
						margin: 'auto',
					}}
				>
					<div style={{ display: 'inline-block' }}>{icon}</div>
					<Caption level="1" weight="semibold">
						{text}
					</Caption>
				</div>
			</Button>
		);
	}

	const [componentComments, setComponentComments] = useState();
	useEffect(() => {
		const { comments_enabled } = rAd;
		let v = <Placeholder icon={<Icon56WriteOutline />} header="Комментарии закрыты"></Placeholder>;
		if (comments_enabled) {
			v = <Comments mini={true} amount={1} maxAmount={1} openUser={props.setProfile} />;
		}
		setComponentComments(v);
	}, [rAd]);

	const [componentSubs, setComponentSubs] = useState();
	useEffect(() => {
		const { status, isAuthor } = rAd;
		const finished = isFinished(status);
		let v = null;
		if (isAuthor && !finished) {
			v = <Subs openUser={props.setProfile} amount={2} maxAmount={2} mini={true} />;
		}
		setComponentSubs(v);
	}, [rAd]);

	const [componentChosenSub, setComponentChosenSub] = useState();
	useEffect(() => {
		const { isAuthor, dealer, status, ad_type, subscribers_num, ad_id, isSub } = rAd;
		const finished = isFinished(status);
		console.log("we wanna update", isSub)
		setComponentChosenSub(
			<div style={{ flex: 1 }}>
				{ad_type == TYPE_AUCTION ? (
					<AuctionLabel
						ad_id={ad_id}
						dealer={dealer}
						isAuthor={isAuthor}
						isSub={isSub}
						unsub={() => unsub(ad_id)}
						sub={() => sub(ad_id)}
					/>
				) : (
					<Given
						openSubs={() => openSubs(ad_type, subscribers_num, ad_id)}
						isAuthor={isAuthor}
						openUser={props.setProfile}
						dealer={dealer}
						finished={finished}
						dealRequestSuccess={dealRequestSuccess}
					/>
				)}
			</div>
		);
	}, [rAd, dealRequestSuccess]);

	const [componentAuthor, setComponentAuthor] = useState();
	useEffect(() => {
		const { author, creation_date } = rAd;
		setComponentAuthor(
			<Cell
				onClick={() => props.setProfile(author.vk_id)}
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
		const { isAuthor, isDealer, isSub, status, hidden, ad_id } = rAd;
		const disabled = isFinished(status);
		const alert = (
			<Alert
				actions={[
					{
						title: 'Отмена',
						autoclose: true,
						mode: 'cancel',
					},
					{
						title: 'Удалить',
						autoclose: true,
						mode: 'destructive',
						action: () => deleteAd(ad_id, props.refresh),
					},
				]}
				onClose={closePopout}
			>
				<h2>Вы действительно хотите удалить объявление?</h2>
				<p>Отменить данное действие будет невозможно</p>
			</Alert>
		);
		let buttons = [
			buttonAction(<Icon24Write />, 'Изменить', onEditClick, null, disabled),
			// <AnimateOnChange>
			buttonAction(
				hidden ? <Icon24Globe /> : <Icon24Hide />,
				hidden ? 'Открыть' : 'Скрыть',
				() => {
					hidden ? adVisible(ad_id, () => setIsHidden(false)) : adHide(ad_id, () => setIsHidden(true));
				},
				null,
				disabled
			),
			// </AnimateOnChange>,
			buttonAction(<Icon24ShareExternal />, 'Поделиться', shareInVK),
			buttonAction(
				<Icon24Delete style={{ color: 'var(--destructive)' }} />,
				'Удалить',
				() => openPopout(alert),
				true,
				disabled
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
				() => (isSub ? unsub(ad_id) : sub(ad_id)),
				isSub,
				isFinished(status) || isDealer
			);

			const helpBtn = buttonAction(
				<Icon24Help />,
				'Как это работает?',
				onFreezeClick,
				null,
				isFinished(status) || isDealer
			);

			buttons = [
				subBtn,
				helpBtn,
				buttonAction(<Icon24ShareExternal />, 'Поделиться', shareInVK),
				buttonAction(<Icon24Report />, 'Пожаловаться', () => {
					window.open('https://vk.com/im?media=&sel=-194671970');
				}),
			];
		}

		setAllActions(
			<Card mode="outline" style={{ margin: '5px' }}>
				<div className="flex-center">{buttons}</div>
			</Card>
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

	function getGeoPosition(region, district) {
		let r = region != undefined ? region : null || '';
		let d = district != undefined ? district : null || '';
		return r && d ? r + ', ' + d : r + d;
	}

	if (isNotValid(AD)) {
		return (
			<Placeholder stretched header="Загрузка объявления">
				<ScreenSpinner size="large" />
			</Placeholder>
		);
	}

	return (
		<div>
			{componentStatus}
			{componentAuthor}
			{componentPhotoSwipe}
			<div style={{ display: width < 500 ? 'block' : 'flex' }}>
				<div
					style={{
						display: 'block',
						flex: 1,
						maxWidth: width < 500 ? null : '' + width / 2 + 'px',
						padding: '5px',
					}}
				>
					<Card mode="outline">
						<div style={{ paddingBottom: '12px', paddingRight: '12px' }}>{componentImages}</div>
					</Card>
				</div>

				{width < 500 ? allActions : null}

				<div style={{ display: 'block', flex: 1, padding: '5px' }}>
					<Card mode="outline">
						{componentCategories}
						{componentItemTable}
					</Card>
				</div>
			</div>
			{width < 500 ? null : allActions}

			<div
				style={{
					display: width < 500 ? 'block' : 'flex',
				}}
			>
				<div style={{ flex: 1, padding: '5px' }}>
					<Card mode="outline">{componentChosenSub}</Card>
				</div>
				{componentSubs ? (
					<div style={{ flex: 1, padding: '5px' }}>
						<Card mode="outline">{componentSubs}</Card>
					</div>
				) : null}
				<div style={{ flex: 1, padding: '5px' }}>
					<Card mode="outline">{componentComments}</Card>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		AD: state.ad,
		direction: state.router.direction,
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
				setProfile,
				adVisible,
				adHide,
				deleteAd,
				getSubscribers,
				getDetails,
				acceptDeal,
				denyDeal,

				setIsSub,

				setIsHidden,
				setIsAuthor,
				setExtraInfo,

				setStory,
				setFormData,

				openPopout,
				openSnackbar,

				closePopout,
			},
			dispatch
		),
	};
};

const AddMore2 = connect(mapStateToProps, mapDispatchToProps)(AddMore2r);

export default AddMore2;

// 857 -> 936 -> 838 -> 923 -> 1016 -> 935 -> 987 -> 897 -> 953
