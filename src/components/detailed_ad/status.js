import React from 'react';
import { Avatar, Button, InfoRow, Spinner } from '@vkontakte/vkui';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import { AnimateOnChange } from 'react-animation';

import { STATUS_CHOSEN, STATUS_CLOSED, STATUS_ABORTED, COLOR_DEFAULT, COLOR_DONE, COLOR_CANCEL } from '../../const/ads';

export const statusWrapper = (block, color) => {
	const background = color || COLOR_DEFAULT;
	return (
		<div style={{ background }}>
			<div className="status-text">{block}</div>
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

export const showHidden = () => {
	let text = 'Объявление находится на модерации. Проверка не займет много времени, пожалуйста ожидайте!';

	return statusWrapper(textWrapper(text), 'var(--accent)');
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
				<InfoRow>Автор решил отдать вещь вам. Подтвердите получение вещи после получения:</InfoRow>
				<div style={{ display: width < 350 ? 'block' : 'flex' }}>
					<div style={{ padding: width < 350 ? '4px' : '8px', flex: 1 }}>
						<Button
							style={{ cursor: 'pointer' }}
							stretched
							size="l"
							mode="commerce"
							onClick={acceptClick}
							before={<Icon24Done />}
						>
							Подтвердить
						</Button>
					</div>
					<div style={{ padding: '8px', flex: 1 }}>
						<Button
							style={{ cursor: 'pointer' }}
							stretched
							size="l"
							mode="destructive"
							onClick={cancelClick}
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
		return statusWrapper(<InfoRow>Автор выбрал, кому передать вещь</InfoRow>, COLOR_DEFAULT);
	} else {
		return statusWrapper(
			<div
				style={{
					display: width > 500 ? 'flex' : 'block',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
				}}
			>
				<>Ожидание подтверждения получения вещи от</>
				<div style={{ padding: width > 500 && dealer ? null : '5px' }}>
					{dealer ? (
						<div className="status-waiting-panel" onClick={() => openUser(dealer.vk_id)}>
							<Avatar
								style={{
									marginLeft: '16px',
								}}
								size={20}
								src={dealer ? dealer.photo_url : ''}
							/>
							<div
								style={{
									marginLeft: '18px',
								}}
							>
								{dealer ? dealer.name + ' ' + dealer.surname + '  ' : ''}
							</div>
						</div>
					) : (
						<Spinner size="small" />
					)}
				</div>
			</div>,

			COLOR_DEFAULT
		);
	}
};

export const showStatus = (status, isDealer, isAuthor, dealer, hidden, acceptClick, cancelClick, openUser) => {
	if (hidden) {
		return showHidden();
	}
	console.log("status is", status)
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
