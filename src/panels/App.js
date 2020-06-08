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
	Footer,
	Link,
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
	PANEL_CITIES,
	PANEL_COUNTRIES,
	PANEL_MAP,
	PANEL_ABOUT,
} from './../store/router/panelTypes';

import { MODAL_ADS_FILTERS, MODAL_ADS_GEO, MODAL_ADS_SUBS } from './../store/router/modalTypes';

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
	openSnackbar,
	openPopout,
	setPage,
} from '../store/router/actions';
import * as VK from '../services/VK';
import { setAppID, setPlatform } from '../store/vk/actions';

import { addComment, addSub, setStatus, setExtraInfo, setToHistory, clearAds } from '../store/detailed_ad/actions';

import CategoriesPanel from './../components/categories/panel';
import Countries from './../components/location/countries';
import Cities from './../components/location/cities';
import { FORM_LOCATION_CREATE } from './../components/location/redux';

import Subs from './story/adds/tabs/subs/subs';

import AddsTabs from './story/adds/AddsTabs';
import Create from './../containers/create/create';

import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28Add from '@vkontakte/icons/dist/28/add_outline';

import { VkUser } from '../store/vkUser';

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

import Profile from './story/profile/Profile';

import { AddrWS } from '../store/addr_ws';

import Comments from './story/adds/tabs/comments/comments';

import { inputArgs } from '../utils/window';

import Centrifuge from 'centrifuge';
import { FORM_CREATE, FORM_ADS } from '../components/categories/redux';
import { setFormData } from '../store/create_post/actions';
import { ADS_FILTERS, EDIT_MODE, CREATE_AD_MAIN, CREATE_AD_ITEM } from '../store/create_post/types';
import AdsModal from '../containers/ads/modal';
import { defaultInputData } from '../components/create/default';
import { updateDealInfo } from '../store/detailed_ad/update';
import { store } from '..';
import AdMap from '../containers/location/map';
import { SET_TO_HISTORY } from '../store/detailed_ad/actionTypes';

import ProfilePanel from './profile';

const adsText = 'Объявления';
const addText = 'Создать обьявление';
const profileText = 'Профиль';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

let notsCounterrr = 0;

// const ProfilePanel = (props) => {
// 	const { historyLen, profileName, setProfileName, openSnackbar, setReduxAd, goBack, snackbars } = props;
// 	return (
// 		<Panel id={PANEL_USER}>
// 			<PanelHeader left={historyLen <= 1 ? null : <PanelHeaderBack onClick={goBack} />}>
// 				<p className="panel-header"> {profileName} </p>
// 			</PanelHeader>
// 			<Profile setProfileName={setProfileName} setSnackbar={openSnackbar} openAd={setReduxAd} />
// 			{snackbars[PANEL_USER]}
// 			<Footer>
// 				<Link
// 					onClick={() => {
// 						console.log('loooooos');
// 						props.setPage(PANEL_ABOUT);
// 					}}
// 				>
// 					3 cообщества
// 				</Link>
// 			</Footer>
// 		</Panel>
// 	);
// };

