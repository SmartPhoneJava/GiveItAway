import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
	Header,
	Group,
	InfoRow,
	Cell,
	UsersStack,
	Placeholder,
	Snackbar,
	Button,
	osname,
	IOS,
	Avatar,
	CellButton,
} from '@vkontakte/vkui';

import useSubsGet from './useSubsGet';

import Icon44SmileOutline from '@vkontakte/icons/dist/44/smile_outline';

import './subs.css';

function showSubs(setPopout, setSnackbar, lastAdElementRef, subs) {
	return (
		<Group header={<Header mode="secondary">Откликнулись</Header>}>
			{subs.length > 0 ? (
				subs.map((v, i) =>
					subs.length == i + 1 ? (
						<Cell
							ref={lastAdElementRef}
							onClick={() => props.openUser(v.vk_id)}
							key={v.vk_id}
							before={<Avatar size={36} src={v.photo_url} />}
						>
							{v.name + ' ' + v.surname}
						</Cell>
					) : (
						<Cell
							onClick={() => props.openUser(v.vk_id)}
							key={v.vk_id}
							before={<Avatar size={36} src={v.photo_url} />}
						>
							{v.name + ' ' + v.surname}
						</Cell>
					)
				)
			) : (
				<InfoRow style={{ paddingLeft: '16px' }}> пусто</InfoRow>
			)}
		</Group>
	);
}

const NO_ID = -1;

const Subs = (props) => {
	const [subs, setSubs] = useState([]);
	const [photos, setPhotos] = useState([]);
	const [openFAQ, setOpenFAQ] = useState(false);

	const [pageNumber, setPageNumber] = useState(1);
	let { inited, loading, tsubs, error, hasMore, newPage } = useSubsGet(
		props.setPopout,
		pageNumber,
		props.amount,
		props.ad.ad_id,
		props.maxAmount,
		(s) => {
			console.log('i set', s);
			setSubs(s);
			setPhotos([...s, ...s, ...s].map((v) => v.photo_url));
		},
		() => {}
	);
	console.log('subs', tsubs);

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

	if (subs.length == 0) {
		return 'Никто еще не откликнулся';
	}

	return props.mini ? (
		<Group header={<Header mode="secondary">Откликнулись</Header>}>
			<UsersStack photos={photos} size="m">
				<div style={{ display: 'flex' }}>
					<CellButton onClick={props.openSubs}>открыть полный список</CellButton>
				</div>
				{/* {subs.length == 1
					? subs[0].name + ' отликнулся'
					: subs.length == 2
					? subs[0].name + ' и ' + subs[1].name + ' откликнулись'
					: subs.length == 3
					? subs[0].name + ', ' + subs[1].name + ', ' + subs[2].name + ' откликнулись'
					: subs[0].name +
					  ', ' +
					  subs[1].name +
					  ', ' +
					  subs[2].name +
					  'и еще ' +
					  subs.length +
					  ' человек откликнулись'} */}
			</UsersStack>
		</Group>
	) : (
		<div>
			{!openFAQ ? (
				<>
					<CellButton
						onClick={() => {
							setOpenFAQ(true);
						}}
					>
						Как отдать вещь?
					</CellButton>
					{showSubs(props.setPopout, props.setSnackbar, lastAdElementRef, subs)}
				</>
			) : (
				<>
					<Placeholder
						action={
							<Button
								onClick={() => {
									setOpenFAQ(false);
								}}
								size="l"
							>
								Понятно
							</Button>
						}
						icon={<Icon44SmileOutline />}
						header="Как отдать вещь?"
					>
						Кликните по одному из пользователей в списке откливнушихся, чтобы выбрать его в качестве получателя. Он получит
						соответствующее уведомление и запрос на подтверждение получения вещи. После получения
						подтверждения, обьявления автоматически закроется. Вы в любой момент можете отозвать предложение
						или изменить получателя.
					</Placeholder>
				</>
			)}
		</div>
	);
};

export default Subs;
