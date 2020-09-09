import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import FormPanel from './../template/formPanel';
import { DefaultInputData, NoRegion } from './const';
import { connect } from 'react-redux';
import GroupsPanel from '../template/groupsPanel';
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import { Placeholder } from '@vkontakte/vkui';

let request_id = 0;

let defaultInputData = {
	country: NoRegion,
	city: NoRegion,
};

const Cities = (props) => {
	const [cities, setCities] = useState([NoRegion]);
	const [inputData, setInputData] = useState(props.inputData[props.redux_form] || defaultInputData);
	const { accessToken, apiVersion } = props;

	useEffect(() => {
		let cancelFunc = false;
		let country_id = inputData.country ? inputData.country.id : null || NoRegion.id;
		if (country_id == NoRegion.id) {
			country_id = 1;
		}
		const ctrs = [
			{ id: 1, title: 'Москва' },
			{ id: 2, title: 'Санкт-Петербург' },
			{ id: 10, title: 'Волгоград' },
			{ id: 37, title: 'Владивосток' },
			{ id: 42, title: 'Воронёж' },
			{ id: 49, title: 'Екатеринбург' },
			{ id: 60, title: 'Казань' },
			{ id: 61, title: 'Калининград' },
			{ id: 72, title: 'Краснодар' },
			{ id: 73, title: 'Красноярк' },
			{ id: 95, title: 'Нижний Новгород' },
			{ id: 99, title: 'Новосибирск' },
			{ id: 104, title: 'Омск' },
			{ id: 110, title: 'Пермь' },
			{ id: 119, title: 'Ростов-на-Дону' },
			{ id: 123, title: 'Самара' },
			{ id: 151, title: 'Уфа' },
			{ id: 153, title: 'Хабаровк' },
			{ id: 158, title: 'Челябинск' },
			{ id: 185, title: 'Севастополь' },
			{ id: 627, title: 'Симферополь' },
		];
		setCities([NoRegion, ...ctrs]);
		// bridge
		// 	.send('VKWebAppCallAPIMethod', {
		// 		method: 'database.getCities',
		// 		request_id: 'city' + request_id,
		// 		params: { v: apiVersion, access_token: accessToken, country_id },
		// 	})
		// 	.then((response) => {
		// 		console.log('sucess VKWebAppCallAPIMethod', response.response.items);
		// 		return response.response.items;
		// 	})
		// 	.then((ctrs) => {
		// 		if (cancelFunc) {
		// 			return;
		// 		}
		// 		setCities([NoRegion, ...ctrs]);
		// 		return ctrs;
		// 	})
		// 	.catch((error) => {
		// 		console.log('VKWebAppCallAPIMethod:', error);
		// 	});

		return () => {
			cancelFunc = true;
		};
		request_id++;
	}, [inputData.country]);
	return (
		<GroupsPanel
			Groups={{
				getTextFunc: (v) => {
					return v.title;
				},
				filterFunc: (v) => {
					return v.title;
				},
				data: cities,
			}}
			filterFunc={(v) => {
				return v.title;
			}}
			redux_form={props.redux_form}
			field={'city'}
			goBack={props.goBack}
			none_value={NoRegion}
			defaultInputData={DefaultInputData}
			placeholder={
				<Placeholder style={{ whiteSpace: 'normal' }} icon={<Icon56InfoOutline />} header="Пусто">
					Городов не найдено. Измените поисковой запрос.
				</Placeholder>
			}
		/>
		// <FormPanel
		// 	redux_form={props.redux_form}
		// 	array={cities}
		// 	goBack={props.goBack}
		// 	field={'city'}
		// 	getText={(v) => {
		// 		return v.title;
		// 	}}
		// 	filterFunc={(v) => {
		// 		return v.title;
		// 	}}
		// 	none_value={NoRegion}
		// 	defaultInputData={DefaultInputData}
		// />
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		accessToken: state.vkui.accessToken,
		apiVersion: state.vkui.apiVersion,
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Cities);

// 226
