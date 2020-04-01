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

import AddsTabs from './story/adds/AddsTabs';
import CreateAdd from './story/create/CreateAdd';

import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28Add from '@vkontakte/icons/dist/28/add_outline';

import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

import { User } from '../store/user';
import { VkUser } from '../store/vkUser';

import AddMore, { AdDefault } from './template/AddMore';

import { Addr } from '../store/addr';
import { CategoryNo } from './template/Categories';

import Error from './placeholders/error';

import {NoRegion} from './template/Location'

import AddsModal, { MODAL_FILTERS, MODAL_CATEGORIES } from './story/adds/AddsModal';
import CreateModal from './story/create/CreateModal';

const ads = 'ads';
const adsText = 'Объявления';

const add = 'add';
const addText = 'Создать';

const profile = 'profile';
const profileText = 'Профиль';

const ApiVersion = '5.5';

const Main = () => {
	const [popout, setPopout] = useState(null); //<ScreenSpinner size="large" />

	const [activeStory, setActiveStory] = useState(ads);
	const [category, setCategory] = useState(CategoryNo);
	const [category2, setCategory2] = useState(CategoryNo);

	const onStoryChange = e => {
		setActiveStory(e.currentTarget.dataset.story);
	};

	const [activePanel, setActivePanel] = useState('header-search');
	const [activeModal, setActiveModal] = useState(null);
	const [activeModal2, setActiveModal2] = useState(null);
	const [snackbar, setSnackbar] = useState(null);

	const [choosen, setChoosen] = useState(AdDefault);

	const [vkPlatform, setVkPlatform] = useState('no');
	const [appID, setAppID] = useState(0);

	const [deleteID, SetDeleteID] = useState(-1);

	const [city, setCity] = useState(NoRegion);
	const [country, setCountry] = useState({ id: 1, title: 'Россия' });
	const [region, setRegion] = useState(NoRegion);

	function goSearch() {
		setActivePanel('search');
	}

	function goToAds(snack) {
		setActiveStory(ads);
		if (snack != undefined) {
			setSnackbar(snack);
		}
	}

	function refresh() {
		setActiveStory(profile);
		setRefreshList(refreshList + 1);
		setActiveStory(ads);
	}

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
			const vk_platform = get['vk_platform'].replace(reg, '\n');
			setVkPlatform(vk_platform);
			setAppID(parseInt(get['vk_app_id']));
		}

		async function checkMe(user) {
			console.log('secret:', window.location.href);
			console.log('user user:', user);
			fetch(Addr.getState() + `/api/user/auth`, {
				method: 'post',
				mode: 'cors',
				body: JSON.stringify({
					vk_id: user.id,
					Url: window.location.href,
					name: user.first_name,
					surname: user.last_name,
					photo_url: user.photo_100,
				}),
				credentials: 'include',
			})
				.then(function(response) {
					console.log('Вот ответ от бека на запрос регистрации ', response);
					return response.json();
				})
				.then(function(data) {
					User.dispatch({ type: 'set', new_state: data });
					console.log('Request successful', data.name, data.surname, data.photo_url, data.carma);
					console.log('loook at me', User.getState());
					return data;
				})
				.catch(function(error) {
					console.log('Request failed', error);
				});
			setPopout(null);
		}

		async function fetchData() {
			const us = await bridge.send('VKWebAppGetUserInfo');
			VkUser.dispatch({ type: 'set', new_state: us });
			checkMe(us);
		}

		getInputData();
		fetchData();
	}, []);

	return (
		<Epic
			activeStory={activeStory}
			tabbar={
				<Tabbar>
					<TabbarItem onClick={onStoryChange} selected={activeStory === ads} data-story={ads} text={adsText}>
						<Icon28NewsfeedOutline />
					</TabbarItem>

					<TabbarItem onClick={onStoryChange} selected={activeStory === add} data-story={add} text={addText}>
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
						region={region}
						setCity={setCity}
						setCountry={setCountry}
						setRegion={setRegion}
					/>
				}
				header={false}
			>
				<Panel id="header-search" separator={false}>
					<AddsTabs
						onFiltersClick={() => setActiveModal(MODAL_FILTERS)}
						goSearch={goSearch}
						setPopout={setPopout}
						setSnackbar={setSnackbar}
						category={category}
						refresh={SetDeleteID}
						deleteID={deleteID}
						city={city}
						country={country}
						region={region}
						dropFilters={() => {
							setCategory(CategoryNo);
						}}
						openAd={ad => {
							setChoosen(ad);
							console.log('looook:', ad);
							setActivePanel('one-panel');
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
								}}
							/>
						}
						addon={
							<PanelHeaderButton
								onClick={() => {
									setActivePanel('header-search');
								}}
							>
								Назад
							</PanelHeaderButton>
						}
					>
						{choosen ? choosen.header : 'баг'}
					</PanelHeaderSimple>
					{choosen ? (
						<AddMore
							refresh={id => {
								setActivePanel('header-search');
								SetDeleteID(id);
							}}
							ad={choosen}
							setPopout={setPopout}
							setSnackbar={setSnackbar}
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
						appID={appID}
						apiVersion={ApiVersion}
						setPopout={setPopout}
						goToAds={goToAds}
						snackbar={snackbar}
						setSnackbar={setSnackbar}
						category={category2}
						VkUser={VkUser}
						refresh={id => {
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
					<Placeholder
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
					</Placeholder>
					{snackbar}
				</Panel>
			</View>
		</Epic>
	);
};

export default Main;
