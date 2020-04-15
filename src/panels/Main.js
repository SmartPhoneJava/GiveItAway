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
	PanelHeaderContent,
	Counter,
} from '@vkontakte/vkui';

import AddsTabs from './story/adds/AddsTabs';
import CreateAdd from './story/create/CreateAdd';

import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28Add from '@vkontakte/icons/dist/28/add_outline';

import { VkUser } from '../store/vkUser';

import AddMore, { AdDefault } from './template/AddMore';
import AddMore2 from './template/AddMore2';
import { CategoryNo } from './template/Categories';

import { Auth, getToken } from './../requests';

import Error from './placeholders/error';

import { NoRegion } from './template/Location';

import Profile from './story/profile/Profile';

import { setOnline } from './story/profile/requests';

import AddsModal, { MODAL_FILTERS, MODAL_CATEGORIES, MODAL_SUBS } from './story/adds/AddsModal';
import CreateModal from './story/create/CreateModal';

import { AddrWS } from './../store/addr_ws';

import { inputArgs } from './../utils/window';

import Centrifuge from 'centrifuge';

const ads = 'ads';
const adsText = 'Объявления';

const add = 'add';
const addText = 'Создать';

const profile = 'profile';
const profileText = 'Профиль';

const ApiVersion = '5.5';

const no_prev = 'no prev';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

let notsCounterr = 0;

let oldChoosen = { ad_id: -1 };

