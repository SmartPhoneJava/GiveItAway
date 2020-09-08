import React, { useState, useEffect } from 'react';
import { Avatar, Link, Button, Cell, Header, Group, Placeholder, Banner, Spinner, Card, Title } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { getUser, getUserVK } from './requests';

import Icon56DoNotDisturbOutline from '@vkontakte/icons/dist/56/do_not_disturb_outline';

import Error from './../../placeholders/error';

import { old, fromSeconds } from './../../../utils/time';

import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import './profile.css';
import { setFormData } from '../../../store/create_post/actions';
import { setStory, updateContext, setPage } from '../../../store/router/actions';
import { STORY_ADS, STORY_CREATE } from '../../../store/router/storyTypes';
import { ADS_FILTERS } from '../../../store/create_post/types';
import { MODE_WANTED } from '../../../const/ads';

import GivenPanel from './given';
import ReceivedPanel from './received';
import { NO_USER, NO_VK_USER } from './const';
import { Statistics } from '../../../components/profile/statistics';
import { withLoading, withLoadingIf, ImageCache } from '../../../components/image/image_cache';
import { Collapse } from 'react-collapse';
import { CardWithPadding } from '../../../App';
import { openTab } from '../../../services/_functions';
import { DIRECTION_BACK } from '../../../store/router/directionTypes';
import { PANEL_ADS } from '../../../store/router/panelTypes';

function getImage(backuser) {
	if (!backuser || !backuser.photo_url) {
		return '';
	}
	const photoURL = backuser.photo_url;
	return (
		<div
			style={{
				paddingTop: '16px',
				paddingRight: '16px',
			}}
		>
			<Avatar size={48} src={photoURL} />
		</div>
	);
}

function getAuthorHref(backuser) {
	if (!backuser) {
		return '';
	}
	const name = backuser.name + ' ' + backuser.surname;
	return <div style={{ fontWeight: '600', fontSize: '16px' }}>{name}</div>;
}

