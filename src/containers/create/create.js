import { connect } from 'react-redux';

import { setPage, openSnackbar, closeSnackbar, updateContext } from '../../store/router/actions';
import { PANEL_ONE, PANEL_LICENCE } from '../../store/router/panelTypes';

import { setFormData, setGeoDataString, setGeoData } from '../../store/create_post/actions';
import { CREATE_AD_MAIN, CREATE_AD_ITEM, GEO_DATA } from '../../store/create_post/types';

import CreateAddRedux from './../../panels/story/create/components/CreateAddRedux';

import { CreateAd, EditAd } from '../../requests';
import { CategoryNo, CategoryOnline } from '../../components/categories/const';

import { FORM_LOCATION_CREATE } from '../../components/location/redux';
import { FORM_CREATE } from '../../components/categories/redux';
import { setExtraInfo } from '../../store/detailed_ad/actions';
import { STORY_ADS } from '../../store/router/storyTypes';
import { store } from '../..';
import { defaultInputData } from '../../components/create/default';
import { now } from 'moment';
import { TYPE_CHOICE } from '../../const/ads';

const clearForm = (activeStory, dispatch) => {
	dispatch(setFormData(activeStory + FORM_CREATE, null));
	dispatch(setFormData(activeStory + CREATE_AD_MAIN, { ...defaultInputData }));
	dispatch(setFormData(activeStory + CREATE_AD_ITEM, { ...defaultInputData }));
};

const getMainInfo = (activeStory, inputData) => {
	return inputData[activeStory + CREATE_AD_MAIN];
};

const getItemInfo = (activeStory, inputData) => {
	return inputData[activeStory + CREATE_AD_ITEM];
};

const getCategoryInfo = (activeStory, inputData) => {
	return inputData[activeStory + FORM_CREATE];
};

const getLocationInfo = (activeStory, inputData) => {
	return inputData[activeStory + FORM_LOCATION_CREATE];
};

const getAd = (activeStory, myUser, inputData) => {
	console.log('myUser is', myUser); //{"vk_id":45863670,"name":"Артём","surname":"Ягами","photo_url":"ht
	const location = getLocationInfo(activeStory, inputData) || {};
	const main = getMainInfo(activeStory, inputData);
	if (main.comments_enabled === null) {
		main.comments_enabled = true
	}
	if (main.type === null) {
		main.type = TYPE_CHOICE
	}
	console.log('main is', activeStory, inputData[activeStory + CREATE_AD_MAIN]);
	const item = getItemInfo(activeStory, inputData);
	const category = getCategoryInfo(activeStory, inputData);
	const ad_id = store.getState().ad ? store.getState().ad.ad_id : 0;
	const geodata = inputData[activeStory + GEO_DATA] ? inputData[activeStory + GEO_DATA].geodata : { long: 0, lat: 0 };
	const geodata_string = inputData[activeStory + GEO_DATA] ? inputData[activeStory + GEO_DATA].geodata_string : '';
	console.log('location is', location);
	return {
		ad_id,
		author: { vk_id: myUser.id, name: myUser.first_name, surname: myUser.last_name, photo_url: myUser.photo_100 },
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
		region: location && location.country && location.country.title,
		district: location && location.city && location.city.title,
		geo_position: {
			long: geodata && geodata.long,
			lat: geodata && geodata.lat,
		},
	};
};

const openLicence = (dispatch) => {
	dispatch(setPage(PANEL_LICENCE));
};

const openAd = (ad, dispatch) => {
	dispatch(setPage(PANEL_ONE));
	dispatch(updateContext(ad));
};
const loadAd = (ad, dispatch) => {
	dispatch(setExtraInfo(ad, store.getState().vkui.myID));
};

const createAd = (activeStory, myUser, inputData, dispatch) => {
	const ad = getAd(activeStory, myUser, inputData);
	const obj = JSON.stringify(ad);
	const photos = getItemInfo(activeStory, inputData).photosUrl;
	console.log('create categories', ad);
	CreateAd(
		ad,
		obj,
		photos,
		(ad) => openAd(ad, dispatch),
		(ad) => {
			loadAd(ad, dispatch);
		},
		() => {
			clearForm(activeStory, dispatch);
		}
	);
};

const editAd = (activeStory, myUser, inputData, dispatch) => {
	const ad = getAd(activeStory, myUser, inputData);
	const obj = JSON.stringify(ad);

	EditAd(
		ad,
		obj,
		(ad) => openAd(ad, dispatch),
		() => {
			clearForm(activeStory, dispatch);
		}
	);
};

