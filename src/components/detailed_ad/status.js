import React from 'react';
import { Avatar, Button, InfoRow } from '@vkontakte/vkui';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import { AnimateOnChange } from 'react-animation';

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

const textWrapper = (text) => {
	return (
		<InfoRow className="status-text">
			<AnimateOnChange>{text}</AnimateOnChange>
		</InfoRow>
	);
};

export const showClosed = (isDealer, isAuthor) => {
	let text = 'Отдано!';
	if (isAuthor) {
		text = 'Спасибо за помощь другим людям!';
	} else if (isDealer) {
		text = 'Вещь перешла в ваше владение!';
	}
	return statusWrapper(textWrapper(text), COLOR_DONE);
};

export const showAborted = (isDealer, isAuthor) => {
	let text = 'Передача не состоялась!';
	if (isAuthor) {
		text = 'Вторая сторона отказалась от получения';
	} else if (isDealer) {
		text = 'Не было получено подтверждение получения';
	}
	return statusWrapper(textWrapper(text), COLOR_CANCEL);
};

export const showChosen = (isDealer, isAuthor, dealer, acceptClick, cancelClick, openUser) => {
	const width = document.body.clientWidth;
	if (isDealer && !isAuthor) {
		return statusWrapper(
			<>
				<InfoRow style={{ padding: '10px', color: 'rgb(200,200,200)', textAlign: 'center' }}>
					Автор решил отдать вещь вам. Подтвердите получение вещи после получения:
				</InfoRow>
				<div
					style={{ display: width < 500 ? 'flex' : 'block', alignItems: 'center', justifyContent: 'center' }}
				>
					<div style={{ padding: '4px' }}>
						<Button
							stretched
							size="l"
							mode="commerce"
							onClick={acceptClick}
							style={{ marginRight: 8 }}
							before={<Icon24Done />}
						>
							Подтвердить
						</Button>
					</div>
					<div style={{ padding: '4px' }}>
						<Button
							stretched
							size="l"
							mode="destructive"
							onClick={cancelClick}
							style={{ marginRight: 8 }}
							before={<Icon24Cancel />}
						>
							Отклонить
						</Button>
					</div>
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
				<div style={{ display: width < 500 ? 'flex' : 'block' }}>
					Ожидание подтверждения от
					<div style={{ display: 'flex' }} onClick={() => openUser(dealer.vk_id)}>
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

export const showStatus = (status, isDealer, isAuthor, dealer, acceptClick, cancelClick, openUser) => {
	console.log('showStatus call me once pls', status, isDealer, isAuthor);
	switch (status) {
		case STATUS_CHOSEN:
			return showChosen(isDealer, isAuthor, dealer, acceptClick, cancelClick, openUser);
		case STATUS_CLOSED:
			return showClosed(isDealer, isAuthor);
		case STATUS_ABORTED:
			return showAborted(isDealer, isAuthor);
	}
	return null;
};