const App = (props) => {
	const { colorScheme, myUser, myID, inputData, AD } = props;
	const {
		activeStory,
		goBack,
		setAd,
		setStory,
		setProfile,
		setStatus,
		openModal,
		addProfile,
		setFormData,
		openSnackbar,
		activePanels,
		panelsHistory,
		popouts,
		openPopout,
		snackbars,
		addComment,
		addSub,
		scrollPosition,
		clearAds,
	} = props;

	const needEdit = inputData[EDIT_MODE] ? inputData[EDIT_MODE].mode : false;

	const adPopout = popouts[STORY_ADS];
	const createPopout = popouts[STORY_CREATE];

	const [inited, setInited] = useState(false);

	const [profileName, setProfileName] = useState('Профиль');

	const [notsCounterr, setNotsCounterr] = useState(notsCounterr);

	const [deleteID, SetDeleteID] = useState(-1);

	const historyLen = panelsHistory ? (panelsHistory[STORY_ADS] ? panelsHistory[STORY_ADS].length : 0) : 0;

	function dropFilters() {
		setFormData(ADS_FILTERS, null);
	}

	useEffect(() => {
		window.scroll(0, scrollPosition[scrollPosition.length - 1]);
	}, [scrollPosition]);

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

	async function scroll() {
		// await bridge.send('VKWebAppScroll', { top: 10000, speed: 600 });
		// window.scrollTo(0, 0);
		// setOnline(
		// 	appID,
		// 	ApiVersion,
		// 	(v) => {},
		// 	(e) => {}
		// );
	}

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
						console.log('we add new value');
						addSub(noteValue);
					}
				}
			}

			handleNotifications(note, openSnackbar);
		});
	}

	useEffect(() => {
		console.log('connecting useEffect ', AD.ad_id);
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
		//....
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
			console.log('we set hash', hash);
			setReduxAd({ ad_id: Number(hash) });
		}

		dispatch(setPlatform(vk_platform));
		dispatch(setAppID(app_id));

		// bridge
		// 	.send('VKWebAppGetAuthToken', { app_id: 7360033, scope: 'status' })
		// 	.then((res) => {
		// 		console.log('sucess VKWebAppGetAuthToken', res);
		// 		return res.access_token;
		// 	})

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
		console.log('you ask to do this', ad);
		store.dispatch(setToHistory());
		store.dispatch(setExtraInfo(ad));
		setAd(ad);
	}

	function backToAdsFilters() {
		goBack();
		openModal(MODAL_ADS_FILTERS);
	}

	function backToGeoFilters() {
		backToAdsFilters();
		openModal(MODAL_ADS_GEO);
	}

	let adPanels = props.panelsHistory[STORY_ADS];
	let adActivePanel = props.activePanels[STORY_ADS];

	let createPanels = props.panelsHistory[STORY_CREATE];
	let createActivePanel = props.activePanels[STORY_CREATE];
	let choosen = props.activeAd;

	if (!inited) {
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
									console.log('here we go');

									setStory(STORY_ADS, PANEL_ADS);
									SetDeleteID(id);
									scroll();
								}}
								back={goBack}
								openUser={setProfile}
								VkUser={VkUser}
							/>
						) : (
							Error
						)}
						{snackbars[PANEL_ONE]}
					</Panel>
					<Panel id={PANEL_USER}>
						<ProfilePanel setReduxAd={setReduxAd} />
					</Panel>
					{/* <Panel id={PANEL_USER}>
						<PanelHeader left={historyLen <= 1 ? null : <PanelHeaderBack onClick={goBack} />}>
							<p className="panel-header"> {profileName} </p>
						</PanelHeader>
						<Profile setProfileName={setProfileName} setSnackbar={openSnackbar} openAd={setReduxAd} />
						{snackbars[PANEL_USER]}
						<Footer>
							<Link
								onClick={() => {
									console.log('loooooos');
									props.setPage(PANEL_ABOUT);
								}}
							>
								3 cообщества
							</Link>
						</Footer>
					</Panel> */}
					<Panel id={PANEL_ABOUT}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
							<p className="panel-header">Комментарии</p>
							{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
						</PanelHeader>
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
							<p className="panel-header">Отликнувшиеся</p>
							{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
						</PanelHeader>
						{choosen ? <Subs openUser={setProfile} amount={5} maxAmount={-1} /> : Error}
						{snackbars[PANEL_SUBS]}
					</Panel>
					<Panel id={PANEL_CATEGORIES}>
						<PanelHeader left={<PanelHeaderBack onClick={backToAdsFilters} />}>
							Выберите категорию
						</PanelHeader>
						<CategoriesPanel goBack={backToAdsFilters} redux_form={ADS_FILTERS} />
					</Panel>
					<Panel id={PANEL_COUNTRIES}>
						<PanelHeader left={<PanelHeaderBack onClick={backToGeoFilters} />}>Выберите страну</PanelHeader>
						<Countries goBack={backToGeoFilters} redux_form={ADS_FILTERS} />
					</Panel>
					<Panel id={PANEL_CITIES}>
						<PanelHeader left={<PanelHeaderBack onClick={backToGeoFilters} />}>Выберите город</PanelHeader>
						<Cities goBack={backToGeoFilters} redux_form={ADS_FILTERS} />
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
					<Panel id={PANEL_CATEGORIES}>
						<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>Выберите категорию</PanelHeader>
						<CategoriesPanel redux_form={FORM_CREATE} goBack={goBack} />
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

		profileHistory: state.router.profileHistory,
		activeProfile: state.router.activeProfile,
		snackbars: state.router.snackbars,
		inputData: state.formData.forms,

		AD: state.ad,

		colorScheme: state.vkui.colorScheme,
		myID: state.vkui.myID,
		myUser: state.vkui.myUser,
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
				openSnackbar,
				openPopout,
				addComment,
				addSub,
				setStatus,
				clearAds,
				setPage,
			},
			dispatch
		),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// 477 -> 516 -> 674 -> 703 -> 795 -> 749 -> 587 -> 524
