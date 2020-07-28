import React, { useState, useEffect } from 'react';
import {
	Avatar,
	Header,
	InfoRow,
	Group,
	Cell,
	Counter,
	Link,
	SimpleCell,
	Button,
	CellButton,
	RichCell,
} from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Subs from './../../panels/story/adds/tabs/subs/subs';

import Icon24Repost from '@vkontakte/icons/dist/24/repost';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import { AnimateOnChange } from 'react-animation';
// import AnimateOnChange from 'react-animate-on-change';

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24MarketOutline from '@vkontakte/icons/dist/24/market_outline';

import { STATUS_CHOSEN, STATUS_CLOSED, STATUS_ABORTED, TYPE_CHOICE, STATUS_OFFER } from '../../const/ads';
import { getAuctionMaxUser, getCashback, increaseAuctionRate, fail, success, CancelClose } from '../../requests';
import { withLoadingIf, animateOnChangeIf } from '../image/image_cache';
import { openModal, setProfile } from '../../store/router/actions';
import { MODAL_ADS_TYPES, MODAL_ADS_FROZEN, MODAL_ADS_COST } from '../../store/router/modalTypes';
import { SubsLabel } from './subs';
import { K } from '../../panels/story/profile/const';
import { getAdType } from './faq';

const DealLabelInner = (props) => {
	const [componentStatus, setComponentStatus] = useState(<></>);
	useEffect(() => {
		const { status, ad_type } = props.ad;
		setComponentStatus(
			<InfoRow header="Статус">
				{
					status == STATUS_OFFER ? 'Активна' : 'Завершена'
					// : status != STATUS_CHOSEN
					// ? 'Завершена'
					// : ad_type == TYPE_CHOICE
					// ? 'Активна'
					// : 'Завершена'
				}
			</InfoRow>
		);
	}, [props.ad.status]);

	const [myRate, setMyRate] = useState(0);
	const [mrDone, setMrDone] = useState(false);
	const [mrUpdate, setMrUpdate] = useState(false);
	useEffect(() => {
		const { isAuthor, ad_id } = props.ad;
		if (isAuthor) {
			setMrDone(true);
			return;
		}
		setMrDone(false);
		getCashback(
			ad_id,
			(v) => {
				setMrDone(true);
				setMyRate(v.bid);
			},
			(e) => {
				setMrDone(true);
				setMyRate(0);
			}
		);
	}, [props.ad.isSub, props.ad.isAuthor, mrUpdate]);

	const [componentChosen, setComponentChosen] = useState(<></>);
	useEffect(() => {
		const { dealer, isAuthor } = props.ad;
		const { openSubs, finished, dealRequestSuccess } = props;
		// const aside = withLoadingIf(
		// 	dealRequestSuccess,
		// 	isAuthor && !finished ? (
		// 		dealer ? (
		// 			<Link onClick={openSubs}>Изменить</Link>
		// 		) : (
		// 			<Link onClick={openSubs}>Выбрать</Link>
		// 		)
		// 	) : (
		// 		<></>
		// 	),
		// 	'small',
		// 	null
		// );
		setComponentChosen(
			withLoadingIf(
				props.dealRequestSuccess,
				<Cell
					onClick={() => {
						if (dealer) {
							props.setProfile(dealer.vk_id);
						}
					}}
					multiline={true}
					key={dealer ? dealer.vk_id : ''}
					before={dealer ? <Avatar size={36} src={dealer.photo_url} /> : <Icon24User />}
				>
					<InfoRow header="Получатель">{dealer ? dealer.name + ' ' + dealer.surname : 'Не выбран'}</InfoRow>
				</Cell>,
				'middle',
				null,
				{ marginTop: '20px' }
			)
		);
	}, [props.ad.dealer, props.dealRequestSuccess]);

	const onTypesClick = () => props.openModal(MODAL_ADS_TYPES);
	const onFreezeClick = () => props.openModal(MODAL_ADS_FROZEN);
	const onCarmaClick = () => props.openModal(MODAL_ADS_COST);

	const [componentSub, setComponentSub] = useState(<></>);
	useEffect(() => {
		const { openSubs, sub, unsub } = props;
		const { cost, subs, isAuthor, isSub, dealer, ad_id } = props.ad;
		const disable = props.finished || subs.length == 0;
		setComponentSub(
			<div style={{ display: 'flex' }}>
				{isAuthor ? (
					dealer ? (
						<Group header={<Header mode="secondary">Вы выбрали получателя</Header>}>
							<div style={{ display: 'flex' }}>
								<CellButton
									mode="danger"
									onClick={() => {
										CancelClose(ad_id);
									}}
									disabled={disable}
									before={<Icon24Cancel />}
								>
									Отменить
								</CellButton>
								<CellButton onClick={openSubs} disabled={disable} before={<Icon24Repost />}>
									Изменить
								</CellButton>
							</div>
						</Group>
					) : (
						<CellButton onClick={openSubs} disabled={disable} before={<Icon24Done />}>
							Выбрать получателя
						</CellButton>
					)
				) : !isSub ? (
					<>
						<CellButton onClick={sub} before={<Icon24MarketOutline />}>
							Откликнуться
						</CellButton>{' '}
						<Cell
							indicator={
								<Counter mode="prominent" onClick={onCarmaClick} style={{ fontWeight: 600 }}>
									{cost + ' ' + K}
								</Counter>
							}
						>
							Стоимость
						</Cell>
						<Cell onClick={onFreezeClick}>
							<Icon24Help fill={'var(--counter_secondary_background)'} />
						</Cell>
					</>
				) : (
					<>
						<CellButton onClick={unsub} mode="danger" before={<Icon24MarketOutline />}>
							Отказаться
						</CellButton>
						<Cell
							indicator={
								<Counter mode="primary" onClick={onCarmaClick} style={{ fontWeight: 600 }}>
									{cost + ' ' + K}
								</Counter>
							}
						>
							Вам вернётся
						</Cell>
						<Cell onClick={onFreezeClick}>
							<Icon24Help fill={'var(--counter_secondary_background)'} />
						</Cell>
					</>
				)}
			</div>
		);
	}, [props.ad.isAuthor, props.ad.isSub, props.ad.cost, props.ad.dealer]);

	const [componentSubs, setComponentSubs] = useState(<></>);
	useEffect(() => {
		setComponentSubs(<SubsLabel />);
	}, [props.ad.isSub]);

	return (
		<Group
			header={
				<Header aside={<Link onClick={onTypesClick}>Подробнее</Link>}>{getAdType(props.ad.ad_type)}</Header>
			}
		>
			<div style={{ display: 'block', width: '100%' }}>
				<div style={{ display: 'flex', width: '100%' }}>
					<SimpleCell>
						<AnimateOnChange style={{ width: '100%' }} animation="bounce">
							{componentStatus}
						</AnimateOnChange>
					</SimpleCell>

					<AnimateOnChange style={{ width: '100%' }} animation="bounce">
						{componentChosen}
					</AnimateOnChange>
				</div>
				{/* {componentAuthor} */}

				<AnimateOnChange style={{ width: '100%' }} animation="bounce">
					{componentSubs}
				</AnimateOnChange>
				<AnimateOnChange style={{ width: '100%' }} animation="bounce">
					{componentSub}
				</AnimateOnChange>
			</div>
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		myUser: state.vkui.myUser,
		ad: state.ad,
	};
};

const mapDispatchToProps = {
	openModal,
	setProfile,
};

export const DealLabel = connect(mapStateToProps, mapDispatchToProps)(DealLabelInner);

// 202
