import { connect } from 'react-redux';

import { MODAL_ADS_COST } from './../../store/router/modalTypes';

import { openModal, closeModal } from './../../store/router/actions';

import AddsModal from './../../panels/story/adds/AddsModal';

function openCarma(dispatch) {
	dispatch(openModal(MODAL_ADS_COST));
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
		openCarma: () => openCarma(dispatch),
	};
};

const AdsModal = connect(mapStateToProps, mapDispatchToProps)(AddsModal);

export default AdsModal;

// 166 -> 97 -> 52 -> 33
