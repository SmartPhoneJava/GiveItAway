import {
	ADD_PROFILE,
	ADD_AD,
	SET_PAGE,
	SET_STORY,
	GO_BACK,
	OPEN_POPOUT,
	CLOSE_POPOUT,
	OPEN_MODAL,
	CLOSE_MODAL,
	SET_PROFILE,
	SET_AD,
} from './actionTypes';
import { PANEL_USER, PANEL_ONE } from './panelTypes';

export const setStory = (story) => ({
	type: SET_STORY,
	payload: {
		story: story,
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
		profile: profile,
	},
});

export const addAd = (ad) => ({
	type: ADD_AD,
	payload: {
		ad: ad,
	},
});

export const setProfile = (profile) => ({
	type: SET_PROFILE,
	payload: {
		panel: PANEL_USER,
		profile: profile,
	},
});

export const setAd = (ad) => ({
	type: SET_AD,
	payload: {
		panel: PANEL_ONE,
		ad: ad,
	},
});

export const goBack = () => ({
	type: GO_BACK,
});

export const openPopout = (popout) => ({
	type: OPEN_POPOUT,
	payload: {
		popout: popout,
	},
});

export const closePopout = () => ({
	type: CLOSE_POPOUT,
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
