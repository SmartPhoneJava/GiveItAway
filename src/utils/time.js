import moment from 'moment';

export function fromSeconds(t) {
	moment.locale('ru');
	return moment(new Date(+t * 1000)).fromNow();
}

export function time(t) {
	moment.locale('ru');
	return moment(t).fromNow();
}

export function old(t) {
	return t;
}

export function timeShort(t) {
	const get = new Date(t);

	const hAdd = get.getHours() > 9 ? '' : '0';
	const miAdd = get.getMinutes() > 9 ? '' : '0';

	return hAdd + get.getHours() + ':' + miAdd + get.getMinutes();
}

export function timeDate(t) {
	const get = new Date(t);

	let result = '';

	const moAdd = get.getMonth() > 9 ? '' : '0';
	const dAdd = get.getDate() > 9 ? '' : '0';

	return (result = dAdd + get.getDate() + '.' + moAdd + (get.getMonth() + 1) + '.' + get.getFullYear());
}
