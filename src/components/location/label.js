import React, { useState, useEffect } from 'react';
import { setFormData } from './../../store/create_post/actions';
import { SelectMimicry, FormLayout } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import { EDIT_MODE } from '../../store/create_post/types';

const Location = (props) => {
	const [applied, setApplied] = useState(false);
	const isEdited = props.inputData[EDIT_MODE] ? props.inputData[EDIT_MODE].mode : false;
	const { redux_form } = props;

	// const eCountry =
	// 	props.inputData[redux_form] && props.inputData[redux_form].country
	// 		? props.inputData[redux_form].country.title
	// 		: '';
	// const eCity =
	// 	props.inputData[redux_form] && props.inputData[redux_form].city ? props.inputData[redux_form].city.title : '';

	// const myCountry = props.myUse && props.myUser.country ? props.myUser.country.title : '';
	// const myCity = props.myUse && props.myUser.city ? props.myUser.city.title : '';

	const country =
		props.inputData[redux_form] && props.inputData[redux_form].country && props.inputData[redux_form].country.title
			? props.inputData[redux_form].country.title
			: 'Не определена';
	const city =
		props.inputData[redux_form] && props.inputData[redux_form].city && props.inputData[redux_form].city.title
			? props.inputData[redux_form].city.title
			: 'Не определен';

	// if (isEdited) {
	// 	if (eCountry.length > 0) {
	// 		country = eCountry;
	// 	}
	// 	if (eCity.length > 0) {
	// 		city = eCity;
	// 	}
	// } else if (props.useMine) {
	// 	if (myCountry.length > 0) {
	// 		country = myCountry;
	// 	}
	// 	if (myCity.length > 0) {
	// 		city = myCity;
	// 	}
	// } else {
	// 	if (eCountry.length > 0) {
	// 		country = eCountry;
	// 	}
	// 	if (eCity.length > 0) {
	// 		city = eCity;
	// 	}
	// }

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
