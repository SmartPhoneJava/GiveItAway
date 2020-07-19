import React, { useState, useEffect } from 'react';

import Icon20ArticleBoxOutline from '@vkontakte/icons/dist/20/article_box_outline';

import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';

import { shortText } from './../../utils/short_text';

import './addsTab.css';
import './Add7.css';
import { STATUS_ABORTED, STATUS_CLOSED, STATUS_CHOSEN } from '../../const/ads';
import { ImageCache } from '../../components/image/image_cache';

export const AdLight = (props) => {
	const { ad, imageURL, openAd } = props;
	const [image] = useState(<ImageCache className="light-tiled" url={imageURL} />);

	return (
		<div onClick={openAd}>
			{image}
			<div style={{ padding: '2px' }}>{shortText(ad.header, 30)}</div>
			{/* {ad.status == STATUS_ABORTED ? (
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
				null
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
			)} */}
		</div>
	);
};

// 329 -> 71
