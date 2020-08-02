import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import { setFormData } from '../../store/create_post/actions';
import { ADS_FILTERS } from '../../store/create_post/types';
import { closeAllModals, closeModal } from '../../store/router/actions';

import bridge from '@vkontakte/vk-bridge';

import { Radio, Header, CellButton, Button, Group, FormStatus, withModalRootContext, Div } from '@vkontakte/vkui';
import { getGeodata } from '../../services/VK';
import { pushToCache } from '../../store/cache/actions';
import { fail } from '../../requests';

const { SORT_TIME, SORT_GEO } = require('../../const/ads');

export const SaveCancelButtons = (save, cancel) => {
	return (
		<div className="flex-center">
			<div className="filters-button">
				<Button stretched size="xl" mode="secondary" onClick={cancel} before={<Icon24Cancel />}>
					Назад
				</Button>
			</div>
			<div className="filters-button">
				<Button stretched size="xl" mode="primary" onClick={save} before={<Icon24Done />}>
					Сохранить
				</Button>
			</div>
		</div>
	);
};

const ModalPageAdsSortInner = (props) => {
	const { setFormData, closeAllModals, inputData, pushToCache, closeModal } = props;

	const [changed, setChanged] = useState(false);
	const [valid, setValid] = useState(true);
	const [isTimeSort, setIsTimeSort] = useState(true);
	const [sort, setSort] = useState(SORT_TIME);
	const [geodata, setGeodata] = useState();
	useEffect(() => {
		if (!inputData[ADS_FILTERS] || inputData[ADS_FILTERS].sort == undefined) {
			return;
		}
		setSort(inputData[ADS_FILTERS].sort);
		setIsTimeSort(inputData[ADS_FILTERS].sort == SORT_TIME);
	}, []);

	useEffect(() => {
		props.updateModalHeight();
	}, [changed, valid]);

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
		bridge
			.send('VKWebAppGetGeodata')
			.then((value) => {
				setGeodata(value);
				applyGeoSortInner();
				console.log('VKWebAppGetGeodata', value);
			})
			.catch(() => {
				setValid(false);
				applyTimeSort();
				fail('Нет доступа к геопозиции');
			});
	}

	function save() {
		console.log('geodata is', geodata);
		setFormData(ADS_FILTERS, {
			...inputData[ADS_FILTERS],
			sort,
			geodata: geodata ? geodata : inputData[ADS_FILTERS].geodata,
		});
		pushToCache(true, 'ignore_cache');
		closeAllModals();
	}

	return (
		<>
			<Group separator="show">
				<Radio checked={isTimeSort} key={SORT_TIME} value={SORT_TIME} name="sort" onChange={applyTimeSort}>
					По времени
				</Radio>
				<Radio checked={!isTimeSort} key={SORT_GEO} value={SORT_GEO} name="sort" onChange={applyGeoSort}>
					По близости
				</Radio>
				{!valid && (
					<Div>
						<FormStatus header="Нет доступа к GPS" mode={valid ? 'default' : 'error'}>
							Проверьте, что у вас включена геолокация и вы предоставили сервису доступ к нему.
						</FormStatus>
					</Div>
				)}
			</Group>

			{changed && SaveCancelButtons(save, closeModal)}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		direction: state.router.direction,
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
