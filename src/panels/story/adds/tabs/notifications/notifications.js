import React, { useState, useRef, useCallback } from 'react';
import { Header, Group, Placeholder, Button, Snackbar } from '@vkontakte/vkui';

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

import Error from './../../../../placeholders/error';

import { timeDate } from './../../../../../utils/time';

import { sendSnack } from './../../../../../requests';

import './notification.css';
import Notification from './Notification';
import { STATUS_CHOSEN, STATUS_ABORTED } from '../../../../../const/ads';

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

export function handleNotifications(note, setSnackbar) {
	switch (note.data.notification_type) {
		case NT_STATISTICS:
			sendSnack('Прилетела новая статистика', setSnackbar);
			return;
		case NT_STATUS:
			sendSnack('Статус объявления изменен', setSnackbar);
			return;
		case NT_CLOSE:
			sendSnack('Объявление закрыто', setSnackbar);
			return;
		case NT_DELETED:
			sendSnack('Объявление удалено', setSnackbar);
			return;
		case NT_RESPOND:
			sendSnack('Кто то откикнулся на объявление', setSnackbar);
			return;
		case NT_FULFILL:
			sendSnack('Объявление завершено', setSnackbar);
			return;
		case NT_COMMENT:
			sendSnack('Обьявление прокомментировано', setSnackbar);
			return;
	}
	// setSnackbar(
	// 	<Snackbar
	// 		style={{zIndex:"120"}}
	// 		duration="1500"
	// 		onClose={() => {
	// 			setSnackbar(null);
	// 		}}
	// 	>
	// 		asdadasdsa
	// 	</Snackbar>
	// );
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

function getNotifications(bigarr, lastAdElementRef, openUser, openAd, setSnackbar) {
	return bigarr.map((arr, jindex) => {
		const dt = timeDate(arr[0].creation_date_time);
		return (
			<Group key={dt} header={<Header mode="secondary">{dt}</Header>}>
				{arr.map((v, index) => {
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
									openUser={openUser}
									openAd={openAd}
									key={v.id}
									notification={v}
									setSnackbar={setSnackbar}
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
									openUser={openUser}
									openAd={openAd}
									key={v.id}
									notification={v}
									setSnackbar={setSnackbar}
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
									openUser={openUser}
									openAd={openAd}
									key={v.id}
									notification={v}
									setSnackbar={setSnackbar}
								/>
							);
							break;
						case NT_RESPOND:
							inner = (
								<Notification
									ad={v.payload.ad}
									date={v.creation_date_time}
									author={
										v.payload ? v.payload.author.name + ' ' + v.payload.author.surname[0] + '.' : ''
									}
									text="хочет забрать!"
									header={v.payload.ad.header}
									system={true}
									openUser={openUser}
									openAd={openAd}
									key={v.id}
									notification={v}
									setSnackbar={setSnackbar}
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
									openUser={openUser}
									openAd={openAd}
									key={v.id}
									notification={v}
									setSnackbar={setSnackbar}
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
									openUser={openUser}
									ad={v.payload.ad}
									openAd={openAd}
									key={v.id}
									notification={v}
									setSnackbar={setSnackbar}
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
									openUser={openUser}
									openAd={openAd}
									key={v.id}
									notification={v}
									setSnackbar={setSnackbar}
								/>
							);
					}
					if (arr.length === index + 1 && bigarr.length === jindex + 1) {
						return (
							<div key={v.notification_id} ref={lastAdElementRef}>
								{inner}
							</div>
						);
					} else {
						return <div key={v.notification_id}>{inner}</div>;
					}
				})}
			</Group>
		);
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

	let arrNotRead = [];
	let arrRead = [];

	function countNotRead() {
		let anr = [];
		arrNotRead.forEach((e) => {
			anr = [...anr, ...e];
		});
		anr = [...anr, ...nots.filter((v) => !v.is_read)];
		arrNotRead = [];

		while (anr.length > 0) {
			const first = anr[0];
			const filtered = anr.filter((v) => {
				return timeDate(v.creation_date_time) == timeDate(first.creation_date_time);
			});
			arrNotRead.push(filtered);
			anr = anr.slice(filtered.length);
		}
	}

	function countRead() {
		let ar = [];
		arrRead.forEach((e) => {
			ar = [...ar, ...e];
		});
		ar = [...ar, ...nots.filter((v) => v.is_read)];
		arrRead = [];

		while (ar.length > 0) {
			const first = ar[0];
			const filtered = ar.filter((v) => {
				return timeDate(v.creation_date_time) == timeDate(first.creation_date_time);
			});
			arrRead.push(filtered);
			ar = ar.slice(filtered.length);
		}
	}

	countNotRead();
	countRead();

	console.log('arrRead:', arrRead, error);
	props.zeroNots();
	if (error) {
		return <Error />;
	}

	return (
		<div>
			{arrNotRead.length > 0 ? (
				<Group header={<Header mode="primary">Непрочитанные</Header>}>
					{getNotifications(arrNotRead, lastAdElementRef, props.openUser, props.openAd, props.setSnackbar)}
				</Group>
			) : (
				''
			)}
			{arrRead.length > 0 ? (
				<Group header={<Header mode="primary"> {arrNotRead.length > 0 ? 'Прочитанные' : ''} </Header>}>
					{getNotifications(arrRead, lastAdElementRef, props.openUser, props.openAd, props.setSnackbar)}
				</Group>
			) : (
				''
			)}
			{!inited ? (
				''
			) : arrNotRead.length + arrRead.length == 0 ? (
				<Placeholder
					icon={<Icon56CheckCircleOutline />}
					action={
						<Button onClick={() => props.goToAds()} size="l">
							Назад
						</Button>
					}
				>
					Непрочитанных объявлений нет
				</Placeholder>
			) : (
				''
			)}
		</div>
	);
};

export default Notifications;
