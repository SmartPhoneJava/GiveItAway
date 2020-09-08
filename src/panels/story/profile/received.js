import React from 'react';

import './profile.css';
import { ReceivedPack } from './const';
import AdsPanel from './adsPanel';
import useAdReceived from '../adds/tabs/adds/useAdReceived';

const ReceivedPanel = (props) => {
	return (
		<AdsPanel
			cache={props.cache}
			pack={ReceivedPack}
			useGet={useAdReceived}
			profileID={props.profileID}
			openAd={props.openAd}
			header={
				<div style={{ display: 'flex' }}>
					{'Получено вещей -'}&nbsp;
					{props.amount}
				</div>
			}
			description="Список забранных предметов"
		/>
	);
};

export default ReceivedPanel;
