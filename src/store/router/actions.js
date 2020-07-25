import {
	ADD_PROFILE,
	SET_PAGE,
	SET_STORY,
	GO_BACK,
	OPEN_POPOUT,
	CLOSE_POPOUT,
	OPEN_MODAL,
	CLOSE_MODAL,
	OPEN_SNACKBAR,
	CLOSE_SNACKBAR,
	SET_PROFILE,
	SET_AD,
	SET_DUMMY,
	CLOSE_ALL_MODALS,
	SET_TAB,
	SET_SCROLL,
} from './actionTypes';
import { PANEL_USER, PANEL_ONE } from './panelTypes';

export const setStory = (story, panel, save_to_history) => ({
	type: SET_STORY,
	payload: {
		story,
		panel,
		save_to_history,
	},
});

export const setDummy = (dummy) => ({
	type: SET_DUMMY,
	payload: {
		dummy,
	},
});

export const setPage = (panel) => ({
	type: SET_PAGE,
	payload: {
		panel,
	},
});

export const addProfile = (profile) => ({
	type: ADD_PROFILE,
	payload: {
		profile,
	},
});

export const setProfile = (profile) => ({
	type: SET_PROFILE,
	payload: {
		panel: PANEL_USER,
		profile,
	},
});

export const setAd = (ad) => ({
	type: SET_AD,
	payload: {
		panel: PANEL_ONE,
		ad,
	},
});

export const setTab = (tab) => ({
	type: SET_TAB,
	payload: {
		tab,
	},
});

export const goBack = () => ({
	type: GO_BACK,
});

export const openPopout = (popout) => ({
	type: OPEN_POPOUT,
	payload: {
		popout,
	},
});

export const closePopout = () => ({
	type: CLOSE_POPOUT,
});

export const openSnackbar = (snackbar) => ({
	type: OPEN_SNACKBAR,
	payload: {
		snackbar,
	},
});

export const closeSnackbar = () => ({
	type: CLOSE_SNACKBAR,
});

export const openModal = (modal) => ({
	type: OPEN_MODAL,
	payload: {
		modal,
	},
});

export const closeModal = () => ({
	type: CLOSE_MODAL,
});

export const closeAllModals = () => ({
	type: CLOSE_ALL_MODALS,
});

export const setScroll = (x, y) => ({
	type: SET_SCROLL,
	payload: {
		x,
		y,
	},
});
