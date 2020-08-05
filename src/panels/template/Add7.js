import React, { useState, useEffect } from 'react';
import { Avatar, InfoRow, Spinner, Card } from '@vkontakte/vkui';

import Icon16Place from '@vkontakte/icons/dist/16/place';

import MetroImage30 from './../../img/30/metro.png';

import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';

import Icon12Lock from '@vkontakte/icons/dist/12/lock';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';

import OpenActions from './components/actions';

import Icon from './../../img/icon150.png';

import { time } from '../../utils/time';

import { Transition } from 'react-transition-group';

import './Add7.css';
import { GetCategoryText } from '../../components/categories/Categories';
import { STATUS_ABORTED, STATUS_CLOSED, STATUS_CHOSEN, STATUS_OFFER } from '../../const/ads';
import { ImageCache } from '../../components/image/image_cache';
import { Collapse } from 'react-collapse';
import { CardWithPadding } from '../App';

const duration = 300;

const transitionStyles = {
	entering: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	entered: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	exiting: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
	exited: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
};

export const WHITE_LIST = [
	45863670,
	51000329,
]

const Add7 = (props) => {
	const [ad] = useState(props.ad);
	const [status, setStatus] = useState(props.ad.status);
	const [isVisible, setIsVisible] = useState(!props.ad.hidden);

	const [image, setImage] = useState();
	useEffect(() => {
		const url = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : Icon;

		setImage(<ImageCache url={url} className="atiled" spinnerClassName="atiled-spinner" />);
	}, [ad.pathes_to_photo]);

	useEffect(() => {
		props.ad.hidden = !isVisible;
	}, [isVisible]);

	useEffect(() => {
		props.ad.status = status;
	}, [status]);

	function openSettings() {
		const isAdmin = WHITE_LIST.indexOf(props.myID) >= 0
		props.setPopout(
			<OpenActions
				refresh={props.refresh}
				ad={props.ad}
				isAdmin={isAdmin}
				onCloseClick={props.onCloseClick}
				setIsVisible={setIsVisible}
				setStatus={setStatus}
			/>
		);
	}

	function isAuthor() {
		return props.myID == props.ad.author.vk_id;
	}

	function controllButton() {
		const isAdmin = WHITE_LIST.indexOf(props.myID) >= 0
		const par = (ad.status == STATUS_OFFER || ad.status == STATUS_CHOSEN) && (isAuthor() || isAdmin);
		return par ? (
			<Icon24MoreVertical onClick={openSettings} style={{ marginLeft: 'auto', marginBottom: 'auto' }} />
		) : null;
	}

	function metroPanel() {
		return null;
		// <InfoRow onClick={props.openAd} className="atext" style={{ marginTop: '2px' }}>
		// 	<div style={{ display: 'flex' }}>
		// 		<Avatar style={{ marginRight: '5px' }} size={16} src={MetroImage30} /> Аэропорт
		// 	</div>
		// </InfoRow>
	}

	function authorPanel() {
		return (
			<InfoRow>
				<div className="aauthor">
					<div style={{ marginRight: '5px', minWidth: '20px' }}>
						<Avatar size={20} src={ad.author.photo_url} />
					</div>
					<div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
						{!ad.anonymous ? ad.author.name + ' ' + ad.author.surname : ''}
					</div>
				</div>
			</InfoRow>
		);
	}

	function statusText(text, className, Icon) {
		return (
			<div className={className}>
				<div className="on-img-text">
					<Icon style={{ marginRight: '2px' }} />
					{text}
				</div>
			</div>
		);
	}

	const [label, setLabel] = useState(<></>);
	const [hasLabel, setHasLabel] = useState(false);
	useEffect(() => {
		const { status } = props.ad;
		let newLabel = null;
		switch (status) {
			case STATUS_ABORTED:
				newLabel = statusText('Отменено', 'failed', Icon16Clear);

			case STATUS_CLOSED:
				newLabel = statusText('Вещь отдана', 'success', Icon16CheckCircle);

			case STATUS_CHOSEN:
				if (isAuthor()) {
					newLabel = statusText('Ожидание ответа', 'deal', Icon12Fire);
				}
		}

		if (!isVisible && isAuthor()) {
			newLabel = statusText('Видно только вам', 'hidden', Icon12Lock);
		}
		if (newLabel) {
			setLabel(newLabel);
		}
		setHasLabel(newLabel != null);
	}, [props.ad, isVisible]);

	if (!ad) {
		return <></>;
	}
	return CardWithPadding(
		<div className="atile">
			<div onClick={props.openAd} className="amain-left">
				{image}
				<div className="acity">
					<Icon16Place /> {ad.district ? ad.district : ad.region}
				</div>

				<Transition in={hasLabel} timeout={duration}>
					{(state) => (
						<div
							style={{
								...transitionStyles[state],
							}}
						>
							{label}
						</div>
					)}
				</Transition>
			</div>
			<div className="aright-main">
				<div style={{ display: 'flex' }}>
					<InfoRow onClick={props.openAd} className="aheader">
						{ad.header}
					</InfoRow>

					{controllButton()}
				</div>
				<div onClick={props.openAd}>
					<InfoRow className="atext"> {GetCategoryText(ad.category)} </InfoRow>
					<InfoRow className="atext"> {time(ad.creation_date, 300)} </InfoRow>
					{metroPanel()}
					{authorPanel()}
				</div>
			</div>
		</div>,
		'shadow'
	);
};

export default Add7;

// 342 -> 165
