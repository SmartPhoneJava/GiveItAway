import { connect } from 'react-redux';

import { MODAL_ADS_COST } from './../../store/router/modalTypes';

import { openModal, closeModal } from './../../store/router/actions';

import AddsModal from './../../panels/story/adds/AddsModal';
import { setFormData } from '../../store/create_post/actions';

function openCarma(dispatch) {
	dispatch(openModal(MODAL_ADS_COST));
}

const mapStateToProps = (state) => {
	return {
		activeModals: state.router.activeModals,
		activeStory: state.router.activeStory,
		activeContext: state.router.activeContext,
		inputData: state.formData.forms,

		myID: state.vkui.myID,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setFormData: (t, v) => {
			dispatch(setFormData(t, v));
		},
		closeModal: () => dispatch(closeModal()),
		openCarma: () => openCarma(dispatch),
	};
};

const AdsModal = connect(mapStateToProps, mapDispatchToProps)(AddsModal);

export default AdsModal;

// 166 -> 97 -> 52 -> 33
