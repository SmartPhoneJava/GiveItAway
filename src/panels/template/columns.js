import React, { forwardRef, useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';

import { AnimateOnChange, AnimateGroup } from 'react-animation';

import './addsTab.css';

let keyI = 0;

const duration = 100;

const transitionStyles = {
	entering: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	entered: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	exiting: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
	exited: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
};

let thisI = 0;

const Columns = forwardRef((props, ref) => {
	const { needOneColumn } = props;
	const array = props.array || [];
	const refreshIndex = props.refreshIndex || 0;
	const columnsAmount = props.columnsAmount || 2;
	const [canShow, setCanShow] = useState(-1);
	let components = [];
	// let extraDesign = props.extraDesign || ((v)=>{extra})

	// useEffect(() => {
	// 	if (!props.loading) {
	// 		thisI = 0;
	// 	}
	// }, [props.loading]);

	console.log('arrayarrayarray', array.length, columnsAmount, needOneColumn);

	const isLast = (index) => {
		return array.length - refreshIndex === index + 1;
	};

	const m = array.map((component, index) => {
		// if (index == 0) {
		// 	var timer = setTimeout(() => {
		// 		console.log('thisI', thisI);
		// 		setCanShow(thisI);
		// 		thisI++;
		// 		if (thisI >= array.length) {
		// 			clearInterval(timer);
		// 		}
		// 	}, duration);
		// }
		keyI += 1;
		let c = (
			<Transition in={index > canShow} timeout={duration}>
				{(state) => (
					<div
						style={{
							...transitionStyles[state],
						}}
					>
						{component}
					</div>
				)}
			</Transition>
		);
		if (needOneColumn) {
			return (
				<div key={keyI} ref={isLast(index) ? ref : null}>
					{c}
				</div>
			);
		}
		components = [
			...components,
			<div className="one-block" key={keyI} ref={isLast(index) ? ref : null}>
				{c}
			</div>,
		];
		if ((index != 0 && index % columnsAmount == columnsAmount - 1) || isLast(index)) {
			const list = (
				<div key={keyI} className="flex-blocks">
					{components}
				</div>
			);
			components = [];

			return list;
		}
		return null;
	});
	// const popped = m.pop();
	return (
		<>
			<AnimateGroup animationIn="fadeInUp" animationOut="fadeOutDown" durationOut={500}>
				{m.map((s) => (
					<div>{s}</div>
				))}
			</AnimateGroup>
			{/* {popped} */}
		</>
	);
});

export const ColumnsFunc = ((needOneColumn, array, refreshIndex, columnsAmount, ref) => {
	let components = [];

	console.log('arrayarrayarray', array.length, columnsAmount, needOneColumn);

	const isLast = (index) => {
		return array.length - refreshIndex === index + 1;
	};

	const m = array.map((component, index) => {
		keyI += 1;
		let c = component
		if (needOneColumn) {
			return (
				<div key={keyI} ref={isLast(index) ? ref : null}>
					{c}
				</div>
			);
		}
		components = [
			...components,
			<div className="one-block" key={keyI} ref={isLast(index) ? ref : null}>
				{c}
			</div>,
		];
		if ((index != 0 && index % columnsAmount == columnsAmount - 1) || isLast(index)) {
			const list = (
				<div key={keyI} className="flex-blocks">
					{components}
				</div>
			);
			components = [];

			return list;
		}
		return null;
	});
	return m
});

export default Columns;

//47
