import React, { useState, useEffect, useCallback } from 'react';
import { useMutex } from 'react-context-mutex';
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
	Card,
} from '@vkontakte/vkui';

import { STORY_ADS, STORY_CREATE, STORY_NOTIFICATIONS, STORY_PROFILE } from './store/router/storyTypes';
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
	PANEL_NOTIFICATIONS,
	PANEL_CATEGORIES_B,
	PANEL_SUBCATEGORIES_B,
	PANEL_SUBSUBCATEGORIES_B,
} from './store/router/panelTypes';

import { MODAL_ADS_FILTERS, MODAL_ADS_GEO } from './store/router/modalTypes';

import './panels/main.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	goBack,
	setStory,
	openModal,
	setProfile,
	setAd,
	openPopout,
	setPage,
	setStoryProfile,
	updateContext,
	closeDummy,
} from './store/router/actions';
import * as VK from './services/VK';
import { setAppID, setPlatform } from './store/vk/actions';

import { setExtraInfo, setToHistory, clearAds, backToPrevAd } from './store/detailed_ad/actions';

import CategoriesPanel from './components/categories/panel';
import Countries from './components/location/countries';
import Cities from './components/location/cities';
import { FORM_LOCATION_CREATE } from './components/location/redux';

import Subs from './panels/story/adds/tabs/subs/subs';

import AddsTabs from './panels/story/adds/AddsTabs';
import Create from './containers/create/create';

import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28Add from '@vkontakte/icons/dist/28/add_outline';
import Icon28Notification from '@vkontakte/icons/dist/28/notification';

import {
	handleNotifications,
	NT_COMMENT_NEW,
	NT_COMMENT_EDIT,
	NT_RESPOND,
	NT_STATUS,
	NT_AD_STATUS,
	NT_CLOSE,
	NT_SUB_CANCEL,
	NT_COMMENT_DELETED,
	NT_UNSUB,
	NT_SUB,
	NT_MAX_BID,
	NT_FULFILL,
} from './panels/story/adds/tabs/notifications/notifications';

import AddMore2 from './panels/template/AddMore2';

import Notifications from './panels/story/adds/tabs/notifications/notifications';

import { AdDefault, STATUS_CHOSEN, STATUS_CLOSED, STATUS_ABORTED } from './const/ads';

import { Auth, getToken, fail, getNotificationCounter } from './requests';

import Error from './panels/placeholders/error';
import NotHere from './panels/placeholders/NotHere';

import { AddrWS } from './store/addr_ws';

import Comments from './panels/story/adds/tabs/comments/comments';

import { inputArgs } from './utils/window';

import Centrifuge from 'centrifuge';
import { FORM_CREATE, FORM_CREATE_B } from './components/categories/redux';
import { setFormData } from './store/create_post/actions';
import { ADS_FILTERS, EDIT_MODE, CREATE_AD_MAIN, CREATE_AD_ITEM, ADS_FILTERS_B } from './store/create_post/types';
import AdsModal from './containers/ads/modal';
import { defaultInputData } from './components/create/default';
import { updateDealInfo } from './store/detailed_ad/update';
import { store } from '.';
import AdMap from './containers/location/map';

import ProfilePanel from './panels/profile';
import AboutPanel from './panels/about';
import FAQPanel from './panels/faq';
import AdvicePanel from './panels/advice';
import LicencePanel from './panels/licence';
import SubcategoriesPanel from './components/categories/subcategory_panel';
import { DIRECTION_BACK, DIRECTION_FORWARD } from './store/router/directionTypes';
import { pushToCache } from './store/cache/actions';
import { CategoryNo } from './components/categories/const';
import { EDIT_COMMENT } from './store/detailed_ad/actionTypes';
import { now } from 'moment';

const adsText = 'Объявления';
const notText = 'Уведомления';
const addText = 'Создать';
const profileText = 'Профиль';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

let notsCounterrr = 0;

export const scrollWindow = (to) => {
	let scrolledSoFar = window.scrollY;
	let scrollEnd = to;
	if (scrolledSoFar == scrollEnd) {
		return;
	}
	let repeat = 10;
	let timerID = setInterval(function () {
		repeat--;
		window.scrollTo(0, scrollEnd);
		if (repeat <= 0 || (scrolledSoFar != window.scrollY && scrollEnd <= window.scrollY)) {
			clearInterval(timerID);
		}
	}, 10);
};

let GO_BACK_DO = 0;

