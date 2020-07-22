import { PUSH_TO_CACHE } from './actionTypes';

const initialState = {};

export const cacheReducer = (state = initialState, action) => {
	switch (action.type) {
		case PUSH_TO_CACHE: {
			return {
				...state,
				[action.payload.name]: action.payload.component,
			};
		}

		default: {
			return state;
		}
	}
};
