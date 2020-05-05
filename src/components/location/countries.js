import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import FormPanel from './../template/formPanel';
import { DefaultInputData, NoRegion } from './const';
import { connect } from 'react-redux';
import { openSnackbar } from '../../store/router/actions';
import { fail } from '../../requests';

let request_id = 0;

const Countries = (props) => {
	const [countries, setCountries] = useState([NoRegion]);
	console.log('reddddd +', props.redux_form);

	const { accessToken, apiVersion, openSnackbar } = props;
	useEffect(() => {
		
		bridge
			.sendPromise('VKWebAppCallAPIMethod', {
				method: 'database.getCountries',
				request_id: 'api' + request_id,
				params: { v: apiVersion, access_token: accessToken },
			})
			.then(response => {
				console.log('sucess VKWebAppCallAPIMethod', response.response.items);
				return response.response.items;
			})
			.then((ctrs) => {
				console.log('seeeet:', ctrs);
				setCountries([NoRegion, ...ctrs]);
				return ctrs;
			})
			.catch(error => {
				console.log('VKWebAppCallAPIMethod:', error);
				fail('Не удалось получить список стран. Попробуйте позже', null, openSnackbar);
				props.goBack();
			});

		request_id++;
	}, []);
	console.log('ctrsctrs:', countries);
	return (
		<FormPanel
			redux_form={props.redux_form}
			array={countries}
			goBack={props.goBack}
			field={'country'}
			getText={(v) => {
				console.log('ahahaha', v);
				return v.title;
			}}
			filterFunc={(v) => {
				console.log('ahahaha', v);
				return v.title;
			}}
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

const mapDispatchToProps = {
	openSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Countries);

// 226
