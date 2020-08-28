import React, { useState, useEffect } from 'react';
import { setFormData } from '../../store/create_post/actions';

import { AnimateGroup, AnimateOnChange } from 'react-animation';
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
	Placeholder,
} from '@vkontakte/vkui';

import Icon24Done from '@vkontakte/icons/dist/24/done';

import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import { AnimationChange, AnimationGroup } from '../image/image_cache';

export const CHOOSE_ANOTHER = 'another';

const animationDuration = 100;

const UserGroup = {
	header: 'Пользовательское',
	array: [],
};

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
		imageLeft,
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

	function onCellClick(group, value) {
		if (props.clear) {
			props.setFormData(redux_form, {
				...defaultInputData,
				[field]: value,
			});
		} else {
			props.setFormData(redux_form, {
				...props.inputData[redux_form],
				[field]: value,
			});
		}
		if (!afterClick) {
			goBack();
		} else {
			afterClick(group, value);
		}
	}

	const placeholder =
		props.placeholder == CHOOSE_ANOTHER ? (
			<Placeholder
				style={{ whiteSpace: 'normal' }}
				icon={<Icon56InfoOutline />}
				header="Пусто"
				action={
					allowCustom ? (
						<Button
							style={{ cursor: 'pointer' }}
							onClick={() => {
								onCellClick(choosenGroup, 'Другое');
							}}
							size="l"
						>
							Другое
						</Button>
					) : null
				}
			>
				Результатов не найдено: измените поисковой запрос. Если ни один предложенный вариант не подходит,
				выберите пункт "Другое".
			</Placeholder>
		) : (
			props.placeholder
		);

	const handleInput = (e) => {
		setMyVariant(e.currentTarget.value);
		setMyVariantClicked(true);
	};

	const saveClick = () => {
		onCellClick({ ...UserGroup, array: [myVariant] }, myVariant);
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

		const description = darr.length == 0 ? null : darr.filter((v, i) => i < 6).join(', ') + addSymbol;

		return getImage(v) ? (
			<div
				// expandable
				style={{ cursor: 'pointer' }}
				key={text}
				before={imageLeft && getImage(v)}
				description={description}
				onClick={() => onCellClick(gr, v)}
			>
				<div className="group-inner">
					{imageLeft ? null : <div>{getImage(v)}</div>}
					{withB ? <b>{text}</b> : <div>{text}</div>}
				</div>
			</div>
		) : (
			<Cell
				// expandable
				style={{ cursor: 'pointer' }}
				multiline
				key={text}
				before={imageLeft && getImage(v)}
				description={description}
				onClick={() => onCellClick(gr, v)}
			>
				<div style={{ display: 'block' }}>
					{imageLeft ? null : <div>{getImage(v)}</div>}
					{withB ? <b>{text}</b> : <div>{text}</div>}
				</div>
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
						<AnimationGroup arr={arr.map((v) => ShowCell(group, v, getText, getImage))} />
						{needShowAllBtn ? (
							<Div>
								<Link
									style={{ cursor: 'pointer' }}
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
						<Link
							style={{ cursor: 'pointer' }}
							onClick={() => {
								setNoVariant(true);
							}}
						>
							{customText}
						</Link>
					</Footer>
				) : null}
			</>
		) : (
			placeholder
		);
	};

	const ShowChoosenGroup = () => {
		const oneCellStyle = choosenGroup.oneCellStyle || ((v, i) => v);
		const searchFunc =
			choosenGroup.search ||
			((arr, searchText) => {
				return arr.filter((v) => v.toLowerCase().indexOf(searchText) != -1);
			});
		const searched = searchFunc(choosenGroup.array, search);
		if (searched == null) {
			return null;
		}
		const gr = searched
			.map((v) => ShowCell(choosenGroup, v, Groups.getTextFunc, Groups.getImageFunc))
			.filter((v) => v)
			.map((v, i) => oneCellStyle(v, i));

		const listCellStyle = choosenGroup.listCellStyle || ((v) => v);

		return gr.length > 0 ? listCellStyle(gr) : placeholder;
	};

	const SearchEverywere = () => {
		const foundCells = searchArr.map((sGroup) => {
			if (sGroup.header == Groups.header) {
				return;
			}
			return ShowGroup(sGroup);
		});
		return foundCells.length > 0 ? (
			<Group header={<Header mode="primary">Найдено в других категориях</Header>}>
				<Separator />
				<AnimationGroup duration={animationDuration} arr={foundCells} />
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
					<CellButton style={{ cursor: 'pointer' }} mode="danger" onClick={hideMyVariant}>
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
						<Button
							style={{ cursor: isValid() ? 'pointer' : null }}
							disabled={!isValid()}
							onClick={saveClick}
							size="xl"
						>
							Продолжить
						</Button>
					</Div>
				</>
			) : (
				<>
					<Search value={search} onChange={handleSearch} />
					{grouping ? (
						choosenGroup ? (
							ShowChoosenGroup()
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
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsPanel);

// 272
