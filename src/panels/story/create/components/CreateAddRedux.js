import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Button, Group, Header, Div, FormStatus, Separator, ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import CreateItem from './CreateItem';
import ChooseFeedback from './../../../../components/create/ChooseFeedback';
import ChooseType from './../../../../components/create/ChooseType';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';

import { PANEL_CITIES, PANEL_CATEGORIES, PANEL_COUNTRIES } from './../../../../store/router/panelTypes';

import Location from '../../../../components/location/label';

import { canWritePrivateMessage } from '../../../../requests';
import { FORM_LOCATION_CREATE } from '../../../../components/location/redux';
import { SNACKBAR_DURATION_DEFAULT } from '../../../../store/const';
import { EDIT_MODE, CREATE_AD_ITEM } from '../../../../store/create_post/types';

const CreateAddRedux = (props) => {
	const { openSnackbar, closeSnackbar, myUser, appID, apiVersion, setPage, snackbar, inputData, AD } = props;

	const [pmOpen, setPmOpen] = useState(true);
	useEffect(() => {
		let cleanupFunction = false;
		canWritePrivateMessage(
			myUser.id,
			appID,
			apiVersion,
			(isClosed) => {
				if (!cleanupFunction) {
					setPmOpen(!isClosed);
				}
			},
			(e) => {}
		);
		return () => (cleanupFunction = true);
	}, []);

	const [errorHeader, setErrorHeader] = useState('');
	const [errorText, setErrorText] = useState('');
	const [geodata, setGeodata] = useState({
		long: -1,
		lat: -1,
	});

	const [valid, setValid] = useState(false);
	const needEdit = inputData[EDIT_MODE] ? inputData[EDIT_MODE].mode : false;

	useEffect(() => {
		const { v, header, text } = props.isValid(inputData);
		setValid(v);
		setErrorHeader(header);
		setErrorText(text);
	}, [inputData]);

	useEffect(() => {
		let cleanupFunction = false;
		bridge
			.send('VKWebAppGetGeodata')
			.then((value) => {
				if (!cleanupFunction) {
					setGeodata(value);
				}
			})
			.catch((error) => {
				console.log('VKWebAppGetGeodata error', error);
			});
		return () => (cleanupFunction = true);
	}, []);

	function saveCancel() {
		openSnackbar(
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={closeSnackbar}
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

	function createAd() {
		if (valid) {
			props.createAd(myUser, inputData, geodata);
		} else {
			saveCancel();
		}
	}
	function editAd() {
		if (valid) {
			props.editAd(myUser, inputData, geodata);
		} else {
			saveCancel();
		}
	}
	return (
		<div>
			<Group separator="hide" header={<Header mode="secondary">Опишите выставляемые предметы</Header>}>
				<CreateItem
					defaultInputData={props.defaultInputData}
					setSnackbar={openSnackbar}
					openCategories={() => {
						setPage(PANEL_CATEGORIES);
					}}
				/>
			</Group>

			<Group separator="hide" header={<Header>Местоположение объявления</Header>}>
				<Location
					redux_form={FORM_LOCATION_CREATE}
					openCountries={() => {
						setPage(PANEL_COUNTRIES);
					}}
					openCities={() => {
						setPage(PANEL_CITIES);
					}}
					// useMine={true}
				/>
			</Group>

			<ChooseFeedback setSnackbar={openSnackbar} pmOpen={pmOpen} />
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
				{needEdit ? (
					<Button onClick={editAd} mode={valid ? 'commerce' : 'secondary'} size="l" stretched>
						Сохранить
					</Button>
				) : (
					<Button onClick={createAd} mode={valid ? 'commerce' : 'secondary'} size="l" stretched>
						Добавить
					</Button>
				)}
			</Div>
			{snackbar}
		</div>
	);
};

export default CreateAddRedux;

// 609 -> 462 -> 321 -> 348 -> 282 -> 126
