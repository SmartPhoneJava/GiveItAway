import { combineReducers } from 'redux';
import { routerReducer } from './router/reducers';
import { vkuiReducer } from './vk/reducers';
import { formDataReducer } from './create_post/reducers';
import { adReducer } from './detailed_ad/reducers';
import { cacheReducer } from './cache/reducers';

export default combineReducers({
	vkui: vkuiReducer,
	router: routerReducer,
	formData: formDataReducer,
	ad: adReducer,
	cache: cacheReducer,
});
