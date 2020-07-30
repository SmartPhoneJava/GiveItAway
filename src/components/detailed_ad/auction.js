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

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import { AnimateOnChange } from 'react-animation';
// import AnimateOnChange from 'react-animate-on-change';

import Icon24Users from '@vkontakte/icons/dist/24/users';
import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Help from '@vkontakte/icons/dist/24/help';

import {
	STATUS_CHOSEN,
	STATUS_CLOSED,
	STATUS_ABORTED,
	COLOR_DEFAULT,
	COLOR_DONE,
	COLOR_CANCEL,
	STATUS_OFFER,
} from '../../const/ads';
import {
	getAuctionMaxUser,
	getCashback,
	increaseAuctionRate,
	fail,
	success,
	CancelClose,
	Close,
	getDeal,
} from '../../requests';
import { withLoadingIf, animateOnChangeIf } from '../image/image_cache';
import { openModal, setProfile } from '../../store/router/actions';
import { MODAL_ADS_TYPES, MODAL_ADS_FROZEN, MODAL_ADS_COST } from '../../store/router/modalTypes';
import { AdHeader } from './faq';
import { updateDealInfo } from '../../store/detailed_ad/update';

const AuctionLabelInner = (props) => {
	const [componentStatus, setComponentStatus] = useState(<></>);
	useEffect(() => {
		setComponentStatus(<InfoRow header="Статус">{props.ad.dealer ? 'Завершен' : 'Активен'}</InfoRow>);
	}, [props.ad.dealer]);

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
	}, [props.ad.ad_id, props.ad.isSub, props.ad.isAuthor, mrUpdate]);

	const [actionMaxUser, setActionMaxUser] = useState();
	const [amuDone, setAmuDone] = useState(false);
	const [amuUpdate, setAmuUpdate] = useState(false);
	useEffect(() => {
		const { ad_id } = props.ad;
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
	}, [props.ad.isSub, amuUpdate]);

	const [componentMaxUser, setComponentMaxUser] = useState(<></>);
	useEffect(() => {
		const { dealer, status, cost } = props.ad;
		let amu = actionMaxUser;
		if (status == STATUS_CLOSED || status == STATUS_ABORTED) {
			if (!dealer) {
				updateDealInfo();
				console.log('we set yoooooou');
				return;
			}
			console.log('we set you yep', cost, dealer);
			amu = dealer;
			amu.cost = -1;
		}
		setComponentMaxUser(
			amu ? (
				<Cell
					onClick={() => {
						props.setProfile(amu.vk_id);
					}}
					description={dealer ? 'Победитель' : 'Лидирует'}
					multiline={true}
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
	}, [props.ad.dealer, actionMaxUser]);

	const [componentMyRate, setComponentMyRate] = useState(<></>);
	useEffect(() => {
		const { isAuthor, dealer, ad_id, ad_type, isSub, cost } = props.ad;
		setComponentMyRate(
			isAuthor ? (
				!dealer ? (
					<CellButton
						onClick={() => Close(ad_id, ad_type, 0)}
						disabled={!actionMaxUser}
						before={<Icon24Done />}
					>
						Завершить
					</CellButton>
				) : (
					<CellButton
						mode="danger"
						onClick={() => CancelClose(ad_id)}
						disabled={!actionMaxUser}
						before={<Icon24Cancel />}
					>
						Отменить выбор
					</CellButton>
				)
			) : isSub ? (
				actionMaxUser && (
					<RichCell
						before={<Avatar size={48} src={props.myUser.photo_100} />}
						after={
							<Counter
								onClick={onFreezeClick}
								mode={myRate == actionMaxUser.cost ? 'secondary' : 'prominent'}
							>
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
							<React.Fragment>
								<Button
									onClick={() => {
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
									}}
								>
									Повысить
								</Button>
								<Button mode="secondary" onClick={() => props.unsub()}>
									Отменить ставку
								</Button>
							</React.Fragment>
						}
					>
						Моя ставка
					</RichCell>
				)
			) : (
				<RichCell
					before={<Avatar size={48} src={props.myUser.photo_100} />}
					actions={
						<React.Fragment>
							<Button onClick={() => props.sub()}>Принять участие в аукционе</Button>
							<Counter onClick={onCarmaClick} mode="primary">
								{cost + ' K'}
							</Counter>
						</React.Fragment>
					}
				>
					Вы не делали ставок
				</RichCell>
			)
		);
	}, [props.ad.isSub, props.ad.dealer, props.ad.cost, actionMaxUser, myRate]);

	const onTypesClick = () => props.openModal(MODAL_ADS_TYPES);
	const onFreezeClick = () => props.openModal(MODAL_ADS_FROZEN);
	const onCarmaClick = () => props.openModal(MODAL_ADS_COST);

	return (
		<Group header={<AdHeader onTypesClick={onTypesClick} ad_type={props.ad.ad_type} />}>
			<div style={{ display: 'block', width: '100%' }}>
				<div style={{ display: 'flex', width: '100%' }}>
					<SimpleCell>
						<AnimateOnChange style={{ width: '100%' }} animation="bounce">
							{componentStatus}
						</AnimateOnChange>
					</SimpleCell>

					<AnimateOnChange style={{ width: '100%' }} animation="bounce">
						{componentMaxUser}
					</AnimateOnChange>
				</div>
				{!(props.ad.status == STATUS_ABORTED || props.ad.status == STATUS_CLOSED) && (
					<AnimateOnChange style={{ width: '100%' }} animation="bounce">
						{componentMyRate}
					</AnimateOnChange>
				)}
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

export const AuctionLabel = connect(mapStateToProps, mapDispatchToProps)(AuctionLabelInner);

// 125 -> 195
