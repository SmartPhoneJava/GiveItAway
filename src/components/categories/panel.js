import React, { useState } from 'react';
import FormPanel from './../template/formPanel';
import { GetCategoryText, CategoryNo, categories, GetCategoryImageSmall } from './Categories';
import { goBack, setPage } from '../../store/router/actions';
import { PANEL_SUBCATEGORIES } from '../../store/router/panelTypes';

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
			afterClick={props.setPage(PANEL_SUBCATEGORIES)}
		/>
	);
};

const mapStateToProps = (state) => {};

const mapDispatchToProps = {
	goBack,
	setPage
};

export default connect(mapStateToProps, mapDispatchToProps)(FormPanel);

export default CategoriesPanel;