const App = (props) => {
	const { colorScheme, myUser, myID, inputData } = props;
	const { activeStory, activePanels, panelsHistory, panelsHistoryVKUI, popouts, snackbars, scrollPosition } = props;
	const {
		goBack,
		setAd,
		setStory,
		setStoryProfile,
		setProfile,
		openModal,
		setFormData,
		openPopout,

		clearAds,
		setPage,
		updateContext,
	} = props;

	const MutexRunner = useMutex();
	const mutex = new MutexRunner('GO_BACK');

	const adPopout = popouts[STORY_ADS];
	const createPopout = popouts[STORY_CREATE];
	const notsPopout = popouts[STORY_NOTIFICATIONS];
	const profilePopout = popouts[STORY_PROFILE];

	const [inited, setInited] = useState(false);

	const [notsCounterr, setNotsCounterr] = useState(notsCounterr);

	const [deleteID, SetDeleteID] = useState(-1);

	useEffect(() => {
		console.log('deleteID is', deleteID);
	}, [deleteID]);

	const historyLen = panelsHistory ? (panelsHistory[activeStory] ? panelsHistory[activeStory].length : 0) : 0;

	function dropFilters() {
		const mode = store.getState().formData.forms[activeStory + ADS_FILTERS].mode;
		store.dispatch(setFormData(activeStory + ADS_FILTERS, { mode }));
	}

	const onStoryChange = (e) => {
		const isProfile = e.currentTarget.dataset.text == profileText;
		const story = e.currentTarget.dataset.story;

		if (!story) {
			return;
		}

		if (story == STORY_CREATE) {
			setStory(story);
			if (story != activeStory) {
				return;
			}
			setFormData(activeStory + EDIT_MODE, null);
			setFormData(activeStory + FORM_LOCATION_CREATE, {
				...inputData[activeStory + FORM_LOCATION_CREATE],
				country: myUser.country,
				city: myUser.city,
			});

			setFormData(activeStory + FORM_CREATE, { category: CategoryNo });
			setFormData(activeStory + CREATE_AD_MAIN, defaultInputData);
			setFormData(activeStory + CREATE_AD_ITEM, defaultInputData);
			console.log('!!!!!!!!!!!! 2');
		} else {
			if (story == STORY_PROFILE) {
				setStoryProfile(myID);
				return;
			} else {
				setStory(story);
			}
			if (story != activeStory) {
				return;
			}

			if (story == STORY_ADS) {
				clearAds();
			}
		}

		if (story == STORY_ADS && story == activeStory) {
			if (isProfile) {
			} else {
				dropFilters();
			}
		}
	};

	useEffect(() => {
		console.log('props.panelsHistory are', props.panelsHistory);
	}, [props.panelsHistory]);

	useEffect(() => {
		if (props.direction == DIRECTION_BACK) {
			scrollWindow(scrollPosition.y);
		} else {
			scrollWindow(0);
		}
	}, [scrollPosition]);

	// useEffect(() => {
	// 	if (props.from == PANEL_SUBS || props.to == PANEL_SUBS) {
	// 		return;
	// 	}
	// 	if (props.from == PANEL_ONE || props.to == PANEL_ONE) {
	// 		if (props.direction == DIRECTION_BACK) {
	// 			props.backToPrevAd();
	// 		} else {
	// 			store.dispatch(setToHistory());
	// 		}
	// 	}
	// }, [props.from]);

	const [notHere, setNotHere] = useState(false);
	const [subscription, setSubscription] = useState(null);

	function turnOnNotifications(id) {
		console.log('user#' + id);

		centrifuge.subscribe('user#' + id, (note) => {
			notsCounterrr++;
			console.log('notsCounterrr', notsCounterrr);
			console.log('note.data ', note);
			setNotsCounterr(notsCounterrr);
			const noteType = note.data.notification_type;
			const noteAdId = note.data.payload.ad.ad_id;

			const router = store.getState().router;
			const ad = router.activeContext[router.activeStory];

			console.log('noteAdId ', noteType, noteAdId, ad, NT_STATUS);
			if (ad && ad.ad_id == noteAdId)
				if (noteType == NT_FULFILL) {
					console.log("noteType == NT_FULFILL")
					store.dispatch(updateContext({ status: STATUS_CLOSED }));
				} else if (noteType == NT_SUB_CANCEL) {
					console.log("noteType == NT_SUB_CANCEL")
					store.dispatch(updateContext({ status: STATUS_ABORTED }));
				}
			handleNotifications(note);
		});
	}

	const [saveId, setsaveId] = useState(-1);
	useEffect(() => {
		const ad = props.activeContext[props.activeStory];
		if (ad == null || ad.ad_id <= 0 || ad.ad_id == saveId) {
			return;
		}
		setsaveId(ad.ad_id);

		if (subscription) {
			subscription.unsubscribe();
			subscription.removeAllListeners();
		}
		console.log('look at ad', ad);
		setSubscription(
			centrifuge.subscribe('ad_' + ad.ad_id, (note) => {
				const noteType = note.data.type;
				const noteValue = note.data.payload;
				console.log('look at', note, noteType, noteValue);
				switch (noteType) {
					case NT_COMMENT_NEW: {
						const router = store.getState().router;
						let newComments = router.activeContext[router.activeStory].comments || [];
						newComments = [...newComments.filter((v) => v.comment_id != noteValue.comment_id), noteValue];

						updateContext({ comments: newComments });
						break;
					}
					case NT_COMMENT_EDIT: {
						const router = store.getState().router;
						let newComments = router.activeContext[router.activeStory].comments || [];
						console.log('before newComments', newComments);
						newComments = newComments.map((v) => {
							if (v.comment_id == noteValue.comment_id) {
								v.text = noteValue.text;
							}
							return v;
						});
						updateContext({ comments: newComments });
						break;
					}
					case NT_COMMENT_DELETED: {
						const router = store.getState().router;
						let newComments = router.activeContext[router.activeStory].comments || [];
						newComments = newComments.filter((v) => v.comment_id != noteValue.comment_id);

						updateContext({ comments: newComments });
						break;
					}
					case NT_MAX_BID: {
						updateContext({ cost: noteValue.new_bid + 1 });
						break;
					}
					case NT_SUB: {
						const router = store.getState().router;
						let newSubs = router.activeContext[router.activeStory].subs || [];
						newSubs = [...newSubs.filter((v) => v.vk_id != noteValue.user_id), noteValue];

						updateContext({ subs: newSubs, subscribers_num: newSubs.length });
						break;
					}
					case NT_UNSUB: {
						const router = store.getState().router;
						let newSubs = router.activeContext[router.activeStory].subs || [];
						newSubs = newSubs.filter((v, i) => {
							return v.vk_id != noteValue.user_id;
						});

						updateContext({ subs: newSubs, subscribers_num: newSubs.length });
						break;
					}
					case NT_CLOSE: {
						updateContext({ status: STATUS_CHOSEN });
						updateDealInfo();
						break;
					}
					case NT_SUB_CANCEL: {
						updateContext({ status: STATUS_CHOSEN });
						updateDealInfo();
						break;
					}
					case NT_AD_STATUS: {
						const noteValue = note.data.payload.new_status;
						updateContext({ status: noteValue });
						if (noteValue == STATUS_CHOSEN) {
							updateDealInfo();
						}
						break;
					}
				}
				console.log('centrifugu notenote', note);
			})
		);
	}, [props.activeContext[props.activeStory]]);

	const [tabbar, setTabbar] = useState(<></>);
	useEffect(() => {
		console.log('props.dummies', props.dummies);
		if (props.dummies[props.activeStory].length == 0) {
			setTabbar(
				<Tabbar>
					<TabbarItem
						style={{ cursor: 'pointer' }}
						onClick={onStoryChange}
						selected={activeStory === STORY_ADS}
						data-story={STORY_ADS}
						data-text={adsText}
						text={adsText}
					>
						<Icon28NewsfeedOutline style={{ cursor: 'pointer' }} onClick={onStoryChange} />
					</TabbarItem>

					<TabbarItem
						style={{ cursor: 'pointer' }}
						onClick={onStoryChange}
						data-text={addText}
						selected={activeStory === STORY_CREATE}
						data-story={STORY_CREATE}
						text={addText}
					>
						<Icon28Add onClick={onStoryChange} />
					</TabbarItem>
					<TabbarItem
						style={{ cursor: 'pointer' }}
						onClick={onStoryChange}
						data-text={notText}
						selected={activeStory === STORY_NOTIFICATIONS}
						data-story={STORY_NOTIFICATIONS}
						label={notsCounterrr == 0 ? null : notsCounterrr}
						text={notText}
					>
						<Icon28Notification style={{ cursor: 'pointer' }} onClick={onStoryChange} />
					</TabbarItem>
					<TabbarItem
						style={{ cursor: 'pointer' }}
						onClick={onStoryChange}
						selected={activeStory === STORY_PROFILE}
						data-story={STORY_PROFILE}
						data-text={profileText}
						text={profileText}
					>
						<Icon28User style={{ cursor: 'pointer' }} onClick={onStoryChange} />
					</TabbarItem>
				</Tabbar>
			);
		} else {
			setTabbar(null);
		}
	}, [props.dummies, activeStory, notsCounterrr]);

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
		// dispatch(VK.getAuthToken());

		window.history.pushState({ currPanel: PANEL_ADS, ad: AdDefault }, PANEL_ADS);
		window.onpopstate = function (event) {
			const router = store.getState().router;
			const story = [router.activeStory];
			const fromAdsFeed = router.panelsHistory[story] == PANEL_ADS;
			const fromCreateFeed = router.panelsHistory[story] == PANEL_CREATE;
			const context = router.activeContext[story];
			const dummies = router.dummies[story];
			console.log('dummies are', dummies);
			if (dummies.length > 0) {
				props.closeDummy();
				return;
			}
			console.log('context.goBack', context.goBack);

			const thisPanel = router.activePanels[router.activeStory];
			if (thisPanel == PANEL_CITIES) {
				goBack();
				openModal(MODAL_ADS_FILTERS);
				setTimeout(() => {
					openModal(MODAL_ADS_GEO, DIRECTION_BACK);
				}, 600);
				return;
			} else if (thisPanel == PANEL_CATEGORIES) {
				goBack();
				openModal(MODAL_ADS_FILTERS);
				return;
			}

			console.log('agaaa', context.goBack);
			if (context.goBack != undefined) {
				console.log('context.goBack done');
				context.goBack();
			} else {
				console.log('GO_BACK_DO do');
				mutex.lock();
				console.log('GO_BACK_DO do');
				GO_BACK_DO++;
				mutex.unlock();
			}
		};

		setInterval(() => {
			mutex.lock();
			if (GO_BACK_DO > 0) {
				console.log('goBack do', GO_BACK_DO);
				goBack();
				GO_BACK_DO--;
			}
			mutex.unlock();
		}, 500);

		// $(function(){
		// 	$('body').append('<form id="cookiesHackForm" action="http://example.com/" method="get"></form>');
		// 	$('#cookiesHackForm').submit();
		// });

		// var form = window.document.createElement('form');
		// form.id = "cookiesHackForm";
		// form.action = 'https://giveitaway.ru/api/user/auth';
		// form.method = 'GET';
		// form.innerHTML = '<input name="q" value="test">';

		// // перед отправкой формы, её нужно вставить в документ
		// document.body.append(form);

		// form.submit();

		// // Dispatch fake click
		// var e = window.document.createEvent("MouseEvents");
		// e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		// a.dispatchEvent(e);

		dispatch(
			VK.getuser((us) => {
				Auth(
					us,
					(v) => {
						setInited(true);
						getToken((v) => {
							centrifuge.setToken(v.token);
							centrifuge.connect();
							turnOnNotifications(us.id);
						});
						getNotificationCounter(
							(r) => {
								notsCounterrr = r.number;
								setNotsCounterr(r.number);
							},
							(e) => {
								console.log('some error happened', e);
							}
						);
					},
					(e) => {
						setInited(true);
						fail('Не удалось получить ваши данные');
					}
				);
				return us;
			})
		);
	}, []);

	function setReduxAd(ad, clearAll) {
		store.dispatch(setExtraInfo(ad));
		setAd(ad, clearAll);
	}

	function backToAdsFilters() {
		goBack();
		openModal(MODAL_ADS_FILTERS);
	}

	function backToGeoFilters() {
		backToAdsFilters();
		openModal(MODAL_ADS_GEO, DIRECTION_BACK);
	}

	const adPanels = panelsHistoryVKUI[STORY_ADS];
	const adActivePanel = [activePanels[STORY_ADS]];
	useEffect(() => {
		console.log('adPanels are', adPanels);
	}, [adPanels]);

	const [adsScheme, setAdsScheme] = useState([]);
	useEffect(() => {
		setSchemeToView(STORY_ADS, setAdsScheme, deleteID, snackbars, historyLen);
	}, [deleteID, snackbars, historyLen]);

	let createPanels = panelsHistoryVKUI[STORY_CREATE];
	let createActivePanel = activePanels[STORY_CREATE];

	const [createScheme, setCreateScheme] = useState([]);
	useEffect(() => {
		setSchemeToView(STORY_CREATE, setCreateScheme, deleteID, snackbars, historyLen);
	}, [deleteID, snackbars, historyLen]);

	let notsPanels = panelsHistoryVKUI[STORY_NOTIFICATIONS];
	let notsActivePanel = activePanels[STORY_NOTIFICATIONS];

	const [notsScheme, setNotsScheme] = useState([]);
	useEffect(() => {
		setSchemeToView(STORY_NOTIFICATIONS, setNotsScheme, deleteID, snackbars, historyLen);
	}, [deleteID, snackbars, historyLen]);

	let profilePanels = panelsHistoryVKUI[STORY_PROFILE];
	let profileActivePanel = activePanels[STORY_PROFILE];

	const [profileScheme, setProfileScheme] = useState([]);
	useEffect(() => {
		setSchemeToView(STORY_PROFILE, setProfileScheme, deleteID, snackbars, historyLen);
	}, [deleteID, snackbars, historyLen]);

	function setSchemeToView(story, setScheme, deleteID, snackbars, historyLen) {
		const needEdit = inputData[story + EDIT_MODE] ? inputData[story + EDIT_MODE].mode : false;
		setScheme([
			<Panel id={PANEL_ADS}>
				<AddsTabs
					zeroNots={() => {
						notsCounterrr = 0;
					}}
					refresh={(v) => {
						console.log('SetDeleteID(v)', v);
						SetDeleteID(v);
					}}
					deleteID={deleteID}
					openUser={setProfile}
					dropFilters={dropFilters}
					openAd={setReduxAd}
				/>
				{snackbars[PANEL_ADS]}
			</Panel>,
			<Panel id={PANEL_CREATE}>
				<PanelHeader
					left={historyLen <= 1 ? null : <PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}
				>
					{needEdit ? 'Редактировать' : addText}
				</PanelHeader>
				<Create />
				{snackbars[PANEL_CREATE]}
			</Panel>,
			<Panel id={PANEL_ONE}>
				<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}>
					<p className="panel-header">Объявление</p>
				</PanelHeader>

				<AddMore2
					refresh={(id) => {
						setStory(story, PANEL_ADS);
						SetDeleteID(id);
					}}
				/>

				{snackbars[PANEL_ONE]}
			</Panel>,
			<Panel id={PANEL_USER}>
				<ProfilePanel setReduxAd={setReduxAd} />
			</Panel>,
			<Panel id={PANEL_ABOUT}>
				<AboutPanel />
			</Panel>,
			<Panel id={PANEL_FAQ}>
				<FAQPanel />
			</Panel>,
			<Panel id={PANEL_ADVICES}>
				<AdvicePanel />
			</Panel>,
			<Panel id={PANEL_LICENCE}>
				<LicencePanel />
			</Panel>,
			<Panel id={PANEL_COMMENTS}>
				<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}>
					<p className="panel-header">Комментарии</p>
				</PanelHeader>
				<Comments amount={5} maxAmount={-1} openUser={setProfile} />
				{snackbars[PANEL_COMMENTS]}
			</Panel>,
			<Panel id={PANEL_SUBS}>
				<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}>
					<p className="panel-header">Откликнувшиеся</p>
				</PanelHeader>
				<Subs openUser={setProfile} amount={5} maxAmount={-1} />
				{snackbars[PANEL_SUBS]}
			</Panel>,
			<Panel id={PANEL_CATEGORIES_B}>
				<CategoriesPanel
					redux_form={story + FORM_CREATE_B}
					goBack={goBack}
					afterClick={() => {
						props.setPage(PANEL_SUBCATEGORIES_B);
					}}
				/>
			</Panel>,
			<Panel id={PANEL_SUBCATEGORIES_B}>
				<SubcategoriesPanel
					goNext={() => {
						setPage(PANEL_SUBSUBCATEGORIES_B);
					}}
					goBack={goBack}
					redux_form={story + FORM_CREATE_B}
				/>
			</Panel>,
			<Panel id={PANEL_SUBSUBCATEGORIES_B}>
				<SubcategoriesPanel
					goNext={() => setPage(PANEL_CREATE)}
					goBack={goBack}
					redux_form={story + FORM_CREATE_B}
					redux_main_form={story + FORM_CREATE}
				/>
			</Panel>,
			<Panel id={PANEL_CATEGORIES}>
				<CategoriesPanel redux_form={story + ADS_FILTERS_B} goBack={backToAdsFilters} />
			</Panel>,
			<Panel id={PANEL_SUBCATEGORIES}>
				<SubcategoriesPanel
					goNext={() => {
						setPage(PANEL_SUBSUBCATEGORIES);
					}}
					goBack={goBack}
					redux_form={story + ADS_FILTERS_B}
				/>
			</Panel>,
			<Panel id={PANEL_SUBSUBCATEGORIES}>
				<SubcategoriesPanel
					goNext={() => {
						props.pushToCache(true, 'ignore_cache');
						goBack();
						goBack();
						goBack();
					}}
					goBack={goBack}
					redux_form={story + ADS_FILTERS_B}
					redux_main_form={story + ADS_FILTERS}
				/>
			</Panel>,
			<Panel id={PANEL_COUNTRIES}>
				<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={backToGeoFilters} />}>
					Выберите страну
				</PanelHeader>
				<Countries goBack={backToGeoFilters} redux_form={story + ADS_FILTERS_B} />
			</Panel>,
			<Panel id={PANEL_CITIES}>
				<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={backToGeoFilters} />}>
					Выберите город
				</PanelHeader>
				<Cities goBack={backToGeoFilters} redux_form={story + ADS_FILTERS_B} />
			</Panel>,
			<Panel id={PANEL_MAP}>
				<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}>
					Местоположение
				</PanelHeader>
				<AdMap max={true} />
			</Panel>,
			<Panel id={PANEL_NOTIFICATIONS}>
				<PanelHeader>Уведомления</PanelHeader>
				<Notifications zeroNots={() => (notsCounterrr = 0)} />
				{snackbars[PANEL_NOTIFICATIONS]}
			</Panel>,
		]);
	}
	if (!inited) {
		return <ScreenSpinner size="large" />;
	}

	if (notHere) {
		return <NotHere />;
	}

	return (
		<ConfigProvider isWebView={true} scheme={colorScheme}>
			<Epic activeStory={activeStory} tabbar={tabbar}>
				<View
					popout={adPopout}
					id={STORY_ADS}
					activePanel={activePanels[STORY_ADS]}
					onSwipeBack={goBack}
					history={adPanels}
					modal={<AdsModal />}
					header={false}
				>
					{adsScheme}
				</View>

				<View
					id={STORY_CREATE}
					activePanel={createActivePanel}
					popout={createPopout}
					onSwipeBack={goBack}
					modal={<AdsModal />}
					history={createPanels}
				>
					{createScheme}
				</View>
				<View
					id={STORY_NOTIFICATIONS}
					popout={notsPopout}
					activePanel={notsActivePanel}
					onSwipeBack={goBack}
					modal={<AdsModal />}
					history={notsPanels}
				>
					{notsScheme}
				</View>
				<View
					popout={profilePopout}
					id={STORY_PROFILE}
					activePanel={profileActivePanel}
					onSwipeBack={goBack}
					modal={<AdsModal />}
					history={profilePanels}
					header={false}
				>
					{profileScheme}
				</View>
			</Epic>
		</ConfigProvider>
	);
};

