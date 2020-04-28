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
	Counter,
	ConfigProvider,
	Placeholder,
	Button,
} from '@vkontakte/vkui';

import './main.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goBack, closeModal, setStory } from '../store/router/actions';
import * as VK from '../services/VK';
import { setAppID, setPlatform } from '../store/vk/actions';
import bridge from '@vkontakte/vk-bridge';

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

import AddMore, { AdDefault } from './template/AddMore';
import AddMore2 from './template/AddMore2';
import { CategoryNo } from './template/Categories';

import { Auth, getToken } from '../requests';

import Error from './placeholders/error';
import NotHere from './placeholders/NotHere';

import { NoRegion } from './template/Location';

import Profile from './story/profile/Profile';

import AddsModal, {
	MODAL_FILTERS,
	MODAL_CATEGORIES,
	MODAL_SUBS,
	GEO_TYPE_FILTERS,
	MODAL_COST,
	MODAL_FROZEN,
} from './story/adds/AddsModal';
import CreateModal from './story/create/CreateModal';

import { AddrWS } from '../store/addr_ws';

import Comments from './story/adds/tabs/comments/comments';

import { inputArgs } from '../utils/window';

import Centrifuge from 'centrifuge';
import continuousSizeLegend from 'react-vis/dist/legends/continuous-size-legend';
import { FORM_CREATE } from '../components/categories/redux';

const PANEL_ADS = 'ads';
const PANEL_ONE = 'one';
const PANEL_USER = 'user';
const PANEL_SUBS = 'subs';
const PANEL_COMMENTS = 'comments';
const PANEL_CATEGORIES = 'categories';
const PANEL_CREATE = 'create';
const PANEL_CITIES = 'cities';
const PANEL_COUNTRIES = 'countries';

const ads = 'ads';
const adsText = 'Объявления';

const add = 'add';
const addText = 'Создать обьявление';

const profileText = 'Профиль';

const no_prev = 'no prev';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

let notsCounterrr = 0;

