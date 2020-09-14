import {
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
	SET_STORY_PROFILE,
	UPDATE_CONTEXT,
	CLOSE_DUMMY,
} from './actionTypes';
import { PANEL_USER, PANEL_ONE } from './panelTypes';

export const setStory = (story, panel) => ({
	type: SET_STORY,
	payload: {
		story,
		panel,
	},
});

export const setStoryProfile = (profileID) => ({
	type: SET_STORY_PROFILE,
	payload: {
		profileID,
	},
});

export const setDummy = (dummy) => ({
	type: SET_DUMMY,
	payload: {
		dummy,
	},
});

export const closeDummy = () => ({
	type: CLOSE_DUMMY,
});

export const setPage = (panel, clearAll) => ({
	type: SET_PAGE,
	payload: {
		panel,
		clearAll,
	},
});

export const setProfile = (profile) => ({
	type: SET_PROFILE,
	payload: {
		panel: PANEL_USER,
		profile,
	},
});

export const updateContext = (info) => ({
	type: UPDATE_CONTEXT,
	payload: {
		info,
	},
});

export const setAd = (ad, clearAll) => ({
	type: SET_AD,
	payload: {
		panel: PANEL_ONE,
		clearAll,
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

export const openModal = (modal, direction) => ({
	type: OPEN_MODAL,
	payload: {
		modal,
		direction,
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
