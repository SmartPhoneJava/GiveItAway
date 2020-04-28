import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Button, Group, Header, Div, FormStatus, Separator, ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import CreateItem from './CreateItem';
import ChooseFeedback from './../../../../components/create/ChooseFeedback';
import ChooseType from './../../../../components/create/ChooseType';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';

import Location from '../../../../components/location/label';

import { canWritePrivateMessage } from '../../../../requests';
import { FORM_LOCATION_CREATE } from '../../../../components/location/redux';

const CreateAddRedux = (props) => {
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

		let stop = false;
		if (props.inputData[FORM_LOCATION_CREATE]) {
			stop = props.inputData[FORM_LOCATION_CREATE].stopMe;
		}
		if (!stop) {
			props.setFormData(FORM_LOCATION_CREATE, {
				...props.inputData[FORM_LOCATION_CREATE],
				country: props.myUser.country,
				city: props.myUser.city,
				stopMe: true,
			});
		}
	}, []);

	const [errorHeader, setErrorHeader] = useState('');
	const [errorText, setErrorText] = useState('');
	const [geodata, setGeodata] = useState({
		long: -1,
		lat: -1,
	});

	const [valid, setValid] = useState(false);

	useEffect(() => {
		const { v, header, text } = props.isValid(props.inputData);
		setValid(v);
		setErrorHeader(header);
		setErrorText(text);
	}, [props.inputData]);

	useEffect(() => {
		bridge
			.send('VKWebAppGetGeodata')
			.then((value) => {
				setGeodata(value);
			})
			.catch((error) => {
				console.log('VKWebAppGetGeodata error', error);
			});
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
			props.createAd(props.myUser, props.inputData, geodata, props.openAd, props.setSnackbar, props.setPopout);
		} else {
			saveCancel();
		}
	}
	return (
		<div>
			<Group separator="hide" header={<Header mode="secondary">Опишите выставляемые предметы</Header>}>
				<CreateItem
					defaultInputData={props.defaultInputData}
					setSnackbar={props.setSnackbar}
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

export default CreateAddRedux;

// 609 -> 462 -> 321 -> 348 -> 282 -> 126
