import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	Avatar,
	Button,
	Group,
	Cell,
	Placeholder,
	Caption,
	CardScroll,
	Card,
	Tooltip,
	RichCell,
	Subhead,
	Alert,
	Spinner,
	Div,
} from '@vkontakte/vkui';

import { AnimateOnChange } from 'react-animation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DIRECTION_FORWARD } from './../../store/router/directionTypes';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe } from 'react-photoswipe';

import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';
import Icon56HideOutline from '@vkontakte/icons/dist/56/hide_outline';

import Icon28Messages from '@vkontakte/icons/dist/28/messages';

import { randomColor } from 'randomcolor';

import Icon24Report from '@vkontakte/icons/dist/24/report';
import Icon24Fullscreen from '@vkontakte/icons/dist/24/fullscreen';

import Icon24Delete from '@vkontakte/icons/dist/24/delete';

import Icon24Write from '@vkontakte/icons/dist/24/write';
import Icon24ShareExternal from '@vkontakte/icons/dist/24/share_external';

import { subscribe, unsubscribe } from './../story/adds/tabs/subs/requests';

import { K } from './../story/profile/const';

import { adVisible, adHide, deleteAd, getDetails, acceptDeal, denyDeal, fail } from './../../requests';

import './styles.css';

import Comments from './../story/adds/tabs/comments/comments';

import { time } from './../../utils/time';
import {
	setDummy,
	openModal,
	setPage,
	openPopout,
	closePopout,
	setProfile,
	goBack,
	updateContext,
} from '../../store/router/actions';
import { setIsSub, setIsHidden, setExtraInfo, setIsAuthor } from '../../store/detailed_ad/actions';
import { AdDefault, AD_LOADING, STATUS_CLOSED, STATUS_ABORTED, TYPE_CHOICE, TYPE_AUCTION } from '../../const/ads';
import { shareInVK } from '../../services/VK';
import { EDIT_MODE, CREATE_AD_MAIN, CREATE_AD_ITEM } from '../../store/create_post/types';
import { setFormData } from '../../store/create_post/actions';
import { FORM_CREATE } from '../../components/categories/redux';
import { FORM_LOCATION_CREATE } from '../../components/location/redux';
import { updateDealInfo, updateCost, updateSubs } from '../../store/detailed_ad/update';
import { showStatus } from '../../components/detailed_ad/status';
import { withLoadingIf, ImageCache } from '../../components/image/image_cache';
import { TagsLabel, tag } from '../../components/categories/label';
import { AuctionLabel } from '../../components/detailed_ad/auction';
import { DealLabel } from '../../components/detailed_ad/deal';
import { isFinished } from '../../components/detailed_ad/faq';
import { Collapse } from 'react-collapse';
import { AdMainInfo } from '../../components/detailed_ad/table';
import { CardWithPadding } from '../../App';
import { openTab } from '../../services/_functions';
import Icon from './../../img/icon278.png';
import { PANEL_ADS, PANEL_CREATE, PANEL_ONE } from '../../store/router/panelTypes';
import { now } from 'moment';

let current_i = 0;

let uid = 0;

const col = '#00a550';
// const col = randomColor({
// 	luminosity: 'dark',
// });

export const deleteAlert = (deleteAd, closePopout) => (
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
				action: deleteAd,
			},
		]}
		onClose={closePopout}
	>
		<h2>Вы действительно хотите удалить объявление?</h2>
		<p>Отменить данное действие будет невозможно</p>
	</Alert>
);

