import React from 'react';
import { TYPE_CHOICE, TYPE_AUCTION, STATUS_OFFER, STATUS_CHOSEN } from '../../const/ads';

import Deal200 from './../../img/ad_types/deal200.png';
import Lottery200 from './../../img/ad_types/lottery200.png';
import Auction200 from './../../img/ad_types/auction200.png';

import { K } from '../../panels/story/profile/const';
import { Cell, Link, Title } from '@vkontakte/vkui';

export function getAdTypeDescription(ad_type) {
	return ad_type == TYPE_CHOICE
		? 'Владелец вещи выбирает, кому он хочет передать вещь. После передачи, ' +
				'он получит столько кармы, сколько человек откликнулось на объявление. С получателя ' +
				'спишется столько кармы, сколько было указано рядом с его кнопкой "Откликнуться". ' +
				'Отдающий может изменить получателя в любой момент времени, пока сделка не подтверждена'
		: ad_type == TYPE_AUCTION
		? 'Каждый пользователь, откликаясь на объявление, делает' +
		  ' ставку, большую максимальной на 1 Карму. Владелец вещи ' +
		  'определяет, когда аукцион завершится. Получателем будет ' +
		  ' выбран тот, кто предложит наибольшую ставку на момент окончания аукциона' +
		  ' После передачи вещи с получающего будет списана сумма, ' +
		  'соответствующая его ставке. Она будет зачислена автору объявления. '
		: 'Получатель определяется случайным образом из списка откликнувшихся' +
		  'Запустить лотерею может только владелец вещи. Перезапустить ее невозможно.' +
		  'Получатель, определенный лотереей, сразу получит уведомление о победе';
}

// Определение получателя
export function getAdTypeAuthor(ad_type) {
	return ad_type == TYPE_CHOICE
		? 'Владелец вещи выбирает, кому он хочет передать вещь.'
		: ad_type == TYPE_AUCTION
		? 'Вещь достанется тому, кто предложит за нее наибольшую ставку.'
		: 'Получатель определяется среди откливнувшихся случайным образом.';
}

// Когда происходит выбор получателя
export function getAdTypeEnd(ad_type) {
	return ad_type == TYPE_CHOICE
		? null
		: ad_type == TYPE_AUCTION
		? 'Автор объявления может завершить аукцион, если была сделана хотя бы одна ставка.'
		: 'автор объявления может провести лотерею, если откликнулся хотя бы один человек.';
}

// Сколько кармы получит автор?
export function getAdTypeCarmaAuthor(ad_type) {
	return ad_type == TYPE_CHOICE
		? 'Автор получит столько кармы, сколько человек откликнулось на объявление.'
		: ad_type == TYPE_AUCTION
		? 'Автор получит столько камры, сколько будет предложено в максимальной ставке.'
		: 'Автор получит столько кармы, сколько человек откликнулось на объявление.';
}

// Сколько кармы потратит откливнушийся?
export function getAdTypeCarmaSub(ad_type) {
	return ad_type == TYPE_CHOICE
		? 'Стоимость получения вещи для каждого пользователя индивидуальна.' +
				' Чем больше вещей ты получаешь, тем больше кармы необходимо' +
				' отдать. Раз в месяц счетчик полученных вещей сбрасывается.'
		: ad_type == TYPE_AUCTION
		? 'Каждый пользователь, откликаясь на объявление, делает' +
		  ' ставку, большей максимальной на 1. Ставку можно отзывать' +
		  ' или повышать до тех пор, пока аукцион не завершится.'
		: 'Стоимость получения вещи для каждого пользователя индивидуальна.' +
		  ' Чем больше вещей ты получаешь, тем больше кармы необходимо' +
		  ' отдать. Раз в месяц счетчик полученных вещей сбрасывается.';
}

// Что будет с кармой, если я не стану получателем?
export function getAdTypeCarmaEnd(ad_type) {
	return (
		'Поставленная карма вернётся на счет пользователя, если получатель ' +
		'подтвердит/отвергнет получение вещи. Либо он может не ждать этого, ' +
		'просто отписавшись от объявления'
	);
}

export const getAdType = (ad_type) =>
	ad_type == TYPE_CHOICE ? 'Сделка' : ad_type == TYPE_AUCTION ? 'Аукцион' : 'Лотерея';

export const getAdTypePhoto = (ad_type) =>
	ad_type == TYPE_CHOICE ? Deal200 : ad_type == TYPE_AUCTION ? Auction200 : Lottery200;

export const AdHeader = (props) => {
	return (
		<Cell
			before={
				<img
					src={getAdTypePhoto(props.ad_type)}
					style={{ paddingTop: '4px', paddingRight: '8px', width: '32px', height: '32px' }}
				/>
			}
			asideContent={<Link onClick={props.onTypesClick}>Подробнее</Link>}
		>
			<Title level="2" weight="heavy">
				{getAdType(props.ad_type)}
			</Title>
		</Cell>
	);
};

export const isFinished = (st) => st !== STATUS_OFFER && st !== STATUS_CHOSEN;
