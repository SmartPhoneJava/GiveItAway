import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import { setFormData } from '../../store/create_post/actions';
import { ADS_FILTERS } from '../../store/create_post/types';
import { closeAllModals, closeModal } from '../../store/router/actions';

import bridge from '@vkontakte/vk-bridge';

import { Radio, Header, CellButton, Button, Group } from '@vkontakte/vkui';
import { getGeodata } from '../../services/VK';
import { pushToCache } from '../../store/cache/actions';

const { SORT_TIME, SORT_GEO } = require('../../const/ads');

export const SaveCancelButtons = (save, cancel) => {
	return (
		<div className="flex-center">
			<div style={{ padding: '8px', flex: 1, width: '100%' }}>
				<Button stretched size="xl" mode="secondary" onClick={cancel} before={<Icon24Cancel />}>
					Отменить
				</Button>
			</div>
			<div style={{ padding: '8px', flex: 1, width: '100%' }}>
				<Button stretched size="xl" mode="primary" onClick={save} before={<Icon24Done />}>
					Сохранить
				</Button>
			</div>
		</div>
	);
};

const ModalPageAdsSortInner = (props) => {
	const { setFormData, closeAllModals, inputData, pushToCache, closeModal } = props;

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
	function applyTimeSort() {
		setIsTimeSort(true);
		setSort(SORT_TIME);
	}

	function applyGeoSort() {
		setIsTimeSort(false);
		setSort(SORT_GEO);

		bridge.send('VKWebAppGetGeodata').then((value) => {
			setGeodata(value);

			console.log('VKWebAppGetGeodata', value);
		});
	}

	useEffect(() => {
		getGeodata();
	}, []);

	function save() {
		setFormData(ADS_FILTERS, {
			...inputData[ADS_FILTERS],
			sort,
			geodata,
		});
		pushToCache(true, 'ignore_cache');
		closeAllModals();
	}

	return (
		<>
			<Group separator="show" header={<Header mode="secondary">Отсортировать по</Header>}>
				<Radio checked={isTimeSort} key={SORT_TIME} value={SORT_TIME} name="sort" onChange={applyTimeSort}>
					По времени
				</Radio>
				<Radio checked={!isTimeSort} key={SORT_GEO} value={SORT_GEO} name="sort" onChange={applyGeoSort}>
					По близости
				</Radio>
			</Group>
			{SaveCancelButtons(save, closeModal)}
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

export const ModalPageAdsSort = connect(mapStateToProps, mapDispatchToProps)(ModalPageAdsSortInner);

// 112
