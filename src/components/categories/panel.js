import React, { useState } from 'react';

import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import { connect } from 'react-redux';
import { PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';

import { setPage } from '../../store/router/actions';
import { PANEL_SUBCATEGORIES } from '../../store/router/panelTypes';
import { CategoriesStruct } from './Categories';
import { CategoryNo } from './const';
import GroupsPanel from '../template/groupsPanel';
import { Subcategories } from './Subcategories';

const CategoriesPanel = (props) => {
	return (
		<>
			<PanelHeader left={<PanelHeaderBack onClick={props.goBack} />}>Категории</PanelHeader>
			<GroupsPanel
				Groups={CategoriesStruct}
				choosenGroup={CategoriesStruct.data[0]}
				redux_form={props.redux_form}
				goBack={props.goBack}
				field={'category'}
				none_value={CategoryNo}
				defaultInputData={CategoryNo}
				clear={true}
				afterClick={
					props.afterClick ||
					((group, cat) => {
						props.setPage(PANEL_SUBCATEGORIES);
					})
				}
				allowCustom={true}
				customText="Нет нужного варианта?"
				userFieldName="Подкатегория"
				searchEverywhere={true}
				searchArr={Subcategories}
				placeholder={
					<Placeholder style={{ whiteSpace: 'normal' }} icon={<Icon56InfoOutline />} header="Пусто">
						Категорий не найдено. Измените поисковой запрос.
					</Placeholder>
				}
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
