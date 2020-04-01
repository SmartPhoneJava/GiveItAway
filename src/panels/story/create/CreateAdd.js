import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';
import {
	Button,
	Group,
	Header,
	Div,
	InfoRow,
	Separator,
	ScreenSpinner,
	Snackbar,
	Avatar,
} from '@vkontakte/vkui';

import Geocoder from 'react-native-geocoding';

import CreateItem from './components/CreateItem';
import ChooseFeedback from './components/ChooseFeedback';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

import { User } from '../../../store/user';
import { Addr } from '../../../store/addr';

import { CategoryNo } from './../../template/Categories';

import {Location, NoRegion} from "./../../template/Location"

let itemID = 1;

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
		long: -1,
		lat: -1,
	});
	
	const [adress, setAdress] = useState('Не указан');
	const [valid, setValid] = useState(false);
	const [contacts, setContacts] = useState('');
	const [feedbackType, setFeedbackType] = useState('ls');
	const [itemDescription, setItemDescription] = useState(false);

	const [city, setCity] = useState(NoRegion);
	const [country, setCountry] = useState({ id: 1, title: 'Россия' });
	const [region, setRegion] = useState(NoRegion);

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

	function saveSuccess(goToAds, id) {
		items.forEach(item => {
			item.photos.forEach(photo => {
				const data = new FormData();
				console.log('fiile', photo);
				data.append('file', photo);
				let cancel;

				axios({
					method: 'post',
					url: Addr.getState() + '/api/ad/' + id + '/upload_image',
					withCredentials: true,
					data: data,
					cancelToken: new axios.CancelToken(c => (cancel = c)),
				})
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
					deleteAd(props.setPopout, id, props.setSnackbar, props.refresh);
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
			const ob = {
				author_id: User.getState().vk_id,
				header: items[0].name,
				text: items[0].description,
				is_auction: false,
				feedback_type: feedbackType,
				extra_field: contacts,
				status: 'offer',
				category: props.category,
				region: region.title,
				district: city.title,
				comments_count: 0,
			};
			if (geodata.long > 0) {
				ob.geo_position = {
					long: geodata.long,
					lat: geodata.lat,
				};
			}
			const obj = JSON.stringify(ob);
			console.log('loook at me', obj);

			let cancel;

			axios({
				method: 'post',
				url: Addr.getState() + '/api/ad/create',
				withCredentials: true,
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
						saveFail(
							response.status + ' - ' + response.statusText,
							() => createAd(setPopout),
							props.setSnackbar
						);
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
						vkPlatform={props.vkPlatform}
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
			{Location(
				props.appID,
				props.apiVersion,
				props.vkPlatform,
				country,
				setCountry,
				region,
				setRegion,
				city,
				setCity
			)}
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

export const deleteAd = (setPopout, ad_id, setSnackbar, refresh) => {
	setPopout(<ScreenSpinner size="large" />);
	let cancel;

	axios({
		method: 'post',
		withCredentials: true,
		url: Addr.getState() + '/api/ad/' + ad_id + '/delete',
		cancelToken: new axios.CancelToken(c => (cancel = c)),
	})
		.then(function(response) {
			setPopout(null);
			if (response.status != 200) {
				saveFail(
					response.status + ' - ' + response.statusText,
					() => deleteAd(setPopout, ad_id, setSnackbar, refresh),
					setSnackbar
				);
			} else {
				refresh(ad_id);
				console.log('i set', ad_id);
				setSnackbar(
					<Snackbar
						onClose={() => {
							setSnackbar(null);
						}}
						before={
							<Avatar size={24} style={{ background: 'green' }}>
								<Icon24DoneOutline fill="#fff" width={14} height={14} />
							</Avatar>
						}
					>
						Объявление удалено!
					</Snackbar>
				);
			}
			return response.data;
		})
		.catch(function(error) {
			console.log('Request failed', error);
			setPopout(null);
			saveFail('Нет соединения с сервером', () => deleteAd(setPopout, ad_id, setSnackbar, refresh), setSnackbar);
		});
};

function saveFail(err, repeat, setSnackbar) {
	setSnackbar(
		<Snackbar
			onClose={() => setSnackbar(null)}
			action="Повторить"
			onActionClick={() => {
				setSnackbar(null);
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

export default CreateAdd;

// 609 -> 462
