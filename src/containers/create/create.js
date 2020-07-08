import { connect } from 'react-redux';

import { setPage, openPopout, openSnackbar, closeSnackbar, setStory, setAd } from '../../store/router/actions';
import {
	PANEL_CATEGORIES,
	PANEL_CITIES,
	PANEL_COUNTRIES,
	PANEL_ONE,
	PANEL_LICENCE,
} from '../../store/router/panelTypes';

import { setFormData, setGeoDataString, setGeoData } from '../../store/create_post/actions';
import { CREATE_AD_MAIN, CREATE_AD_ITEM, GEO_DATA } from '../../store/create_post/types';

import CreateAddRedux from './../../panels/story/create/components/CreateAddRedux';

import { CreateAd, EditAd } from '../../requests';
import { CategoryNo, CategoryOnline } from '../../components/categories/const';

import { FORM_LOCATION_CREATE } from '../../components/location/redux';
import { FORM_CREATE } from '../../components/categories/redux';
import { setExtraInfo, clearAds } from '../../store/detailed_ad/actions';
import { STORY_ADS } from '../../store/router/storyTypes';
import { store } from '../..';
import { defaultInputData } from '../../components/create/default';

const clearForm = (dispatch) => {
	dispatch(setFormData(FORM_CREATE, null));
	dispatch(setFormData(CREATE_AD_MAIN, { ...defaultInputData }));
	dispatch(setFormData(CREATE_AD_ITEM, { ...defaultInputData }));
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

const getAd = (myUser, inputData) => {
	const location = getLocationInfo(inputData);
	const main = getMainInfo(inputData);
	const item = getItemInfo(inputData);
	const category = getCategoryInfo(inputData);
	const ad_id = store.getState().ad ? store.getState().ad.ad_id : 0;
	const geodata = inputData[GEO_DATA].geodata;
	const geodata_string = inputData[GEO_DATA].geodata_string;
	return {
		ad_id,
		author: { vk_id: myUser.id, name: myUser.name },
		author_id: myUser.id,
		header: item.name,
		text: item.description,
		ls_enabled: main.ls_enabled,
		comments_enabled: main.comments_enabled,
		ad_type: main.type,
		// feedback_type: (main.ls ? ' ls' : '') + (main.comments ? ' comments' : ''),
		extra_field: geodata_string,
		category: category.category,
		subcat_list: category.subcategory,
		subcat: category.incategory,
		category: category.category,
		region: location.country.title,
		district: location.city.title,
		geo_position: {
			long: geodata.long,
			lat: geodata.lat,
		},
	};
};

const openLicence = (dispatch) => {
	dispatch(setPage(PANEL_LICENCE));
};

const openAd = (ad, dispatch) => {
	// ? не обьединять эту функцию в одну, оно специально
	// ? вызывается так. Первая функция ставит историю и панель,
	// ? вторая простая ставит панель. Благодаря этому работает
	// ? кнопка назад

	dispatch(setExtraInfo(ad, store.getState().vkui.myID));
	dispatch(setStory(STORY_ADS));
	dispatch(setPage(PANEL_ONE));
};
const loadAd = (ad, dispatch) => {
	dispatch(setExtraInfo(ad, store.getState().vkui.myID));
};

const createAd = (myUser, inputData, dispatch) => {
	const ad = getAd(myUser, inputData);
	console.log("i send it", ad)
	const obj = JSON.stringify(ad);
	const photos = getItemInfo(inputData).photosUrl;
	CreateAd(
		ad,
		obj,
		photos,
		(ad) => openAd(ad, dispatch),
		(ad) => {
			loadAd(ad, dispatch);
			console.log('we loaded more');
		},
		() => {
			clearForm(dispatch);
		}
	);
};

const editAd = (myUser, inputData, dispatch) => {
	const tgeodata = inputData[GEO_DATA].geodata;
	const ad = getAd(myUser, inputData);
	const obj = JSON.stringify(ad);

	EditAd(
		ad,
		obj,
		(ad) => openAd(ad, dispatch),
		() => {
			clearForm(dispatch);
		}
	);
};

const isValid = (inputData) => {
	let category = CategoryNo;
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

		const categoryInfo = getCategoryInfo(inputData);
		if (categoryInfo) {
			category = categoryInfo.category;
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

		console.log('isValid check category is', category);
		if (category != CategoryOnline) {
			if (!photosUrl || photosUrl.length == 0) {
				return {
					v: false,
					header: 'Не загружено ни одной фотографии',
					text: 'Загрузите от 1 до 3 фотографий предмета!',
				};
			}
		}
		const mainInfo = getMainInfo(inputData);
		if (mainInfo) {
			const { ls_enabled, comments_enabled } = mainInfo;
			if (!ls_enabled && !comments_enabled) {
				return {
					v: false,
					header: 'Обратная связь',
					text: 'Разрешите доступ к ЛС или включите комментарии',
				};
			}
		}
	} else {
		return {
			v: false,
			header: 'Не заполнена информация о вещи',
			text: 'Введи название, описание и добавьте фотографии обьекта',
		};
	}

	if (category != CategoryOnline) {
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
		appID: state.vkui.appID,
		apiVersion: state.vkui.apiVersion,
		AD: state.ad,

		snackbar: state.router.snackbars[state.router.activeStory],

		defaultInputData,
		isValid,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setGeoData: (s) => dispatch(setGeoData(s)),
		setGeoDataString: (s) => dispatch(setGeoDataString(s)),
		setFormData: (p, s) => dispatch(setFormData(p, s)),
		setPage: (p) => dispatch(setPage(p)),
		openLicence: () => openLicence(dispatch),
		openSnackbar: (p) => dispatch(openSnackbar(p)),
		closeSnackbar: () => dispatch(closeSnackbar()),
		createAd: (myUser, inputData) => createAd(myUser, inputData, dispatch),
		editAd: (myUser, inputData) => editAd(myUser, inputData, dispatch),
	};
};

const Create = connect(mapStateToProps, mapDispatchToProps)(CreateAddRedux);

export default Create;

// 609 -> 462 -> 321 -> 348 -> 282 -> 208
