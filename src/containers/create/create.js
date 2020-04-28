import { connect } from 'react-redux';

import { setFormData } from '../../store/create_post/actions';
import { CREATE_AD_MAIN, CREATE_AD_ITEM } from '../../store/create_post/types';

import CreateAddRedux from './../../panels/story/create/components/CreateAddRedux';

import { CreateAd } from '../../requests';
import { CategoryNo } from '../../components/categories/Categories';

import { NoRegion } from '../../components/location/const';
import { FORM_LOCATION_CREATE } from '../../components/location/redux';
import { FORM_CREATE } from '../../components/categories/redux';

const PHOTO_TEXT = 'Не более трех фотографий (jpeg, png) размером 4мб';

let defaultInputData = {
	photoText: PHOTO_TEXT,
	name: '',
	description: '',
	photosUrl: [],
	ls: true,
	comments: true,
	type: 'choice',
	category: CategoryNo,
	city: NoRegion,
	country: NoRegion,
};

const clearForm = () => {
	setFormData(FORM_LOCATION_CREATE, { ...defaultInputData });
	setFormData(FORM_CREATE, { ...defaultInputData });
	setFormData(CREATE_AD_MAIN, { ...defaultInputData });
	setFormData(CREATE_AD_ITEM, { ...defaultInputData });
};

const getMainInfo = (inputData) => {
	return inputData[CREATE_AD_MAIN];
};

const getItemInfo = (inputData) => {
	return inputData[CREATE_AD_ITEM];
};

const getCategoryInfo = (inputData) => {
	return inputData[FORM_CREATE];
};

const getLocationInfo = (inputData) => {
	return inputData[FORM_LOCATION_CREATE];
};

const getAd = (myUser, inputData, tgeodata) => {
	const location = getLocationInfo(inputData);
	const geodata = tgeodata || { long: -1, lat: -1 };
	const main = getMainInfo(inputData);
	const item = getItemInfo(inputData);
	const category = getCategoryInfo(inputData);
	return {
		author_id: myUser.id,
		header: item.name,
		text: item.description,
		feedback_type: "comments",
		// feedback_type: (main.ls ? ' ls' : '') + (main.comments ? ' comments' : ''),
		extra_field: main ? main.type : "choice",
		category: category.category,
		region: location.country.title,
		district: location.city.title,
		long: geodata.long,
		lat: geodata.lat,
	};
};

const createAd = (myUser, inputData, tgeodata, openAd, setSnackbar, setPopout) => {
	const obj = JSON.stringify(getAd(myUser, inputData, tgeodata));
	console.log('objection', getItemInfo(inputData).photosUrl);
	CreateAd(obj, getItemInfo(inputData).photosUrl, openAd, setSnackbar, setPopout, () => {
		clearForm();
	});
};

const isValid = (inputData) => {
	const itemInfo = getItemInfo(inputData);
	if (itemInfo) {
		const { name, description, photosUrl } = itemInfo;
		if (!name || name.length == 0) {
			return {
				v: false,
				header: 'Не задано название предмета',
				text: 'Вы пропустили самый важный пункт!',
			};
		}
		if (name.length < 3) {
			return {
				v: false,
				header: 'Название предмета слишком короткое',
				text: 'Опишите чуть больше деталей!(минимум: 5 символов)',
			};
		}
		if (name.length > 100) {
			return {
				v: false,
				header: 'Название предмета слишком длинное',
				text: 'Попробуйте описать ваше объявление в двух словах!(максимум: 100 символов)',
			};
		}
		if (!description || description.length == 0 || description > 1500) {
			return {
				v: false,
				header: 'Не задано описание предмета',
				text: 'Опишите ваши вещи, им будет приятно!',
			};
		}
		if (description.length < 5) {
			return {
				v: false,
				header: 'Описание предмета слишком короткое',
				text: 'Больше подробностей! (минимум 10 символов)',
			};
		}
		if (description.length > 1000) {
			return {
				v: false,
				header: 'Название предмета слишком длинное',
				text: 'Краткость сестра таланта!(максимум: 1000 символов)',
			};
		}
		if (photosUrl.length == 0) {
			return {
				v: false,
				header: 'Не загружено ни одной фотографии',
				text: 'Загрузите от 1 до 3 фотографий предмета!',
			};
		}
	} else {
		return {
			v: false,
			header: 'Не заполнена информация о вещи',
			text: 'Введи название, описание и добавьте фотографии обьекта',
		};
	}

	const categoryInfo = getCategoryInfo(inputData);
	if (categoryInfo) {
		const { category } = categoryInfo;
		if (category == CategoryNo) {
			return {
				v: false,
				header: 'Категория предмета не указана',
				text: 'Выберите категорию предметов в выпадающем списке в начале страницы',
			};
		}
	} else {
		return {
			v: false,
			header: 'Категория предмета не указана',
			text: 'Выберите категорию предметов в выпадающем списке в начале страницы',
		};
	}

	const locationInfo = getLocationInfo(inputData);
	if (locationInfo) {
		const { city, country } = locationInfo;
		if (city.id < 0 || country.id < 0) {
			return {
				v: false,
				header: 'Местоположение не указано',
				text: 'Укажите свою страну и город с помощью выпадающих списков выше',
			};
		}
	} else {
		return {
			v: false,
			header: 'Местоположение не указано',
			text: 'Укажите свою страну и город с помощью выпадающих списков выше',
		};
	}
	return {
		v: true,
		header: '',
		text: '',
	};
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		myUser: state.vkui.myUser,

		defaultInputData,
		isValid,
		createAd,
	};
};

const mapDispatchToProps = {
	setFormData,
};

const Create = connect(mapStateToProps, mapDispatchToProps)(CreateAddRedux);

export default Create;

// 609 -> 462 -> 321 -> 348 -> 282 -> 208
