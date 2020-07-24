import {
	SET_COMMENTS,
	ADD_COMMENT,
	DELETE_COMMENT,
	EDIT_COMMENT,
	SET_SUBS,
	ADD_SUB,
	DEL_SUB,
	SET_IS_AUTHOR,
	SET_IS_SUB,
	SET_IS_DEALER,
	SET_IS_HIDDEN,
	SET_STATUS,
	SET_EXTRA_INFO,
	SET_DEAL,
	SET_COST,
	SET_SWIPE_IMAGES,
	CLEAR,
	SET_DEALER,
	AD_BACK,
	SET_TO_HISTORY,
} from './actionTypes';

export const setComments = (comments) => ({
	type: SET_COMMENTS,
	payload: {
		comments,
	},
});

export const addComment = (comment) => ({
	type: ADD_COMMENT,
	payload: {
		comment,
	},
});

export const deleteCommentByID = (id) => ({
	type: DELETE_COMMENT,
	payload: {
		id,
	},
});

export const editComment = (comment) => ({
	type: EDIT_COMMENT,
	payload: {
		comment,
	},
});

export const setSubs = (subs) => ({
	type: SET_SUBS,
	payload: {
		subs,
	},
});

export const addSub = (sub) => ({
	type: ADD_SUB,
	payload: {
		sub,
	},
});

export const deleteSub = (sub) => ({
	type: DEL_SUB,
	payload: {
		sub,
	},
});

export const setIsAuthor = (isAuthor) => ({
	type: SET_IS_AUTHOR,
	payload: {
		isAuthor,
	},
});

export const setIsSub = (isSub) => ({
	type: SET_IS_SUB,
	payload: {
		isSub,
	},
});

export const setIsDealer = (isDealer) => ({
	type: SET_IS_DEALER,
	payload: {
		isDealer,
	},
});

export const setDealer = (dealer) => ({
	type: SET_DEALER,
	payload: {
		dealer,
	},
});

export const setIsHidden = (hidden) => ({
	type: SET_IS_HIDDEN,
	payload: {
		hidden,
	},
});

export const setStatus = (status) => ({
	type: SET_STATUS,
	payload: {
		status,
	},
});

export const setDeal = (deal) => ({
	type: SET_DEAL,
	payload: {
		deal,
	},
});

export const setCost = (cost) => ({
	type: SET_COST,
	payload: {
		cost,
	},
});

export const backToPrevAd = () => ({
	type: AD_BACK,
});

export const setToHistory = (place) => ({
	type: SET_TO_HISTORY,
	payload: {
		place,
	},
});

export const clearAds = (ad_id) => ({
	type: CLEAR,
	payload: {
		ad_id,
	},
});

export const setExtraInfo = (ad, myID, extraMode) => ({
	type: SET_EXTRA_INFO,
	payload: {
		ad,
		myID,
		extraMode,
	},
});

export const setPhotos = (photos) => ({
	type: SET_SWIPE_IMAGES,
	payload: {
		photos,
	},
});

export const clear = () => ({
	type: CLEAR,
});
