import React, { useState } from 'react';
import { setFormData } from './../../store/create_post/actions';
import { SelectMimicry, FormLayout } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import { EDIT_MODE } from '../../store/create_post/types';

const Location = (props) => {
	const { redux_form } = props;

	const city =
		props.inputData[redux_form] && props.inputData[redux_form].city && props.inputData[redux_form].city.title
			? props.inputData[redux_form].city.title
			: 'Не определен';

	const width = document.body.clientWidth;

	return (
		<div
			style={{
				display: width > 400 ? 'flex' : 'block',
			}}
		>
			<FormLayout style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
				<SelectMimicry
					style={{ cursor: 'pointer' }}
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

// 226 -> 48
