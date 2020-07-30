import React, { useState, useEffect } from 'react';
import {
	View,
	Panel,
	PanelHeader,
	Epic,
	Tabbar,
	PanelHeaderBack,
	TabbarItem,
	ScreenSpinner,
	ConfigProvider,
} from '@vkontakte/vkui';

import { STORY_ADS, STORY_CREATE } from './../store/router/storyTypes';
import {
	PANEL_ADS,
	PANEL_ONE,
	PANEL_USER,
	PANEL_SUBS,
	PANEL_COMMENTS,
	PANEL_CREATE,
	PANEL_CATEGORIES,
	PANEL_SUBCATEGORIES,
	PANEL_SUBSUBCATEGORIES,
	PANEL_CITIES,
	PANEL_COUNTRIES,
	PANEL_MAP,
	PANEL_ABOUT,
	PANEL_FAQ,
	PANEL_ADVICES,
	PANEL_LICENCE,
} from './../store/router/panelTypes';

import { MODAL_ADS_FILTERS, MODAL_ADS_GEO } from './../store/router/modalTypes';

import './main.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	goBack,
	setStory,
	openModal,
	setProfile,
	setAd,
	addProfile,
	openPopout,
	setPage,
} from '../store/router/actions';
import * as VK from '../services/VK';
import { setAppID, setPlatform } from '../store/vk/actions';

import {
	addComment,
	addSub,
	setStatus,
	setExtraInfo,
	setToHistory,
	clearAds,
	backToPrevAd,
} from '../store/detailed_ad/actions';

import CategoriesPanel from './../components/categories/panel';
import Countries from './../components/location/countries';
import Cities from './../components/location/cities';
import { FORM_LOCATION_CREATE } from './../components/location/redux';

import Subs from './story/adds/tabs/subs/subs';

import AddsTabs from './story/adds/AddsTabs';
import Create from './../containers/create/create';

import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28Add from '@vkontakte/icons/dist/28/add_outline';

import {
	handleNotifications,
	NT_COMMENT,
	NT_RESPOND,
	NT_STATUS,
	NT_AD_STATUS,
	NT_CLOSE,
} from './story/adds/tabs/notifications/notifications';

import AddMore2 from './template/AddMore2';

import { GEO_TYPE_FILTERS, AdDefault, STATUS_OFFER, STATUS_CHOSEN } from './../const/ads';

import { Auth, getToken, fail, getNotificationCounter } from '../requests';

import Error from './placeholders/error';
import NotHere from './placeholders/NotHere';

import { AddrWS } from '../store/addr_ws';

import Comments from './story/adds/tabs/comments/comments';

import { inputArgs } from '../utils/window';

import Centrifuge from 'centrifuge';
import { FORM_CREATE, FORM_CREATE_B } from '../components/categories/redux';
import { setFormData } from '../store/create_post/actions';
import { ADS_FILTERS, EDIT_MODE, CREATE_AD_MAIN, CREATE_AD_ITEM, ADS_FILTERS_B } from '../store/create_post/types';
import AdsModal from '../containers/ads/modal';
import { defaultInputData } from '../components/create/default';
import { updateDealInfo } from '../store/detailed_ad/update';
import { store } from '..';
import AdMap from '../containers/location/map';

import ProfilePanel from './profile';
import AboutPanel from './about';
import FAQPanel from './faq';
import AdvicePanel from './advice';
import LicencePanel from './licence';
import SubcategoriesPanel from '../components/categories/subcategory_panel';
import { DIRECTION_BACK, DIRECTION_FORWARD } from '../store/router/directionTypes';
import { pushToCache } from '../store/cache/actions';

const adsText = 'Объявления';
const addText = 'Создать обьявление';
const profileText = 'Профиль';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

let notsCounterrr = 0;

