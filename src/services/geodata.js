import axios from 'axios';

import { store } from '..';
import { setGeoDataString, setFias, setGeoData } from '../store/create_post/actions';
import { FORM_LOCATION_CREATE } from '../components/location/redux';

const DADATA = 'https://suggestions.dadata.ru/';
const GEOLOCATE = 'suggestions/api/4_1/rs/geolocate/address';
const FINDBYID = 'suggestions/api/4_1/rs/findById/postal_unit';
const TOKEN = 'Token efb37d1dc6b04c11116d3ab7ef9482fa13e0b664';
export function getAdress(geodata, successCallback, failCallBack) {
	let cancel;
	axios({
		method: 'get',
		headers: { Authorization: TOKEN },
		url: DADATA + GEOLOCATE,
		params: { lat: geodata.lat, lon: geodata.long, count: 1 },
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: { ...axios.defaults.headers, Authorization: 'Bearer' + window.sessionStorage.getItem('jwtToken') },
	})
		.then(function (response) {
			console.log('response from GET_ADDRESS:', response);
			console.log('response from GET_ADDRESS:', response.data.suggestions);
			if (!response.data.suggestions || response.data.suggestions.length == 0) {
				throw new Error('Неверные данные');
			}
			return response.data.suggestions[0];
		})
		.then(function (response) {
			const story = store.getState().router.activeStory;
			store.dispatch(setGeoDataString(story, response.value));
			console.log('get address done', response);

			store.dispatch(
				setGeoData(story, {
					lat: response.geo_lat,
					long: response.geo_lon,
				})
			);
			store.dispatch(setFias(response.data.street_fias_id));
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			console.log('ERROR getAdress', error);
			if (failCallBack) {
				failCallBack(error);
			}
		});
}

export function getMetro(addr, successCallback, failCallBack) {
	let cancel;
	axios({
		method: 'get',
		headers: { Authorization: TOKEN },
		url: DADATA + FINDBYID,
		params: { query: addr },
		cancelToken: new axios.CancelToken((c) => (cancel = c)),
		headers: { ...axios.defaults.headers, Authorization: 'Bearer' + window.sessionStorage.getItem('jwtToken') },
	})
		.then(function (response) {
			console.log('response from getMetro:', response);
			return response.data.metro;
		})
		.then(function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		})
		.catch(function (error) {
			console.log('ERROR getMetro', error);
			if (failCallBack) {
				failCallBack(error);
			}
		});
}
