import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
	PanelHeaderSimple,
	Link,
	Avatar,
	Button,
	Cell,
	Header,
	Group,
	PanelHeaderButton,
	PanelHeaderContext,
	Placeholder,
	HorizontalScroll,
} from '@vkontakte/vkui';

import { getUser, getUserVK } from './requests';

import useAdGiven from './../adds/tabs/adds/useAdGiven';
import useAdReceived from './../adds/tabs/adds/useAdReceived';

import { AdLight } from './../../template/Add6';

import Icon56DoNotDisturbOutline from '@vkontakte/icons/dist/56/do_not_disturb_outline';

import './profile.css';

function shortText(str, newLength) {
	if (str.length > newLength) {
		const s = str.slice(0, newLength);
		return s + '...';
	}
	return str;
}

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
	const id = backuser.vk_id;
	const name = backuser.name + ' ' + backuser.surname;
	return <div style={{ fontWeight: '600', fontSize: '16px' }}>{name}</div>;
}

const Profile = (props) => {
	const [backuser, setBackUser] = useState();
	const [status, setStatus] = useState('');
	const [online, setOnline] = useState(false);

	const [search, setSearch] = useState('');

	const [items, setItems] = useState([]);

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
			},
			(e) => {}
		);

		getUserVK(
			props.profileID,
			props.appID,
			props.apiVersion,
			(o, s) => {
				setOnline(o == 1);
				setStatus(s);
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
				<div style={{ display: 'flex' }}>
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
				<div style={{ display: 'flex' }}>
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

	return (
		<>
			<Cell
				onClick={() => {
					window.open('https://vk.com/id' + backuser.vk_id, '_blank');
				}}
				size="l"
				multiline="true"
				before={getImage(backuser)}
				description={online ? 'online' : ''}
			>
				<div className="profile-block">
					{getAuthorHref(backuser)}
					<div>{shortText(status, 32)}</div>
				</div>
			</Cell>

			<Group header={<Header mode="secondary">Карма - 0</Header>}>
				<Cell indicator={0}>Заморожено</Cell>
				<Cell indicator={0}>Получено</Cell>
				<Cell indicator={0}>Потрачено</Cell>
			</Group>
			<Group header={<Header mode="secondary">Отдано вещей - {given.length}</Header>}>
				{given.length > 0 ? (
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
			<Group header={<Header mode="secondary">Получено вещей - {received.length}</Header>}>
				{received.length > 0 ? (
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
		</>
	);
};

export default Profile;
