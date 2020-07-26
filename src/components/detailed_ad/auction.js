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

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Help from '@vkontakte/icons/dist/24/help';

import { STATUS_CHOSEN, STATUS_CLOSED, STATUS_ABORTED, COLOR_DEFAULT, COLOR_DONE, COLOR_CANCEL } from '../../const/ads';
import { getAuctionMaxUser, getCashback, increaseAuctionRate, fail, success } from '../../requests';
import { withLoadingIf, animateOnChangeIf } from '../image/image_cache';
import { openModal, setProfile } from '../../store/router/actions';
import { MODAL_ADS_TYPES } from '../../store/router/modalTypes';

const AuctionLabelInner = (props) => {
	const [componentStatus, setComponentStatus] = useState(<></>);
	useEffect(() => {
		setComponentStatus(<InfoRow header="Статус">{props.dealer ? 'Проведен' : 'Активен'}</InfoRow>);
	}, [props.dealer]);

	const [myRate, setMyRate] = useState(0);
	const [mrDone, setMrDone] = useState(false);
	const [mrUpdate, setMrUpdate] = useState(false);
	useEffect(() => {
		if (props.isAuthor) {
			setMrDone(true);
			return;
		}
		getCashback(
			props.ad_id,
			(v) => {
				setMyRate(v.bid);
				setMrDone(true);
			},
			(e) => {
				setMrDone(true);
				setMyRate(0);
			}
		);
	}, [props.ad_id, props.isSub, props.isAuthor, mrUpdate]);

	const [actionMaxUser, setActionMaxUser] = useState();
	const [amuDone, setAmuDone] = useState(false);
	const [amuUpdate, setAmuUpdate] = useState(false);
	useEffect(() => {
		setAmuDone(false);
		getAuctionMaxUser(
			props.ad_id,
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
	}, [props.ad_id, props.isSub, amuUpdate]);

	const [componentMaxUser, setComponentMaxUser] = useState(<></>);
	useEffect(() => {
		setComponentMaxUser(
			actionMaxUser ? (
				<Cell
					onClick={() => {
						if (actionMaxUser) {
							props.setProfile(actionMaxUser.vk_id);
						}
					}}
					description={props.dealer ? 'Победитель' : 'Лидирует'}
					multiline={true}
					key={actionMaxUser.vk_id}
					before={<Avatar size={36} src={actionMaxUser.photo_url} />}
					asideContent={<Counter mode="primary">{actionMaxUser.cost + ' K'}</Counter>}
				>
					{actionMaxUser ? actionMaxUser.name + ' ' + actionMaxUser.surname : 'Никто еще откликнулся'}
				</Cell>
			) : (
				<Cell before={<Icon24User />}>Никто еще не откликнулся</Cell>
			)
		);
	}, [actionMaxUser]);

	const [componentMyRate, setComponentMyRate] = useState(<></>);
	useEffect(() => {
		setComponentMyRate(
			props.isAuthor ? (
				<CellButton before={<Icon24Done />}>Завершить</CellButton>
			) : (
				actionMaxUser &&
					(props.isSub ? (
						<RichCell
							before={<Avatar size={48} src={props.myUser.photo_100} />}
							after={myRate + ' K'}
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
												props.ad_id,
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
					) : (
						<RichCell
							before={<Avatar size={48} src={props.myUser.photo_100} />}
							actions={
								<React.Fragment>
									<Button onClick={() => props.sub()}>Принять участие в аукционе</Button>
								</React.Fragment>
							}
						>
							Вы не делали ставок
						</RichCell>
					))
			)
		);
	}, [props.isAuthor, actionMaxUser, myRate]);

	const onTypesClick = () => props.openModal(MODAL_ADS_TYPES);

	return (
		<Group header={<Header aside={<Link onClick={onTypesClick}>Подробнее</Link>}> Аукцион </Header>}>
			<div style={{ display: 'block' }}>
				<div style={{ display: 'flex' }}>
					<SimpleCell>
						<AnimateOnChange animation="bounce">{componentStatus}</AnimateOnChange>
					</SimpleCell>
					<SimpleCell>{animateOnChangeIf(amuDone, componentMaxUser)}</SimpleCell>
				</div>
				{animateOnChangeIf(mrDone, componentMyRate)}
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

export const AuctionLabel = connect(mapStateToProps, mapDispatchToProps)(AuctionLabelInner);

// 125 -> 195
