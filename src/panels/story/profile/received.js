import React from 'react';

import './profile.css';
import { ReceivedPack } from './const';
import AdsPanel from './adsPanel';
import useAdReceived from '../adds/tabs/adds/useAdReceived';

const ReceivedPanel = (props) => {
	return (
		<AdsPanel
			pack={ReceivedPack}
			useGet={useAdReceived}
			profileID={props.profileID}
			openAd={props.openAd}
			header={
				<div style={{ display: 'flex' }}>
					<p>{'Получено вещей -'}&nbsp;</p>
					<p>{props.amount}</p>
				</div>
			}
			description="Список забранных предметов"
		/>
	);
};

export default ReceivedPanel;
