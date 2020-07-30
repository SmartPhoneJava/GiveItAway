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
	Title,
} from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Icon24Repost from '@vkontakte/icons/dist/24/repost';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import { AnimateOnChange } from 'react-animation';

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24MarketOutline from '@vkontakte/icons/dist/24/market_outline';

import { TYPE_CHOICE, STATUS_OFFER, TYPE_RANDOM } from '../../const/ads';
import { getAuctionMaxUser, getCashback, CancelClose, Close } from '../../requests';
import { withLoadingIf } from '../image/image_cache';
import { openModal, setProfile, setPage } from '../../store/router/actions';
import { MODAL_ADS_TYPES, MODAL_ADS_FROZEN, MODAL_ADS_COST } from '../../store/router/modalTypes';
import { SubsLabel } from './subs';
import { K } from '../../panels/story/profile/const';
import { getAdType, getAdTypePhoto, AdHeader, isFinished } from './faq';
import { PANEL_SUBS } from '../../store/router/panelTypes';

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
		const { dealer } = props.ad;
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
	const openSubs = () => props.setPage(PANEL_SUBS);

	const [componentSub, setComponentSub] = useState(<></>);
	useEffect(() => {
		const { sub, unsub } = props;
		const { cost, subs, status, isAuthor, isDealer, isSub, dealer, ad_id, ad_type } = props.ad;
		const disable =
			isFinished(status) || isAuthor
				? subs.length == 0 // автор не может выбрать получателя, если нет подписчиков
				: status != STATUS_OFFER && (!isSub || isDealer); // если ты не подписан, то уже не сможешь подписаться. Если ты получатель, отписываться нельзя

		let button = <></>;

		if (isAuthor) {
			if (dealer) {
				button = (
					<Group
						header={
							<Header mode="secondary">
								{ad_type == TYPE_CHOICE ? 'Вы выбрали получателя' : 'Получатель выбран'}
							</Header>
						}
					>
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
							{ad_type == TYPE_CHOICE && (
								<CellButton onClick={openSubs} disabled={disable} before={<Icon24Repost />}>
									Изменить
								</CellButton>
							)}
						</div>
					</Group>
				);
			} else {
				button = (
					<CellButton
						onClick={
							ad_type == TYPE_RANDOM
								? () => {
										Close(ad_id, ad_type, 0);
								  }
								: openSubs
						}
						disabled={disable}
						before={<Icon24Done />}
					>
						{ad_type == TYPE_RANDOM ? 'Запустить' : 'Выбрать получателя'}
					</CellButton>
				);
			}
		} else {
			if (isSub) {
				button = (
					<Group
						header={
							<Header mode="secondary">
								{ad_type == TYPE_RANDOM ? 'Вы участвуете' : 'Вы отклинулись'}
							</Header>
						}
					>
						<div style={{ display: 'flex' }}>
							<CellButton
								disabled={disable}
								onClick={unsub}
								mode="danger"
								before={<Icon24MarketOutline />}
							>
								Отказаться
							</CellButton>
							<div style={{ display: 'flex', flex: 1 }}>
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
							</div>
						</div>
					</Group>
				);
			} else {
				button = (
					<div style={{ display: 'flex' }}>
						<CellButton onClick={sub} disabled={disable} before={<Icon24MarketOutline />}>
							Откликнуться
						</CellButton>{' '}
						<div style={{ display: 'flex', flex: 1 }}>
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
						</div>
					</div>
				);
			}
		}

		setComponentSub(button);
	}, [props.ad.isAuthor, props.ad.isSub, props.ad.cost, props.ad.dealer]);

	const [componentSubs, setComponentSubs] = useState(<></>);
	useEffect(() => {
		setComponentSubs(<SubsLabel />);
	}, [props.ad.isSub]);

	return (
		<Group header={<AdHeader onTypesClick={onTypesClick} ad_type={props.ad.ad_type} />}>
			<div style={{ display: 'block' }}>
				<div style={{ display: 'flex' }}>
					<SimpleCell>
						<AnimateOnChange style={{}} animation="bounce">
							{componentStatus}
						</AnimateOnChange>
					</SimpleCell>

					<AnimateOnChange style={{ marginLeft: 'auto' }} animation="bounce">
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
	setPage,
};

export const DealLabel = connect(mapStateToProps, mapDispatchToProps)(DealLabelInner);

// 202 -> 247
