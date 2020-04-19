import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
	Avatar,
	CellButton,
	Link,
	Button,
	Cell,
	Header,
	Group,
	Placeholder,
	HorizontalScroll,
	Separator,
} from '@vkontakte/vkui';

import { RadialChart } from 'react-vis';

// import 'react-vis/dist/style';

import { getUser, getUserVK } from './requests';

import useAdGiven from './../adds/tabs/adds/useAdGiven';
import useAdReceived from './../adds/tabs/adds/useAdReceived';

import { AdLight } from './../../template/Add6';

import Icon56DoNotDisturbOutline from '@vkontakte/icons/dist/56/do_not_disturb_outline';

import Error from './../../placeholders/error';

import { old, time, fromSeconds } from './../../../utils/time';

import './profile.css';

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
	const [backuser, setBackUser] = useState();
	const [vkUser, setVkUser] = useState('');

	const [failed, setFailed] = useState(false);

	const width = document.body.clientWidth;

	const [givenPageNumber, setGivenPageNumber] = useState(1);
	let { given_loading, given, given_hasMore, given_newPage } = useAdGiven(
		props.setPopout,
		givenPageNumber,
		10,
		props.profileID
	);

	const [receivedPageNumber, setReceivedPageNumber] = useState(1);
	let { received_loading, received, received_hasMore, received_newPage } = useAdReceived(
		props.setPopout,
		receivedPageNumber,
		10,
		props.profileID
	);

	const given_observer = useRef();
	const givenLastAdElementRef = useCallback(
		(node) => {
			if (given_loading) return;
			if (given_observer.current) given_observer.current.disconnect();
			given_observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && given_hasMore) {
					setGivenPageNumber((prevPageNumber) => given_newPage + 1);
				}
			});
			if (node) given_observer.current.observe(node);
		},
		[given_loading, given_hasMore]
	);

	const received_observer = useRef();
	const receivedLastAdElementRef = useCallback(
		(node) => {
			if (received_loading) return;
			if (received_observer.current) received_observer.current.disconnect();
			received_observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && received_hasMore) {
					setReceivedPageNumber((prevPageNumber) => received_newPage + 1);
				}
			});
			if (node) received_observer.current.observe(node);
		},
		[received_loading, received_hasMore]
	);

	useEffect(() => {
		getUser(
			props.setPopout,
			props.setSnackbar,
			props.profileID,
			(v) => {
				setBackUser(v);
				props.setProfileName(v.name + ' ' + v.surname);
			},
			(e) => {
				setFailed(true);
			}
		);

		getUserVK(
			props.profileID,
			props.appID,
			props.apiVersion,
			(v) => {
				console.log('getUserVK', v);
				setVkUser(v);
			},
			(e) => {}
		);
		setGivenPageNumber(1);
		setReceivedPageNumber(1);
	}, [props.profileID]);

	function Ad(ad) {
		const image = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : '';
		return AdLight(ad, image, () => {
			props.openAd(ad);
		});
	}

	function getGiven() {
		return (
			<HorizontalScroll>
				<div style={{ marginLeft: '10px', display: 'flex' }}>
					{given.map((ad, index) => {
						if (given.length === index + 1) {
							return (
								<div style={{ padding: '4px' }} key={ad.ad_id} ref={givenLastAdElementRef}>
									{Ad(ad)}
								</div>
							);
						} else {
							return (
								<div style={{ padding: '4px' }} key={ad.ad_id}>
									{Ad(ad)}
								</div>
							);
						}
					})}
				</div>
			</HorizontalScroll>
		);
	}

	function getReceived() {
		return (
			<HorizontalScroll>
				<div style={{ marginLeft: '10px', display: 'flex' }}>
					{received.map((ad, index) => {
						if (received.length === index + 1) {
							return (
								<div style={{ padding: '4px' }} key={ad.ad_id} ref={receivedLastAdElementRef}>
									{Ad(ad)}
								</div>
							);
						} else {
							return (
								<div style={{ padding: '4px' }} key={ad.ad_id}>
									{Ad(ad)}
								</div>
							);
						}
					})}
				</div>
			</HorizontalScroll>
		);
	}

	console.log('we want update', props.profileID);

	if (backuser) {
		return (
			<>
				<Cell
					onClick={() => {
						window.open('https://vk.com/id' + backuser.vk_id, '_blank');
					}}
					size="l"
					multiline="true"
					asideContent={
						vkUser.can_write_private_message == 1 ? (
							<Link
								style={{ marginLeft: '15px' }}
								href={'https://vk.com/im?sel=' + props.profileID}
								target="_blank"
							>
								Написать
							</Link>
						) : (
							<Link
								style={{ marginLeft: '15px' }}
								href={'https://vk.com/id' + props.profileID}
								target="_blank"
							>
								Написать
							</Link>
						)
					}
					before={getImage(backuser)}
					description={
						!vkUser ? '' : vkUser.online ? 'online' : 'был(а) в сети ' + fromSeconds(vkUser.last_seen.time)
					}
				>
					<div className="profile-block">
						{getAuthorHref(backuser)}
						<div style={{ display: 'flex' }}>
							{vkUser && vkUser.city ? vkUser.city.title + ', ' : ''} {vkUser ? old(vkUser.bdate) : ''}
						</div>
						<div>{vkUser && vkUser.mobile_phone ? 'мобильный: ' + vkUser.mobile_phone : ''}</div>
						<div>{vkUser && vkUser.home_phone ? 'домашний: ' + vkUser.home_phone : ''}</div>
					</div>
				</Cell>

				<Group header={<Header mode="primary">Карма - {backuser.carma} Ҝ</Header>}>
					{props.profileID == props.myID ? (
						<div style={{ display: width < 400 ? 'block' : 'flex' }}>
							<Cell
								onClick={() => {
									if (props.profileID == props.myID) {
										props.goToAdds();
										props.setAdsMode('wanted');
									}
								}}
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
					) : (
						''
					)}
				</Group>

				<Group header={<Header mode="secondary">Отдано вещей - {backuser.total_given_ads}</Header>}>
					{backuser.total_given_ads > 0 ? (
						getGiven()
					) : backuser && props.myID == backuser.vk_id ? (
						<Placeholder
							icon={<Icon56DoNotDisturbOutline />}
							header="Пусто"
							action={
								<Button
									size="l"
									onClick={() => {
										props.goToCreate();
									}}
								>
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
					{backuser.total_received_ads > 0 ? (
						getReceived()
					) : backuser && props.myID == backuser.vk_id ? (
						<Placeholder
							icon={<Icon56DoNotDisturbOutline />}
							header="Пусто"
							action={
								<Button
									size="l"
									onClick={() => {
										props.goToAdds();
									}}
								>
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
				<Separator style={{ marginBottom: '10px' }} />
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
								backuser.total_given_ads + backuser.total_received_ads + backuser.total_aborted_ads == 0
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
			</>
		);
	}
	if (failed) {
		return (
			<Error
				action={() => {
					getUser(
						props.setPopout,
						props.setSnackbar,
						props.profileID,
						(v) => {
							setBackUser(v);
							setFailed(false);
						},
						(e) => {
							setFailed(true);
						}
					);
				}}
			/>
		);
	}
	return <></>;
};

export default Profile;

// 337
