import React, { useState, useEffect } from 'react';

import { HideUntilLoaded, AnimateOnChange } from 'react-animation';
import { Spinner } from '@vkontakte/vkui';

export const ImageCache = (props) => {
	const [image, setImage] = useState(<></>);
	const spinS = props.spinnerStyle || {};
	const { url, className, onClick } = props;
	useEffect(() => {
		var i = new Image();
		i.src = url;
		setImage(
			i.complete ? (
				<img srcSet={url} className={className} onClick={onClick} />
			) : (
				<HideUntilLoaded
					animationIn="bounceIn"
					imageToLoad={url}
					Spinner={() => (
						<div
							style={{
								height: '100%',
								width: '100%',
								justifyContent: 'center',
								alignItems: 'center',
								...spinS,
							}}
						>
							<Spinner size="large" />
						</div>
					)}
				>
					<img src={url} className={className} onClick={onClick} />
				</HideUntilLoaded>
			)
		);
	}, [props.url]);

	return image;
};

export function withLoading(elem, size, animationIn, spinStyle) {
	const aIn = animationIn || 'bounceIn';
	const s = size || 'small';
	const spStyle = spinStyle || {};
	const spin = (
		<div
			style={{
				...spStyle,
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

export function withLoadingIf(condition, elem, size, animationIn, spinStyle) {
	if (condition) {
		return withLoading(elem, size, animationIn, spinStyle);
	} else {
		return withLoading(null, size, animationIn, spinStyle);
	}
}
