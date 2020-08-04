import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Header, Group, Placeholder, Button, Spinner } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import useNotificationsGet from './useNotificationsGet';

import Man from './../../../../../img/man.jpeg';
import Cat from './../../../../../img/cat.jpg';
import Kitten from './../../../../../img/kitten.jpeg';
import Jins from './../../../../../img/jins.jpg';
import Tea from './../../../../../img/tea.jpg';
import Playstein from './../../../../../img/playstein.jpg';
import Bb from './../../../../../img/bb.jpg';

import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

import { AnimateGroup, AnimateOnChange } from 'react-animation';

import Error from './../../../../placeholders/error';

import { timeDate } from './../../../../../utils/time';

import { sendSnack } from './../../../../../requests';

import './notification.css';
import { STATUS_CHOSEN, STATUS_ABORTED } from '../../../../../const/ads';
import { openSnackbar, openPopout, closePopout } from '../../../../../store/router/actions';
import Notification, { NotificationTESTER } from './Notification';
import { AnimationChange, AnimationGroup } from '../../../../../components/image/image_cache';

export const NT_CLOSE = 'ad_close'; // приходит выбранному автором пользователю
export const NT_RESPOND = 'respond'; // приходит автору
export const NT_FULFILL = 'fulfill'; // приходит автору
export const NT_STATISTICS = 'statistics'; // приходит автору
export const NT_SUB_CANCEL = 'subscriberCancel'; // приходит автору
export const NT_STATUS = 'status'; // приходит подписчикам
export const NT_DELETED = 'deleted'; // приходит подписчикам
export const NT_COMMENT = 'new_comment'; // приходит всем
export const NT_COMMENT_DELETED = 'delete_comment'; // приходит всем
export const NT_AD_STATUS = 'status_changed';

export function handleNotifications(note) {
	switch (note.data.notification_type) {
		case NT_STATISTICS:
			sendSnack('Прилетела новая статистика');
			return;
		case NT_STATUS:
			sendSnack('Статус объявления изменен');
			return;
		case NT_CLOSE:
			sendSnack('Объявление закрыто');
			return;
		case NT_DELETED:
			sendSnack('Объявление удалено');
			return;
		case NT_RESPOND:
			sendSnack('Кто то откикнулся на объявление');
			return;
		case NT_FULFILL:
			sendSnack('Объявление завершено');
			return;
		case NT_COMMENT:
			sendSnack('Обьявление прокомментировано');
			return;
	}
}

