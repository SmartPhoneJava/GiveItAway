import React, { useState, useEffect } from 'react';
import { setFormData } from './../../store/create_post/actions';
import { SelectMimicry, FormLayout } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import { FORM_LOCATION_CREATE } from './redux';

const Location = (props) => {
	const { redux_form } = props;
	const country = props.inputData[redux_form] ? props.inputData[redux_form].country.title : 'Не определена';
	const city = props.inputData[redux_form] ? props.inputData[redux_form].city.title : 'Не определен';

	useEffect(() => {
		if (props.useMine) {
			console.log('myuser', props.myUser);
			props.setFormData(FORM_LOCATION_CREATE, {
				...props.inputData[FORM_LOCATION_CREATE],
				country: props.myUser.country,
				city: props.myUser.city,
			});
		}
	}, []);

	const width = document.body.clientWidth;

	return (
		<div
			style={{
				display: width > 400 ? 'flex' : 'block',
			}}
		>
			<FormLayout style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
				<SelectMimicry
					top="Страна"
					value={country ? country : 'Не определена'}
					placeholder={country ? country : 'Не определена'}
					onClick={() => props.openCountries()}
				/>
			</FormLayout>

			<FormLayout style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
				<SelectMimicry
					top="Город"
					value={city ? city : 'Не определен'}
					placeholder={city ? city : 'Не определен'}
					onClick={() => props.openCities()}
				/>
			</FormLayout>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		myUser: state.vkui.myUser,
	};
};

const mapDispatchToProps = {
	setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);

// 226
