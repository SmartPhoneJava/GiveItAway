import React, { useState, useRef, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	Header,
	Group,
	InfoRow,
	Cell,
	Placeholder,
	usePlatform,
	IOS,
	Avatar,
	CellButton,
	ActionSheet,
	ActionSheetItem,
	Div,
} from '@vkontakte/vkui';

import Icon24Shuffle from '@vkontakte/icons/dist/24/shuffle';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24Gift from '@vkontakte/icons/dist/24/gift';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon36Done from '@vkontakte/icons/dist/36/done';
import Icon36Cancel from '@vkontakte/icons/dist/36/cancel';

import useSubsGet from './useSubsGet';

import { Close, CancelClose } from './../../../../../requests';

import { openPopout, closePopout, setPage, setProfile } from '../../../../../store/router/actions';
import { STATUS_ABORTED, STATUS_OFFER, STATUS_CLOSED, TYPE_CHOICE, TYPE_AUCTION } from '../../../../../const/ads';
import { updateDealInfo } from '../../../../../store/detailed_ad/update';
import { AnimationChange } from '../../../../../components/image/image_cache';
import { Collapse } from 'react-collapse';
import { openTab } from '../../../../../services/_functions';

const Subs = (props) => {
	const osname = usePlatform();
	const { openPopout, closePopout, setProfile, setPage, AD } = props;
	console.log('ADDDDDD IS', AD);
	const { dealer, subs, ad_id, isAuthor, ad_type, subscribers_num } = AD;
	const status = AD.status || STATUS_OFFER;

	const [openFAQ, setOpenFAQ] = useState(false);
	const [pageNumber, setPageNumber] = useState(1);

	function onClickOpen(vk_id) {
		setProfile(vk_id);
	}

	function onClickWrite(vk_id) {
		console.log('open/tab https://vk.com/im?sel=', vk_id);
		openTab('https://vk.com/im?sel=' + vk_id);
	}

	function userClick(v, close, cancel) {
		if (v) {
			if (isAuthor) {
				openPopout(
					<ActionSheet onClose={closePopout}>
						{isAuthor && ad_type == TYPE_CHOICE ? (
							!dealer || v.vk_id != dealer.vk_id ? (
								<ActionSheetItem autoclose onClick={() => close(v)}>
									Отдать
								</ActionSheetItem>
							) : (
								<ActionSheetItem autoclose onClick={() => cancel(v)}>
									Отменить
								</ActionSheetItem>
							)
						) : null}
						<ActionSheetItem autoclose onClick={() => onClickOpen(v.vk_id)}>
							Перейти в профиль
						</ActionSheetItem>
						<ActionSheetItem
							autoclose
							onClick={() => {
								openTab('https://vk.com/im?sel=' + v.vk_id);
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
			} else {
				onClickOpen(v.vk_id);
			}
		}
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	const [newGiven, setNewGiven] = useState([]);
	useEffect(() => {
		if (!props.AD) {
			return;
		}
		const { dealer } = props.AD;

		setNewGiven(
			<Cell
				style={{ cursor: 'pointer' }}
				onClick={() => {
					if (isAuthor) {
						cancel_ad(dealer, false);
					}
				}}
				multiline
				description={dealer ? 'Ждём подтверждение получения вещи' : ''}
				key={dealer ? dealer.vk_id : ''}
				before={dealer ? <Avatar size={36} src={dealer.photo_url} /> : <Icon24User />}
				asideContent={dealer ? <Icon24Dismiss /> : ''}
			>
				<div>{dealer ? dealer.name + ' ' + dealer.surname : 'Никто не выбран'}</div>
			</Cell>
		);
	}, [props.AD.dealer]);

	function close_ad(subscriber) {
		Close(
			ad_id,
			ad_type,
			subscriber.vk_id,
			(data) => {},
			(e) => {
				console.log('Close error', e);
			}
		);
	}

	function cancel_ad(subscriber, need_close) {
		CancelClose(
			ad_id,
			(data) => {
				if (need_close) {
					close_ad(subscriber);
				}
			},
			(e) => {},
			true
		);
	}

	const [subsComponent, setSubsComponent] = useState(<></>);
	useEffect(() => {
		const { ad_type, isAuthor } = props.AD;

		const close = (subscriber) => {
			if (dealer) {
				cancel_ad(subscriber, true);
				return;
			}
			close_ad(subscriber);
		};
		const cancel = (subscriber) => {
			cancel_ad(subscriber, false);
		};

		setSubsComponent(
			<>
				<Group header={<Header mode="secondary">Получатель</Header>}>
					<AnimationChange ignoreFirst={true} controll={newGiven} duration={300} />
				</Group>

				<Group header={<Header mode="secondary">Откликнулись</Header>}>
					{ad_type != TYPE_AUCTION && isAuthor && (
						<CellButton
							style={{ cursor: 'pointer' }}
							onClick={() => close(subs[getRandomInt(subscribers_num)])}
							before={<Icon24Shuffle />}
						>
							Случайный выбор
						</CellButton>
					)}
					{subs.length > 0 ? (
						subs.map((v, i) => (
							<div key={v.vk_id} ref={subs.length == i + 1 ? lastAdElementRef : null}>
								<Cell
									style={{ cursor: 'pointer' }}
									onClick={() => {
										userClick(v, close, cancel);
									}}
									before={<Avatar size={36} src={v.photo_url} />}
									asideContent={
										<div
											style={{
												marginLeft: '15px',
												transition: '0.3s',
												opacity: `${dealer && v.vk_id == dealer.vk_id ? 1 : 0}`,
											}}
										>
											<Icon24Gift style={{ color: 'var(--header_tint)' }} />
										</div>
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
	}, [subs, dealer]);

	let { inited, loading, error, hasMore, newPage } = useSubsGet(
		props.mini,
		pageNumber,
		props.amount,
		ad_id,
		props.maxAmount,
		(s) => {
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
	// if (subs.length == 0) {
	// 	return (
	// 		<Placeholder icon={<Icon56Users3Outline />} header="Откливнувшихся нет">
	// 			Никто еще не захотел забрать
	// 		</Placeholder>
	// 	);
	// }

	return (
		<div>
			{isAuthor && (
				<CellButton
					style={{ cursor: 'pointer' }}
					onClick={() => {
						setOpenFAQ((prev) => !prev);
					}}
					before={<Icon24Help />}
				>
					Как отдать вещь?
				</CellButton>
			)}
			<Collapse isOpened={openFAQ}>
				<Div>
					{ad_type == TYPE_CHOICE
						? `Кликните по пользователю в списке откливнушихся, чтобы связаться с ним или назначить получателем.
					Вы можете выбрать случайного пользователя, кликнув по кнопке "Случайный выбор".
					Выбранный пользователь получит соответствующее уведомление. После того как вы отдадите вещь,
					напомните получателю подтвердить получение вещи: перейти на страницу объявления и нажать
					"Подтвердить".`
						: `Кликните по пользователю в списке откливнушихся, чтобы связаться с ним. 
					Чтобы определить получателя, нажмите "Случайный выбор". Выбранный пользователь получит соответствующее уведомление. После того как вы отдадите вещь,
					напомните получателю подтвердить получение вещи: перейти на страницу объявления и нажать
					"Подтвердить".`}
				</Div>
			</Collapse>
			{subsComponent}
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
	closePopout,
	setPage,
	setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Subs);

// 332
