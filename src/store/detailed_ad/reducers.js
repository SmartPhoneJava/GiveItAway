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
	SET_SWIPE_IMAGES,
	CLEAR,
	SET_DEALER,
	SET_EXTRA_INFO,
	AD_BACK,
	SET_PHOTO_INDEX,
	SET_TO_HISTORY,
} from './actionTypes';
import Icon from './../../img/icon278.png';
import { TYPE_CHOICE } from '../../const/ads';
import { shortText } from '../../utils/short_text';

const initialState = {
	ad_id: -1,
	status: 'offer',
	header: 'Неизвестно',
	anonymous: false,
	text: 'Неизвестно',
	creation_date: 'Неизвестно',

	ad_type: TYPE_CHOICE,
	ls_enabled: true,
	comments_enabled: true,
	extra_enabled: true,
	comments_count: 0,
	subscribers_num: 0,

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
	geo_position: { lat: 1, long: 1 },

	comments: [],
	subs: [],

	photos: [],
	image: '',
	photoIndex: 0,

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

			const comments_count = state.comments_count > comments.length ? state.comments_count : comments.length;
			return {
				...state,
				comments,
				comments_count,
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
			const subscribers_num = state.subscribers_num > subs.length ? state.subscribers_num : subs.length;

			return {
				...state,
				subs,
				subscribers_num,
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

		case SET_EXTRA_INFO: {
			const ad = action.payload.ad;

			console.log('SET_EXTRA_INFO ad', ad);

			const ad_id = ad.ad_id;
			const status = ad.status;
			const header = ad.header;
			const text = ad.text;

			const creation_date = ad.creation_date;
			const feedback_type = ad.feedback_type;
			const category = ad.category;
			const subcat_list = ad.subcat_list;
			const subcat = ad.subcat;
			const extra_field = ad.extra_field;

			const views_count = ad.views_count;
			let geo_position = ad.geo_position;
			if (geo_position && geo_position.lat) {
				geo_position.lat.toFixed(5);
				geo_position.long.toFixed(5);
			}

			const ad_type = ad.ad_type;
			const ls_enabled = ad.ls_enabled;
			const comments_enabled = ad.comments_enabled;
			const extra_enabled = ad.extra_enabled;
			const comments_count = ad.comments_count;
			const subscribers_num = ad.subscribers_num;
			const isSub = ad.is_subscriber;

			const region = ad.region;
			const district = ad.district;
			const pathes_to_photo = ad.pathes_to_photo || [{ AdPhotoId: 1, PhotoUrl: Icon }];
			const hidden = ad.hidden;
			const author = ad.author || { vk_id: -1 };
			const isAuthor = author.vk_id == action.payload.myID;

			const image = (pathes_to_photo.length > 0 ? pathes_to_photo[0].PhotoUrl : null) || '';

			const photos = pathes_to_photo.map((v) => {
				let img = new Image();
				img.src = v.PhotoUrl;
				let width = img.width;
				let hight = img.height;
				return {
					src: v.PhotoUrl,
					msrc: v.PhotoUrl,
					w: width,
					h: hight,
					title: header,
					thumbnail: v.PhotoUrl,
				};
			});

			const extraMode = action.payload.extraMode;
			let deal = initialState.deal;
			let isDealer = initialState.isDealer;
			let dealer = initialState.dealer;
			let subs = initialState.subs;
			let cost = initialState.cost;

			if (extraMode) {
				deal = state.deal;
				isDealer = state.isDealer;
				dealer = state.dealer;
				subs = state.subs;
				cost = state.cost;
			}

			return {
				...initialState,
				ad_id,
				status,
				header,
				text,
				creation_date,
				feedback_type,
				category,
				subcat_list,
				subcat,
				extra_field,
				views_count,
				pathes_to_photo,
				author,
				hidden,
				region,
				district,
				ad_type,
				ls_enabled,
				comments_enabled,
				extra_enabled,
				comments_count,
				subscribers_num,
				isSub,
				geo_position,
				image,
				isAuthor,
				history: state.history,

				deal,
				isDealer,
				dealer,
				subs,
				cost,
			};
		}

		case SET_TO_HISTORY: {
			const history = [...state.history, state]
			console.log("SET_TO_HISTORY", history)
			return {
				...state,
				history,
			};
		}

		case AD_BACK: {
			const history = state.history || [];
			console.log('reducers AD_BACK history', history);
			let newState = state;
			if (history.length > 0) {
				newState = history[history.length - 1];
			}
			history.pop();
			console.log('reducers AD_BACK', newState);
			
			newState.history = history;

			return {
				...newState,
			};
		}

		case CLEAR: {
			console.log('CLEARCLEAR ad_id', action.payload.ad_id);
			const ad_id = action.payload.ad_id || initialState.ad_id;
			return {
				...initialState,
				ad_id,
			};
		}

		case SET_SWIPE_IMAGES: {
			const photos = action.payload.photos;

			return {
				...state,
				photos,
			};
		}

		case SET_PHOTO_INDEX: {
			const photoIndex = action.payload.photoIndex;
			const Photos = state.pathes_to_photo;
			const image = (photoIndex < Photos.length ? Photos[photoIndex].PhotoUrl : null) || '';
			console.log('seeet photoIndex', Photos, photoIndex, image);
			if (image == '') {
				return state;
			}
			return {
				...state,
				photoIndex,
				image,
			};
		}

		default: {
			return state;
		}
	}
};
