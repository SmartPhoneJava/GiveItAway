import bridge from '@vkontakte/vk-bridge';

import { store } from '../index';

import { setColorScheme, setMyID, setMyUser } from '../store/vk/actions';
import { success, fail } from '../requests';
import { setGeoData } from '../store/create_post/actions';

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

// export const getAuthToken = () => (dispatch) => {
// 	const appID = store.getState().vkui.appID;

// 	bridge
// 		.send('VKWebAppGetAuthToken', {
// 			app_id: appID,
// 			scope: '',
// 		})
// 		.then((data) => {
// 			dispatch(setAccessToken(data.access_token));
// 			return data;
// 		})
// 		.catch((e) => {
// 			dispatch(setAccessToken(null));
// 		});
// };

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

export const allowMessages = (success, fail) => {
	bridge
		.send('VKWebAppAllowMessagesFromGroup', { group_id: 194671970, key: 'dBuBKe1kFcdemzB' })
		.then((data) => {
			console.log('allowMessages success', data);
			success();
			return data;
		})
		.catch((error) => {
			console.log('allowMessages fail', error);
			fail();
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
			return error;
		});
};

export const shareApp = () => {
	const appID = store.getState().vkui.appID;
	return bridge
		.send('VKWebAppShare', { link: 'https://vk.com/app' + appID + '#' })
		.then((data) => {
			success('Вы успешно поделились объявлением');
			return data;
		})
		.catch((error) => {
			return error;
		});
};

export const postApp = () => {
	return bridge
		.send('VKWebAppShowWallPostBox', {
			message:
				'https://vk.com/app7360033 - Отдавай и получай без-воз-мез-дно, т.е даром! Здесь вы можете отдать свой старый холодильник,  раздать котят,  получить вещи первой необходимости, расчистить свой балкон от ненужных вещей, тут же забить его новыми и многое другое!',
		})
		.then((data) => {
			success('Вы успешно поделились объявлением');
			return data;
		})
		.catch((error) => {
			return error;
		});
};

export const postStoryApp = () => {
	const stickers1 = [
		{
			sticker_type: 'renderable',
			sticker: {
				can_delete: 0,
				content_type: 'image',
				url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Dialog.png',
				clickable_zones: [
					{
						action_type: 'link',
						action: {
							link: 'https://vk.com/wall-166562603_1192',
							tooltip_text_key: 'tooltip_open_post',
						},
						clickable_area: [
							{
								x: 17,
								y: 110,
							},
							{
								x: 97,
								y: 110,
							},
							{
								x: 97,
								y: 132,
							},
							{
								x: 17,
								y: 132,
							},
						],
					},
				],
			},
		},
	];
	const stickers = [
		{
			sticker_type: 'native',
			sticker: {
				action_type: 'text',
				action: {
					text: 'Отдать даром',
					style: 'marker',
					selection_color: '#33CCFF',
					background_style: 'sticker',
				},
				transform: {
					gravity: 'center_top',
					translation_y: 0.1,
					rotation: 10,
					relation_width: 0.8,
				},
			},
		},
		{
			sticker_type: 'native',
			sticker: {
				action_type: 'text',
				action: {
					text: 'отдавай ненужное,\n получай необходимое',
					style: 'marker',
					selection_color: '#99CCFF',
					background_style: 'solid',
				},
				transform: {
					translation_y: -0.1,
					relation_width: 0.99,
					gravity: 'center_bottom',
				},
			},
		},
		{
			sticker_type: 'renderable',
			sticker: {
				can_delete: 0,
				content_type: 'image',
				url: 'https://i.imgur.com/igRw4Dl.png',
				clickable_zones: [
					{
						action_type: 'link',
						action: {
							link: 'https://vk.com/app7360033',
							tooltip_text_key: 'tooltip_open_post',
							transform: {
								relation_width: 0.15,
							},
						},
						clickable_area: [
							{
								x: 17,
								y: 110,
							},
							{
								x: 97,
								y: 110,
							},
							{
								x: 97,
								y: 132,
							},
							{
								x: 17,
								y: 132,
							},
						],
					},
				],
			},
		},
	];
	return bridge
		.send('VKWebAppShowStoryBox', {
			background_type: 'image',
			url: 'https://sun1-83.userapi.com/0QRpYvldpBt6X45omFT937P7JGluqtOT9IHK2Q/cIgz-evmWyw.jpg',

			stickers,
		})
		.then((data) => {
			success('Вы успешно поделились объявлением');
			return data;
		})
		.catch((error) => {
			console.log('errrr', error);
			return error;
		});
};

export const getGeodata = (activeStory, successCallback, failCallback) => {
	let cleanupFunction = false;
	const s = successCallback || (() => {});
	const f = failCallback || (() => {});
	bridge
		.send('VKWebAppGetGeodata')
		.then((geodata) => {
			if (!cleanupFunction) {
				if (geodata.available) {
					s(geodata);
					store.dispatch(setGeoData(activeStory, geodata));
				} else {
					f(error);
					fail('Не удалось получить местоположение. Проверьте, включен ли GPS');
					return;
				}
			}
		})
		.catch((error) => {
			console.log('VKWebAppGetGeodata error', error);
			f(error);
			fail('Не удалось получить местоположение. Проверьте, включен ли GPS');
		});
	return () => (cleanupFunction = true);
};
