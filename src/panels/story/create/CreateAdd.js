import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	Button,
	Group,
	Header,
	Div,
	InfoRow,
	FormStatus,
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

import { CreateAd } from './../../../requests';

import { User } from '../../../store/user';

import { CategoryNo } from './../../template/Categories';

import { Location, NoRegion } from './../../template/Location';

import { canWritePrivateMessage } from './../../../requests';

let itemID = 1;

const CreateAdd = (props) => {
	const [items, setItems] = useState([
		{
			id: itemID,
			name: '',
			category: '',
			description: '',
			photos: [],
		},
	]);

	const [errorHeader, setErrorHeader] = useState('');
	const [errorText, setErrorText] = useState('');

	const [description, setDescription] = useState('');
	const [hideGeo, setHideGeo] = useState(false);
	const [geodata, setGeodata] = useState({
		long: -1,
		lat: -1,
	});

	const [valid, setValid] = useState(false);
	const [contacts, setContacts] = useState('');
	const [feedbackType, setFeedbackType] = useState('comments');
	const [itemDescription, setItemDescription] = useState(false);

	const [city, setCity] = useState(NoRegion);
	const [country, setCountry] = useState({ id: 1, title: 'Россия' });
	// const [region, setRegion] = useState(NoRegion);

	const [pmOpen, setPmOpen] = useState(true);

	useEffect(() => {
		async function fetch() {
			const canPM = await canWritePrivateMessage(props.myID, props.appID, props.apiVersion);
			console.log('setPM', canPM);
			if (canPM != undefined) {
				setPmOpen(canPM);
			}
		}
		fetch();
	}, [props.myID, props.appID]);

	useEffect(() => {
		let v = true;
		items.forEach((val) => {
			console.log('item!!!!', val, props.category);
			if (val.name === undefined || val.name.length == 0) {
				v = false;
				setErrorHeader('Не задано название предмета');
				setErrorText('Вы пропустили самый важный пункт!');
			} else if (val.name.length < 5) {
				v = false;
				setErrorHeader('Название предмета слишком короткое');
				setErrorText('Опишите чуть больше деталей!(минимум: 5 символов)');
			} else if (val.name.length > 100) {
				v = false;
				setErrorHeader('Название предмета слишком длинное');
				setErrorText('Попробуйте описать ваше объявление в двух словах!(максимум: 100 символов)');
			}
			if (val.description === undefined || val.description.length == 0 || val.name.description > 1500) {
				v = false;
				setErrorHeader('Не задано описание предмета');
				setErrorText('Опишите ваши вещи, им будет приятно!');
			} else if (val.description.length < 10) {
				v = false;
				setErrorHeader('Описание предмета слишком короткое');
				setErrorText('Больше подробностей! (минимум 10 символов)');
			} else if (val.description.length > 1000) {
				v = false;
				setErrorHeader('Название предмета слишком длинное');
				setErrorText('Краткость сестра таланта!(максимум: 1000 символов)');
			}
			if (props.category === undefined || props.category.length == 0 || props.category == CategoryNo) {
				v = false;
				setErrorHeader('Категория предмета не указана');
				setErrorText('Выберите категорию предметов в выпадающем списке в начале страницы');
			}
		});
		if (feedbackType == 'other' && (contacts == '' || contacts.length > 1000)) {
			v = false;
			setErrorHeader('Контактные данные не указаны');
			setErrorText('Укажите информацию для связи с вами - максимум 1000 символов.');
		}

		// !! временная мера!
		// if (city.id < 0 || country.id < 0) {
		// 	v = false;
		// 	setErrorHeader('Местоположение не указано');
		// 	setErrorText('Укажите свою страну и город с помощью выпадающих списков выше');
		// }
		if (items[0].photos.length == 0)  {
			v = false;
			setErrorHeader('Не загружено ни одной фотографии');
			setErrorText('Загрузите от 1 до 3 фотографий предмета!');
		}
		setValid(v);
	}, [items, props.category, feedbackType, contacts, country, city]);

	function updateGeo() {
		async function fetchData() {
			const value = await bridge.send('VKWebAppGetGeodata');
			setGeodata(value);

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

	function saveCancel() {
		props.setSnackbar(
			<Snackbar
				duration="1500"
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
				region: country.title,
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

			CreateAd(obj, items, props.goToAds, props.setSnackbar, props.setPopout);
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
						setItems={(newItem) => {
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
			{Location(props.appID, props.apiVersion, props.vkPlatform, country, setCountry, city, setCity, true)}
			<Separator />
			<ChooseFeedback
				setFeedbackType={setFeedbackType}
				feedbackType={feedbackType}
				setContacts={setContacts}
				contacts={contacts}
				setSnackbar={props.setSnackbar}
				pmOpen={pmOpen}
			/>
			{valid ? (
				''
			) : (
				<div style={{ padding: '10px' }}>
					<FormStatus header={errorHeader} mode={valid ? 'default' : 'error'}>
						{errorText}
					</FormStatus>
				</div>
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

// 609 -> 462 -> 321
