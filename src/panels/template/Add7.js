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
import { shortText } from '../../utils/short_text';

import { Draft } from '../../store/draft';

import './Add7.css';
import { GetCategoryText } from './Categories';

const Add7 = (props) => {
	const [ad, setAd] = useState(props.ad);
	const [haveDeal, setHaveDeal] = useState(false);
	const [isVisible, setIsVisible] = useState(true);

	async function init() {
		setHaveDeal(props.ad.status == 'chosen');
		setIsVisible(!props.ad.hidden);
	}

	useEffect(() => {
		Draft.subscribe(init);
	}, []);

	useEffect(() => {
		init();
	}, [props.ad]);

	const image = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : '';

	function openSettings() {
		OpenActions(
			props.setPopout,
			props.setSnackbar,
			props.refresh,
			ad.ad_id,
			props.onCloseClick,
			haveDeal,
			!isVisible
		);
	}

	function isAuthor() {
		return props.myID == ad.author.vk_id;
	}

	function controllButton() {
		return (ad.status == 'offer' || ad.status == 'chosen') && isAuthor() ? (
			<Icon24MoreVertical onClick={openSettings} style={{ marginLeft: 'auto', marginBottom: 'auto' }} />
		) : (
			''
		);
	}

	function metroPanel() {
		return (
			<InfoRow onClick={props.openAd} className="atext" style={{marginTop:"2px"}}>
				<div style={{ display: 'flex' }}>
					<Avatar style={{ marginRight: '5px' }} size={16} src={MetroImage30} /> Аэропорт
				</div>
			</InfoRow>
		);
	}

	function authorPanel() {
		return (
			<InfoRow
				onClick={() => {
					props.openUser(ad.author.vk_id);
				}}
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

					{ad.status == 'aborted' ? (
						<div className="failed">
							<div className="on-img-text">
								<Icon16Clear style={{ marginRight: '5px' }} />
								Отменено
							</div>
						</div>
					) : (
						''
					)}
					{ad.status == 'closed' ? (
						<div className="success">
							<div className="on-img-text">
								<Icon16CheckCircle style={{ marginRight: '5px' }} />
								Вещь отдана
							</div>
						</div>
					) : (
						''
					)}
					{ad.status == 'chosen' && isAuthor() && haveDeal ? (
						<div className="deal">
							<div style={{ color: 'rgb(220,220,220)', fontSize: '12px', padding: '2px' }}>
								Ожидание ответа
							</div>
						</div>
					) : (
						''
					)}
					{!isVisible ? (
						isAuthor() && haveDeal ? (
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
						<InfoRow onClick={props.openAd} className="aheader"> {shortText(ad.header, 30)} </InfoRow>

						{controllButton()}
					</div>
					<InfoRow onClick={props.openAd} className="atext"> {GetCategoryText(ad.category)} </InfoRow>
					<InfoRow onClick={props.openAd} className="atext"> {time(ad.creation_date, 300)} </InfoRow>
					{metroPanel()}
					{authorPanel()}
				</div>
			</div>
		</div>
	);
};

export default Add7;

// 342
