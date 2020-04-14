import React, { useState } from 'react';
import {
	PanelHeaderSimple,
	Link,
	Avatar,
	Button,
	Cell,
	Header,
	Group,
	PanelHeaderButton,
	PanelHeaderContext,
	TabsItem,
	Tabs,
} from '@vkontakte/vkui';

import './notification.css';

function shortText(str, newLength) {
	if (str.length > newLength) {
		const s = str.slice(0, newLength);
		return s + '...';
	}
	return str;
}

function getHeader(props) {
	if (
		!props ||
		!props.notification ||
		!props.notification.payload ||
		!props.notification.payload.ad ||
		!props.notification.payload.ad.header
	) {
		return '';
	}
	const header = props.notification.payload.ad.header;
	return (
		<span
			onClick={() => props.openAd(props.notification.payload.ad)}
			style={{ marginRight: '3px', color: '#2F91FD' }}
		>
			{shortText(header, 30)}
		</span>
	);
}

function getImage(props) {
	if (
		!props ||
		!props.notification ||
		!props.notification.payload ||
		!props.notification.payload.ad ||
		!props.notification.payload.ad.pathes_to_photo
	) {
		return '';
	}
	const photoURL = props.notification.payload.ad.pathes_to_photo[0].PhotoUrl;
	return <Avatar size={48} src={photoURL} />;
}

function getAuthorHref(props) {
	if (
		!props ||
		!props.notification ||
		!props.notification.payload ||
		!props.notification.payload.author ||
		!props.notification.payload.author.vk_id
	) {
		return '';
	}
	const id = props.notification.payload.author.vk_id;
	const name = props.notification.payload.author.name;
	return (
		<span
			style={{ marginRight: '3px', color: '#2F91FD' }}
			onClick={() => props.openUser(props.notification.payload.author.vk_id)}
		>
			{name}
		</span>
	);
}

const Notification = (props) => {
	return (
		<Cell
			className="block_in"
			size="l"
			multiline="true"
			description={
				<div style={{ display: 'flex' }}>
					<div style={{ marginRight: '4px' }}>вчера в 19:31 в посте </div>
					<Link> Some_link</Link>
				</div>
			}
			before={getImage(props)}
			bottomContent={<Button>Добавить</Button>}
		>
			<div className="block">
				<div style={{ display: 'flex' }}>
					{getAuthorHref(props)}
					<div style={{ marginLeft: '4px' }}>упомянул Вас </div>
				</div>
				<div>А сколько лет сколько зим? </div>
			</div>
		</Cell>
	);
};

export const NotificationClose = (props) => {
	return (
		<Cell
			className="block_in"
			size="l"
			multiline="true"
			description={
				<div style={{ display: 'flex' }}>
					<div style={{ marginRight: '4px' }}>{props.notification.creation_date_time} </div>
				</div>
			}
			before={getImage(props)}
			// bottomContent={
			// 	<div style={{ display: 'flex' }}>
			// 		<Button mode="commerce" style={{ marginRight: '5px' }}>
			// 			Подтвердить
			// 		</Button>
			// 		<Button mode="destructive">Отклонить</Button>
			// 	</div>
			// }
		>
			<div className="block">
				Вы были указаны получателем вещи в {getHeader(props)}
			</div>
		</Cell>
	);
};

export const NotificationStatus = (props) => {
	return (
		<Cell
			className="block_in"
			size="l"
			multiline="true"
			description={
				<div style={{ display: 'flex' }}>
					<div style={{ marginRight: '4px' }}>{props.notification.creation_date_time} </div>
				</div>
			}
			before={getImage(props)}
		>
			<div className="block">Статус объявления {getHeader(props)} изменен</div>
		</Cell>
	);
};

export const NotificationRespond = (props) => {
	return (
		<Cell
			className="block_in"
			size="l"
			multiline="true"
			description={
				<div style={{ display: 'flex' }}>
					<div style={{ marginRight: '4px' }}>{props.notification.creation_date_time} </div>
				</div>
			}
			before={getImage(props)}
		>
			<div className="block">
				<div>
					{getAuthorHref(props)} откликнулся в {getHeader(props)}
				</div>
			</div>
		</Cell>
	);
};

export const NotificationFulFill = (props) => {
	return (
		<Cell
			onClick={() => props.openAd(props.notification.payload.ad)}
			className="block_in"
			size="l"
			multiline="true"
			description={
				<div style={{ display: 'flex' }}>
					<div style={{ marginRight: '4px' }}>{props.notification.creation_date_time} </div>
				</div>
			}
			before={getImage(props)}
		>
			<div className="block">
				<div>Объявление {getHeader(props)} успешно завершено</div>
			</div>
		</Cell>
	);
};

export const NotificationDeleted = (props) => {
	return (
		<Cell
			className="block_in"
			size="l"
			multiline="true"
			description={
				<div style={{ display: 'flex' }}>
					<div style={{ marginRight: '4px' }}>{props.notification.creation_date_time} </div>
				</div>
			}
			before={getImage(props)}
		>
			<div className="block">{getHeader(props)} удалён автором</div>
		</Cell>
	);
};

export const NotificationStatistics = (props) => {
	return (
		<Cell
			className="block_in"
			size="l"
			multiline="true"
			description={<div style={{ marginRight: '4px' }}>{props.notification.creation_date_time} </div>}
			before={getImage(props)}
		>
			<div className="block">
				<Link style={{ marginRight: '3px' }}> {getHeader(props)}</Link>
				просмотрели {props.notification.payload.views} раз
			</div>
		</Cell>
	);
};

export default Notification;

// 260 -> 241
