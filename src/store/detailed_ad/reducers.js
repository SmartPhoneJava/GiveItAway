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
	SET_DEAL,
	SET_COST,
	SET_AD,
	SET_SWIPE_IMAGES,
	CLEAR,
	SET_DEALER,
	SET_EXTRA_INFO,
	GO_BACK,
	AD_BACK,
} from './actionTypes';

const initialState = {
	ad_id: -1,
	status: 'offer',
	header: 'Неизвестно',
	anonymous: false,
	text: 'Неизвестно',
	creation_date: 'Неизвестно',
	feedback_type: 'ls',
	category: 'animals',
	extra_field: '',
	views_count: 0,
	location: 'Неизвестно',
	region: '',
	district: '',
	pathes_to_photo: [],
	author: {
		vk_id: -1,
		name: 'Неизвестно',
		surname: 'Неизвестно',
		photo_url: '',
	},

	comments: [],
	subs: [],
	photos: [],
	deal: null,

	isAuthor: false,
	isSub: false,
	isDealer: false,
	dealer: null,
	hidden: false,

	history: [],

	cost: 0,
};

export const adReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_COMMENTS: {
			const comments = action.payload.comments;

			return {
				...state,
				comments,
			};
		}

		case ADD_COMMENT: {
			let comments = state.comments || [];
			const comment = action.payload.comment;
			comments = [...comments.filter((v) => v.comment_id != comment.comment_id), comment];

			return {
				...state,
				comments,
			};
		}

		case DELETE_COMMENT: {
			const comments = state.comments || [];
			const id = action.payload.id;

			return {
				...state,
				comments: comments.filter((v) => v.comment_id != id),
			};
		}

		case EDIT_COMMENT: {
			const comments = state.comments || [];
			const edited = action.payload.comment;

			return {
				...state,
				comments: comments.map((v) => (v.comment_id != edited.id ? v : edited)),
			};
		}

		case SET_SUBS: {
			const subs = action.payload.subs;

			return {
				...state,
				subs,
			};
		}

		case ADD_SUB: {
			let subs = state.subs || [];
			const sub = action.payload.sub;
			subs = [...subs.filter((v) => v.vk_id != sub.vk_id), sub];

			return {
				...state,
				subs,
			};
		}

		case DEL_SUB: {
			const subs = state.subs || [];
			const id = action.payload.id;

			return {
				...state,
				subs: subs.filter((v) => v.vk_id != id),
			};
		}

		case SET_IS_AUTHOR: {
			const isAuthor = action.payload.isAuthor;

			return {
				...state,
				isAuthor,
			};
		}

		case SET_IS_SUB: {
			const isSub = action.payload.isSub;

			return {
				...state,
				isSub,
			};
		}

		case SET_IS_DEALER: {
			const isDealer = action.payload.isDealer;

			return {
				...state,
				isDealer,
			};
		}

		case SET_IS_HIDDEN: {
			const hidden = action.payload.hidden;

			return {
				...state,
				hidden,
			};
		}

		case SET_STATUS: {
			const status = action.payload.status;

			return {
				...state,
				status,
			};
		}

		case SET_DEAL: {
			const deal = action.payload.deal;

			return {
				...state,
				deal,
			};
		}

		case SET_COST: {
			const cost = action.payload.cost;

			return {
				...state,
				cost,
			};
		}

		case SET_DEALER: {
			const dealer = action.payload.dealer;

			return {
				...state,
				dealer,
			};
		}

		case SET_AD: {
			const ad = action.payload.ad;
			const ad_id = ad.ad_id || state.ad_id;
			const status = ad.status || state.status;
			const header = ad.header || state.header;
			const text = ad.text || state.text;
			const creation_date = ad.creation_date || state.creation_date;
			const feedback_type = ad.feedback_type || state.feedback_type;
			const category = ad.category || state.category;
			const extra_field = ad.extra_field || state.extra_field;
			const views_count = ad.views_count || state.views_count;

			const region = ad.region || state.region;
			const district = ad.district || state.district;
			const pathes_to_photo = ad.pathes_to_photo || state.pathes_to_photo;
			const hidden = ad.hidden || state.hidden;
			const author = ad.author || state.author;

			return {
				...state,
				ad_id,
				status,
				header,
				text,
				creation_date,
				feedback_type,
				category,
				extra_field,
				views_count,
				pathes_to_photo,
				author,
				hidden,
				region,
				district,
			};
		}

		case SET_EXTRA_INFO: {
			const ad = action.payload.ad;
			const ad_id = ad.ad_id || state.ad_id;
			const status = ad.status || state.status;
			const header = ad.header || state.header;
			const text = ad.text || state.text;
			const creation_date = ad.creation_date || state.creation_date;
			const feedback_type = ad.feedback_type || state.feedback_type;
			const category = ad.category || state.category;
			const extra_field = ad.extra_field || state.extra_field;
			const views_count = ad.views_count || state.views_count;

			const region = ad.region || state.region;
			const district = ad.district || state.district;
			const pathes_to_photo = ad.pathes_to_photo || state.pathes_to_photo;
			const hidden = ad.hidden || state.hidden;
			const author = ad.author || state.author;

			let history = state.history || [];
			const Ad_id = state.ad_id || 0;
			if (Ad_id > 0) {
				history = [...history, state];
			}

			return {
				...state,
				ad_id,
				status,
				header,
				text,
				creation_date,
				feedback_type,
				category,
				extra_field,
				views_count,
				pathes_to_photo,
				author,
				hidden,
				region,
				district,
				history,
			};
		}

		case AD_BACK: {
			const history = state.history || [];
			let newState = state;
			if (history.length > 0) {
				newState = history[history.length - 1];
			}
			console.log("reducers AD_BACK")
			history.pop();
			newState.history = history;

			return {
				...newState,
			};
		}

		case CLEAR: {
			return {
				...initialState,
			};
		}

		case SET_SWIPE_IMAGES: {
			const photos = action.payload.photos;

			return {
				...state,
				photos,
			};
		}

		default: {
			return state;
		}
	}
};