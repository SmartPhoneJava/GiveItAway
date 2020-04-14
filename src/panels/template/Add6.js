import React, { useState, useEffect } from 'react';
import { Avatar, PanelHeaderButton, Link, Button, InfoRow, CellButton, Separator } from '@vkontakte/vkui';

import { AdDefault } from './AddMore2';

import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Chats from '@vkontakte/icons/dist/24/chats';
import Icon16Place from '@vkontakte/icons/dist/16/place';

import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';

import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Info from '@vkontakte/icons/dist/24/info';

import Icon24Hide from '@vkontakte/icons/dist/24/hide';

import Icon20ArticleBoxOutline from '@vkontakte/icons/dist/20/article_box_outline';

import Icon12Lock from '@vkontakte/icons/dist/12/lock';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';

import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import OpenActions from './components/actions';

import { getDetails } from './../../requests';

import { Draft } from './../../store/draft';

import './addsTab.css';
import './Add6.css';

function shortText(str, newLength) {
	if (str.length > newLength) {
		const s = str.slice(0, newLength);
		return s + '...';
	}
	return str;
}

export function AdLight(ad, image, openAd) {
	return (
		<div className="light-main-left" onClick={openAd}>
			<img src={image} className="light-tiled" />
			<div className="light-name">
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: '2px',
					}}
				>
					<Icon20ArticleBoxOutline /> {shortText(ad.header, 20)}
				</div>
			</div>

			{ad.status == 'aborted' ? (
				<div className="light-failed">
					<div className="on-img-text">
						<Icon16Clear style={{ marginRight: '5px' }} />
						Отменено
					</div>
				</div>
			) : (
				''
			)}
			{ad.status == 'closed' ? (
				<div className="light-success">
					<div className="on-img-text">
						<Icon16CheckCircle style={{ marginRight: '5px' }} />
						Вещь отдана
					</div>
				</div>
			) : (
				''
			)}
			{ad.status == 'chosen' ? (
				<div className="light-deal">
					<div
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							color: 'rgb(220,220,220)',
							fontSize: '12px',
							padding: '2px',
						}}
					>
						Ожидание ответа
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}

const Add6 = (props) => {
	const [ad, setAd] = useState(props.ad || AdDefault);
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

	function getFeedback(pm, comments) {
		if (pm) {
			return (
				<Icon24Chats
					onClick={() => {
						props.openAd();
					}}
					fill="var(--grey)"
				/>
			);
		}
		if (comments) {
			return (
				<Icon24CommentOutline
					onClick={() => {
						props.openAd();
					}}
					fill="var(--grey)"
				/>
			);
		}
		return (
			<Icon24Info
				onClick={() => {
					props.openAd();
				}}
				fill="var(--grey)"
			/>
		);
	}

	const image = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : '';

	function openSettings() {
		props.chooseAdd(ad);
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
		return isAuthor() ? (
			<PanelHeaderButton
				mode="primary"
				size="m"
				className="button"
				onClick={openSettings}
				disabled={ad.status !== 'offer' && ad.status !== 'chosen'}
			>
				<Icon28SettingsOutline fill="#2F91FD" />
			</PanelHeaderButton>
		) : (
			''
		);
	}

	function authorPanel() {
		return (
			<div
				style={{
					display: 'flex',
					paddingBottom: '10px',
					alignItems: 'center',
				}}
			>
				{!ad.anonymous ? (
					<Avatar
						onClick={() => {
							props.openUser(ad.author.vk_id);
						}}
						style={{
							marginRight: '5px',
						}}
						size={36}
						src={ad.author.photo_url}
					/>
				) : (
					''
				)}
				<div
					style={{
						display: 'block',
					}}
				>
					<div>{!ad.anonymous ? ad.author.name + ' ' + ad.author.surname : ''}</div>
					<div
						style={{
							color: 'grey',
						}}
					>
						{ad.creation_date}
					</div>
				</div>
			</div>
		);
	}

	function commonActions() {
		return (
			<div style={{ marginLeft: 'auto' }}>
				<PanelHeaderButton mode="secondary" className="button" size="m" disabled={ad.status !== 'offer'}>
					{getFeedback(ad.feedback_type == 'ls', ad.feedback_type == 'comments')}
				</PanelHeaderButton>
				<PanelHeaderButton mode="secondary" className="button" size="m">
					<Icon24ShareOutline fill="var(--grey)" />
				</PanelHeaderButton>
				{isAuthor() ? (
					''
				) : (
					<PanelHeaderButton mode="secondary" className="button" size="m">
						<Icon24LikeOutline fill="var(--grey)" />
					</PanelHeaderButton>
				)}
			</div>
		);
	}
	return (
		<div className="outter">
			<div
				className={
					ad.status == 'aborted'
						? 'tile tile-failed'
						: ad.status == 'closed'
						? 'tile tile-success'
						: ad.status == 'chosen'
						? 'tile tile-chosen'
						: ad.status == 'offer'
						? 'tile'
						: 'tile'
				}
			>
				<div onClick={props.openAd} className="main">
					<div className="main-left">
						<img src={image} className="tiled" />
						<div className="city">
							<div
								style={{ display: 'flex', color: 'rgb(200,200,200)', fontSize: '12px', padding: '2px' }}
							>
								<Icon16Place /> {ad.district}
							</div>
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
								<div className="hidden2">
									<div style={{ display: 'flex', color: 'white', fontSize: '12px', padding: '2px' }}>
										<Icon12Lock />
										Видно только вам
									</div>
								</div>
							) : (
								<div className="hidden">
									<div className="on-img-text">
										<Icon12Lock />
										Видно только вам
									</div>
								</div>
							)
						) : (
							''
						)}
					</div>
					<div>
						<div style={{ padding: '10px' }}>
							{authorPanel()}
							<InfoRow> {shortText(ad.header, 300)} </InfoRow>
						</div>
					</div>
				</div>
				<Separator />
				<div style={{ display: 'flex' }}>
					{controllButton()}
					{commonActions()}
				</div>
			</div>
		</div>
	);
};

export default Add6;

// 329