const App = (props) => {
	const { colorScheme, myUser, myID, inputData, AD } = props;
	const { activeStory, activePanels, panelsHistory, popouts, snackbars, scrollPosition, activeAd } = props;
	const {
		goBack,
		setAd,
		setStory,
		setProfile,
		setStatus,
		openModal,
		addProfile,
		setFormData,
		openPopout,
		addComment,
		addSub,
		clearAds,
		setPage,
	} = props;

	const needEdit = inputData[EDIT_MODE] ? inputData[EDIT_MODE].mode : false;

	const adPopout = popouts[STORY_ADS];
	const createPopout = popouts[STORY_CREATE];

	const [inited, setInited] = useState(false);

	const [notsCounterr, setNotsCounterr] = useState(notsCounterr);

	const [deleteID, SetDeleteID] = useState(-1);

	const historyLen = panelsHistory ? (panelsHistory[STORY_ADS] ? panelsHistory[STORY_ADS].length : 0) : 0;

	function dropFilters() {
		store.dispatch(setFormData(ADS_FILTERS, null));
	}

	const onStoryChange = (e) => {
		const isProfile = e.currentTarget.dataset.text == profileText;
		const story = e.currentTarget.dataset.story;
		if (story == STORY_CREATE) {
			setStory(story);
			setFormData(EDIT_MODE, null);
			setFormData(FORM_LOCATION_CREATE, {
				...inputData[FORM_LOCATION_CREATE],
				country: myUser.country,
				city: myUser.city,
			});
			setFormData(FORM_CREATE, null);
			setFormData(CREATE_AD_MAIN, { ...defaultInputData });
			setFormData(CREATE_AD_ITEM, { ...defaultInputData });
		} else {
			setStory(story, isProfile ? PANEL_USER : null);
			if (story == STORY_ADS) {
				clearAds();
			}
		}

		addProfile(myID);
		if (e.currentTarget.dataset.story == STORY_ADS) {
			if (isProfile) {
			} else {
				dropFilters();
			}
		}
	};

	function scrollWindow(to) {
		var scrolledSoFar = window.scrollY;
		var scrollEnd = to;
		if (scrolledSoFar == scrollEnd) {
			return;
		}
		var timerID = setInterval(function () {
			window.scrollTo(0, scrollEnd);
			if (scrolledSoFar != window.scrollY && scrollEnd <= window.scrollY) {
				clearInterval(timerID);
			}
		}, 10);
	}
	useEffect(() => {
		if (props.direction == DIRECTION_BACK) {
			scrollWindow(scrollPosition.y);
		} else {
			scrollWindow(0);
		}
	}, [scrollPosition]);

	useEffect(() => {
		if (props.from == PANEL_SUBS || props.to == PANEL_SUBS) {
			return;
		}
		if (props.from == PANEL_ONE || props.to == PANEL_ONE) {
			if (props.direction == DIRECTION_BACK) {
				props.backToPrevAd();
			} else {
				store.dispatch(setToHistory());
			}
		}
	}, [props.from]);

	const [addsTabs, setAddsTabs] = useState(<></>);
	useEffect(() => {
		const v = (
			<AddsTabs
				notsCounter={notsCounterrr}
				zeroNots={() => {
					notsCounterrr = 0;
				}}
				refresh={SetDeleteID}
				deleteID={deleteID}
				openUser={setProfile}
				dropFilters={dropFilters}
				openAd={setReduxAd}
			/>
		);
		setAddsTabs(v);
	}, []);

	const [notHere, setNotHere] = useState(false);
	const [subscription, setSubscription] = useState(null);

	function turnOnNotifications(id) {
		console.log('user#' + id);

		centrifuge.subscribe('user#' + id, (note) => {
			notsCounterrr++;
			console.log('note.data ', note);
			setNotsCounterr(notsCounterrr);
			const noteType = note.data.notification_type;
			const noteAdId = note.data.payload.ad.ad_id;

			const ad = store.getState().ad;

			console.log('noteAdId ', noteType, noteAdId, ad, NT_STATUS);

			if (ad.ad_id == noteAdId) {
				switch (noteType) {
					case NT_RESPOND: {
						const noteValue = note.data.payload.author;
						addSub(noteValue);
					}
				}
			}
			handleNotifications(note);
		});
	}

	useEffect(() => {
		if (AD.ad_id <= 0) {
			return;
		}

		if (subscription) {
			subscription.unsubscribe();
			subscription.removeAllListeners();
		}
		setSubscription(
			centrifuge.subscribe('ad_' + AD.ad_id, (note) => {
				const noteType = note.data.type;
				const noteValue = note.data.payload;
				console.log('look at', noteType, noteValue);
				switch (noteType) {
					case NT_COMMENT: {
						addComment(noteValue);
						break;
					}
					case NT_CLOSE: {
						setStatus(STATUS_CHOSEN);
						updateDealInfo();
						break;
					}
					case NT_AD_STATUS: {
						const noteValue = note.data.payload.new_status;
						console.log('noteValue ', noteValue);
						setStatus(noteValue);
						if (noteValue == STATUS_CHOSEN) {
							updateDealInfo();
						}
						break;
					}
				}
				console.log('centrifugu notenote', note);
			})
		);
	}, [AD.ad_id]);

	useEffect(() => {
		getNotificationCounter(
			(r) => {
				console.log('r.data.number', r.number);
				notsCounterrr = r.number;
				setNotsCounterr(r.number);
			},
			(e) => {
				console.log('some error happened', e);
			}
		);
	}, []);

	useEffect(() => {
		openPopout(<ScreenSpinner size="large" />);
		const { dispatch } = props;
		dispatch(VK.initApp());

		const { vk_platform, app_id, hash } = inputArgs();
		if (!app_id) {
			setInited(true);
			setNotHere(true);
			return;
		}

		if (hash) {
			setReduxAd({ ad_id: Number(hash) });
		}

		dispatch(setPlatform(vk_platform));
		dispatch(setAppID(app_id));
		dispatch(VK.getAuthToken());

		window.history.pushState({ currPanel: PANEL_ADS, ad: AdDefault }, PANEL_ADS);
		window.onpopstate = function (event) {
			goBack();
		};

		dispatch(
			VK.getuser((us) => {
				Auth(
					us,
					(v) => {
						setInited(true);
						dispatch(addProfile(us.id));
						getToken((v) => {
							centrifuge.setToken(v.token);
							centrifuge.connect();
							turnOnNotifications(us.id);
						});
					},
					(e) => {
						fail('Не удалось получить ваши данные');
					}
				);
				return us;
			})
		);
	}, []);

	function setReduxAd(ad) {
		store.dispatch(setExtraInfo(ad));
		setAd(ad);
	}

	function backToAdsFilters() {
		goBack();
		openModal(MODAL_ADS_FILTERS);
	}

	function backToGeoFilters() {
		backToAdsFilters();
		openModal(MODAL_ADS_GEO, DIRECTION_BACK);
	}

	let adPanels = panelsHistory[STORY_ADS];
	let adActivePanel = activePanels[STORY_ADS];

	let createPanels = panelsHistory[STORY_CREATE];
	let createActivePanel = activePanels[STORY_CREATE];
	let choosen = activeAd;

	if (!inited) {
		console.log("lock lock lock3")
		return <ScreenSpinner size="large" />;
	}

	if (notHere) {
		return <NotHere />;
	}

	return (
		<ConfigProvider isWebView={true} scheme={colorScheme}>
			<Epic
				activeStory={activeStory}
				tabbar={
					<Tabbar>
						<TabbarItem
							onClick={onStoryChange}
							selected={activeStory === STORY_ADS && adActivePanel != PANEL_USER}
							data-story={STORY_ADS}
							data-text={adsText}
							text={adsText}
							label={notsCounterrr == 0 ? null : notsCounterrr}
							// after={notsCounter == 0 ? '' : <Counter>notsCounter</Counter>}
						>
							<Icon28NewsfeedOutline onClick={onStoryChange} />
						</TabbarItem>

						<TabbarItem
							onClick={onStoryChange}
							data-text={addText}
							selected={activeStory === STORY_CREATE}
							data-story={STORY_CREATE}
							text={addText}
						>
							<Icon28Add onClick={onStoryChange} />
						</TabbarItem>
						<TabbarItem
							onClick={onStoryChange}
							selected={activeStory === STORY_ADS && adActivePanel == PANEL_USER}
							data-story={STORY_ADS}
							data-text={profileText}
							text={profileText}
						>
							<Icon28User onClick={onStoryChange} />
						</TabbarItem>
					</Tabbar>
				}
			>
				<View
					popout={adPopout}
					id={STORY_ADS}
					activePanel={adActivePanel}
					onSwipeBack={goBack}
					history={adPanels}
					modal={<AdsModal />}
					header={false}
				>
					<Panel id={PANEL_ADS} separator={false}>
						{addsTabs}
						{snackbars[PANEL_ADS]}
					</Panel>
					<Panel id={PANEL_ONE}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
							<p className="panel-header">Объявление</p>
							{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
						</PanelHeader>
						{choosen ? (
							<AddMore2
								refresh={(id) => {
									setStory(STORY_ADS, PANEL_ADS);
									SetDeleteID(id);
								}}
							/>
						) : (
							Error
						)}
						{snackbars[PANEL_ONE]}
					</Panel>
					<Panel id={PANEL_USER}>
						<ProfilePanel setReduxAd={setReduxAd} />
					</Panel>
					<Panel id={PANEL_ABOUT}>
						<AboutPanel />
					</Panel>
					<Panel id={PANEL_FAQ}>
						<FAQPanel />
					</Panel>
					<Panel id={PANEL_ADVICES}>
						<AdvicePanel />
					</Panel>
					<Panel id={PANEL_LICENCE}>
						<LicencePanel />
					</Panel>
					<Panel id={PANEL_COMMENTS}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
							<p className="panel-header">Комментарии</p>
							{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
						</PanelHeader>
						{choosen ? <Comments amount={5} maxAmount={-1} openUser={setProfile} /> : Error}
						{snackbars[PANEL_COMMENTS]}
					</Panel>
					<Panel id={PANEL_SUBS}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
							<p className="panel-header">Откликнувшиеся</p>
							{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
						</PanelHeader>
						{choosen ? <Subs openUser={setProfile} amount={5} maxAmount={-1} /> : Error}
						{snackbars[PANEL_SUBS]}
					</Panel>
					<Panel id={PANEL_CATEGORIES}>
						<CategoriesPanel redux_form={ADS_FILTERS_B} goBack={backToAdsFilters} />
					</Panel>
					<Panel id={PANEL_SUBCATEGORIES}>
						<SubcategoriesPanel
							goNext={() => {
								setPage(PANEL_SUBSUBCATEGORIES);
							}}
							goBack={goBack}
							redux_form={ADS_FILTERS_B}
						/>
					</Panel>
					<Panel id={PANEL_SUBSUBCATEGORIES}>
						<SubcategoriesPanel
							goNext={() => {
								props.pushToCache(true, 'ignore_cache');
								goBack();
								goBack();
								goBack();
								// openModal(MODAL_ADS_FILTERS);
							}}
							goBack={goBack}
							redux_form={ADS_FILTERS_B}
							redux_main_form={ADS_FILTERS}
						/>
					</Panel>
					<Panel id={PANEL_COUNTRIES}>
						<PanelHeader left={<PanelHeaderBack onClick={backToGeoFilters} />}>Выберите страну</PanelHeader>
						<Countries goBack={backToGeoFilters} redux_form={ADS_FILTERS_B} />
					</Panel>
					<Panel id={PANEL_CITIES}>
						<PanelHeader left={<PanelHeaderBack onClick={backToGeoFilters} />}>Выберите город</PanelHeader>
						<Cities goBack={backToGeoFilters} redux_form={ADS_FILTERS_B} />
					</Panel>
					<Panel id={PANEL_MAP}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>Местоположение</PanelHeader>
						<AdMap max={true} />
					</Panel>
				</View>

				<View
					id={STORY_CREATE}
					activePanel={createActivePanel}
					popout={createPopout}
					onSwipeBack={goBack}
					history={createPanels}
				>
					<Panel id={PANEL_CREATE}>
						<PanelHeader left={historyLen <= 1 ? null : <PanelHeaderBack onClick={goBack} />}>
							{needEdit ? 'Редактировать' : addText}
						</PanelHeader>
						<Create />
						{snackbars[PANEL_CREATE]}
					</Panel>
					<Panel id={PANEL_LICENCE}>
						<LicencePanel />
					</Panel>
					<Panel id={PANEL_CATEGORIES}>
						<CategoriesPanel redux_form={FORM_CREATE_B} goBack={goBack} />
					</Panel>
					<Panel id={PANEL_SUBCATEGORIES}>
						<SubcategoriesPanel
							goNext={() => {
								setPage(PANEL_SUBSUBCATEGORIES);
							}}
							goBack={goBack}
							redux_form={FORM_CREATE_B}
						/>
					</Panel>
					<Panel id={PANEL_SUBSUBCATEGORIES}>
						<SubcategoriesPanel
							goNext={() => setPage(PANEL_CREATE)}
							goBack={goBack}
							redux_form={FORM_CREATE_B}
							redux_main_form={FORM_CREATE}
						/>
					</Panel>

					<Panel id={PANEL_COUNTRIES}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>Выберите страну</PanelHeader>
						<Countries redux_form={FORM_LOCATION_CREATE} goBack={goBack} />
					</Panel>
					<Panel id={PANEL_CITIES}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>Выберите город</PanelHeader>
						<Cities redux_form={FORM_LOCATION_CREATE} goBack={goBack} />
					</Panel>
				</View>
			</Epic>
		</ConfigProvider>
	);
};

const mapStateToProps = (state) => {
	return {
		activePanels: state.router.activePanels,
		activeStory: state.router.activeStory,
		panelsHistory: state.router.panelsHistory,
		activeModals: state.router.activeModals,
		activeAd: state.router.activeAd,
		popouts: state.router.popouts,
		scrollPosition: state.router.scrollPosition,
		scrollHistory: state.router.scrollHistory,

		profileHistory: state.router.profileHistory,
		activeProfile: state.router.activeProfile,
		snackbars: state.router.snackbars,
		inputData: state.formData.forms,

		AD: state.ad,

		colorScheme: state.vkui.colorScheme,
		myID: state.vkui.myID,
		myUser: state.vkui.myUser,
		direction: state.router.direction,
		from: state.router.from,
		to: state.router.to,
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators(
			{
				setStory,
				setProfile,
				setAd,
				goBack,
				openModal,
				addProfile,
				setFormData,
				openPopout,
				addComment,
				addSub,
				setStatus,
				clearAds,
				setPage,
				pushToCache,

				setToHistory,
				backToPrevAd,
			},
			dispatch
		),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// 477 -> 516 -> 674 -> 703 -> 795 -> 749 -> 587 -> 524 -> 583
// 722 -> 645