const Profile = (props) => {
	const { myID, inputData, direction, activeContext, activePanels, story } = props;
	const { setFormData, setStory, updateContext, setPage } = props;
	const [profileID, setProfileID] = useState(myID);
	const [userRequestSucess, setUserRequestSucess] = useState(false);

	const [backuser, setBackUser] = useState(NO_USER);
	const [vkUser, setVkUser] = useState(NO_VK_USER);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		const newProfile = activeContext[story];
		if (!newProfile) {
			return;
		}
		let newProfileID = newProfile.vk_id || -1;
		console.log('activeProfile', activeContext, activePanels);
		if (isNaN(newProfileID)) {
			return;
		}
		if (newProfileID == -1) {
			updateContext({ vk_id: myID });
			newProfileID = myID;
		}
		setProfileID(newProfileID);
		console.log('profile is', newProfile);
		if (newProfile.backUser) {
			setBackUser(newProfile.backUser);
			setFailed(false);
			setUserRequestSucess(true);
		}
		if (newProfile.vkUser) {
			setVkUser(newProfile.vkUser);
		}
	}, [props.activeContext[props.story]]);

	const width = document.body.clientWidth;

	console.log('document is', document.cookie);

	function getUserVKstring() {
		return 'https://vk.com/id' + profileID;
	}

	function getUserDialog() {
		return 'https://vk.com/im?sel=' + profileID;
	}

	function openUserVK() {
		openTab(getUserVKstring());
	}

	function getUserOnline() {
		if (!vkUser || vkUser.null || !vkUser.last_seen) {
			return 'Информация скрыта';
		}
		return !vkUser || vkUser.null
			? ''
			: vkUser.online
			? 'online'
			: 'был(а) в сети ' + (vkUser.last_seen ? fromSeconds(vkUser.last_seen.time) : 'давно');
	}

	const [authorPanel, setAuthorPanel] = useState();
	useEffect(() => {
		const notInited = vkUser == NO_VK_USER;
		setAuthorPanel(
			CardWithPadding(
				<Cell
					onClick={openUserVK}
					size="l"
					multiline
					asideContent={<Icon24Chevron />}
					before={
						<ImageCache
							className="profile-ava"
							spinnerClassName="profile-ava-spinner"
							url={backuser.photo_url}
						/>
					}
					style={{ cursor: 'pointer' }}
					description={getUserOnline()}
				>
					{withLoadingIf(
						!notInited,
						<div className="profile-block">
							{getAuthorHref(backuser)}
							<div style={{ display: 'flex' }}>
								{vkUser && vkUser.city ? vkUser.city.title + ', ' : ''}{' '}
								{vkUser ? old(vkUser.bdate) : ''}
							</div>
							<div>{vkUser && vkUser.mobile_phone ? 'мобильный: ' + vkUser.mobile_phone : ''}</div>
							<div>{vkUser && vkUser.home_phone ? 'домашний: ' + vkUser.home_phone : ''}</div>
							{/* {vkSpinner} */}
						</div>,
						'small'
					)}
				</Cell>,
				'shadow'
			)
		);
	}, [vkUser, backuser]);

	const [statisticsPanel, setStatisticsPanel] = useState();
	useEffect(() => {
		setStatisticsPanel(<Statistics backuser={backuser} />);
	}, [backuser]);

	function carmaDiv(onClickFunc, karmaValue, karmaText) {
		const onClick = onClickFunc || (() => {});
		return (
			<Cell
				onClick={onClick}
				className="profile-carma-label"
				indicator={withLoadingIf(userRequestSucess, <span>{karmaValue + ' Ҝ'}</span>, 'small')}
			>
				{karmaText}
			</Cell>
		);
	}

	const [carmaPanel, setCarmaPanel] = useState();
	const [collapseOpen, setCollapseOpen] = useState(false);
	useEffect(() => {
		const v = (
			<Collapse isOpened={collapseOpen}>
				<div style={{ display: width < 500 ? 'block' : 'flex' }}>
					{carmaDiv(openFreeze, backuser.frozen_carma, 'Заморожено')}
					{carmaDiv(null, backuser.total_earned_carma, 'Получено')}
					{carmaDiv(null, backuser.total_spent_carma, 'Потрачено')}
				</div>
			</Collapse>
		);
		setCarmaPanel(
			CardWithPadding(
				<Group
					separator="hide"
					header={
						<Cell
							style={{
								cursor: 'pointer',
							}}
							onClick={() => {
								setCollapseOpen((prev) => !prev);
							}}
							mode="primary"
							indicator={
								profileID == myID && (
									<Icon16Dropdown
										fill="var(--accent)"
										style={{
											marginLeft: '15px',
											transition: '0.3s',
											transform: `rotate(${collapseOpen ? '180deg' : '0'})`,
										}}
									/>
								)
							}
						>
							<Title level="3" weight="semibold">
								Карма - {backuser.carma} Ҝ
							</Title>
						</Cell>
					}
				>
					{profileID == myID && v}
				</Group>,
				'shadow'
			)
		);
	}, [profileID, myID, backuser, userRequestSucess, collapseOpen]);

	const [givenPanel, setGivenPanel] = useState();
	useEffect(() => {
		setGivenPanel(
			backuser.null || backuser.total_given_ads > 0 ? (
				<GivenPanel
					cache={{
						restore: direction == DIRECTION_BACK,
						to: (given) => {
							updateContext({ given });
						},
						from: (page, perPage) => {
							const given = activeContext[story].given;
							console.log('we have given', given);
							if (page < 0) {
								return given;
							}
							const p = page;

							if (given && p * perPage <= given.length) {
								return given.slice(0, p * perPage);
							}
							return [];
						},
					}}
					profileID={profileID}
					openAd={props.setReduxAd}
					amount={withLoadingIf(userRequestSucess, backuser.total_given_ads, 'small')}
				/>
			) : backuser && myID == backuser.vk_id ? (
				<Placeholder
					icon={<Icon56DoNotDisturbOutline />}
					header="Пусто"
					action={
						<Button style={{ cursor: 'pointer' }} size="l" onClick={openCreateStory}>
							Отдать даром
						</Button>
					}
				>
					Поделитесь с другими людьми!
				</Placeholder>
			) : (
				<Placeholder icon={<Icon56DoNotDisturbOutline />} header="Пусто">
					Пользователь еще ничего не отдавал
				</Placeholder>
			)
		);
	}, [backuser, profileID, userRequestSucess]);

	const [receivedPanel, setReceivedPanel] = useState();
	useEffect(() => {
		setReceivedPanel(
			backuser.null || backuser.total_received_ads > 0 ? (
				<ReceivedPanel
					cache={{
						restore: direction == DIRECTION_BACK,
						to: (received) => {
							updateContext({ received });
						},
						from: (page, perPage) => {
							const received = activeContext[story].received || [];
							console.log('we have received', received);
							if (page < 0) {
								return received;
							}
							const p = page;

							if (received && p * perPage <= received.length) {
								return received.slice(0, p * perPage);
							}
							return [];
						},
					}}
					profileID={profileID}
					openAd={props.setReduxAd}
					amount={withLoadingIf(userRequestSucess, backuser.total_received_ads, 'small')}
				/>
			) : backuser && myID == backuser.vk_id ? (
				<Placeholder
					icon={<Icon56DoNotDisturbOutline />}
					header="Пусто"
					action={
						<Button style={{ cursor: 'pointer' }} size="l" onClick={openAdsStory}>
							Получить даром
						</Button>
					}
				>
					Получайте вещи, нажимая "Хочу забрать", в ленте объявлений!
				</Placeholder>
			) : (
				<Placeholder icon={<Icon56DoNotDisturbOutline />} header="Пусто">
					Пользователь еще ничего не получал
				</Placeholder>
			)
		);
	}, [backuser, profileID, userRequestSucess]);

	useEffect(() => {
		console.log('direction is', direction);
		if (direction == DIRECTION_BACK) {
			return;
		}
		if (profileID == -1) {
			return;
		}
		let cleanupFunction = false;
		setUserRequestSucess(false);
		getUser(
			profileID,
			(v) => {
				if (cleanupFunction) {
					return;
				}

				updateContext({ backUser: v });
				if (profileID == myID) {
					props.setProfileName('Мой профиль');
				} else {
					props.setProfileName('Профиль');
				}
				setFailed(false);
				setUserRequestSucess(true);
			},
			(e) => {
				if (cleanupFunction) {
					return;
				}
				setFailed(true);
				setUserRequestSucess(true);
			},
			false
		);
		getUserVK(
			profileID,
			(r) => {
				if (cleanupFunction) {
					return;
				}
				//setVkUser(r);
				updateContext({ vkUser: r });
			},
			(e) => {
				//setVkUser(NO_VK_USER);
				updateContext({ vkUser: NO_VK_USER });
			}
		);
		return () => (cleanupFunction = true);
	}, [direction, profileID]);

	function openFreeze() {
		if (profileID == myID) {
			setFormData(story+ADS_FILTERS, {
				...inputData[story+ADS_FILTERS],
				mode: MODE_WANTED,
			});
			setPage(PANEL_ADS);
			//setStory(STORY_ADS);
		}
	}

	function openCreateStory() {
		setStory(STORY_CREATE);
	}

	function openAdsStory() {
		setStory(STORY_ADS);
	}

	const [supportPanel, setSupportPanel] = useState();
	useEffect(() => {
		const imgUrl = 'url(https://sun9-31.userapi.com/PQ4UCzqE_jue9hAINefBMorYCdfGXvcuV5nSjA/eYugcFYzdW8.jpg)';
		setSupportPanel(
			profileID == props.myID ? (
				<div style={{ marginTop: '20px' }}>
					<Banner
						mode="image"
						size="m"
						header="Помогите нам стать лучше"
						subheader={
							<span>
								Присылайте свои идеи для <br /> развития проекта
							</span>
						}
						background={
							<div
								style={{
									backgroundColor: '#5b9be6',
									backgroundImage: imgUrl,
									backgroundPosition: 'right bottom',
									backgroundSize: '102%',
									backgroundRepeat: 'no-repeat',
								}}
							/>
						}
						asideMode="expand"
						actions={
							<Button style={{ cursor: 'pointer' }} mode="overlay" size="l">
								Подробнее
							</Button>
						}
					/>
				</div>
			) : null
		);
	}, [profileID]);

	if (failed) {
		return <Error />;
	}
	return (
		<>
			{authorPanel}
			{carmaPanel}
			{givenPanel}
			{receivedPanel}
			{statisticsPanel}
			{/* {supportPanel} */}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		myID: state.vkui.myID,
		story: state.router.activeStory,
		activeContext: state.router.activeContext,
		direction: state.router.direction,
		activePanels: state.router.activePanels,

		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {
	setFormData,
	setStory,
	setPage,
	updateContext,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

// 337 -> 431 -> 368 -> 400 -> 473
