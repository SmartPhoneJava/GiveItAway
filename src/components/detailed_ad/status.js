import React, { useState, useEffect } from 'react';
import { Avatar, Button, InfoRow } from '@vkontakte/vkui';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import { STATUS_CHOSEN, STATUS_CLOSED, STATUS_ABORTED, COLOR_DEFAULT, COLOR_DONE, COLOR_CANCEL } from '../../const/ads';

export const statusWrapper = (block, color) => {
	color = color || COLOR_DEFAULT;
	return (
		<div
			style={{
				background: color,
				padding: '8px',
				position: 'absolute',
				widht: '100%',
				left: 0,
				right: 0,
				top: '0px',
			}}
		>
			{block}
		</div>
	);
};

export const showClosed = (isDealer, isAuthor) => {
	if (isAuthor) {
		return statusWrapper(<InfoRow className="status-text">Спасибо за помощь другим людям!</InfoRow>, COLOR_DONE);
	}
	if (isDealer) {
		return statusWrapper(<InfoRow className="status-text">Вещь перешла в ваше владение!</InfoRow>, COLOR_DONE);
	}
	return statusWrapper(<InfoRow className="status-text">Отдано!</InfoRow>, COLOR_DONE);
};

export const showAborted = (isDealer, isAuthor) => {
	if (isAuthor) {
		return statusWrapper(
			<InfoRow className="status-text">Вторая сторона отказалась от сделки</InfoRow>,
			COLOR_CANCEL
		);
	}
	if (isDealer) {
		return statusWrapper(<InfoRow className="status-text">Вы прервали сделку</InfoRow>, COLOR_CANCEL);
	}
	return statusWrapper(<InfoRow className="status-text">Передача не состоялась</InfoRow>, COLOR_CANCEL);
};

export const showChosen = (isDealer, isAuthor) => {
	if (isDealer && !isAuthor) {
		return statusWrapper(
			<>
				<InfoRow style={{ padding: '10px', color: 'rgb(200,200,200)', textAlign: 'center' }}>
					Автор решил отдать вещь вам. Подтвердите получение вещи после получения:
				</InfoRow>
				<div style={{ display: 'flex' }}>
					<Button
						stretched
						size="l"
						mode="commerce"
						onClick={() => {
							acceptDeal(
								deal.deal_id,
								(v) => {
									setStory(STORY_ADS);
								},
								(e) => {
									console.log('acceptDeal err', e);
								}
							);
						}}
						style
						style={{ marginRight: 8 }}
						before={<Icon24Done />}
					>
						Подтвердить
					</Button>
					<Button
						stretched
						size="l"
						mode="destructive"
						onClick={() => {
							denyDeal(
								deal.deal_id,
								(v) => {
									setStory(STORY_ADS);
								},
								(e) => {
									console.log('denyDeal error', e);
								}
							);
						}}
						style={{ marginRight: 8 }}
						before={<Icon24Cancel />}
					>
						Отклонить
					</Button>
				</div>
			</>,
			COLOR_DEFAULT
		);
	}
	if (!isAuthor) {
		return statusWrapper(
			<InfoRow
				style={{
					padding: '10px',
					color: 'rgb(200,200,200)',
					textAlign: 'center',
				}}
			>
				Автор назначил человека для передачи вещи
			</InfoRow>,
			COLOR_DEFAULT
		);
	} else {
		return statusWrapper(
			<div style={{ width: '100%', color: 'rgb(220,220,220)', fontSize: '13px', padding: '2px' }}>
				<div style={{ display: 'flex' }}>
					Ожидание подтверждения от
					<div style={{ display: 'flex' }} onClick={() => props.openUser(dealer.vk_id)}>
						<Avatar
							style={{
								marginLeft: '15px',
								marginRight: '4px',
							}}
							size={16}
							src={dealer ? dealer.photo_url : ''}
						/>
						{dealer ? dealer.name + ' ' + dealer.surname + '  ' : ''}
					</div>
				</div>
			</div>,
			COLOR_DEFAULT
		);
	}
};

export const showStatus = (status, isDealer, isAuthor) => {
	console.log('showStatus call me once pls', status, isDealer, isAuthor);
	switch (status) {
		case STATUS_CHOSEN:
			return showChosen(isDealer, isAuthor);
		case STATUS_CLOSED:
			return showClosed(isDealer, isAuthor);
		case STATUS_ABORTED:
			return showAborted(isDealer, isAuthor);
	}
	return null;
};
