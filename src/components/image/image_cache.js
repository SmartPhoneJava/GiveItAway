import React, { useState, useEffect } from 'react';

import { HideUntilLoaded, AnimateOnChange } from 'react-animation';
import { Spinner } from '@vkontakte/vkui';

export const AnimationGroup = (arr) => {
	return arr.map((v, i) => <AnimationChange mayTheSame={true} duration={100 + i * 50} controll={v} />);
};

export const AnimationChange = (props) => {
	const duration = props.duration || 300;
	const [first, setFirst] = useState(true);
	const [value, setValue] = useState(props.withSpinner ? <Spinner /> : <></>);
	const [invisible, setInvisible] = useState(!props.visibleFirst);
	useEffect(() => {
		let cleanup = false;
		if (first) {
			setFirst(false);
			if (props.ignoreFirst) {
				return;
			}
		}
		if (!props.mayTheSame && props.controll.key == value.key) {
			return;
		}
		setInvisible(true);
		setTimeout(() => {
			if (cleanup) {
				return;
			}

			setValue(props.controll);
			setInvisible(false);
		}, duration);
		return () => {
			cleanup = true;
		};
	}, [props.controll]);
	return (
		<div
			style={{
				...props.style,
				transition: `${duration / 1000}s`,
				opacity: `${invisible ? 0 : 1}`,
			}}
		>
			{value}
		</div>
	);
};

export const ImageCache = (props) => {
	const [image, setImage] = useState(<></>);
	const { url, className, onClick } = props;
	useEffect(() => {
		let cancel = false;
		var i = new Image();
		i.src = url;
		i.onload = function () {
			if (cancel) {
				return;
			}
			setImage(
				<img style={{ cursor: onClick ? 'pointer' : null }} src={url} className={className} onClick={onClick} />
			);
		};
		if (i.complete) {
			cancel = true;
		}
		setImage(
			i.complete ? (
				<img
					style={{ cursor: onClick ? 'pointer' : null }}
					srcSet={url}
					className={className}
					onClick={onClick}
				/>
			) : (
				<div className={props.spinnerClassName}>
					<Spinner size="medium" />
				</div>
			)
		);
		return () => {
			cancel = true;
		};
	}, [props.url]);

	return image;
	//return <AnimationChange duration={100} ignoreFirst={true} mayTheSame={true} controll={image} />;
};

export function withSpinner(wrapper, elem, size, spinStyle) {
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
	return wrapper(spin);
}

export function withLoading(elem, size, animationIn, spinStyle) {
	const aIn = animationIn || 'bounceIn';
	return withSpinner((spin) => elem, elem, size, spinStyle);
}

export function withLoadingIf(condition, elem, size, animationIn, spinStyle) {
	if (condition) {
		return withLoading(elem, size, animationIn, spinStyle);
	} else {
		return withLoading(null, size, animationIn, spinStyle);
	}
}

export function animateOnChange(elem, size, animation, spinStyle) {
	const anim = animation || 'bounce';
	return withSpinner(
		(spin) => (
			<AnimateOnChange style={{ width: '100%' }} animation={anim}>
				{elem}
			</AnimateOnChange>
		),
		elem,
		size,
		spinStyle
	);
}

export function animateOnChangeIf(condition, elem, size, animation, spinStyle) {
	if (condition) {
		return animateOnChange(elem, size, animation, spinStyle);
	} else {
		return animateOnChange(null, size, animation, spinStyle);
	}
}
