import React, { useState, useEffect } from 'react';
import { Avatar, Link, Button, Cell, Header, Group, Placeholder, Banner, Spinner, Card } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { getUser, getUserVK } from './requests';

import Icon56DoNotDisturbOutline from '@vkontakte/icons/dist/56/do_not_disturb_outline';

import Error from './../../placeholders/error';

import { old, fromSeconds } from './../../../utils/time';

import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import './profile.css';
import { setFormData } from '../../../store/create_post/actions';
import { setStory } from '../../../store/router/actions';
import { STORY_ADS, STORY_CREATE } from '../../../store/router/storyTypes';
import { ADS_FILTERS } from '../../../store/create_post/types';
import { MODE_WANTED } from '../../../const/ads';

import GivenPanel from './given';
import ReceivedPanel from './received';
import { NO_USER, NO_VK_USER } from './const';
import { Statistics } from '../../../components/profile/statistics';
import { withLoading, withLoadingIf } from '../../../components/image/image_cache';
import { Collapse } from 'react-collapse';
import { CardWithPadding } from '../../App';

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
	const { myID, inputData } = props;
	const { setFormData, setStory } = props;
	const profileID = props.activeProfile || -1;

	const [userRequestSucess, setUserRequestSucess] = useState(false);

	const [backuser, setBackUser] = useState(NO_USER);
	const [vkUser, setVkUser] = useState(NO_VK_USER);

	const [failed, setFailed] = useState(false);

	const width = document.body.clientWidth;

	function openUserVK() {
		window.open(getUserVKstring(), '_blank');
	}

	function getUserVKstring() {
		return 'https://vk.com/id' + profileID;
	}

	function getUserDialog() {
		return 'https://vk.com/im?sel=' + profileID;
	}

	function getUserOnline() {
		return !vkUser || vkUser.null
			? ''
			: vkUser.online
			? 'online'
			: 'был(а) в сети ' + fromSeconds(vkUser.last_seen.time);
	}

	const [authorPanel, setAuthorPanel] = useState();
	useEffect(() => {
		setAuthorPanel(
			CardWithPadding(
				<Cell
					onClick={openUserVK}
					size="l"
					multiline={true}
					asideContent={/*contentWriteToUser()*/ <Icon24Chevron />}
					before={withLoading(getImage(backuser))}
					description={withLoading(getUserOnline())}
				>
					{withLoading(
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
						<Header
							onClick={() => {
								console.log('clickkkked', collapseOpen);
								setCollapseOpen((prev) => !prev);
							}}
							mode="primary"
							aside={
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
							Карма - {backuser.carma} Ҝ
						</Header>
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
					profileID={profileID}
					openAd={props.setReduxAd}
					amount={withLoadingIf(userRequestSucess, backuser.total_given_ads, 'small')}
				/>
			) : backuser && myID == backuser.vk_id ? (
				<Placeholder
					icon={<Icon56DoNotDisturbOutline />}
					header="Пусто"
					action={
						<Button size="l" onClick={openCreateStory}>
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
					profileID={profileID}
					openAd={props.setReduxAd}
					amount={withLoadingIf(userRequestSucess, backuser.total_received_ads, 'small')}
				/>
			) : backuser && myID == backuser.vk_id ? (
				<Placeholder
					icon={<Icon56DoNotDisturbOutline />}
					header="Пусто"
					action={
						<Button size="l" onClick={openAdsStory}>
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
				console.log('we log you v!', v);
				setBackUser(v);
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
			props.appID,
			props.apiVersion,
			(r) => {
				if (cleanupFunction) {
					return;
				}
				setVkUser(r);
			},
			(e) => {
				setVkUser(NO_VK_USER);
			}
		);
		return () => (cleanupFunction = true);
	}, [profileID]);

	function openFreeze() {
		if (profileID == myID) {
			setFormData(ADS_FILTERS, {
				...inputData[ADS_FILTERS],
				mode: MODE_WANTED,
			});
			setStory(STORY_ADS);
		}
	}

	function openCreateStory() {
		setStory(STORY_CREATE);
	}

	function openAdsStory() {
		setStory(STORY_ADS);
	}

	function contentWriteToUser() {
		return vkUser.id == myID ? null : vkUser.can_write_private_message == 1 ? (
			<Link style={{ marginLeft: '15px' }} href={getUserDialog()} target="_blank">
				Написать
			</Link>
		) : (
			<Link style={{ marginLeft: '15px' }} href={getUserVKstring()} target="_blank">
				Написать
			</Link>
		);
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
							<Button mode="overlay" size="l">
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
		apiVersion: state.vkui.apiVersion,
		appID: state.vkui.appID,
		activeProfile: state.router.activeProfile,

		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {
	setFormData,
	setStory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

// 337 -> 431 -> 368
