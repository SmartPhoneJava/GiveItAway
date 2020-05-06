export function inputArgs() {
	var tmp = new Array(); // два вспомогательных
	var tmp2 = new Array(); // массива
	const get = new Array();
	// console.log("hi to", window.location.hash)
	var url = window.location.search; // строка GET запроса
	if (url != '') {
		tmp = url.substr(1).split('&'); // разделяем переменные

		for (var i = 0; i < tmp.length; i++) {
			tmp2 = tmp[i].split('='); // массив param будет содержать
			get[tmp2[0]] = tmp2[1]; // пары ключ(имя переменной)->значение
		}
	}

	const reg = /[\r\n]+/g;
	const vk_platform = get['vk_platform'] ? get['vk_platform'].replace(reg, '\n') : 'desktop';
	const h = window.location.hash;
	const hash = h.length > 0 ? h.slice(1, h.length) : '';
	return { vk_platform, app_id: parseInt(get['vk_app_id']), hash };
}
