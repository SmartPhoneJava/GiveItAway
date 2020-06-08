import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Avatar, Link, Button, Cell, Header, Group, Placeholder, Banner, Spinner } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { RadialChart } from 'react-vis';

import { getUser, getUserVK } from './requests';

import Icon56DoNotDisturbOutline from '@vkontakte/icons/dist/56/do_not_disturb_outline';

import Error from './../../placeholders/error';

import { old, fromSeconds } from './../../../utils/time';

import './profile.css';
import { setFormData } from '../../../store/create_post/actions';
import { setStory } from '../../../store/router/actions';
import { STORY_ADS, STORY_CREATE } from '../../../store/router/storyTypes';
import { ADS_FILTERS } from '../../../store/create_post/types';
import { MODE_WANTED } from '../../../const/ads';

import GivenPanel from './given';
import ReceivedPanel from './received';
import { NO_USER, NO_VK_USER } from './const';

function getImage(backuser) {
	if (!backuser || !backuser.photo_url) {
		return '';
	}
	const photoURL = backuser.photo_url;
	return <Avatar size={64} src={photoURL} />;
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

	const [cleanupFunction, setcleanup] = useState(false);

	const [vkSpinner, setVKSpinner] = useState(null);
	const [mainSpinner, setMainSpinner] = useState(null);

	const [backuser, setBackUser] = useState(NO_USER);
	const [vkUser, setVkUser] = useState(NO_VK_USER);

	const [failed, setFailed] = useState(false);

	const width = document.body.clientWidth;

	useEffect(() => {
		setcleanup(false);
		if (profileID == -1) {
			return;
		}
		doGetUser();
		setVKSpinner(<Spinner size="small" />);
		getUserVK(
			profileID,
			props.appID,
			props.apiVersion,
			(r) => {
				if (cleanupFunction) {
					return;
				}
				setVkUser(r);
				setVKSpinner(null);
			},
			(e) => {
				setVKSpinner(null);
				setVkUser(NO_VK_USER);
			}
		);
		return () => setcleanup(true);
	}, [profileID]);

	function getUserVKstring() {
		return 'https://vk.com/id' + profileID;
	}

	function openUserVK() {
		window.open(getUserVKstring(), '_blank');
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

	function doGetUser() {
		if (profileID == -1) {
			return;
		}
		setMainSpinner(<Spinner size="medium" />);
		getUser(
			profileID,
			(v) => {
				if (cleanupFunction) {
					return;
				}
				setBackUser(v);
				if (profileID == myID) {
					props.setProfileName('Мой профиль');
				} else {
					props.setProfileName('Профиль');
				}
				setFailed(false);
				setMainSpinner(null);
			},
			(e) => {
				if (cleanupFunction) {
					return;
				}
				setFailed(true);
				setMainSpinner(null);
			},
			false
		);
	}

	console.log('contentWriteToUser backuser', backuser);
	console.log('contentWriteToUser vkUser', vkUser);
	function contentWriteToUser() {
		console.log('contentWriteToUser', vkUser.id, myID);
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

	if (1 == 1 || backuser) {
		return (
			<>
				<Cell
					onClick={openUserVK}
					size="l"
					multiline="true"
					asideContent={contentWriteToUser()}
					before={getImage(backuser)}
					description={getUserOnline()}
				>
					<div className="profile-block">
						{getAuthorHref(backuser)}
						<div style={{ display: 'flex' }}>
							{vkUser && vkUser.city ? vkUser.city.title + ', ' : ''} {vkUser ? old(vkUser.bdate) : ''}
						</div>
						<div>{vkUser && vkUser.mobile_phone ? 'мобильный: ' + vkUser.mobile_phone : ''}</div>
						<div>{vkUser && vkUser.home_phone ? 'домашний: ' + vkUser.home_phone : ''}</div>
						{vkSpinner}
					</div>
				</Cell>

				{mainSpinner ? (
					mainSpinner
				) : (
					<Group header={<Header mode="primary">Карма - {backuser.carma} Ҝ</Header>}>
						{profileID == myID ? (
							<div style={{ display: width < 450 ? 'block' : 'flex' }}>
								<Cell
									onClick={openFreeze}
									className="profile-carma-label"
									indicator={<span>{backuser.frozen_carma + ' Ҝ'}</span>}
								>
									Заморожено
								</Cell>
								<Cell
									className="profile-carma-label"
									indicator={<span>{backuser.total_earned_carma + ' Ҝ'}</span>}
								>
									Получено
								</Cell>
								<Cell
									className="profile-carma-label"
									indicator={<span>{backuser.total_spent_carma + ' Ҝ'}</span>}
								>
									Потрачено
								</Cell>
							</div>
						) : null}
					</Group>
				)}

				<Group header={<Header mode="secondary">Отдано вещей - {backuser.total_given_ads}</Header>}>
					{backuser.null || backuser.total_given_ads > 0 ? (
						<GivenPanel profileID={profileID} />
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
					)}
				</Group>
				<Group header={<Header mode="secondary">Получено вещей - {backuser.total_received_ads}</Header>}>
					{backuser.null || backuser.total_received_ads > 0 ? (
						<ReceivedPanel profileID={profileID} />
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
					)}
				</Group>
				{backuser.total_received_ads + backuser.total_given_ads == 0 ? null : (
					<Group header={<Header mode="secondary">Статистика</Header>}>
						<div className="infographics-main">
							<div className="infographics-column">
								<div>Вещей</div>
								<RadialChart
									data={
										backuser.total_given_ads + backuser.total_received_ads == 0
											? [
													{ angle: 1, color: '#00CCFF' },
													{
														angle: 1,
														color: '#FFCC33',
													},
											  ]
											: [
													{ angle: backuser.total_given_ads, color: '#00CCFF' },
													{
														angle: backuser.total_received_ads,
														color: '#FFCC33',
													},
											  ]
									}
									showLabels={true}
									radius={40}
									innerRadius={30}
									width={width / 2}
									height={100}
									labelsAboveChildren={false}
									labelsRadiusMultiplier={2}
									colorType="literal"
								/>

								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Avatar style={{ background: '#00CCFF', marginRight: '3px' }} size={14}></Avatar>
									<>Отдано</>
								</div>
								<div style={{ display: 'flex', paddingLeft: '15px', justifyContent: 'center' }}>
									<Avatar style={{ background: '#FFCC33', marginRight: '3px' }} size={14}></Avatar>
									<>Получено</>
								</div>
							</div>
							<div className="infographics-column">
								Обменов
								<RadialChart
									data={
										backuser.total_given_ads +
											backuser.total_received_ads +
											backuser.total_aborted_ads ==
										0
											? [
													{
														angle: 1,
														color: '#00CC66',
													},
													{
														angle: 1,
														color: '#FF9933',
													},
											  ]
											: [
													{
														angle: backuser.total_given_ads + backuser.total_received_ads,
														color: '#00CC66',
													},
													{
														angle: backuser.total_aborted_ads,
														color: '#FF9933',
													},
											  ]
									}
									colorType="literal"
									showLabels={true}
									radius={40}
									innerRadius={30}
									width={width / 2}
									height={100}
									labelsAboveChildren={false}
									labelsRadiusMultiplier={2}
								/>
								<div style={{ display: 'flex', paddingLeft: '18px', justifyContent: 'center' }}>
									<Avatar style={{ background: '#00CC66', marginRight: '3px' }} size={14}></Avatar>
									<>Проведено</>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Avatar style={{ background: '#FF9933', marginRight: '3px' }} size={14}></Avatar>
									<>Сорвано</>
								</div>
							</div>
						</div>
					</Group>
				)}
				{/* {profileID == props.myID ? (
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
										backgroundImage:
											'url(https://sun9-31.userapi.com/PQ4UCzqE_jue9hAINefBMorYCdfGXvcuV5nSjA/eYugcFYzdW8.jpg)',
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
				) : null} */}
			</>
		);
	}
	if (failed) {
		return <Error action={doGetUser} />;
	}
	return <></>;
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

// 337 -> 431
