import React from 'react';

import './profile.css';
import { GivenPack } from './const';
import AdsPanel from './adsPanel';
import useAdGiven from '../adds/tabs/adds/useAdGiven';

const GivenPanel = (props) => {
	return (
		<AdsPanel
			cache={props.cache}
			pack={GivenPack}
			useGet={useAdGiven}
			profileID={props.profileID}
			openAd={props.openAd}
			header={
				<div style={{ display: 'flex' }}>
					{'Отдано вещей -'}&nbsp;
					{props.amount}
				</div>
			}
			description="Список переданных предметов"
		/>
	);
};

export default GivenPanel;
