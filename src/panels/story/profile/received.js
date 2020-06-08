import React from 'react';

import './profile.css';
import { ReceivedPack } from './const';
import AdsPanel from './adsPanel';
import useAdReceived from '../adds/tabs/adds/useAdReceived';

const ReceivedPanel = (props) => {
	return <AdsPanel pack={ReceivedPack} useGet={useAdReceived} profileID={props.profileID} />;
};

export default ReceivedPanel
