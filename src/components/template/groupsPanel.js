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
	} = props;
	if (Groups == null) {
		return;
	}

	const [noVariant, setNoVariant] = useState(false);
	const [myVariant, setMyVariant] = useState('');
	const [myVariantClicked, setMyVariantClicked] = useState(false);

	const [search, setSearch] = useState('');

	const snackbar = panels && story && panels[story] && snackbars ? snackbars[panels[story]] : null;

	function handleSearch(e) {
		setSearch(e.target.value.toLowerCase());
	}

	const value = props.inputData[redux_form] ? props.inputData[redux_form][field] : null;

	function isDone(cat) {
		if (!value) {
			return cat == none_value;
		}
		return getText(value) == getText(cat);
	}

	function onCellClick(cat) {
		if (props.clear) {
			props.setFormData(redux_form, {
				...defaultInputData,
				[field]: cat,
			});
		} else {
			props.setFormData(redux_form, {
				...props.inputData[redux_form],
				[field]: cat,
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

	const isValid = () => myVariant && myVariant.length > 2 && myVariant.length < 30;

	const grouping = Groups.grouping;
	const filter = props.filterFunc || ((v) => v);
	const getImage = Groups.getImageFunc || ((v) => null);
	const getText = Groups.getTextFunc || ((v) => v);
	console.log('grouping', grouping);

	return (
		<>
			{noVariant ? (
				<>
					<CellButton mode="danger" onClick={hideMyVariant}>
						Отменить
					</CellButton>
					<FormLayout>
						<Input
							top="Подкатегория"
							name="Подкатегория"
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
								{choosenGroup.array.map((v, i) => {
									return (
										<Cell
											key={getText(v)}
											before={getImage(v)}
											onClick={() => {
												onCellClick(v);
											}}
											asideContent={isDone(v) ? <Icon24Done /> : null}
											// draggable
											// onDragFinish={({ from, to }) => {
											// 	const draggingList = [...cats];
											// 	draggingList.splice(from, 1);
											// 	draggingList.splice(to, 0, cats[from]);
											// 	setCats(draggingList);
											// }}
										>
											{getText ? getText(v) : v}
										</Cell>
									);
								})}
							</List>
						) : (
							<>
								{Groups.data.map((group, gindex) => {
									const canShow = (i) => {
										const g1show = group.show || 0;
										const g2show = Groups.show || 0;
										let show = g1show;
										if (show < g2show) {
											show = g2show;
										}
										return Groups.showAll || group.showAllBtn || i < show;
									};
									let arr = group.array.filter((v) => filter(v).toLowerCase().indexOf(search) != -1);
									const len1 = arr.length;
									arr = arr.filter((v, i) => canShow(i));
									const len2 = arr.length;

									const needShowAllBtn = len1 != len2;
									return arr.length == 0 ? null : (
										<Group
											key={group.header}
											header={
												<Header
													onClick={() => {
														onCellClick(group.header);
													}}
												>
													{group.header}
												</Header>
											}
										>
											<List>
												{arr.map((v, i) => {
													return (
														<Cell
															key={getText(v)}
															before={getImage(v)}
															onClick={() => {
																onCellClick(v);
															}}
															asideContent={isDone(v) ? <Icon24Done /> : null}
															// draggable
															// onDragFinish={({ from, to }) => {
															// 	const draggingList = [...cats];
															// 	draggingList.splice(from, 1);
															// 	draggingList.splice(to, 0, cats[from]);
															// 	setCats(draggingList);
															// }}
														>
															{getText ? getText(v) : v}
														</Cell>
													);
												})}
											</List>
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
								})}

								{allowCustom ? (
									<Footer>
										<Link onClick={showMyVariant}>{customText}</Link>
									</Footer>
								) : null}
							</>
						)
					) : (
						<Group>
							{Groups.data
								.filter((v) => filter(v).toLowerCase().indexOf(search) != -1)
								.map((v) => (
									<Cell
										key={getText(v)}
										before={getImage(v)}
										onClick={() => {
											onCellClick(v);
										}}
										asideContent={isDone(v) ? <Icon24Done /> : null}
										// draggable
										// onDragFinish={({ from, to }) => {
										// 	const draggingList = [...cats];
										// 	draggingList.splice(from, 1);
										// 	draggingList.splice(to, 0, cats[from]);
										// 	setCats(draggingList);
										// }}
									>
										<Div>{getText(v)}</Div>
									</Cell>
								))}
						</Group>
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
