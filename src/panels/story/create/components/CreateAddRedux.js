import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Button, Group, Header, Div, FormStatus, Separator, ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

//
import { connect } from 'react-redux';

import { setFormData } from '../../../../store/create_post/actions';

import { CREATE_AD_MAIN, CREATE_AD_ITEM } from '../../../../store/create_post/types';
//

import CreateItem from './CreateItem';
import ChooseFeedback from './../../../../components/create/ChooseFeedback';
import ChooseType from './../../../../components/create/ChooseType';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';

import { CreateAd } from '../../../../requests';

import { User } from '../../../../store/user';

import { CategoryNo } from '../../../../components/categories/Categories';
import Location from '../../../../components/location/label';

import { canWritePrivateMessage } from '../../../../requests';
import { NoRegion } from '../../../../components/location/const';
import { FORM_LOCATION_CREATE } from '../../../../components/location/redux';
import { FORM_CREATE } from '../../../../components/categories/redux';

const PHOTO_TEXT = 'Не более трех фотографий (jpeg, png) размером 4мб';

let defaultInputData = {
	photoText: PHOTO_TEXT,
	name: '',
	description: '',
	photosUrl: [],
};

const CreateAddRedux = (props) => {
	const [inputData, setInputData] = useState(props.inputData['create_form'] || defaultInputData);

	const handleInput = (e) => {
		let value = e.currentTarget.value;

		if (e.currentTarget.type === 'checkbox') {
			value = e.currentTarget.checked;
		}

		console.log('loooook', e.currentTarget.name, value);

		setInputData({
			...inputData,
			[e.currentTarget.name]: value,
		});
	};

	const clearForm = () => {
		setInputData(defaultInputData);
	};

	const [pmOpen, setPmOpen] = useState(true);
	useEffect(() => {
		canWritePrivateMessage(
			props.myID,
			props.appID,
			props.apiVersion,
			(isClosed) => {
				setPmOpen(!isClosed);
			},
			(e) => {}
		);
	}, []);

	const [errorHeader, setErrorHeader] = useState('');
	const [errorText, setErrorText] = useState('');
	const [geodata, setGeodata] = useState({
		long: -1,
		lat: -1,
	});

	const [valid, setValid] = useState(false);

	useEffect(() => {
		let v = true;

		if (props.inputData[CREATE_AD_ITEM]) {
			const { name, description, photosUrl } = props.inputData[CREATE_AD_ITEM];
			if (!name || name.length == 0) {
				v = false;
				setErrorHeader('Не задано название предмета');
				setErrorText('Вы пропустили самый важный пункт!');
			} else if (name.length < 5) {
				v = false;
				setErrorHeader('Название предмета слишком короткое');
				setErrorText('Опишите чуть больше деталей!(минимум: 5 символов)');
			} else if (name.length > 100) {
				v = false;
				setErrorHeader('Название предмета слишком длинное');
				setErrorText('Попробуйте описать ваше объявление в двух словах!(максимум: 100 символов)');
			}
			if (!description || description.length == 0 || description > 1500) {
				v = false;
				setErrorHeader('Не задано описание предмета');
				setErrorText('Опишите ваши вещи, им будет приятно!');
			} else if (description.length < 10) {
				v = false;
				setErrorHeader('Описание предмета слишком короткое');
				setErrorText('Больше подробностей! (минимум 10 символов)');
			} else if (description.length > 1000) {
				v = false;
				setErrorHeader('Название предмета слишком длинное');
				setErrorText('Краткость сестра таланта!(максимум: 1000 символов)');
			}
			if (photosUrl.length == 0) {
				v = false;
				setErrorHeader('Не загружено ни одной фотографии');
				setErrorText('Загрузите от 1 до 3 фотографий предмета!');
			}
		} else {
			setErrorHeader('Не заполнена информация о вещи');
			setErrorText('Введи название, описание и добавьте фотографии обьекта');
			setValid(false);
			return;
		}

		if (props.inputData[FORM_CREATE]) {
			const { category } = props.inputData[FORM_CREATE];
			if (category === undefined || category.length == 0 || category == CategoryNo) {
				v = false;
				setErrorHeader('Категория предмета не указана');
				setErrorText('Выберите категорию предметов в выпадающем списке в начале страницы');
			}
		} else {
			setErrorHeader('Категория предмета не указана');
			setErrorText('Выберите категорию предметов в выпадающем списке в начале страницы');
			setValid(false);
			return;
		}

		if (props.inputData[FORM_LOCATION_CREATE]) {
			const { city, country } = props.inputData[FORM_LOCATION_CREATE];
			// !! временная мера!
			if (city.id < 0 || country.id < 0) {
				v = false;
				setErrorHeader('Местоположение не указано');
				setErrorText('Укажите свою страну и город с помощью выпадающих списков выше');
			}
		} else {
			setErrorHeader('Местоположение не указано');
			setErrorText('Укажите свою страну и город с помощью выпадающих списков выше');
			setValid(false);
			return;
		}
		setValid(v);
	}, [props.inputData]);

	useEffect(() => {
		if (!props.inputData || props.inputData.length == 0) {
			return;
		}
		console.log('chaaange', props.inputData);
		setInputData(props.inputData['create_form']);
	}, [props.inputData]);

	function updateGeo() {
		async function fetchData() {
			const value = await bridge.send('VKWebAppGetGeodata');
			setGeodata(value);
		}

		fetchData();
	}
	useEffect(() => {
		updateGeo();
	}, []);

	function saveCancel() {
		props.setSnackbar(
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
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
				header: props.inputData.name,
				text: props.inputData.description,
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

			CreateAd(obj, props.inputData.photosUrl, props.openAd, props.setSnackbar, props.setPopout);
		} else {
			saveCancel();
		}
	}
	return (
		<div>
			<Group separator="hide" header={<Header mode="secondary">Опишите выставляемые предметы</Header>}>
				<CreateItem
					inputData={inputData}
					setInputData={setInputData}
					handleInput={handleInput}
					setSnackbar={props.setSnackbar}
					choose={props.chooseCategory}
					category={props.category}
					defaultInputData={defaultInputData}
					openCategories={props.openCategories}
				/>
			</Group>

			<Group separator="hide" header={<Header>Мое местоположение</Header>}>
				<Location
					redux_form={FORM_LOCATION_CREATE}
					openCountries={props.openCountries}
					openCities={props.openCities}
					useMine={true}
				/>
			</Group>

			<ChooseFeedback setSnackbar={props.setSnackbar} pmOpen={pmOpen} />
			<ChooseType />
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
				>
					Добавить
				</Button>
			</Div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {
	setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAddRedux);

// 609 -> 462 -> 321 -> 348 -> 282
