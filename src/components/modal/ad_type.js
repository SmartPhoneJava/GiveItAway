import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';

import { AnimateOnChange } from 'react-animation';

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';

import { SimpleCell, InfoRow, Link, Group, Header, Button } from '@vkontakte/vkui';
import {
	getAdType,
	getAdTypeAuthor,
	getAdTypeEnd,
	getAdTypeCarmaAuthor,
	getAdTypeCarmaEnd,
	getAdTypeCarmaSub,
	getAdTypeDescription,
} from '../detailed_ad/faq';
import { STORY_ADS } from '../../store/router/storyTypes';
import { TYPE_CHOICE, TYPE_AUCTION, TYPE_RANDOM } from '../../const/ads';

const ModalCardCaptionAdsTypeInner = (props) => {
	const activeModal = props.activeModals[STORY_ADS];
	const width = document.body.clientWidth;

	const [openAdTypeDetails, setOpenAdTypeDetails] = useState(false);
	const [moveAdType, setMoveAdType] = useState(0);
	const [currentAdType, setCurrentAdTypeI] = useState('');
	const setCurrentAdType = (t) => {
		props.updateType(t);
		setCurrentAdTypeI(t);
	};
	const [adTypeAuthor, setAdTypeAuthor] = useState('');
	const [adTypeEnd, setAdTypeEnd] = useState('');
	const [adTypeCarmaAuthor, setAdTypeCarmaAuthor] = useState('');
	const [adTypeCarmaSub, setAdTypeCarmaSub] = useState('');
	const [adTypeCarmaEnd, setAdTypeCarmaEnd] = useState('');
	const [adTypeDescription, setAdTypeDescription] = useState('');
	function setInfo(ad_type) {
		const description = getAdTypeDescription(ad_type);
		const chosenSub = cellWrapper('Определение получателя', getAdTypeAuthor(ad_type));
		const end = getAdTypeEnd(ad_type)
			? cellWrapper('Когда происходит выбор получателя', getAdTypeEnd(ad_type))
			: null;
		const carmaAuthor = cellWrapper('Карма автора', getAdTypeCarmaAuthor(ad_type));
		const carmaSub = cellWrapper('Карма откливнушегося', getAdTypeCarmaSub(ad_type));
		const carmaEnd = cellWrapper('После определения получателя', getAdTypeCarmaEnd(ad_type));

		setAdTypeDescription(description);
		setAdTypeAuthor(chosenSub);
		setAdTypeEnd(end);
		setAdTypeCarmaAuthor(carmaAuthor);
		setAdTypeCarmaEnd(carmaSub);
		setAdTypeCarmaSub(carmaEnd);
		setOpenAdTypeDetails(false);
	}

	function cellWrapper(header, value) {
		return (
			<SimpleCell multiline={true} style={{ padding: '0px' }}>
				<InfoRow header={header}>
					<div style={{ fontSize: '10pt' }}>{value}</div>
				</InfoRow>
			</SimpleCell>
		);
	}

	useEffect(() => {
		if (!activeModal || !currentAdType) {
			setInfo(props.ad.ad_type);
			setCurrentAdType(props.ad.ad_type);
		}
	}, [props.ad, activeModal]);
	useEffect(() => {
		if (moveAdType == 0) {
			return;
		}
		const arr = [TYPE_CHOICE, TYPE_AUCTION, TYPE_RANDOM];
		let ind = arr.indexOf(currentAdType) + moveAdType;
		if (ind < 0) {
			ind = 2;
		}
		if (ind > 2) {
			ind = 0;
		}
		const newType = arr[ind];
		setInfo(newType);
		setCurrentAdType(newType);
		setMoveAdType(0);
	}, [moveAdType]);

	const [componentTypesArr, setComponentTypesArr] = useState([]);
	useEffect(() => {
		console.log('currentAdType', currentAdType, arr);
		let arr = [];
		if (currentAdType != TYPE_CHOICE) {
			arr.push(
				<div key={TYPE_CHOICE} style={{ padding: '3px', flex: 1 }}>
					<Button
						mode="secondary"
						size="xl"
						onClick={() => {
							setCurrentAdType(TYPE_CHOICE);
							setInfo(TYPE_CHOICE);
						}}
					>
						Сделка
					</Button>
				</div>
			);
		}
		if (currentAdType != TYPE_AUCTION) {
			arr.push(
				<div key={TYPE_AUCTION} style={{ padding: '3px', flex: 1 }}>
					<Button
						mode="secondary"
						size="xl"
						onClick={() => {
							setCurrentAdType(TYPE_AUCTION);
							setInfo(TYPE_AUCTION);
						}}
					>
						Аукцион
					</Button>
				</div>
			);
		}
		if (currentAdType != TYPE_RANDOM) {
			arr.push(
				<div key={TYPE_RANDOM} style={{ padding: '3px', flex: 1 }}>
					<Button
						mode="secondary"
						size="xl"
						onClick={() => {
							setCurrentAdType(TYPE_RANDOM);
							setInfo(TYPE_RANDOM);
						}}
					>
						Лотерея
					</Button>
				</div>
			);
		}

		setComponentTypesArr(arr);
	}, [currentAdType]);

	return (
		<>
			<div className="flex-center">
				<div onClick={() => setMoveAdType(-1)}>
					<Icon24BrowserBack />
				</div>
				<div style={{ display: 'block' }}>
					<Collapse isOpened={!openAdTypeDetails}>
						<AnimateOnChange duration="50" animation="slide">
							{adTypeDescription}
						</AnimateOnChange>
					</Collapse>

					<Link onClick={() => setOpenAdTypeDetails((prev) => !prev)}>
						{openAdTypeDetails ? 'Скрыть подробности' : 'Подробнее'}
					</Link>
					<Collapse isOpened={openAdTypeDetails}>
						{adTypeAuthor}
						{adTypeEnd}
						{adTypeCarmaAuthor}

						{adTypeCarmaSub}
						{/* {adTypeCarmaEnd} */}
					</Collapse>
				</div>
				<div onClick={() => setMoveAdType(1)}>
					<Icon24BrowserForward />
				</div>
			</div>
			<Group header={<Header mode="secondary">Другие виды объявлений</Header>}>
				<div style={{ display: 'flex' }}>{componentTypesArr}</div>
			</Group>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		activeModals: state.router.activeModals,
		ad: state.ad,
	};
};

const mapDispatchToProps = {};

export const ModalCardCaptionAdsType = connect(mapStateToProps, mapDispatchToProps)(ModalCardCaptionAdsTypeInner);

// 197