const AddMore2r = (props) => {
	const { myID, dispatch, activeContext, story } = props;
	const {
		setIsSub,
		setIsAuthor,
		setIsHidden,
		setPage,
		setExtraInfo,
		openPopout,
		setFormData,
		updateContext,
		closePopout,
	} = props;
	const { setDummy, direction, AD } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState({});
	const [rAd, setrAd] = useState(AD);

	const [costRequestSuccess, setCostRequestSuccess] = useState(false);
	const [dealRequestSuccess, setDealRequestSuccess] = useState(false);
	const [subsRequestSuccess, setSubsRequestSuccess] = useState(false);
	const [detailsRequestSuccess, setDetailsRequestSuccess] = useState(false);

	useEffect(() => {
		const contextInfo = activeContext[story];
		setrAd({ ...AD, ...contextInfo });
		isNotValid();
		console.log('addInfo is ', { ...AD, ...contextInfo });
	}, [AD, props.activeContext[props.story]]);

	const [componentStatus, setComponentStatus] = useState();
	useEffect(() => {
		const { isAuthor, isDealer, dealer, deal, status, hidden } = rAd;

		setComponentStatus(
			showStatus(
				status,
				isDealer,
				isAuthor,
				dealer,
				hidden,
				() =>
					acceptDeal(
						deal.deal_id,
						(v) => setPage(PANEL_ADS),
						(e) => {
							console.log('acceptDeal err', e);
						}
					),
				() =>
					denyDeal(
						deal.deal_id,
						(v) => setPage(PANEL_ADS),
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
		const { category, subcat_list, subcat, hidden } = rAd;

		if (hidden) {
			setComponentCategories();
			return;
		}
		setComponentCategories(
			<TagsLabel
				tags={[tag(category, col, null, col), tag(subcat_list, col, null, col), tag(subcat, col, null, col)]}
			/>
		);
	}, [rAd]);

	const [componentPhotoSwipe, setComponentPhotoSwipe] = useState();
	useEffect(() => {
		setComponentPhotoSwipe(
			<PhotoSwipe isOpen={isOpen} items={localPhotos} options={options} onClose={handleClose} />
		);
	}, [localPhotos, isOpen, options]);

	const [componentImages, setComponentImages] = useState();
	useEffect(() => {
		const { header, text, hidden, isAuthor } = rAd;
		let pathes_to_photo = rAd.pathes_to_photo || [];
		pathes_to_photo = pathes_to_photo.filter((img) => img.PhotoUrl != Icon);
		if (hidden && !isAuthor) {
			setComponentImages(
				<Placeholder icon={<Icon56HideOutline />} header="Информация скрыта">
					Содержание объявления доступно только автору и модераторам, пока объявление не пройдёт проверку.
				</Placeholder>
			);
			return;
		}

		const rcell = (
			<Cell multiline description={<AnimateOnChange>{text}</AnimateOnChange>}>
				<Subhead weight="bold">{header}</Subhead>
			</Cell>
		);
		const imgDivs =
			pathes_to_photo.length == 0 ? (
				rcell
			) : (
				<Group header={rcell}>
					<CardScroll>
						<div
							style={{
								display: 'flex',
								overflowX:
									props.platform == 'desktop_web' || props.platform == 'mobile_web' ? 'auto' : null,
							}}
						>
							{pathes_to_photo.map((img, i) => (
								<Card
									key={i}
									size="s"
									key={i}
									onClick={() => {
										openImage(imgs, i);
									}}
									style={{ cursor: 'pointer' }}
								>
									<ImageCache
										className="details-card-img"
										spinnerClassName="details-card-img-spinner"
										url={img.PhotoUrl}
									/>
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

		setComponentImages(
			<div
				style={{
					display: 'block',
					flex: 1,
					maxWidth: width < 500 ? null : '' + width / 2 + 'px',
				}}
			>
				{CardWithPadding(
					<div style={{ paddingBottom: pathes_to_photo.length == 0 ? null : '12px', paddingRight: '12px' }}>
						{imgDivs}
					</div>,
					'outline'
				)}
			</div>
		);
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
		return (
			rAd == null ||
			rAd.ad_id == null ||
			rAd.ad_id == AD_LOADING.ad_id ||
			rAd.ad_id == AdDefault.ad_id
		);
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
		updateContext({ isSub: isSubs });
	}

	useEffect(() => {
		let cancelFunc = false;

		const routerAd = props.activeContext[props.story];
		console.log('routerAd create', routerAd);
		if (!routerAd || isNaN(routerAd.ad_id)) {
			return;
		}
		setExtraInfo(routerAd);
		const init = () => () => {
			const id = routerAd.ad_id;
			console.log('wtf is', myID, routerAd);

			setDealRequestSuccess(false);
			updateDealInfo(
				(deal, isDealer, dealer) => {
					if (cancelFunc) {
						return;
					}
					setDealRequestSuccess(true);
					updateContext({ deal, isDealer, dealer });
				},
				() => {
					if (cancelFunc) {
						return;
					}
					setDealRequestSuccess(true);
					updateContext({ deal: null, isDealer: false, dealer: null });
				}
			);

			setSubsRequestSuccess(false);
			updateSubs(
				(subs) => {
					if (cancelFunc) {
						return;
					}
					updateContext({ subs });
					setSubsRequestSuccess(true);
				},
				() => {
					if (cancelFunc) {
						return;
					}
					updateContext({ subs: [] });
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
					details.isSub = details.is_subscriber;
					details.isAuthor = details.author.vk_id == myID;
					details.ad_type = details.ad_type || TYPE_CHOICE;
					details.cost = details.cost || 0;
					console.log('loook at details', details);
					updateContext(details);
					setExtraInfo(details, myID, true);
					setIsAuthor(details.author.vk_id == myID);
					setCostRequestSuccess(false);
					updateCost(
						details.is_subscriber,
						(cost) => {
							console.log('cost is', cost);
							if (cancelFunc) {
								return;
							}
							updateContext({ cost });
							setCostRequestSuccess(true);
						},
						() => {
							if (cancelFunc) {
								return;
							}
							updateContext({ cost: 0 });
							setCostRequestSuccess(false);
						}
					);
					setDetailsRequestSuccess(true);
					details.isAuthor = details.author.vk_id == myID;
					//setrAd(details);
				},
				(e) => {
					if (cancelFunc) {
						return;
					}
					props.goBack();
					fail('объявление удалено или ещё не создано');
					setIsAuthor(false);
					setDetailsRequestSuccess(true);
				}
			);
		};
		if (props.activePanels[props.story] != PANEL_ONE) {
			return
		}
		if (direction == DIRECTION_FORWARD) {
			dispatch(init());
		} else {
			setCostRequestSuccess(true);
			setDealRequestSuccess(true);
			setSubsRequestSuccess(true);
			setDetailsRequestSuccess(true);
		}

		return () => {
			cancelFunc = true;
		};
	}, [props.activeContext[props.story].ad_id]);

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
			ad_id,
			() => sub(ad_id),
			(v) => changeIsSub(false)
		);
	}

	function sub(ad_id) {
		subscribe(
			ad_id,
			() => unsub(ad_id),
			(v) => changeIsSub(true)
		);
	}

	const [subButton, setSubButton] = useState(<></>);
	useEffect(() => {
		const { isDealer, status, isAuthor, isSub, cost, hidden } = rAd;
		if (hidden) {
			setSubButton(<></>);
			return;
		}
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
				style={{ cursor: disabled ? null : 'pointer', padding: '5px', margin: '0px', flex: 1 }}
			>
				<div
					style={{
						color: color,
						margin: 'auto',
					}}
				>
					<div style={{ display: 'inline-block' }}>{icon}</div>
					<Caption level="1">{text}</Caption>
				</div>
			</Button>
		);
	}

	const [componentCommentsValid, setComponentCommentsValid] = useState(true);
	const [componentComments, setComponentComments] = useState();
	useEffect(() => {
		if (isNotValid()) {
			return;
		}
		const ad = rAd;

		const { comments_enabled, hidden, isAuthor } = ad;
		if (hidden) {
			if (!isAuthor) {
				setComponentComments();
			} else {
				setComponentComments(
					<Placeholder icon={<Icon56HideOutline />} header="Комментарии недоступны">
						Доступ к комментариям откроется, когда объявление станет видимым
					</Placeholder>
				);
			}
			setComponentCommentsValid(false);
			return;
		}
		let v = <Placeholder icon={<Icon56WriteOutline />} header="Комментарии закрыты"></Placeholder>;
		if (comments_enabled) {
			v = <Comments mini={true} amount={1} maxAmount={1} openUser={props.setProfile} />;
			setComponentCommentsValid(true);
		} else {
			setComponentCommentsValid(false);
		}
		setComponentComments(<Card mode="outline">{v}</Card>);
	}, [rAd]);

	const [componentChosenSub, setComponentChosenSub] = useState();
	useEffect(() => {
		const { ad_type, ad_id, hidden, isAuthor } = rAd;
		if (hidden) {
			if (!isAuthor) {
				setComponentChosenSub();
			} else {
				setComponentChosenSub(
					<Placeholder icon={<Icon56HideOutline />} header="Подписчики скрыты">
						Список подписчиков недоступен, пока объявление находится на модерации
					</Placeholder>
				);
			}
			return;
		}

		setComponentChosenSub(
			<Card mode="outline">
				<div style={{ flex: 1 }}>
					{ad_type == TYPE_AUCTION ? (
						<AuctionLabel unsub={() => unsub(ad_id)} sub={() => sub(ad_id)} />
					) : (
						<DealLabel
							dealRequestSuccess={dealRequestSuccess}
							unsub={() => unsub(ad_id)}
							sub={() => sub(ad_id)}
						/>
					)}
				</div>
			</Card>
		);
	}, [rAd, dealRequestSuccess, costRequestSuccess]);

	const [componentAuthor, setComponentAuthor] = useState();
	useEffect(() => {
		const { author } = rAd;
		const creation_date = rAd.creation_date || now();
		setComponentAuthor(
			<Cell
				onClick={() => props.setProfile(author.vk_id)}
				before={<Avatar style={{ margin: '0px', padding: '0px' }} size={40} src={author.photo_url} />}
				description={time(creation_date)}
				style={{ cursor: 'pointer', marginBottom: '0px', paddingBottom: '0px' }}
			>
				<div style={{ display: 'flex', margin: '0px', padding: '0px' }}>
					{author.name + ' ' + author.surname}{' '}
				</div>
			</Cell>
		);
	}, [rAd]);

	const [secondaryInfo, setSecondaryInfo] = useState(<></>);
	useEffect(() => {
		const { hidden, isAuthor } = rAd;
		if (hidden && !isAuthor) {
			setSecondaryInfo(<></>);
			return;
		}
		let pathes_to_photo = rAd.pathes_to_photo || [];
		pathes_to_photo = pathes_to_photo.filter((img) => img.PhotoUrl != Icon);
		setSecondaryInfo(
			<div style={{ display: 'block', flex: 1, marginTop: pathes_to_photo.length > 0 ? '8px' : null }}>
				{CardWithPadding(
					<>
						<Div>{componentCategories}</Div>
						<AdMainInfo />{' '}
					</>,
					'outline'
				)}
			</div>
		);
	}, [componentCategories, rAd]);

	const [allActions, setAllActions] = useState();
	useEffect(() => {
		const { isAuthor, author, isDealer, isSub, status, hidden, ad_id } = rAd;

		const disabled = isFinished(status);
		const alert = deleteAlert(() => deleteAd(ad_id, props.refresh), closePopout);
		let buttons = [
			buttonAction(<Icon24Write />, 'Изменить', onEditClick, null, disabled),
			// <AnimateOnChange>
			// <AnimationChange
			// 	ignoreFirst={true}
			// 	visibleFirst={true}
			// 	mayTheSame={true}
			// 	controll={buttonAction(
			// 		hidden ? <Icon24Globe /> : <Icon24Hide />,
			// 		hidden ? 'Открыть' : 'Скрыть',
			// 		() => {
			// 			hidden ? adVisible(ad_id, () => setIsHidden(false)) : adHide(ad_id, () => setIsHidden(true));
			// 		},
			// 		null,
			// 		disabled
			// 	)}
			// />,

			// </AnimateOnChange>,
			buttonAction(<Icon24ShareExternal />, 'Поделиться', shareInVK, null, hidden),
			buttonAction(
				<Icon24Delete style={{ color: 'var(--destructive)' }} />,
				'Удалить',
				() => openPopout(alert),
				true,
				disabled
			),
		];
		if (!isAuthor) {
			const helpBtn = buttonAction(
				<Icon28Messages />,
				'Связаться с автором',
				() => {
					openTab('https://vk.com/im?sel=' + author.vk_id);
				},
				null,
				hidden
			);

			buttons = (
				// <div style={{ display: width < 330 ? 'block' : 'flex' }}>
				// 	<div className="flex-center">
				// 		{subBtn}
				// 		{helpBtn}
				// 	</div>

				<div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
					{helpBtn}
					{buttonAction(<Icon24ShareExternal />, 'Поделиться', shareInVK, null, hidden)}
					{buttonAction(<Icon24Report />, 'Пожаловаться', () => {
						openTab('https://vk.com/im?media=&sel=-194671970'), null, hidden;
					})}
				</div>
			);
		}

		setAllActions(CardWithPadding(<div className="flex-center">{buttons}</div>, 'outline'));
	}, [rAd, subButton, costRequestSuccess]);

	function onEditClick() {
		setFormData(story + EDIT_MODE, {
			mode: true,
		});

		setFormData(story + FORM_LOCATION_CREATE, {
			country: { id: 1, title: rAd.region },
			city: { id: 1, title: rAd.district },
		});
		setFormData(story + CREATE_AD_ITEM, {
			name: rAd.header,
			description: rAd.text,
			photosUrl: rAd.pathes_to_photo,
		});
		setFormData(story + FORM_CREATE, {
			category: rAd.category,
			subcategory: rAd.subcat_list,
			incategory: rAd.subcat,
		});

		setFormData(story + CREATE_AD_MAIN, {
			type: rAd.ad_type,
			ls_enabled: rAd.ls_enabled,
			comments_enabled: rAd.comments_enabled,
		});

		setPage(PANEL_CREATE);
	}

	if (isNotValid(AD)) {
		return (
			<Placeholder stretched header="Загрузка объявления">
				<Spinner size="large" />
			</Placeholder>
		);
	}

	return (
		<div>
			<Collapse isOpened={componentStatus}>{componentStatus}</Collapse>
			{componentAuthor}
			{componentPhotoSwipe}
			<div style={{ display: width < 500 ? 'block' : 'flex' }}>
				{componentImages}

				{width < 500 ? allActions : null}

				{secondaryInfo}
			</div>

			<>
				{width < 500 ? null : allActions}

				<div
					style={{
						display: width < 500 ? 'block' : 'flex',
					}}
				>
					<div style={{ flex: 1, padding: '4px' }}>{componentChosenSub}</div>
					<div style={{ flex: 1, padding: '4px', paddingTop: componentCommentsValid ? '12px' : '4px' }}>
						{componentComments}
					</div>
				</div>
			</>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		AD: state.ad,
		direction: state.router.direction,
		myID: state.vkui.myID,
		platform: state.vkui.platform,

		story: state.router.activeStory,
		activeContext: state.router.activeContext,
		activePanels:  state.router.activePanels,
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
				getDetails,
				goBack,
				acceptDeal,
				denyDeal,
				updateContext,

				setIsSub,

				setIsHidden,
				setIsAuthor,
				setExtraInfo,

				setFormData,

				openPopout,

				closePopout,
			},
			dispatch
		),
	};
};

const AddMore2 = connect(mapStateToProps, mapDispatchToProps)(AddMore2r);

export default AddMore2;

// 857 -> 936 -> 838 -> 923 -> 1016 -> 935 -> 987 -> 897 -> 953 -> 899
// 830 -> 780 -> 756 -> 841
