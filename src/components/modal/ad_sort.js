import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import { setFormData } from '../../store/create_post/actions';
import { ADS_FILTERS } from '../../store/create_post/types';
import { closeAllModals, closeModal, updateContext } from '../../store/router/actions';

import { Radio, Button, Group, FormStatus, withModalRootContext, Div, Spinner } from '@vkontakte/vkui';
import { getGeodata } from '../../services/VK';
import { pushToCache } from '../../store/cache/actions';
import { fail } from '../../requests';

const { SORT_TIME, SORT_GEO } = require('../../const/ads');

export const SaveCancelButtons = (save, cancel, disabled) => {
	return (
		<div className="flex-center">
			<div className="filters-button">
				<Button
					style={{ cursor: 'pointer' }}
					stretched
					size="xl"
					mode="secondary"
					onClick={cancel}
					before={<Icon24Cancel />}
				>
					Назад
				</Button>
			</div>
			<div className="filters-button">
				<Button
					disabled={disabled}
					style={{ cursor: 'pointer' }}
					stretched
					size="xl"
					mode="primary"
					onClick={save}
					before={<Icon24Done />}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
};

const ModalPageAdsSortInner = (props) => {
	const { setFormData, closeAllModals, inputData, pushToCache, closeModal, activeStory } = props;

	const [changed, setChanged] = useState(false);
	const [loading, setLoading] = useState(false);
	const [valid, setValid] = useState(true);
	const [isTimeSort, setIsTimeSort] = useState(true);
	const [sort, setSort] = useState(SORT_TIME);
	const [geodata, setGeodata] = useState();
	useEffect(() => {
		if (!inputData[activeStory + ADS_FILTERS] || inputData[activeStory + ADS_FILTERS].sort == undefined) {
			return;
		}
		setSort(inputData[activeStory + ADS_FILTERS].sort);
		setIsTimeSort(inputData[activeStory + ADS_FILTERS].sort == SORT_TIME);
	}, []);

	useEffect(() => {
		props.updateModalHeight();
	});

	function applyTimeSort() {
		setIsTimeSort(true);
		setSort(SORT_TIME);
		setChanged(sort != SORT_TIME);
		props.updateModalHeight();
	}

	function applyGeoSortInner() {
		setIsTimeSort(false);
		setSort(SORT_GEO);
		setValid(true);
		setChanged(sort != SORT_GEO);
		props.updateModalHeight();
	}

	function applyGeoSort() {
		setLoading(true);
		getGeodata(
			activeStory,
			(value) => {
				setLoading(false);
				setGeodata(value);
				console.log("we wanna set geodata", value)
				applyGeoSortInner();
				setValid(true);
			},
			() => {
				setLoading(false);
				setValid(false);
				applyTimeSort();
			},
			true
		);
	}

	function save() {
		setFormData(activeStory + ADS_FILTERS, {
			...inputData[activeStory + ADS_FILTERS],
			sort,
			geodata: geodata ? geodata : inputData[activeStory + ADS_FILTERS].geodata,
		});
		pushToCache(true, 'ignore_cache');
		closeAllModals();
	}

	return (
		<>
			<Group separator="show">
				<Radio
					style={{ cursor: 'pointer' }}
					checked={isTimeSort}
					key={SORT_TIME}
					value={SORT_TIME}
					name="sort"
					onChange={applyTimeSort}
				>
					По времени
				</Radio>
				<div style={{ display: 'flex' }}>
					<Radio
						style={{ cursor: 'pointer', flex: 1 }}
						checked={!isTimeSort}
						key={SORT_GEO}
						value={SORT_GEO}
						name="sort"
						onChange={applyGeoSort}
					>
						По близости
					</Radio>

					{loading ? (
						<Div className="right">
							<Spinner size="small" />
						</Div>
					) : null}
				</div>
				{!valid && (
					<Div>
						<FormStatus header="Нет доступа к GPS" mode={valid ? 'default' : 'error'}>
							Проверьте, что у вас включена геолокация и вы предоставили сервису доступ к ней.
						</FormStatus>
					</Div>
				)}
				{changed && SaveCancelButtons(save, closeModal)}
			</Group>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		direction: state.router.direction,
		activeStory: state.router.activeStory,
	};
};

const mapDispatchToProps = {
	setFormData,
	closeAllModals,
	pushToCache,
	closeModal,
};

export const ModalPageAdsSort = withModalRootContext(
	connect(mapStateToProps, mapDispatchToProps)(ModalPageAdsSortInner)
);

// 112
