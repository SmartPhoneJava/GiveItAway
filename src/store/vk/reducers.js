import {
	SET_ACCESS_TOKEN,
	SET_ACTIVE_TAB,
	SET_COLOR_SCHEME,
	SET_MY_ID,
	SET_APP_ID,
	SET_API_VERSION,
	SET_PLATFORM,
	SET_MY_USER,
} from './actionTypes';

const initialState = {
	accessToken: undefined,
	colorScheme: 'client_light',

	activeTab: [],
	componentScroll: [],

	myID: -1,
	appID: -1,
	apiVersion: '5.103',

	myUser: null,
	platform: 'none',
};

export const vkuiReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_COLOR_SCHEME: {
			return {
				...state,
				colorScheme: action.payload,
			};
		}

		case SET_ACCESS_TOKEN: {
			return {
				...state,
				accessToken: action.payload,
			};
		}

		case SET_ACTIVE_TAB: {
			return {
				...state,
				activeTab: {
					...state.activeTab,
					[action.payload.component]: action.payload.tab,
				},
			};
		}

		case SET_MY_ID: {
			return {
				...state,
				myID: action.payload,
			};
		}

		case SET_APP_ID: {
			return {
				...state,
				appID: action.payload,
			};
		}

		case SET_API_VERSION: {
			return {
				...state,
				apiVersion: action.payload,
			};
		}

		case SET_PLATFORM: {
			return {
				...state,
				platform: action.payload,
			};
		}

		case SET_MY_USER: {
			return {
				...state,
				myUser: action.payload,
			};
		}

		default: {
			return state;
		}
	}
};
