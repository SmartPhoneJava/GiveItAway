import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';
import { Button, Group, Header, Div, InfoRow, Separator, ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import Geocoder from 'react-native-geocoding';

import CreateItem from './components/CreateItem';
import ChooseFeedback from './components/ChooseFeedback';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';

import { CreateAd } from './../../../requests';

import { User } from '../../../store/user';
import { Addr } from '../../../store/addr';

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

	const [description, setDescription] = useState('');
	const [hideGeo, setHideGeo] = useState(false);
	const [geodata, setGeodata] = useState({
		long: -1,
		lat: -1,
	});

	const [valid, setValid] = useState(false);
	const [contacts, setContacts] = useState('');
	const [feedbackType, setFeedbackType] = useState('ls');
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
			if (val.name === undefined || val.name.length == 0 || val.name.length > 100) {
				v = false;
			}
			if (val.description === undefined || val.description.length == 0 || val.name.description > 1500) {
				v = false;
			}
			if (props.category === undefined || props.category.length == 0 || props.category == CategoryNo) {
				v = false;
			}
		});
		if (feedbackType == 'other' && (contacts == '' || contacts.length > 100)) {
			v = false;
		}
		if (city.id < 0 || country.id < 0) {
			v = false;
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

// 609 -> 462 -> 321
