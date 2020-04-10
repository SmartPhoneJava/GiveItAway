import React, { useState, useRef, useCallback } from 'react';
import { Header, Group } from '@vkontakte/vkui';

import useNotificationsGet from './useNotificationsGet';

import Man from './../../../../../img/man.jpeg';
import Cat from './../../../../../img/cat.jpg';
import Kitten from './../../../../../img/kitten.jpeg';
import Jins from './../../../../../img/jins.jpg';
import Tea from './../../../../../img/tea.jpg';
import Playstein from './../../../../../img/playstein.jpg';
import Bb from './../../../../../img/bb.jpg';

import './notification.css';
import Notification, {
	NotificationClose,
	NotificationRespond,
	NotificationStatus,
	NotificationDeleted,
	NotificationFulFill,
	NotificationStatistics,
} from './Notification';

const NT_CLOSE = 'ad_close'; // приходит выбранному автором пользователю
const NT_RESPOND = 'respond'; // приходит автору
const NT_FULFILL = 'fulfill'; // приходит автору
const NT_STATISTICS = 'statistics'; // приходит автору
const NT_STATUS = 'status'; // приходит подписчикам
const NT_DELETED = 'deleted'; // приходит подписчикам

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
				status: 'chosen',
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
				status: 'chosen',
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
				status: 'chosen',
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
				status: 'aborted',
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

function getNotifications(arr, lastAdElementRef) {
	return arr.map((v, index) => {
		let inner = <Notification key={v.id} notification={v} />;
		switch (v.notification_type) {
			case NT_STATISTICS:
				inner = <NotificationStatistics notification={v} />;
				break;
			case NT_STATUS:
				inner = <NotificationStatus notification={v} />;
				break;
			case NT_CLOSE:
				inner = <NotificationClose notification={v} />;
				break;
			case NT_DELETED:
				inner = <NotificationDeleted notification={v} />;
				break;
			case NT_RESPOND:
				inner = <NotificationRespond notification={v} />;
				break;
			case NT_FULFILL:
				inner = <NotificationFulFill notification={v} />;
				break;
		}
		if (arr.length === index + 1) {
			return (
				<div key={v.id} ref={lastAdElementRef}>
					{inner}
				</div>
			);
		} else {
			return <div key={v.id}>{inner}</div>;
		}
	});
}

const Notifications = (props) => {
	const [search, setSearch] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, nots, error, hasMore, newPage } = useNotificationsGet(
		props.setPopout,
		search,
		pageNumber,
		5
	);

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

	const arrNotRead = nots.filter((v) => !v.is_read);
	const arrRead = nots.filter((v) => v.is_read);

	return (
		<div style={{ background: '#F7F7F7' }}>
			{arrNotRead.length > 0 ? (
				<Group header={<Header mode="secondary">Непрочитанные</Header>}>
					{getNotifications(arrNotRead, lastAdElementRef)}
				</Group>
			) : (
				''
			)}
			{arrRead.length > 0 ? (
				<Group header={<Header mode="secondary">Прочитанные</Header>}>
					{getNotifications(arrRead, lastAdElementRef)}
				</Group>
			) : (
				''
			)}
		</div>
	);
};

export default Notifications;
