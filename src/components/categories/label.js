import React, { useState } from 'react';
import { FormLayout, SelectMimicry } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { GetCategoryImage, GetCategoryText, CategoryNo } from './Categories';

const CategoriesLabel = (props) => {
	const { redux_form } = props;
	const category = props.inputData[redux_form] && props.inputData[redux_form].category ? props.inputData[redux_form].category : CategoryNo;

	return (
		<div
			style={{
				display: 'flex',
				alignContent: 'center',
				alignItems: 'center',
				// color: "var(--text_primary)",
				paddingLeft: props.leftMargin,
			}}
		>
			{GetCategoryImage(category)}
			<FormLayout style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
				<SelectMimicry
					top="Категория"
					value={GetCategoryText(category)}
					placeholder={GetCategoryText(category)}
					onClick={() => props.open()}
				/>
			</FormLayout>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesLabel);