const App = (props) => {
	const { colorScheme, appID, myID, apiVersion, platform } = props;

	const [popout, setPopout] = useState(null); //<ScreenSpinner size="large" />
	const [inited, setInited] = useState(false);

	const [adsMode, setAdsMode] = useState('all');

	const [history, setHistory] = useState([PANEL_ADS]);
	const [historyLen, setHistoryLen] = useState(1);

	const [historyAds, setHistoryAds] = useState([]);
	const [historyProfile, setHistoryProfile] = useState([]);

	const [backUser, setbackUser] = useState(null);
	const [cost, setCost] = useState(0);

	const [profileID, setProfileID] = useState(0);
	const [profileName, setProfileName] = useState('Профиль');

	const [notsCounterr, setNotsCounterr] = useState(notsCounterr);

	const [prevActiveStory, setPrevActiveStory] = useState(no_prev);
	const [activeStory, setActiveStory] = useState(ads);
	const [category, setCategory] = useState(CategoryNo);
	const [category2, setCategory2] = useState(CategoryNo);

	const [activePanel, setActivePanel] = useState(PANEL_ADS);
	const [createActivePanel, setCreateActivePanel] = useState(PANEL_CREATE);

	const [activeModal, setActiveModal] = useState(null);
	const [activeModal2, setActiveModal2] = useState(null);
	const [snackbar, setSnackbar] = useState(null);

	const [choosen, setChoosen] = useState(AdDefault);

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

	const [createState, setCreateState] = useState({ inited: false });

	function dropFilters() {
		setCategory(CategoryNo);
		setCity(NoRegion);
		setCountry(NoRegion);
		setSort('time');
	}

	function zeroHistory() {
		setHistoryAds([]);
		setHistoryProfile([]);
		setHistoryLen(-1);
		setHistory([PANEL_ADS]);
	}

	const onStoryChange = (e) => {
		const isProfile = e.currentTarget.dataset.text == profileText;

		if (e.currentTarget.dataset.story == ads) {
			if (isProfile) {
				setProfileID(myID);
				setActivePanel(PANEL_USER);
				setPrevActiveStory(no_prev);
			} else {
				dropFilters();
				setActivePanel(PANEL_ADS);
				setSavedAdState('');
			}
		}
		scroll();
		setActiveStory(e.currentTarget.dataset.story);
		zeroHistory();
	};

	useEffect(() => {
		if (profileID != 0) {
			setActivePanel(PANEL_USER);
		}
	}, [profileID]);

	useEffect(() => {
		if (choosen.ad_id != -1) {
			setActivePanel(PANEL_ONE);
		} else {
			setActivePanel(PANEL_ADS);
		}
	}, [choosen]);

	function next(currPanel, newPanel, ad, profileID) {
		console.log('nextnext', currPanel, newPanel);
		window.history.pushState({ currPanel: newPanel, ad: ad, profileID: profileID }, currPanel);
		setHistoryLen(history.length + 1);
		let a = history.slice();
		a.push(currPanel);
		setHistory(a);
		setActivePanel(newPanel);
	}

	function back() {
		// window.history.back();
		let a = history.slice();
		let panel = a.pop();
		setHistory(a);
		setActivePanel(panel);
	}

	function openAd(ad, currPanel) {
		setActiveStory(ads);
		setChoosen(ad);
		if (currPanel) {
			next(currPanel, PANEL_ONE, ad, null);

			let a = historyAds.slice();
			a.push(ad);
			setHistoryAds(a);
		}

		scroll();
	}

	function openComments(ad) {
		setActiveStory(ads);
		next(PANEL_ONE, PANEL_COMMENTS, ad, null);
		let a = historyAds.slice();
		a.push(ad);
		setHistoryAds(a);
		scroll();
	}

	function openSubs(ad) {
		setActiveStory(ads);
		next(PANEL_ONE, PANEL_SUBS, ad, null);
		let a = historyAds.slice();
		a.push(ad);
		setHistoryAds(a);
		scroll();
	}

	function openUser(id, currPanel) {
		setActiveStory(ads);
		setProfileID(id);
		setPrevActiveStory('ads');
		next(currPanel, PANEL_USER, null, id);

		let a = historyProfile.slice();
		a.push(id);
		setHistoryProfile(a);

		scroll();
	}

	useEffect(() => {
		console.log('history change', historyLen, history.length, window.history.length);
		if (historyLen == history.length || history.length == 1) {
			return;
		}
		const adsLength = history.filter((v) => {
			v == PANEL_ONE;
		}).length;
		const usersLength = history.filter((v) => {
			v == PANEL_USER;
		}).length;

		const a = historyAds.slice();
		const p = historyProfile.slice();

		if (adsLength != a.length) {
			const ad = a.pop();
			setChoosen(ad);
			setHistoryAds(a);
		}

		if (usersLength != p.length) {
			const id = p.pop();
			setProfileID(id);
			setHistoryProfile(p);
		}
	}, [history]);

	function goToAds(snack) {
		setActiveStory(ads);
		if (snack != undefined) {
			setSnackbar(snack);
		}
	}

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

	useEffect(() => {
		console.log('choosen', choosen.ad_id);
		if (choosen.ad_id == -1) {
			return;
		}
		turnOnNotifications();

		const ad = choosen;
		console.log('connecting', ad.ad_id);
		centrifuge.subscribe('ad_' + ad.ad_id, (note) => {
			console.log('centrifugu notenote', note);
			setwsNote(note);
		});
	}, [choosen]);

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
			if (!event.state) {
				VK.closeApp();
				return;
			}
			const currPanel = event.state.currPanel;
			setActivePanel(currPanel);
			if (currPanel == PANEL_USER) {
				setProfileID(event.state.profileID);
			} else if (currPanel == PANEL_ONE) {
				setChoosen(event.state.ad);
			}
		};

		dispatch(
			VK.getuser((us) => {
				console.log('looook at us', us);
				Auth(
					us,
					setSnackbar,
					setPopout,
					(v) => {
						setInited(true);
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
						fetchData();
					}
				);
				return us;
			})
		);
	}, []);

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
							selected={activeStory === ads && activePanel != PANEL_USER}
							data-story={ads}
							data-text={adsText}
							text={adsText}
							label={notsCounterrr == 0 ? null : notsCounterrr}
							after={<Counter>100</Counter>}
							// after={notsCounter == 0 ? '' : <Counter>notsCounter</Counter>}
						>
							<Icon28NewsfeedOutline onClick={onStoryChange} />
						</TabbarItem>

						<TabbarItem
							onClick={onStoryChange}
							data-text={addText}
							selected={activeStory === add}
							data-story={add}
							text={addText}
						>
							<Icon28Add onClick={onStoryChange} />
						</TabbarItem>
						<TabbarItem
							onClick={onStoryChange}
							selected={activeStory === ads && activePanel == PANEL_USER}
							data-story={ads}
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
					id={ads}
					activePanel={activePanel}
					onSwipeBack={back}
					history={history}
					modal={
						<AddsModal
							geoType={geoType}
							setGeoType={setGeoType}
							appID={appID}
							apiVersion={apiVersion}
							vkPlatform={platform}
							activeModal={activeModal}
							setActiveModal={setActiveModal}
							category={category}
							setCategory={setCategory}
							city={city}
							country={country}
							// region={region}
							setCity={setCity}
							setCountry={setCountry}
							radius={radius}
							setRadius={setRadius}
							geodata={geodata}
							setGeodata={setGeodata}
							// setRegion={setRegion}
							sort={sort}
							setSort={setSort}
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
							geodata={geodata}
							adsMode={adsMode}
							setSavedAdState={setSavedAdState}
							savedAdState={savedAdState}
							onFiltersClick={() => setActiveModal(MODAL_FILTERS)}
							onCloseClick={(act) => {
								setActiveModal(MODAL_SUBS);
								scroll();
							}}
							notsCounter={notsCounterrr}
							zeroNots={() => {
								notsCounterrr = 0;
							}}
							setPopout={setPopout}
							setSnackbar={setSnackbar}
							category={category}
							refresh={SetDeleteID}
							deleteID={deleteID}
							city={city}
							country={country}
							myID={myID}
							openUser={(id) => {
								openUser(id, PANEL_ADS);
							}}
							sort={sort}
							dropFilters={dropFilters}
							chooseAdd={(ad) => {
								setChoosen(ad);
							}}
							openAd={(ad) => {
								openAd(ad, PANEL_ADS);
							}}
							vkPlatform={platform}
						/>
						{snackbar}
					</Panel>
					<Panel id={PANEL_ONE}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={back} />}>
							{choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошбка'}
						</PanelHeaderSimple>
						{choosen ? (
							<AddMore2
								myID={myID}
								wsNote={wsNote}
								refresh={(id) => {
									back();
									SetDeleteID(id);
									scroll();
								}}
								back={back}
								openUser={(id) => {
									console.log('PANEL_ONE', id);
									openUser(id, PANEL_ONE);
								}}
								openComments={(ad) => {
									openComments(ad);
								}}
								openSubs={(ad) => {
									openSubs(ad);
								}}
								ad={choosen}
								setPopout={setPopout}
								setSnackbar={setSnackbar}
								VkUser={VkUser}
								vkPlatform={platform}
								onCloseClick={() => setActiveModal(MODAL_SUBS)}
								onCarmaClick={() => {
									setActiveModal(MODAL_COST);
								}}
								onFreezeClick={() => {
									setActiveModal(MODAL_FROZEN);
								}}
								setbackUser={setbackUser}
								setCost={setCost}
							/>
						) : (
							Error
						)}
						{snackbar}
					</Panel>
					<Panel id={PANEL_USER}>
						<PanelHeaderSimple
							left={prevActiveStory == no_prev ? null : <PanelHeaderBack onClick={back} />}
						>
							<p className="panel-header"> {profileName} </p>
						</PanelHeaderSimple>
						<Profile
							setAdsMode={setAdsMode}
							setPopout={setPopout}
							setProfileName={setProfileName}
							setSnackbar={setSnackbar}
							myID={myID}
							profileID={profileID}
							appID={appID}
							apiVersion={apiVersion}
							goToAdds={() => {
								setActiveStory(ads);
								setActivePanel(PANEL_ADS);
								scroll();
							}}
							goToCreate={() => {
								setActiveStory(add);
								scroll();
							}}
							openAd={(ad) => {
								openAd(ad, PANEL_USER);
							}}
						/>
						{snackbar}
					</Panel>
					<Panel id={PANEL_COMMENTS}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={back} />}>
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
								openUser={(id) => {
									openUser(id, PANEL_ADS);
								}}
							/>
						) : (
							Error
						)}
						{snackbar}
					</Panel>
					<Panel id={PANEL_SUBS}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={back} />}>
							{choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошбка'}
						</PanelHeaderSimple>
						{choosen ? (
							<Subs
								setPopout={setPopout}
								setSnackbar={setSnackbar}
								openUser={openUser}
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
						<PanelHeaderSimple
							left={
								<PanelHeaderBack
									onClick={() => {
										setActiveStory(add);
									}}
								/>
							}
						>
							{choosen ? <p className="panel-header">Всем привет</p> : 'Произошла ошбка'}
						</PanelHeaderSimple>
						<CategoriesPanel
							back={() => {
								setActiveStory(add);
							}}
						/>
					</Panel>
				</View>

				<View
					id={add}
					activePanel={createActivePanel}
					popout={popout}
					modal={
						<CreateModal
							activeModal={activeModal2}
							setActiveModal={setActiveModal2}
							category={category2}
							setCategory={setCategory2}
						/>
					}
				>
					<Panel id={PANEL_CREATE}>
						<PanelHeader>{addText}</PanelHeader>
						<Create
							setCreateState={setCreateState}
							vkPlatform={platform}
							myID={myID}
							appID={appID}
							apiVersion={apiVersion}
							setPopout={setPopout}
							goToAds={goToAds}
							snackbar={snackbar}
							setSnackbar={setSnackbar}
							category={category2}
							refresh={(id) => {
								SetDeleteID(id);
							}}
							chooseCategory={() => setActiveModal2(MODAL_CATEGORIES)}
							openAd={(ad) => {
								setActivePanel(PANEL_ONE);
								setActiveStory(ads);
								setChoosen(ad);
								zeroHistory();
								scroll();
							}}
							openCategories={() => {
								setCreateActivePanel(PANEL_CATEGORIES);
							}}
							openCities={() => {
								setCreateActivePanel(PANEL_CITIES);
							}}
							openCountries={() => {
								setCreateActivePanel(PANEL_COUNTRIES);
							}}
						/>
						{snackbar}
					</Panel>
					<Panel id={PANEL_CATEGORIES}>
						<PanelHeaderSimple
							left={
								<PanelHeaderBack
									onClick={() => {
										setCreateActivePanel(PANEL_CREATE);
									}}
								/>
							}
						>
							Выберите категорию
						</PanelHeaderSimple>
						<CategoriesPanel
							back={() => {
								setCreateActivePanel(PANEL_CREATE);
							}}
							redux_form={FORM_CREATE}
						/>
					</Panel>
					<Panel id={PANEL_COUNTRIES}>
						<PanelHeaderSimple
							left={
								<PanelHeaderBack
									onClick={() => {
										setCreateActivePanel(PANEL_CREATE);
									}}
								/>
							}
						>
							Выберите страну
						</PanelHeaderSimple>
						<Countries
							back={() => {
								setCreateActivePanel(PANEL_CREATE);
							}}
							redux_form={FORM_LOCATION_CREATE}
						/>
					</Panel>
					<Panel id={PANEL_CITIES}>
						<PanelHeaderSimple
							left={
								<PanelHeaderBack
									onClick={() => {
										setCreateActivePanel(PANEL_CREATE);
									}}
								/>
							}
						>
							Выберите город
						</PanelHeaderSimple>
						<Cities
							back={() => {
								setCreateActivePanel(PANEL_CREATE);
							}}
							redux_form={FORM_LOCATION_CREATE}
						/>
					</Panel>
				</View>
			</Epic>
		</ConfigProvider>
	);
};

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		activeStory: state.router.activeStory,
		panelsHistory: state.router.panelsHistory,
		activeModals: state.router.activeModals,
		popouts: state.router.popouts,
		scrollPosition: state.router.scrollPosition,

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
		...bindActionCreators({ setStory, goBack, closeModal }, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// 477 -> 516 -> 674 -> 703 -> 795
