export function time(t) {
	const get = new Date(t);
    const now = new Date();
    
	let result = '';

	const hAdd = get.getHours() > 9 ? '' : '0';
	const miAdd = get.getMinutes() > 9 ? '' : '0';
	const moAdd = get.getMonth() > 9 ? '' : '0';
	const dAdd = get.getDate() > 9 ? '' : '0';

	if (get.getDate() == now.getDate() && get.getMonth() == now.getMonth() && now.getFullYear() == get.getFullYear()) {
		result = 'Сегодня в ' + hAdd + get.getHours() + ':' + miAdd + get.getMinutes();
	} else {
		result = get + '!!!' + dAdd + get.getDate() + '.' + moAdd + (get.getMonth() + 1) + '.' + get.getFullYear();
	}

	return result;
}