const isValid = (activeStory, inputData) => {
	let category = CategoryNo;
	const itemInfo = getItemInfo(activeStory, inputData);
	console.log('itemInfo is', itemInfo, activeStory);
	if (itemInfo) {
		let { name, description, photosUrl } = itemInfo;
		name = name ? name.trim() : '';
		description = description ? description.trim() : '';
		if (!name || name.length == 0) {
			return {
				v: false,
				header: 'Не задано название предмета',
				text: 'Вы пропустили самый важный пункт!',
			};
		}
		if (name.length < 5) {
			return {
				v: false,
				header: 'Название предмета слишком короткое',
				text: 'Опишите чуть больше деталей! (минимум: 5 символов)',
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
		if (description.length < 10) {
			return {
				v: false,
				header: 'Описание предмета слишком короткое',
				text: 'Больше подробностей! (минимум 10 символов)',
			};
		}
		if (description.length > 1000) {
			return {
				v: false,
				header: 'Описание предмета слишком длинное',
				text: 'Краткость сестра таланта! (максимум: 1000 символов)',
			};
		}

		const categoryInfo = getCategoryInfo(activeStory, inputData);
		if (categoryInfo) {
			category = categoryInfo.category;
			if (category == CategoryNo) {
				return {
					v: false,
					header: 'Категория предмета не указана',
					text: 'Выберите категорию предмета, кликнув по соответствующей панели',
				};
			}
		} else {
			return {
				v: false,
				header: 'Категория предмета не указана',
				text: 'Выберите категорию предмета, кликнув по соответствующей панели',
			};
		}

		if (category != CategoryOnline) {
			if (!photosUrl || photosUrl.length == 0) {
				return {
					v: false,
					header: 'Не загружено ни одной фотографии',
					text: 'Загрузите от 1 до 3 фотографий предмета!',
				};
			}
		}
		//const mainInfo = getMainInfo(inputData);
		// if (mainInfo) {
		// 	const { ls_enabled, comments_enabled } = mainInfo;
		// 	if (!ls_enabled && !comments_enabled) {
		// 		return {
		// 			v: false,
		// 			header: 'Обратная связь',
		// 			text: 'Разрешите доступ к ЛС или включите комментарии',
		// 		};
		// 	}
		// }
	} else {
		return {
			v: false,
			header: 'Не заполнена информация о вещи',
			text: 'Введи название, описание и добавьте фотографии объекта',
		};
	}

	if (category != CategoryOnline) {
		const locationInfo = getLocationInfo(activeStory, inputData);
		console.log('locationInfo is', locationInfo);
		if (locationInfo) {
			const { city, country } = locationInfo;
			if (city.id < 0 || country.id < 0) {
				return {
					v: false,
					header: 'Место получения вещи не указано',
					text: 'Введите адрес в поле ввода в пунтке "Где забрать вещь"',
				};
			}
		} else {
			return {
				v: false,
				header: 'Место получения вещи не указано',
				text: 'Введите адрес в поле ввода в пунтке "Где забрать вещь"',
			};
		}

		const geodata_string = inputData[activeStory + GEO_DATA]
			? inputData[activeStory + GEO_DATA].geodata_string
			: '';
		if (!geodata_string || geodata_string.trim() == '') {
			return {
				v: false,
				header: 'Место получения вещи не указано',
				text: 'Введите адрес в поле ввода в пунтке "Где забрать вещь"',
			};
		}
	}
	return {
		v: true,
		header: '',
		text: '',
	};
};

const isSame = (activeStory, first, second) => {
	const itemInfo1 = getItemInfo(activeStory, first);
	const itemInfo2 = getItemInfo(activeStory, second);
	if (itemInfo1 != itemInfo2) {
		return false;
	}

	const categoryInfo1 = getCategoryInfo(activeStory, first);
	const categoryInfo2 = getCategoryInfo(activeStory, second);
	if (categoryInfo1 != categoryInfo2) {
		return false;
	}
	if (!categoryInfo1) {
		return true;
	}

	const category = categoryInfo1.category;
	if (category != CategoryOnline) {
		const locationInfo1 = getLocationInfo(activeStory, first);
		const locationInfo2 = getLocationInfo(activeStory, second);
		if (locationInfo1 != locationInfo2) {
			return false;
		}

		const geodata_string1 = first[activeStory + GEO_DATA] ? first[activeStory + GEO_DATA].geodata_string : '';
		const geodata_string2 = second[activeStory + GEO_DATA] ? second[activeStory + GEO_DATA].geodata_string : '';
		if (geodata_string1 != geodata_string2) {
			return false;
		}
	}
	return true;
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		activeStory: state.router.activeStory,
		myUser: state.vkui.myUser,

		defaultInputData,
		isValid,
		isSame,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setGeoData: (activeStory, s) => dispatch(setGeoData(activeStory, s)),
		setGeoDataString: (activeStory, s) => dispatch(setGeoDataString(activeStory, s)),
		setFormData: (p, s) => dispatch(setFormData(p, s)),
		setPage: (p) => dispatch(setPage(p)),
		openLicence: () => openLicence(dispatch),
		openSnackbar: (p) => dispatch(openSnackbar(p)),
		closeSnackbar: () => dispatch(closeSnackbar()),
		createAd: (activeStory, myUser, inputData) => createAd(activeStory, myUser, inputData, dispatch),
		editAd: (activeStory, myUser, inputData) => editAd(activeStory, myUser, inputData, dispatch),
	};
};

const Create = connect(mapStateToProps, mapDispatchToProps)(CreateAddRedux);

export default Create;

// 609 -> 462 -> 321 -> 348 -> 282 -> 208
