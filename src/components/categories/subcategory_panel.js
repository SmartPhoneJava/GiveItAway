import React, { useState, useEffect } from 'react';
import { GetCategoryText, CategoryNo, categories, GetCategoryImageSmall } from './Categories';
import GroupsPanel from '../template/groupsPanel';
import { ChildStruct } from './subcategories/child';
import { connect } from 'react-redux';

import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';

import { PanelHeader, PanelHeaderBack, Switch, InfoRow, Cell, Placeholder, Button } from '@vkontakte/vkui';
import { GetGroups, Subcategories } from './Subcategories';
const SubcategoriesPanel = (props) => {
	const [category, setCategory] = useState(CategoryNo);
	const [choosenGroup, setChoosenGroup] = useState();
	const [struct, setStruct] = useState(ChildStruct);
	const [onlyHeaders, setOnlyHeaders] = useState(true);
	const [searchEverywhere, setSearchEverywhere] = useState(true);
	const [noVariant, setNoVariant] = useState(false);

	useEffect(() => {
		const cat =
			(props.formData.forms[props.redux_form] ? props.formData.forms[props.redux_form].category : null) ||
			CategoryNo;
		if (cat != CategoryNo) {
			setCategory(cat);
			setStruct(GetGroups(cat));
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
	const allowCustom = true;
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
				choosenGroup={
					!choosenGroup
						? null
						: !choosenGroup.array
						? choosenGroup
						: { ...choosenGroup, array: [...choosenGroup.array, 'Другое'] }
				}
				setChoosenGroup={setChoosenGroup}
				redux_form={props.redux_form}
				goBack={props.goBack}
				field={'subcategory'}
				none_value={CategoryNo}
				defaultInputData={CategoryNo}
				afterClick={props.goNext}
				allowCustom={allowCustom}
				customText="Нет нужного варианта?"
				userFieldName="Подкатегория"
				onlyHeaders={onlyHeaders}
				noVariant={noVariant}
				setNoVariant={setNoVariant}
				searchEverywhere={searchEverywhere}
				searchArr={searchEverywhere ? Subcategories : []}
				placeholder={
					<Placeholder
						style={{ whiteSpace: 'normal' }}
						icon={<Icon56InfoOutline />}
						header="Пусто"
						action={
							allowCustom ? (
								<Button
									onClick={() => {
										setNoVariant(true);
									}}
									size="l"
								>
									Указать категорию вручную
								</Button>
							) : null
						}
					>
						Попробуйте подобрать другие слова или создайте свою подкатегорию. Рекомендуем использовать
						предлагаемые варианты, чтобы облегчить поиск другим пользователям
					</Placeholder>
				}
				settingsPanel={
					<>
						{/* <InfoRow>
							<Div>
								Используйте поиск, чтобы быстрее найти необходимую подкатегорию. Если ни один из
								предложенных вариантов не подходит, прокрутите вниз страницы и нажмите по{' '}
								<i>Нет нужного варианта?</i> для ручного ввода названия
							</Div>
						</InfoRow> */}
						<Cell
							multiline
							description={'Когда эта опция включена, поиск проводится во всех категориях'}
							asideContent={
								<Switch
									onChange={(e) => {
										setSearchEverywhere(e.target.checked);
									}}
									value={searchEverywhere}
									defaultChecked={searchEverywhere}
								/>
							}
						>
							Искать во всех разделах{' '}
						</Cell>
						{/* <Cell
							multiline
							description={
								'Когда данная опция включена, список подкатегорий превращается в список групп, состоящих из мелких разделов. Выбор такой категории облегчит другим пользователям поиск вашей вещи'
							}
							asideContent={
								<Switch
									onChange={(e) => {
										setOnlyHeaders(!e.target.checked);
									}}
									value={!onlyHeaders}
									defaultChecked={!onlyHeaders}
								/>
							}
						>
							Показать больше подразделов{' '}
						</Cell> */}
					</>
				}
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