const mapStateToProps = (state) => {
	return {
		activePanels: state.router.activePanels,
		activeStory: state.router.activeStory,
		activeContext: state.router.activeContext,
		panelsHistory: state.router.panelsHistory,
		panelsHistoryVKUI: state.router.panelsHistoryVKUI,
		activeModals: state.router.activeModals,
		popouts: state.router.popouts,
		scrollPosition: state.router.scrollPosition,

		snackbars: state.router.snackbars,
		inputData: state.formData.forms,

		colorScheme: state.vkui.colorScheme,
		myID: state.vkui.myID,
		myUser: state.vkui.myUser,
		direction: state.router.direction,
		from: state.router.from,
		to: state.router.to,
		dummies: state.router.dummies,
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators(
			{
				setStory,
				setStoryProfile,
				setProfile,
				setAd,
				goBack,
				openModal,
				setFormData,
				openPopout,
				clearAds,
				setPage,
				pushToCache,

				setToHistory,
				backToPrevAd,
				updateContext,
				closeDummy,
			},
			dispatch
		),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

export const CardWithPadding = (value, mode) => (
	<div style={{ padding: '4px' }}>
		<Card mode={mode || 'shadow'}>{value}</Card>
	</div>
);

// 477 -> 516 -> 674 -> 703 -> 795 -> 749 -> 587 -> 524 -> 583
// 722 -> 645 -> 930 -> 754 -> 864
