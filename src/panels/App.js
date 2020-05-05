import React, { useState, useEffect } from 'react';
import {
	View,
	Panel,
	PanelHeader,
	Epic,
	Tabbar,
	PanelHeaderBack,
	TabbarItem,
	PanelHeaderSimple,
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
	PANEL_CITIES,
	PANEL_COUNTRIES,
} from './../store/router/panelTypes';

import { MODAL_ADS_FILTERS, MODAL_ADS_GEO, MODAL_ADS_SUBS } from './../store/router/modalTypes';

import './main.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	goBack,
	closeModal,
	setStory,
	openModal,
	setProfile,
	setAd,
	setPage,
	addProfile,
	openSnackbar,
} from '../store/router/actions';
import * as VK from '../services/VK';
import { setAppID, setPlatform } from '../store/vk/actions';

import { setDetailedAd } from '../store/detailed_ad/actions';

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

import { handleNotifications } from './story/adds/tabs/notifications/notifications';

import AddMore2 from './template/AddMore2';
import { CategoryNo } from './template/Categories';

import { GEO_TYPE_FILTERS, AdDefault } from './../const/ads';

import { Auth, getToken, fail } from '../requests';

import Error from './placeholders/error';
import NotHere from './placeholders/NotHere';

import { NoRegion } from './template/Location';

import Profile from './story/profile/Profile';

import { AddrWS } from '../store/addr_ws';

import Comments from './story/adds/tabs/comments/comments';

import { inputArgs } from '../utils/window';

import Centrifuge from 'centrifuge';
import { FORM_CREATE, FORM_ADS } from '../components/categories/redux';
import { setFormData } from '../store/create_post/actions';
import { ADS_FILTERS } from '../store/create_post/types';
import AdsModal from '../containers/ads/modal';

const adsText = 'Объявления';
const addText = 'Создать обьявление';
const profileText = 'Профиль';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

let notsCounterrr = 0;

