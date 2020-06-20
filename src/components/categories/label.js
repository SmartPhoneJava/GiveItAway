import React, { useState, useEffect } from 'react';
import { FormLayout, SelectMimicry } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { GetCategoryImage } from './Categories';
import { CategoryNo } from './const';

const CategoriesLabel = (props) => {
	const { redux_form, inputData } = props;

	const [category, setCategory] = useState(CategoryNo);
	const [subcategory, setSubcategory] = useState(CategoryNo);
	const [incategory, setIncategory] = useState(CategoryNo);

	if (!inputData[redux_form]) {
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
					<SelectMimicry top="Категория" placeholder="Не выбрано" onClick={() => props.open()} />
				</FormLayout>
			</div>
		);
	}

	useEffect(() => {
		const s = inputData[redux_form].category || CategoryNo;
		if (s != category) {
			setCategory(s);
		}
	}, [inputData[redux_form].category]);

	useEffect(() => {
		const s = inputData[redux_form].subcategory || CategoryNo;
		if (s != subcategory) {
			setSubcategory(s);
		}
	}, [inputData[redux_form].subcategory]);

	useEffect(() => {
		const s = inputData[redux_form].incategory || CategoryNo;
		if (s != incategory) {
			setIncategory(s);
		}
	}, [inputData[redux_form].incategory]);

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
					value={category}
					placeholder={category}
					onClick={() => props.open()}
				/>
				{subcategory ? (
					<SelectMimicry value={subcategory} placeholder={subcategory} onClick={() => props.open()} />
				) : null}
				{incategory ? (
					<SelectMimicry value={incategory} placeholder={incategory} onClick={() => props.open()} />
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
