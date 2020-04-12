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

import useAdSearch from './../adds/tabs/adds/useAdSearch';

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

	const [pageNumber, setPageNumber] = useState(1);

	let { inited, loading, ads, error, hasMore, newPage } = useAdSearch(
		props.setPopout,
		search,
		'',
		'',
		pageNumber,
		5,
		'',
		'',
		'',
		''
	);

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => newPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	useEffect(() => {
		getUser(
			props.setPopout,
			props.setSnackbar,
			props.myID,
			(v) => {
				setBackUser(v);
			},
			(e) => {}
		);

		getUserVK(
			props.myID,
			props.appID,
			props.apiVersion,
			(o, s) => {
				setOnline(o == 1);
				setStatus(s);
			},
			(e) => {}
		);
	}, []);

	function Ad(ad) {
		const image = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : '';
		return AdLight(ad, image, () => {});
		// <div onClick={()=>{}} className="profile-main">
		// 	<div className="profile-main-left">
		// 		<img src={image} className="profile-tiled" />
		// 	</div>
		// </div>
	}

	function getAds(ads) {
		return (
			<HorizontalScroll>
				<div style={{ display: 'flex' }}>
					{ads.map((ad, index) => {
						if (ads.length === index + 1) {
							return (
								<div style={{ padding: '4px' }} key={ad.ad_id} ref={lastAdElementRef}>
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

	const Given = ads;
	const Taken = [];

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
			<Group header={<Header mode="secondary">Отдано вещей - {Given.length}</Header>}>
				{Given.length > 0 ? (
					getAds(Given)
				) : backuser && props.myID == backuser.vk_id ? (
					<Placeholder
						icon={<Icon56DoNotDisturbOutline />}
						header="Пусто"
						action={<Button size="l">Получить даром</Button>}
					>
						Получайте вещи, нажимая "Хочу забрать", в ленте объявлений!
					</Placeholder>
				) : (
					<Placeholder icon={<Icon56DoNotDisturbOutline />} header="Пусто">
						Пользователь еще ничего не получал
					</Placeholder>
				)}
			</Group>
			<Group header={<Header mode="secondary">Получено вещей - {Taken.length}</Header>}>
				{Taken.length > 0 ? (
					getAds(Taken)
				) : backuser && props.myID == backuser.vk_id ? (
					<Placeholder
						icon={<Icon56DoNotDisturbOutline />}
						header="Пусто"
						action={<Button size="l">Получить даром</Button>}
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