const Main = () => {
	const [popout, setPopout] = useState(null); //<ScreenSpinner size="large" />
	const [inited, setInited] = useState(false);

	const [profileID, setProfileID] = useState(0);

	const [prevActiveStory, setPrevActiveStory] = useState(no_prev);
	const [activeStory, setActiveStory] = useState(ads);
	const [category, setCategory] = useState(CategoryNo);
	const [category2, setCategory2] = useState(CategoryNo);

	const onStoryChange = (e) => {
		console.log('my id is ', myID, e.currentTarget.dataset.story, profileID);
		setActiveStory(e.currentTarget.dataset.story);
		if (e.currentTarget.dataset.story == ads) {
			setActivePanel('header-search');
			setSavedAdState('');
		} else if (e.currentTarget.dataset.story == profile) {
			console.log('i set it ', myID);
			setPrevActiveStory(no_prev);
			setProfileID(myID);
		}
		scroll();
	};

	const [activePanel, setActivePanel] = useState('header-search');
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

	function goSearch() {
		setActivePanel('search');
	}

	function goToAds(snack) {
		setActiveStory(ads);
		if (snack != undefined) {
			setSnackbar(snack);
		}
	}

	async function scroll() {
		await bridge.send('VKWebAppScroll', { top: 10000, speed: 600 });
		window.scrollTo(0, 0);
		setOnline(
			appID,
			ApiVersion,
			(v) => {},
			(e) => {}
		);
	}

	const [wsNote, setwsNote]=useState({notification_type:"no"})

	function turnOnNotifications() {
		centrifuge.subscribe('user#' + myID, (mes) => {
			notsCounterr++;
		});
	}

	useEffect(() => {
		console.log('choosen', choosen.ad_id);
		if (choosen.ad_id == -1) {
			return;
		}
		centrifuge.disconnect();
		turnOnNotifications();

		oldChoosen = choosen;
		console.log('connecting', oldChoosen.ad_id);
		centrifuge.subscribe('ad_' + oldChoosen.ad_id, (note) => {
			console.log('centrifugu notenote', note);
			setwsNote(note)
		});
		centrifuge.connect();
	}, [choosen]);

	useEffect(() => {
		if (myID == 0) {
			return;
		}

		getToken(
			setSnackbar,
			(v) => {
				setWsToken(v);
				centrifuge.setToken(v.token);
				turnOnNotifications();
				centrifuge.connect();
			},
			(e) => {}
		);
	}, [myID]);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		function getInputData() {
			const { vk_platform, app_id } = inputArgs();
			console.log("vksssss", vk_platform, app_id)
			setVkPlatform(vk_platform);
			setAppID(app_id);
		}

		async function fetchData() {
			const us = await bridge.send('VKWebAppGetUserInfo');
			VkUser.dispatch({ type: 'set', new_state: us });
			console.log("fetchData", us.id)
			setMyID(us.id);

			await Auth(
				us,
				setSnackbar,
				setPopout,
				(v) => {
					console.log("we auth!")
					setInited(true);
				},
				(e) => {}
			);
		}

		getInputData();
		fetchData();
	}, []);

	return (
		<Epic
			activeStory={activeStory}
			tabbar={
				<Tabbar>
					<TabbarItem
						onClick={onStoryChange}
						selected={activeStory === ads}
						data-story={ads}
						text={adsText}
						label={notsCounterr == 0 ? null : notsCounterr}
						after={<Counter>100</Counter>}
						// after={notsCounter == 0 ? '' : <Counter>notsCounter</Counter>}
					>
						<Icon28NewsfeedOutline onClick={onStoryChange} />
					</TabbarItem>

					<TabbarItem onClick={onStoryChange} selected={activeStory === add} data-story={add} text={addText}>
						<Icon28Add onClick={onStoryChange} />
					</TabbarItem>
					<TabbarItem
						onClick={onStoryChange}
						selected={activeStory === profile}
						data-story={profile}
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
				<Panel id="header-search" separator={false}>
					<AddsTabs
						setSavedAdState={setSavedAdState}
						savedAdState={savedAdState}
						onFiltersClick={() => setActiveModal(MODAL_FILTERS)}
						onCloseClick={(act) => {
							setActiveModal(MODAL_SUBS);
							scroll();
						}}
						notsCounter={notsCounterr}
						zeroNots={() => {
							notsCounterr = 0;
						}}
						goSearch={goSearch}
						setPopout={setPopout}
						setSnackbar={setSnackbar}
						category={category}
						refresh={SetDeleteID}
						deleteID={deleteID}
						city={city}
						country={country}
						myID={myID}
						openUser={(id) => {
							setProfileID(id);
							setActiveStory(profile);
							setPrevActiveStory('ads');
							setActivePanel('header-search');
							setChoosen(AdDefault);
							scroll();
						}}
						// region={region}
						sort={sort}
						dropFilters={() => {
							setCategory(CategoryNo);
							setCity(NoRegion);
							setCountry(NoRegion);
							// setRegion(NoRegion);
						}}
						chooseAdd={(ad) => {
							setChoosen(ad);
						}}
						openAd={(ad) => {
							setChoosen(ad);
							setActivePanel('one-panel');
							scroll();
						}}
						vkPlatform={vkPlatform}
					/>
					{snackbar}
				</Panel>
				<Panel id="one-panel">
					<PanelHeaderSimple
						left={
							<PanelHeaderBack
								onClick={() => {
									setActivePanel('header-search');
								}}
							/>
						}
					>
						{choosen ? choosen.header : 'Произошла ошбка'}
					</PanelHeaderSimple>
					{choosen ? (
						<AddMore2
							wsNote={wsNote}
							refresh={(id) => {
								setActivePanel('header-search');
								SetDeleteID(id);
								scroll();
							}}
							back={(id) => {
								setActivePanel('header-search');
							}}
							commentsOpen={() => {
								setActivePanel('comments');
								scroll();
							}}
							openUser={(id) => {
								setProfileID(id);
								setActiveStory(profile);
								setPrevActiveStory('ads');
								setActivePanel('one-panel');
								setChoosen(choosen);
								scroll();
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
			<View id={profile} activePanel={profile} popout={popout}>
				<Panel id={profile}>
					<PanelHeader
						left={
							prevActiveStory == no_prev ? null : (
								<PanelHeaderBack
									onClick={() => {
										setActiveStory(prevActiveStory);
									}}
								/>
							)
						}
					>
						{profileText}
					</PanelHeader>
					<Profile
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
							setChoosen(ad);
							setActiveStory(ads);
							setActivePanel('one-panel');
							scroll();
						}}
					/>
					{snackbar}
				</Panel>
			</View>
		</Epic>
	);
};

export default Main;

// 477
