import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	View,
	Panel,
	PanelHeader,
	Epic,
	Tabbar,
	PanelHeaderBack,
	TabbarItem,
	PanelHeaderSimple,
	ConfigProvider,
	ScreenSpinner,
	Counter,
} from '@vkontakte/vkui';

import AddsTabs from './story/adds/AddsTabs';
import CreateAdd from './story/create/CreateAdd';

import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28Add from '@vkontakte/icons/dist/28/add_outline';

import { VkUser } from '../store/vkUser';

import { handleNotifications } from './story/adds/tabs/notifications/notifications';

import AddMore, { AdDefault } from './template/AddMore';
import AddMore2 from './template/AddMore2';
import { CategoryNo } from './template/Categories';

import { Auth, getToken } from './../requests';

import Error from './placeholders/error';

import { NoRegion } from './template/Location';

import Profile from './story/profile/Profile';

import AddsModal, { MODAL_FILTERS, MODAL_CATEGORIES, MODAL_SUBS } from './story/adds/AddsModal';
import CreateModal from './story/create/CreateModal';

import { AddrWS } from './../store/addr_ws';

import { inputArgs } from './../utils/window';

import Centrifuge from 'centrifuge';

const PANEL_ADS = 'ads';
const PANEL_ONE = 'one';
const PANEL_USER = 'user';

const ads = 'ads';
const adsText = 'Объявления';

const add = 'add';
const addText = 'Создать';

const profileText = 'Профиль';

const ApiVersion = '5.5';

const no_prev = 'no prev';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

let notsCounterrr = 0;

