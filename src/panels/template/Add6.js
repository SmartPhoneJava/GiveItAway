import React, { useState, useEffect } from 'react';

import { shortText } from './../../utils/short_text';

import { ImageCache } from '../../components/image/image_cache';

export const AdLight = (props) => {
	const { ad, imageURL, openAd } = props;

	return (
		<div className="light-tiled-panel" onClick={openAd}>
			{<ImageCache className="light-tiled" spinnerClassName="light-tiled-spinner" url={imageURL} />}
			<div className="light-tiled-text">{shortText(ad.header, 30)}</div>
		</div>
	);
};

// 329 -> 71
