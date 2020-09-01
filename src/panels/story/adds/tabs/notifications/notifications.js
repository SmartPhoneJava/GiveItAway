import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Header, Group, Placeholder, Spinner, Cell, Switch } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import useNotificationsGet from './useNotificationsGet';

import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';

import Error from './../../../../placeholders/error';

import { timeDate } from './../../../../../utils/time';

import { sendSnack, getPermissionPM, setPermissionPM } from './../../../../../requests';

import './notification.css';
import { STATUS_CHOSEN } from '../../../../../const/ads';
import { openSnackbar, openPopout, closePopout } from '../../../../../store/router/actions';
import Notification from './Notification';
import { AnimationGroup, withLoadingIf } from '../../../../../components/image/image_cache';
import { allowMessages } from '../../../../../services/VK';

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
export const NT_MAX_BID = 'max_bid_upd';

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
		case NT_MAX_BID:
			sendSnack('Кто то перебил вашу ставку');
	}
}

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

	const [notsPM, setNotsPM] = useState(false);
	const [notsPMLoaded, setNotsPMLoaded] = useState(false);
	useEffect(() => {
		getPermissionPM(
			props.myID,
			(v) => {
				setNotsPM(v);
				setNotsPMLoaded(true);
			},
			() => {
				setNotsPM(false);
				setNotsPMLoaded(true);
			}
		);
	}, []);

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

	function removeDuplicates(arr) {
		const result = [];
		const duplicatesIndices = [];

		// Перебираем каждый элемент в исходном массиве
		arr.forEach((current, index) => {
			if (duplicatesIndices.includes(index)) return;

			result.push(current);

			// Сравниваем каждый элемент в массиве после текущего
			for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
				const comparison = arr[comparisonIndex];
				const currentKeys = Object.keys(current);
				const comparisonKeys = Object.keys(comparison);

				// Проверяем длину массивов
				if (currentKeys.length !== comparisonKeys.length) continue;

				// Проверяем значение ключей
				const currentKeysString = currentKeys.sort().join('').toLowerCase();
				const comparisonKeysString = comparisonKeys.sort().join('').toLowerCase();
				if (currentKeysString !== comparisonKeysString) continue;

				// Проверяем индексы ключей
				let valuesEqual = true;
				for (let i = 0; i < currentKeys.length; i++) {
					const key = currentKeys[i];
					if (current[key] !== comparison[key]) {
						valuesEqual = false;
						break;
					}
				}
				if (valuesEqual) duplicatesIndices.push(comparisonIndex);
			} // Конец цикла
		});
		return result;
	}

	const [arrNotRead, setArrNotRead] = useState([]);
	const [arrRead, setArrRead] = useState([]);

	function countNotRead() {
		let anr = [];
		arrNotRead.forEach((e) => {
			anr.push(...e);
		});
		anr = removeDuplicates([...anr, ...nots.filter((v) => !v.is_read)]);
		let newArrNotRead = [];

		while (anr.length > 0) {
			const first = anr[0];
			const filtered = anr.filter((v) => {
				return timeDate(v.creation_date_time) == timeDate(first.creation_date_time);
			});
			console.log('filtered', filtered);
			newArrNotRead.push(filtered);
			anr = anr.slice(filtered.length);
		}
		setArrNotRead(newArrNotRead);
	}

	function countRead() {
		console.log('nots are', nots);
		let ar = [];
		arrRead.forEach((e) => {
			ar.push(...e);
		});
		ar = [...ar, ...nots.filter((v) => v.is_read)]
		console.log('arrrr', ar);
		ar = removeDuplicates(ar)
		console.log('arrrr2', ar);
		let newArrRead = [];

		while (ar.length > 0) {
			const first = ar[0];
			const filtered = ar.filter((v) => timeDate(v.creation_date_time) == timeDate(first.creation_date_time));
			newArrRead.push(filtered);
			ar = ar.slice(filtered.length);
		}
		console.log('filtered', newArrRead);

		setArrRead(newArrRead);
	}

	props.zeroNots();

	function handleChecked(e) {
		const newValue = e.currentTarget.checked;
		if (newValue) {
			console.log('aaaa');
			allowMessages(
				() => {
					setPermissionPM(props.myID, newValue);
				},
				() => {
					setNotsPM(false);
				}
			);
		} else {
			setPermissionPM(props.myID, newValue);
		}
		setNotsPM(newValue);
	}

	const [body, setBody] = useState(<></>);

	useEffect(() => {
		delay++;
		const DELAY = delay;
		let cancel = false;

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
				<Cell
					multiline
					asideContent={withLoadingIf(
						notsPMLoaded,
						<Switch style={{ cursor: 'pointer' }} checked={notsPM} onChange={handleChecked} />
					)}
				>
					Отправлять уведомления в Личные Сообщения
				</Cell>
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
			cancel = true;
		};
	}, [inited, loading, notsPM, notsPMLoaded]);

	if (error) {
		return <Error />;
	}
	return body;
};

const mapStateToProps = (state) => {
	return {
		myID: state.vkui.myID,
	};
};

const mapDispatchToProps = {
	openSnackbar,
	openPopout,
	closePopout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

// 502
