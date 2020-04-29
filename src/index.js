import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './panels/App';
import * as eruda from 'eruda';
import * as erudaCode from 'eruda-code';
import * as erudaDom from 'eruda-dom';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

import { setStory } from './store/router/actions';

import '@vkontakte/vkui/dist/vkui.css';

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
if (process.env.NODE_ENV === 'development') {
	eruda.init();
	eruda.add(erudaCode);
	eruda.add(erudaDom);
}