const arr = [
	{
		id: 1,
		notification_type: NT_CLOSE,
		creation_date_time: '18.03.2020 12:11',
		is_read: true,
		payload: {
			author: {
				vk_id: 45863670,
				name: 'Семен',
				surname: 'Eфимов',
				photo_url: Man,
			},
			ad: {
				ad_id: 3201,
				status: STATUS_CHOSEN,
				header: 'Отдам котенка',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Cat },
					{ AdPhotoId: 2, PhotoUrl: Bb },
					{ AdPhotoId: 3, PhotoUrl: Tea },
				],
			},
			deal: {
				id: 1,
			},
		},
	},
	{
		id: 2,
		notification_type: NT_RESPOND,
		creation_date_time: '19.03.2020 17:20',
		is_read: false,
		payload: {
			author: {
				vk_id: 45863670,
				name: 'Семен',
				surname: 'Eфимов',
				photo_url: 'Man',
			},
			ad: {
				ad_id: 3201,
				status: 'offer',
				header: 'Заберите продукты: бананы и морковку',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Tea },
					{ AdPhotoId: 2, PhotoUrl: Bb },
					{ AdPhotoId: 3, PhotoUrl: Cat },
				],
			},
		},
	},
	{
		id: 3,
		notification_type: NT_STATUS,
		creation_date_time: '19.03.2020 17:20',
		is_read: false,
		payload: {
			ad: {
				ad_id: 3201,
				status: STATUS_CHOSEN,
				header: 'Меняю вещи',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Jins },
					{ AdPhotoId: 2, PhotoUrl: Bb },
					{ AdPhotoId: 3, PhotoUrl: Tea },
				],
			},
		},
	},
	{
		id: 4,
		notification_type: NT_FULFILL,
		creation_date_time: '19.03.2020 17:20',
		is_read: false,
		payload: {
			ad: {
				ad_id: 3201,
				status: STATUS_CHOSEN,
				header: 'Ловите штукатурку',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Bb },
					{ AdPhotoId: 2, PhotoUrl: Jins },
					{ AdPhotoId: 3, PhotoUrl: Tea },
				],
			},
		},
	},
	{
		id: 5,
		notification_type: NT_STATUS,
		creation_date_time: '19.03.2020 17:20',
		is_read: false,
		payload: {
			ad: {
				ad_id: 3201,
				status: STATUS_ABORTED,
				header: 'Заберите продукты: бананы и морковку',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Tea },
					{ AdPhotoId: 2, PhotoUrl: Bb },
					{ AdPhotoId: 3, PhotoUrl: Cat },
				],
			},
		},
	},
	{
		id: 6,
		notification_type: NT_STATUS,
		creation_date_time: '19.03.2020 17:20',
		is_read: false,
		payload: {
			ad: {
				ad_id: 3201,
				status: 'closen',
				header: 'Заберите продукты: бананы и морковку',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Tea },
					{ AdPhotoId: 2, PhotoUrl: Bb },
					{ AdPhotoId: 3, PhotoUrl: Cat },
				],
			},
		},
	},
	{
		id: 7,
		notification_type: NT_STATISTICS,
		creation_date_time: '19.03.2020 17:20',
		is_read: false,
		payload: {
			ad: {
				ad_id: 3201,
				status: 'closen',
				header: 'Заберите продукты: бананы и морковку',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Tea },
					{ AdPhotoId: 2, PhotoUrl: Bb },
					{ AdPhotoId: 3, PhotoUrl: Cat },
				],
			},
			views: 100,
		},
	},
	{
		id: 8,
		notification_type: NT_DELETED,
		creation_date_time: '19.03.2020 17:20',
		is_read: false,
		payload: {
			ad: {
				ad_id: 3201,
				status: 'closen',
				header: 'Заберите продукты: бананы и морковку',
				pathes_to_photo: [
					{ AdPhotoId: 1, PhotoUrl: Tea },
					{ AdPhotoId: 2, PhotoUrl: Bb },
					{ AdPhotoId: 3, PhotoUrl: Cat },
				],
			},
			views: 100,
		},
	},
];

let delay = 0;

function getNotifications(bigarr, lastAdElementRef) {
	return bigarr.map((arr, jindex) => {
		const dt = timeDate(arr[0].creation_date_time);
		return (
			<Group key={dt} header={<Header mode="secondary">{dt}</Header>}>
				{AnimationGroup(
					arr.map((v) => {
						let inner = <></>;
						switch (v.notification_type) {
							case NT_STATUS:
								inner = (
									<Notification
										ad={v.payload.ad}
										date={v.creation_date_time}
										author=""
										text={
											v.status == STATUS_CHOSEN
												? 'Автор выбрал пользователя для передачи вещи'
												: v.status == 'close'
												? 'Вещь отдана'
												: 'Выбран получатель вещи'
										}
										header={v.payload.ad.header}
										system={true}
										key={v.id}
										notification={v}
									/>
								);
								break;
							case NT_CLOSE:
								inner = (
									<Notification
										ad={v.payload.ad}
										date={v.creation_date_time}
										author=""
										text="Автор выбрал вас получателем. Кликни по мне после получения объекта объявления!"
										header={v.payload.ad.header}
										system={true}
										key={v.id}
										notification={v}
									/>
								);
								break;
							case NT_DELETED:
								inner = (
									<Notification
										ad={v.payload.ad}
										date={v.creation_date_time}
										author=""
										text="Объявление удалено"
										header={v.payload.ad.header}
										system={true}
										key={v.id}
										notification={v}
									/>
								);
								break;
							case NT_RESPOND:
								inner = (
									<Notification
										ad={v.payload.ad}
										date={v.creation_date_time}
										author={
											v.payload
												? v.payload.author.name + ' ' + v.payload.author.surname[0] + '.'
												: ''
										}
										text="хочет забрать!"
										header={v.payload.ad.header}
										system={true}
										key={v.id}
										notification={v}
									/>
								);
								break;
							case NT_FULFILL:
								inner = (
									<Notification
										ad={v.payload.ad}
										date={v.creation_date_time}
										author=""
										text="Ваша вещь получена!"
										header={v.payload.ad.header}
										system={true}
										key={v.id}
										notification={v}
									/>
								);
								break;
							case NT_COMMENT:
								inner = (
									<Notification
										date={v.creation_date_time}
										// author={v.payload.author.name + ' ' + v.payload.author.surname[0] + '. написал'}
										author={
											v.payload && v.payload.comment.author
												? v.payload.comment.author.name +
												  ' ' +
												  v.payload.comment.author.surname[0] +
												  '.'
												: ''
										}
										text={v.payload ? v.payload.comment.text : ''}
										header={v.payload ? v.payload.ad.header : ''}
										system={false}
										ad={v.payload.ad}
										key={v.id}
										notification={v}
									/>
								);
								break;
							case NT_SUB_CANCEL:
								inner = (
									<Notification
										ad={v.payload.ad}
										date={v.creation_date_time}
										author={
											v.payload.author
												? v.payload.author.name + ' ' + v.payload.author.surname[0] + '.'
												: ''
										}
										//author={v.payload.author.name + ' ' + v.payload.author.surname[0] + '.'}
										text="отписался от обновлений"
										header={v.payload.ad.header}
										system={true}
										key={v.id}
										notification={v}
									/>
								);
						}
						return inner;
					})
				).map((v, index) => (
					<div
						key={index}
						ref={arr.length === index + 1 && bigarr.length === jindex + 1 ? lastAdElementRef : null}
					>
						{v}
					</div>
				))}
			</Group>
		);
	});
}

