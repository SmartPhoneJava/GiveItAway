import React, { useState } from 'react';
import FormPanel from './../template/formPanel';
import { GetCategoryText, CategoryNo, categories, GetCategoryImageSmall } from './Categories';
import { goBack, setPage } from '../../store/router/actions';
import { PANEL_SUBCATEGORIES } from '../../store/router/panelTypes';
import { connect } from 'react-redux';
import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

const CategoriesPanel = (props) => {
	return (
		<>
			<PanelHeader left={<PanelHeaderBack onClick={props.goBack} />}>Выберите категорию</PanelHeader>
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
				afterClick={() => {
					props.setPage(PANEL_SUBCATEGORIES);
				}}
			/>
		</>
	);
};

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {
	setPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPanel);
