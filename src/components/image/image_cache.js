import React, { useState, useEffect } from 'react';

import { HideUntilLoaded, AnimateOnChange } from 'react-animation';
import { Spinner } from '@vkontakte/vkui';

export const ImageCache = (props) => {
	const [image, setImage] = useState(<></>);
	useEffect(() => {
		var i = new Image();
		i.src = props.url;
		setImage(
			i.complete ? (
				<img src={props.url} className={props.className} />
			) : (
				<HideUntilLoaded
					animationIn="bounceIn"
					imageToLoad={props.url}
					Spinner={() => (
						<div style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
							<Spinner size="large" />
						</div>
					)}
				>
					<img src={props.url} className={props.className} />
				</HideUntilLoaded>
			)
		);
	}, [props.url]);

	return image;
};

export function withLoading(elem, size, animationIn) {
	const aIn = animationIn || 'bounceIn';
	const s = size || 'small';
	const spin = (
		<div
			style={{
				height: '100%',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Spinner size={s} />
		</div>
	);
	if (!elem) {
		return spin;
	}
	return (
		<HideUntilLoaded animationIn={aIn} imageToLoad={null} Spinner={() => spin}>
			{elem}
		</HideUntilLoaded>
	);
}

export function withLoadingIf(condition, elem, size, animationIn) {
	if (condition) {
		return withLoading(elem, size, animationIn);
	} else {
		return withLoading(null, size, animationIn);
	}
}
