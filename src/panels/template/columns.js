import React, { forwardRef } from 'react';

import './addsTab.css';

let keyI = 0;

const Columns = forwardRef((props, ref) => {
	const { needOneColumn } = props;
	const array = props.array || [];
	const columnsAmount = props.columnsAmount || 2;
	let components = [];

	console.log('arrayarrayarray', array.length, columnsAmount, needOneColumn);

	const isLast = (index) => {
		return array.length === index + 1;
	};

	return array.map((component, index) => {
		keyI += 1;
		if (needOneColumn) {
			return (
				<div key={keyI} ref={isLast(index) ? ref : null}>
					{component}
				</div>
			);
		}
		console.log('not only one');
		components = [
			...components,
			<div className="one-block" key={keyI} ref={isLast(index) ? ref : null}>
				{component}
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
});

export default Columns;

//47
