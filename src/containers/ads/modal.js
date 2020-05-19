import React, { useState } from 'react';
import { connect } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';

import { MODAL_ADS_GEO, MODAL_ADS_COST } from './../../store/router/modalTypes';

import { ADS_FILTERS } from './../../store/create_post/types';

import { openModal, closeModal, setPage, closeAllModals } from './../../store/router/actions';

import { PANEL_CATEGORIES, PANEL_COUNTRIES, PANEL_CITIES } from '../../store/router/panelTypes';
import { setFormData } from '../../store/create_post/actions';

import AddsModal from './../../panels/story/adds/AddsModal';

import { GEO_TYPE_FILTERS, GEO_TYPE_NEAR, SORT_TIME, SORT_GEO } from './../../const/ads';
import { getGeodata } from '../../services/VK';

function applyTimeSort(inputData, dispatch) {
	dispatch(
		setFormData(ADS_FILTERS, {
			...inputData[ADS_FILTERS],
			sort: SORT_TIME,
		})
	);
	dispatch(closeModal());
}

function applyGeoSort(inputData, dispatch) {
	dispatch(
		setFormData(ADS_FILTERS, {
			...inputData[ADS_FILTERS],
			sort: SORT_GEO,
		})
	);
	bridge.send('VKWebAppGetGeodata').then((value) => {
		dispatch(
			setFormData(ADS_FILTERS, {
				...inputData[ADS_FILTERS],
				sort: SORT_GEO,
				geodata: value,
			})
		);
		console.log('VKWebAppGetGeodata', value);
	});
	dispatch(closeModal());
}

function setRadius(inputData, radius, dispatch) {
	dispatch(
		setFormData(ADS_FILTERS, {
			...inputData[ADS_FILTERS],
			radius,
		})
	);
}

function openCountries(dispatch) {
	dispatch(closeAllModals());
	dispatch(setPage(PANEL_COUNTRIES));
}

function openCities(dispatch) {
	dispatch(closeAllModals());
	dispatch(setPage(PANEL_CITIES));
}

function openCategories(dispatch) {
	dispatch(closeModal());
	dispatch(setPage(PANEL_CATEGORIES));
}

function openCarma(dispatch) {
	dispatch(openModal(MODAL_ADS_COST));
}

function openGeoSearch(dispatch) {
	dispatch(openModal(MODAL_ADS_GEO));
}

function setGeoFilters(inputData, dispatch) {
	dispatch(
		setFormData(ADS_FILTERS, {
			...inputData[ADS_FILTERS],
			geotype: GEO_TYPE_FILTERS,
		})
	);
}

function setGeoNear(inputData, dispatch) {
	dispatch(
		setFormData(ADS_FILTERS, {
			...inputData[ADS_FILTERS],
			geotype: GEO_TYPE_NEAR,
		})
	);
}

const mapStateToProps = (state) => {
	return {
		activeModals: state.router.activeModals,
		inputData: state.formData.forms,
		ad: state.ad,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		
		closeModal: () => dispatch(closeModal()),
		closeAllModals: () => dispatch(closeAllModals()),
		setRadius: (inputData, radius) => setRadius(inputData, radius, dispatch),
		applyTimeSort: (inputData) => applyTimeSort(inputData, dispatch),
		applyGeoSort: (inputData) => {
			applyGeoSort(inputData, dispatch)
			getGeodata()
		},
		setGeoFilters: (inputData) => setGeoFilters(inputData, dispatch),
		setGeoNear: (inputData) => {
			setGeoNear(inputData, dispatch)
			getGeodata()
		},
		openGeoSearch: () => openGeoSearch(dispatch),
		openCountries: () => openCountries(dispatch),
		openCities: () => openCities(dispatch),
		openCategories: () => openCategories(dispatch),
		openCarma: () => openCarma(dispatch),
	};
};

const AdsModal = connect(mapStateToProps, mapDispatchToProps)(AddsModal);

export default AdsModal;

