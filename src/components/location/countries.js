import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import FormPanel from './../template/formPanel';
import { DefaultInputData, NoRegion } from './const';
import { connect } from 'react-redux';
import { fail } from '../../requests';

let request_id = 0;

const Countries = (props) => {
	const [countries, setCountries] = useState([NoRegion]);

	const { accessToken, apiVersion } = props;
	useEffect(() => {
		let cancelFunc = false;
		bridge
			.sendPromise('VKWebAppCallAPIMethod', {
				method: 'database.getCountries',
				request_id: 'api' + request_id,
				params: { v: apiVersion, access_token: accessToken },
			})
			.then((response) => {
				return response.response.items;
			})
			.then((ctrs) => {
				if (cancelFunc) {
					return;
				}
				setCountries([NoRegion, ...ctrs]);
				return ctrs;
			})
			.catch((error) => {
				if (cancelFunc) {
					return;
				}
				console.log('VKWebAppCallAPIMethod:', error);
				fail('Не удалось получить список стран. Попробуйте позже');
				props.goBack();
			});
		return () => {
			cancelFunc = true;
		};
		request_id++;
	}, []);
	return (
		<FormPanel
			redux_form={props.redux_form}
			array={countries}
			goBack={props.goBack}
			field={'country'}
			getText={(v) => {
				return v.title;
			}}
			filterFunc={(v) => {
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Countries);

// 226
