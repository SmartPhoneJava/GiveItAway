export const GEO_TYPE_FILTERS = 'filters';
export const GEO_TYPE_NEAR = 'near';
export const GEO_TYPE_NO = 'no';

export const SORT_TIME = 'time';
export const SORT_GEO = 'geo';

export const COLOR_DEFAULT = 'rgba(0,0,0,0.6)';
export const COLOR_DONE = 'rgba(0,75,0,0.8)';
export const COLOR_CANCEL = 'rgba(75,0,0,0.8)';

export const TYPE_CHOICE = 'choice';
export const TYPE_RANDOM = 'random';
export const TYPE_AUCTION = 'auction';

export const STATUS_OFFER = 'offer';
export const STATUS_CHOSEN = 'chosen';
export const STATUS_CLOSED = 'closed';
export const STATUS_ABORTED = 'aborted';

export const AD_LOADING = {
	ad_id: -2,
	status: 'loading',
	header: 'Загрузка',
	anonymous: false,
	text: 'Загрузка',
	creation_date: 'Загрузка',
	ad_type: TYPE_CHOICE,
	ls_enabled: true,
	comments_enabled: true,
	extra_enabled: true,
	comments_count: 0,
	subscribers_num: 0,
	category: 'animals',
	extra_field: '',
	views_count: '0',
	location: 'Загрузка',
	pathes_to_photo: [],
	author: {
		vk_id: -1,
		name: 'Загрузка',
		surname: 'Загрузка',
	},
};

export const AdDefault = {
	ad_id: -1,
	status: 'offer',
	header: 'Тест',
	anonymous: false,
	text: 'Описание',
	creation_date: '13.12.2012',
	ad_type: TYPE_CHOICE,
	ls_enabled: true,
	comments_enabled: true,
	extra_enabled: true,
	comments_count: 0,
	subscribers_num: 0,
	category: 'animals',
	extra_field: '',
	views_count: '87',
	location: 'Барнаул, Яблочная улица',
	pathes_to_photo: [],
	author: {
		vk_id: 2,
		name: 'Алёна',
		surname: 'Чернышева',
	},
};

export const TAB_ADS = 'adds';
export const TAB_ADS_TEXT = 'Объявления';

export const TAB_NOTIFICATIONS = 'notifications';
export const TAB_NOTIFICATIONS_TEXT = 'Уведомления';

export const MODE_ALL = 'all';
export const MODE_WANTED = 'wanted';
export const MODE_GIVEN = 'managed';
