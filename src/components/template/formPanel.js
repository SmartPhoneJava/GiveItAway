import React, { useState, useEffect } from 'react';
import { setFormData } from './../../store/create_post/actions';
import { connect } from 'react-redux';

import { Group, Search, List, Cell } from '@vkontakte/vkui';

import Icon24Done from '@vkontakte/icons/dist/24/done';

const FormPanel = (props) => {
	const { redux_form, array, getImage, getText, field, back, none_value, defaultInputData } = props;

	const [search, setSearch] = useState('');

	const filterFunc = props.filterFunc || ((v) => v);

	function handleSearch(e) {
		setSearch(e.target.value.toLowerCase());
	}

	return (
		<Group>
			<Search value={search} onChange={handleSearch} />
			<List>
				{array
					.filter((v) => filterFunc(v).toLowerCase().indexOf(search) != -1)
					.map((cat) => (
						<Cell
							key={getText ? getText(cat) : cat}
							before={getImage ? getImage(cat) : null}
							onClick={() => {
								if (props.clear) {
									props.setFormData(redux_form, {
										...defaultInputData,
										stopMe: true,
										[field]: cat,
									});
								} else {
									console.log('props.inputData', props.inputData, redux_form);
									props.setFormData(redux_form, {
										...props.inputData[redux_form],
										[field]: cat,
									});
								}
								back();
							}}
							asideContent={
								(!props.inputData[redux_form] && cat == none_value) ||
								(props.inputData[redux_form] &&
									getText(props.inputData[redux_form][field]) == getText(cat)) ? (
									<Icon24Done />
								) : null
							}
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
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {
	setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormPanel);
