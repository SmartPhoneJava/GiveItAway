import bridge from '@vkontakte/vk-bridge';

import { store } from '../index';

import { setColorScheme, setAccessToken, setMyID, setMyUser } from '../store/vk/actions';
import { success, fail } from '../requests';

export const initApp = () => (dispatch) => {
	const bridgeCallback = (e) => {
		if (e.detail.type === 'VKWebAppUpdateConfig') {
			bridge.unsubscribe(bridgeCallback);
			dispatch(setColorScheme(e.detail.data.scheme));
		}
	};

	bridge.subscribe(bridgeCallback);
	return bridge
		.send('VKWebAppInit', {})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			return error;
		});
};

export const getAuthToken = () => (dispatch) => {
	const appID = store.getState().vkui.appID;

	bridge
		.send('VKWebAppGetAuthToken', {
			app_id: appID,
			scope: '',
		})
		.then((data) => {
			dispatch(setAccessToken(data.access_token));
			return data;
		})
		.catch((e) => {
			dispatch(setAccessToken(null));
		});
};

export const closeApp = () => {
	return bridge
		.send('VKWebAppClose', {
			status: 'success',
		})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			return error;
		});
};

export const swipeBackOn = () => {
	return bridge
		.send('VKWebAppEnableSwipeBack', {})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			return error;
		});
};

export const swipeBackOff = () => {
	return bridge
		.send('VKWebAppDisableSwipeBack', {})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			return error;
		});
};

export const groupsGet = () => {
	return APICall('groups.get', {
		extended: '1',
		fields: 'description',
		count: '100',
	});
};

export const APICall = (method, params) => {
	params['access_token'] = store.getState().vkui.accessToken;
	params['v'] = params['v'] === undefined ? store.getState().vkui.apiVersion : params['v'];

	return bridge
		.send('VKWebAppCallAPIMethod', {
			method: method,
			params: params,
		})
		.then((data) => {
			return data.response;
		})
		.catch((error) => {
			return error;
		});
};

export const getuser = (success) => (dispatch) => {
	return bridge
		.send('VKWebAppGetUserInfo')
		.then((data) => {
			console.log('wonna set', data);
			dispatch(setMyID(data.id));
			dispatch(setMyUser(data));
			if (success) {
				success(data);
			}
			return data;
		})
		.catch((error) => {
			return error;
		});
};

export const shareInVK = () => {
	const appID = store.getState().vkui.appID;
	const adID = store.getState().ad.ad_id;
	return bridge
		.send('VKWebAppShare', { link: 'https://vk.com/app' + appID + '#' + adID })
		.then((data) => {
			success('Вы успешно поделились объявлением');
			return data;
		})
		.catch((error) => {
			fail('Не удалось поделиться объявлением');
			return error;
		});
};
