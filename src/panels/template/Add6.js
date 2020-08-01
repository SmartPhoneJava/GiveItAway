import React, { useState, useEffect } from 'react';

import { shortText } from './../../utils/short_text';

import { ImageCache } from '../../components/image/image_cache';

export const AdLight = (props) => {
	const { ad, imageURL, openAd } = props;
	const [image, setImage] = useState(<ImageCache className="light-tiled" url={imageURL} />);
	useEffect(() => {
		return () => setImage(null);
	}, []);

	return (
		<div onClick={openAd}>
			{image}
			<div style={{ padding: '2px' }}>{shortText(ad.header, 30)}</div>
		</div>
	);
};

// 329 -> 71
