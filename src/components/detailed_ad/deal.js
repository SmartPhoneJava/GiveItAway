import React, { useState, useEffect } from 'react';
import { Avatar, Header, InfoRow, Group, Cell, Counter, SimpleCell, CellButton, Title } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Icon24Repost from '@vkontakte/icons/dist/24/repost';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import { AnimateOnChange } from 'react-animation';

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24MarketOutline from '@vkontakte/icons/dist/24/market_outline';

import { TYPE_CHOICE, STATUS_OFFER, TYPE_RANDOM, STATUS_ABORTED, STATUS_CLOSED } from '../../const/ads';
import { getCashback, CancelClose, Close } from '../../requests';
import { withLoadingIf } from '../image/image_cache';
import { openModal, setProfile, setPage } from '../../store/router/actions';
import { MODAL_ADS_TYPES, MODAL_ADS_FROZEN, MODAL_ADS_COST } from '../../store/router/modalTypes';
import { SubsLabel } from './subs';
import { K } from '../../panels/story/profile/const';
import { AdHeader, isFinished } from './faq';
import { PANEL_SUBS, PANEL_ONE } from '../../store/router/panelTypes';

const DealLabelInner = (props) => {
	const [componentStatus, setComponentStatus] = useState(<></>);
	const activePanel = props.activePanels[props.activeStory];
	useEffect(() => {
		const { status } = props.activeContext[props.activeStory];
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
	}, [activePanel, props.activeContext[props.activeStory].status]);

	const [myRate, setMyRate] = useState(0);
	const [mrDone, setMrDone] = useState(false);
	const [mrUpdate, setMrUpdate] = useState(false);
	useEffect(() => {
		const { isAuthor, ad_id } = props.activeContext[props.activeStory];
		if (activePanel != PANEL_ONE) {
			return;
		}
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
	}, [
		activePanel,
		props.activeContext[props.activeStory].isSub,
		props.activeContext[props.activeStory].isAuthor,
		mrUpdate,
	]);

	const [componentChosen, setComponentChosen] = useState(<></>);
	useEffect(() => {
		if (activePanel != PANEL_ONE) {
			return;
		}
		const { dealer } = props.activeContext[props.activeStory];
		const dealer_text = dealer != null && dealer != undefined ? dealer.name + ' ' + dealer.surname : 'Не выбран';
		console.log('dealer is', dealer, dealer_text);
		setComponentChosen(
			withLoadingIf(
				props.dealRequestSuccess,
				<Cell
					style={{ cursor: 'pointer' }}
					onClick={() => {
						if (dealer) {
							props.setProfile(dealer.vk_id);
						}
					}}
					multiline
					key={dealer ? dealer.vk_id : ''}
					before={dealer ? <Avatar size={36} src={dealer.photo_url} /> : <Icon24User />}
				>
					<InfoRow header="Получатель">{dealer_text}</InfoRow>
				</Cell>,
				'middle',
				null,
				{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: '24px' }
			)
		);
	}, [activePanel, props.activeContext[props.activeStory].dealer, props.dealRequestSuccess]);

	const onTypesClick = () => props.openModal(MODAL_ADS_TYPES);
	const onFreezeClick = () => props.openModal(MODAL_ADS_FROZEN);
	const onCarmaClick = () => props.openModal(MODAL_ADS_COST);
	const openSubs = () => props.setPage(PANEL_SUBS);

	const width = document.body.clientWidth;

	const subPanel = (disable) => {
		if (activePanel != PANEL_ONE) {
			return;
		}
		const { sub, unsub } = props;
		const { isSub, ad_type } = props.activeContext[props.activeStory];
		const cost = props.activeContext[props.activeStory].cost || '';
		return (
			<Group
				header={
					<Header mode="secondary">
						{ad_type == TYPE_RANDOM
							? isSub
								? 'Вы участвуете'
								: 'Вы не участвуете'
							: isSub
							? 'Вы откликнулись'
							: 'Вы не откликнулись'}
					</Header>
				}
			>
				<div style={{ display: width < 415 ? 'block' : 'flex', alignItems: 'center' }}>
					<CellButton
						disabled={disable}
						style={{ cursor: disable ? null : 'pointer' }}
						onClick={isSub ? unsub : sub}
						mode={isSub ? 'danger' : 'primary'}
						before={<Icon24MarketOutline />}
					>
						{isSub ? 'Отказаться' : 'Откликнуться'}
					</CellButton>
					<div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
						<Cell
							indicator={
								<Counter
									mode={isSub ? 'primary' : 'prominent'}
									onClick={onCarmaClick}
									style={{ fontWeight: 600, cursor: 'pointer' }}
								>
									{cost + ' ' + K}
								</Counter>
							}
						>
							{isSub ? 'Вам вернётся' : 'Стоимость'}
						</Cell>
						<Cell style={{ cursor: 'pointer' }} onClick={onFreezeClick}>
							<Icon24Help fill={'var(--counter_secondary_background)'} />
						</Cell>
					</div>
				</div>
			</Group>
		);
	};

	const [componentSub, setComponentSub] = useState(<></>);
	useEffect(() => {
		if (activePanel != PANEL_ONE) {
			return;
		}
		const { status, isAuthor, isDealer, isSub, dealer, ad_id, ad_type } = props.activeContext[props.activeStory];
		const subs = props.activeContext[props.activeStory].subs || [];

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
						<div style={{ display: width < 415 ? 'block' : 'flex' }}>
							<CellButton
								mode="danger"
								onClick={() => {
									CancelClose(ad_id);
								}}
								style={{ cursor: disable ? null : 'pointer' }}
								disabled={disable}
								before={<Icon24Cancel />}
							>
								Отменить
							</CellButton>
							{ad_type == TYPE_CHOICE && (
								<CellButton
									style={{ cursor: disable ? null : 'pointer' }}
									onClick={openSubs}
									disabled={disable}
									before={<Icon24Repost />}
								>
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
						style={{ cursor: disable ? null : 'pointer' }}
						before={<Icon24Done />}
					>
						{ad_type == TYPE_RANDOM ? 'Запустить' : 'Выбрать получателя'}
					</CellButton>
				);
			}
		} else {
			button = subPanel(disable);
		}

		setComponentSub(button);
	}, [
		activePanel,
		props.activeContext[props.activeStory].isAuthor,
		props.activeContext[props.activeStory].isSub,
		props.activeContext[props.activeStory].cost,
		props.activeContext[props.activeStory].dealer,
		props.activeContext[props.activeStory].subs,
	]);

	const [componentSubs, setComponentSubs] = useState(<></>);
	useEffect(() => {
		if (activePanel != PANEL_ONE) {
			return;
		}
		setComponentSubs(<SubsLabel />);
	}, [activePanel, props.activeContext[props.activeStory].isSub]);

	return (
		<Group
			header={<AdHeader onTypesClick={onTypesClick} ad_type={props.activeContext[props.activeStory].ad_type} />}
		>
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
				{!(
					props.activeContext[props.activeStory].status == STATUS_ABORTED ||
					props.activeContext[props.activeStory].status == STATUS_CLOSED
				) && (
					<>
						<AnimateOnChange style={{ width: '100%' }} animation="bounce">
							{componentSubs}
						</AnimateOnChange>
						<AnimateOnChange style={{ width: '100%' }} animation="bounce">
							{componentSub}
						</AnimateOnChange>
					</>
				)}
			</div>
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		myUser: state.vkui.myUser,
		activeContext: state.router.activeContext,
		activeStory: state.router.activeStory,
		activePanels: state.router.activePanels,
	};
};

const mapDispatchToProps = {
	openModal,
	setProfile,
	setPage,
};

export const DealLabel = connect(mapStateToProps, mapDispatchToProps)(DealLabelInner);

// 202 -> 247 -> 308
