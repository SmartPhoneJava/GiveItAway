import React from 'react';

import './addsTab.css';

let keyI = 0;

export const ColumnsFunc = (needOneColumn, array, refreshIndex, columnsAmount, ref) => {
	let components = [];

	console.log('arrayarrayarray', array.length, columnsAmount, needOneColumn);

	const isLast = (index) => {
		return array.length === index + 1;
	};

	const needRef1 = (index) => {
		const a = needRef(index);
		console.log('needRef', a);
	};

	const needRef = (index) => {
		if (array.length - refreshIndex > 0) {
			return array.length - refreshIndex === index + 1;
		}
		return array.length === index + 1;
	};

	const m = array.map((component, index) => {
		keyI += 1;
		let c = component;
		if (needOneColumn) {
			return (
				<div key={keyI} ref={needRef1(index) ? ref : null}>
					{c}
				</div>
			);
		}
		components = [
			...components,
			<div className="one-block" key={keyI} ref={needRef(index) ? ref : null}>
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
	return m;
};

//47
