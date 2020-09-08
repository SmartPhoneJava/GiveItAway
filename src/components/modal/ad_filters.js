import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { List, Cell, withModalRootContext } from '@vkontakte/vkui';
import { getGeoFilters } from './geo_filter';
import { ADS_FILTERS } from '../../store/create_post/types';

import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';

import CategoriesLabel from './../categories/label';
import { PANEL_CATEGORIES } from '../../store/router/panelTypes';
import { setPage, openModal, closeModal } from '../../store/router/actions';
import { MODAL_ADS_SORT, MODAL_ADS_GEO } from '../../store/router/modalTypes';
import { SORT_TIME } from '../../const/ads';

export const AdFiltersInner = (props) => {
	const { openModal, setPage, inputData, closeModal, activeStory } = props;
	const sort = (inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].sort : null) || SORT_TIME;
	function openCategories() {
		closeModal();
		setPage(PANEL_CATEGORIES);
	}

	function openSort() {
		openModal(MODAL_ADS_SORT);
	}

	function openGeoSearch() {
		openModal(MODAL_ADS_GEO);
	}

	useEffect(() => {
		props.updateModalHeight();
	});

	return (
		<>
			<CategoriesLabel redux_form={activeStory + ADS_FILTERS} leftMargin="10px" open={openCategories} />
			<List>
				<Cell
					style={{ cursor: 'pointer' }}
					asideContent={<Icon24BrowserForward />}
					onClick={openGeoSearch}
					indicator={getGeoFilters(props.inputData[activeStory + ADS_FILTERS])}
				>
					Искать
				</Cell>
				<Cell
					style={{ cursor: 'pointer' }}
					asideContent={<Icon24BrowserForward />}
					onClick={openSort}
					indicator={sort == SORT_TIME ? 'по времени' : 'по близости'}
				>
					Сортировка
				</Cell>
			</List>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		activeStory: state.router.activeStory,
	};
};

const mapDispatchToProps = {
	setPage,
	openModal,
	closeModal,
};

export const AdFilters = withModalRootContext(connect(mapStateToProps, mapDispatchToProps)(AdFiltersInner));
