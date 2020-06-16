import React, { useState, useEffect } from 'react';
import { GetCategoryText, CategoryNo, categories, GetCategoryImageSmall } from './Categories';
import GroupsPanel from '../template/groupsPanel';
import { ChildStruct } from './subcategories/child';
import { connect } from 'react-redux';

import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { GetGroups } from './Subcategories';
const SubcategoriesPanel = (props) => {
	const [category, setCategory] = useState(CategoryNo);
	const [choosenGroup, setChoosenGroup] = useState();
	const [struct, setStruct] = useState(ChildStruct);

	useEffect(() => {
		const cat =
			(props.formData.forms[props.redux_form] ? props.formData.forms[props.redux_form].category : null) ||
			CategoryNo;
		if (cat != CategoryNo) {
			setCategory(cat);
			setStruct(GetGroups(cat))
		}
		console.log('loook at cat', cat, props.formData.forms[props.redux_form]);
	}, [props.formData.forms[props.redux_form].category]);

	// useEffect(() => {
	// 	const gr = props.formData.forms[props.redux_form] ? props.formData.forms[props.redux_form].group : null;
	// 	setGroup(gr);
	// 	console.log('loook at gr', gr, props.formData.forms[props.redux_form]);
	// }, [props.formData.forms[props.redux_form].group]);

	console.log('loook at ', props.formData);
	console.log('we like ' + props.redux_form);
	return (
		<>
			<PanelHeader
				left={
					<PanelHeaderBack
						onClick={
							choosenGroup
								? () => {
										setChoosenGroup(null);
								  }
								: props.goBack
						}
					/>
				}
			>
				<p className="panel-header">{choosenGroup ? choosenGroup.header : GetCategoryText(category)}</p>
			</PanelHeader>
			<GroupsPanel
				Groups={struct}
				choosenGroup={choosenGroup}
				setChoosenGroup={setChoosenGroup}
				redux_form={props.redux_form}
				goBack={props.goBack}
				field={'subcategory'}
				none_value={CategoryNo}
				defaultInputData={CategoryNo}
				afterClick={props.goNext}

				allowCustom={true}
				customText="Нет нужной подкатегории?"
			/>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		formData: state.formData,
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SubcategoriesPanel);
