import React, { useState, useRef, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	Header,
	Group,
	InfoRow,
	Cell,
	UsersStack,
	Placeholder,
	Button,
	usePlatform,
	IOS,
	Avatar,
	CellButton,
	ActionSheet,
	ActionSheetItem,
	Link,
} from '@vkontakte/vkui';

import Icon56Users3Outline from '@vkontakte/icons/dist/56/users_outline';

import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';
import Icon24Shuffle from '@vkontakte/icons/dist/24/shuffle';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24Message from '@vkontakte/icons/dist/24/message';
import Icon24Gift from '@vkontakte/icons/dist/24/gift';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon36Done from '@vkontakte/icons/dist/36/done';
import Icon36Cancel from '@vkontakte/icons/dist/36/cancel';

import useSubsGet from './useSubsGet';

import { getDeal, Close, CancelClose } from './../../../../../requests';

import Icon44SmileOutline from '@vkontakte/icons/dist/44/smile_outline';
import { openPopout, closePopout, openSnackbar, setPage } from '../../../../../store/router/actions';
import { setDealer } from '../../../../../store/detailed_ad/actions';
import { PANEL_SUBS } from '../../../../../store/router/panelTypes';
import { STATUS_ABORTED, STATUS_OFFER, STATUS_CLOSED } from '../../../../../const/ads';
import { updateDealInfo } from '../../../../../store/detailed_ad/update';

export const Given = (props) => {
	const dealer = props.dealer;
	const isAuthor = props.isAuthor;
	const openSubs = props.openSubs;
	return (
		<Group
			header={
				<Header
					aside={
						isAuthor ? (
							dealer ? (
								<Link onClick={openSubs}>Изменить</Link>
							) : (
								<Link onClick={openSubs}>Выбрать</Link>
							)
						) : null
					}
				>
					Получатель
				</Header>
			}
		>
			<Cell
				onClick={() => {
					if (isAuthor) {
					}
					if (dealer) {
						props.openUser(dealer.vk_id);
					}
				}}
				multiline={true}
				key={dealer ? dealer.vk_id : ''}
				before={dealer ? <Avatar size={36} src={dealer.photo_url} /> : <Icon24User />}
				asideContent={dealer ? <Icon24Chevron /> : ''}
			>
				<div>{dealer ? dealer.name + ' ' + dealer.surname : 'Никто не выбран'}</div>
			</Cell>
		</Group>
	);
};

const Subs = (props) => {
	const osname = usePlatform();
	const { openPopout, openSnackbar, closePopout, setDealer, openUser, setPage, AD } = props;
	const { dealer, subs, ad_id, subscribers_num } = AD;
	const status = AD.status || STATUS_OFFER;

	const [photos, setPhotos] = useState([]);
	const [openFAQ, setOpenFAQ] = useState(false);
	const [pageNumber, setPageNumber] = useState(1);

	function onClickOpen() {
		if (dealer) {
			openUser(dealer.vk_id);
		}
	}

	function onClickWrite() {
		if (dealer) {
			window.open('https://vk.com/im?sel=' + dealer.vk_id);
		}
	}

	function userClick(v, close, cancel) {
		if (v) {
			openPopout(
				<ActionSheet onClose={closePopout}>
					{!dealer || v.vk_id != dealer.vk_id ? (
						<ActionSheetItem autoclose onClick={() => close(v)}>
							Отдать
						</ActionSheetItem>
					) : (
						<ActionSheetItem autoclose onClick={() => cancel(v)}>
							Отменить
						</ActionSheetItem>
					)}
					<ActionSheetItem autoclose onClick={onClickOpen}>
						Перейти в профиль
					</ActionSheetItem>
					<ActionSheetItem autoclose onClick={onClickWrite}>
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

	const given = (
		<Group header={<Header>Получатель</Header>}>
			<Cell
				onClick={() => {
					cancel_ad(dealer, false);
				}}
				multiline={true}
				description={dealer ? <>Ждём подтверждение получения вещи</> : ''}
				key={dealer ? dealer.vk_id : ''}
				before={dealer ? <Avatar size={36} src={dealer.photo_url} /> : <Icon24User />}
				asideContent={dealer ? <Icon24Dismiss /> : ''}
			>
				<div>{dealer ? dealer.name + ' ' + dealer.surname : 'Никто не выбран'}</div>
			</Cell>
		</Group>
	);

	function showSubs(lastAdElementRef, close, cancel) {
		return (
			<>
				{given}

				<Group header={<Header mode="secondary">Откликнулись</Header>}>
					<CellButton onClick={() => close(subs[getRandomInt(subscribers_num)])} before={<Icon24Shuffle />}>
						Случайный выбор
					</CellButton>
					{subs.length > 0 ? (
						subs.map((v, i) => (
							<div key={v.vk_id} ref={subs.length == i + 1 ? lastAdElementRef : null}>
								<Cell
									onClick={() => {
										userClick(v, close, cancel);
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

	function close_ad(subscriber) {
		Close(
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

	function cancel_ad(subscriber, need_close) {
		CancelClose(
			ad_id,
			(data) => {
				console.log('we are stopping', need_close);
				if (need_close) {
					close_ad(subscriber);
				} else {
					setDealer(null);
				}
			},
			(e) => {},
			true
		);
	}
	function openSubs() {
		setPage(PANEL_SUBS);
	}

	let { inited, loading, error, hasMore, newPage } = useSubsGet(
		pageNumber,
		props.amount,
		ad_id,
		props.maxAmount,
		(s) => {
			setPhotos([...s].map((v) => v.photo_url));
			updateDealInfo();
		},
		(e) => {}
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

	if (status == STATUS_CLOSED) {
		return <Placeholder icon={<Icon36Done />} header="Вещь успешно передана"></Placeholder>;
	}
	if (status == STATUS_ABORTED) {
		return <Placeholder icon={<Icon36Cancel />} header="Передача вещи отменена" />;
	}
	if (subs.length == 0) {
		return (
			<Placeholder icon={<Icon56Users3Outline />} header="Откливнувшихся нет">
				Никто еще не захотел забрать
			</Placeholder>
		);
	}

	return props.mini ? (
		<Group header={<Header aside={<Link onClick={openSubs}>Показать всех</Link>}>Откликнулись</Header>}>
			{subs.length == 1 ? (
				<Cell
					onClick={openSubs}
					multiline={true}
					key={subs[0].vk_id}
					before={<Avatar size={36} src={subs[0].photo_url} />}
				>
					<div>{subs[0].name + ' ' + subs[0].surname}</div>
				</Cell>
			) : (
				<UsersStack onClick={openSubs} photos={photos} size="m">
					{subs.length == 2
						? subs[0].name + ' и ' + subs[1].name
						: subs.length == 3
						? subs[0].name + ', ' + subs[1].name + ', ' + subs[2].name
						: subs[0].name +
						  ', ' +
						  subs[1].name +
						  ', ' +
						  subs[2].name +
						  'и еще ' +
						  (subscribers_num - 3) +
						  ' человек откликнулись'}
				</UsersStack>
			)}
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
						lastAdElementRef,
						(subscriber) => {
							if (dealer) {
								cancel_ad(subscriber, true);
								return;
							}
							close_ad(subscriber);
						},
						(subscriber) => {
							cancel_ad(subscriber, false);
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

const mapStateToProps = (state) => {
	return {
		AD: state.ad,
		myID: state.vkui.myID,
	};
};

const mapDispatchToProps = {
	openPopout,
	openSnackbar,
	closePopout,
	setDealer,
	setPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Subs);
