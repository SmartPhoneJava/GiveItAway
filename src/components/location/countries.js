import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import FormPanel from './../template/formPanel';
import { DefaultInputData, NoRegion } from './const';
import { connect } from 'react-redux';

let request_id = 0;

const Countries = (props) => {
    const [countries, setCountries] = useState([NoRegion]);
    console.log("reddddd +", props.redux_form)

	const { accessToken, apiVersion } = props;
	useEffect(() => {
        bridge
			.send('VKWebAppCallAPIMethod', {
				method: 'database.getCountries',
				request_id: 'api' + request_id,
				params: { v: apiVersion, access_token: accessToken },
			})
			.then((response) => {
				console.log('sucess VKWebAppCallAPIMethod', response.response.items);
				return response.response.items;
			})
			.then((ctrs) => {
				setCountries([NoRegion, ...ctrs]);
				return ctrs;
			})
			.catch((error) => {
				console.log('VKWebAppCallAPIMethod:', error);
			});

		request_id++;
	}, []);
	return (
		<FormPanel
			redux_form={props.redux_form}
			array={countries}
			field={'country'}
			getText={(v) => {
				return v.title;
            }}
            filterFunc={(v) => {
				return v.title;
            }}
			back={props.back}
            none_value={NoRegion}
            clear={true}
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

export default  connect(mapStateToProps, mapDispatchToProps)(Countries);

// 226
