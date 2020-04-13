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
	PanelHeaderButton,
	PanelHeaderSimple,
	Placeholder,
	Button,
} from '@vkontakte/vkui';

import Icon28ArrowLeftOutline from '@vkontakte/icons/dist/28/arrow_left_outline';
import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';

import AddsTabs from './story/adds/AddsTabs';
import CreateAdd from './story/create/CreateAdd';

import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28Add from '@vkontakte/icons/dist/28/add_outline';

import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

import { VkUser } from '../store/vkUser';

import AddMore, { AdDefault } from './template/AddMore';
import AddMore2 from './template/AddMore2';
import Comments from './story/adds/tabs/comments/comments';

import { CategoryNo } from './template/Categories';

import { Auth, getToken } from './../requests';

import Error from './placeholders/error';

import { NoRegion } from './template/Location';

import Profile from './story/profile/Profile';

import AddsModal, { MODAL_FILTERS, MODAL_CATEGORIES, MODAL_SUBS } from './story/adds/AddsModal';
import CreateModal from './story/create/CreateModal';

import { AddrWS } from './../store/addr_ws';

import Centrifuge from 'centrifuge';

const ads = 'ads';
const adsText = 'Объявления';

const add = 'add';
const addText = 'Создать';

const profile = 'profile';
const profileText = 'Профиль';

const ApiVersion = '5.5';

const addr = AddrWS.getState() + '/connection/websocket';
let centrifuge = new Centrifuge(addr);

const Main = () => {
	const [popout, setPopout] = useState(null); //<ScreenSpinner size="large" />
	const [inited, setInited] = useState(false);

	const [profileID, setProfileID] = useState(0);

	const [activeStory, setActiveStory] = useState(ads);
	const [category, setCategory] = useState(CategoryNo);
	const [category2, setCategory2] = useState(CategoryNo);

	const onStoryChange = (e) => {
		console.log('my id is ', myID, e.currentTarget.dataset.story, profileID);
		setActiveStory(e.currentTarget.dataset.story);
		if (e.currentTarget.dataset.story == ads) {
			setActivePanel('header-search');
		} else if (e.currentTarget.dataset.story == profile) {
			console.log('i set it ', myID);
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

	const [wsToken, setWsToken] = useState();

	const [city, setCity] = useState(NoRegion);
	const [country, setCountry] = useState(NoRegion);
	// const [region, setRegion] = useState(NoRegion);

	const [sort, setSort] = useState('time');

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
		const us = await bridge.send('VKWebAppScroll', { top: 10000, speed: 600 });
		window.scrollTo(0, 0);
	}

	useEffect(() => {
		console.log('tryyyyy', myID);
		if (myID == 0) {
			return;
		}
		getToken(
			setSnackbar,
			(v) => {
				setWsToken(v);
				console.log('setWsToken', v.token);

				// const addr = AddrWS.getState() + '/connection/websocket';
				// console.log('before centrifuge', addr);
				// let centrifuge = new Centrifuge({ url: addr, token: v.token });
				console.log('before setToken', 'user#' + myID);
				centrifuge.setToken(v.token);
				console.log('we wanna connect', 'user#' + myID);
				centrifuge.subscribe('user#' + myID, (mes) => {
					console.log('centrifuge!', mes);
				});
				console.log(' connect', 'user#' + myID);
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

		async function getInputData() {
			var tmp = new Array(); // два вспомогательных
			var tmp2 = new Array(); // массива
			const get = new Array();
			var url = window.location.search; // строка GET запроса
			if (url != '') {
				tmp = url.substr(1).split('&'); // разделяем переменные

				for (var i = 0; i < tmp.length; i++) {
					tmp2 = tmp[i].split('='); // массив param будет содержать
					get[tmp2[0]] = tmp2[1]; // пары ключ(имя переменной)->значение
				}
			}

			const reg = /[\r\n]+/g;
			const vk_platform = get['vk_platform'] ? get['vk_platform'].replace(reg, '\n') : 'desktop';
			setVkPlatform(vk_platform);
			setAppID(parseInt(get['vk_app_id']));
		}

		async function fetchData() {
			const us = await bridge.send('VKWebAppGetUserInfo');
			VkUser.dispatch({ type: 'set', new_state: us });
			setMyID(us.id);
			Auth(
				us,
				setSnackbar,
				setPopout,
				(v) => {
					setInited(true);
				},
				(e) => {}
			);
		}

		getInputData();
		fetchData();
	}, []);

	return (
		<>
			{inited ? (
				<Epic
					activeStory={activeStory}
					tabbar={
						<Tabbar>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === ads}
								data-story={ads}
								text={adsText}
							>
								<Icon28NewsfeedOutline />
							</TabbarItem>

							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === add}
								data-story={add}
								text={addText}
							>
								<Icon28Add />
							</TabbarItem>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === profile}
								data-story={profile}
								text={profileText}
							>
								<Icon28User />
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
								onFiltersClick={() => setActiveModal(MODAL_FILTERS)}
								onCloseClick={(act) => {
									setActiveModal(MODAL_SUBS);
									scroll();
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
									console.log('looook:', ad);
									setActivePanel('one-panel');
									scroll();
								}}
							/>
							{snackbar}
						</Panel>
						<Panel id="one-panel">
							<PanelHeaderSimple
								left={
									<PanelHeaderBack
										onClick={() => {
											setActivePanel('header-search');
											scroll();
										}}
									/>
								}
							>
								{choosen ? choosen.header : 'баг'}
							</PanelHeaderSimple>
							{choosen ? (
								<AddMore2
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
						<Panel id="comments">
							<PanelHeaderSimple
								left={
									<PanelHeaderBack
										onClick={() => {
											setActivePanel('one-panel');
											scroll();
										}}
									/>
								}
							>
								Комментарии
							</PanelHeaderSimple>
							{choosen ? (
								<Comments
									back={(id) => {
										setActivePanel('one-panel');
										scroll();
									}}
									ad={choosen}
									setPopout={setPopout}
									setSnackbar={setSnackbar}
									VkUser={VkUser}
									vkPlatform={vkPlatform}
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
							<PanelHeader>{profileText} </PanelHeader>
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
									console.log('looook:', ad);
									setActiveStory(ads);
									setActivePanel('one-panel');
									scroll();
								}}
							/>
							{/* <Placeholder
								icon={<Icon56UsersOutline />}
								header="В разработке. Загляните позже &#128522;"
								action={
									<Button onClick={() => setActiveStory(ads)} size="l">
										Вернуться к ленте объявлений
									</Button>
								}
								stretched={true}
							>
								Мы упорно трудимся над вашим профилем!
							</Placeholder> */}
							{snackbar}
						</Panel>
					</View>
				</Epic>
			) : (
				''
			)}
		</>
	);
};

export default Main;
