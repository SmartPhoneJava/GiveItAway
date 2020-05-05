import React, { useState } from 'react';
import FormPanel from './../template/formPanel';
import { GetCategoryText, CategoryNo, categories, GetCategoryImageSmall } from './Categories';

const CategoriesPanel = (props) => {
	return (
		<FormPanel
			redux_form={props.redux_form}
			goBack={props.goBack}
			array={categories}
			field={'category'}
			getImage={GetCategoryImageSmall}
			getText={GetCategoryText}
			filterFunc={GetCategoryText}
			none_value={CategoryNo}
			defaultInputData={CategoryNo}
		/>
	);
};

export default CategoriesPanel;
