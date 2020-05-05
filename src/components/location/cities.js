import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import FormPanel from './../template/formPanel';
import { DefaultInputData, NoRegion } from './const';
import { connect } from 'react-redux';

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
		let country_id = inputData.country.id;
		if (country_id == NoRegion.id) {
			country_id = 1;
		}
		bridge
			.send('VKWebAppCallAPIMethod', {
				method: 'database.getCities',
				request_id: 'city' + request_id,
				params: { v: apiVersion, access_token: accessToken, country_id },
			})
			.then((response) => {
				console.log('sucess VKWebAppCallAPIMethod', response.response.items);
				return response.response.items;
			})
			.then((ctrs) => {
				setCities([NoRegion, ...ctrs]);
				return ctrs;
			})
			.catch((error) => {
				console.log('VKWebAppCallAPIMethod:', error);
			});

		request_id++;
	}, [inputData.country]);
	return (
		<FormPanel
			redux_form={props.redux_form}
			array={cities}
			goBack={props.goBack}
			field={'city'}
			getText={(v) => {
				return v.title;
			}}
			filterFunc={(v) => {
				return v.title;
			}}
			none_value={NoRegion}
			defaultInputData={DefaultInputData}
		/>
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
