import React, { useState, useEffect } from 'react';
import { Avatar, InfoRow } from '@vkontakte/vkui';

import Icon16Place from '@vkontakte/icons/dist/16/place';

import MetroImage30 from './../../img/30/metro.png';

import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';

import Icon20ArticleBoxOutline from '@vkontakte/icons/dist/20/article_box_outline';

import Icon12Lock from '@vkontakte/icons/dist/12/lock';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';

import OpenActions from './components/actions';

import { time } from '../../utils/time';

import './Add7.css';
import { GetCategoryText } from '../../components/categories/Categories';
import { STATUS_ABORTED, STATUS_CLOSED, STATUS_CHOSEN, STATUS_OFFER } from '../../const/ads';

const Add7 = (props) => {
	const [ad, setAd] = useState(props.ad);
	const [status, setStatus] = useState(props.ad.status);
	const [isVisible, setIsVisible] = useState(!props.ad.hidden);

	useEffect(() => {
		props.ad.hidden = !isVisible;
	}, [isVisible]);

	useEffect(() => {
		props.ad.status = status;
	}, [status]);

	const image = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : '';

	function openSettings() {
		props.setPopout(
			<OpenActions
				refresh={props.refresh}
				ad={props.ad}
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
		const par = (ad.status == STATUS_OFFER || ad.status == STATUS_CHOSEN) && isAuthor();
		return par ? (
			<Icon24MoreVertical onClick={openSettings} style={{ marginLeft: 'auto', marginBottom: 'auto' }} />
		) : null;
	}

	function metroPanel() {
		return (
			<InfoRow onClick={props.openAd} className="atext" style={{ marginTop: '2px' }}>
				<div style={{ display: 'flex' }}>
					<Avatar style={{ marginRight: '5px' }} size={16} src={MetroImage30} /> Аэропорт
				</div>
			</InfoRow>
		);
	}

	function authorPanel() {
		return (
			<InfoRow
				onClick={props.openAd}
				// onClick={() => {
				// 	props.openUser(ad.author.vk_id);
				// }}
			>
				<div className="aauthor">
					<Avatar style={{ marginRight: '5px' }} size={20} src={ad.author.photo_url} />{' '}
					{!ad.anonymous ? ad.author.name + ' ' + ad.author.surname : ''}
				</div>
			</InfoRow>
		);
	}

	if (!ad) {
		return <></>;
	}
	return (
		<div className="aoutter">
			<div className="atile">
				<div onClick={props.openAd} className="amain-left">
					<img src={image} className="atiled" />
					<div className="acity">
						<Icon16Place /> {ad.district}
					</div>

					{ad.status == STATUS_ABORTED ? (
						<div className="failed">
							<div className="on-img-text">
								<Icon16Clear style={{ marginRight: '5px' }} />
								Отменено
							</div>
						</div>
					) : (
						''
					)}
					{ad.status == STATUS_CLOSED ? (
						<div className="success">
							<div className="on-img-text">
								<Icon16CheckCircle style={{ marginRight: '5px' }} />
								Вещь отдана
							</div>
						</div>
					) : (
						''
					)}
					{ad.status == STATUS_CHOSEN && isAuthor() && ad.status == STATUS_CHOSEN ? (
						<div className="deal">
							<div style={{ color: 'rgb(220,220,220)', fontSize: '12px', padding: '2px' }}>
								Ожидание ответа
							</div>
						</div>
					) : (
						''
					)}
					{!isVisible ? (
						isAuthor() && ad.hidden ? (
							<div className="hidden2 on-img-text">
								<Icon12Lock />
								Видно только вам
							</div>
						) : (
							<div className="hidden on-img-text">
								<Icon12Lock />
								Видно только вам
							</div>
						)
					) : (
						''
					)}
				</div>
				<div className="aright-main">
					<div style={{ display: 'flex' }}>
						<InfoRow onClick={props.openAd} className="aheader">
							{ad.header}
						</InfoRow>

						{controllButton()}
					</div>
					<InfoRow onClick={props.openAd} className="atext">
						{' '}
						{GetCategoryText(ad.category)}{' '}
					</InfoRow>
					<InfoRow onClick={props.openAd} className="atext">
						{' '}
						{time(ad.creation_date, 300)}{' '}
					</InfoRow>
					{metroPanel()}
					{authorPanel()}
				</div>
			</div>
		</div>
	);
};

export default Add7;

// 342
