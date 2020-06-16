import React, { useState } from 'react';
import { setFormData } from '../../store/create_post/actions';

import { connect } from 'react-redux';

import {
	Group,
	Search,
	List,
	Cell,
	Header,
	Link,
	Div,
	FormLayout,
	Input,
	Footer,
	CellButton,
	Button,
	Separator,
} from '@vkontakte/vkui';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import { setPage } from '../../store/router/actions';

const GroupsPanel = (props) => {
	const {
		redux_form,

		field,
		goBack,
		none_value,
		defaultInputData,
		snackbars,
		story,
		panels,
		afterClick,
		Groups,

		choosenGroup,
		setChoosenGroup,

		allowCustom,
		customText,

		onlyHeaders,
		settingsPanel,

		searchArr,
		userFieldName,

		noVariant,
		setNoVariant,
	} = props;
	if (Groups == null) {
		return;
	}

	const [myVariant, setMyVariant] = useState('');
	const [myVariantClicked, setMyVariantClicked] = useState(false);

	const [search, setSearch] = useState('');

	const snackbar = panels && story && panels[story] && snackbars ? snackbars[panels[story]] : null;

	function handleSearch(e) {
		setSearch(e.target.value.toLowerCase());
	}

	const value = props.inputData[redux_form] ? props.inputData[redux_form][field] : null;

	function isDone(cat, getText) {
		if (!value) {
			return cat == none_value;
		}
		return getText(value) == getText(cat);
	}

	function onCellClick(group, cat) {
		const setNewValue =
			group.array.filter((g) => cat).length > 0 || cat == 'Другое' ? group.header + '|>_<|' + cat : cat;
		if (props.clear) {
			props.setFormData(redux_form, {
				...defaultInputData,
				[field]: setNewValue,
			});
		} else {
			props.setFormData(redux_form, {
				...props.inputData[redux_form],
				[field]: setNewValue,
			});
		}
		if (!afterClick) {
			goBack();
		} else {
			afterClick();
		}
	}

	const handleInput = (e) => {
		setMyVariant(e.currentTarget.value);
		setMyVariantClicked(true);
	};

	const saveClick = () => {
		onCellClick(myVariant);
	};

	const hideMyVariant = () => {
		setNoVariant(false);
	};

	const showMyVariant = () => {
		setNoVariant(true);
	};

	const ShowCell = (gr, v, gt, gi, withB, descriptionArr) => {
		const getText = gt || ((v) => v);
		const getImage = gi || ((v) => null);
		const text = getText(v);
		const darr = descriptionArr || [];
		const dlen = darr.length;
		const addSymbol = dlen > 6 ? '...' : '';
		const isHeader = gr.header == v;
		let done = false;
		if (isHeader) {
			done = gr.array.filter((a) => isDone(a, getText)).length > 0;
		} else {
			done = isDone(v, getText);
		}
		return (
			<Cell
				// expandable
				multiline
				key={text}
				before={getImage(v)}
				description={darr.length == 0 ? null : darr.filter((v, i) => i < 6).join(', ') + addSymbol}
				asideContent={done ? <Icon24Done /> : null}
				onClick={() => {
					if (descriptionArr) {
						setChoosenGroup(gr);
					} else {
						onCellClick(v);
					}
				}}
			>
				{withB ? <b>{text}</b> : text}
			</Cell>
		);
	};

	const ShowGroup = (gr) => {
		const getImage = gr.getImageFunc || ((v) => null);
		const getText = gr.getTextFunc || ((v) => v);
		const cellArr = gr.data
			.map((group) => {
				const canShow = (i) => {
					const g1show = group.show || 0;
					const g2show = gr.show || 0;
					let show = g1show;
					if (show < g2show) {
						show = g2show;
					}
					return gr.showAll || group.showAllBtn || i < show;
				};
				let arr = [...group.array, group.header].filter((v) => filter(v).toLowerCase().indexOf(search) != -1);
				const notFound = arr.length == 0;
				arr = arr.filter((g) => group.header != g);
				const len1 = arr.length;
				arr = arr.filter((v, i) => canShow(i));
				const len2 = arr.length;

				const needShowAllBtn = len1 != len2;

				return notFound ? null : onlyHeaders ? (
					ShowCell(group, group.header, getText, getImage, false, arr)
				) : (
					<Group key={group.header} header={ShowCell(group, group.header, getText, getImage, true)}>
						<List>{arr.map((v) => ShowCell(group, v, getText, getImage))}</List>
						{needShowAllBtn ? (
							<Div>
								<Link
									onClick={() => {
										setChoosenGroup(group);
									}}
								>
									Показать все
								</Link>
							</Div>
						) : null}
					</Group>
				);
			})
			.filter((el) => el);
		console.log('cellArr', gr.header, cellArr);
		return cellArr.length > 0 ? (
			<Group header={<Header mode="secondary">{gr.header}</Header>}>{cellArr}</Group>
		) : null;
	};

	const ShowList = (gr) => {
		const getImage = gr.getImageFunc || ((v) => null);
		const getText = gr.getTextFunc || ((v) => v);
		return gr.data
			.filter((v) => filter(v).toLowerCase().indexOf(search) != -1)
			.map((v) => ShowCell(gr, v, getText, getImage));
	};

	const ShowGroups = () => {
		const mainGroup = ShowGroup(Groups);
		const otherGroups = search.length > 0 ? SearchEverywere() : null;
		return mainGroup || otherGroups ? (
			<>
				<Separator />
				{mainGroup}
				{otherGroups}
				{allowCustom ? (
					<Footer>
						<Link onClick={showMyVariant}>{customText}</Link>
					</Footer>
				) : null}
			</>
		) : (
			props.placeholder
		);
	};

	const SearchEverywere = () => {
		const foundCells = searchArr
			.filter((g) => g.header != Groups.header)
			.map((sGroup) => ShowGroup(sGroup))
			.filter((v) => v);
		return foundCells.length > 0 ? (
			<Group header={<Header mode="primary">Найдено в других категориях</Header>}>
				<Separator />
				{foundCells}
			</Group>
		) : null;
	};

	const isValid = () => myVariant && myVariant.length > 2 && myVariant.length < 30;

	const grouping = Groups.grouping;
	const filter = props.filterFunc || ((v) => v);

	return (
		<>
			{noVariant ? (
				<>
					<CellButton mode="danger" onClick={hideMyVariant}>
						Отменить
					</CellButton>
					<FormLayout>
						<Input
							top={userFieldName}
							name={userFieldName}
							value={myVariant}
							placeholder="Мой вариант"
							onChange={handleInput}
							status={myVariantClicked ? (isValid() ? 'valid' : 'error') : 'default'}
							bottom={
								myVariantClicked
									? isValid()
										? 'Нажмите на кнопку "Продолжить"'
										: 'Длина названия должна быть больше 2 символов и меньше 30'
									: ''
							}
						/>
					</FormLayout>

					<Div>
						<Button disabled={!isValid()} onClick={saveClick} size="xl">
							Продолжить
						</Button>
					</Div>
				</>
			) : (
				<>
					<Search value={search} onChange={handleSearch} />
					{grouping ? (
						choosenGroup ? (
							<List>
								{choosenGroup.array
									.filter((v) => v.toLowerCase().indexOf(search) != -1)
									.map((v) => ShowCell(choosenGroup, v, Groups.getTextFunc, Groups.getImageFunc))}
							</List>
						) : (
							<>
								{/* {settingsPanel ? (
									<Group header={<Header mode="secondary">Настройки</Header>}>{settingsPanel}</Group>
								) : null} */}
								{settingsPanel}
								{ShowGroups()}
							</>
						)
					) : (
						ShowList(Groups)
					)}
				</>
			)}
			{snackbar}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		snackbars: state.router.snackbars,
		story: state.router.activeStory,
		panels: state.router.activePanels,
	};
};

const mapDispatchToProps = {
	setFormData,
	setPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsPanel);

// 272
