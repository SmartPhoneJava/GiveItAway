import React from 'react';

import Icon20ArticleBoxOutline from '@vkontakte/icons/dist/20/article_box_outline';

import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';

import { shortText } from './../../utils/short_text';

import './addsTab.css';
import './Add7.css';
import { STATUS_ABORTED, STATUS_CLOSED, STATUS_CHOSEN } from '../../const/ads';

export function AdLight(ad, image, openAd) {
	return (
		<div onClick={openAd} className="light-main-left">
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

			{ad.status == STATUS_ABORTED ? (
				<div className="light-failed">
					<div className="on-img-text">
						<Icon16Clear style={{ marginRight: '5px' }} />
						Отменено
					</div>
				</div>
			) : (
				''
			)}
			{ad.status == STATUS_CLOSED ? (
				<div className="light-success">
					<div className="on-img-text">
						<Icon16CheckCircle style={{ marginRight: '5px' }} />
						Вещь отдана
					</div>
				</div>
			) : (
				''
			)}
			{ad.status == STATUS_CHOSEN ? (
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

// 329 -> 71
