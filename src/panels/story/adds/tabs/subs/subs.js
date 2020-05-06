import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
	Header,
	Group,
	InfoRow,
	Cell,
	UsersStack,
	Placeholder,
	Snackbar,
	Button,
	osname,
	IOS,
	Avatar,
	CellButton,
	ActionSheet,
	ActionSheetItem,
	Link,
} from '@vkontakte/vkui';

import Icon56Users3Outline from '@vkontakte/icons/dist/56/users_outline';

import Icon24Shuffle from '@vkontakte/icons/dist/24/shuffle';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24Message from '@vkontakte/icons/dist/24/message';
import Icon24Gift from '@vkontakte/icons/dist/24/gift';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

import useSubsGet from './useSubsGet';

import { getDeal, Close, CancelClose } from './../../../../../requests';

import Icon44SmileOutline from '@vkontakte/icons/dist/44/smile_outline';

function userClick(setPopout, openUser, v, dealer, close, cancel) {
	if (v) {
		setPopout(
			<ActionSheet onClose={() => setPopout(null)}>
				{!dealer || v.vk_id != dealer.vk_id ? (
					<ActionSheetItem autoclose onClick={() => close(v)}>
						Отдать
					</ActionSheetItem>
				) : (
					<ActionSheetItem autoclose onClick={() => cancel(v)}>
						Отменить
					</ActionSheetItem>
				)}
				<ActionSheetItem
					autoclose
					onClick={() => {
						if (dealer) {
							openUser(dealer.vk_id);
						}
					}}
				>
					Перейти в профиль
				</ActionSheetItem>
				<ActionSheetItem
					autoclose
					onClick={() => {
						window.open('https://vk.com/im?sel=' + dealer.vk_id);
					}}
				>
					Написать
				</ActionSheetItem>
				{osname === IOS && (
					<ActionSheetItem autoclose mode="cancel">
						Отменить
					</ActionSheetItem>
				)}
			</ActionSheet>
		);
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function showSubs(dealer, setPopout, lastAdElementRef, subs, openUser, close, cancel) {
	return (
		<>
			<Group header={<Header mode="secondary">Получатель</Header>}>
				<Cell
					multiline={true}
					description={dealer ? <>Ожидание подтверждения получения вещи от пользователя.</> : ''}
					onClick={() => {
						if (dealer) {
							cancel(dealer);
						}
					}}
					key={dealer ? dealer.vk_id : ''}
					before={<Avatar size={36} src={dealer ? dealer.photo_url : ''} />}
					asideContent={dealer ? <Icon24Dismiss /> : ''}
				>
					<div>{dealer ? dealer.name + ' ' + dealer.surname : 'Никто не выбран'}</div>
				</Cell>
			</Group>

			<Group header={<Header mode="secondary">Откликнулись</Header>}>
				<CellButton onClick={() => close(subs[getRandomInt(subs.length)])} before={<Icon24Shuffle />}>
					Случайный выбор
				</CellButton>
				{subs.length > 0 ? (
					subs.map((v, i) => (
						<div key={v.vk_id} ref={subs.length == i + 1 ? lastAdElementRef : null}>
							<Cell
								onClick={() => {
									userClick(setPopout, openUser, v, dealer, close, cancel);
								}}
								before={<Avatar size={36} src={v.photo_url} />}
								asideContent={
									!dealer || v.vk_id != dealer.vk_id ? (
										<Icon24Gift />
									) : (
										<Icon24Gift style={{ color: 'var(--header_tint)' }} />
									)
								}
							>
								<div>{v.name + ' ' + v.surname}</div>
							</Cell>
						</div>
					))
				) : (
					<InfoRow style={{ paddingLeft: '16px' }}> пусто</InfoRow>
				)}
			</Group>
		</>
	);
}

function close_ad(setPopout, setSnackbar, ad_id, subscriber, setDealer) {
	Close(
		setPopout,
		setSnackbar,
		ad_id,
		subscriber.vk_id,
		(data) => {
			console.log('what i have done?', data);
			setDealer(subscriber);
		},
		(e) => {
			console.log('Close error', e);
		}
	);
}

function cancel_ad(setPopout, setSnackbar, ad_id, subscriber, setDealer, need_close) {
	CancelClose(
		setPopout,
		setSnackbar,
		ad_id,
		(data) => {
			if (need_close) {
				close_ad(setPopout, setSnackbar, ad_id, subscriber, setDealer);
			} else {
				setDealer(null);
			}
		},
		(e) => {},
		true
	);
}

const NO_ID = -1;

const Subs = (props) => {
	const [subs, setSubs] = useState([]);
	const [dealer, setDealer] = useState(null);
	const [photos, setPhotos] = useState([]);
	const [openFAQ, setOpenFAQ] = useState(false);

	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, tsubs, error, hasMore, newPage } = useSubsGet(
		props.setPopout,
		pageNumber,
		props.amount,
		props.ad.ad_id,
		props.maxAmount,
		(s) => {
			console.log('i set', s);
			setSubs(s);
			setPhotos([...s].map((v) => v.photo_url));
			getDeal(
				props.setSnackbar,
				props.ad.ad_id,
				(data) => {
					console.log('deal success', data);
					const d = s.filter((v) => v.vk_id == data.subscriber_id)[0];
					console.log('dealer success', dealer, data.subscriber_id);
					setDealer(d);
				},
				(err) => {
					console.log('deal fail', err);
				}
			);
		},
		(e) => {}
	);
	console.log('subs', tsubs);

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

	if (subs.length == 0) {
		return (
			<Placeholder icon={<Icon56Users3Outline />} header="Откливнушихся нет">
				Никто еще не захотел забрать
			</Placeholder>
		);
	}

	return props.mini ? (
		<Group header={<Header aside={<Link onClick={props.openSubs}>Показать всех</Link>}>Откликнулись</Header>}>
			<UsersStack onClick={props.openSubs} photos={photos} size="m">
				{subs.length == 1
					? subs[0].name
					: subs.length == 2
					? subs[0].name + ' и ' + subs[1].name
					: subs.length == 3
					? subs[0].name + ', ' + subs[1].name + ', ' + subs[2].name
					: subs[0].name +
					  ', ' +
					  subs[1].name +
					  ', ' +
					  subs[2].name +
					  'и еще ' +
					  subs.length +
					  ' человек откликнулись'}
			</UsersStack>
		</Group>
	) : (
		<div>
			{!openFAQ ? (
				<>
					<CellButton
						onClick={() => {
							setOpenFAQ(true);
						}}
						before={<Icon24Help />}
					>
						Как отдать вещь?
					</CellButton>
					{showSubs(
						dealer,
						props.setPopout,
						lastAdElementRef,
						subs,
						props.openUser,
						(subscriber) => {
							if (dealer) {
								cancel_ad(
									props.setPopout,
									props.setSnackbar,
									props.ad.ad_id,
									subscriber,
									setDealer,
									true
								);
								return;
							}
							close_ad(props.setPopout, props.setSnackbar, props.ad.ad_id, subscriber, setDealer);
						},
						(subscriber) => {
							cancel_ad(props.setPopout, props.setSnackbar, props.ad.ad_id, subscriber, setDealer, false);
						}
					)}
				</>
			) : (
				<>
					<Placeholder
						action={
							<Button
								onClick={() => {
									setOpenFAQ(false);
								}}
								size="l"
							>
								Понятно
							</Button>
						}
						icon={<Icon44SmileOutline />}
						header="Как отдать вещь?"
					>
						Кликните по пользователю в списке откливнушихся, чтобы связаться с ним или отдать ему вещь.
						Выбранный пользователь получит уведомление о том, что он был выбран получателем вещи. Свяжитесь
						с ним для обсуждения деталей. Также потенциальный получатель получит уведомление, нажав на
						которое, он подвтердит, что передача состоялась, напомните ему нажать на него после того как
						отдадите вещь. После этого обьявление автоматически закроется. Вы в любой момент можете отозвать
						предложение или изменить получателя.
					</Placeholder>
				</>
			)}
		</div>
	);
};

export default Subs;