const Main = () => {
	const [popout, setPopout] = useState(null); //<ScreenSpinner size="large" />
	const [inited, setInited] = useState(false);

	const [adsMode, setAdsMode] = useState('all');

	const [history, setHistory] = useState([PANEL_ADS]);
	const [historyLen, setHistoryLen] = useState(1);

	const [historyAds, setHistoryAds] = useState([]);
	const [historyProfile, setHistoryProfile] = useState([]);

	const [profileID, setProfileID] = useState(0);
	const [notsCounterr, setNotsCounterr] = useState(notsCounterr);

	const [prevActiveStory, setPrevActiveStory] = useState(no_prev);
	const [activeStory, setActiveStory] = useState(ads);
	const [category, setCategory] = useState(CategoryNo);
	const [category2, setCategory2] = useState(CategoryNo);

	const [activePanel, setActivePanel] = useState(PANEL_ADS);
	const [activeModal, setActiveModal] = useState(null);
	const [activeModal2, setActiveModal2] = useState(null);
	const [snackbar, setSnackbar] = useState(null);

	const [choosen, setChoosen] = useState(AdDefault);

	const [vkPlatform, setVkPlatform] = useState('no');
	const [appID, setAppID] = useState(0);

	const [deleteID, SetDeleteID] = useState(-1);

	const [wsToken, setWsToken] = useState('');

	const [city, setCity] = useState(NoRegion);
	const [country, setCountry] = useState(NoRegion);

	const [sort, setSort] = useState('time');

	const [savedAdState, setSavedAdState] = useState('');

	const [myID, setMyID] = useState(0);

	const onStoryChange = (e) => {
		const isProfile = e.currentTarget.dataset.text == profileText;
		console.log('my id is ', e.currentTarget.dataset.text, isProfile);

		if (e.currentTarget.dataset.story == ads) {
			if (isProfile) {
				setActivePanel(PANEL_USER);
				setPrevActiveStory(no_prev);
				setProfileID(myID);
			} else {
				setActivePanel(PANEL_ADS);
				setSavedAdState('');
			}
		}
		scroll();
		setActiveStory(e.currentTarget.dataset.story);
		setHistory([PANEL_ADS]);
	};

	function next(currPanel, newPanel) {
		setHistoryLen(history.length + 1);
		let a = history.slice();
		a.push(currPanel);
		setHistory(a);
		setActivePanel(newPanel);
	}

	function back() {
		let a = history.slice();
		let panel = a.pop();
		setHistory(a);
		setActivePanel(panel);
	}

	function openAd(ad, currPanel) {
		setActiveStory(ads);
		setChoosen(ad);
		next(currPanel, PANEL_ONE);

		let a = historyAds.slice();
		a.push(ad);
		setHistoryAds(a);

		scroll();
	}

	function openUser(id, currPanel) {
		setActiveStory(ads);
		setProfileID(id);
		setPrevActiveStory('ads');
		next(currPanel, PANEL_USER);

		let a = historyProfile.slice();
		a.push(id);
		setHistoryProfile(a);

		scroll();
	}

	useEffect(() => {
		console.log('checker', historyLen, history.length);

		if (historyLen == history.length) {
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
		console.log('infos', adsLength, usersLength, a.length, p.length);

		if (adsLength != a.length) {
			const ad = a.pop();
			setChoosen(ad);
			console.log('setChoosen', adsLength, usersLength);
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
	// 	centrifuge.disconnect();
	// 	turnOnNotifications();

	// 	oldChoosen = choosen;
	// 	console.log('connecting', oldChoosen.ad_id);
	// 	centrifuge.subscribe('ad_' + oldChoosen.ad_id, (note) => {
	// 		console.log('centrifugu notenote', note);
	// 		setwsNote(note)
	// 	});
	// 	centrifuge.connect();
	// }, [choosen]);

	useEffect(() => {
		setPopout(<ScreenSpinner size="large" />);
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		function getInputData() {
			const { vk_platform, app_id } = inputArgs();
			console.log('vksssss', vk_platform, app_id);
			setVkPlatform(vk_platform);
			setAppID(app_id);
		}

		async function fetchData() {
			const us = await bridge.send('VKWebAppGetUserInfo');
			VkUser.dispatch({ type: 'set', new_state: us });
			console.log('fetchData', us.id);
			setMyID(us.id);

			await Auth(
				us,
				setSnackbar,
				setPopout,
				(v) => {
					setInited(true);

					getToken(
						setSnackbar,
						(v) => {
							setWsToken(v);
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
		}

		getInputData();
		fetchData();
	}, []);
	if (!inited) {
		return snackbar;
	}

	return (
		<ConfigProvider isWebView={true}>
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
							appID={appID}
							apiVersion={ApiVersion}
							vkPlatform={vkPlatform}
							activeModal={activeModal}
							setActiveModal={setActiveModal}
							category={category}
							setCategory={setCategory}
							city={city}
							country={country}
							// region={region}
							setCity={setCity}
							setCountry={setCountry}
							// setRegion={setRegion}
							sort={sort}
							setSort={setSort}
							setPopout={setPopout}
							setSnackbar={setSnackbar}
							ad={choosen}
						/>
					}
					header={false}
				>
					<Panel id={PANEL_ADS} separator={false}>
						<AddsTabs
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
							dropFilters={() => {
								setCategory(CategoryNo);
								setCity(NoRegion);
								setCountry(NoRegion);
							}}
							chooseAdd={(ad) => {
								setChoosen(ad);
							}}
							openAd={(ad) => {
								openAd(ad, PANEL_ADS);
							}}
							vkPlatform={vkPlatform}
						/>
						{snackbar}
					</Panel>
					<Panel id={PANEL_ONE}>
						<PanelHeaderSimple left={<PanelHeaderBack onClick={back} />}>
							{choosen ? choosen.header : 'Произошла ошбка'}
						</PanelHeaderSimple>
						{choosen ? (
							<AddMore2
								wsNote={wsNote}
								refresh={(id) => {
									back();
									SetDeleteID(id);
									scroll();
								}}
								back={back}
								openUser={(id) => {
									openUser(id, PANEL_ONE);
									setChoosen(choosen);
								}}
								ad={choosen}
								setPopout={setPopout}
								setSnackbar={setSnackbar}
								VkUser={VkUser}
								vkPlatform={vkPlatform}
								onCloseClick={() => setActiveModal(MODAL_SUBS)}
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
							Профиль
						</PanelHeaderSimple>
						<Profile
							setAdsMode={setAdsMode}
							setPopout={setPopout}
							setSnackbar={setSnackbar}
							myID={myID}
							profileID={profileID}
							appID={appID}
							apiVersion={ApiVersion}
							goToAdds={() => {
								setActiveStory(ads);
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
				</View>

				<View
					id={add}
					activePanel={add}
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
					<Panel id={add}>
						<PanelHeader>{addText}</PanelHeader>
						<CreateAdd
							vkPlatform={vkPlatform}
							myID={myID}
							appID={appID}
							apiVersion={ApiVersion}
							setPopout={setPopout}
							goToAds={goToAds}
							snackbar={snackbar}
							setSnackbar={setSnackbar}
							category={category2}
							refresh={(id) => {
								SetDeleteID(id);
							}}
							chooseCategory={() => setActiveModal2(MODAL_CATEGORIES)}
						/>
						{snackbar}
					</Panel>
				</View>
			</Epic>
		</ConfigProvider>
	);
};

export default Main;

// 477 -> 516
