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

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import { AnimateOnChange } from 'react-animation';
// import AnimateOnChange from 'react-animate-on-change';

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24MarketOutline from '@vkontakte/icons/dist/24/market_outline';

import { STATUS_CHOSEN, STATUS_CLOSED, STATUS_ABORTED, TYPE_CHOICE, STATUS_OFFER } from '../../const/ads';
import { getAuctionMaxUser, getCashback, increaseAuctionRate, fail, success } from '../../requests';
import { withLoadingIf, animateOnChangeIf } from '../image/image_cache';
import { openModal, setProfile } from '../../store/router/actions';
import { MODAL_ADS_TYPES, MODAL_ADS_FROZEN, MODAL_ADS_COST } from '../../store/router/modalTypes';

const DealLabelInner = (props) => {
	const [componentStatus, setComponentStatus] = useState(<></>);
	useEffect(() => {
		setComponentStatus(
			<InfoRow header="Статус">
				{props.status == STATUS_OFFER
					? 'Активна'
					: props.status != STATUS_CHOSEN
					? 'Завершена'
					: props.ad_type == TYPE_CHOICE
					? 'Получатель выбран'
					: 'Завершена'}
			</InfoRow>
		);
	}, [props.dealer]);

	const [myRate, setMyRate] = useState(0);
	const [mrDone, setMrDone] = useState(false);
	const [mrUpdate, setMrUpdate] = useState(false);
	useEffect(() => {
		if (props.isAuthor) {
			setMrDone(true);
			return;
		}
		setMrDone(false);
		getCashback(
			props.ad_id,
			(v) => {
				setMrDone(true);
				setMyRate(v.bid);
			},
			(e) => {
				setMrDone(true);
				setMyRate(0);
			}
		);
	}, [props.ad_id, props.isSub, props.isAuthor, mrUpdate]);

	const [componentChosen, setComponentChosen] = useState(<></>);
	useEffect(() => {
		const { dealer, isAuthor, openSubs, finished, dealRequestSuccess } = props;
		const aside = withLoadingIf(
			dealRequestSuccess,
			isAuthor && !finished ? (
				dealer ? (
					<Link onClick={openSubs}>Изменить</Link>
				) : (
					<Link onClick={openSubs}>Выбрать</Link>
				)
			) : (
				<></>
			),
			'small',
			null
		);
		if (!isAuthor) {
			setComponentChosen(<>Принять участие</>);
		}
		setComponentChosen(
			withLoadingIf(
				dealRequestSuccess,
				<Cell
					onClick={() => {
						if (dealer) {
							props.setProfile(dealer.vk_id);
						}
					}}
					asideContent={aside}
					multiline={true}
					key={dealer ? dealer.vk_id : ''}
					before={dealer ? <Avatar size={36} src={dealer.photo_url} /> : <Icon24User />}
				>
					<InfoRow header="Получатель">
						{dealer ? dealer.name + ' ' + dealer.surname : 'Не выбран'}
					</InfoRow>
				</Cell>,
				'middle',
				null,
				{ marginTop: '20px' }
			)
		);
	}, [props.dealer]);

	const onTypesClick = () => props.openModal(MODAL_ADS_TYPES);
	const onFreezeClick = () => props.openModal(MODAL_ADS_FROZEN);
	const onCarmaClick = () => props.openModal(MODAL_ADS_COST);

	const [componentSub, setComponentSub] = useState(<></>);
	useEffect(() => {
		setComponentSub(
			props.isAuthor ? null : (
				<div style={{ display: 'flex' }}>
					{' '}
					{!props.isSub ? (
						<>
							<CellButton onClick={props.sub} before={<Icon24MarketOutline />}>
								Откликнуться
							</CellButton>{' '}
							<Cell asideContent={<Icon24Help onClick={onFreezeClick} />}>
								<InfoRow onClick={onCarmaClick} header="Стоимость">
									{props.cost}
								</InfoRow>
							</Cell>
						</>
					) : (
						<>
							<CellButton onClick={props.unsub} mode="danger" before={<Icon24MarketOutline />}>
								Отказаться
							</CellButton>
							<Cell asideContent={<Icon24Help onClick={onFreezeClick} />}>
								<InfoRow onClick={onCarmaClick} header="Будет возвращено">
									{props.cost}
								</InfoRow>
							</Cell>
						</>
					)}
				</div>
			)
		);
	}, [props.isAuthor, props.isSub, props.cost]);

	const [componentSubs, setComponentSubs] = useState(<></>);
	useEffect(() => {
		setComponentSubs(<Subs amount={50} maxAmount={-1} mini={true} />);
	}, [props.isSub]);

	return (
		<Group
			header={
				<Header aside={<Link onClick={onTypesClick}>Подробнее</Link>}>
					{' '}
					{props.ad_type == TYPE_CHOICE ? 'Сделка' : 'Лотерея'}{' '}
				</Header>
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
	};
};

const mapDispatchToProps = {
	openModal,
	setProfile,
};

export const DealLabel = connect(mapStateToProps, mapDispatchToProps)(DealLabelInner);

// 202
