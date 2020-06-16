import React, { useState } from 'react';
import { FormLayout, SelectMimicry } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { GetCategoryImage, GetCategoryText, CategoryNo } from './Categories';

const CategoriesLabel = (props) => {
	const { redux_form, inputData } = props;
	const category =
		inputData[redux_form] && inputData[redux_form].category ? inputData[redux_form].category : CategoryNo;
	const group = inputData[redux_form] && inputData[redux_form].group ? inputData[redux_form].group : CategoryNo;
	const subcategory =
		inputData[redux_form] && inputData[redux_form].subcategory ? inputData[redux_form].subcategory : CategoryNo;

	// ! доделать const [category, setCategory] = us

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
				{group ? (
					<SelectMimicry
						top="Раздел"
						value={group}
						placeholder={group}
						onClick={() => props.open()}
					/>
				) : null}
					{subcategory ? (
					<SelectMimicry
						top="Подкатегория"
						value={subcategory}
						placeholder={subcategory}
						onClick={() => props.open()}
					/>
				) : null}
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