const Notifications = (props) => {
	const { openPopout, closePopout } = props;
	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, nots, error, hasMore, newPage } = useNotificationsGet(pageNumber, 10);

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => newPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	console.log('INITED IS', inited);

	const [arrNotRead, setArrNotRead] = useState([]);
	const [arrRead, setArrRead] = useState([]);

	function countNotRead() {
		let anr = [];
		arrNotRead.forEach((e) => {
			anr.push(e);
		});
		anr = [...anr, ...nots.filter((v) => !v.is_read)];
		let newArrNotRead = [];

		while (anr.length > 0) {
			const first = anr[0];
			const filtered = anr.filter((v) => {
				return timeDate(v.creation_date_time) == timeDate(first.creation_date_time);
			});
			newArrNotRead.push(filtered);
			anr = anr.slice(filtered.length);
		}
		console.log('newArrNotRead', newArrNotRead);
		setArrNotRead(newArrNotRead);
	}

	function countRead() {
		let ar = [];
		arrRead.forEach((e) => {
			ar.push(e);
		});
		ar = [...ar, ...nots.filter((v) => v.is_read)];
		let newArrRead = [];

		while (ar.length > 0) {
			const first = ar[0];
			const filtered = ar.filter((v) => timeDate(v.creation_date_time) == timeDate(first.creation_date_time));
			console.log('filtered', filtered);
			newArrRead.push(filtered);
			ar = ar.slice(filtered.length);
		}
		console.log('newArrRead', newArrRead);
		setArrRead(newArrRead);
	}

	console.log('arrRead:', arrRead, error);
	props.zeroNots();
	if (error) {
		return <Error />;
	}

	const [body, setBody] = useState(<></>);

	useEffect(() => {
		console.log('loading INON', loading, pageNumber, delay);
		delay++;
		const DELAY = delay;
		let cancel = false;

		console.log('loading delay', delay, DELAY);
		if (cancel) {
			return;
		}
		if (loading) {
			if (arrNotRead.length == 0 && arrRead.length == 0) {
				openPopout(<Spinner size="large" />);
			}
		} else {
			closePopout();
			countNotRead();
			countRead();
		}
		setBody(
			<div>
				{arrNotRead.length > 0 ? (
					<Group header={<Header mode="primary">Непрочитанные</Header>}>
						{getNotifications(arrNotRead, lastAdElementRef)}
					</Group>
				) : null}
				{arrRead.length > 0 ? (
					<Group header={arrNotRead.length > 0 && <Header mode="primary"> Прочитанные </Header>}>
						{getNotifications(arrRead, lastAdElementRef)}
					</Group>
				) : null}
				{!inited || loading ? null : arrNotRead.length + arrRead.length == 0 ? (
					<Placeholder icon={<Icon56CheckCircleOutline />}>Непрочитанных объявлений нет</Placeholder>
				) : null}
			</div>
		);

		return () => {
			console.log('loading delay cancel');
			cancel = true;
		};
	}, [inited, loading]);

	return body;
};

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {
	openSnackbar,
	openPopout,
	closePopout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

// 502
