import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { PanelHeader, PanelHeaderBack, Switch, Cell, Placeholder, Button } from '@vkontakte/vkui';

import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';

import { CategoryNo } from './const';
import GroupsPanel, { CHOOSE_ANOTHER } from '../template/groupsPanel';
import { ChildStruct } from './subcategories/child';
import { GetGroups, Subcategories } from './Subcategories';
import { setFormData } from '../../store/create_post/actions';

const SubcategoriesPanel = (props) => {
	const [category, setCategory] = useState(CategoryNo);
	const [choosenGroup, setChoosenGroup] = useState();
	const [struct, setStruct] = useState(ChildStruct);
	const [onlyHeaders, setOnlyHeaders] = useState(true);
	const [searchEverywhere, setSearchEverywhere] = useState(false);
	const [noVariant, setNoVariant] = useState(false);

	const { formData, redux_form, setFormData } = props;

	useEffect(() => {
		if (choosenGroup != formData.forms[redux_form].sublist) {
			setChoosenGroup(formData.forms[redux_form].sublist);
		}
	}, [formData.forms[redux_form].sublist]);

	useEffect(() => {
		const cat = (formData.forms[redux_form] ? formData.forms[redux_form].category : null) || CategoryNo;
		if (cat != CategoryNo) {
			setCategory(cat);
			setStruct(GetGroups(cat));
		}
	}, [formData.forms[redux_form].category]);

	const allowCustom = true;

	const setSubList = (v) => {
		setFormData(redux_form, {
			...formData.forms[redux_form],
			sublist: v,
		});
	};

	return (
		<>
			<PanelHeader
				left={
					<PanelHeaderBack
						onClick={
							choosenGroup
								? () => {
										setSubList(null);
										props.goBack();
								  }
								: props.goBack
						}
					/>
				}
			>
				<p className="panel-header">{choosenGroup ? choosenGroup.header : category}</p>
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
				setChoosenGroup={setSubList}
				redux_form={redux_form}
				goBack={props.goBack}
				field={choosenGroup ? 'incategory' : 'subcategory'}
				none_value={CategoryNo}
				defaultInputData={CategoryNo}
				afterClick={
					choosenGroup
						? (group, cell) => {
								setFormData(props.redux_main_form, {
									...formData.forms[props.redux_main_form],
									category: formData.forms[redux_form].category,
									incategory: cell,
									subcategory: group.header,
								});
								props.goNext();
						  }
						: (group, cell) => {
								setSubList(group);
								props.goNext();
						  }
				}
				allowCustom={allowCustom}
				customText="Нет нужного варианта?"
				userFieldName="Подкатегория"
				onlyHeaders={onlyHeaders}
				noVariant={noVariant}
				setNoVariant={setNoVariant}
				searchEverywhere={searchEverywhere}
				searchArr={searchEverywhere ? Subcategories : []}
				placeholder={
					!choosenGroup ? (
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
					) : (
						CHOOSE_ANOTHER
					)
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
						{/* <Cell
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
						</Cell> */}
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

const mapDispatchToProps = {
	setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubcategoriesPanel);
