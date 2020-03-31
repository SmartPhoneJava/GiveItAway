import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';
import {
	Button,
	Textarea,
	Card,
	Radio,
	Group,
	Header,
	CardGrid,
	CellButton,
	Select,
	FormLayout,
	Div,
	InfoRow,
	Checkbox,
	Cell,
	SelectMimicry,
	Separator,
	ScreenSpinner,
	Snackbar,
	Avatar,
} from '@vkontakte/vkui';

import Geocoder from 'react-native-geocoding';

import CreateItem from './components/CreateItem';
import ChooseAddType from './components/ChooseType';
import ChooseFeedback from './components/ChooseFeedback';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

import { User } from '../../../store/user';
import { Addr } from '../../../store/addr';

import { CategoryNo } from './../../template/Categories';

import Icon24Locate from '@vkontakte/icons/dist/32/place';

let itemID = 1;

let request_id = 0;

const CreateAdd = props => {
	const [items, setItems] = useState([
		{
			id: itemID,
			name: '',
			category: '',
			description: '',
			photos: [],
		},
	]);

	const [description, setDescription] = useState('');
	const [hideGeo, setHideGeo] = useState(false);
	const [geodata, setGeodata] = useState({
		long: '0',
		lat: '0',
	});
	const [adress, setAdress] = useState('Не указан');
	const [valid, setValid] = useState(false);
	const [contacts, setContacts] = useState('');
	const [feedbackType, setFeedbackType] = useState('ls');
	const [itemDescription, setItemDescription] = useState(false);

	const [countries, setCountries] = useState([{ id: 1, title: '' }]);
	const [regions, setRegions] = useState([{ id: 1, title: '' }]);
	const [cities, setCities] = useState([{ id: 1, title: '' }]);

	const [city, setCity] = useState({ id: -1, title: '' });
	const [country, setCountry] = useState({ id: 1, title: 'Россия' });
	const [region, setRegion] = useState({ id: -1, title: '' });
	const [accessToken, setAccessToken] = useState('');

	useEffect(() => {
		console.log('appID', props.appID);
		async function loadDatabaseInfo() {
			const el = await bridge.send('VKWebAppGetAuthToken', { app_id: props.appID, scope: '' });
			setAccessToken(el.access_token);
			const ctrs = await bridge.send('VKWebAppCallAPIMethod', {
				method: 'database.getCountries',
				request_id: 'api' + request_id,
				params: { v: props.apiVersion, access_token: el.access_token },
			});

			console.log('el.access_token', el.access_token);
			request_id++;
			setCountries(ctrs.response.items);
			updateRegions(1, el.access_token);
			updateCities(1, null, el.access_token);
		}
		loadDatabaseInfo();
	}, []);
	useEffect(() => {
		let v = true;
		items.forEach(val => {
			console.log('item!!!!', val, props.category);
			if (val.name === undefined || val.name.length == 0) {
				v = false;
			}
			if (val.description === undefined || val.description.length == 0) {
				v = false;
			}
			if (props.category === undefined || props.category.length == 0 || props.category == CategoryNo) {
				v = false;
			}
		});
		if (feedbackType == 'other' && contacts == '') {
			v = false;
		}
		if (city.id < 0 || region.id < 0) {
			v = false;
		}
		setValid(v);
	}, [items, props.category, feedbackType, contacts, country, city, region]);

	function updateGeo() {
		async function fetchData() {
			const value = await bridge.send('VKWebAppGetGeodata');
			setGeodata(value);

			console.log('geodata:', value);
			setAdress(Math.floor(value.long) + ':' + Math.floor(value.lat));
			/*
      Geocoder.init("no_code_here");
      Geocoder.from(value.lat, value.long)
        .then(json => {
          var addressComponent = json.results[0].address_components[0];
          console.log("addressComponent:", addressComponent);
          setAdress(addressComponent);
        })
        .catch(error => {
          console.warn(error);
          setAdress("Город не обнаружен");
        });*/
		}

		fetchData();
	}
	useEffect(() => {
		updateGeo();
	}, []);

	async function updateRegions(id, token) {
		const rgs = await bridge.send('VKWebAppCallAPIMethod', {
			method: 'database.getRegions',
			request_id: 'region' + request_id,
			params: { v: props.apiVersion, access_token: token, country_id: id },
		});

		request_id++;
		console.log('regions:', rgs);
		setRegions(rgs.response.items);
	}

	async function updateCities(id, rgs, token) {
		const params = { v: props.apiVersion, access_token: token, country_id: id };
		console.log('region', region);
		// if (rgs) {
		// 	console.log('region exist', rgs);
		// 	params.region_id = rgs.id;
		// }
		const ci = await bridge.send('VKWebAppCallAPIMethod', {
			method: 'database.getCities',
			request_id: 'city' + request_id,
			params: params,
		});

		request_id++;
		console.log('cities:', ci);
		setCities(ci.response.items);
	}

	function saveSuccess(goToAds, id) {
		items.forEach(item => {
			item.photos.forEach(photo => {
				const data = new FormData();
				console.log('fiile', photo);
				data.append('file', photo);

				axios
					.post(Addr.getState() + '/api/ad/' + id + '/upload_image', data)
					.then(function(response) {
						console.log('success uploaded', response);
					})
					.catch(function(error) {
						console.log('failed uploaded', error);
					});
			});
		});

		goToAds(
			<Snackbar
				onClose={() => {
					props.setSnackbar(null);
				}}
				action="Отменить"
				onActionClick={() => {
					/* тут запрос на удаление */
				}}
				before={
					<Avatar size={24} style={{ background: 'green' }}>
						<Icon24DoneOutline fill="#fff" width={14} height={14} />
					</Avatar>
				}
			>
				Объявление создано! Спасибо, что делаете мир лучше :)
			</Snackbar>
		);
	}

	function saveFail(err, repeat) {
		props.setSnackbar(
			<Snackbar
				onClose={() => props.setSnackbar(null)}
				action="Повторить"
				onActionClick={() => {
					props.setSnackbar(null);
					repeat();
				}}
				before={
					<Avatar size={24} style={{ background: 'red' }}>
						<Icon24Cancel fill="#fff" width={14} height={14} />
					</Avatar>
				}
			>
				Произошла ошибка: {err}
			</Snackbar>
		);
	}

	function saveCancel() {
		props.setSnackbar(
			<Snackbar
				onClose={() => props.setSnackbar(null)}
				before={
					<Avatar size={24} style={{ background: 'orange' }}>
						<Icon24Favorite fill="#fff" width={14} height={14} />
					</Avatar>
				}
			>
				Пожалуйста, заполните все обязательные поля.
			</Snackbar>
		);
	}

	function createAd(setPopout) {
		if (valid) {
			setPopout(<ScreenSpinner size="large" />);
			const obj = JSON.stringify({
				author_id: User.getState().vk_id,
				header: items[0].name,
				text: items[0].description,
				is_auction: false,
				feedback_type: feedbackType,
				extra_field: contacts,
				geo_position: {
					long: geodata.long,
					lat: geodata.lat,
				},
				status: 'offer',
				category: items[0].category,
				comments_count: 0,
			});
			console.log('loook at me', obj);

			let cancel;

			axios({
				method: 'post',
				url: Addr.getState() + '/api/ad/create',
				data: obj,
				cancelToken: new axios.CancelToken(c => (cancel = c)),
			})
				.then(function(response) {
					console.log('Вот ответ от бека на запрос создания объявления ', response);
					console.log('json json json ', response.data);
					setPopout(null);
					if (response.status == 201) {
						saveSuccess(props.goToAds, response.data.ad_id);
					} else {
						saveFail(response.status + ' - ' + response.statusText, () => createAd(setPopout));
					}
					return response.data;
				})
				.catch(function(error) {
					console.log('Request failed', error);
					setPopout(null);
					saveFail('Нет соединения с сервером', () => createAd(setPopout));
				});
		} else {
			saveCancel();
		}
	}

	return (
		<div>
			{/*
      <Separator />
      <ChooseAddType set={setAddType}/>
      <FormLayout>
        <Textarea
          top="Описание"
          name="Описание"
          placeholder="..."
          value={description}
          onChange={e => {
            const { _, value } = e.currentTarget;
            setDescription(value);
          }}
        />
      </FormLayout>
      <Separator />
        */}
			<Group separator="hide" header={<Header mode="secondary">Опишите выставляемые предметы</Header>}>
				{items.map((item, i) => (
					<CreateItem
						key={item.id}
						item={item}
						len={items.length}
						deleteMe={() => {
							setItems([...items.slice(0, i), ...items.slice(i + 1)]);
						}}
						setSnackbar={props.setSnackbar}
						choose={props.chooseCategory}
						amount={item.amount}
						name={item.name}
						setItems={newItem => {
							newItem.id = items[i].id;
							items[i] = newItem;
							setItems([...items]);
						}}
						category={props.category}
						description={item.description}
					/>
				))}

				{items.length == 1 ? (
					''
				) : (
					<InfoRow
						style={{
							color: 'grey',
							margin: '12px',
						}}
					>
						Вы указали несколько вещей, поэтому будет создано несколько объявлений: по одному на каждый
						предмет.
					</InfoRow>
				)}

				<Div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{/*
          <CellButton
            onClick={() => {
              setItems([
                ...items,
                {
                  id: ++itemID,
                  amount: "1",
                  name: "",
                  category: "",
                  description: ""
                }
              ]);
            }}
            before={<Icon24Add />}
          >
            Добавить предмет
          </CellButton> */}
				</Div>
			</Group>
			<Separator />

			{/** 
			<Div
				style={{
					padding: '10px',
					display: 'flex',
				}}
			>
				<Cell indicator={<Icon24Locate />} onClick={updateGeo}></Cell>
				<Cell
					indicator={
						<Div
							style={{
								padding: '0px',
								display: 'flex',
							}}
						>
							<Checkbox
								value={hideGeo}
								onClick={e => {
									setHideGeo(!hideGeo);
								}}
							>
								Не указывать
							</Checkbox>
						</Div>
					}
				>
					<InfoRow style={{ color: hideGeo ? 'grey' : 'black' }} header="Местоположение">
						{!hideGeo ? adress : 'Скрыто'}
					</InfoRow>
				</Cell>
			</Div>
			*/}
			<Div
				style={{
					display: 'flex',
					padding: '0px',
				}}
			>
				<FormLayout>
					<Select
						top="Страна"
						placeholder="Россия"
						onClick={e => {
							const c = countries[e.target.value];
							setCountry(c);
							setRegion({ id: -1, title: '' })
							setCity({ id: -1, title: '' })
							updateRegions(c.id, accessToken);
							updateCities(c.id, null, accessToken);
						}}
					>
						{countries.map((v, i) => {
							if (v == country) {
								return (
									<option key={v.id} value={i} defaultChecked>
										{v.title}
									</option>
								);
							}
							return (
								<option key={v.id} value={i}>
									{v.title}
								</option>
							);
						})}
					</Select>
				</FormLayout>

				<FormLayout>
					<Select
						top="Регион"
						placeholder="Не указан"
						onClick={e => {
							const c = regions[e.target.value];
							setRegion(c);
							updateCities(country.id, c, accessToken);
						}}
					>
						{regions.map((v, i) => {
							if (v == region) {
								return (
									<option key={v.id} value={i} defaultChecked>
										{v.title}
									</option>
								);
							}
							return (
								<option key={v.id} value={i}>
									{v.title}
								</option>
							);
						})}
					</Select>
				</FormLayout>

				<FormLayout>
					<Select
						top="Город"
						placeholder="Не указан"
						onClick={e => {
							const c = cities[e.target.value];
							setCity(c);
						}}
					>
						{cities.map((v, i) => {
							if (v == city) {
								return (
									<option key={v.id} value={i} defaultChecked>
										{v.title}
									</option>
								);
							}
							return (
								<option key={v.id} value={i}>
									{v.title}
								</option>
							);
						})}
					</Select>
				</FormLayout>
			</Div>
			<Separator />
			<ChooseFeedback
				setFeedbackType={setFeedbackType}
				feedbackType={feedbackType}
				setContacts={setContacts}
				contacts={contacts}
			/>
			{valid ? (
				''
			) : (
				<InfoRow
					style={{
						color: 'grey',
						margin: '12px',
					}}
				>
					Вы не заполнили некоторые обязательные поля. Проверьте, указаны ли имена, описания и категории
					предметов.
				</InfoRow>
			)}
			<Div style={{ display: 'flex' }}>
				<Button
					onClick={() => createAd(props.setPopout)}
					mode={valid ? 'commerce' : 'secondary'}
					size="l"
					stretched
					style={{ marginRight: 8 }}
				>
					Добавить
				</Button>
			</Div>
		</div>
	);
};

export default CreateAdd;
