import React, { useState, useEffect } from 'react';
import { FormLayout, SelectMimicry, Group, Header, Link, Div } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { GetCategoryImage } from './Categories';
import { CategoryNo } from './const';

import { DraggableArea } from 'react-draggable-tags';

import ChangeIcon from './../../img/100/change_icon2.png';

import { randomColor } from 'randomcolor';

// https://www.npmjs.com/package/randomcolor

let i = 1;

const CategoriesLabel = (props) => {
	const { redux_form, inputData } = props;

	const notChoosenElement = props.notChoosenElement || {
		id: 1,
		content: CategoryNo,
	};
	const [tags, setTags] = useState([notChoosenElement]);

	const tag = (text, color, background, borderColor) => {
		const c = color || 'var(--accent)'; //'#ffffff';
		const b = background || null;
		// randomColor({
		// 	luminosity: 'dark',
		// });
		i++;
		return {
			id: i,
			content: text,
			color: c,
			background: b,
			borderColor: borderColor,
		};
	};

	useEffect(() => {
		const data = inputData[redux_form];
		if (!data) {
			return;
		}
		const p1 = tag('•', null, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
		const p2 = tag('•', null, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
		const s1 = data.category ? tag(data.category) : null;
		const s2 = data.subcategory ? tag(data.subcategory) : null;
		const s3 = data.incategory ? tag(data.incategory) : null;
		let str = s1 ? (s2 ? (s3 ? [s1, p1, s2, p2, s3] : [s1, p1, s2]) : [s1]) : [notChoosenElement];

		console.log('str is', str);
		setTags(str);
	}, [inputData[redux_form]]);

	return (
		<Group
			header={
				<Header mode="secondary" aside={<Link onClick={props.open}>Изменить</Link>}>
					Категория
				</Header>
			}
		>
			<div className="Simple">
				<DraggableArea
					tags={tags}
					render={({ tag, index }) => (
						<div
							className="row"
							onClick={props.open}
							style={{
								background: tag.background,
								color: tag.color,
								fontWeight: 600,
								borderColor: tag.borderColor,
							}}
						>
							{/* <img
							className="edit-tag"
							src={ChangeIcon}
							onClick={() => {
								switch (index) {
									case 0:
										props.open();
								}
							}}
						/> */}
							{tag.content}
						</div>
					)}
					onChange={(tags) => console.log(tags)}
				/>
			</div>
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesLabel);
