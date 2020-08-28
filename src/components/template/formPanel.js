import React, { useState } from 'react';
import { setFormData } from './../../store/create_post/actions';

import { connect } from 'react-redux';

import { Group, Search, List, Cell } from '@vkontakte/vkui';

import Icon24Done from '@vkontakte/icons/dist/24/done';

const FormPanel = (props) => {
	const {
		redux_form,
		array,
		getImage,
		getText,
		field,
		goBack,
		none_value,
		defaultInputData,
		snackbars,
		story,
		panels,
		afterClick,
	} = props;

	const [search, setSearch] = useState('');

	const snackbar = panels && story && panels[story] && snackbars ? snackbars[panels[story]] : null;

	const filterFunc = props.filterFunc || ((v) => v);

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

	return (
		<>
			<Group>
				<Search value={search} onChange={handleSearch} />
				<List>
					{array
						.filter((v) => v && filterFunc(v).toLowerCase().indexOf(search) != -1)
						.map((cat) => (
							<Cell
								key={getText ? getText(cat) : cat}
								before={getImage ? getImage(cat) : null}
								onClick={() => {
									onCellClick(cat);
								}}
								style={{ cursor: 'pointer' }}
								asideContent={isDone(cat) ? <Icon24Done /> : null}
								// draggable
								// onDragFinish={({ from, to }) => {
								// 	const draggingList = [...cats];
								// 	draggingList.splice(from, 1);
								// 	draggingList.splice(to, 0, cats[from]);
								// 	setCats(draggingList);
								// }}
							>
								<div style={{ paddingLeft: '10px' }}>{getText ? getText(cat) : cat}</div>
							</Cell>
						))}
				</List>
			</Group>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormPanel);
