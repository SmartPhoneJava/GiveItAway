import { connect } from 'react-redux';

import { MODAL_ADS_COST, MODAL_ADS_SORT, MODAL_ADS_GEO } from './../../store/router/modalTypes';

import { openModal, closeModal, setPage } from './../../store/router/actions';

import { PANEL_CATEGORIES } from '../../store/router/panelTypes';

import AddsModal from './../../panels/story/adds/AddsModal';

function openCategories(dispatch) {
	dispatch(closeModal());
	dispatch(setPage(PANEL_CATEGORIES));
}

function openCarma(dispatch) {
	dispatch(openModal(MODAL_ADS_COST));
}

function openSort(dispatch) {
	dispatch(openModal(MODAL_ADS_SORT));
}

function openGeoSearch(dispatch) {
	dispatch(openModal(MODAL_ADS_GEO));
}

const mapStateToProps = (state) => {
	return {
		activeModals: state.router.activeModals,
		inputData: state.formData.forms,
		ad: state.ad,
		myID: state.vkui.myID,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		closeModal: () => dispatch(closeModal()),

		openGeoSearch: () => openGeoSearch(dispatch),
		openSort: () => openSort(dispatch),
		openCategories: () => openCategories(dispatch),
		openCarma: () => openCarma(dispatch),
	};
};

const AdsModal = connect(mapStateToProps, mapDispatchToProps)(AddsModal);

export default AdsModal;

// 166 -> 97 -> 52