const App = (props) => {
	const { colorScheme, appID, myID, apiVersion, platform } = props;
	const {
		activeStory,
		goBack,
		setAd,
		setPage,
		setStory,
		setProfile,
		openModal,
		closeModal,
		addProfile,
		setFormData,
		openSnackbar,
	} = props;

	const [popout, setPopout] = useState(null); //<ScreenSpinner size="large" />
	const [inited, setInited] = useState(false);

	const [adsMode, setAdsMode] = useState('all');

	const [backUser, setbackUser] = useState(null);
	const [cost, setCost] = useState(0);

	const [profileName, setProfileName] = useState('Профиль');

	const [notsCounterr, setNotsCounterr] = useState(notsCounterr);

	const [category, setCategory] = useState(CategoryNo);

	const [snackbar, setSnackbar] = useState(null);

	const [deleteID, SetDeleteID] = useState(-1);

	const [geodata, setGeodata] = useState({
		long: -1,
		lat: -1,
	});

	const [radius, setRadius] = useState(5);

	const [city, setCity] = useState(NoRegion);
	const [country, setCountry] = useState(NoRegion);

	const [sort, setSort] = useState('time');

	const [savedAdState, setSavedAdState] = useState('');

	const [geoType, setGeoType] = useState(GEO_TYPE_FILTERS);

	function dropFilters() {
		setFormData(ADS_FILTERS, null);
	}

	const onStoryChange = (e) => {
		const isProfile = e.currentTarget.dataset.text == profileText;
		setStory(e.currentTarget.dataset.story);
		addProfile(myID);
		if (e.currentTarget.dataset.story == STORY_ADS) {
			if (isProfile) {
				console.log('myID', myID);
				console.log('SET_PROFILE11', props.activeProfile, props.profileHistory);

				setProfile(myID);
				setPage(PANEL_USER);
			} else {
				dropFilters();
				setPage(PANEL_ADS);
				setSavedAdState('');
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

	const [wsNote, setwsNote] = useState({ notification_type: 'no' });
	const [notHere, setNotHere] = useState(false);

	function turnOnNotifications(id) {
		console.log('user#' + id);
		centrifuge.subscribe('user#' + id, (note) => {
			notsCounterrr++;
			setNotsCounterr(notsCounterrr);
			console.log('user#' + id + ' ' + note);

			handleNotifications(note, setSnackbar);
		});
	}

	// useEffect(() => {
	// 	console.log('choosen', choosen.ad_id);
	// 	if (choosen.ad_id == -1) {
	// 		return;
	// 	}
	// 	turnOnNotifications();

	// 	const ad = choosen;
	// 	console.log('connecting', ad.ad_id);
	// 	centrifuge.subscribe('ad_' + ad.ad_id, (note) => {
	// 		console.log('centrifugu notenote', note);
	// 		setwsNote(note);
	// 	});
	// }, [choosen]);

	useEffect(() => {
		setPopout(<ScreenSpinner size="large" />);
		const { dispatch } = props;
		dispatch(VK.initApp());

		const { vk_platform, app_id } = inputArgs();
		if (!app_id) {
			setInited(true);
			setNotHere(true);
			return;
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
					setSnackbar,
					setPopout,
					(v) => {
						setInited(true);
						dispatch(addProfile(us.id));
						getToken(
							setSnackbar,
							(v) => {
								centrifuge.setToken(v.token);
								turnOnNotifications(us.id);
								centrifuge.connect();
							},
							(e) => {}
						);
					},
					(e) => {
						fail('Не удалось получить ваши данные', null, openSnackbar);
					}
				);
				return us;
			})
		);
	}, []);

	function setReduxAd(ad) {
		console.log('you ask to do this', ad);
		setAd(ad);
		setDetailedAd(ad);
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
	const canGoBack = adPanels.length > 3;
	let adActivePanel = props.activePanels[STORY_ADS];
	let adActiveModal = props.activeModals[STORY_ADS];

	let createPanels = props.panelsHistory[STORY_CREATE];
	let createActivePanel = props.activePanels[STORY_CREATE];
	let choosen = props.activeAd;
	console.log('activeProfile', props.activeProfile, props.profileHistory);

	if (!inited) {
		return snackbar;
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
					popout={popout}
					id={STORY_ADS}
					activePanel={adActivePanel}
					onSwipeBack={goBack}
					history={adPanels}
					modal={
						<AdsModal
							setPopout={setPopout}
							setSnackbar={setSnackbar}
							ad={choosen}
							backUser={backUser}
							cost={cost}
						/>
					}
					header={false}
				>
					<Panel id={PANEL_ADS} separator={false}>
						<AddsTabs
							setSavedAdState={setSavedAdState}
							savedAdState={savedAdState}
							onFiltersClick={() => openModal(MODAL_ADS_FILTERS)}
							onCloseClick={(act) => {
								openModal(MODAL_ADS_SUBS);
								scroll();
							}}
							notsCounter={notsCounterrr}
							zeroNots={() => {
								notsCounterrr = 0;
							}}
							setPopout={setPopout}
							setSnackbar={setSnackbar}
							refresh={SetDeleteID}
							deleteID={deleteID}
							openUser={setProfile}
							dropFilters={dropFilters}
							openAd={setReduxAd}
						/>
						{snackbar}
					</Panel>
					<Panel id={PANEL_ONE}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={goBack} />}>
							{choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошбка'}
						</PanelHeaderSimple>
						{choosen ? (
							<AddMore2
								myID={myID}
								wsNote={wsNote}
								refresh={(id) => {
									goBack();
									SetDeleteID(id);
									scroll();
								}}
								back={goBack}
								openUser={setProfile}
								ad={choosen}
								setPopout={setPopout}
								setSnackbar={setSnackbar}
								VkUser={VkUser}
								vkPlatform={platform}
								setbackUser={setbackUser}
								setCost={setCost}
							/>
						) : (
							Error
						)}
						{snackbar}
					</Panel>
					<Panel id={PANEL_USER}>
						<PanelHeaderSimple left={!canGoBack ? null : <PanelHeaderBack onClick={goBack} />}>
							<p className="panel-header"> {profileName} </p>
						</PanelHeaderSimple>
						<Profile
							setAdsMode={setAdsMode}
							setPopout={setPopout}
							setProfileName={setProfileName}
							setSnackbar={setSnackbar}
							goToAdds={() => {
								setStory(STORY_ADS);
							}}
							goToCreate={() => {
								setStory(STORY_CREATE);
							}}
							openAd={setReduxAd}
						/>
						{snackbar}
					</Panel>
					<Panel id={PANEL_COMMENTS}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={goBack} />}>
							{choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошбка'}
						</PanelHeaderSimple>
						{choosen ? (
							<Comments
								hide={false}
								ad={choosen}
								panel={PANEL_COMMENTS}
								amount={5}
								maxAmount={-1}
								setPopout={setPopout}
								setSnackbar={setSnackbar}
								myID={myID}
								openUser={setProfile}
							/>
						) : (
							Error
						)}
						{snackbar}
					</Panel>
					<Panel id={PANEL_SUBS}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={goBack} />}>
							{choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошбка'}
						</PanelHeaderSimple>
						{choosen ? (
							<Subs
								setPopout={setPopout}
								setSnackbar={setSnackbar}
								openUser={setProfile}
								amount={5}
								maxAmount={-1}
								ad={choosen}
							/>
						) : (
							Error
						)}
						{snackbar}
					</Panel>
					<Panel id={PANEL_CATEGORIES}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={backToAdsFilters} />}>
							Выберите категорию
						</PanelHeaderSimple>
						<CategoriesPanel goBack={backToAdsFilters} redux_form={ADS_FILTERS} />
					</Panel>
					<Panel id={PANEL_COUNTRIES}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={backToGeoFilters} />}>
							Выберите страну
						</PanelHeaderSimple>
						<Countries goBack={backToGeoFilters} redux_form={ADS_FILTERS} />
					</Panel>
					<Panel id={PANEL_CITIES}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={backToGeoFilters} />}>
							Выберите город
						</PanelHeaderSimple>
						<Cities goBack={backToGeoFilters} redux_form={ADS_FILTERS} />
					</Panel>
				</View>

				<View
					id={STORY_CREATE}
					activePanel={createActivePanel}
					popout={popout}
					onSwipeBack={goBack}
					history={createPanels}
				>
					<Panel id={PANEL_CREATE}>
						<PanelHeader>{addText}</PanelHeader>
						<Create />
						{snackbar}
					</Panel>
					<Panel id={PANEL_CATEGORIES}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={goBack} />}>
							Выберите категорию
						</PanelHeaderSimple>
						<CategoriesPanel redux_form={FORM_CREATE} goBack={goBack} />
					</Panel>
					<Panel id={PANEL_COUNTRIES}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={goBack} />}>
							Выберите страну
						</PanelHeaderSimple>
						<Countries redux_form={FORM_LOCATION_CREATE} goBack={goBack} />
					</Panel>
					<Panel id={PANEL_CITIES}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={goBack} />}>
							Выберите город
						</PanelHeaderSimple>
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

		colorScheme: state.vkui.colorScheme,
		appID: state.vkui.appID,
		myID: state.vkui.myID,
		apiVersion: state.vkui.apiVersion,
		platform: state.vkui.platform,
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators(
			{
				setStory,
				setPage,
				setProfile,
				setAd,
				goBack,
				closeModal,
				openModal,
				addProfile,
				setFormData,
				openSnackbar,
				setDetailedAd,
			},
			dispatch
		),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// 477 -> 516 -> 674 -> 703 -> 795 -> 749 -> 587
