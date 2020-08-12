import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as eruda from 'eruda';
import * as erudaCode from 'eruda-code';
import * as erudaDom from 'eruda-dom';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

import '@vkontakte/vkui/dist/vkui.css';

// document.addEventListener(
// 	'touchstart',
// 	function (e) {
// 		console.log('was it false', e.defaultPrevented); // will be false
// 		// e.preventDefault(); // does nothing since the listener is passive
// 		console.log(e.defaultPrevented); // still false
// 	},
// 	Modernizr.passiveeventlisteners ? { passive: true } : false
// );

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
