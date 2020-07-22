import { PUSH_TO_CACHE } from './actionTypes';

export const pushToCache = (component, name) => ({
	type: PUSH_TO_CACHE,
	payload: {
		name,
		component
	},
});
