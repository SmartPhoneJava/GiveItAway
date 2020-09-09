import React, { useState, useEffect } from 'react';
import { Avatar, InfoRow, Group, Cell, Counter, SimpleCell, Button, CellButton, RichCell, Div } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import Icon24Users from '@vkontakte/icons/dist/24/users';

import { STATUS_CHOSEN, STATUS_CLOSED, STATUS_ABORTED } from '../../const/ads';
import { getAuctionMaxUser, getCashback, increaseAuctionRate, fail, success, CancelClose, Close } from '../../requests';
import { withLoadingIf, animateOnChangeIf, AnimationChange } from '../image/image_cache';
import { openModal, setProfile } from '../../store/router/actions';
import { MODAL_ADS_TYPES, MODAL_ADS_FROZEN, MODAL_ADS_COST } from '../../store/router/modalTypes';
import { AdHeader } from './faq';
import { updateDealInfo } from '../../store/detailed_ad/update';

const AuctionLabelInner = (props) => {
	const [componentStatus, setComponentStatus] = useState(<></>);
	useEffect(() => {
		setComponentStatus(
			<InfoRow header="Статус">{props.activeContext[props.activeStory].dealer ? 'Завершен' : 'Активен'}</InfoRow>
		);
	}, [props.activeContext[props.activeStory].dealer]);

	const [myRate, setMyRate] = useState(0);
	const [mrDone, setMrDone] = useState(false);
	const [mrUpdate, setMrUpdate] = useState(false);
	useEffect(() => {
		const { isAuthor, ad_id } = props.activeContext[props.activeStory];
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
		props.activeContext[props.activeStory].ad_id,
		props.activeContext[props.activeStory].isSub,
		props.activeContext[props.activeStory].isAuthor,
		mrUpdate,
	]);

	const [actionMaxUser, setActionMaxUser] = useState();
	const [amuDone, setAmuDone] = useState(false);
	const [amuUpdate, setAmuUpdate] = useState(false);
	useEffect(() => {
		const { ad_id } = props.activeContext[props.activeStory];
		setAmuDone(false);
		getAuctionMaxUser(
			ad_id,
			(v) => {
				const user = v.user;
				user.cost = v.bid;
				setActionMaxUser(user);
				setAmuDone(true);
			},
			(e) => {
				setAmuDone(true);
				setActionMaxUser(null);
			}
		);
	}, [props.activeContext[props.activeStory].isSub, props.activeContext[props.activeStory].subs, amuUpdate]);

	const [componentMaxUser, setComponentMaxUser] = useState(<></>);
	useEffect(() => {
		const { dealer, status } = props.activeContext[props.activeStory];
		let amu = actionMaxUser;
		if (status == STATUS_CLOSED || status == STATUS_ABORTED) {
			if (!dealer) {
				updateDealInfo();
				return;
			}
			amu = dealer;
			amu.cost = -1;
		}
		setComponentMaxUser(
			amu ? (
				<Cell
					style={{ cursor: 'pointer' }}
					onClick={() => {
						props.setProfile(amu.vk_id);
					}}
					description={dealer ? 'Победитель' : 'Лидирует'}
					multiline
					key={amu.vk_id}
					before={<Avatar size={36} src={amu.photo_url} />}
					asideContent={amu.cost > 0 && <Counter mode="primary">{amu.cost + ' K'}</Counter>}
				>
					{amu.name + ' ' + amu.surname}
				</Cell>
			) : (
				<Cell multiline before={<Icon24Users />}>
					Никто еще не откликнулся
				</Cell>
			)
		);
	}, [props.activeContext[props.activeStory].dealer, props.activeContext[props.activeStory].subs, actionMaxUser]);

	const [componentMyRate, setComponentMyRate] = useState(<></>);
	useEffect(() => {
		const { isAuthor, isDealer, status, dealer, ad_id, ad_type, isSub, cost } = props.activeContext[
			props.activeStory
		];

		if (isDealer && status == STATUS_CHOSEN) {
			setComponentMyRate(null);
			return;
		}

		const onCloseClick = () => {
			Close(ad_id, ad_type, 0);
		};

		const onCancelCloseClick = () => {
			CancelClose(ad_id);
		};

		const onIncreaseClick = () => {
			increaseAuctionRate(
				ad_id,
				(v) => {
					setAmuUpdate((prev) => !prev);
					setMrUpdate((prev) => !prev);
					success('Ставка успешно повышена');
				},
				(e) => {
					fail('Не удалось повысить ставку, попробуйте позже');
				}
			);
		};

		const onUserCancelClick = () => {
			props.unsub();
		};

		const width = document.body.clientWidth;
		console.log('width is ', width);

		const isActive = !(status == STATUS_ABORTED || status == STATUS_CLOSED);

		const costMode = actionMaxUser && (myRate == actionMaxUser.cost ? 'secondary' : 'prominent');

		setComponentMyRate(
			isAuthor ? (
				!dealer ? (
					<CellButton
						onClick={onCloseClick}
						style={{ cursor: !actionMaxUser ? null : 'pointer' }}
						disabled={!actionMaxUser}
						before={<Icon24Done />}
					>
						Завершить
					</CellButton>
				) : (
					isActive && (
						<CellButton
							mode="danger"
							onClick={onCancelCloseClick}
							disabled={!actionMaxUser}
							style={{ cursor: !actionMaxUser ? null : 'pointer' }}
							before={<Icon24Cancel />}
						>
							Отменить выбор
						</CellButton>
					)
				)
			) : !isActive ? null : isSub ? (
				actionMaxUser && (
					<RichCell
						before={<Avatar size={48} src={props.myUser.photo_100} />}
						after={
							<Counter style={{ cursor: 'pointer' }} onClick={onFreezeClick} mode={costMode}>
								{myRate + ' K'}
							</Counter>
						}
						caption={
							<div>
								{myRate == actionMaxUser.cost
									? 'Максимальная 😎'
									: 'Отстаёт от максимальной на ' + (actionMaxUser.cost - myRate)}
								&nbsp;
							</div>
						}
						actions={
							<div style={{ display: width > 370 ? 'flex' : 'block' }}>
								<div
									style={{
										paddingBottom: width < 370 ? '8px' : null,
										paddingRight: width > 370 ? '8px' : null,
									}}
								>
									<Button
										stretched={width < 370}
										style={{ cursor: 'pointer' }}
										onClick={onIncreaseClick}
									>
										Повысить
									</Button>
								</div>
								<div>
									<Button
										stretched={width < 370}
										style={{ cursor: 'pointer' }}
										mode="secondary"
										onClick={onUserCancelClick}
									>
										Отменить ставку
									</Button>
								</div>
							</div>
						}
					>
						Моя ставка
					</RichCell>
				)
			) : (
				<RichCell
					before={<Avatar size={48} src={props.myUser.photo_100} />}
					after={
						<Counter style={{ minWidth: '40px', cursor: 'pointer' }} onClick={onCarmaClick} mode="primary">
							{cost + ' K'}
						</Counter>
					}
					actions={
						<React.Fragment>
							<Button style={{ cursor: 'pointer' }} onClick={() => props.sub()}>
								Принять участие в аукционе
							</Button>
						</React.Fragment>
					}
				>
					Вы не делали ставок
				</RichCell>
			)
		);
	}, [
		props.activeContext[props.activeStory].isSub,
		props.activeContext[props.activeStory].dealer,
		props.activeContext[props.activeStory].cost,
		actionMaxUser,
		myRate,
	]);

	const onTypesClick = () => props.openModal(MODAL_ADS_TYPES);
	const onFreezeClick = () => props.openModal(MODAL_ADS_FROZEN);
	const onCarmaClick = () => props.openModal(MODAL_ADS_COST);

	return (
		<Group
			header={<AdHeader onTypesClick={onTypesClick} ad_type={props.activeContext[props.activeStory].ad_type} />}
		>
			<div style={{ display: 'block', width: '100%' }}>
				<div style={{ display: 'flex', width: '100%' }}>
					<SimpleCell>
						<AnimationChange mayTheSame={true} ignoreFirst={true} controll={componentStatus} />
						{/* <AnimationChange controll={componentStatus}/> */}
						{/* <AnimateOnChange style={{ width: '100%' }} animation="bounce">
							{componentStatus}
						</AnimateOnChange> */}
					</SimpleCell>

					<AnimationChange mayTheSame={true} ignoreFirst={true} controll={componentMaxUser} />
					{/* <AnimateOnChange style={{ width: '100%' }} animation="bounce">
						{componentMaxUser}
					</AnimateOnChange> */}
				</div>

				<AnimationChange mayTheSame={true} ignoreFirst={true} controll={componentMyRate} />
				{
					// <AnimateOnChange style={{ width: '100%' }} animation="bounce">
					// 	{componentMyRate}
					// </AnimateOnChange>
				}
			</div>
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		myUser: state.vkui.myUser,
		activeStory: state.router.activeStory,
		activeContext: state.router.activeContext,
	};
};

const mapDispatchToProps = {
	openModal,
	setProfile,
};

export const AuctionLabel = connect(mapStateToProps, mapDispatchToProps)(AuctionLabelInner);

// 125 -> 195
